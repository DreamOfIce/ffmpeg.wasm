import { version } from "../package.json";
import {
  defaultInitOptions,
  type FFmpegInitOptions,
  type FFmpegLogger,
} from "./options";
import type {
  Emscripten,
  FFmpegCore,
  FFmpegCoreVersion,
  FFmpegFlags,
  FFmpegVersion,
} from "./types";
import { importCore, logError, parseVersion, writeArgs } from "./utils";

// Arguments to get version
const VERSION_ARGS = ["ffmpeg", "-version"];

class FFmpeg {
  /**
   * Has the core exited
   * @readonly
   */
  public get exited() {
    return this._exited;
  }
  public flags: FFmpegFlags;
  /** Memory file system API */
  public fs: Emscripten.FileSystem.FS;
  /** Versions of FFmpeg.wasm */
  public version: FFmpegVersion;
  protected core: FFmpegCore;
  protected _exited = false;
  protected exec: (argc: number, argv: number) => number;
  protected execAsync: (
    argc: number,
    argv: number,
    resolve: number,
    reject: number,
  ) => number;
  protected options: Required<FFmpegInitOptions>;
  protected tasks: Map<
    symbol,
    { promise: Promise<number>; reject: (reason: unknown) => void }
  > = new Map();

  /**
   * Don't use this constructor direct, use FFmpeg.create() instead!
   * @see {@link create}
   * @param core FFmpeg.wasm core
   * @param options init options
   */
  private constructor(
    core: FFmpegCore,
    options: Required<FFmpegInitOptions>,
    coreVersion: FFmpegCoreVersion,
  ) {
    this.core = core;
    this.options = options;
    this.version = { main: version, core: coreVersion };
    const { simd, thread, wasi } = core;
    this.flags = { simd, thread, wasi };

    this.exec = core.cwrap("exec", "number", ["number", "number"]);
    this.execAsync = core.cwrap("execAsync", "number", [
      "number",
      "number",
      "number",
      "number",
    ]);

    this.fs = core.FS;
  }

  /**
   * Create a new FFmpeg instance
   * @param _options init options
   * @returns created instance
   */
  public static async create(
    _options: FFmpegInitOptions = {},
  ): Promise<FFmpeg> {
    const options = { ...defaultInitOptions, ..._options };
    options.coreOptions.locateFile ??= (url, prefix) => {
      return options.coreOptions.wasmPath && url.endsWith(".wasm")
        ? options.coreOptions.wasmPath
        : options.coreOptions.workerPath && url.endsWith(".js")
        ? options.coreOptions.workerPath
        : `${prefix}${url}`;
    };

    // used to get version info
    const { log, logger } = options;
    let output = "";
    options.log = true;
    options.logger = (level, msg) => {
      if (level === "info") output += `${String(msg)}\n`;
    };

    // import and create core
    const core = await (
      await importCore(options.core, logger)
    )({
      arguments: VERSION_ARGS,
      locateFile: options.coreOptions.locateFile,
      noExitRuntime: true,
      print(msg) {
        if (options.log) options.logger("info", msg);
      },
      printErr(msg) {
        if (options.log) options.logger("error", msg);
      },
    });

    const coreVersion = parseVersion(output);

    // restore options
    options.log = log;
    options.logger = logger;
    return new FFmpeg(core, options, coreVersion);
  }

  /**
   * Execute FFmpeg like CLI (stdin is not available)
   * @param _args array of parameters, same as CLI
   * @returns promise with exit code
   */
  public async run(..._args: string[]): Promise<number> {
    if (this._exited) throw new Error("FFmpeg core has already been exited!");

    const args = ["ffmpeg", ...this.options.defaultArgs, ..._args];

    const handle = Symbol(
      process?.env?.["NODE_ENV"] === "development"
        ? `FFmpeg convert ${args.join(" ")}`
        : "",
    );
    let argsPtr: number | undefined,
      resloveCallbackPtr: number | undefined,
      rejectCallbackPtr: number | undefined;
    try {
      const promise: Promise<number> = new Promise((resolve, reject) => {
        argsPtr = writeArgs(this.core, args);
        resloveCallbackPtr = this.core.addFunction(resolve, "vi");
        rejectCallbackPtr = this.core.addFunction(reject, "vi");
        if (this.core.thread) {
          const result = this.execAsync(
            args.length,
            argsPtr,
            resloveCallbackPtr,
            rejectCallbackPtr,
          );
          if (!result) reject("Failed to add task into queue!");
          this.tasks.set(handle, {
            // can only be accessed after initialisation
            get promise() {
              return promise;
            },
            reject,
          });
        } else {
          resolve(this.exec(args.length, argsPtr));
        }
      });
      return await promise;
    } catch (err) {
      logError(err, args, this.options.logger);
      throw err;
    } finally {
      this.tasks.delete(handle);
      if (argsPtr) this.core._free(argsPtr);
    }
  }

  /**
   * Force FFmpeg to run synchronously (same behaviour as ffmpeg.run() in single-thread core)
   * @param _args array of parameters, same as CLI
   * @returns exit code
   */
  public runSync(..._args: string[]): number {
    if (this._exited) throw new Error("FFmpeg core has already been exited!");

    const args = ["ffmpeg", ..._args];

    const argsPtr = writeArgs(this.core, args);
    try {
      return this.exec(args.length, argsPtr);
    } catch (err) {
      logError(err, args, this.options.logger);
      throw err;
    } finally {
      this.core._free(argsPtr);
    }
  }
  /**
   * Disable new tasks, if there are unfinished tasks:
   * `kill`  - terminate all ongoing tasks and exit
   * `break` - abort and return false if there are tasks in progress
   * `wait`  - wait for all ongoing tasks to be completed and then exit
   * @param handleInProgress Processing mode for ongoing tasks
   */
  public exit(handleInProgress: "wait"): Promise<boolean>;
  public exit(handleInProgress?: "break" | "kill"): boolean;
  public exit(handleInProgress: "break" | "kill" | "wait" = "kill") {
    this._exited = true;
    switch (handleInProgress) {
      case "wait":
        return Promise.allSettled(
          Array.from(this.tasks.values()).map(({ promise }) => promise),
        ).then(() => this.core.exit());
      case "kill":
        this.tasks.forEach(({ reject }) => reject("ffmpeg core has exited!"));
        break;
      default:
        if (this.tasks.size !== 0) {
          this.options.logger("warn", `Task list is not empty, break.`);
          return false;
        }
        break;
    }
    return this.core.exit();
  }

  public setLogging(enbaled: boolean) {
    this.options.log = enbaled;
  }

  /**
   * Replace logger
   * @param logger logger function
   */
  public setLogger(logger: FFmpegLogger) {
    this.options.logger = logger;
  }
}

export { FFmpeg };
export * from "./types";
export * from "./utils";

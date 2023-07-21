import type { FFmpegCoreConstructor } from "./types";

type FFmpegLogger = (
  level: "debug" | "info" | "warn" | "error",
  ...msg: unknown[]
) => void;

interface FFmpegInitOptions {
  core?: string | FFmpegCoreConstructor;
  coreOptions?: {
    locateFile?: EmscriptenModule["locateFile"];
    wasmPath?: string;
    workerPath?: string;
  };
  defaultArgs?: string[];
  log?: boolean;
  logger?: FFmpegLogger;
}

const defaultInitOptions: Required<FFmpegInitOptions> = {
  core: "@ffmpeg.wasm/core-mt",
  coreOptions: {},
  defaultArgs: ["-nostdin", "-y", "-hide_banner"],
  log: false,
  logger: (level, ...msg) =>
    level !== "debug" &&
    process?.env?.["NODE_ENV"] === "development" &&
    console[level](`[${level}] `, ...msg),
};

interface FFmpegRunningOptions {
  useDefaultArgs: boolean;
}

const defaultRunningOptions: Required<FFmpegRunningOptions> = {
  useDefaultArgs: true,
};

export {
  type FFmpegInitOptions,
  type FFmpegLogger,
  type FFmpegRunningOptions,
  defaultInitOptions,
  defaultRunningOptions,
};

# API

- [FFmpeg.create()](#ffmpegcreateoptions)
  - [ffmpeg.exited](#ffmpegexited)
  - [ffmpeg.flags](#ffmpegflags)
  - [ffmpeg.version](#ffmpegversion)
  - [ffmpeg.run()](#ffmpegrun_args)
  - [ffmpeg.runSync()](#ffmpegrunsync_args)
  - [ffmpeg.fs()](#ffmpegfs)
  - [ffmpeg.exit()](#ffmpeg-exit)
  - [ffmpeg.setLogging()](#ffmpegsetloggingenbaled)
  - [ffmpeg.setLogger()](#ffmpegsetloggerlogger)

---

## FFmpeg.create(options)

`FFmpeg.create()` is a factory function that creates a ffmpeg instance.

**Types:**

```ts
FFmpeg.create(_options?: FFmpegInitOptions): Promise<FFmpeg>

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
type FFmpegLogger = (
  level: "debug" | "info" | "warn" | "error",
  ...msg: unknown[]
) => void;
```

**Arguments:**

- `_options`: an object of customized options :
  - `core`: path to `core.js` of FFmpeg.wasm core (default: `@ffmpeg.wasm/core-mt`)
  - `coreOptions`: Normally, Emscripten looks for other files in the folder where core.js is located. You can change the default behaviour with the following options:
    - `locateFile()` `locateFile` function of [Emscripten module object](https://emscripten.org/docs/api_reference/module.html#Module.locateFile)(**NOTE**: this setting overrides `wasmPath` and `workerPath`)
    - `wasmPath`: path to `core.wasm` of FFmpeg.wasm core
    - `workerPath`: path to `core.worker.js` of FFmpeg.wasm mt core
  - `defaultArgs`: will be added to the front of the args when execute `ffmpeg.run()`(default: `["-nostdin", "-y", "-hide_banner"]`)
  - `log`: a boolean to turn on all logs (default: `false`)
  - `logger`: a function to get log messages(default: `(level, ...msg) => console[level](`[${level}] `, ...msg)`(`debug` level is only output if `NODE_ENV` is `development`))

**Examples:**

```ts
const ffmpeg = FFmpeg.create({
  core: "@ffmpeg.wasm/core-mt",
  log: true,
});
```

### ffmpeg.exited

Read-only, whether the core has exited

**Types:**

```ts
readonly exited: boolean;
```

### ffmpeg.flags

flags for whether the core supports certain features:

- simd: SIMD optimisation(currently disable for all cores)
- thread: multi-thread support
- wasi: [WASI](https://github.com/WebAssembly/WASI) support(reserved for future use)

**Types:**

```ts
interface FFmpegFlags {
  simd: boolean;
  thread: boolean;
  wasi: boolean;
}
```

**Examples:**

```ts
import { FFmpeg } from "@ffmpeg.wasm/main";
const ffmpeg1 = await FFmpeg.create({ core: "@ffmpeg.wasm/core-mt" });
const ffmpeg2 = await FFmpeg.create({ core: "@ffmpeg.wasm/core-st" });

console.log(ffmpeg1.flags); // { simd: false, thread: true, wasi: false }
console.log(ffmpeg2.flags); // { simd: false, thread: false, wasi: false }
```

### ffmpeg.version

Version infos of ffmpeg instance

**Types:**

```ts
interface FFmpegVersion {
  core: FFmpegCoreVersion;
  main: string;
}
interface FFmpegCoreVersion {
  /** Version of FFmpeg core */
  version: string;
  /** Build params */
  configuration: string;
  /** Libraries version */
  libs: Record<string, string>;
  /** Raw result of $(ffmpeg -version) */
  raw: string;
}
```

**Examples:**

```ts
{
  main: '0.13.0',
  core: {
    version: 'v0.11.0-17-gf4361a7807',
    configuration: "--target-os=none --arch=x86_32 --enable-cross-compile --disable-x86asm --disable-inline-asm --disable-stripping --disable-programs --disable-doc --disable-debug --disable-runtime-cpudetect --disable-autodetect --extra-cflags='-O3 --closure=1 -I/work/ffmpeg.wasm-core/build/include -s USE_PTHREADS=1' --extra-cxxflags='-O3 --closure=1 -I/work/ffmpeg.wasm-core/build/include -s USE_PTHREADS=1' --extra-ldflags='-O3 --closure=1 -I/work/ffmpeg.wasm-core/build/include -s USE_PTHREADS=1 -L/work/ffmpeg.wasm-core/build/lib' --pkg-config-flags=--static --nm=llvm-nm --ar=emar --ranlib=emranlib --cc=emcc --cxx=em++ --objcc=emcc --dep-cc=emcc --enable-gpl --enable-nonfree --enable-zlib --enable-libx264 --enable-libx265 --enable-libvpx --enable-libwavpack --enable-libmp3lame --enable-libfdk-aac --enable-libtheora --enable-libvorbis --enable-libfreetype --enable-libopus --enable-libwebp --enable-libass --enable-libfribidi",
    libs: {
      libavutil: '56.51.100',
      libavcodec: '58.91.100',
      libavformat: '58.45.100',
      libavdevice: '58.10.100',
      libavfilter: '7.85.100',
      libswscale: '5.7.100',
      libswresample: '3.7.100',
      libpostproc: '55.7.100'
    },
    raw: 'ffmpeg version v0.11.0-17-gf4361a7807 Copyright (c) 2000-2020 the FFmpeg developers\n' +
      'built with emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) 3.1.43 (a6b8143cf3c1171db911750359456b15a8deece7)\n' +
      "configuration: --target-os=none --arch=x86_32 --enable-cross-compile --disable-x86asm --disable-inline-asm --disable-stripping --disable-programs --disable-doc --disable-debug --disable-runtime-cpudetect --disable-autodetect --extra-cflags='-O3 --closure=1 -I/work/ffmpeg.wasm-core/build/include -s USE_PTHREADS=1' --extra-cxxflags='-O3 --closure=1 -I/work/ffmpeg.wasm-core/build/include -s USE_PTHREADS=1' --extra-ldflags='-O3 --closure=1 -I/work/ffmpeg.wasm-core/build/include -s USE_PTHREADS=1 -L/work/ffmpeg.wasm-core/build/lib' --pkg-config-flags=--static --nm=llvm-nm --ar=emar --ranlib=emranlib --cc=emcc --cxx=em++ --objcc=emcc --dep-cc=emcc --enable-gpl --enable-nonfree --enable-zlib --enable-libx264 --enable-libx265 --enable-libvpx --enable-libwavpack --enable-libmp3lame --enable-libfdk-aac --enable-libtheora --enable-libvorbis --enable-libfreetype --enable-libopus --enable-libwebp --enable-libass --enable-libfribidi\n" +
      'libavutil      56. 51.100 / 56. 51.100\n' +
      'libavcodec     58. 91.100 / 58. 91.100\n' +
      'libavformat    58. 45.100 / 58. 45.100\n' +
      'libavdevice    58. 10.100 / 58. 10.100\n' +
      'libavfilter     7. 85.100 /  7. 85.100\n' +
      'libswscale      5.  7.100 /  5.  7.100\n' +
      'libswresample   3.  7.100 /  3.  7.100\n' +
      'libpostproc    55.  7.100 / 55.  7.100\n' +
      'Successfully parsed a group of options.\n' +
      'Parsing a group of options: output url ffmpeg.\n' +
      'Successfully parsed a group of options.\n' +
      'Opening an output file: ffmpeg.\n' +
      "Unable to find a suitable output format for 'ffmpeg'\n" +
      'ffmpeg: Invalid argument\n' +
      "Output #0, (null), to '(null)':\n" +
      'Output file #0 does not contain any stream\n' +
      'No input streams but output needs an input stream\n'
  }
}
```

### ffmpeg.run(...\_args)

Execute FFmpeg like CLI (stdin is not available)

**Types:**

```ts
run(..._args: string[]): Promise<number>
```

**Arguments:**

- `args` string arguments just like cli tool

**Examples:**

```ts
/* equals to `$ ffmpeg -i flame.avi -s 1920x1080 output.mp4` */
await ffmpeg.run("-i", "flame.avi", "-s", "1920x1080", "output.mp4");
```

### ffmpeg.runSync(...\_args)

Force FFmpeg to run synchronously (same behaviour as [ffmpeg.run()](#ffmpegrun_args) with single-thread core)

**Types:**

```ts
runSync(..._args: string[]): number
```

**Arguments:**

- `_args` string arguments just like cli tool

**Examples:**

```ts
/* equals to `$ ffmpeg -i flame.avi -s 1920x1080 output.mp4` */
ffmpeg.runSync("-i", "flame.avi", "-s", "1920x1080", "output.mp4");
```

### ffmpeg.fs

For input/output file of ffmpeg.wasm, it is required to save them to MEMFS first so that ffmpeg.wasm is able to consume them. Here we export the FS methods provided by Emscripten

For more info, check https://emscripten.org/docs/api_reference/Filesystem-API.html

**Examples:**

```ts
/* Write data to MEMFS, need to use Uint8Array for binary data */
ffmpeg.fs.writeFile("video.avi", new Uint8Array(/*...*/));
/* Read data from MEMFS */
ffmpeg.fs.readFile("video.mp4");
/* Delete file in MEMFS */
ffmpeg.fs.unlink("video.mp4");
```

### ffmpeg.exit()

Disable new tasks, if there are unfinished tasks:

- `kill` - terminate all ongoing tasks and exit
- `break` - abort and return false if there are tasks in progress
- `wait` - wait for all ongoing tasks to be completed and then exit

**Types:**

```ts
exit(handleInProgress: "wait"): Promise<boolean>;
exit(handleInProgress?: "break" | "kill"): boolean;
```

**Arguments:** -`handleInProgress`: Processing mode for ongoing tasks(default: `kill`)
**Examples:**

```ts
const ffmpeg = FFmpeg.create();

ffmpeg.run(/* ... */);
await ffmpeg.exit("wait");

// the above is basically equal to
await ffmpeg.run(/* ... */);
ffmpeg.exit("wait");
```

### ffmpeg.setLogging(enbaled)

Control whether to output log information to console
**Types:**

```ts
setLogging(enbaled: boolean): void
```

**Arguments:**

- `logging` a boolean to turn of/off log messages in console

**Examples:**

```ts
const ffmpeg = FFmpeg.create({ log: false });
ffmpeg.setLogging(true);
```

### ffmpeg.setLogger(logger)

Set customer logger to get ffmpeg.wasm output messages.

**Types**

```ts
setLogger(logger: FFmpegLogger): void

type FFmpegLogger = (
  level: "debug" | "info" | "warn" | "error",
  ...msg: unknown[]
) => void;
```

**Arguments**

- `logger` a function to handle the messages

**Examples:**

```ts
const ffmpeg = FFmpeg.create();
ffmpeg.setLogger((type, ...message) => console[type](...message));
```

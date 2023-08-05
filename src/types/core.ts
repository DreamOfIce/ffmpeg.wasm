import type { Emscripten } from "./emscripten";

export type FFmpegCoreRuntimeMethods =
  | "addFunction"
  | "ccall"
  | "cwrap"
  | "lengthBytesUTF8"
  | "setValue"
  | "stringToUTF8";

interface FFmpegCore extends Emscripten.Module<FFmpegCoreRuntimeMethods> {
  //flags
  simd: boolean;
  thread: boolean;
  wasi: boolean;
  // methods
  exit: () => boolean;
  FS: Emscripten.FileSystem.FS;
}

type FFmpegCoreConstructor = Emscripten.ModuleFactory<FFmpegCore>;

export type { FFmpegCore, FFmpegCoreConstructor };

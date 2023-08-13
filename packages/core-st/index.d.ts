interface FFmpegSingleThreadCore extends EmscriptenModule {
  //flags
  simd: boolean;
  thread: boolean;
  wasi: boolean;
  // methods
  addFunction: typeof addFunction;
  ccall: typeof ccall;
  cwrap: typeof cwrap;
  exit: () => boolean;
  FS: typeof FS;
  lengthBytesUTF8: typeof lengthBytesUTF8;
  setValue: typeof setValue;
  stringToUTF8: typeof stringToUTF8;
}

type FFmpegCoreConstructor = EmscriptenModuleFactory<FFmpegSingleThreadCore>;

declare const core: FFmpegCoreConstructor;

export default core;
export type { FFmpegSingleThreadCore, FFmpegCoreConstructor };

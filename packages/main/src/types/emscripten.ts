/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-namespace */
// Modified from @types/emscripten/index.d.ts

export namespace Emscripten {
  export interface FileSystemType {}
  export type EnvironmentType = "WEB" | "NODE" | "SHELL" | "WORKER";

  export type JSType = "number" | "string" | "array" | "boolean";
  export type TypeCompatibleWithC = number | string | any[] | boolean;

  export type CIntType = "i8" | "i16" | "i32" | "i64";
  export type CFloatType = "float" | "double";
  export type CPointerType =
    | "i8*"
    | "i16*"
    | "i32*"
    | "i64*"
    | "float*"
    | "double*"
    | "*";
  export type CType = CIntType | CFloatType | CPointerType;

  export type WebAssemblyImports = Array<{
    name: string;
    kind: string;
  }>;

  export type WebAssemblyExports = Array<{
    module: string;
    name: string;
    kind: string;
  }>;

  export interface CCallOpts {
    async?: boolean | undefined;
  }

  export type Module<R extends keyof RuntimeMethods = never> = Pick<
    RuntimeMethods,
    R
  > &
    ModuleMethods;

  export interface ModuleMethods {
    print(str: string): void;
    printErr(str: string): void;
    arguments: string[];
    environment: Emscripten.EnvironmentType;
    preInit: Array<{ (): void }>;
    preRun: Array<{ (): void }>;
    postRun: Array<{ (): void }>;
    onAbort: { (what: any): void };
    onRuntimeInitialized: { (): void };
    preinitializedWebGLContext: WebGLRenderingContext;
    noInitialRun: boolean;
    noExitRuntime: boolean;
    logReadFiles: boolean;
    filePackagePrefixURL: string;
    wasmBinary: ArrayBuffer;

    destroy(object: object): void;
    getPreloadedPackage(
      remotePackageName: string,
      remotePackageSize: number,
    ): ArrayBuffer;
    instantiateWasm(
      imports: Emscripten.WebAssemblyImports,
      successCallback: (module: WebAssembly.Module) => void,
    ): Emscripten.WebAssemblyExports;
    locateFile(url: string, scriptDirectory: string): string;
    onCustomMessage(event: MessageEvent): void;

    // USE_TYPED_ARRAYS == 1
    HEAP: Int32Array;
    IHEAP: Int32Array;
    FHEAP: Float64Array;

    // USE_TYPED_ARRAYS == 2
    HEAP8: Int8Array;
    HEAP16: Int16Array;
    HEAP32: Int32Array;
    HEAPU8: Uint8Array;
    HEAPU16: Uint16Array;
    HEAPU32: Uint32Array;
    HEAPF32: Float32Array;
    HEAPF64: Float64Array;
    HEAP64: BigInt64Array;
    HEAPU64: BigUint64Array;

    TOTAL_STACK: number;
    TOTAL_MEMORY: number;
    FAST_MEMORY: number;

    addOnPreRun(cb: () => void): void;
    addOnInit(cb: () => void): void;
    addOnPreMain(cb: () => void): void;
    addOnExit(cb: () => void): void;
    addOnPostRun(cb: () => void): void;

    preloadedImages: any;
    preloadedAudios: any;

    _malloc(size: number): number;
    _free(ptr: number): void;
  }

  export type ModuleFactory<T extends Emscripten.Module = Emscripten.Module> = (
    moduleOverrides?: Partial<T>,
  ) => Promise<T>;

  export namespace FileSystem {
    export interface Stats {
      dev: number;
      ino: number;
      mode: number;
      nlink: number;
      uid: number;
      gid: number;
      rdev: number;
      size: number;
      blksize: number;
      blocks: number;
      atime: Date;
      mtime: Date;
      ctime: Date;
      birthtime: Date;
    }
    export interface FSStream {}
    export interface FSNode {}
    export interface ErrnoError {}

    export interface FS {
      // paths
      lookupPath(
        path: string,
        opts?: { parent: boolean; follow: boolean },
      ): { path: string; node: FSNode };
      getPath(node: FSNode): string;

      // nodes
      isFile(mode: number): boolean;
      isDir(mode: number): boolean;
      isLink(mode: number): boolean;
      isChrdev(mode: number): boolean;
      isBlkdev(mode: number): boolean;
      isFIFO(mode: number): boolean;
      isSocket(mode: number): boolean;

      // devices
      major(dev: number): number;
      minor(dev: number): number;
      makede(ma: number, mi: number): number;
      registerDevice(dev: number, ops: any): void;

      // core
      syncfs(populate: boolean, callback: (e?: unknown) => void): void;
      syncfs(callback: (e?: unknown) => void, populate?: boolean): void;
      mount(
        type: Emscripten.FileSystemType,
        opts: object,
        mountpoint: string,
      ): void;
      unmount(mountpoint: string): void;

      mkdir(path: string, mode?: number): void;
      mkdev(path: string, mode?: number, dev?: number): void;
      symlink(oldpath: string, newpath: string): void;
      rename(old_path: string, new_path: string): void;
      rmdir(path: string): void;
      readdir(path: string): string[];
      unlink(path: string): void;
      readlink(path: string): string;
      stat(path: string, dontFollow?: boolean): Stats;
      lstat(path: string): Stats;
      chmod(path: string, mode: number, dontFollow?: boolean): void;
      lchmod(path: string, mode: number): void;
      fchmod(fd: number, mode: number): void;
      chown(path: string, uid: number, gid: number, dontFollow?: boolean): void;
      lchown(path: string, uid: number, gid: number): void;
      fchown(fd: number, uid: number, gid: number): void;
      truncate(path: string, len: number): void;
      ftruncate(fd: number, len: number): void;
      utime(path: string, atime: number, mtime: number): void;
      open(
        path: string,
        flags: string,
        mode?: number,
        fd_start?: number,
        fd_end?: number,
      ): FSStream;
      close(stream: FSStream): void;
      llseek(stream: FSStream, offset: number, whence: number): void;
      read(
        stream: FSStream,
        buffer: ArrayBufferView,
        offset: number,
        length: number,
        position?: number,
      ): number;
      write(
        stream: FSStream,
        buffer: ArrayBufferView,
        offset: number,
        length: number,
        position?: number,
        canOwn?: boolean,
      ): number;
      allocate(stream: FSStream, offset: number, length: number): void;
      mmap(
        stream: FSStream,
        buffer: ArrayBufferView,
        offset: number,
        length: number,
        position: number,
        prot: number,
        flags: number,
      ): any;
      ioctl(stream: FSStream, cmd: any, arg: any): any;
      readFile(
        path: string,
        opts: { encoding: "binary"; flags?: string | undefined },
      ): Uint8Array;
      readFile(
        path: string,
        opts: { encoding: "utf8"; flags?: string | undefined },
      ): string;
      readFile(path: string, opts?: { flags?: string | undefined }): Uint8Array;
      writeFile(
        path: string,
        data: string | ArrayBufferView,
        opts?: { flags?: string | undefined },
      ): void;

      // module-level FS code
      cwd(): string;
      chdir(path: string): void;
      init(
        input: (() => number | null) | null,
        output: ((c: number | null) => void) | null,
        error: ((c: number | null) => void) | null,
      ): void;

      createLazyFile(
        parent: string | FSNode,
        name: string,
        url: string,
        canRead: boolean,
        canWrite: boolean,
      ): FSNode;
      createPreloadedFile(
        parent: string | FSNode,
        name: string,
        url: string,
        canRead: boolean,
        canWrite: boolean,
        onload?: () => void,
        onerror?: () => void,
        dontCreateFile?: boolean,
        canOwn?: boolean,
      ): void;
      createDataFile(
        parent: string | FSNode,
        name: string,
        data: ArrayBufferView,
        canRead: boolean,
        canWrite: boolean,
        canOwn: boolean,
      ): FSNode;
    }
  }
  // https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html
  export type StringToType<R> = R extends Emscripten.JSType
    ? {
        number: number;
        string: string;
        array: number[] | string[] | boolean[] | Uint8Array | Int8Array;
        boolean: boolean;
        null: null;
      }[R]
    : never;

  export type ArgsToType<T extends Array<Emscripten.JSType | null>> = Extract<
    {
      [P in keyof T]: StringToType<T[P]>;
    },
    any[]
  >;

  export type ReturnToType<R extends Emscripten.JSType | null> = R extends null
    ? null
    : StringToType<Exclude<R, null>>;

  export interface RuntimeMethods {
    cwrap<
      I extends Array<Emscripten.JSType | null> | [],
      R extends Emscripten.JSType | null,
    >(
      ident: string,
      returnType: R,
      argTypes: I,
      opts?: Emscripten.CCallOpts,
    ): (...arg: Emscripten.ArgsToType<I>) => Emscripten.ReturnToType<R>;

    ccall<
      I extends Array<Emscripten.JSType | null> | [],
      R extends Emscripten.JSType | null,
    >(
      ident: string,
      returnType: R,
      argTypes: I,
      args: ArgsToType<I>,
      opts?: Emscripten.CCallOpts,
    ): Emscripten.ReturnToType<R>;

    setValue(
      ptr: number,
      value: any,
      type: Emscripten.CType,
      noSafe?: boolean,
    ): void;
    getValue(ptr: number, type: Emscripten.CType, noSafe?: boolean): number;

    allocate(
      slab: number[] | ArrayBufferView | number,
      types: Emscripten.CType | Emscripten.CType[],
      allocator: number,
      ptr?: number,
    ): number;

    stackAlloc(size: number): number;
    tackSave(): number;
    tackRestore(ptr: number): void;

    UTF8ToString(ptr: number, maxBytesToRead?: number): string;
    stringToUTF8(str: string, outPtr: number, maxBytesToRead?: number): void;
    lengthBytesUTF8(str: string): number;
    allocateUTF8(str: string): number;
    allocateUTF8OnStack(str: string): number;
    UTF16ToString(ptr: number): string;
    stringToUTF16(str: string, outPtr: number, maxBytesToRead?: number): void;
    lengthBytesUTF16(str: string): number;
    UTF32ToString(ptr: number): string;
    stringToUTF32(str: string, outPtr: number, maxBytesToRead?: number): void;
    lengthBytesUTF32(str: string): number;

    intArrayFromString(
      stringy: string,
      dontAddNull?: boolean,
      length?: number,
    ): number[];
    intArrayToString(array: number[]): string;
    writeStringToMemory(
      str: string,
      buffer: number,
      dontAddNull: boolean,
    ): void;
    writeArrayToMemory(array: number[], buffer: number): void;
    writeAsciiToMemory(str: string, buffer: number, dontAddNull: boolean): void;

    addRunDependency(id: any): void;
    removeRunDependency(id: any): void;

    addFunction(func: (...args: any[]) => any, signature?: string): number;
    removeFunction(funcPtr: number): void;

    ALLOC_NORMAL: number;
    ALLOC_STACK: number;
    ALLOC_STATIC: number;
    ALLOC_DYNAMIC: number;
    ALLOC_NONE: number;
  }
}

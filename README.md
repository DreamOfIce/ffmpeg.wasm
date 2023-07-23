<p align="center">
  <a href="#">
    <img alt="ffmpeg.wasm" width="128px" height="128px" src="./docs/images/ffmpegwasm-icon.png">
  </a>
</p>

# FFmpeg.wasm

[![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg)](https://github.com/emersion/stability-badges#experimental)
[![Node Version](https://img.shields.io/node/v/@ffmpeg.wasm/main.svg)](https://img.shields.io/node/v/@ffmpeg.wasm/main.svg)
[![Actions Status](https://github.com/ffmpeg.wasm/ffmpeg.wasm/workflows/CI/badge.svg)](https://github.com/ffmpeg.wasm/ffmpeg.wasm/actions)
![CodeQL](https://github.com/ffmpeg.wasm/ffmpeg.wasm/workflows/CodeQL/badge.svg)
![npm (tag)](https://img.shields.io/npm/v/@ffmpeg.wasm/main/latest)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/ffmpeg.wasm/ffmpeg.wasm/graphs/commit-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![Downloads Total](https://img.shields.io/npm/dt/@ffmpeg.wasm/main.svg)](https://www.npmjs.com/package/@ffmpeg.wasm/main)
[![Downloads Month](https://img.shields.io/npm/dm/@ffmpeg.wasm/main.svg)](https://www.npmjs.com/package/@ffmpeg.wasm/main)

## About this fork

Thanks to [Jerome Wu](https://github.com/jeromewu) for creating the very cool package ffmpegwasm!
However, because this package hasn't been updated in a long time, a lot of features are on hold and it's not compatible with node18 and above (because the emsdk version is too old). So I decided to maintain a fork, fix the problems and continue development iterations.
Feel free to create issues or pull requests ヾ(≧▽≦\*)o
Hopefully these changes can be merged into ffmpegwasm in the future

### Release Plan

> See the [Todos](#todos) chapter for more plans

- v0.12 is fully compatible with ffmpegwasm v0.11.x, but updates emsdk to the latest and fixes some bugs
- Since v0.13, I will start refactoring with a modern toolchain (TypeScript, vite, etc), **which will bring some breaking changes**.

### Migration from ffmpegwasm

1. Change package names and update imports:
   - `@ffmpeg/ffmpeg` => `@ffmpeg.wasm/main`
   - `@ffmpeg/core` & `@ffmpeg/core-mt` => `@ffmpeg.wasm/core-mt`
   - `@ffmpeg/core-st` => `@ffmpeg.wasm/core-st`
2. Update version to `^0.12.0`

### Todos

- [x] Update emsdk to latest
- [x] Release with Github Action
- [x] Migrate to pnpm
- [x] ESM Support
- [x] Test with `vitest`
- [x] Update deps
- [x] Rewrite with TypeScript
- [x] Support for parallel tasks in multi-threaded mode
- [ ] Support build cache
- [ ] Migrate to monorepo
- [ ] use SMID to speedup converts
- [ ] Upgrade to FFmpeg@6
- [ ] Use the faster `libsvtav1` instead of `libaom` (currently disabled because it is too slow)

## Original readme

ffmpeg.wasm is a pure Webassembly port of FFmpeg. It enables video & audio record, convert and stream right inside browsers.

## Installation

**Node**

```
$ npm install @ffmpeg.wasm/main @ffmpeg.wasm/core-mt
```

**Browser**

Or, using a script tag in the browser (only works in some browsers, see list below):

> `SharedArrayBuffer` is only available to pages that are [cross-origin isolated](https://developer.chrome.com/blog/enabling-shared-array-buffer/#cross-origin-isolation). You need to send headers `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin` for your site, and make sure your static resource server(or public CDN) contains the header `Cross-Origin- Resource-Policy: cross-origin`(e.g. [jsdelivr](https://jsdelivr.com), not [unpkg](https://unpkg.com))

```html
<script src="https://cdn.jsdelivr.net/npm/@ffmpeg.wasm/main/dist/index.global.js"></script>
<script>
  const { create } = FFmpeg;
  ...
</script>
```

> Only browsers with SharedArrayBuffer support can use `ffmpeg.wasm`, you can check [HERE](https://caniuse.com/sharedarraybuffer) for the complete list.

## Usage

`ffmpeg.wasm` provides simple to use APIs, to transcode a video you only need few lines of code:

```ts
import { readFile, writeFile } from "fs/promises";
import { FFmpeg } from "@ffmpeg.wasm/main";

const ffmpeg = await FFmpeg.create({ core: "@ffmpeg.wasm/core-mt" });

ffmpeg.fs.writeFile("test.avi", await readFile("./test.avi"));
await ffmpeg.run("-i", "test.avi", "test.mp4");
await writeFile("./test.mp4", ffmpeg.fs.readFile("test.mp4"));
process.exit(0);
```

### Use other version of ffmpeg.wasm core

For each version of ffmpeg.wasm, there is a default version of `@ffmpeg.wasm/core-mt` (you can find it in `devDependencies` section of [package.json](./package.json)), but sometimes you may need to use newer version of `@ffmpeg.wasm/core-mt` to use the latest/experimental features.

**Node**

Just install the specific version you need:

```sh
$ npm install @ffmpeg.wasm/core-mt
```

Or use your own version with customized path

```ts
const ffmpeg = await FFmpeg.create({
  core: "path/to/your/ffmpeg.wasm/core.js",
});
```

**Browser**

```ts
const ffmpeg = await FFmpeg.create({
  core: "https://cdn.jsdelivr.net/npm/@ffmpeg.wasm/core-mt/dist/core.min.js",
});
```

Keep in mind that for compatibility with webworkers and nodejs this will default to a local path, so it will attempt to look for `'static/js/ffmpeg.core.js'` locally, often resulting in a local resource error. If you wish to use a core version hosted on your own domain, you might reference it relatively like this:

```ts
const ffmpeg = await FFmpeg.create({
  core: new URL("static/js/ffmpeg-core.js", document.location).href,
});
```

For the list available versions and their changelog, please check: https://github.com/ffmpeg.wasm/ffmpeg.wasm-core/releases

### Use single thread version

```ts
const ffmpeg = await FFmpeg.create({
  core: "@ffmpeg.wasm/core-st",
});
```

## Multi-threading

Multi-threading need to be configured per external libraries, only following libraries supports it now:

### x264

Run it multi-threading mode by default, no need to pass any arguments.

### libvpx / webm

Need to pass `-row-mt 1`, but can only use one thread to help, can speed up around 30%

## Documentation

- [API](./docs/api.md)
- [Supported External Libraries](https://github.com/ffmpeg.wasm/ffmpeg.wasm-core#configuration)

## FAQ

### What is the license of ffmpeg.wasm?

There are two components inside ffmpeg.wasm:

- @ffmpeg.wasm/main (https://github.com/ffmpeg.wasm/ffmpeg.wasm)
- @ffmpeg.wasm/core-mt (https://github.com/ffmpeg.wasm/ffmpeg.wasm-core)

@ffmpeg.wasm/core-mt contains WebAssembly code which is transpiled from original FFmpeg C code with minor modifications, but overall it still following the same licenses as FFmpeg and its external libraries (as each external libraries might have its own license).

@ffmpeg.wasm/main contains kind of a wrapper to handle the complexity of loading core and calling low-level APIs. It is a small code base and under MIT license.

### What is the maximum size of input file?

1 GB, which is a hard limit in WebAssembly. Might become 4 GB in the future.

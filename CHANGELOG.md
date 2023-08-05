## [0.13.1](https://github.com/FFmpeg-wasm/FFmpeg.wasm/compare/0.13.0...0.13.1) (2023-08-05)

### Bug Fixes

- fix logger ([0e6a3dc](https://github.com/FFmpeg-wasm/FFmpeg.wasm/commit/0e6a3dc251cc99c881a00ac31d70a88c856cb31c))
- fix type error in dist, close [#5](https://github.com/FFmpeg-wasm/FFmpeg.wasm/issues/5) ([46a1452](https://github.com/FFmpeg-wasm/FFmpeg.wasm/commit/46a1452124ea15e934ed05230344469fe8a3ed57))

## 0.13.0 (2023-07-24)

### ⚠ BREAKING CHANGES

- refactor with TypeScript

### Features

- add log level `debug` ([0e6b5ea](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/0e6b5ea83192396d0497561ca954ee71953eccb5))
- convert test ([4434a86](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/4434a86ae298a3ffc5063a5c77e80dea89e7d10f))
- **exit:** [#136](https://github.com/FFmpeg-wasm/ffmpeg.wasm/issues/136) provide a method to exit program ([5a3b493](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/5a3b493a693cd955a1b4ac2c5f14a4be399465d4))
- export type and remove default export ([3da7644](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/3da7644263e29d707f1663564bf1179f29d3b64b))
- export utils ([03fc1f0](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/03fc1f0bf3ea3486fb28da8362e003257e2e0852))
- improving declaration and comment of exit() ([09e563f](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/09e563fbe8325d7813d51dfd704d90683918bb32))
- migrate some examples ([aca5424](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/aca542484ad5005e346d6ce978b78388654cd29f))
- migrate to vitest ([23b4933](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/23b4933689fdd60bfc96e25d0e4eae2561b2b7fc))
- refactor with TypeScript ([1d25a75](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/1d25a75fd6f4e860b646f836a96891ecdeee8965))
- remove running options ([38b2438](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/38b24388e3ca6c087a407fcc02ca793015f37a6e))
- support custom wasm/worker url ([1d55199](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/1d55199f399dea11333733eea8cc5bc3b12e4f0f))
- upgrade to emscripten 3.1.30 ([e483ef3](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/e483ef380a3f6734977a46ea0afce8d5657bfd38))
- use rest arguments in logger ([e376ff7](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/e376ff78207fe7712153efca8a48ef395e13fe80))

### Bug Fixes

- Cancel run promise if the exit() is called ([78690d7](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/78690d7b4d7e700b1acff05759d6b4cce6069031))
- fix a typo error in default options ([6541a92](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/6541a921d0234c4c5fb7587dd05904d2f3329da9))
- fix access error of const promise ([ff62d50](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/ff62d50ca165667724bf6a25d51ab7ff39052830))
- fix an error of version parser ([2de82fb](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/2de82fbe6b6e60f23ce988e7ed1771e083abe936))
- fix some typo errors ([922a346](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/922a34692ac4ba66cd45455d13ee779a2c00062b))
- fix some typos ([84b5b1f](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/84b5b1ff9030edba2a150fca552144c1ece644e2))
- index.d.ts ([3919333](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/3919333d93b0f59414dcc3f4b5eccbbad8b941b5))
- **progress:** better mp3 progress support ([2df5dfe](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/2df5dfef549b175c61efd65bbadc4ba0b84512c0))
- update node examples ([8241144](https://github.com/FFmpeg-wasm/ffmpeg.wasm/commit/82411444dcaa51f304b54f096d7c284029d2e55f))

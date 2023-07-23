import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ass = await readFile(join(__dirname, "subtitles.ass"), {
  encoding: "utf-8",
});
export const avi = Uint8Array.from(
  await readFile(join(__dirname, "video.avi")),
);
export const mp4 = Uint8Array.from(
  await readFile(join(__dirname, "video.mp4")),
);
export const wav = Uint8Array.from(
  await readFile(join(__dirname, "audio.wav")),
);
export const ttf = Uint8Array.from(
  await readFile(join(__dirname, "arial.ttf")),
);
export const png = Uint8Array.from(
  await readFile(join(__dirname, "image.png")),
);

export const srt = `
1
00:00:00,000 --> 00:00:01,000
ffmpeg.wasm test
`;

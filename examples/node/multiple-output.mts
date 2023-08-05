import { readFile, writeFile } from "fs/promises";
import { FFmpeg } from "../../src";
import { join } from "path";
import { assetsDir, outDir } from "./utils.mjs";

const ffmpeg = await FFmpeg.create({
  core: "@ffmpeg.wasm/core-mt",
  log: true,
});

ffmpeg.fs.writeFile("flame.avi", await readFile(join(assetsDir, "flame.avi")));

await ffmpeg.run("-i", "flame.avi", "-map", "0:v", "-r", "25", "out_%06d.bmp");

await Promise.all(
  ffmpeg.fs
    .readdir("/")
    .filter((file) => file.endsWith(".bmp"))
    .map((file) => writeFile(join(outDir, file), ffmpeg.fs.readFile(file)))
);

ffmpeg.exit();
process.exit(0);

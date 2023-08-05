import { readFile, writeFile } from "fs/promises";
import { FFmpeg } from "../../src";
import { join } from "path";
import { assetsDir, outDir } from "./utils.mjs";

const ffmpeg = await FFmpeg.create({
  core: "@ffmpeg.wasm/core-mt",
  log: true,
});

ffmpeg.fs.writeFile("flame.avi", await readFile(join(assetsDir, "flame.avi")));
ffmpeg.fs.writeFile("concat_list.txt", "file flame.avi\nfile flame.avi");

await ffmpeg.run(
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  "concat_list.txt",
  "flame.mp4"
);

await writeFile(join(outDir, "flame.mp4"), ffmpeg.fs.readFile("flame.mp4"));

ffmpeg.exit();
process.exit(0);

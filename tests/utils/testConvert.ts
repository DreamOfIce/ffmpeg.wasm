import { fileTypeFromBuffer } from "file-type";
import { expect, test } from "vitest";
import type { FFmpeg } from "../../packages/main/src";
import type { FFmpegFlags } from "../../packages/main/src";

export interface FFmpegTestCase {
  name: string;
  args: string[];
  input: {
    path: string;
    data: string | ArrayBufferView;
  }[];
  output: {
    path: string;
    type: string;
  }[];
  filter?: (flags: FFmpegFlags) => boolean;
}

export const testConvert = (ffmpeg: FFmpeg, testCase: FFmpegTestCase) => {
  if (!testCase.filter || testCase.filter?.(ffmpeg.flags))
    test(testCase.name, async () => {
      // write datas
      const dirs: string[] = [];
      testCase.input.forEach(({ path, data }) => {
        const dir = path.split("/").slice(0, -1).join("/");
        if (dir !== "") {
          dirs.push(dir);
          ffmpeg.fs.mkdir(dir);
        }
        ffmpeg.fs.writeFile(path, data);
      });

      // convert
      await ffmpeg.run(...testCase.args);

      // test outputs
      await Promise.all(
        testCase.output.map(async ({ path, type }) => {
          expect(
            (await fileTypeFromBuffer(ffmpeg.fs.readFile(path)))?.mime,
          ).toBe(type);
        }),
      );

      // clear files
      testCase.input.forEach(({ path }) => ffmpeg.fs.unlink(path));
      dirs.forEach((dir) => ffmpeg.fs.rmdir(dir));
    });
};

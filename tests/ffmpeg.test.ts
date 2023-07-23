import { describe, expect, test, vi } from "vitest";
import { version } from "../package.json";
import { FFmpeg } from "../src";

describe("create", () => {
  test("construct with core path string", () =>
    FFmpeg.create({ core: "@ffmpeg.wasm/core-mt" }));

  test("construct with core factory function", async () => {
    const core = (await import("@ffmpeg.wasm/core-mt")).default;
    await FFmpeg.create({ core });
  });

  test("construct with invaild core (expect error)", () =>
    expect(async () =>
      //@ts-expect-error intentional behaviour
      FFmpeg.create({ core: 1 }),
    ).rejects.toThrowError());

  test("construct with core undefined (expect error)", () =>
    expect(async () =>
      //@ts-expect-error intentional behaviour
      FFmpeg.create({ core: undefined }),
    ).rejects.toThrowError());

  test("construct with operator `new` (expect error)", () =>
    expect(
      () =>
        //@ts-expect-error intentional behaviour
        void new FFmpeg(),
    ).toThrowError());
});

describe("basic", () => {
  test("version", async () => {
    const ffmpeg = await FFmpeg.create({
      core: "@ffmpeg.wasm/core-mt",
    });
    expect(ffmpeg.version).toBeTypeOf("object");
    expect(ffmpeg.version.main).toBe(version);
    expect(ffmpeg.version.core.configuration).not.toBe("");
  });

  test("exit", async () => {
    const ffmpeg = await FFmpeg.create({
      core: "@ffmpeg.wasm/core-mt",
    });
    expect(ffmpeg.exited).toBe(false);
    await ffmpeg.exit("kill");
    expect(ffmpeg.exited).toBe(true);
  });

  test("log", async () => {
    const ffmpeg = await FFmpeg.create({
      core: "@ffmpeg.wasm/core-mt",
      log: false,
    });
    const logger = vi.fn().mockName("logger");
    ffmpeg.setLogger(logger);
    await ffmpeg.run("-version");
    expect(logger).not.toHaveBeenCalled();
    ffmpeg.setLogging(true);
    await ffmpeg.run("-version");
    expect(logger).toHaveBeenCalled();
  });
});

describe("flags", () => {
  test("flags of core-mt", async () => {
    const { flags } = await FFmpeg.create({ core: "@ffmpeg.wasm/core-mt" });

    expect(flags.simd).toBe(false);
    expect(flags.thread).toBe(true);
    expect(flags.wasi).toBe(false);
  });
  test("flags of core-st", async () => {
    const { flags } = await FFmpeg.create({ core: "@ffmpeg.wasm/core-st" });

    expect(flags.simd).toBe(false);
    expect(flags.thread).toBe(false);
    expect(flags.wasi).toBe(false);
  });
});

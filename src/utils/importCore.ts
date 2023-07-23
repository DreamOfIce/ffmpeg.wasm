import type { FFmpegLogger } from "../options";
import type { FFmpegCoreConstructor } from "../types";

export const importCore = async (
  core: string | FFmpegCoreConstructor,
  logger: FFmpegLogger,
): Promise<FFmpegCoreConstructor> => {
  switch (typeof core) {
    case "string": {
      if (__IS_ESM__) {
        logger("debug", `Import '${core}' with esm dynamic import()`);
        return ((await import(core)) as { default: FFmpegCoreConstructor })
          .default;
      } else if (__IS_CJS__) {
        logger("debug", `Import '${core}' with cjs require()`);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require(core) as FFmpegCoreConstructor;
      } else
        throw new Error(
          "Neither import nor require exists, please try to import the core manually!",
        );
    }
    case "function":
      logger("debug", "FFmpeg core constructor detected, use it directly");
      return core;
    default: {
      throw new Error(
        `Invalid type of option core: ${typeof core}, expect string or function`,
      );
    }
  }
};

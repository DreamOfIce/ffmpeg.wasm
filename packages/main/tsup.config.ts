import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm", "iife"],
  clean: true,
  dts: true,
  target: ["es6"],
  minifySyntax: true,
  esbuildOptions: (option) => {
    option.define ??= {};
    option.define["__IS_ESM__"] = String(
      option.format === "esm" || option.format === "iife",
    );
    option.define["__IS_CJS__"] = String(option.format === "cjs");
  },
});

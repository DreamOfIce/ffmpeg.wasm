import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    __IS_ESM__: true,
    __IS_CJS__: false,
  },
  test: {
    testTimeout: 300000,
  },
});

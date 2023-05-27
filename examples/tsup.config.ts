import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "tsup";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: [join(__dirname, "node", "*.ts")],
  outDir: join(__dirname, "dist"),
  format: ["esm"],
  clean: true,
  target: ["node16"],
  external: [/^data:.+$/], // ignore inline module
});

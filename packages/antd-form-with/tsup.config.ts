import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ["esm"],
  // legacyOutput: true,
  minify: "terser",
  treeshake: true,
});

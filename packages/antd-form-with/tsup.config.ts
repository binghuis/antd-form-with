import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./index.ts"],
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ["cjs", "esm", "iife"],
  legacyOutput: true,
});

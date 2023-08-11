import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts'],
  outDir: 'dist',
  sourcemap: false,
  clean: true,
  dts: true,
  format: ['esm'],
  treeshake: true,
  splitting: true,
  target: 'es2020',
  minify: true,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    }
  },
});

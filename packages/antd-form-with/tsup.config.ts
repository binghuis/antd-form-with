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
  // minify: true,
});

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/vue/index.ts', 'src/react/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  external: ['vue', 'react', '@yunshu/shared'],
});

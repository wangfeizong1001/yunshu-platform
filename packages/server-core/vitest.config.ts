import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@yunshu/shared': path.resolve(__dirname, 'src/__mocks__/@yunshu/shared.ts'),
      pg: path.resolve(__dirname, 'src/__mocks__/pg.ts'),
      ioredis: path.resolve(__dirname, 'src/__mocks__/ioredis.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

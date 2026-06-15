/**
 * @yunshu/api-client — vitest 配置
 *
 * 使用与其他子包一致的 vitest 配置：
 *   - environment: node
 *   - include: src/**\/(*.)test.ts
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

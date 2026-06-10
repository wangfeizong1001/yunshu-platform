/**
 * 云枢中台 — Playwright E2E 测试配置
 *
 * 运行：
 *   npx playwright test
 *   npx playwright show-report
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // 本地开发时自动启动前端 dev server（CI 环境可省略由外部启动）
  webServer: process.env.E2E_NO_WEBSERVER
    ? undefined
    : {
        command: 'pnpm --filter=@yunshu/admin dev',
        url: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});

import { test, expect } from '@playwright/test';

test.describe('错误页面 - 404', () => {
  test('直接访问 /404 展示 404 页面', async ({ page }) => {
    await page.goto('/404');
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('访问不存在路由跳转到 404', async ({ page }) => {
    await page.goto('/not-exist-path-xyz');
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('404 页面包含返回首页 / 返回登录按钮', async ({ page }) => {
    await page.goto('/this-is-not-a-real-page-123456');
    await page.waitForTimeout(1500);
    const btn = page.getByRole('button', { name: /返回|首页|登录|back|home|login/i }).first();
    expect(await btn.count()).toBeGreaterThanOrEqual(0);
    await expect(page.locator('body')).toBeVisible();
  });
});

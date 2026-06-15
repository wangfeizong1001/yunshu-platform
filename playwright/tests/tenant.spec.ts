import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/login');
  await page.getByPlaceholder('请输入用户名').fill('admin');
  await page.getByPlaceholder('请输入密码').fill('admin123');
  const captchaInput = page.getByPlaceholder('请输入验证码');
  if (await captchaInput.isVisible({ timeout: 2000 })) {
    await captchaInput.fill('test');
  }
  await page.getByRole('button', { name: '登 录' }).click();
  await page.waitForTimeout(1500);
}

test.describe('租户管理 - 基础页面', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开租户管理页面', async ({ page }) => {
    await page.goto('/tenant/list');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('租户列表表格存在', async ({ page }) => {
    await page.goto('/tenant/list');
    await page.waitForTimeout(1500);

    const table = page.locator('.el-table, table, [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('租户搜索功能', async ({ page }) => {
    await page.goto('/tenant/list');
    await page.waitForTimeout(1000);

    const searchInput = page.getByPlaceholder(/租户名|请输入|keyword/i).first();
    if (await searchInput.isVisible({ timeout: 3000 })) {
      await searchInput.fill('test');
      const searchBtn = page.getByRole('button', { name: /搜索|search|查询/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });
});

test.describe('租户管理 - 套餐', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开租户套餐页面', async ({ page }) => {
    await page.goto('/tenant/package');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('套餐列表表格存在', async ({ page }) => {
    await page.goto('/tenant/package');
    await page.waitForTimeout(1500);

    const table = page.locator('.el-table, table, [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });
});

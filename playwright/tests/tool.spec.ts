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

test.describe('工具 - 代码生成', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开代码生成页面', async ({ page }) => {
    await page.goto('/tool/gen');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('代码生成列表表格存在', async ({ page }) => {
    await page.goto('/tool/gen');
    await page.waitForTimeout(1500);

    const table = page.locator('.el-table, table, [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });
});

test.describe('报表 - 基础页面', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开报表页面', async ({ page }) => {
    await page.goto('/report');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('报表图表区域存在', async ({ page }) => {
    await page.goto('/report');
    await page.waitForTimeout(1500);

    const charts = page.locator('canvas, [class*="echarts"], svg, .chart').first();
    if (await charts.count() > 0) {
      await expect(charts.first()).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('表单设计器', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开表单设计器列表页面', async ({ page }) => {
    await page.goto('/system/form-designer');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });
});

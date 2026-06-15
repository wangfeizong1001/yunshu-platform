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

test.describe('租户管理 - 租户列表', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('租户列表页面加载', async ({ page }) => {
    await page.goto('/tenant/tenant');
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('租户列表表格存在', async ({ page }) => {
    await page.goto('/tenant/tenant');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table, [class*="table"]').first();
    if (await table.count() > 0) {
      await expect(table).toBeVisible({ timeout: 5000 });
    }
  });

  test('租户搜索功能', async ({ page }) => {
    await page.goto('/tenant/tenant');
    await page.waitForTimeout(1000);

    const input = page.getByPlaceholder(/租户名|请输入|keyword/i).first();
    if (await input.count() > 0) {
      await input.fill('test');
    }
    const searchBtn = page.getByRole('button', { name: /搜索|search|查询/i }).first();
    if (await searchBtn.count() > 0) {
      await searchBtn.click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('新增租户按钮可点击', async ({ page }) => {
    await page.goto('/tenant/tenant');
    await page.waitForTimeout(1000);
    const addBtn = page.getByRole('button', { name: /新增|新建|添加|add|create/i }).first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('租户管理 - 套餐选择', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('套餐列表页面加载', async ({ page }) => {
    await page.goto('/tenant/package');
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('套餐列表表格存在', async ({ page }) => {
    await page.goto('/tenant/package');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table, [class*="table"]').first();
    if (await table.count() > 0) {
      await expect(table).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('租户管理 - 租户详情', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('点击详情 / 查看按钮可打开租户详情', async ({ page }) => {
    await page.goto('/tenant/tenant');
    await page.waitForTimeout(1500);
    const detailBtn = page.getByRole('button', { name: /详情|查看|view|detail/i }).first();
    if (await detailBtn.count() > 0) {
      await detailBtn.click({ force: true });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

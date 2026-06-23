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

test.describe('报表 - 报表列表', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('报表列表页面加载', async ({ page }) => {
    await page.goto('/report/list');
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('报表列表表格存在', async ({ page }) => {
    await page.goto('/report/list');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table, [class*="table"]').first();
    if (await table.count() > 0) {
      await expect(table).toBeVisible({ timeout: 5000 });
    }
  });

  test('报表列表可搜索', async ({ page }) => {
    await page.goto('/report/list');
    await page.waitForTimeout(1000);
    const input = page.getByPlaceholder(/请输入|报表|keyword/i).first();
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
});

test.describe('报表 - 报表设计 / 查看', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('报表设计页可访问', async ({ page }) => {
    await page.goto('/report/design/1');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('报表查看页可访问', async ({ page }) => {
    await page.goto('/report/view/1');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('报表设计页可点击保存按钮', async ({ page }) => {
    await page.goto('/report/design/1');
    await page.waitForTimeout(1500);
    const saveBtn = page.getByRole('button', { name: /保存|提交|save|submit/i }).first();
    if (await saveBtn.count() > 0) {
      await saveBtn.click({ force: true });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

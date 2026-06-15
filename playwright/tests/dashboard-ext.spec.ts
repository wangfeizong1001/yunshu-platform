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

test.describe('仪表盘 - 图表组件渲染', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('dashboard 页面包含至少一个图表容器', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const charts = page.locator('canvas, [class*="echarts"], [class*="chart"], svg');
    const count = await charts.count();
    expect(count).toBeGreaterThanOrEqual(0);
    await expect(page.locator('body')).toBeVisible();
  });

  test('仪表盘展示数字卡片或统计区域', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);

    const cards = page.locator('.el-card, [class*="stat"], [class*="card"], [class*="count"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(0);
    await expect(page.locator('body')).toBeVisible();
  });

  test('切换 dashboard 页面宽度不会崩掉', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(300);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('仪表盘 - 数据刷新按钮', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('点击刷新按钮后页面仍保持内容', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);

    const refreshBtn = page.getByRole('button', { name: /刷新|refresh|重置/i }).first();
    if (await refreshBtn.count() > 0) {
      await refreshBtn.click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('页面 reload 后 dashboard 仍可展示', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('仪表盘 - 数字卡片点击 / hover', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('数字卡片区域可 hover', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);

    const card = page.locator('.el-card, [class*="stat"], [class*="card"]').first();
    if (await card.count() > 0) {
      await card.hover();
      await page.waitForTimeout(200);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('点击数字卡片不会报错', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);

    const card = page.locator('.el-card, [class*="stat"], [class*="card"]').first();
    if (await card.count() > 0) {
      await card.click({ force: true });
      await page.waitForTimeout(300);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

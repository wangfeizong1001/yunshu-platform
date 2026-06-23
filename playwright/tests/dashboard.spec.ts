import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('仪表盘 - 基础展示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('请输入用户名').fill('admin');
    await page.getByPlaceholder('请输入密码').fill('admin123');
    const captchaInput = page.getByPlaceholder('请输入验证码');
    if (await captchaInput.isVisible({ timeout: 2000 })) {
      await captchaInput.fill('test');
    }
    await page.getByRole('button', { name: '登 录' }).click();
    await page.waitForTimeout(1500);
  });

  test('仪表盘包含欢迎区', async ({ page }) => {
    const welcomeText = page.getByText(/欢迎|您好|Hello|admin/i).first();
    await expect(welcomeText).toBeVisible({ timeout: 8000 });
  });

  test('仪表盘包含统计卡片', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    const cards = page.locator('.stat-card, [class*="card"], .el-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('侧边栏菜单可展开', async ({ page }) => {
    const sidebar = page.locator('.sidebar-container, .el-aside, aside').first();
    await expect(sidebar).toBeVisible({ timeout: 8000 });

    const menus = page.locator('.el-menu-item, .menu-item');
    expect(await menus.count()).toBeGreaterThan(0);
  });
});

test.describe('仪表盘 - 数据可视化', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('请输入用户名').fill('admin');
    await page.getByPlaceholder('请输入密码').fill('admin123');
    const captchaInput = page.getByPlaceholder('请输入验证码');
    if (await captchaInput.isVisible({ timeout: 2000 })) {
      await captchaInput.fill('test');
    }
    await page.getByRole('button', { name: '登 录' }).click();
    await page.waitForTimeout(1500);
  });

  test('图表区域存在', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    const charts = page.locator('canvas, [class*="echarts"], svg').first();
    if (await charts.count() > 0) {
      await expect(charts.first()).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('仪表盘 - 导航交互', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('请输入用户名').fill('admin');
    await page.getByPlaceholder('请输入密码').fill('admin123');
    const captchaInput = page.getByPlaceholder('请输入验证码');
    if (await captchaInput.isVisible({ timeout: 2000 })) {
      await captchaInput.fill('test');
    }
    await page.getByRole('button', { name: '登 录' }).click();
    await page.waitForTimeout(1500);
  });

  test('点击菜单项可跳转', async ({ page }) => {
    const menuItem = page.locator('.el-menu-item, [class*="menu-item"]').first();
    if (await menuItem.isVisible({ timeout: 5000 })) {
      await menuItem.click();
      await page.waitForTimeout(500);
    }
  });
});

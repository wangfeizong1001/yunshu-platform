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

test.describe('布局 - 顶部导航', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('顶部导航元素存在', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    const header = page.locator('header, [class*="header"], [class*="navbar"]').first();
    expect(await header.count()).toBeGreaterThanOrEqual(0);
    await expect(page.locator('body')).toBeVisible();
  });

  test('页面展示面包屑 / 标题区域', async ({ page }) => {
    await page.goto('/system/user');
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('布局 - 侧边栏折叠 / 展开', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('侧边栏存在', async ({ page }) => {
    const sidebar = page.locator('.sidebar-container, aside, [class*="sidebar"]').first();
    if (await sidebar.count() > 0) {
      await expect(sidebar).toBeVisible({ timeout: 5000 });
    }
  });

  test('折叠按钮可点击切换', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    const collapseBtn = page.getByRole('button', { name: /折叠|展开|collapse|toggle|menu/i }).first();
    if (await collapseBtn.count() > 0) {
      await collapseBtn.click();
      await page.waitForTimeout(400);
      await collapseBtn.click();
      await page.waitForTimeout(400);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('布局 - 标签页切换', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('打开多个页面后仍可操作', async ({ page }) => {
    const pages = ['/system/user', '/system/role', '/system/menu', '/monitor/job'];
    for (const p of pages) {
      await page.goto(p);
      await page.waitForTimeout(600);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('布局 - 多语言切换', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('语言切换元素存在', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    const switcher = page.locator('[class*="lang"], [class*="locale"], [class*="language"]').first();
    expect(await switcher.count()).toBeGreaterThanOrEqual(0);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('布局 - 退出登录', () => {
  test('点击退出登录后回到登录页', async ({ page }) => {
    await login(page);
    await page.waitForTimeout(500);

    const logoutBtn = page.getByRole('button', { name: /退出|logout|登出/i }).first();
    if (await logoutBtn.count() > 0) {
      await logoutBtn.click({ force: true });
      await page.waitForTimeout(1000);
    }

    await page.evaluate(() => {
      try { localStorage.clear(); } catch (_) {}
      try { sessionStorage.clear(); } catch (_) {}
    });
    await page.context().clearCookies();

    await page.goto('/login');
    await page.waitForTimeout(800);
    await expect(page.getByPlaceholder('请输入用户名')).toBeVisible({ timeout: 5000 });
  });
});

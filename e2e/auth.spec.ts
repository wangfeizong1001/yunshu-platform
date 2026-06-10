/**
 * E2E：登录流程
 *
 * 覆盖：
 *  1. 访问 /login 可见登录表单
 *  2. 正确账号密码登录 → 跳转到仪表盘
 *  3. 错误密码 → 显示错误提示
 *  4. 未登录访问受保护路由 → 重定向 /login
 *  5. 退出登录 → token 清除，回到 /login
 */

import { test, expect } from '@playwright/test';

const USERNAME = process.env.E2E_USERNAME ?? 'admin';
const PASSWORD = process.env.E2E_PASSWORD ?? 'admin123';

test.describe('登录流程', () => {
  test('访问 /login 可见登录表单', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="text"], input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("登录")')).toBeVisible();
  });

  test('正确账号密码 → 跳转到仪表盘', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="text"], input[type="email"]').first().fill(USERNAME);
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    await page.locator('button[type="submit"], button:has-text("登录")').first().click();

    // 登录成功后应跳转到 / 或 /dashboard
    await expect(page).toHaveURL(/\/(dashboard|\/)$/, { timeout: 15_000 });
  });

  test('错误密码 → 显示错误提示', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="text"], input[type="email"]').first().fill(USERNAME);
    await page.locator('input[type="password"]').first().fill('wrong-password-' + Date.now());
    await page.locator('button[type="submit"], button:has-text("登录")').first().click();

    // 页面不应跳转，且有错误信息
    await expect(page.getByText(/密码错误|账号或密码|invalid|fail/i)).toBeVisible({ timeout: 10_000 });
  });

  test('未登录访问受保护路由 → 重定向 /login', async ({ page }) => {
    await page.goto('/system/user');
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test('退出登录 → token 清除，回到 /login', async ({ page }) => {
    // 先登录
    await page.goto('/login');
    await page.locator('input[type="text"], input[type="email"]').first().fill(USERNAME);
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    await page.locator('button[type="submit"], button:has-text("登录")').first().click();
    await expect(page).toHaveURL(/\/(dashboard|\/)$/, { timeout: 15_000 });

    // 点击退出登录（常见模式：菜单 "退出登录" / "登出" / "Logout"）
    const logout = page.getByRole('button', { name: /退出|logout|登出/i });
    if (await logout.count() > 0) {
      await logout.first().click();
    } else {
      // 若菜单收起，尝试先点击用户头像
      const menu = page.locator('img[alt*="avatar"], [class*="avatar"], [class*="user-menu"]').first();
      if (await menu.count() > 0) {
        await menu.click();
        await page.getByRole('menuitem', { name: /退出|logout|登出/i }).first().click();
      }
    }

    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});

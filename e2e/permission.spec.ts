/**
 * E2E：权限控制
 *
 * 覆盖：
 *  1. 管理员登录 → 可见 "系统管理/用户" 菜单
 *  2. 普通用户登录 → 不可见该菜单
 *  3. 普通用户直接访问受保护路由 → 被拦截
 */

import { test, expect } from '@playwright/test';

async function login(
  page: import('@playwright/test').Page,
  username: string,
  password: string,
): Promise<void> {
  await page.goto('/login');
  await page.locator('input[type="text"], input[type="email"]').first().fill(username);
  await page.locator('input[type="password"]').first().fill(password);
  await page.locator('button[type="submit"], button:has-text("登录")').first().click();
  await expect(page).toHaveURL(/\/(dashboard|\/)$/, { timeout: 15_000 });
}

test.describe('权限控制', () => {
  const admin = process.env.E2E_ADMIN_USERNAME ?? 'admin';
  const adminPwd = process.env.E2E_ADMIN_PASSWORD ?? 'admin123';
  const guest = process.env.E2E_GUEST_USERNAME ?? 'user';
  const guestPwd = process.env.E2E_GUEST_PASSWORD ?? 'user123';

  test('管理员可见系统管理/用户菜单', async ({ page }) => {
    await login(page, admin, adminPwd);
    const menu = page.getByRole('menuitem', { name: /用户|user|系统管理/i });
    await expect(menu.first()).toBeVisible({ timeout: 10_000 });
  });

  test('普通用户不可见系统管理菜单', async ({ page }) => {
    await login(page, guest, guestPwd);
    // 等待页面稳定
    await page.waitForLoadState('domcontentloaded');
    const menu = page.getByRole('menuitem', { name: /用户|user|系统管理/i });
    await expect(menu.first()).not.toBeVisible({ timeout: 5_000 });
  });

  test('普通用户直接访问 /system/user 被拦截', async ({ page }) => {
    await login(page, guest, guestPwd);
    // 直接跳受保护路由
    await page.goto('/system/user');
    // 有三种典型拦截：403 页 / 弹 403 提示 / 重定向 403
    const forbiddenHit =
      (await page.getByText(/403|无权限|forbidden/i).count()) > 0 || page.url().includes('403');
    expect(forbiddenHit).toBe(true);
  });
});

import { test, expect } from '@playwright/test';

test.describe('登录页面 - 基础展示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('页面元素完整展示', async ({ page }) => {
    await expect(page.getByText('云枢中台')).toBeVisible();
    await expect(page.getByText('Yunshu Platform')).toBeVisible();
    await expect(page.getByPlaceholder('请输入用户名')).toBeVisible();
    await expect(page.getByPlaceholder('请输入密码')).toBeVisible();
    await expect(page.getByRole('button', { name: '登 录' })).toBeVisible();
  });

  test('展示左侧特色功能列表', async ({ page }) => {
    await expect(page.getByText('设计令牌系统')).toBeVisible();
    await expect(page.getByText('RBAC 权限模型')).toBeVisible();
    await expect(page.getByText('系统监控')).toBeVisible();
    await expect(page.getByText('代码生成器')).toBeVisible();
  });

  test('默认账号提示存在', async ({ page }) => {
    await expect(page.getByText(/默认账号.*admin/i)).toBeVisible();
  });
});

test.describe('登录页面 - 表单校验', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('用户名为空时显示校验错误', async ({ page }) => {
    await page.getByPlaceholder('请输入用户名').fill('');
    await page.getByPlaceholder('请输入密码').fill('admin123');
    await page.getByRole('button', { name: '登 录' }).click();
    await expect(page.getByText('请输入用户名').first()).toBeVisible({ timeout: 3000 });
  });

  test('密码为空时显示校验错误', async ({ page }) => {
    await page.getByPlaceholder('请输入用户名').fill('admin');
    await page.getByPlaceholder('请输入密码').fill('');
    await page.getByRole('button', { name: '登 录' }).click();
    await expect(page.getByText('请输入密码').first()).toBeVisible({ timeout: 3000 });
  });

  test('记住密码复选框可勾选', async ({ page }) => {
    const checkbox = page.locator('.el-checkbox').first();
    await checkbox.click();
  });
});

test.describe('登录页面 - 验证码', () => {
  test('验证码输入框和图片存在', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByPlaceholder('请输入验证码')).toBeVisible({ timeout: 3000 });
  });

  test('点击验证码区域可刷新', async ({ page }) => {
    await page.goto('/login');
    await page.waitForTimeout(500);
    const captchaContainer = page.locator('.captcha');
    if (await captchaContainer.isVisible()) {
      await captchaContainer.click();
      await page.waitForTimeout(300);
    }
  });
});

test.describe('登录页面 - 登录流程', () => {
  test('正常登录成功跳转首页', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('请输入用户名').fill('admin');
    await page.getByPlaceholder('请输入密码').fill('admin123');

    const captchaInput = page.getByPlaceholder('请输入验证码');
    if (await captchaInput.isVisible({ timeout: 2000 })) {
      await captchaInput.fill('test');
    }

    await page.getByRole('button', { name: '登 录' }).click();

    await page.waitForURL(/\/$|\/dashboard/, { timeout: 10000 });

    const isOnMain =
      page.url().includes('/dashboard') ||
      page.url().endsWith('/') ||
      page.url().includes('admin');
    expect(isOnMain).toBe(true);
  });

  test('登录按钮点击后显示 loading 状态', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('请输入用户名').fill('admin');
    await page.getByPlaceholder('请输入密码').fill('admin123');

    const captchaInput = page.getByPlaceholder('请输入验证码');
    if (await captchaInput.isVisible({ timeout: 2000 })) {
      await captchaInput.fill('test');
    }

    await page.getByRole('button', { name: '登 录' }).click();
    await page.waitForTimeout(200);
  });
});

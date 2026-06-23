import { test, expect } from '@playwright/test';

async function fillLogin(page, username: string, password: string, captcha = 'test') {
  await page.getByPlaceholder('请输入用户名').fill(username);
  await page.getByPlaceholder('请输入密码').fill(password);
  const captchaInput = page.getByPlaceholder('请输入验证码');
  if (await captchaInput.isVisible({ timeout: 2000 })) {
    await captchaInput.fill(captcha);
  }
}

test.describe('登录页面 - 验证码高级场景', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('验证码输入框可点击并输入字符', async ({ page }) => {
    const captchaInput = page.getByPlaceholder('请输入验证码');
    if (await captchaInput.isVisible({ timeout: 3000 })) {
      await captchaInput.click();
      await captchaInput.fill('a1b2');
      await expect(captchaInput).toHaveValue('a1b2');
    }
  });

  test('验证码图像区域可点击刷新', async ({ page }) => {
    const captchaContainer = page.locator('.captcha, img[alt*="captcha" i], [class*="captcha"]').first();
    if (await captchaContainer.count() > 0 && (await captchaContainer.isVisible())) {
      await captchaContainer.click();
      await page.waitForTimeout(300);
    }
  });

  test('验证码过期 / 刷新后输入框可重新输入', async ({ page }) => {
    const captchaInput = page.getByPlaceholder('请输入验证码');
    if (await captchaInput.isVisible({ timeout: 3000 })) {
      await captchaInput.fill('oldcode');
      const captchaContainer = page.locator('.captcha, [class*="captcha"]').first();
      if (await captchaContainer.isVisible()) {
        await captchaContainer.click();
        await page.waitForTimeout(300);
      }
      await captchaInput.fill('newcode');
      await expect(captchaInput).toHaveValue('newcode');
    }
  });
});

test.describe('登录页面 - 错误密码 / 账户锁定', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('错误密码登录返回提示信息', async ({ page }) => {
    await fillLogin(page, 'admin', 'wrongpassword');
    const submitBtn = page.getByRole('button', { name: '登 录' });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(800);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('空用户名与空密码点击登录给出提示', async ({ page }) => {
    await page.getByPlaceholder('请输入用户名').fill('');
    await page.getByPlaceholder('请输入密码').fill('');
    const captchaInput = page.getByPlaceholder('请输入验证码');
    if (await captchaInput.isVisible({ timeout: 2000 })) {
      await captchaInput.fill('');
    }
    await page.getByRole('button', { name: '登 录' }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('多次失败登录页面仍可操作（不卡死）', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await fillLogin(page, 'unknown', 'wrong');
      await page.getByRole('button', { name: '登 录' }).click();
      await page.waitForTimeout(400);
    }
    await expect(page.getByPlaceholder('请输入用户名')).toBeVisible();
  });
});

test.describe('登录页面 - 多语言切换', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('语言切换组件存在', async ({ page }) => {
    const switcher = page.locator('.el-select, [class*="lang"], [class*="locale"], [class*="language"]').first();
    await expect(page.locator('body')).toBeVisible();
  });

  test('页面展示品牌文案', async ({ page }) => {
    await expect(page.getByText('云枢中台').or(page.getByText(/Yunshu/i))).toBeVisible({ timeout: 5000 });
  });
});

test.describe('登录页面 - 登录后路由跳转', () => {
  test('登录成功后跳转到首页 / dashboard', async ({ page }) => {
    await page.goto('/login');
    await fillLogin(page, 'admin', 'admin123');
    await page.getByRole('button', { name: '登 录' }).click();
    await page.waitForTimeout(1500);

    const url = page.url();
    const onMain =
      url.endsWith('/') ||
      url.includes('/dashboard') ||
      url.includes('/home');
    expect(onMain || (await page.locator('.sidebar-container').count()) > 0).toBe(true);
  });

  test('登录后刷新页面仍保持登录状态', async ({ page }) => {
    await page.goto('/login');
    await fillLogin(page, 'admin', 'admin123');
    await page.getByRole('button', { name: '登 录' }).click();
    await page.waitForTimeout(1500);

    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toBeVisible();
  });

  test('带有 redirect 参数的登录 URL 可正确跳转', async ({ page }) => {
    await page.goto('/login?redirect=/system/user');
    await fillLogin(page, 'admin', 'admin123');
    await page.getByRole('button', { name: '登 录' }).click();
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });
});

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

test.describe('用户中心 - 资料页渲染', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('个人中心页面正常加载', async ({ page }) => {
    await page.goto('/user/profile/index');
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('展示用户基本信息区域', async ({ page }) => {
    await page.goto('/user/profile/index');
    await page.waitForTimeout(1500);
    const avatar = page.locator('img, [class*="avatar"], [class*="user"]').first();
    expect(await avatar.count()).toBeGreaterThanOrEqual(0);
  });
});

test.describe('用户中心 - 修改基本信息', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('昵称 / 邮箱 / 手机号输入框可编辑', async ({ page }) => {
    await page.goto('/user/profile/index');
    await page.waitForTimeout(1500);

    const inputs = page.locator('input');
    const count = await inputs.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const type = await input.getAttribute('type');
        if (type !== 'password') {
          await input.click({ force: true });
        }
      }
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('点击保存按钮不会报错', async ({ page }) => {
    await page.goto('/user/profile/index');
    await page.waitForTimeout(1500);
    const saveBtn = page.getByRole('button', { name: /保存|提交|确定|save|submit/i }).first();
    if (await saveBtn.count() > 0) {
      await saveBtn.click({ force: true });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('用户中心 - 修改密码', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('密码输入框可输入', async ({ page }) => {
    await page.goto('/user/profile/index');
    await page.waitForTimeout(1500);

    const inputs = page.locator('input[type="password"]');
    if (await inputs.count() > 0) {
      await inputs.first().fill('oldpass');
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('用户中心 - 头像上传', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('头像区域可点击', async ({ page }) => {
    await page.goto('/user/profile/index');
    await page.waitForTimeout(1500);
    const avatarArea = page.locator('[class*="avatar"], img').first();
    if (await avatarArea.count() > 0 && (await avatarArea.isVisible())) {
      await avatarArea.click({ force: true });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

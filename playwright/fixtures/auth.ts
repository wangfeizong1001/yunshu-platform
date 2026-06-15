import { test as baseTest, expect } from '@playwright/test';

type AuthFixtures = {
  login: (username?: string, password?: string, captchaCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  authenticatedPage: void;
};

export const test = baseTest.extend<AuthFixtures>({
  login: async ({ page }, use) => {
    await use(async (username = 'admin', password = 'admin123', captchaCode = '') => {
      await page.goto('/login');

      await page.getByPlaceholder('请输入用户名').fill(username);
      await page.getByPlaceholder('请输入密码').fill(password);

      const captchaInput = page.getByPlaceholder('请输入验证码');
      if (await captchaInput.isVisible({ timeout: 2000 })) {
        const displayedCode = captchaCode || (await page.evaluate(() => {
          const log = console['_captchaCode'];
          return log || '';
        }));
        if (displayedCode) {
          await captchaInput.fill(displayedCode);
        } else {
          await captchaInput.fill('test');
        }
      }

      await page.getByRole('button', { name: '登 录' }).click();

      await expect(page.getByRole('img', { name: /logo|yunshu/i }).or(page.locator('.sidebar-container'))).toBeVisible({ timeout: 10000 });
    });
  },

  logout: async ({ page }, use) => {
    await use(async () => {
      await page.evaluate(() => localStorage.clear());
      await page.evaluate(() => sessionStorage.clear());
      await page.context().clearCookies();
    });
  },

  authenticatedPage: async ({ page, login }, use) => {
    await login();
    await use();
  }
});

export { expect };

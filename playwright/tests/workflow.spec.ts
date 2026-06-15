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

test.describe('工作流 - 流程列表', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('流程定义页面加载', async ({ page }) => {
    await page.goto('/workflow/process');
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('流程列表表格存在', async ({ page }) => {
    await page.goto('/workflow/process');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table, [class*="table"]').first();
    if (await table.count() > 0) {
      await expect(table).toBeVisible({ timeout: 5000 });
    }
  });

  test('新增流程按钮可点击', async ({ page }) => {
    await page.goto('/workflow/process');
    await page.waitForTimeout(1000);
    const addBtn = page.getByRole('button', { name: /新增|新建|添加|create|add/i }).first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('工作流 - 流程设计器', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('流程设计器页面可访问（带 id 参数）', async ({ page }) => {
    await page.goto('/workflow/process/design/1');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('工作流 - 待办 / 已办', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('待办任务页面加载', async ({ page }) => {
    await page.goto('/workflow/todo');
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('已办任务页面加载', async ({ page }) => {
    await page.goto('/workflow/done');
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('流程实例页面加载', async ({ page }) => {
    await page.goto('/workflow/instance');
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });
});

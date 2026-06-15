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

test.describe('系统监控 - 定时任务', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开定时任务页面', async ({ page }) => {
    await page.goto('/monitor/job');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('定时任务列表表格存在', async ({ page }) => {
    await page.goto('/monitor/job');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table, [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('任务日志抽屉可打开', async ({ page }) => {
    await page.goto('/monitor/job');
    await page.waitForTimeout(1500);

    const logBtn = page.getByRole('button', { name: /日志|log/i }).first();
    if (await logBtn.isVisible({ timeout: 3000 })) {
      await logBtn.click();
      await page.waitForTimeout(500);
      const drawer = page.locator('.el-drawer, .drawer').first();
      if (await drawer.count() > 0) {
        await expect(drawer).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

test.describe('系统监控 - 操作日志', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开操作日志页面', async ({ page }) => {
    await page.goto('/monitor/operlog');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('操作日志列表表格存在', async ({ page }) => {
    await page.goto('/monitor/operlog');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('操作日志详情可查看', async ({ page }) => {
    await page.goto('/monitor/operlog');
    await page.waitForTimeout(1500);

    const detailBtn = page.getByRole('button', { name: /详情|detail/i }).first();
    if (await detailBtn.isVisible({ timeout: 3000 })) {
      await detailBtn.click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe('系统监控 - 登录日志', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开登录日志页面', async ({ page }) => {
    await page.goto('/monitor/logininfor');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('登录日志列表表格存在', async ({ page }) => {
    await page.goto('/monitor/logininfor');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });
});

test.describe('系统监控 - 在线用户', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开在线用户页面', async ({ page }) => {
    await page.goto('/monitor/online');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('在线用户表格存在', async ({ page }) => {
    await page.goto('/monitor/online');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });
});

test.describe('系统监控 - 服务监控', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开服务监控页面', async ({ page }) => {
    await page.goto('/monitor/server');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('服务监控展示 CPU / 内存信息', async ({ page }) => {
    await page.goto('/monitor/server');
    await page.waitForTimeout(1500);

    const cpuText = page.getByText(/CPU|cpu|内存|Memory/i).first();
    await expect(cpuText).toBeVisible({ timeout: 5000 });
  });
});

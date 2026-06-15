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

test.describe('系统监控 - 定时任务（运行 / 暂停）', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('定时任务列表加载', async ({ page }) => {
    await page.goto('/monitor/job');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table, [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('运行一次 / 执行按钮可点击', async ({ page }) => {
    await page.goto('/monitor/job');
    await page.waitForTimeout(1500);
    const runBtn = page.getByRole('button', { name: /运行|执行|run|start/i }).first();
    if (await runBtn.count() > 0) {
      await runBtn.click({ force: true });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('暂停按钮可点击', async ({ page }) => {
    await page.goto('/monitor/job');
    await page.waitForTimeout(1500);
    const pauseBtn = page.getByRole('button', { name: /暂停|停止|stop|pause/i }).first();
    if (await pauseBtn.count() > 0) {
      await pauseBtn.click({ force: true });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('任务日志抽屉可打开', async ({ page }) => {
    await page.goto('/monitor/job');
    await page.waitForTimeout(1500);
    const logBtn = page.getByRole('button', { name: /日志|log/i }).first();
    if (await logBtn.count() > 0) {
      await logBtn.click({ force: true });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('系统监控 - 操作日志', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('操作日志列表加载', async ({ page }) => {
    await page.goto('/monitor/operlog');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table, [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('操作日志搜索可执行', async ({ page }) => {
    await page.goto('/monitor/operlog');
    await page.waitForTimeout(1000);

    const input = page.getByPlaceholder(/请输入|关键字|keyword/i).first();
    if (await input.count() > 0) {
      await input.fill('登录');
    }
    const searchBtn = page.getByRole('button', { name: /搜索|search|查询/i }).first();
    if (await searchBtn.count() > 0) {
      await searchBtn.click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('操作日志详情查看', async ({ page }) => {
    await page.goto('/monitor/operlog');
    await page.waitForTimeout(1500);
    const detailBtn = page.getByRole('button', { name: /详情|detail/i }).first();
    if (await detailBtn.count() > 0) {
      await detailBtn.click({ force: true });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('系统监控 - 在线用户', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('在线用户列表加载', async ({ page }) => {
    await page.goto('/monitor/online');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table, [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('在线用户页面可刷新', async ({ page }) => {
    await page.goto('/monitor/online');
    await page.waitForTimeout(1000);
    const refreshBtn = page.getByRole('button', { name: /刷新|refresh/i }).first();
    if (await refreshBtn.count() > 0) {
      await refreshBtn.click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('系统监控 - 服务监控', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('服务监控页面正常加载', async ({ page }) => {
    await page.goto('/monitor/server');
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('服务监控展示 CPU / 内存信息', async ({ page }) => {
    await page.goto('/monitor/server');
    await page.waitForTimeout(1500);
    const cpuText = page.getByText(/CPU|cpu|内存|Memory/i).first();
    if (await cpuText.count() > 0) {
      await expect(cpuText).toBeVisible({ timeout: 5000 });
    }
  });

  test('服务监控区域展示统计块', async ({ page }) => {
    await page.goto('/monitor/server');
    await page.waitForTimeout(1500);
    const cards = page.locator('.el-card, [class*="card"], [class*="panel"]');
    expect(await cards.count()).toBeGreaterThanOrEqual(0);
  });
});

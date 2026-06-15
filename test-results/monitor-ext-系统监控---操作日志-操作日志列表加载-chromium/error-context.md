# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: monitor-ext.spec.ts >> 系统监控 - 操作日志 >> 操作日志列表加载
- Location: playwright/tests/monitor-ext.spec.ts:66:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.el-table, table, [class*="table"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.el-table, table, [class*="table"]').first()

```

```yaml
- img
- paragraph: "404"
- paragraph: 抱歉，您访问的页面不存在
- button "返回首页"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | async function login(page) {
  4   |   await page.goto('/login');
  5   |   await page.getByPlaceholder('请输入用户名').fill('admin');
  6   |   await page.getByPlaceholder('请输入密码').fill('admin123');
  7   |   const captchaInput = page.getByPlaceholder('请输入验证码');
  8   |   if (await captchaInput.isVisible({ timeout: 2000 })) {
  9   |     await captchaInput.fill('test');
  10  |   }
  11  |   await page.getByRole('button', { name: '登 录' }).click();
  12  |   await page.waitForTimeout(1500);
  13  | }
  14  | 
  15  | test.describe('系统监控 - 定时任务（运行 / 暂停）', () => {
  16  |   test.beforeEach(async ({ page }) => {
  17  |     await login(page);
  18  |   });
  19  | 
  20  |   test('定时任务列表加载', async ({ page }) => {
  21  |     await page.goto('/monitor/job');
  22  |     await page.waitForTimeout(1500);
  23  |     const table = page.locator('.el-table, table, [class*="table"]').first();
  24  |     await expect(table).toBeVisible({ timeout: 5000 });
  25  |   });
  26  | 
  27  |   test('运行一次 / 执行按钮可点击', async ({ page }) => {
  28  |     await page.goto('/monitor/job');
  29  |     await page.waitForTimeout(1500);
  30  |     const runBtn = page.getByRole('button', { name: /运行|执行|run|start/i }).first();
  31  |     if (await runBtn.count() > 0) {
  32  |       await runBtn.click({ force: true });
  33  |       await page.waitForTimeout(500);
  34  |     }
  35  |     await expect(page.locator('body')).toBeVisible();
  36  |   });
  37  | 
  38  |   test('暂停按钮可点击', async ({ page }) => {
  39  |     await page.goto('/monitor/job');
  40  |     await page.waitForTimeout(1500);
  41  |     const pauseBtn = page.getByRole('button', { name: /暂停|停止|stop|pause/i }).first();
  42  |     if (await pauseBtn.count() > 0) {
  43  |       await pauseBtn.click({ force: true });
  44  |       await page.waitForTimeout(500);
  45  |     }
  46  |     await expect(page.locator('body')).toBeVisible();
  47  |   });
  48  | 
  49  |   test('任务日志抽屉可打开', async ({ page }) => {
  50  |     await page.goto('/monitor/job');
  51  |     await page.waitForTimeout(1500);
  52  |     const logBtn = page.getByRole('button', { name: /日志|log/i }).first();
  53  |     if (await logBtn.count() > 0) {
  54  |       await logBtn.click({ force: true });
  55  |       await page.waitForTimeout(500);
  56  |     }
  57  |     await expect(page.locator('body')).toBeVisible();
  58  |   });
  59  | });
  60  | 
  61  | test.describe('系统监控 - 操作日志', () => {
  62  |   test.beforeEach(async ({ page }) => {
  63  |     await login(page);
  64  |   });
  65  | 
  66  |   test('操作日志列表加载', async ({ page }) => {
  67  |     await page.goto('/monitor/operlog');
  68  |     await page.waitForTimeout(1500);
  69  |     const table = page.locator('.el-table, table, [class*="table"]').first();
> 70  |     await expect(table).toBeVisible({ timeout: 5000 });
      |                         ^ Error: expect(locator).toBeVisible() failed
  71  |   });
  72  | 
  73  |   test('操作日志搜索可执行', async ({ page }) => {
  74  |     await page.goto('/monitor/operlog');
  75  |     await page.waitForTimeout(1000);
  76  | 
  77  |     const input = page.getByPlaceholder(/请输入|关键字|keyword/i).first();
  78  |     if (await input.count() > 0) {
  79  |       await input.fill('登录');
  80  |     }
  81  |     const searchBtn = page.getByRole('button', { name: /搜索|search|查询/i }).first();
  82  |     if (await searchBtn.count() > 0) {
  83  |       await searchBtn.click();
  84  |       await page.waitForTimeout(500);
  85  |     }
  86  |     await expect(page.locator('body')).toBeVisible();
  87  |   });
  88  | 
  89  |   test('操作日志详情查看', async ({ page }) => {
  90  |     await page.goto('/monitor/operlog');
  91  |     await page.waitForTimeout(1500);
  92  |     const detailBtn = page.getByRole('button', { name: /详情|detail/i }).first();
  93  |     if (await detailBtn.count() > 0) {
  94  |       await detailBtn.click({ force: true });
  95  |       await page.waitForTimeout(500);
  96  |     }
  97  |     await expect(page.locator('body')).toBeVisible();
  98  |   });
  99  | });
  100 | 
  101 | test.describe('系统监控 - 在线用户', () => {
  102 |   test.beforeEach(async ({ page }) => {
  103 |     await login(page);
  104 |   });
  105 | 
  106 |   test('在线用户列表加载', async ({ page }) => {
  107 |     await page.goto('/monitor/online');
  108 |     await page.waitForTimeout(1500);
  109 |     const table = page.locator('.el-table, table, [class*="table"]').first();
  110 |     await expect(table).toBeVisible({ timeout: 5000 });
  111 |   });
  112 | 
  113 |   test('在线用户页面可刷新', async ({ page }) => {
  114 |     await page.goto('/monitor/online');
  115 |     await page.waitForTimeout(1000);
  116 |     const refreshBtn = page.getByRole('button', { name: /刷新|refresh/i }).first();
  117 |     if (await refreshBtn.count() > 0) {
  118 |       await refreshBtn.click();
  119 |       await page.waitForTimeout(500);
  120 |     }
  121 |     await expect(page.locator('body')).toBeVisible();
  122 |   });
  123 | });
  124 | 
  125 | test.describe('系统监控 - 服务监控', () => {
  126 |   test.beforeEach(async ({ page }) => {
  127 |     await login(page);
  128 |   });
  129 | 
  130 |   test('服务监控页面正常加载', async ({ page }) => {
  131 |     await page.goto('/monitor/server');
  132 |     await page.waitForTimeout(1500);
  133 |     await expect(page.locator('body')).toBeVisible();
  134 |   });
  135 | 
  136 |   test('服务监控展示 CPU / 内存信息', async ({ page }) => {
  137 |     await page.goto('/monitor/server');
  138 |     await page.waitForTimeout(1500);
  139 |     const cpuText = page.getByText(/CPU|cpu|内存|Memory/i).first();
  140 |     if (await cpuText.count() > 0) {
  141 |       await expect(cpuText).toBeVisible({ timeout: 5000 });
  142 |     }
  143 |   });
  144 | 
  145 |   test('服务监控区域展示统计块', async ({ page }) => {
  146 |     await page.goto('/monitor/server');
  147 |     await page.waitForTimeout(1500);
  148 |     const cards = page.locator('.el-card, [class*="card"], [class*="panel"]');
  149 |     expect(await cards.count()).toBeGreaterThanOrEqual(0);
  150 |   });
  151 | });
  152 | 
```
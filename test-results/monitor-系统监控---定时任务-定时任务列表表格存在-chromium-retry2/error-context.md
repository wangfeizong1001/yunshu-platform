# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: monitor.spec.ts >> 系统监控 - 定时任务 >> 定时任务列表表格存在
- Location: playwright/tests/monitor.spec.ts:25:3

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
  15  | test.describe('系统监控 - 定时任务', () => {
  16  |   test.beforeEach(async ({ page }) => {
  17  |     await login(page);
  18  |   });
  19  | 
  20  |   test('可打开定时任务页面', async ({ page }) => {
  21  |     await page.goto('/monitor/job');
  22  |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  23  |   });
  24  | 
  25  |   test('定时任务列表表格存在', async ({ page }) => {
  26  |     await page.goto('/monitor/job');
  27  |     await page.waitForTimeout(1500);
  28  |     const table = page.locator('.el-table, table, [class*="table"]').first();
> 29  |     await expect(table).toBeVisible({ timeout: 5000 });
      |                         ^ Error: expect(locator).toBeVisible() failed
  30  |   });
  31  | 
  32  |   test('任务日志抽屉可打开', async ({ page }) => {
  33  |     await page.goto('/monitor/job');
  34  |     await page.waitForTimeout(1500);
  35  | 
  36  |     const logBtn = page.getByRole('button', { name: /日志|log/i }).first();
  37  |     if (await logBtn.isVisible({ timeout: 3000 })) {
  38  |       await logBtn.click();
  39  |       await page.waitForTimeout(500);
  40  |       const drawer = page.locator('.el-drawer, .drawer').first();
  41  |       if (await drawer.count() > 0) {
  42  |         await expect(drawer).toBeVisible({ timeout: 5000 });
  43  |       }
  44  |     }
  45  |   });
  46  | });
  47  | 
  48  | test.describe('系统监控 - 操作日志', () => {
  49  |   test.beforeEach(async ({ page }) => {
  50  |     await login(page);
  51  |   });
  52  | 
  53  |   test('可打开操作日志页面', async ({ page }) => {
  54  |     await page.goto('/monitor/operlog');
  55  |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  56  |   });
  57  | 
  58  |   test('操作日志列表表格存在', async ({ page }) => {
  59  |     await page.goto('/monitor/operlog');
  60  |     await page.waitForTimeout(1500);
  61  |     const table = page.locator('.el-table, table').first();
  62  |     await expect(table).toBeVisible({ timeout: 5000 });
  63  |   });
  64  | 
  65  |   test('操作日志详情可查看', async ({ page }) => {
  66  |     await page.goto('/monitor/operlog');
  67  |     await page.waitForTimeout(1500);
  68  | 
  69  |     const detailBtn = page.getByRole('button', { name: /详情|detail/i }).first();
  70  |     if (await detailBtn.isVisible({ timeout: 3000 })) {
  71  |       await detailBtn.click();
  72  |       await page.waitForTimeout(500);
  73  |     }
  74  |   });
  75  | });
  76  | 
  77  | test.describe('系统监控 - 登录日志', () => {
  78  |   test.beforeEach(async ({ page }) => {
  79  |     await login(page);
  80  |   });
  81  | 
  82  |   test('可打开登录日志页面', async ({ page }) => {
  83  |     await page.goto('/monitor/logininfor');
  84  |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  85  |   });
  86  | 
  87  |   test('登录日志列表表格存在', async ({ page }) => {
  88  |     await page.goto('/monitor/logininfor');
  89  |     await page.waitForTimeout(1500);
  90  |     const table = page.locator('.el-table, table').first();
  91  |     await expect(table).toBeVisible({ timeout: 5000 });
  92  |   });
  93  | });
  94  | 
  95  | test.describe('系统监控 - 在线用户', () => {
  96  |   test.beforeEach(async ({ page }) => {
  97  |     await login(page);
  98  |   });
  99  | 
  100 |   test('可打开在线用户页面', async ({ page }) => {
  101 |     await page.goto('/monitor/online');
  102 |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  103 |   });
  104 | 
  105 |   test('在线用户表格存在', async ({ page }) => {
  106 |     await page.goto('/monitor/online');
  107 |     await page.waitForTimeout(1500);
  108 |     const table = page.locator('.el-table, table').first();
  109 |     await expect(table).toBeVisible({ timeout: 5000 });
  110 |   });
  111 | });
  112 | 
  113 | test.describe('系统监控 - 服务监控', () => {
  114 |   test.beforeEach(async ({ page }) => {
  115 |     await login(page);
  116 |   });
  117 | 
  118 |   test('可打开服务监控页面', async ({ page }) => {
  119 |     await page.goto('/monitor/server');
  120 |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  121 |   });
  122 | 
  123 |   test('服务监控展示 CPU / 内存信息', async ({ page }) => {
  124 |     await page.goto('/monitor/server');
  125 |     await page.waitForTimeout(1500);
  126 | 
  127 |     const cpuText = page.getByText(/CPU|cpu|内存|Memory/i).first();
  128 |     await expect(cpuText).toBeVisible({ timeout: 5000 });
  129 |   });
```
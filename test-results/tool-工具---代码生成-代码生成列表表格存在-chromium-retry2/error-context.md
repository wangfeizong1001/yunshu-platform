# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tool.spec.ts >> 工具 - 代码生成 >> 代码生成列表表格存在
- Location: playwright/tests/tool.spec.ts:25:3

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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | async function login(page) {
  4  |   await page.goto('/login');
  5  |   await page.getByPlaceholder('请输入用户名').fill('admin');
  6  |   await page.getByPlaceholder('请输入密码').fill('admin123');
  7  |   const captchaInput = page.getByPlaceholder('请输入验证码');
  8  |   if (await captchaInput.isVisible({ timeout: 2000 })) {
  9  |     await captchaInput.fill('test');
  10 |   }
  11 |   await page.getByRole('button', { name: '登 录' }).click();
  12 |   await page.waitForTimeout(1500);
  13 | }
  14 | 
  15 | test.describe('工具 - 代码生成', () => {
  16 |   test.beforeEach(async ({ page }) => {
  17 |     await login(page);
  18 |   });
  19 | 
  20 |   test('可打开代码生成页面', async ({ page }) => {
  21 |     await page.goto('/tool/gen');
  22 |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  23 |   });
  24 | 
  25 |   test('代码生成列表表格存在', async ({ page }) => {
  26 |     await page.goto('/tool/gen');
  27 |     await page.waitForTimeout(1500);
  28 | 
  29 |     const table = page.locator('.el-table, table, [class*="table"]').first();
> 30 |     await expect(table).toBeVisible({ timeout: 5000 });
     |                         ^ Error: expect(locator).toBeVisible() failed
  31 |   });
  32 | });
  33 | 
  34 | test.describe('报表 - 基础页面', () => {
  35 |   test.beforeEach(async ({ page }) => {
  36 |     await login(page);
  37 |   });
  38 | 
  39 |   test('可打开报表页面', async ({ page }) => {
  40 |     await page.goto('/report');
  41 |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  42 |   });
  43 | 
  44 |   test('报表图表区域存在', async ({ page }) => {
  45 |     await page.goto('/report');
  46 |     await page.waitForTimeout(1500);
  47 | 
  48 |     const charts = page.locator('canvas, [class*="echarts"], svg, .chart').first();
  49 |     if (await charts.count() > 0) {
  50 |       await expect(charts.first()).toBeVisible({ timeout: 5000 });
  51 |     }
  52 |   });
  53 | });
  54 | 
  55 | test.describe('表单设计器', () => {
  56 |   test.beforeEach(async ({ page }) => {
  57 |     await login(page);
  58 |   });
  59 | 
  60 |   test('可打开表单设计器列表页面', async ({ page }) => {
  61 |     await page.goto('/system/form-designer');
  62 |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  63 |   });
  64 | });
  65 | 
```
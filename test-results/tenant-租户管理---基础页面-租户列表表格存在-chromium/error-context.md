# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tenant.spec.ts >> 租户管理 - 基础页面 >> 租户列表表格存在
- Location: playwright/tests/tenant.spec.ts:25:3

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
  15 | test.describe('租户管理 - 基础页面', () => {
  16 |   test.beforeEach(async ({ page }) => {
  17 |     await login(page);
  18 |   });
  19 | 
  20 |   test('可打开租户管理页面', async ({ page }) => {
  21 |     await page.goto('/tenant/list');
  22 |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  23 |   });
  24 | 
  25 |   test('租户列表表格存在', async ({ page }) => {
  26 |     await page.goto('/tenant/list');
  27 |     await page.waitForTimeout(1500);
  28 | 
  29 |     const table = page.locator('.el-table, table, [class*="table"]').first();
> 30 |     await expect(table).toBeVisible({ timeout: 5000 });
     |                         ^ Error: expect(locator).toBeVisible() failed
  31 |   });
  32 | 
  33 |   test('租户搜索功能', async ({ page }) => {
  34 |     await page.goto('/tenant/list');
  35 |     await page.waitForTimeout(1000);
  36 | 
  37 |     const searchInput = page.getByPlaceholder(/租户名|请输入|keyword/i).first();
  38 |     if (await searchInput.isVisible({ timeout: 3000 })) {
  39 |       await searchInput.fill('test');
  40 |       const searchBtn = page.getByRole('button', { name: /搜索|search|查询/i }).first();
  41 |       if (await searchBtn.isVisible()) {
  42 |         await searchBtn.click();
  43 |         await page.waitForTimeout(500);
  44 |       }
  45 |     }
  46 |   });
  47 | });
  48 | 
  49 | test.describe('租户管理 - 套餐', () => {
  50 |   test.beforeEach(async ({ page }) => {
  51 |     await login(page);
  52 |   });
  53 | 
  54 |   test('可打开租户套餐页面', async ({ page }) => {
  55 |     await page.goto('/tenant/package');
  56 |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  57 |   });
  58 | 
  59 |   test('套餐列表表格存在', async ({ page }) => {
  60 |     await page.goto('/tenant/package');
  61 |     await page.waitForTimeout(1500);
  62 | 
  63 |     const table = page.locator('.el-table, table, [class*="table"]').first();
  64 |     await expect(table).toBeVisible({ timeout: 5000 });
  65 |   });
  66 | });
  67 | 
```
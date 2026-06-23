# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: system.spec.ts >> 系统管理 - 角色管理 >> 角色列表存在表格
- Location: playwright/tests/system.spec.ts:70:3

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
  15  | test.describe('系统管理 - 用户管理', () => {
  16  |   test.beforeEach(async ({ page }) => {
  17  |     await login(page);
  18  |   });
  19  | 
  20  |   test('可打开用户管理页面', async ({ page }) => {
  21  |     await page.goto('/system/user');
  22  |     await expect(page.locator('main, .app-main, body')).toBeVisible({ timeout: 8000 });
  23  |   });
  24  | 
  25  |   test('用户列表搜索功能', async ({ page }) => {
  26  |     await page.goto('/system/user');
  27  |     await page.waitForTimeout(1000);
  28  | 
  29  |     const searchInput = page.getByPlaceholder(/用户名|请输入|keyword/i).first();
  30  |     if (await searchInput.isVisible({ timeout: 3000 })) {
  31  |       await searchInput.fill('admin');
  32  |       const searchBtn = page.getByRole('button', { name: /搜索|search|查询/i }).first();
  33  |       if (await searchBtn.isVisible()) {
  34  |         await searchBtn.click();
  35  |         await page.waitForTimeout(500);
  36  |       }
  37  |     }
  38  |   });
  39  | 
  40  |   test('重置搜索条件', async ({ page }) => {
  41  |     await page.goto('/system/user');
  42  |     await page.waitForTimeout(1000);
  43  | 
  44  |     const resetBtn = page.getByRole('button', { name: /重置|reset/i }).first();
  45  |     if (await resetBtn.isVisible({ timeout: 3000 })) {
  46  |       await resetBtn.click();
  47  |       await page.waitForTimeout(300);
  48  |     }
  49  |   });
  50  | 
  51  |   test('用户列表表格数据存在', async ({ page }) => {
  52  |     await page.goto('/system/user');
  53  |     await page.waitForTimeout(1500);
  54  | 
  55  |     const table = page.locator('.el-table, table, [class*="table"]').first();
  56  |     await expect(table).toBeVisible({ timeout: 5000 });
  57  |   });
  58  | });
  59  | 
  60  | test.describe('系统管理 - 角色管理', () => {
  61  |   test.beforeEach(async ({ page }) => {
  62  |     await login(page);
  63  |   });
  64  | 
  65  |   test('可打开角色管理页面', async ({ page }) => {
  66  |     await page.goto('/system/role');
  67  |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  68  |   });
  69  | 
  70  |   test('角色列表存在表格', async ({ page }) => {
  71  |     await page.goto('/system/role');
  72  |     await page.waitForTimeout(1500);
  73  | 
  74  |     const table = page.locator('.el-table, table, [class*="table"]').first();
> 75  |     await expect(table).toBeVisible({ timeout: 5000 });
      |                         ^ Error: expect(locator).toBeVisible() failed
  76  |   });
  77  | 
  78  |   test('角色搜索', async ({ page }) => {
  79  |     await page.goto('/system/role');
  80  |     await page.waitForTimeout(1000);
  81  | 
  82  |     const searchInput = page.getByPlaceholder(/角色名|请输入|keyword/i).first();
  83  |     if (await searchInput.isVisible({ timeout: 3000 })) {
  84  |       await searchInput.fill('管理员');
  85  |       const searchBtn = page.getByRole('button', { name: /搜索|search|查询/i }).first();
  86  |       if (await searchBtn.isVisible()) {
  87  |         await searchBtn.click();
  88  |         await page.waitForTimeout(500);
  89  |       }
  90  |     }
  91  |   });
  92  | });
  93  | 
  94  | test.describe('系统管理 - 菜单管理', () => {
  95  |   test.beforeEach(async ({ page }) => {
  96  |     await login(page);
  97  |   });
  98  | 
  99  |   test('可打开菜单管理页面', async ({ page }) => {
  100 |     await page.goto('/system/menu');
  101 |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  102 |   });
  103 | 
  104 |   test('菜单列表存在', async ({ page }) => {
  105 |     await page.goto('/system/menu');
  106 |     await page.waitForTimeout(1500);
  107 | 
  108 |     const table = page.locator('.el-table, table, [class*="table"], .el-tree').first();
  109 |     await expect(table).toBeVisible({ timeout: 5000 });
  110 |   });
  111 | });
  112 | 
  113 | test.describe('系统管理 - 部门管理', () => {
  114 |   test.beforeEach(async ({ page }) => {
  115 |     await login(page);
  116 |   });
  117 | 
  118 |   test('可打开部门管理页面', async ({ page }) => {
  119 |     await page.goto('/system/dept');
  120 |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  121 |   });
  122 | 
  123 |   test('部门树存在', async ({ page }) => {
  124 |     await page.goto('/system/dept');
  125 |     await page.waitForTimeout(1500);
  126 | 
  127 |     const tree = page.locator('.el-tree, [class*="tree"]').first();
  128 |     await expect(tree).toBeVisible({ timeout: 5000 });
  129 |   });
  130 | });
  131 | 
  132 | test.describe('系统管理 - 字典管理', () => {
  133 |   test.beforeEach(async ({ page }) => {
  134 |     await login(page);
  135 |   });
  136 | 
  137 |   test('可打开字典管理页面', async ({ page }) => {
  138 |     await page.goto('/system/dict');
  139 |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  140 |   });
  141 | 
  142 |   test('字典类型表格存在', async ({ page }) => {
  143 |     await page.goto('/system/dict');
  144 |     await page.waitForTimeout(1500);
  145 | 
  146 |     const table = page.locator('.el-table, table').first();
  147 |     await expect(table).toBeVisible({ timeout: 5000 });
  148 |   });
  149 | });
  150 | 
  151 | test.describe('系统管理 - 岗位管理', () => {
  152 |   test.beforeEach(async ({ page }) => {
  153 |     await login(page);
  154 |   });
  155 | 
  156 |   test('可打开岗位管理页面', async ({ page }) => {
  157 |     await page.goto('/system/post');
  158 |     await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  159 |   });
  160 | });
  161 | 
```
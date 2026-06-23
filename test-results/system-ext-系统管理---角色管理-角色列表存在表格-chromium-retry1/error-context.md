# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: system-ext.spec.ts >> 系统管理 - 角色管理 >> 角色列表存在表格
- Location: playwright/tests/system-ext.spec.ts:98:3

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
  15  | async function clickSearchIfVisible(page) {
  16  |   const searchBtn = page.getByRole('button', { name: /搜索|search|查询/i }).first();
  17  |   if (await searchBtn.count() > 0 && (await searchBtn.isVisible())) {
  18  |     await searchBtn.click();
  19  |     await page.waitForTimeout(400);
  20  |   }
  21  | }
  22  | 
  23  | async function fillSearchInput(page, placeholderPattern: string, value: string) {
  24  |   const input = page.getByPlaceholder(new RegExp(placeholderPattern, 'i')).first();
  25  |   if (await input.count() > 0) {
  26  |     await input.fill(value);
  27  |     return true;
  28  |   }
  29  |   return false;
  30  | }
  31  | 
  32  | test.describe('系统管理 - 用户管理（CRUD）', () => {
  33  |   test.beforeEach(async ({ page }) => {
  34  |     await login(page);
  35  |   });
  36  | 
  37  |   test('用户列表搜索功能', async ({ page }) => {
  38  |     await page.goto('/system/user');
  39  |     await page.waitForTimeout(1000);
  40  |     await fillSearchInput(page, '用户名|请输入|keyword', 'admin');
  41  |     await clickSearchIfVisible(page);
  42  |     await expect(page.locator('body')).toBeVisible();
  43  |   });
  44  | 
  45  |   test('用户列表表格存在', async ({ page }) => {
  46  |     await page.goto('/system/user');
  47  |     await page.waitForTimeout(1500);
  48  |     const table = page.locator('.el-table, table, [class*="table"]').first();
  49  |     await expect(table).toBeVisible({ timeout: 5000 });
  50  |   });
  51  | 
  52  |   test('点击新增按钮可打开表单对话框', async ({ page }) => {
  53  |     await page.goto('/system/user');
  54  |     await page.waitForTimeout(1000);
  55  |     const addBtn = page.getByRole('button', { name: /新增|新建|添加|新增用户|\+|create|add/i }).first();
  56  |     if (await addBtn.count() > 0) {
  57  |       await addBtn.click();
  58  |       await page.waitForTimeout(500);
  59  |     }
  60  |     await expect(page.locator('body')).toBeVisible();
  61  |   });
  62  | 
  63  |   test('点击编辑按钮可打开编辑表单（若表格行存在）', async ({ page }) => {
  64  |     await page.goto('/system/user');
  65  |     await page.waitForTimeout(1500);
  66  | 
  67  |     const editBtn = page.getByRole('button', { name: /编辑|修改|edit/i }).first();
  68  |     if (await editBtn.count() > 0) {
  69  |       await editBtn.click({ force: true });
  70  |       await page.waitForTimeout(500);
  71  |     }
  72  |     await expect(page.locator('body')).toBeVisible();
  73  |   });
  74  | 
  75  |   test('点击删除按钮（不实际确认）', async ({ page }) => {
  76  |     await page.goto('/system/user');
  77  |     await page.waitForTimeout(1500);
  78  |     const delBtn = page.getByRole('button', { name: /删除|delete|remove/i }).first();
  79  |     if (await delBtn.count() > 0) {
  80  |       await delBtn.click({ force: true });
  81  |       await page.waitForTimeout(400);
  82  |     }
  83  |     await expect(page.locator('body')).toBeVisible();
  84  |   });
  85  | });
  86  | 
  87  | test.describe('系统管理 - 角色管理', () => {
  88  |   test.beforeEach(async ({ page }) => {
  89  |     await login(page);
  90  |   });
  91  | 
  92  |   test('角色列表页面正常加载', async ({ page }) => {
  93  |     await page.goto('/system/role');
  94  |     await page.waitForTimeout(1000);
  95  |     await expect(page.locator('body')).toBeVisible();
  96  |   });
  97  | 
  98  |   test('角色列表存在表格', async ({ page }) => {
  99  |     await page.goto('/system/role');
  100 |     await page.waitForTimeout(1500);
  101 |     const table = page.locator('.el-table, table, [class*="table"]').first();
> 102 |     await expect(table).toBeVisible({ timeout: 5000 });
      |                         ^ Error: expect(locator).toBeVisible() failed
  103 |   });
  104 | 
  105 |   test('分配菜单 / 权限按钮存在并可点击', async ({ page }) => {
  106 |     await page.goto('/system/role');
  107 |     await page.waitForTimeout(1500);
  108 |     const btn = page.getByRole('button', { name: /分配|权限|菜单|assign|permission/i }).first();
  109 |     if (await btn.count() > 0) {
  110 |       await btn.click({ force: true });
  111 |       await page.waitForTimeout(500);
  112 |     }
  113 |     await expect(page.locator('body')).toBeVisible();
  114 |   });
  115 | 
  116 |   test('角色管理 - 搜索过滤', async ({ page }) => {
  117 |     await page.goto('/system/role');
  118 |     await page.waitForTimeout(1000);
  119 |     await fillSearchInput(page, '角色名|请输入|keyword', '管理员');
  120 |     await clickSearchIfVisible(page);
  121 |     await expect(page.locator('body')).toBeVisible();
  122 |   });
  123 | });
  124 | 
  125 | test.describe('系统管理 - 部门管理（树形结构）', () => {
  126 |   test.beforeEach(async ({ page }) => {
  127 |     await login(page);
  128 |   });
  129 | 
  130 |   test('部门管理页面正常加载', async ({ page }) => {
  131 |     await page.goto('/system/dept');
  132 |     await page.waitForTimeout(1000);
  133 |     await expect(page.locator('body')).toBeVisible();
  134 |   });
  135 | 
  136 |   test('部门树存在', async ({ page }) => {
  137 |     await page.goto('/system/dept');
  138 |     await page.waitForTimeout(1500);
  139 |     const tree = page.locator('.el-tree, [class*="tree"]').first();
  140 |     if (await tree.count() > 0) {
  141 |       await expect(tree).toBeVisible({ timeout: 5000 });
  142 |     }
  143 |   });
  144 | 
  145 |   test('点击新增节点按钮可点击', async ({ page }) => {
  146 |     await page.goto('/system/dept');
  147 |     await page.waitForTimeout(1000);
  148 |     const addBtn = page.getByRole('button', { name: /新增|新建|添加|新增部门|add|create/i }).first();
  149 |     if (await addBtn.count() > 0) {
  150 |       await addBtn.click();
  151 |       await page.waitForTimeout(400);
  152 |     }
  153 |     await expect(page.locator('body')).toBeVisible();
  154 |   });
  155 | });
  156 | 
  157 | test.describe('系统管理 - 字典管理', () => {
  158 |   test.beforeEach(async ({ page }) => {
  159 |     await login(page);
  160 |   });
  161 | 
  162 |   test('字典类型列表加载', async ({ page }) => {
  163 |     await page.goto('/system/dict/type');
  164 |     await page.waitForTimeout(1500);
  165 |     const table = page.locator('.el-table, table, [class*="table"]').first();
  166 |     if (await table.count() > 0) {
  167 |       await expect(table).toBeVisible({ timeout: 5000 });
  168 |     }
  169 |     await expect(page.locator('body')).toBeVisible();
  170 |   });
  171 | 
  172 |   test('字典类型可搜索', async ({ page }) => {
  173 |     await page.goto('/system/dict/type');
  174 |     await page.waitForTimeout(1000);
  175 |     await fillSearchInput(page, '字典|名称|请输入|keyword', 'sys');
  176 |     await clickSearchIfVisible(page);
  177 |     await expect(page.locator('body')).toBeVisible();
  178 |   });
  179 | 
  180 |   test('字典数据列表加载', async ({ page }) => {
  181 |     await page.goto('/system/dict/type');
  182 |     await page.waitForTimeout(1500);
  183 |     const dictDataBtn = page.getByRole('button', { name: /字典数据|数据|data/i }).first();
  184 |     if (await dictDataBtn.count() > 0) {
  185 |       await dictDataBtn.click({ force: true });
  186 |       await page.waitForTimeout(500);
  187 |     }
  188 |     await expect(page.locator('body')).toBeVisible();
  189 |   });
  190 | });
  191 | 
  192 | test.describe('系统管理 - 菜单管理', () => {
  193 |   test.beforeEach(async ({ page }) => {
  194 |     await login(page);
  195 |   });
  196 | 
  197 |   test('菜单管理页面加载', async ({ page }) => {
  198 |     await page.goto('/system/menu');
  199 |     await page.waitForTimeout(1000);
  200 |     await expect(page.locator('body')).toBeVisible();
  201 |   });
  202 | 
```
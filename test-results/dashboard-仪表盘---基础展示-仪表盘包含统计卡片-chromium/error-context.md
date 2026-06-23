# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> 仪表盘 - 基础展示 >> 仪表盘包含统计卡片
- Location: playwright/tests/dashboard.spec.ts:23:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - heading "云枢中台" [level=1] [ref=e6]
        - paragraph [ref=e7]: Yunshu Platform
        - paragraph [ref=e8]: 开箱即用的企业级中台解决方案
      - generic [ref=e9]:
        - generic [ref=e10]:
          - img [ref=e12]
          - generic [ref=e14]: 设计令牌系统
        - generic [ref=e15]:
          - img [ref=e17]
          - generic [ref=e19]: RBAC 权限模型
        - generic [ref=e20]:
          - img [ref=e22]
          - generic [ref=e24]: 系统监控
        - generic [ref=e25]:
          - img [ref=e27]
          - generic [ref=e29]: 代码生成器
    - generic [ref=e31]:
      - heading "欢迎登录" [level=2] [ref=e32]
      - paragraph [ref=e33]: 请输入您的账号和密码登录系统
      - generic [ref=e34]:
        - generic [ref=e38]:
          - img [ref=e41]
          - textbox "请输入用户名" [ref=e43]: admin
        - generic [ref=e48]:
          - img [ref=e51]
          - textbox "请输入密码" [ref=e54]: admin123
          - img [ref=e57] [cursor=pointer]
        - generic [ref=e61]:
          - generic [ref=e63]:
            - img [ref=e66]
            - textbox "请输入验证码" [ref=e69]
          - button "点击刷新验证码" [ref=e71] [cursor=pointer]:
            - img [ref=e73]
        - generic [ref=e78] [cursor=pointer]:
          - generic [ref=e79]:
            - checkbox "记住密码"
          - generic [ref=e81]: 记住密码
        - button "登 录" [ref=e84] [cursor=pointer]:
          - generic [ref=e85]: 登 录
      - paragraph [ref=e87]: 默认账号：admin / admin123
  - alert [ref=e88]:
    - img [ref=e90]
    - paragraph [ref=e92]: 服务器异常 (500)，请稍后重试
  - alert [ref=e93]:
    - img [ref=e95]
    - paragraph [ref=e97]: 服务器异常 (500)，请稍后重试
  - alert [ref=e98]:
    - img [ref=e100]
    - paragraph [ref=e102]: Request failed with status code 500
  - alert [ref=e103]:
    - img [ref=e105]
    - paragraph [ref=e107]: 服务器异常 (500)，请稍后重试
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe.configure({ mode: 'serial' });
  4  | 
  5  | test.describe('仪表盘 - 基础展示', () => {
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto('/login');
  8  |     await page.getByPlaceholder('请输入用户名').fill('admin');
  9  |     await page.getByPlaceholder('请输入密码').fill('admin123');
  10 |     const captchaInput = page.getByPlaceholder('请输入验证码');
  11 |     if (await captchaInput.isVisible({ timeout: 2000 })) {
  12 |       await captchaInput.fill('test');
  13 |     }
  14 |     await page.getByRole('button', { name: '登 录' }).click();
  15 |     await page.waitForTimeout(1500);
  16 |   });
  17 | 
  18 |   test('仪表盘包含欢迎区', async ({ page }) => {
  19 |     const welcomeText = page.getByText(/欢迎|您好|Hello|admin/i).first();
  20 |     await expect(welcomeText).toBeVisible({ timeout: 8000 });
  21 |   });
  22 | 
  23 |   test('仪表盘包含统计卡片', async ({ page }) => {
  24 |     await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  25 |     const cards = page.locator('.stat-card, [class*="card"], .el-card');
  26 |     const count = await cards.count();
> 27 |     expect(count).toBeGreaterThan(0);
     |                   ^ Error: expect(received).toBeGreaterThan(expected)
  28 |   });
  29 | 
  30 |   test('侧边栏菜单可展开', async ({ page }) => {
  31 |     const sidebar = page.locator('.sidebar-container, .el-aside, aside').first();
  32 |     await expect(sidebar).toBeVisible({ timeout: 8000 });
  33 | 
  34 |     const menus = page.locator('.el-menu-item, .menu-item');
  35 |     expect(await menus.count()).toBeGreaterThan(0);
  36 |   });
  37 | });
  38 | 
  39 | test.describe('仪表盘 - 数据可视化', () => {
  40 |   test.beforeEach(async ({ page }) => {
  41 |     await page.goto('/login');
  42 |     await page.getByPlaceholder('请输入用户名').fill('admin');
  43 |     await page.getByPlaceholder('请输入密码').fill('admin123');
  44 |     const captchaInput = page.getByPlaceholder('请输入验证码');
  45 |     if (await captchaInput.isVisible({ timeout: 2000 })) {
  46 |       await captchaInput.fill('test');
  47 |     }
  48 |     await page.getByRole('button', { name: '登 录' }).click();
  49 |     await page.waitForTimeout(1500);
  50 |   });
  51 | 
  52 |   test('图表区域存在', async ({ page }) => {
  53 |     await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  54 |     const charts = page.locator('canvas, [class*="echarts"], svg').first();
  55 |     if (await charts.count() > 0) {
  56 |       await expect(charts.first()).toBeVisible({ timeout: 5000 });
  57 |     }
  58 |   });
  59 | });
  60 | 
  61 | test.describe('仪表盘 - 导航交互', () => {
  62 |   test.beforeEach(async ({ page }) => {
  63 |     await page.goto('/login');
  64 |     await page.getByPlaceholder('请输入用户名').fill('admin');
  65 |     await page.getByPlaceholder('请输入密码').fill('admin123');
  66 |     const captchaInput = page.getByPlaceholder('请输入验证码');
  67 |     if (await captchaInput.isVisible({ timeout: 2000 })) {
  68 |       await captchaInput.fill('test');
  69 |     }
  70 |     await page.getByRole('button', { name: '登 录' }).click();
  71 |     await page.waitForTimeout(1500);
  72 |   });
  73 | 
  74 |   test('点击菜单项可跳转', async ({ page }) => {
  75 |     const menuItem = page.locator('.el-menu-item, [class*="menu-item"]').first();
  76 |     if (await menuItem.isVisible({ timeout: 5000 })) {
  77 |       await menuItem.click();
  78 |       await page.waitForTimeout(500);
  79 |     }
  80 |   });
  81 | });
  82 | 
```
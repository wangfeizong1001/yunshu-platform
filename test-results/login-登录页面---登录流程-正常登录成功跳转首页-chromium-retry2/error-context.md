# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> 登录页面 - 登录流程 >> 正常登录成功跳转首页
- Location: playwright/tests/login.spec.ts:71:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
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
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('登录页面 - 基础展示', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/login');
  6   |   });
  7   | 
  8   |   test('页面元素完整展示', async ({ page }) => {
  9   |     await expect(page.getByText('云枢中台')).toBeVisible();
  10  |     await expect(page.getByText('Yunshu Platform')).toBeVisible();
  11  |     await expect(page.getByPlaceholder('请输入用户名')).toBeVisible();
  12  |     await expect(page.getByPlaceholder('请输入密码')).toBeVisible();
  13  |     await expect(page.getByRole('button', { name: '登 录' })).toBeVisible();
  14  |   });
  15  | 
  16  |   test('展示左侧特色功能列表', async ({ page }) => {
  17  |     await expect(page.getByText('设计令牌系统')).toBeVisible();
  18  |     await expect(page.getByText('RBAC 权限模型')).toBeVisible();
  19  |     await expect(page.getByText('系统监控')).toBeVisible();
  20  |     await expect(page.getByText('代码生成器')).toBeVisible();
  21  |   });
  22  | 
  23  |   test('默认账号提示存在', async ({ page }) => {
  24  |     await expect(page.getByText(/默认账号.*admin/i)).toBeVisible();
  25  |   });
  26  | });
  27  | 
  28  | test.describe('登录页面 - 表单校验', () => {
  29  |   test.beforeEach(async ({ page }) => {
  30  |     await page.goto('/login');
  31  |   });
  32  | 
  33  |   test('用户名为空时显示校验错误', async ({ page }) => {
  34  |     await page.getByPlaceholder('请输入用户名').fill('');
  35  |     await page.getByPlaceholder('请输入密码').fill('admin123');
  36  |     await page.getByRole('button', { name: '登 录' }).click();
  37  |     await expect(page.getByText('请输入用户名').first()).toBeVisible({ timeout: 3000 });
  38  |   });
  39  | 
  40  |   test('密码为空时显示校验错误', async ({ page }) => {
  41  |     await page.getByPlaceholder('请输入用户名').fill('admin');
  42  |     await page.getByPlaceholder('请输入密码').fill('');
  43  |     await page.getByRole('button', { name: '登 录' }).click();
  44  |     await expect(page.getByText('请输入密码').first()).toBeVisible({ timeout: 3000 });
  45  |   });
  46  | 
  47  |   test('记住密码复选框可勾选', async ({ page }) => {
  48  |     const checkbox = page.locator('.el-checkbox').first();
  49  |     await checkbox.click();
  50  |   });
  51  | });
  52  | 
  53  | test.describe('登录页面 - 验证码', () => {
  54  |   test('验证码输入框和图片存在', async ({ page }) => {
  55  |     await page.goto('/login');
  56  |     await expect(page.getByPlaceholder('请输入验证码')).toBeVisible({ timeout: 3000 });
  57  |   });
  58  | 
  59  |   test('点击验证码区域可刷新', async ({ page }) => {
  60  |     await page.goto('/login');
  61  |     await page.waitForTimeout(500);
  62  |     const captchaContainer = page.locator('.captcha');
  63  |     if (await captchaContainer.isVisible()) {
  64  |       await captchaContainer.click();
  65  |       await page.waitForTimeout(300);
  66  |     }
  67  |   });
  68  | });
  69  | 
  70  | test.describe('登录页面 - 登录流程', () => {
  71  |   test('正常登录成功跳转首页', async ({ page }) => {
  72  |     await page.goto('/login');
  73  | 
  74  |     await page.getByPlaceholder('请输入用户名').fill('admin');
  75  |     await page.getByPlaceholder('请输入密码').fill('admin123');
  76  | 
  77  |     const captchaInput = page.getByPlaceholder('请输入验证码');
  78  |     if (await captchaInput.isVisible({ timeout: 2000 })) {
  79  |       await captchaInput.fill('test');
  80  |     }
  81  | 
  82  |     await page.getByRole('button', { name: '登 录' }).click();
  83  | 
> 84  |     await page.waitForURL(/\/$|\/dashboard/, { timeout: 10000 });
      |                ^ TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
  85  | 
  86  |     const isOnMain =
  87  |       page.url().includes('/dashboard') ||
  88  |       page.url().endsWith('/') ||
  89  |       page.url().includes('admin');
  90  |     expect(isOnMain).toBe(true);
  91  |   });
  92  | 
  93  |   test('登录按钮点击后显示 loading 状态', async ({ page }) => {
  94  |     await page.goto('/login');
  95  | 
  96  |     await page.getByPlaceholder('请输入用户名').fill('admin');
  97  |     await page.getByPlaceholder('请输入密码').fill('admin123');
  98  | 
  99  |     const captchaInput = page.getByPlaceholder('请输入验证码');
  100 |     if (await captchaInput.isVisible({ timeout: 2000 })) {
  101 |       await captchaInput.fill('test');
  102 |     }
  103 | 
  104 |     await page.getByRole('button', { name: '登 录' }).click();
  105 |     await page.waitForTimeout(200);
  106 |   });
  107 | });
  108 | 
```
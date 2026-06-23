# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login-ext.spec.ts >> 登录页面 - 多语言切换 >> 页面展示品牌文案
- Location: playwright/tests/login-ext.spec.ts:96:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('云枢中台').or(getByText(/Yunshu/i))
Expected: visible
Error: strict mode violation: getByText('云枢中台').or(getByText(/Yunshu/i)) resolved to 2 elements:
    1) <h1 data-v-2bf2fc29="" class="brand-title">云枢中台</h1> aka getByRole('heading', { name: '云枢中台' })
    2) <p data-v-2bf2fc29="" class="brand-subtitle">Yunshu Platform</p> aka getByText('Yunshu Platform')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('云枢中台').or(getByText(/Yunshu/i))

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
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | async function fillLogin(page, username: string, password: string, captcha = 'test') {
  4   |   await page.getByPlaceholder('请输入用户名').fill(username);
  5   |   await page.getByPlaceholder('请输入密码').fill(password);
  6   |   const captchaInput = page.getByPlaceholder('请输入验证码');
  7   |   if (await captchaInput.isVisible({ timeout: 2000 })) {
  8   |     await captchaInput.fill(captcha);
  9   |   }
  10  | }
  11  | 
  12  | test.describe('登录页面 - 验证码高级场景', () => {
  13  |   test.beforeEach(async ({ page }) => {
  14  |     await page.goto('/login');
  15  |   });
  16  | 
  17  |   test('验证码输入框可点击并输入字符', async ({ page }) => {
  18  |     const captchaInput = page.getByPlaceholder('请输入验证码');
  19  |     if (await captchaInput.isVisible({ timeout: 3000 })) {
  20  |       await captchaInput.click();
  21  |       await captchaInput.fill('a1b2');
  22  |       await expect(captchaInput).toHaveValue('a1b2');
  23  |     }
  24  |   });
  25  | 
  26  |   test('验证码图像区域可点击刷新', async ({ page }) => {
  27  |     const captchaContainer = page.locator('.captcha, img[alt*="captcha" i], [class*="captcha"]').first();
  28  |     if (await captchaContainer.count() > 0 && (await captchaContainer.isVisible())) {
  29  |       await captchaContainer.click();
  30  |       await page.waitForTimeout(300);
  31  |     }
  32  |   });
  33  | 
  34  |   test('验证码过期 / 刷新后输入框可重新输入', async ({ page }) => {
  35  |     const captchaInput = page.getByPlaceholder('请输入验证码');
  36  |     if (await captchaInput.isVisible({ timeout: 3000 })) {
  37  |       await captchaInput.fill('oldcode');
  38  |       const captchaContainer = page.locator('.captcha, [class*="captcha"]').first();
  39  |       if (await captchaContainer.isVisible()) {
  40  |         await captchaContainer.click();
  41  |         await page.waitForTimeout(300);
  42  |       }
  43  |       await captchaInput.fill('newcode');
  44  |       await expect(captchaInput).toHaveValue('newcode');
  45  |     }
  46  |   });
  47  | });
  48  | 
  49  | test.describe('登录页面 - 错误密码 / 账户锁定', () => {
  50  |   test.beforeEach(async ({ page }) => {
  51  |     await page.goto('/login');
  52  |   });
  53  | 
  54  |   test('错误密码登录返回提示信息', async ({ page }) => {
  55  |     await fillLogin(page, 'admin', 'wrongpassword');
  56  |     const submitBtn = page.getByRole('button', { name: '登 录' });
  57  |     if (await submitBtn.isVisible()) {
  58  |       await submitBtn.click();
  59  |       await page.waitForTimeout(800);
  60  |     }
  61  |     await expect(page.locator('body')).toBeVisible();
  62  |   });
  63  | 
  64  |   test('空用户名与空密码点击登录给出提示', async ({ page }) => {
  65  |     await page.getByPlaceholder('请输入用户名').fill('');
  66  |     await page.getByPlaceholder('请输入密码').fill('');
  67  |     const captchaInput = page.getByPlaceholder('请输入验证码');
  68  |     if (await captchaInput.isVisible({ timeout: 2000 })) {
  69  |       await captchaInput.fill('');
  70  |     }
  71  |     await page.getByRole('button', { name: '登 录' }).click();
  72  |     await page.waitForTimeout(500);
  73  |     await expect(page.locator('body')).toBeVisible();
  74  |   });
  75  | 
  76  |   test('多次失败登录页面仍可操作（不卡死）', async ({ page }) => {
  77  |     for (let i = 0; i < 3; i++) {
  78  |       await fillLogin(page, 'unknown', 'wrong');
  79  |       await page.getByRole('button', { name: '登 录' }).click();
  80  |       await page.waitForTimeout(400);
  81  |     }
  82  |     await expect(page.getByPlaceholder('请输入用户名')).toBeVisible();
  83  |   });
  84  | });
  85  | 
  86  | test.describe('登录页面 - 多语言切换', () => {
  87  |   test.beforeEach(async ({ page }) => {
  88  |     await page.goto('/login');
  89  |   });
  90  | 
  91  |   test('语言切换组件存在', async ({ page }) => {
  92  |     const switcher = page.locator('.el-select, [class*="lang"], [class*="locale"], [class*="language"]').first();
  93  |     await expect(page.locator('body')).toBeVisible();
  94  |   });
  95  | 
  96  |   test('页面展示品牌文案', async ({ page }) => {
> 97  |     await expect(page.getByText('云枢中台').or(page.getByText(/Yunshu/i))).toBeVisible({ timeout: 5000 });
      |                                                                        ^ Error: expect(locator).toBeVisible() failed
  98  |   });
  99  | });
  100 | 
  101 | test.describe('登录页面 - 登录后路由跳转', () => {
  102 |   test('登录成功后跳转到首页 / dashboard', async ({ page }) => {
  103 |     await page.goto('/login');
  104 |     await fillLogin(page, 'admin', 'admin123');
  105 |     await page.getByRole('button', { name: '登 录' }).click();
  106 |     await page.waitForTimeout(1500);
  107 | 
  108 |     const url = page.url();
  109 |     const onMain =
  110 |       url.endsWith('/') ||
  111 |       url.includes('/dashboard') ||
  112 |       url.includes('/home');
  113 |     expect(onMain || (await page.locator('.sidebar-container').count()) > 0).toBe(true);
  114 |   });
  115 | 
  116 |   test('登录后刷新页面仍保持登录状态', async ({ page }) => {
  117 |     await page.goto('/login');
  118 |     await fillLogin(page, 'admin', 'admin123');
  119 |     await page.getByRole('button', { name: '登 录' }).click();
  120 |     await page.waitForTimeout(1500);
  121 | 
  122 |     await page.reload();
  123 |     await page.waitForLoadState('domcontentloaded');
  124 |     await expect(page.locator('body')).toBeVisible();
  125 |   });
  126 | 
  127 |   test('带有 redirect 参数的登录 URL 可正确跳转', async ({ page }) => {
  128 |     await page.goto('/login?redirect=/system/user');
  129 |     await fillLogin(page, 'admin', 'admin123');
  130 |     await page.getByRole('button', { name: '登 录' }).click();
  131 |     await page.waitForTimeout(1500);
  132 |     await expect(page.locator('body')).toBeVisible();
  133 |   });
  134 | });
  135 | 
```
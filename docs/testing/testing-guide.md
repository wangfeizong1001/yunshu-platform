# 测试指南

本文档描述云枢中台的测试策略，包括单元测试、集成测试和 E2E 测试。

---

## 一、测试策略概述

### 1.1 测试金字塔

```
        ┌──────────────────────────────────┐
        │         E2E 测试（少量）          │
        │     完整用户流程，高价值          │
        └──────────────────────────────────┘
                     ▲
                     │
        ┌──────────────────────────────────┐
        │       集成测试（中等数量）         │
        │     模块间协作，API 级测试         │
        └──────────────────────────────────┘
                     ▲
                     │
        ┌──────────────────────────────────┐
        │      单元测试（大量，快速）        │
        │   函数/组件级，快速反馈，覆盖率高  │
        └──────────────────────────────────┘
```

### 1.2 技术栈

| 类型 | 工具 | 说明 |
|------|------|------|
| **单元测试** | Vitest + @vue/test-utils | Vue 组件 + TypeScript |
| **E2E 测试** | Playwright | 跨浏览器端到端测试 |
| **覆盖率** | c8 / istanbul | 覆盖率报告 |

### 1.3 覆盖率目标

| 类型 | 目标覆盖率 | 说明 |
|------|-----------|------|
| 核心业务逻辑 | >= 80% | 必须覆盖所有分支 |
| 工具函数 | >= 90% | 纯函数应有高覆盖率 |
| 组件 | >= 70% | 重点覆盖交互逻辑 |
| 整体 | >= 70% | 不追求 100%，关注关键路径 |

---

## 二、单元测试（Vitest）

### 2.1 项目配置

```typescript
// apps/admin/vitest.config.ts

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom', // 模拟浏览器环境
    globals: true,        // 使用全局 describe/it/expect
    setupFiles: ['./src/__tests__/setup.ts'],
    include: [
      'src/__tests__/**/*.{test,spec}.{ts,tsx,vue}',
      'src/**/*.{test,spec}.{ts,tsx,vue}'
    ],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html', 'json'],
      include: [
        'src/utils/**',
        'src/store/**',
        'src/router/**',
        'src/api/**',
        'src/components/**'
      ],
      exclude: [
        '**/*.d.ts',
        '**/*.mock.ts',
        '**/__tests__/**',
        '**/node_modules/**'
      ],
      // 目标覆盖率
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70
    }
  }
})
```

### 2.2 测试启动文件

```typescript
// apps/admin/src/__tests__/setup.ts

import { vi, beforeEach, afterEach } from 'vitest'
import { config } from '@vue/test-utils'

// Element Plus 全局组件模拟
config.global.components = {
  ElButton: { template: '<button><slot /></button>' },
  ElInput: { template: '<input />' },
  ElForm: { template: '<form><slot /></form>' },
  ElFormItem: { template: '<div><slot /></div>' },
  ElTable: { template: '<table><slot /></table>' },
  ElTableColumn: { template: '<td><slot /></td>' },
  ElMessage: { template: '<div />' },
  ElMessageBox: { template: '<div />' }
}

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock console.warn 以减少噪音
vi.spyOn(console, 'warn').mockImplementation(() => {})

// 每个测试前清理
beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})
```

### 2.3 运行命令

```bash
# 运行所有单元测试
pnpm test

# 监听模式（开发时推荐）
pnpm test -- --watch

# 运行指定文件
pnpm test -- apps/admin/src/__tests__/utils/httpClient.test.ts

# 生成覆盖率报告
pnpm test:coverage

# 查看 HTML 报告
# 打开 apps/admin/coverage/index.html
```

### 2.4 测试工具函数示例

```typescript
// apps/admin/src/__tests__/utils/httpClient.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { httpClient } from '@/utils/httpClient'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('httpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该成功发起 GET 请求', async () => {
    const mockResponse = { code: 200, message: 'success', data: { id: 1 } }
    ;(axios.get as any).mockResolvedValue({ data: mockResponse })

    const result = await httpClient.get('/api/users/1')

    expect(axios.get).toHaveBeenCalledWith('/api/users/1')
    expect(result).toEqual(mockResponse)
  })

  it('应该成功发起 POST 请求', async () => {
    const payload = { name: '张三', email: 'zhangsan@example.com' }
    const mockResponse = { code: 200, message: '创建成功', data: { id: 1 } }
    ;(axios.post as any).mockResolvedValue({ data: mockResponse })

    const result = await httpClient.post('/api/users', payload)

    expect(axios.post).toHaveBeenCalledWith('/api/users', payload)
    expect(result).toEqual(mockResponse)
  })

  it('应该处理网络错误', async () => {
    const errorMessage = 'Network Error'
    ;(axios.get as any).mockRejectedValue(new Error(errorMessage))

    await expect(httpClient.get('/api/users')).rejects.toThrow(errorMessage)
  })
})
```

### 2.5 安全工具测试示例

```typescript
// apps/admin/src/__tests__/utils/security.test.ts

import { describe, it, expect } from 'vitest'
import { sanitizeHtml, escapeHtml, validateInput, generateToken } from '@/utils/security'

describe('安全工具函数', () => {
  describe('sanitizeHtml', () => {
    it('应该移除 script 标签', () => {
      const input = '<script>alert("xss")</script>Hello'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('<script>')
    })

    it('应该移除 onclick 事件', () => {
      const input = '<div onclick="alert(1)">点击</div>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('onclick')
    })

    it('应该保留安全的 HTML 标签', () => {
      const input = '<p><strong>文本</strong></p>'
      const result = sanitizeHtml(input)
      expect(result).toContain('<strong>')
    })

    it('应该处理 null/undefined', () => {
      expect(sanitizeHtml(null)).toBe('')
      expect(sanitizeHtml(undefined)).toBe('')
    })
  })

  describe('escapeHtml', () => {
    it('应该转义 HTML 特殊字符', () => {
      expect(escapeHtml('<&>"\'')).toBe('&lt;&amp;&gt;&quot;&#39;')
    })
  })

  describe('validateInput', () => {
    it('应该验证合法邮箱', () => {
      expect(validateInput('user@example.com', 'email')).toBe(true)
    })

    it('应该拒绝非法邮箱', () => {
      expect(validateInput('invalid-email', 'email')).toBe(false)
    })

    it('应该验证合法手机号', () => {
      expect(validateInput('13800138000', 'phone')).toBe(true)
    })

    it('应该拒绝非法手机号', () => {
      expect(validateInput('123', 'phone')).toBe(false)
    })
  })

  describe('generateToken', () => {
    it('应该生成指定长度的 token', () => {
      const token = generateToken(32)
      expect(token).toHaveLength(32)
    })

    it('每次应该生成不同的 token', () => {
      const token1 = generateToken(32)
      const token2 = generateToken(32)
      expect(token1).not.toBe(token2)
    })
  })
})
```

### 2.6 Vue 组件测试示例

```typescript
// apps/admin/src/__tests__/components/HelloWorld.test.ts

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld 组件', () => {
  it('应该正确渲染 props 中的 msg', () => {
    const msg = '你好，世界'
    const wrapper = mount(HelloWorld, {
      props: { msg }
    })

    expect(wrapper.text()).toContain(msg)
  })

  it('应该在点击按钮时增加计数', async () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: '测试' }
    })

    const button = wrapper.find('button')
    await button.trigger('click')
    await button.trigger('click')

    expect(wrapper.text()).toContain('count is: 2')
  })
})
```

### 2.7 测试最佳实践

```typescript
// ✅ 推荐：清晰的测试描述
describe('用户认证流程', () => {
  it('应该在提供有效凭证时返回 token', async () => {
    // ...
  })

  it('应该在密码错误时返回 401', async () => {
    // ...
  })
})

// ✅ 推荐：每个测试独立（使用 beforeEach 重置状态）
beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

// ✅ 推荐：测试用户可见的行为，而非实现细节
it('应该在提交表单后显示成功消息', () => {
  // 测试用户能看到的结果，而非内部状态变化
})

// ❌ 避免：测试具体的实现细节
// it('应该调用 userService.save()', () => { ... })
```

---

## 三、E2E 测试（Playwright）

### 3.1 Playwright 配置

```typescript
// apps/admin/playwright.config.ts

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] }
    }
  ],

  webServer: {
    command: 'pnpm dev --filter=@yunshu/admin',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
})
```

### 3.2 E2E 测试示例

```typescript
// apps/admin/e2e/login.spec.ts

import { test, expect } from '@playwright/test'

test.describe('登录页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('应该显示登录表单', async ({ page }) => {
    // 验证页面元素
    await expect(page.getByRole('heading', { name: /登录/i })).toBeVisible()
    await expect(page.getByLabel(/用户名/i)).toBeVisible()
    await expect(page.getByLabel(/密码/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /登录/i })).toBeVisible()
  })

  test('应该在凭据正确时登录成功', async ({ page }) => {
    // 填写表单
    await page.getByLabel(/用户名/i).fill('admin')
    await page.getByLabel(/密码/i).fill('admin123')

    // 提交
    await page.getByRole('button', { name: /登录/i }).click()

    // 验证跳转（URL 包含 dashboard 或首页）
    await expect(page).toHaveURL(/\/dashboard|\/$/)
  })

  test('应该在凭据错误时显示错误消息', async ({ page }) => {
    await page.getByLabel(/用户名/i).fill('invalid')
    await page.getByLabel(/密码/i).fill('wrong')

    await page.getByRole('button', { name: /登录/i }).click()

    // 验证错误消息
    await expect(page.getByText(/用户名或密码错误/i)).toBeVisible()
  })

  test('应该在空字段时显示验证错误', async ({ page }) => {
    // 不填写直接提交
    await page.getByRole('button', { name: /登录/i }).click()

    // 验证错误提示
    await expect(page.getByText(/请输入用户名/i)).toBeVisible()
  })
})

test.describe('用户管理页面（需登录）', () => {
  test.beforeEach(async ({ page }) => {
    // 先登录
    await page.goto('/login')
    await page.getByLabel(/用户名/i).fill('admin')
    await page.getByLabel(/密码/i).fill('admin123')
    await page.getByRole('button', { name: /登录/i }).click()
  })

  test('应该显示用户列表', async ({ page }) => {
    await page.goto('/system/user')

    // 验证表格
    await expect(page.getByText(/用户管理/i)).toBeVisible()
    await expect(page.locator('table')).toBeVisible()
  })

  test('应该能新增用户', async ({ page }) => {
    await page.goto('/system/user')

    // 点击新增按钮
    await page.getByRole('button', { name: /新增/i }).click()

    // 填写表单
    await page.getByLabel(/用户名/i).fill(`testuser${Date.now()}`)
    await page.getByLabel(/昵称/i).fill('测试用户')
    await page.getByLabel(/邮箱/i).fill('test@example.com')

    // 提交
    await page.getByRole('button', { name: /确认|确定/i }).click()

    // 验证成功消息
    await expect(page.getByText(/创建成功|成功/i)).toBeVisible()
  })
})
```

### 3.3 运行 E2E 测试

```bash
# 安装浏览器（首次运行时需要）
pnpm exec playwright install

# 运行所有测试
pnpm exec playwright test

# 运行指定测试文件
pnpm exec playwright test login.spec.ts

# 运行并打开可视化界面
pnpm exec playwright test --ui

# 生成测试代码（录制用户操作）
pnpm exec playwright codegen http://localhost:5173

# 查看测试报告
pnpm exec playwright show-report
```

---

## 四、集成测试

### 4.1 API 集成测试示例

```typescript
// apps/admin/src/__tests__/integration/user-api.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUserList, createUser, updateUser, deleteUser } from '@/api/modules/system/user'
import request from '@/utils/http'

// Mock request
vi.mock('@/utils/http', () => ({
  default: vi.fn()
}))

describe('用户 API 集成测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确调用获取用户列表接口', async () => {
    const mockResponse = {
      code: 200,
      message: 'success',
      data: {
        list: [
          { userId: 1, userName: 'admin', email: 'admin@example.com' }
        ],
        total: 1,
        page: 1,
        pageSize: 10
      }
    }

    ;(request as any).mockResolvedValue(mockResponse.data)

    const result = await getUserList({ pageNum: 1, pageSize: 10 })

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/system/user/list',
        method: 'GET'
      })
    )
    expect(result).toEqual(mockResponse.data)
  })

  it('应该正确调用创建用户接口', async () => {
    const payload = {
      userName: 'testuser',
      nickName: '测试',
      email: 'test@example.com',
      password: 'password123'
    }

    ;(request as any).mockResolvedValue({ code: 200, message: '创建成功' })

    await createUser(payload)

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/system/user',
        method: 'POST',
        data: payload
      })
    )
  })
})
```

---

## 五、测试命令速查

```bash
# ========== 单元测试 ==========
pnpm test                         # 运行所有单元测试
pnpm test -- --watch              # 监听模式（开发时）
pnpm test -- apps/admin/src/__tests__/utils/httpClient.test.ts

# ========== 覆盖率 ==========
pnpm test:coverage               # 生成覆盖率报告
# 报告位置: apps/admin/coverage/index.html

# ========== E2E 测试 ==========
pnpm exec playwright install     # 安装浏览器（首次）
pnpm exec playwright test        # 运行所有 E2E 测试
pnpm exec playwright test login.spec.ts
pnpm exec playwright test --ui   # 可视化界面
pnpm exec playwright show-report # 查看测试报告

# ========== 代码规范检查（与测试配合）==========
pnpm lint                        # ESLint
pnpm format                      # Prettier
pnpm type-check                  # TypeScript

# ========== 完整质量检查流水线 ==========
pnpm check                       # 类型 + lint + 格式化检查
pnpm test                        # 测试
```

---

## 六、CI/CD 集成

### 6.1 GitHub Actions 示例

```yaml
# .github/workflows/tests.yml

name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    name: 单元测试
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install

      - name: 类型检查
        run: pnpm type-check

      - name: 代码规范检查
        run: pnpm lint

      - name: 运行单元测试
        run: pnpm test -- --coverage

      - name: 上传覆盖率报告
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: apps/admin/coverage

  e2e-tests:
    name: E2E 测试
    runs-on: ubuntu-latest
    needs: unit-tests

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install

      - name: 安装 Playwright 浏览器
        run: pnpm exec playwright install --with-deps

      - name: 运行 E2E 测试
        run: pnpm exec playwright test

      - name: 上传测试报告
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: apps/admin/playwright-report
```

---

## 七、测试最佳实践

### 7.1 单元测试原则

| 原则 | 说明 |
|------|------|
| **单一职责** | 每个测试只验证一个行为 |
| **独立运行** | 测试之间不依赖彼此的执行顺序 |
| **快速** | 应该在秒级完成 |
| **确定性** | 相同输入始终产生相同输出 |
| **可读** | 测试代码本身就是文档 |

### 7.2 E2E 测试原则

| 原则 | 说明 |
|------|------|
| **测试关键路径** | 只覆盖最核心的用户流程 |
| **模拟用户真实行为** | 使用 getByRole, getByLabel 等语义化选择器 |
| **避免依赖特定实现** | 测试用户可见的结果，而非内部状态 |
| **适当等待** | 使用 Playwright 的自动等待，避免硬编码 setTimeout |

### 7.3 常见反模式

```typescript
// ❌ 避免：测试实现细节而非行为
it('应该将 user.name 设置为 "张三"', () => {
  // 不关心内部 state 的值
  // 应该关心用户看到的结果
})

// ❌ 避免：过度 Mock
it('应该调用 userService.save()', () => {
  // 过度 mock 导致测试无意义
})

// ✅ 推荐：测试用户可见的行为
it('应该在保存后显示成功消息', () => {
  // 验证用户实际看到的结果
})
```

---

## 八、测试检查清单

- [ ] 关键业务逻辑有单元测试覆盖
- [ ] 登录/权限等核心流程有 E2E 测试
- [ ] 工具函数有完整的边界测试
- [ ] 每个 API 接口有集成测试
- [ ] 测试命名清晰，描述行为
- [ ] 测试独立运行，无依赖顺序
- [ ] CI 中所有测试通过
- [ ] 覆盖率报告定期审查
- [ ] 新增功能伴随新增测试
- [ ] Bug 修复后添加回归测试

---

**相关文档**:
- [开发规范](../DEVELOP.md)
- [FAQ](../faq.md)

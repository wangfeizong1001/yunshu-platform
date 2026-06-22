# 贡献指南

欢迎为云枢中台贡献代码！请遵循以下规范。

## 开发流程

### 1. Fork 仓库

在 GitHub 上 Fork 仓库到您的账户。

### 2. 克隆到本地

```bash
git clone https://github.com/your-username/yunshu-platform.git
cd yunshu-platform
```

### 3. 创建分支

从 `develop` 创建功能分支：

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 4. 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 5. 提交

```bash
# 查看变更
git status
git diff

# 添加变更
git add .

# 提交（遵循语义化提交规范）
git commit -m "feat: 新增功能"
```

### 6. 推送并创建 PR

```bash
git push origin feature/your-feature-name
```

在 GitHub 上创建 Pull Request 到 `develop` 分支。

## 提交规范

使用 [语义化提交信息](https://www.conventionalcommits.org/zh-hans/)：

### 格式

```
<type>(<scope>): <description>

[body]

[footer]
```

### Type

| Type | 说明 |
|------|------|
| `feat` | 新增功能 |
| `fix` | 修复 Bug |
| `docs` | 文档变更 |
| `style` | 代码格式调整（不影响逻辑） |
| `refactor` | 重构（既不是新增功能也不是修复 Bug） |
| `perf` | 性能优化 |
| `test` | 添加或修改测试 |
| `chore` | 构建过程或工具变更 |

### Scope

表示变更的范围：

- `admin` - 后台管理
- `docs` - 文档
- `api-client` - API 客户端
- `ui` - UI 组件库
- `server` - 后端
- `shared` - 共享包
- `ci` - CI/CD
- `deps` - 依赖更新

### 示例

```bash
feat(admin): 新增用户导入功能
fix(api-client): 修复 token 过期未刷新的问题
docs(guide): 更新快速开始文档
style(admin): 统一代码缩进为 2 空格
refactor(ui): 重构 Button 组件，使用 Composition API
perf(admin): 优化列表渲染性能
test(admin): 添加用户管理测试
chore(deps): 升级 vue 到 3.5
```

## 代码规范

### TypeScript

- ✅ 使用 TypeScript 编写所有代码
- ✅ 禁止使用 `any` 类型
- ✅ 优先使用 `unknown` + 类型守卫
- ✅ 接口使用 `I` 前缀（如 `IUserService`）
- ✅ 类型使用 `T` 前缀（如 `TUserData`）
- ✅ 明确函数参数和返回值类型

```typescript
// ✅ 推荐
interface IUserService {
  getUser(id: string): Promise<TUserData>
}

// ❌ 不推荐
function getUser(id: any): any {
  // ...
}
```

### 命名规范

| 类型 | 命名 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserProfile.vue` |
| 函数 | camelCase | `getUserData()` |
| 常量 | UPPER_CASE | `MAX_RETRY_COUNT` |
| 接口 | I + PascalCase | `IUserService` |
| 类型 | T + PascalCase | `TUserData` |
| 文件夹 | kebab-case | `user-profile` |
| 类 | PascalCase | `UserService` |

### 样式规范

- ✅ 使用 SCSS 编写样式
- ✅ 使用 2 空格缩进
- ✅ 使用 CSS 变量管理颜色
- ✅ 禁止硬编码颜色
- ✅ 使用 BEM 命名类

```scss
// ✅ 推荐
.user-card {
  &__header {
    color: var(--el-color-primary);
  }

  &__body {
    padding: 16px;
  }
}

// ❌ 不推荐
.userCard {
  .header {
    color: #4a9eff;  // 硬编码
  }
}
```

## 测试规范

### 单元测试

使用 Vitest 编写单元测试：

```typescript
import { describe, it, expect } from 'vitest'
import { getUserData } from '@/api/user'

describe('getUserData', () => {
  it('should return user data', async () => {
    const data = await getUserData('1')
    expect(data).toHaveProperty('id', '1')
  })
})
```

### E2E 测试

使用 Playwright 编写 E2E 测试：

```typescript
import { test, expect } from '@playwright/test'

test('login flow', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="username"]', 'admin')
  await page.fill('input[name="password"]', 'admin123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

## PR 审查

### 审查清单

- [ ] 代码符合项目规范
- [ ] 测试通过
- [ ] 文档已更新
- [ ] 提交信息符合规范
- [ ] 没有冲突
- [ ] CI 通过
- [ ] 至少 1 人审查通过

### 审查流程

1. 自动检查：CI 必须通过
2. 同行审查：至少 1 个维护者审查
3. Code Owner 审查：变更涉及核心文件需 Code Owner 审查
4. 测试验证：审查者可在本地验证

## 发布流程

详见 [发布流程规范](/release-process)：

1. 合并到 `develop`
2. 创建 `Pre-merge-to-main` 分支
3. 通过 PR 合并到 `main`
4. 打标签发布

## 行为准则

### 我们的承诺

为了营造开放和友好的环境，我们承诺：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性别化语言或图像
- 挑衅、侮辱或贬低评论
- 公开或私下骚扰
- 未经许可发布他人私人信息
- 其他不道德或不专业的行为

## 问题反馈

### Bug 报告

使用 [GitHub Issues](https://github.com/wangfeizong1001/yunshu-platform/issues) 报告 Bug，包含：

- 标题：简洁描述问题
- 环境：浏览器、Node.js 版本等
- 复现步骤
- 期望结果
- 实际结果
- 截图或日志

### 功能请求

使用 [GitHub Issues](https://github.com/wangfeizong1001/yunshu-platform/issues) 提出功能请求，包含：

- 标题：简洁描述功能
- 背景：为什么需要这个功能
- 方案：您建议的实现方式
- 替代方案：考虑过的其他方式

## 许可证

本项目使用 [MIT 许可证](https://github.com/wangfeizong1001/yunshu-platform/blob/main/LICENSE)。

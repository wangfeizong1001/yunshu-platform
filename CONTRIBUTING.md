# 贡献指南

感谢您对云枢中台项目的关注！我们欢迎任何形式的贡献，包括但不限于提交代码、报告问题、改进文档等。

## 📋 目录

- [行为准则](#行为准则)
- [快速开始](#快速开始)
- [开发环境](#开发环境)
- [开发流程](#开发流程)
- [提交规范](#提交规范)
- [代码规范](#代码规范)
- [测试规范](#测试规范)
- [文档规范](#文档规范)
- [版本发布](#版本发布)
- [常见问题](#常见问题)

## 行为准则

我们要求所有参与者遵守以下行为准则：

- **尊重** — 尊重他人的观点和贡献
- **包容** — 欢迎不同背景和技能水平的参与者
- **专业** — 保持专业和友好的沟通态度
- **建设性** — 提供建设性的反馈和建议

## 快速开始

### Fork 项目

1. 点击 GitHub 页面右上角的 **Fork** 按钮
2. 克隆你的 Fork 到本地：

```bash
git clone https://github.com/<your-username>/yunshu-platform.git
cd yunshu-platform
```

3. 添加上游仓库：

```bash
git remote add upstream https://github.com/wangfeizong1001/yunshu-platform.git
```

### 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install

# 配置国内镜像（可选，解决网络问题）
pnpm config set registry https://registry.npmmirror.com/
```

## 开发环境

### 环境要求

| 工具 | 版本 | 说明 |
|------|------|------|
| Node.js | >= 18.0.0 | 推荐使用 nvm 管理 Node 版本 |
| pnpm | >= 9.0.0 | 包管理器 |
| Git | 最新版本 | 版本控制 |

### 编辑器配置

我们推荐使用 **VS Code** 进行开发，并安装以下扩展：

- **Volar** — Vue 3 官方扩展
- **TypeScript Vue Plugin** — TypeScript 支持
- **ESLint** — 代码检查
- **Prettier** — 代码格式化
- **Vue - Official** — Vue 3 语法高亮

项目根目录已包含 `.vscode` 推荐配置，首次打开项目时会提示安装。

### 环境变量

开发前请复制环境变量示例文件：

```bash
cp apps/admin/.env.development apps/admin/.env.local
cp apps/admin/.env.test apps/admin/.env.test.local
```

## 开发流程

### 1. 创建功能分支

```bash
# 确保在最新代码基础上创建分支
git checkout main
git pull upstream main

# 创建新分支
git checkout -b feat/your-feature-name
# 或
git checkout -b fix/your-bug-fix-name
```

### 2. 开发代码

请遵循本指南中的代码规范进行开发。

### 3. 编写测试

为新功能编写单元测试，确保测试覆盖率不低于 80%。

### 4. 提交代码

```bash
# 添加修改的文件
git add .

# 提交（使用语义化提交信息）
git commit -m "feat(module): add new feature"
```

### 5. 推送分支

```bash
# 推送分支到你的 Fork
git push origin feat/your-feature-name
```

### 6. 创建 Pull Request

1. 在 GitHub 上打开你的 Fork 仓库
2. 点击 **Compare & pull request** 按钮
3. 填写 PR 信息：
   - 标题：使用语义化前缀
   - 描述：详细说明改动内容和动机
   - 关联 Issue：使用 `Closes #issue-number`
4. 提交 PR

### 7. 代码审查

- 等待维护者审查
- 根据反馈修改代码
- 审查通过后会被合并到主分支

## 提交规范

我们使用 **语义化提交信息** 格式。

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型 (Type)

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构（不影响功能） |
| `perf` | 性能优化 |
| `test` | 添加/修改测试 |
| `build` | 构建系统或依赖变更 |
| `ci` | CI 配置变更 |
| `chore` | 其他变更 |

### 范围 (Scope)

表示改动的包或模块，例如：
- `design-tokens`
- `api-client`
- `ui`
- `admin`

### 示例

```bash
# 新功能
git commit -m "feat(ui): add YunDatePicker component"

# Bug 修复
git commit -m "fix(api-client): fix token refresh race condition"

# 文档更新
git commit -m "docs(readme): update quick start guide"

# 重构
git commit -m "refactor(shared): extract common types to shared package"
```

## 代码规范

### TypeScript 规范

- 使用 **TypeScript 严格模式**
- 避免使用 `any`，尽量使用具体类型
- 使用接口定义数据结构
- 导出的函数和类必须有 JSDoc 注释

```typescript
/**
 * 用户信息服务
 * @description 提供用户相关的 CRUD 操作
 */
export class UserService {
  /**
   * 获取用户详情
   * @param id - 用户 ID
   * @returns 用户信息
   */
  async getById(id: string): Promise<IUser> {
    // ...
  }
}
```

### Vue 规范

- 使用 **Composition API** (`<script setup>`)
- 组件名使用 **PascalCase**
- Props 使用 TypeScript 类型定义
- 事件使用 `defineEmits` 定义

```vue
<script setup lang="ts">
interface Props {
  /** 用户名 */
  username: string;
  /** 用户角色 */
  role?: 'admin' | 'user';
}

const props = withDefaults(defineProps<Props>(), {
  role: 'user',
});

const emit = defineEmits<{
  /** 点击事件 */
  click: [event: MouseEvent];
  /** 更新事件 */
  update: [value: string];
}>();
</script>
```

### CSS/SCSS 规范

- 使用 **CSS 变量** 引用设计令牌
- 使用 **BEM** 命名规范
- 使用 **Scss** 预处理器

```scss
.component-name {
  --spacing: var(--yun-spacing-md);

  &__element {
    padding: var(--spacing);
  }

  &--modifier {
    background-color: var(--yun-color-primary);
  }
}
```

### 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue 组件 | PascalCase | `UserProfile.vue` |
| TypeScript 文件 | camelCase | `userService.ts` |
| 类型定义文件 | 以 `.type.ts` 结尾 | `user.type.ts` |
| API 文件 | 以 `.api.ts` 结尾 | `user.api.ts` |
| 常量文件 | UPPER_CASE 或 camelCase | `constants.ts` / `httpStatus.ts` |
| 样式文件 | camelCase | `commonStyles.ts` |

## 测试规范

### 测试框架

- **Vitest** — 单元测试
- **Playwright** — 端到端测试（可选）

### 编写单元测试

```typescript
// packages/shared/src/utils/__tests__/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '../format';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-01');
  });

  it('should return empty string for invalid date', () => {
    expect(formatDate(null as any, 'YYYY-MM-DD')).toBe('');
  });
});
```

### 测试覆盖率要求

- 核心业务逻辑覆盖率 >= 80%
- 工具函数覆盖率 >= 90%
- 组件测试（可选）

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 运行指定包的测试
pnpm test --filter=@yunshu/shared

# 监听模式
pnpm test --watch
```

## 文档规范

### 代码注释

- 公共 API 必须有 JSDoc 注释
- 复杂业务逻辑需要解释思路
- 使用中文编写注释

```typescript
/**
 * 计算用户的权限等级
 * @param userRoles - 用户拥有的角色列表
 * @param roleHierarchy - 角色层级关系
 * @returns 最高权限等级
 *
 * @example
 * const level = calculatePermissionLevel(['admin', 'editor'], hierarchy);
 * // => 3
 */
export function calculatePermissionLevel(
  userRoles: string[],
  roleHierarchy: Record<string, number>
): number {
  // 实现逻辑
}
```

### 更新文档

如果您的改动涉及：

- 新增 API — 更新 `API.md` 和代码注释
- 新增组件 — 添加组件文档和示例
- 变更配置 — 更新相关配置文档
- 新增功能 — 更新 `CHANGELOG.md`

## 版本发布

我们使用 **Changesets** 管理版本发布。

### 发布流程

1. **开发阶段** — 在代码中添加 `changeset` 标记

```bash
# 添加 changeset
pnpm changeset
```

选择要发布的包和版本类型：
- `patch` — 补丁版本（Bug 修复）
- `minor` — 小版本（新功能，向后兼容）
- `major` — 大版本（破坏性变更）

2. **提交代码** — changeset 会生成变更文件

3. **合并到 main** — 触发发布 workflow

4. **自动发布** — Changesets bot 会：
   - 创建 GitHub Release
   - 发布 npm 包
   - 更新 CHANGELOG

### 版本号规范

遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)：
- **主版本 (major)** — 不兼容的 API 变更
- **次版本 (minor)** — 向后兼容的功能新增
- **补丁版本 (patch)** — 向后兼容的 Bug 修复

## 常见问题

### Q: 如何配置 Git Hooks？

项目使用 **Husky** 配置 Git Hooks，在 `commit-msg` 时自动检查提交信息格式。

```bash
# 手动触发 Hooks 安装
pnpm prepare
```

### Q: 提交前需要执行哪些检查？

```bash
# 1. 运行 lint 检查
pnpm lint

# 2. 运行类型检查
pnpm type-check

# 3. 运行测试
pnpm test

# 4. 格式化代码
pnpm format
```

### Q: 如何处理 merge conflict？

```bash
# 1. 拉取最新代码
git fetch upstream

# 2. 切换到 main 分支
git checkout main
git pull upstream main

# 3. 切换回你的分支
git checkout feat/your-feature

# 4. 合并并解决冲突
git merge main
# 解决冲突后
git add .
git commit
```

### Q: 如何查看当前的改动？

```bash
# 查看未暂存的改动
git diff

# 查看已暂存的改动
git diff --cached

# 查看最近提交
git log --oneline -5
```

## 联系与支持

- **GitHub Issues** — 提交 Bug 或功能请求
- **GitHub Discussions** — 讨论和提问
- **邮箱** — support@yunshu.dev

## 致谢

感谢所有为云枢中台做出贡献的开发者！ 🙏

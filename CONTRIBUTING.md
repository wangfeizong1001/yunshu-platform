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
| Node.js | >= 20.0.0 | 推荐使用 nvm 管理 Node 版本 |
| pnpm | >= 9.0.0 | 包管理器 |
| Git | 最新版本 | 版本控制 |

#### Node.js 版本管理（可选）

推荐使用 nvm 管理 Node.js 版本：

```bash
# 安装 nvm（macOS/Linux）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装 Node.js 20
nvm install 20

# 使用 Node.js 20
nvm use 20

# 设置默认版本
nvm default 20
```

#### pnpm 安装（如未安装）

```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用 Corepack（Node.js 16+）
corepack enable
corepack prepare pnpm@latest --activate
```

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

### Git Flow 工作流

我们采用 Git Flow 工作流管理代码分支：

```
┌─────────────────────────────────────────────────────────────┐
│                      main (生产环境)                         │
│  ●────────●────────●────────●────────●────────●────────→   │
│          ↑                                                ↑  │
│          │                                                │  │
│  ┌───────┴────────────────────────────────────────┐       │  │
│  │                    release/X.Y.Z                │       │  │
│  │              ●────────────────────●            │       │  │
│  └────────────────────────────────────────────────┘       │  │
│                              ↑                              │  │
│  ┌───────────────────────────┴────────────────────────┐   │  │
│  │                    develop                          │   │  │
│  │  ●────────●────────●────────●────────●────────●───│───│───→
│  └────────────────────────────────────────────────────┘   │
│         ↑        ↑        ↑        ↑                        │
│    ┌────┴────┐ ┌─┴──┐ ┌───┴───┐ ┌──┴──┐                   │
│    │ feature/│ │fix/│ │ docs/ │ │ refactor/              │
│    │   xxx   │ │xxx │ │  xxx  │ │ xxx  │                   │
│    └─────────┘ └────┘ └───────┘ └─────┘                   │
└─────────────────────────────────────────────────────────────┘
```

#### 分支说明

| 分支类型 | 命名规范 | 说明 |
|----------|----------|------|
| main | `main` | 生产环境代码，永远保持可发布状态 |
| develop | `develop` | 开发主分支，包含下一版本的所有功能 |
| feature | `feat/<功能名>` | 新功能开发分支 |
| fix | `fix/<问题名>` | Bug 修复分支 |
| release | `release/X.Y.Z` | 发布准备分支 |
| hotfix | `hotfix/<问题名>` | 紧急热修复分支 |

#### 开发流程

1. **功能开发**
   ```bash
   # 从 develop 创建功能分支
   git checkout develop
   git pull upstream develop
   git checkout -b feat/your-feature-name

   # 开发完成后合并回 develop
   git checkout develop
   git merge --no-ff feat/your-feature-name
   git push upstream develop

   # 删除功能分支
   git branch -d feat/your-feature-name
   ```

2. **Bug 修复**
   ```bash
   # 从 develop 创建修复分支
   git checkout develop
   git checkout -b fix/issue-description

   # 修复完成后合并回 develop
   git checkout develop
   git merge --no-ff fix/issue-description
   git push upstream develop
   ```

3. **热修复**（紧急情况）
   ```bash
   # 从 main 创建热修复分支
   git checkout main
   git checkout -b hotfix/critical-issue

   # 修复后合并回 main 和 develop
   git checkout main
   git merge --no-ff hotfix/critical-issue
   git push upstream main

   git checkout develop
   git merge --no-ff hotfix/critical-issue
   git push upstream develop
   ```

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

我们使用 **Conventional Commits**（约定式提交）格式。

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### type（必需）

| 类型 | 说明 | 提交时机 |
|------|------|----------|
| `feat` | 新功能 | 新增功能时 |
| `fix` | Bug 修复 | 修复缺陷时 |
| `docs` | 文档变更 | 仅文档变更时 |
| `style` | 代码格式 | 不影响功能（空格、格式化等） |
| `refactor` | 重构 | 不修复 Bug 也不新增功能 |
| `perf` | 性能优化 | 提升性能时 |
| `test` | 测试 | 添加或修改测试时 |
| `build` | 构建变更 | 构建系统或依赖变更 |
| `ci` | CI 配置 | CI 配置文件和脚本变更 |
| `chore` | 其他变更 | 不属于其他类型时 |
| `revert` | 回退 | 回退上一个提交时 |

### scope（可选）

表示改动的包或模块，例如：
- `design-tokens`
- `api-client`
- `ui`
- `admin`
- `shared`
- `utils`

### subject（必需）

- 使用中文描述，简短精炼
- 句尾不使用句号
- 保持简短，最多 50 字符

### body（可选）

详细说明本次提交的具体内容：

- 以动词开头
- 每行不超过 72 字符
- 说明变更的目的和动机

### footer（可选）

用于关联 Issue 或中断性变更：

```
Closes #123
BREAKING CHANGE: <描述破坏性变更>
```

### 示例

```bash
# 新功能
git commit -m "feat(ui): 新增 YunDatePicker 日期选择组件"

# Bug 修复
git commit -m "fix(api-client): 修复 token 刷新竞态条件问题"

# 文档更新
git commit -m "docs: 更新快速开始文档"

# 重构
git commit -m "refactor(shared): 抽取通用类型到 shared 包"

# 性能优化
git commit -m "perf: 优化列表渲染性能"

# 破坏性变更
git commit -m "feat!: 移除旧版 API，全面迁移到 v2 版本"

# 关联 Issue
git commit -m "fix(dashboard): 修复仪表盘数据加载问题

- 添加错误边界处理
- 优化加载状态显示

Closes #456"
```

## 代码规范

### ESLint + Prettier 配置

项目使用 ESLint 进行代码检查，Prettier 进行代码格式化。

#### 配置文件

| 文件 | 说明 |
|------|------|
| `.eslintrc.js` | ESLint 配置 |
| `.prettierrc.js` | Prettier 配置 |
| `.eslintignore` | ESLint 忽略文件 |
| `.prettierignore` | Prettier 忽略文件 |

#### 运行命令

```bash
# 检查代码规范
pnpm lint

# 自动修复可修复的问题
pnpm lint:fix

# 格式化代码
pnpm format

# 格式化并检查
pnpm format:check
```

#### IDE 集成

推荐在 VS Code 中安装并配置：

```json
// .vscode/settings.json（项目已包含）
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

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

- **Vitest** — 单元测试和集成测试
- **Playwright** — 端到端测试

### 测试目录结构

```
src/
├── components/
│   └── __tests__/          # 组件测试
│       └── Button.test.tsx
├── utils/
│   └── __tests__/          # 工具函数测试
│       └── format.test.ts
└── services/
    └── __tests__/           # 服务测试
        └── user.test.ts
e2e/
├── specs/                   # E2E 测试规范
│   └── user.spec.ts
└── fixtures/               # 测试数据
```

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
- 组件测试覆盖率 >= 70%
- 所有新增代码必须包含测试

### 编写组件测试

```typescript
// packages/ui/src/components/__tests__/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/vue';
import { Button } from '../Button';

describe('Button', () => {
  it('should emit click event', async () => {
    const { getByRole, emitted } = render(Button, {
      props: { label: '点击我' },
    });
    
    await fireEvent.click(getByRole('button'));
    
    expect(emitted()).toHaveProperty('click');
  });

  it('should be disabled when loading', () => {
    const { getByRole } = render(Button, {
      props: { label: '加载中', loading: true },
    });
    
    expect(getByRole('button')).toBeDisabled();
  });
});
```

### 编写 E2E 测试

```typescript
// e2e/specs/user.spec.ts
import { test, expect } from '@playwright/test';

test.describe('用户管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users');
  });

  test('应该能创建新用户', async ({ page }) => {
    await page.getByRole('button', { name: '新增用户' }).click();
    await page.getByLabel('用户名').fill('testuser');
    await page.getByLabel('邮箱').fill('test@example.com');
    await page.getByRole('button', { name: '保存' }).click();
    
    await expect(page.getByText('testuser')).toBeVisible();
  });
});
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 运行 E2E 测试
pnpm test:e2e

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 运行指定包的测试
pnpm test --filter=@yunshu/shared

# 监听模式
pnpm test --watch
```

## 文档规范

### 文档编写要求

- 使用中文编写文档
- 保持文档与代码同步更新
- 新增功能必须附带使用示例
- API 文档必须包含参数说明和返回值类型

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

我们使用 **Changesets** 管理版本发布和自动更新 CHANGELOG。

### 发布流程

#### 1. 添加 Changeset

在开发过程中，为需要发布的改动添加 changeset：

```bash
# 交互式添加 changeset
pnpm changeset

# 或手动创建 changeset 文件
mkdir .changeset
echo -e "---\n'@yunshu/ui': patch\n---\n修复按钮组件点击事件问题" > .changeset/fix-button-click.md
```

Changeset 文件格式：

```markdown
---
'@yunshu/ui': patch      # 包名：版本类型
---

修复按钮组件点击事件问题  # 变更描述
```

#### 2. 版本类型选择

| 类型 | 适用场景 | 示例版本号 |
|------|----------|-----------|
| `patch` | Bug 修复，向后兼容 | 1.0.0 → 1.0.1 |
| `minor` | 新功能，向后兼容 | 1.0.0 → 1.1.0 |
| `major` | 破坏性变更，不兼容 | 1.0.0 → 2.0.0 |

#### 3. 提交 Changeset

```bash
git add .changeset
git commit -m "chore: add changeset for v1.0.1"
```

#### 4. 合并到 main 分支

将包含 changeset 的 PR 合并到 main 分支，触发发布 workflow。

#### 5. 自动发布

Changesets bot 会自动：
- 创建 GitHub Release 和对应 tag
- 发布 npm 包到仓库
- 在 PR 中添加版本更新注释
- 更新 CHANGELOG.md

### 版本号规范

遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)：
- **主版本 (major)** — 不兼容的 API 变更
- **次版本 (minor)** — 向后兼容的功能新增
- **补丁版本 (patch)** — 向后兼容的 Bug 修复

### 预览发布

在合并前可以预览版本变更：

```bash
# 预览发布内容
pnpm changeset version

# 预览但不下定论
pnpm changeset version --dry
```

## 常见问题

### Q: 如何配置 Git？

首次使用 Git 时，建议进行以下配置：

```bash
# 设置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 启用颜色输出
git config --global color.ui auto

# 设置默认分支名
git config --global init.defaultBranch main

# 设置 pull 策略为 rebase（避免多余 merge 提交）
git config --global pull.rebase true

# 设置 push 策略
git config --global push.default current
```

### Q: pnpm 安装失败怎么办？

```bash
# 清除缓存后重试
npm cache clean --force
npm install -g pnpm

# 或使用国内镜像安装
npm install -g pnpm --registry=https://registry.npmmirror.com/

# 或使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com/
cnpm install -g pnpm
```

### Q: 安装依赖失败怎么办？

```bash
# 清除 node_modules 和 lock 文件后重试
rm -rf node_modules pnpm-lock.yaml

# 使用国内镜像
pnpm config set registry https://registry.npmmirror.com/
pnpm install

# 如遇 node-gyp 构建问题，配置 Python 镜像
npm config set python https://registry.npmmirror.com/simple/python
```

### Q: 如何配置 Git Hooks？

项目使用 **Husky** 配置 Git Hooks，在 `commit-msg` 时自动检查提交信息格式。

```bash
# 手动触发 Hooks 安装
pnpm prepare

# 如需跳过 Hooks（不推荐）
git commit --no-verify -m "fix: 修复问题"
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

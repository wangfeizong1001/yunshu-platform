# ☁️ 云枢中台 (Yunshu Platform)

> 开箱即用的中台前端/设计解决方案 — 沉淀自云枢网站导航系统生产级代码

[快速开始](#-快速开始) • [特性](#-特性) • [包列表](#-包列表) • [项目结构](#-项目结构) • [开发指南](#-开发指南) • [工作流程](#-工作流程) • [文档](#-文档)

---

## ✨ 特性

### 🎨 设计系统

- **完整的设计令牌系统** — 颜色、字体、间距、阴影等设计决策的标准化
- **多格式输出** — 支持 CSS/SCSS/JS/Tailwind 等多种格式
- **双主题支持** — 浅色/深色主题，开箱即用
- **无障碍标准** — 遵循 WCAG AA 级对比度标准

### 🚀 开发效率

- **代码生成器** — 一键生成前后端代码，提升开发效率
- **动态路由** — 根据用户权限自动生成菜单
- **Mock 数据** — 无需后端即可进行前端开发，包含完整的业务场景模拟
- **国际化** — 支持中英文切换，开箱即用
- **运行时校验** — 使用 Zod 进行数据类型校验

### 🔐 企业级权限

- **RBAC 权限模型** — 基于角色的访问控制
- **按钮级权限控制** — 精确到按钮的权限管理
- **数据权限控制** — 细粒度的数据访问控制
- **多租户 SaaS** — 支持多租户架构

### 📊 系统监控

- **操作日志** — 记录用户关键操作
- **登录日志** — 完整的登录审计
- **在线用户** — 实时监控在线用户
- **服务监控** — 系统健康状态监控
- **定时任务** — 支持 Cron 表达式的任务调度

### 🛠️ 基础设施

- **Monorepo 架构** — 使用 Turborepo 管理多包仓库
- **TypeScript 严格模式** — 完整的类型安全
- **完善的错误处理** — 统一的错误处理体系
- **CI/CD 自动化** — GitHub Actions 自动化构建、测试、部署
- **E2E 测试** — Playwright 端到端测试
- **结构化日志** — Winston + Loki 集中收集
- **缓存与分布式锁** — Redis + 布隆过滤器防穿透

### 📋 业务模块

| 模块 | 说明 |
|------|------|
| **用户管理** | 完整的用户 CRUD、角色分配、密码重置 |
| **角色权限** | 角色管理、权限分配、数据范围配置 |
| **部门管理** | 树形组织架构 |
| **菜单管理** | 动态菜单与路由配置 |
| **岗位管理** | 岗位定义与分配 |
| **字典管理** | 系统字典与枚举值管理 |
| **参数配置** | 系统参数动态配置 |
| **文件管理** | 文件上传、下载与管理 |
| **表单设计器** | 可视化表单构建 |
| **知识库** | 知识文档创作与管理 |
| **消息中心** | 站内消息发送与接收 |
| **通知公告** | 系统通知发布管理 |
| **OSS 对象存储** | 多存储源适配（本地/阿里云/七牛/腾讯云） |
| **工作流引擎** | 流程设计、审批、实例管理 |
| **报表引擎** | 报表设计、预览、导出 |
| **大屏看板** | 企业级数据可视化大屏 |
| **多租户** | 租户与套餐管理 |
| **SSO 单点登录** | 标准协议接入 |
| **短信服务** | 多供应商短信服务集成 |
| **第三方登录** | 微信、钉钉、企业微信等一键登录 |
| **代码生成** | 一键生成前后端 CRUD 代码 |

---

## 📦 包列表

| 包名 | 说明 | 状态 |
|------|------|------|
| `@yunshu/design-tokens` | 设计令牌 — CSS/SCSS/JS/Tailwind 多格式输出 | ✅ |
| `@yunshu/shared` | 共享类型和工具函数 | ✅ |
| `@yunshu/api-client` | HTTP 客户端 — 请求去重/缓存/Token 刷新 | ✅ |
| `@yunshu/ui` | Vue 3 UI 组件库 — 三层架构 | ✅ |
| `@yunshu/server-core` | 后端核心 — BaseService/装饰器/错误体系/缓存/分布式锁 | ✅ |
| `@yunshu/server-express` | Express 适配器 — Controller/中间件/i18n/限流/上传安全 | ✅ |
| `@yunshu/cli` | 脚手架 CLI — 项目创建/代码生成 | ✅ |
| `@yunshu/admin` | 后台管理应用 — Vue 3 + Element Plus | ✅ |
| `@yunshu/docs` | 文档站点 — VitePress | ✅ |

---

## 🚀 快速开始

### 环境要求

| 工具 | 版本要求 |
|------|---------|
| Node.js | >= 20.0.0 |
| pnpm | >= 9.0.0 |

### 安装

```bash
# 克隆项目
git clone https://github.com/wangfeizong1001/yunshu-platform.git
cd yunshu-platform

# 安装依赖（使用 pnpm）
pnpm install

# 如果遇到网络问题，请配置国内镜像
pnpm config set registry https://registry.npmmirror.com/
```

### 开发模式

```bash
# 启动所有包开发模式
pnpm dev

# 启动管理后台
pnpm dev --filter=@yunshu/admin

# 启动文档站点
pnpm docs:dev
```

访问 http://localhost:5173 查看管理后台。

### 构建

```bash
# 构建所有包
pnpm build

# 构建并发布
pnpm release
```

### 测试

```bash
# 运行所有测试
pnpm test

# 运行单元测试（指定包）
pnpm test --filter=@yunshu/server-core

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

### 代码质量

```bash
# 代码格式化和检查
pnpm lint

# 类型检查
pnpm type-check

# 代码格式化（仅格式化）
pnpm format
```

### Docker Compose 部署

```bash
# 一键启动（PostgreSQL + Redis + 后端 + 前端）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 🏗️ 项目结构

```
yunshu-platform/
├── apps/                          # 应用
│   ├── admin/                     # 后台管理应用 (Vue 3 + Element Plus)
│   │   ├── src/
│   │   │   ├── api/               # API 接口模块
│   │   │   │   ├── system/        # 系统模块
│   │   │   │   ├── monitor/       # 监控模块
│   │   │   │   ├── tenant/        # 租户模块
│   │   │   │   └── tool/          # 工具模块
│   │   │   ├── components/        # 公共业务组件
│   │   │   ├── composables/       # 组合式函数
│   │   │   ├── directives/        # 自定义指令
│   │   │   ├── layouts/           # 布局组件
│   │   │   ├── locales/           # 国际化资源
│   │   │   ├── mock/              # Mock 数据
│   │   │   ├── router/            # 路由配置
│   │   │   ├── store/             # Pinia 状态管理
│   │   │   ├── styles/            # 样式系统
│   │   │   ├── utils/             # 工具函数（含安全工具）
│   │   │   │   └── security/      # 安全相关工具
│   │   │   └── views/             # 页面组件
│   │   │       ├── system/        # 系统管理
│   │   │       ├── monitor/       # 系统监控
│   │   │       ├── tenant/        # 多租户
│   │   │       ├── workflow/      # 工作流
│   │   │       ├── report/        # 报表引擎
│   │   │       └── dashboard-pro/ # 大屏看板
│   │   └── Dockerfile             # Docker 配置
│   │
│   └── docs/                      # 文档站点 (VitePress)
│
├── packages/                      # 共享包
│   ├── design-tokens/             # 设计令牌
│   ├── shared/                    # 共享类型
│   ├── api-client/                # API 客户端
│   ├── ui/                        # Vue 3 组件库
│   ├── server-core/               # 后端核心
│   ├── server-express/            # Express 适配器
│   └── cli/                       # CLI 脚手架
│
├── examples/                      # 示例代码
├── .github/                       # GitHub Actions
├── docs/                          # 项目文档
└── package.json                   # 根 workspace 配置
```

---

## 🛠️ 开发指南

### 创建新页面

#### 1. 创建页面组件

```vue
<!-- src/views/example/ExamplePage.vue -->
<template>
  <div class="example-page">
    <h1>{{ t('example.title') }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
```

#### 2. 配置路由

```typescript
// src/router/index.ts
import type { RouteRecordRaw } from 'vue-router';

export const exampleRoutes: RouteRecordRaw[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('@/views/example/ExamplePage.vue'),
    meta: {
      title: '示例页面',
      icon: 'ri:guide-line',
      permission: 'example:view',
    },
  },
];
```

#### 3. 添加 API 接口

```typescript
// src/api/example.api.ts
import request from '@/utils/request';

export interface ExampleQuery {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
}

export const getExampleList = (params: ExampleQuery) => {
  return request({
    url: '/example/list',
    method: 'get',
    params,
  });
};
```

### 使用 API 客户端

```typescript
// packages/api-client 使用示例
import { useUser } from '@yunshu/api-client';

// 获取用户列表
const { data, loading, pagination, fetchData } = useUser();

// 搜索用户
await fetchData({ keyword: 'admin', pageNum: 1, pageSize: 10 });

// 获取用户详情
const user = await useUser().getById(1);
```

### 使用设计令牌

```typescript
// 在 JavaScript/TypeScript 中使用
import tokens from '@yunshu/design-tokens';

console.log('Primary color:', tokens.color.primary);
console.log('Font size:', tokens.font.size.base);
```

```scss
// 在 SCSS 中使用
@use '@yunshu/design-tokens/scss' as tokens;

.button {
  background-color: tokens.$color-primary;
  padding: tokens.$spacing-4 tokens.$spacing-6;
}
```

---

## 🔄 工作流程

### 分支管理

```
main — 主线分支，稳定版本，仅接受经过测试的代码
develop — 开发分支，用于日常开发整合
feature/* — 功能分支，从 develop 创建
fix/* — Bug 修复分支，从 develop 创建
release/* — 发布准备分支
hotfix/* — 生产紧急修复，从 main 创建
```

### 开发流程

```bash
# 1. 从 develop 创建功能分支
git checkout develop
git checkout -b feat/your-feature-name

# 2. 开发完成后，提交代码
#    提交信息遵循语义化提交规范
git add .
git commit -m "feat(module): 添加新功能"

# 3. 推送到远程
git push origin feat/your-feature-name

# 4. 创建 Pull Request 到 develop
# 5. 代码审查通过后，合并到 develop

# 6. 准备发布时，将 develop 合并到 main
git checkout main
git merge develop
git tag v1.0.0
git push origin main --tags
```

### 提交规范

遵循 **Conventional Commits**（约定式提交）格式：

| 类型 | 说明 |
|------|------|
| `feat` | 新增功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 代码格式 |
| `refactor` | 重构（非新增功能也非 Bug 修复） |
| `perf` | 性能优化 |
| `test` | 测试 |
| `build` | 构建系统或依赖变更 |
| `ci` | CI 配置变更 |
| `chore` | 其他杂项 |

**示例**：

```bash
# 新功能
git commit -m "feat(ui): 新增 YunDatePicker 日期选择组件"

# Bug 修复
git commit -m "fix(api-client): 修复 token 刷新竞态条件问题"

# 文档更新
git commit -m "docs: 更新快速开始文档"
```

### CI/CD 流程

| 环境 | 触发条件 | 说明 |
|------|---------|------|
| CI | PR / push | 代码检查、单元测试、构建 |
| E2E | PR / 手动 | Playwright 端到端测试 |
| Staging | push to main | 自动部署到预发布环境 |
| Production | 手动触发 | 手动部署到生产环境 |

---

## 📚 文档

更多文档请访问 `docs/` 目录。

| 文档 | 位置 | 说明 |
|------|------|------|
| **快速开始** | [docs/getting-started.md](docs/getting-started.md) | 5 分钟快速上手 |
| **开发指南** | [DEVELOP.md](DEVELOP.md) | 详细的开发规范和流程 |
| **部署指南** | [DEPLOY.md](DEPLOY.md) | 生产环境部署 |
| **贡献指南** | [CONTRIBUTING.md](CONTRIBUTING.md) | 如何参与项目开发 |
| **安全策略** | [SECURITY.md](SECURITY.md) | 安全报告和漏洞处理 |
| **更新日志** | [CHANGELOG.md](CHANGELOG.md) | 版本变更记录 |
| **常见问题** | [docs/faq.md](docs/faq.md) | FAQ 文档 |
| **架构总览** | [docs/architecture/architecture.md](docs/architecture/architecture.md) | 系统架构说明 |
| **数据库与缓存** | [docs/architecture/database-cache.md](docs/architecture/database-cache.md) | 缓存架构与优化 |
| **权限体系** | [docs/architecture/permission.md](docs/architecture/permission.md) | RBAC 权限设计 |
| **多租户架构** | [docs/architecture/multi-tenant.md](docs/architecture/multi-tenant.md) | SaaS 多租户方案 |
| **测试指南** | [docs/testing/testing-guide.md](docs/testing/testing-guide.md) | 单元测试和 E2E 测试 |
| **组件开发** | [docs/development/component.md](docs/development/component.md) | 组件开发规范 |
| **API 规范** | [docs/development/api.md](docs/development/api.md) | API 设计规范 |
| **国际化** | [docs/development/i18n.md](docs/development/i18n.md) | 多语言支持 |

---

## 📖 学习资源

| 资源 | 说明 |
|------|------|
| [Vue 3 文档](https://vuejs.org/) | Vue 3 官方文档 |
| [TypeScript 文档](https://www.typescriptlang.org/) | TypeScript 官方文档 |
| [Element Plus](https://element-plus.org/) | 基于 Vue 3 的组件库 |
| [Vite 文档](https://vitejs.dev/) | 下一代前端构建工具 |
| [Turborepo](https://turbo.build/repo) | 高性能构建系统 |
| [Playwright](https://playwright.dev/) | E2E 测试框架 |
| [Zod](https://zod.dev/) | TypeScript 运行时校验 |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

请阅读 [贡献指南](CONTRIBUTING.md) 了解如何参与项目开发。

---

## 📄 许可证

MIT License

用 ❤️ 打造，为每个中台项目提供坚实底座

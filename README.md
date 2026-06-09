<p align="center">
  <h1>☁️ 云枢中台 (Yunshu Platform)</h1>
</p>

<p align="center">
  开箱即用的中台前端/设计解决方案 — 沉淀自云枢网站导航系统 ~238,000 行生产级代码
</p>

<p align="center">
  <a href="https://github.com/wangfeizong1001/yunshu-platform/actions/workflows/ci.yml">
    <img src="https://github.com/wangfeizong1001/yunshu-platform/actions/workflows/ci.yml/badge.svg" alt="CI Status">
  </a>
  <a href="https://www.npmjs.com/package/@yunshu/shared">
    <img src="https://img.shields.io/npm/v/@yunshu/shared.svg" alt="npm">
  </a>
  <a href="https://www.npmjs.com/package/@yunshu/ui">
    <img src="https://img.shields.io/npm/v/@yunshu/ui.svg" alt="npm">
  </a>
  <a href="https://github.com/wangfeizong1001/yunshu-platform/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/wangfeizong1001/yunshu-platform" alt="License">
  </a>
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> •
  <a href="#特性">特性</a> •
  <a href="#包列表">包列表</a> •
  <a href="#项目结构">项目结构</a> •
  <a href="#开发指南">开发指南</a> •
  <a href="#工作流程">工作流程</a> •
  <a href="https://docs.yunshu.dev">文档</a>
</p>

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
- **完善的错误处理** — 统一的 PostgreSQL 错误处理体系（唯一约束、外键、非空等）
- **CI/CD 自动化** — GitHub Actions 自动化构建、测试、部署
- **E2E 测试** — Playwright 端到端测试

### 🗄️ 数据层架构

- **PostgreSQL 16** — 主数据库，支持 JSONB、分区表、CTE 等高级特性
- **Redis 7** — 缓存与分布式锁，支持二级缓存（L1 内存 + L2 Redis）
- **布隆过滤器** — 防止缓存穿透，优化热点键保护
- **代码生成器** — 一键生成数据库表结构、Service、Repository 与前后端 CRUD 代码

### 🔄 缓存架构

- **二级缓存** — L1（进程内 LRU）+ L2（Redis）组合
- **装饰器模式** — `@cacheable` 风格声明式缓存注解
- **分布式锁** — 基于 Redis 的 SETNX + 过期机制，防并发更新
- **缓存预热** — 服务启动时自动加载热点数据
- **Ttl + Jitter** — 随机抖动避免缓存雪崩

### 📋 业务模块

- **用户管理** — 完整的用户 CRUD、导入导出
- **角色权限** — 角色管理、权限分配、数据范围配置
- **菜单管理** — 动态菜单配置
- **部门管理** — 树形部门结构
- **字典管理** — 字典类型和字典数据
- **通知公告** — 通知发布和管理
- **消息中心** — 站内消息发送和接收
- **表单设计器** — 可视化表单构建
- **知识库** — 知识文档管理
- **工作流引擎** — 流程设计、审批、历史记录
- **报表中心** — 报表设计和预览

---

## 📦 包列表

| 包名 | 说明 | 状态 |
|------|------|------|
| [`@yunshu/design-tokens`](./packages/design-tokens) | 设计令牌 — CSS/SCSS/JS/Tailwind 多格式输出 | ✅ |
| [`@yunshu/shared`](./packages/shared) | 共享类型和工具函数 | ✅ |
| [`@yunshu/api-client`](./packages/api-client) | HTTP 客户端 — 请求去重/缓存/Token 刷新 | ✅ |
| [`@yunshu/ui`](./packages/ui) | Vue 3 UI 组件库 — 三层架构 | ✅ |
| [`@yunshu/server-core`](./packages/server-core) | 后端核心 — BaseService/装饰器/错误体系 | ✅ |
| [`@yunshu/server-express`](./packages/server-express) | Express 适配器 — Controller/中间件/i18n | ✅ |
| [`@yunshu/cli`](./packages/cli) | 脚手架 CLI — 项目创建/代码生成 | 🚧 开发中 |

---

## 🚀 快速开始

### 环境要求

| 工具 | 版本要求 |
|------|----------|
| Node.js | >= 20.0.0 |
| pnpm | >= 9.0.0 |
| Docker | >= 20.10（推荐本地开发时启动 PostgreSQL + Redis） |

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

### 启动数据库与缓存

项目使用 **PostgreSQL 16** 作为主数据库，**Redis 7** 作为缓存和分布式锁中间件。

```bash
# 使用 Docker Compose 一键启动 PostgreSQL + Redis
docker-compose up -d

# 查看服务状态
docker-compose ps
```

| 服务 | 端口 | 说明 |
|------|------|------|
| PostgreSQL | 5432 | 数据库名：`yunshu`，用户：`yunshu`，密码：`yunshupassword` |
| Redis | 6379 | 无密码，默认 DB 0 |

### 开发模式

```bash
# 启动所有包开发模式
pnpm dev

# 启动管理后台
pnpm dev --filter=@yunshu/admin

# 启动文档站点
pnpm docs:dev

# 启动 Playground
pnpm playground:dev
```

### 数据库初始化与代码生成

```bash
# 1. 使用代码生成器生成表结构 SQL
pnpm gen:sql

# 2. 运行代码生成（前端 CRUD + 后端 Service + Repository）
pnpm gen

# 3. 生成的 SQL 文件位于 packages/server-express/src/modules/gen/templates/
```

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

# 运行 E2E 测试
pnpm test:e2e
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

### Docker 部署

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps
```

---

## 🏗️ 项目结构

```
yunshu-platform/
├── apps/
│   ├── admin/                    # 后台管理应用 (Vue 3 + Element Plus)
│   │   ├── src/
│   │   │   ├── api/            # API 接口定义
│   │   │   ├── assets/         # 静态资源
│   │   │   ├── components/     # 公共组件
│   │   │   ├── composables/     # 组合式函数
│   │   │   ├── config/         # 配置文件
│   │   │   ├── directives/     # 自定义指令
│   │   │   ├── layouts/        # 布局组件
│   │   │   ├── locales/        # 国际化资源
│   │   │   ├── mock/           # Mock 数据
│   │   │   ├── router/         # 路由配置
│   │   │   ├── store/          # 状态管理
│   │   │   ├── styles/         # 全局样式
│   │   │   ├── types/          # 类型定义
│   │   │   ├── utils/          # 工具函数
│   │   │   └── views/          # 页面组件
│   │   └── Dockerfile          # Docker 配置
│   │
│   └── docs/                    # 文档站点 (VitePress)
│
├── packages/
│   ├── design-tokens/           # 设计令牌
│   │   ├── src/
│   │   │   ├── tokens/         # 设计令牌定义
│   │   │   ├── generators/      # 格式生成器
│   │   │   └── scripts/        # 构建脚本
│   │   └── package.json
│   │
│   ├── shared/                  # 共享类型和工具
│   │   ├── src/
│   │   │   ├── types/          # 类型定义
│   │   │   │   ├── system/      # 系统模块类型
│   │   │   │   ├── monitor/     # 监控模块类型
│   │   │   │   ├── tenant/      # 租户模块类型
│   │   │   │   └── gen/         # 代码生成类型
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── api-client/              # API 客户端
│   │   ├── src/
│   │   │   ├── system/         # 系统模块 API
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ui/                      # Vue 3 组件库
│   │   ├── src/
│   │   │   ├── primitives/     # 基础组件
│   │   │   ├── business/        # 业务组件
│   │   │   ├── composables/     # 组合式函数
│   │   │   └── styles/          # 组件样式
│   │   └── package.json
│   │
│   ├── server-core/             # 后端核心
│   │   ├── src/
│   │   │   ├── base/            # 基础服务
│   │   │   ├── decorators/      # 装饰器
│   │   │   ├── modules/         # 业务模块
│   │   │   │   └── monitor/     # 监控模块
│   │   │   └── errors/          # 错误体系
│   │   └── package.json
│   │
│   ├── server-express/          # Express 适配器
│   │   ├── src/
│   │   │   ├── controllers/     # 控制器
│   │   │   ├── middlewares/     # 中间件
│   │   │   ├── modules/         # 业务模块
│   │   │   │   ├── gen/         # 代码生成
│   │   │   │   ├── monitor/     # 监控管理
│   │   │   │   ├── system/      # 系统管理
│   │   │   │   ├── tenant/      # 租户管理
│   │   │   │   ├── sms/         # 短信服务
│   │   │   │   ├── sso/         # SSO单点登录
│   │   │   │   └── third/       # 第三方登录
│   │   │   └── i18n/            # 国际化
│   │   └── package.json
│   │
│   └── cli/                     # CLI 脚手架
│       ├── src/
│       │   └── commands/        # 命令
│       └── package.json
│
├── examples/                    # 示例代码
│   ├── api-client/             # API 客户端示例
│   ├── basic/                  # 基础示例
│   ├── code-gen/               # 代码生成示例
│   ├── code-templates/          # 代码模板
│   ├── i18n/                   # 国际化示例
│   └── permission/              # 权限示例
│
├── tools/                       # 开发工具
│   └── tsconfig/               # TypeScript 配置
│
├── .github/
│   └── workflows/              # GitHub Actions
│       └── ci.yml              # CI/CD 工作流
│
├── docs/                        # 项目文档
├── README.md                    # 项目说明
├── CONTRIBUTING.md             # 贡献指南
├── DEVELOP.md                  # 开发指南
├── DEPLOY.md                   # 部署指南
├── API.md                      # API 文档
├── OPENAPI.md                  # OpenAPI 规范
├── CHANGELOG.md                # 更新日志
├── docker-compose.yml          # Docker Compose
├── Dockerfile                  # Docker 配置
├── playwright.config.ts        # E2E 测试配置
└── package.json                # 根 package.json
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
    <el-button type="primary" @click="handleClick">
      {{ t('example.button') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const loading = ref(false)

const handleClick = () => {
  console.log('Button clicked')
}
</script>

<style scoped>
.example-page {
  padding: 24px;
}
</style>
```

#### 2. 配置路由

```typescript
// src/router/index.ts
import type { RouteRecordRaw } from 'vue-router'

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
]
```

#### 3. 添加 API 接口

```typescript
// src/api/example.api.ts
import request from '@/utils/request'

export interface ExampleQuery {
  pageNum?: number
  pageSize?: number
  keyword?: string
}

export interface ExampleInfo {
  id: number
  name: string
  status: string
}

export const getExampleList = (params: ExampleQuery) => {
  return request({
    url: '/example/list',
    method: 'get',
    params,
  })
}

export const getExampleById = (id: number) => {
  return request({
    url: `/example/${id}`,
    method: 'get',
  })
}
```

### 使用 API 客户端

```typescript
// packages/api-client 使用示例
import { useUser } from '@yunshu/api-client'

// 获取用户列表
const { data, loading, pagination, fetchData } = useUser()

// 搜索用户
await fetchData({ keyword: 'admin', pageNum: 1, pageSize: 10 })

// 获取用户详情
const user = await useUser().getById(1)
```

### 使用设计令牌

```typescript
// 在 JavaScript/TypeScript 中使用
import tokens from '@yunshu/design-tokens'

console.log('Primary color:', tokens.color.primary)
console.log('Font size:', tokens.font.size.base)
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
main          — 主线分支，稳定版本
develop       — 开发分支，用于日常开发
feature/*     — 功能分支
fix/*         — 修复分支
```

### 开发流程

```bash
# 1. 从 develop 创建功能分支
git checkout develop
git checkout -b feature/xxx

# 2. 开发完成后，提交代码
git add .
git commit -m "feat: 新功能描述"

# 3. 推送到远程
git push origin feature/xxx

# 4. 创建 Pull Request 到 develop
# 5. 代码审查通过后，合并到 develop

# 6. 准备发布时，将 develop 合并到 main
git checkout main
git merge develop
git tag v1.0.0
git push origin main --tags
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

更多文档请访问 [云枢文档站](https://docs.yunshu.dev)。

| 文档 | 说明 |
|------|------|
| [快速开始](https://docs.yunshu.dev/guide/quick-start) | 5 分钟快速上手 |
| [设计令牌](https://docs.yunshu.dev/guide/design-tokens) | 设计系统令牌详解 |
| [权限设计](https://docs.yunshu.dev/guide/permission) | RBAC 权限模型 |
| [国际化](https://docs.yunshu.dev/guide/i18n) | 多语言支持 |
| [代码生成](https://docs.yunshu.dev/guide/gen) | 代码生成器使用 |
| [部署指南](./DEPLOY.md) | 生产环境部署 |
| [开发指南](./DEVELOP.md) | 开发规范 |
| [API 文档](./API.md) | API 接口文档 |
| [贡献指南](./CONTRIBUTING.md) | 如何贡献代码 |

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

请阅读 [贡献指南](./CONTRIBUTING.md) 了解如何参与项目开发。

---

## 📄 许可证

MIT License

---

<p align="center">
  用 ❤️ 打造，为每个中台项目提供坚实底座
</p>

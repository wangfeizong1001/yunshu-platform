<p align="center">
  <h1>☁️ 云枢中台 (Yunshu Platform)</h1>
</p>

<p align="center">
  开箱即用的中台前端/设计解决方案 — 沉淀自云枢网站导航系统 ~238,000 行生产级代码
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> •
  <a href="#包列表">包列表</a> •
  <a href="#架构">架构</a> •
  <a href="https://docs.yunshu.dev">文档</a>
</p>

---

## 快速开始

```bash
# 使用脚手架创建新项目
npm create yunshu my-app

# 或手动安装所需包
pnpm add @yunshu/api-client @yunshu/ui @yunshu/server-express
```

## 包列表

| 包名 | 说明 | 状态 |
|------|------|------|
| [`@yunshu/design-tokens`](./packages/design-tokens) | 设计令牌 — CSS/SCSS/JS 多格式输出 | 🚧 开发中 |
| [`@yunshu/shared`](./packages/shared) | 共享类型和工具函数 | 🚧 开发中 |
| [`@yunshu/api-client`](./packages/api-client) | HTTP 客户端 — 请求去重/缓存/Token 刷新 | 🚧 开发中 |
| [`@yunshu/ui`](./packages/ui) | Vue 3 UI 组件库 — 三层架构 | 🚧 开发中 |
| [`@yunshu/server-core`](./packages/server-core) | 后端核心 — BaseService/装饰器/错误体系 | 🚧 开发中 |
| [`@yunshu/server-express`](./packages/server-express) | Express 适配器 — BaseController/中间件 | 🚧 开发中 |
| [`@yunshu/admin-pro`](./packages/admin-pro) | 后台管理 Pro 版 — 开箱即用 | 📋 计划中 |
| [`@yunshu/cli`](./packages/cli) | 脚手架 CLI — 项目创建/代码生成 | 📋 计划中 |

## 架构

```
                         @yunshu/design-tokens
                         (平台无关，纯数据)
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
  @yunshu/ui              @yunshu/api-client      @yunshu/server-core
  (Vue 3 组件)            (core + 适配器)          (框架无关核心)
        │                       │                       │
        ▼                       ▼                       ▼
  @yunshu/admin-pro       Vue/React 适配器       @yunshu/server-express
  (开箱即用后台)                                 (Express 适配器)
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 启动文档站点
pnpm docs:dev
```

## 从云枢迁移

本平台的核心代码沉淀自[云枢网站导航系统](https://github.com/your-org/yunshu)，如果你正在使用云枢，请参考[迁移指南](./docs/migration.md)。

## 许可

MIT

---

<p align="center">
  用 ❤️ 打造，为每个中台项目提供坚实底座
</p>

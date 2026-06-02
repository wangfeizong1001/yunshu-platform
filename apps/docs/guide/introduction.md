# 简介

## 什么是云枢中台？

云枢中台 (Yunshu Platform) 是一个**开箱即用的中台前端/设计解决方案**，沉淀自[云枢网站导航系统](https://github.com/your-org/yunshu)约 238,000 行生产级代码。

它不是又一个 UI 组件库，而是一套**完整的、经过生产验证的中台基础设施**，涵盖：

- 🎨 **设计令牌** — 平台无关的设计决策数据
- 🚀 **API 客户端** — 带请求去重、缓存、Token 刷新的 HTTP 客户端
- 📦 **UI 组件库** — 基于设计令牌的三层 Vue 3 组件架构
- ⚙️ **后端核心** — BaseService + 装饰器 + 统一错误处理
- 🏗️ **Admin Pro** — 开箱即用的后台管理方案
- 🔧 **CLI 工具** — 项目创建、代码生成、主题定制

## 核心设计理念

### 1. 分层解耦

```
设计令牌 (平台无关)
    ↓
基础设施 (框架无关核心 + 适配器)
    ↓
业务组件 (开箱即用)
```

每一层都可以**独立使用**，不需要引入整个平台。

### 2. 框架无关核心

核心逻辑不依赖任何特定框架：
- **API 客户端**：纯 TypeScript 核心 + Vue/React 适配器
- **后端服务**：纯 TypeScript 核心 + Express/NestJS 适配器
- **设计令牌**：纯数据 → 生成器 → 目标格式

### 3. 生产级质量

所有代码来自 238,000 行生产级项目的提炼，经过：
- 百万级用户访问验证
- 全类型安全（TypeScript strict 模式）
- 完整错误处理体系
- 性能优化（缓存/去重/懒加载）

## 快速开始

```bash
# 使用脚手架创建项目（推荐）
npm create yunshu my-app

# 或按需安装
pnpm add @yunshu/api-client @yunshu/ui
pnpm add @yunshu/server-express @yunshu/server-core
```

## 包列表

| 包名 | 说明 |
|------|------|
| `@yunshu/design-tokens` | 设计令牌 — 输出 CSS/SCSS/JS/Tailwind 多格式 |
| `@yunshu/shared` | 前后端共享类型和工具函数 |
| `@yunshu/api-client` | HTTP 客户端 — 去重/缓存/Token 刷新 |
| `@yunshu/ui` | Vue 3 UI 组件库 — 三层架构 |
| `@yunshu/server-core` | 后端核心 — BaseService/装饰器/错误体系 |
| `@yunshu/server-express` | Express 适配器 — BaseController/中间件 |
| `@yunshu/admin-pro` | 后台管理 Pro 版（计划中） |
| `@yunshu/cli` | CLI 脚手架（计划中） |

# Changelog

所有重要的项目变更都将在此文件中记录。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
项目版本遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [0.2.0] - 2026-06-09

### Added

- ✨ 后台管理应用完整功能（Vue 3 + Element Plus）
- ✨ 用户管理完整 CRUD
- ✨ 角色权限管理完整 CRUD
- ✨ 部门管理完整 CRUD
- ✨ 菜单管理完整 CRUD
- ✨ 监控模块：操作日志、登录日志
- ✨ 监控模块：在线用户、服务器监控
- ✨ 监控模块：定时任务
- ✨ 业务模块：消息中心
- ✨ 业务模块：通知公告
- ✨ 业务模块：知识库
- ✨ 业务模块：OSS 文件管理
- ✨ 工作流引擎：流程设计器
- ✨ 工作流引擎：待办/已办任务
- ✨ 工作流引擎：流程实例
- ✨ 表单设计器：拖拽式表单构建
- ✨ 报表引擎：报表设计、预览、导出
- ✨ 大屏看板：企业监控大屏

### Changed

- 🔧 Monorepo 架构完善（Turborepo）
- 🔧 TypeScript 严格模式启用
- 🔧 国际化：中英文支持

### Fixed

- 🐛 运行时类型校验（Zod）

### Testing

- ✅ 完整的单元测试（Vitest）
- ✅ E2E 测试（Playwright）

### Infrastructure

- 🚀 CI/CD 自动化（GitHub Actions）
- 🚀 Docker 容器化部署
- 🚀 Mock 数据完整覆盖

## [0.1.0] - 2024-01-08

### Added
- ✨ 完整的系统管理 API（用户、角色、菜单、部门、岗位）
- ✨ 完整的系统监控 API（操作日志、登录日志、在线用户、服务器监控、定时任务）
- ✨ 完整的工具 API（代码生成器）
- ✨ 完整的工具函数库（权限、验证、下载、日期、存储、滚动、树形处理）
- ✨ 专业美观的登录页面
- ✨ 完整的主布局系统（侧边栏、顶部栏、标签页）
- ✨ 完善的路由配置和权限控制
- ✨ 环境变量配置（开发、生产环境）
- ✨ TypeScript 类型声明
- ✨ 完整的 Mock 数据

### Changed
- 🔧 优化用户 Store 和权限 Store
- 🔧 优化 API 导入路径
- 🔧 完善 HTTP 请求工具（request.ts）
- 🔧 优化路由守卫逻辑

### Fixed
- 🐛 修复 API 导入路径错误
- 🐛 修复工具函数语法错误
- 🐛 修复 Store 初始化逻辑

## [0.0.1] - 2024-01-01

### Added
- 🎉 项目初始化
- ✨ 设计令牌系统（design-tokens）
- ✨ Vue 3 组件库基础架构
- ✨ API 客户端架构
- ✨ 后端核心架构
- ✨ Monorepo 项目结构
- ✨ 完整的 Mock 数据库结构
- ✨ 基础的系统管理页面（用户、角色、菜单）
- ✨ 基础的系统监控页面
- ✨ 代码生成器基础

---

## 版本说明

### 语义化版本号规则
- **主版本号**：不兼容的 API 更改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 变更类型说明
- **Added**：新功能
- **Changed**：功能变更
- **Deprecated**：即将移除的功能
- **Removed**：已移除的功能
- **Fixed**：Bug 修复
- **Security**：安全相关修复

---

## 计划功能

### v1.0.0 计划
- [ ] 完整的企业级功能
- [ ] 性能优化
- [ ] 完整的文档

---

## 贡献指南

1. 确保你的代码符合项目规范
2. 提交前运行 lint 和 type-check
3. 更新 CHANGELOG.md
4. 提交信息遵循规范（参见 [Conventional Commits](https://www.conventionalcommits.org/)）

---

## 联系我们

如有问题，请提交 Issue 或 PR。

项目地址：https://github.com/wangfeizong1001/yunshu-platform

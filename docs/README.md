# 📚 云枢中台文档中心

> 本文档中心包含项目的所有文档资源，涵盖架构设计、开发指南、部署运维与测试规范。

---

## 📖 文档索引

### 🔰 快速开始

| 文档 | 说明 | 适合人群 |
|------|------|---------|
| [快速开始](getting-started.md) | 5 分钟快速上手指南 | 新用户、新成员 |
| [开发环境搭建](development/setup.md) | 完整的开发环境配置说明 | 开发者 |
| [常见问题 FAQ](faq.md) | 开发与部署中常见问题解答 | 所有用户 |

---

### 🏗️ 架构设计

| 文档 | 说明 | 适合人群 |
|------|------|---------|
| [系统架构总览](architecture/architecture.md) | 系统整体架构设计与模块划分 | 架构师、技术主管 |
| [数据库与缓存架构](architecture/database-cache.md) | PostgreSQL + Redis 缓存体系设计 | 后端开发、架构师 |
| [权限体系设计](architecture/permission.md) | RBAC 权限模型与按钮级权限实现 | 后端/前端开发 |
| [多租户架构设计](architecture/multi-tenant.md) | SaaS 多租户隔离与数据划分 | 架构师、高级开发 |

---

### 🛠️ 开发指南

| 文档 | 说明 | 适合人群 |
|------|------|---------|
| [开发规范与流程](../DEVELOP.md) | 完整的开发规范、流程与最佳实践 | 所有开发者 |
| [组件开发规范](development/component.md) | Vue 3 组件开发标准与示例 | 前端开发 |
| [API 开发规范](development/api.md) | REST API 设计规范与代码组织 | 全栈开发 |
| [国际化开发指南](development/i18n.md) | 多语言支持与翻译流程 | 前端/国际化团队 |
| [贡献指南](../CONTRIBUTING.md) | 如何参与项目、提交 PR | 开源贡献者 |

---

### 🚀 部署与运维

| 文档 | 说明 | 适合人群 |
|------|------|---------|
| [部署指南](../DEPLOY.md) | 生产环境完整部署方案 | 运维、DevOps |
| [Docker 部署指南](deploy/deploy-guide.md) | Docker Compose 容器化部署 | 运维、开发者 |
| [部署配置说明](development/setup.md#环境变量配置) | 环境变量与配置管理 | 运维、开发者 |

---

### ✅ 测试与质量

| 文档 | 说明 | 适合人群 |
|------|------|---------|
| [测试指南](testing/testing-guide.md) | 单元测试、集成测试、E2E 测试完整指南 | 开发、QA |
| [集成测试指南](integration-test-guide.md) | 模块间集成测试规范与示例 | 开发、QA |

---

### 🔌 API 参考

| 文档 | 说明 | 适合人群 |
|------|------|---------|
| [API 接口文档](../API.md) | 完整 API 接口列表与调用示例 | 全栈开发 |
| [OpenAPI 规范](../OPENAPI.md) | OpenAPI 3.0 标准规格说明 | 全栈开发、架构师 |
| [API 设计规范](api/api-reference.md) | API 设计原则与规范 | 后端开发、架构师 |

---

### 🔒 安全与合规

| 文档 | 说明 | 适合人群 |
|------|------|---------|
| [安全策略](../SECURITY.md) | 安全漏洞报告与处理流程 | 安全团队、维护者 |
| [XSS 防护设计](architecture/architecture.md#安全设计) | 前端 XSS 防护方案 | 前端开发、安全团队 |
| [数据权限模型](architecture/permission.md) | 数据隔离与权限控制设计 | 架构师、安全团队 |

---

### 📝 其他重要文档

| 文档 | 说明 |
|------|------|
| [根目录 README](../README.md) | 项目首页与快速预览 |
| [CHANGELOG](../CHANGELOG.md) | 版本变更记录与发布说明 |
| [PR 模板](../.github/PULL_REQUEST_TEMPLATE.md) | Pull Request 提交规范 |

---

## 📂 文档目录结构

```
docs/
├── README.md                    # 本文档 — 文档索引总览
├── getting-started.md           # 快速开始
├── faq.md                       # 常见问题 FAQ
├── integration-test-guide.md    # 集成测试指南
│
├── api/                         # API 文档
│   └── api-reference.md
│
├── architecture/                # 架构文档
│   ├── architecture.md          # 系统架构总览
│   ├── database-cache.md        # 数据库与缓存架构
│   ├── permission.md            # 权限体系设计
│   └── multi-tenant.md          # 多租户架构设计
│
├── deploy/                      # 部署文档
│   └── deploy-guide.md          # 部署指南
│
├── development/                 # 开发指南
│   ├── api.md                   # API 开发规范
│   ├── component.md             # 组件开发规范
│   ├── i18n.md                  # 国际化指南
│   └── setup.md                 # 环境搭建
│
├── testing/                     # 测试文档
│   └── testing-guide.md         # 测试总览与规范
│
├── en/                          # 英文文档（可选）
│   ├── architecture/
│   │   └── database-cache.md
│   └── deploy/
│       └── docker-compose.md
│
└── zh/                          # 中文文档（可选）
    ├── architecture/
    │   └── database-cache.md
    └── deploy/
        └── docker-compose.md
```

---

## 🎯 文档使用建议

### 新成员入门路径

```
1. 阅读 [根目录 README](../README.md) → 了解项目全貌
2. 阅读 [快速开始](getting-started.md) → 本地跑起来
3. 阅读 [开发规范](../DEVELOP.md) → 了解项目规范
4. 阅读 [架构总览](architecture/architecture.md) → 理解系统设计
5. 阅读 [贡献指南](../CONTRIBUTING.md) → 参与贡献
```

### 功能开发路径

```
根据需求类型选择：
├── 前端页面开发 → [组件开发规范](development/component.md)
├── 后端 API 开发 → [API 开发规范](development/api.md)
├── 多语言需求 → [国际化指南](development/i18n.md)
├── 数据库变更 → [数据库架构](architecture/database-cache.md)
├── 权限相关 → [权限体系设计](architecture/permission.md)
└── 测试编写 → [测试指南](testing/testing-guide.md)
```

### 部署上线路径

```
1. 阅读 [部署指南](../DEPLOY.md)
2. 检查 [环境变量配置](development/setup.md#环境变量配置)
3. 验证 [CHANGELOG](../CHANGELOG.md) 版本说明
4. 关注 [安全策略](../SECURITY.md) 相关配置
```

---

## 📌 文档更新与维护

### 更新原则

1. **同步更新** — 代码合并到 main 前确保相关文档已更新
2. **语言统一** — 所有文档使用中文编写（技术术语可保留英文）
3. **格式规范** — 遵循 Markdown 格式规范（参考各文档现有风格）
4. **链接有效** — 确保所有内部链接可正常跳转

### 版本关联

文档版本应与代码版本保持一致：
- **稳定版本文档** — 与 GitHub Release 对应
- **开发版本文档** — 与 develop 分支同步
- **预发布文档** — 与 release/* 分支同步

### 过期文档标记

当文档内容不再适用最新版本时：
1. 在文档顶部添加警告标记
2. 在 [CHANGELOG](../CHANGELOG.md) 中记录文档变更
3. 必要时在 docs/archive/ 目录归档旧版本

---

## 🤝 文档贡献

发现文档问题或想改进文档？欢迎通过以下方式参与：

1. **提交 Issue** — 说明文档缺失或需要改进的地方
2. **提交 PR** — 直接修改并提交 Pull Request
3. **评论反馈** — 在相关 Issue/PR 下提供建议

**文档维护者**：项目核心团队

---

## 🔗 外部资源

| 资源 | 链接 |
|------|------|
| Vue 3 官方文档 | https://vuejs.org/ |
| TypeScript 官方文档 | https://www.typescriptlang.org/ |
| Element Plus 组件库 | https://element-plus.org/ |
| Vite 构建工具 | https://vitejs.dev/ |
| Turborepo 文档 | https://turbo.build/repo |
| Playwright 测试 | https://playwright.dev/ |
| Vitest 测试框架 | https://vitest.dev/ |

---

**文档版本**：v1.0
**最后更新**：2025-06-09

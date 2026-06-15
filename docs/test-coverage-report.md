# 项目测试覆盖报告

> **版本**: v1.0
> **生成日期**: 2026-06-15
> **适用项目**: yunshu-platform（多租户企业管理平台）
> **状态**: 持续建设中
> **基准分支**: `develop`（当前 commit `9ccf384`）

---

## 目录

1. [一、测试框架与工具链](#一测试框架与工具链)
2. [二、测试分布总览](#二测试分布总览)
3. [三、已完成覆盖详情](#三已完成覆盖详情)
4. [四、未完成 / 待建设项](#四未完成--待建设项)
5. [五、已知失败用例](#五已知失败用例)
6. [六、运行方式](#六运行方式)
7. [七、测试规范与约定](#七测试规范与约定)
8. [八、改进建议与路线图](#八改进建议与路线图)

---

## 一、测试框架与工具链

| 层级 | 框架 | 配置文件 | 说明 |
|------|------|---------|------|
| 前端单元测试（Vue/TS） | [Vitest](https://vitest.dev) + `@vue/test-utils` | `apps/admin/vitest.config.ts` | utils / composables / security / 通用组件 |
| UI 组件库（packages/ui） | Vitest + `@vue/test-utils` + happy-dom | `packages/ui/vitest.config.ts` | primitives / styled / business / composables |
| 后端业务逻辑（Node/TS） | Vitest | `packages/server-core/vitest.config.ts` | Service / Cache / Config / Database / Middleware |
| 后端 HTTP API（Express） | Vitest + supertest | `packages/server-express/vitest.config.ts` | Controller / Middleware / Routes / i18n |
| API 客户端（packages/api-client） | Vitest | `packages/api-client/vitest.config.ts` | HttpClient / Adapters / system composables |
| E2E 端到端 | [Playwright](https://playwright.dev) | `playwright.config.ts` | 登录后真实用户流程，调用 Mock API |
| Mock API | vite-plugin-mock | `apps/admin/mock/index.ts` + routes/下的路由 | 为 E2E 与前端联调提供假数据 |

**执行入口**（根目录 `package.json`）：

```json
{
  "test": "turbo test",
  "test:coverage": "turbo test:coverage"
}
```

各子包通过 `turbo` 任务图并行执行。

---

## 二、测试分布总览

> 以下数字基于当前 `develop` 分支（commit `9ccf384`）的工作区实际文件统计。

| 模块 | 测试文件数 | 覆盖率观感 | 状态 |
|------|-----------|-----------|------|
| **apps/admin**（前端中台 单元测试） | 15 | 中 ~ 45% | 🟡 中等覆盖 |
| **Playwright E2E** | 18 个 spec | 中 | 🟡 中等覆盖 |
| **packages/api-client**（API 客户端） | 13 | 高 | 🟢 良好覆盖 |
| **packages/server-core**（后端核心） | 21 | 中高 | 🟡 中等覆盖 |
| **packages/server-express**（后端 HTTP） | 20 | 高 | 🟢 良好覆盖 |
| **packages/ui**（UI 组件库） | 18 | 中高 | 🟢 良好覆盖 |
| **packages/shared**（共享类型/工具） | 1 | 低 | 🟡 部分覆盖 |
| **packages/design-tokens**（设计令牌） | 2 | 中 | 🟢 基本覆盖 |
| **packages/cli**（脚手架工具） | 3 | 中 | 🟢 基本覆盖 |

**总计**：~111 个测试文件，覆盖 **单元测试 + 组件测试 + API 层 + E2E** 四类核心场景。

### 关键目录

- `apps/admin/src/__tests__/` — 前端单元测试
- `apps/admin/mock/routes/` — Mock API 路由（供 E2E 调用，非测试，但为 E2E 依赖）
- `playwright/tests/` — Playwright E2E 测试（18 个 spec）
- `playwright.config.ts` — 根目录 Playwright 配置
- `packages/api-client/**`（各子目录 `__tests__` 或直接 `*.test.ts`）— API 客户端测试
- `packages/server-core/src/*/__tests__/` — 后端核心测试
- `packages/server-express/src/__tests__/` + `modules/*/__tests__/` — Express 后端 HTTP 层测试
- `packages/ui/src/__tests__/` — UI 组件库测试
- `packages/*/vitest.config.ts` — 各包 Vitest 配置

---

## 三、已完成覆盖详情

### 3.1 apps/admin 前端单元测试

**测试文件清单**（共 15 个）：

| 文件 | 模块 | 说明 |
|------|------|------|
| `apps/admin/src/__tests__/components/CommonButton.test.ts` | 通用按钮组件 | 渲染 / props / 事件 |
| `apps/admin/src/__tests__/utils/auth.test.ts` | 认证工具 | Token 存取 |
| `apps/admin/src/__tests__/utils/auth-ext.test.ts` | 认证工具（扩展） | 复杂场景 |
| `apps/admin/src/__tests__/utils/cache.test.ts` | 缓存工具 | 过期 / TTL / 清除 |
| `apps/admin/src/__tests__/utils/date.test.ts` | 日期工具 | 格式化 / 相对时间 |
| `apps/admin/src/__tests__/utils/date-ext.test.ts` | 日期工具（扩展） | 边界 / 时区 |
| `apps/admin/src/__tests__/utils/httpClient.test.ts` | HTTP 客户端 | 请求 / 响应 / 错误 |
| `apps/admin/src/__tests__/utils/validate.test.ts` | 校验工具 | 表单校验 schema |
| `apps/admin/src/__tests__/utils/validate-ext.test.ts` | 校验工具（扩展） | API 响应校验 |
| `apps/admin/src/__tests__/utils/security/authStorage.test.ts` | 安全存储 | Token 加密存储 |
| `apps/admin/src/__tests__/utils/security/authStorage-ext.test.ts` | 安全存储（扩展） | 异常场景 |
| `apps/admin/src/__tests__/utils/security/sanitize.test.ts` | HTML 清洗 | XSS 防护 |
| `apps/admin/src/__tests__/utils/security/sanitize-ext.test.ts` | HTML 清洗（扩展） | 退化 / 完整 DOM 场景 |
| `apps/admin/src/__tests__/utils/security/storage.test.ts` | 存储抽象 | 安全读写 |
| `apps/admin/src/__tests__/utils/security/storage-ext.test.ts` | 存储抽象（扩展） | 并发 / 空值场景 |

**已覆盖功能点**：
- ✅ Token / 用户信息存取（auth / authStorage）
- ✅ 缓存（TTL / 过期 / 清除）
- ✅ 日期格式化与相对时间
- ✅ HTTP 客户端（request / response / error）
- ✅ 表单校验 + API 响应校验
- ✅ HTML 清洗防 XSS（含 DOMPurify 退化）
- ✅ 通用按钮组件

### 3.2 Playwright E2E

**测试文件清单**（共 18 个 spec）：

| 文件 | 说明 |
|------|------|
| `playwright/tests/login.spec.ts` + `login-ext.spec.ts` | 登录（基本 + 验证码 / 错误锁定 / 多语言） |
| `playwright/tests/dashboard.spec.ts` + `dashboard-ext.spec.ts` | 仪表盘（基本 + 图表 / 数字卡片 / 刷新） |
| `playwright/tests/system.spec.ts` + `system-ext.spec.ts` | 系统管理（用户 / 角色 / 部门 / 字典 / 菜单 CRUD） |
| `playwright/tests/monitor.spec.ts` + `monitor-ext.spec.ts` | 监控（定时任务 / 日志 / 在线用户 / 服务器） |
| `playwright/tests/tenant.spec.ts` + `tenant-ext.spec.ts` | 租户（列表 / 新增 / 套餐 / 详情） |
| `playwright/tests/tool.spec.ts` + `tool-ext.spec.ts` | 工具（代码生成器 / 表单设计器） |
| `playwright/tests/report.spec.ts` | 报表（列表 / 设计 / 查看） |
| `playwright/tests/user.spec.ts` | 用户中心（资料 / 密码 / 头像） |
| `playwright/tests/workflow.spec.ts` | 工作流（定义 / 待办 / 已办 / 实例） |
| `playwright/tests/layout.spec.ts` | 布局（侧边栏 / 标签 / 退出） |
| `playwright/tests/error.spec.ts` | 错误页（404 / 回首页） |

**已覆盖功能点**：
- ✅ 登录 / 退出 / 权限控制
- ✅ 仪表盘渲染与数据刷新
- ✅ 系统管理（用户 / 角色 / 部门 / 字典 / 菜单 / 岗位等）基本 CRUD
- ✅ 监控（定时任务 / 日志 / 在线用户 / 服务器）
- ✅ 租户与套餐
- ✅ 代码生成器 / 报表 / 工作流
- ✅ 用户中心 / 布局交互 / 错误页

### 3.3 packages/api-client（API 客户端）

**测试文件清单**（共 13 个）：

| 文件 | 说明 |
|------|------|
| `packages/api-client/src/core/HttpClient.test.ts` | HTTP 核心方法（get/post/put/delete/cancel/upload） |
| `packages/api-client/src/core/BaseAPI.test.ts` | 抽象 API 封装 |
| `packages/api-client/src/core/types.test.ts` | 类型工具 / error |
| `packages/api-client/src/core/middlewares.test.ts` | 请求 / 响应中间件管道 |
| `packages/api-client/src/adapters/axios/AxiosAdapter.test.ts` | axios 适配器 mock |
| `packages/api-client/src/adapters/fetch/FetchAdapter.test.ts` | fetch 适配器 mock |
| `packages/api-client/src/vue/vue.test.ts` | Vue 插件安装 / 响应式 composables |
| `packages/api-client/src/system/useUser.test.ts` | 用户 API composable |
| `packages/api-client/src/system/useRole.test.ts` | 角色 API composable |
| `packages/api-client/src/system/useMenu.test.ts` | 菜单 API composable |
| `packages/api-client/src/system/useDept.test.ts` | 部门 API composable |
| `packages/api-client/src/system/usePost.test.ts` | 岗位 API composable |
| `packages/api-client/src/system/usePermission.test.ts` | 权限 API composable |

### 3.4 packages/server-core（后端核心）

**测试文件清单**（共 21 个）：

| 目录 | 文件 |
|------|------|
| `base/` | `BaseService.test.ts` |
| `cache/` | `BloomFilter.test.ts` / `CacheDecorator.test.ts` / `CacheWarmup.test.ts` / `DistributedLock.test.ts` / `RedisClient.test.ts` |
| `config/` | `ConfigService.test.ts` |
| `database/` | `IRepository.test.ts` / `PostgresClient.test.ts` / `PostgresQueryBuilder.test.ts` / `PostgresRepository.test.ts` |
| `decorators/` | `decorators.test.ts` |
| `errors/` | `BusinessError.test.ts` |
| `logger/` | `Logger.test.ts` |
| `middlewares/` | `auth.test.ts` |
| `migrations/` | `MigrationUtils.test.ts` |
| `modules/monitor/` | `JobService.test.ts` / `LogininforService.test.ts` / `OnlineService.test.ts` / `OperlogService.test.ts` / `ServerService.test.ts` |
| `utils/` | `jwt.test.ts` / `logger.test.ts` / `safeJson.test.ts` |

### 3.5 packages/server-express（后端 HTTP）

**测试文件清单**（共 20 个）：

| 目录 | 文件 |
|------|------|
| `src/__tests__/` | `app.test.ts` / `routes.test.ts` / `controller/BaseController.test.ts` / `controllers/monitor.test.ts` / `controllers/system.test.ts` / `helpers/createTestApp.ts` / `setup.ts` |
| `src/__tests__/middlewares/` | `auth.test.ts` / `errorHandler.test.ts` / `rateLimit.test.ts` / `tenant.test.ts` / `uploadGuard.test.ts` |
| `src/__tests__/i18n/` | `i18n.test.ts` |
| `src/__tests__/modules/gen/` | `Gen.test.ts` |
| `src/__tests__/modules/sms/` | `SmsController.test.ts` |
| `src/__tests__/modules/sso/` | `SsoController.test.ts` |
| `src/__tests__/modules/system/` | `controllers.test.ts` |
| `src/__tests__/modules/tenant/` | `Tenant.test.ts` |
| `src/__tests__/modules/third/` | `ThirdController.test.ts` |
| `src/modules/monitor/__tests__/` | `JobController.test.ts` / `LogininforController.test.ts` / `OnlineController.test.ts` / `OperlogController.test.ts` / `ServerController.test.ts` |

### 3.6 packages/ui（UI 组件库）

**测试文件清单**（共 18 个）：

| 文件 | 说明 |
|------|------|
| `packages/ui/src/__tests__/index.test.ts` | 导出完整性 |
| `packages/ui/src/__tests__/Button.test.ts` | styled/Button |
| `packages/ui/src/__tests__/Input.test.ts` | styled/Input |
| `packages/ui/src/__tests__/Dialog.test.ts` | styled/Dialog |
| `packages/ui/src/__tests__/Pagination.test.ts` | styled/Pagination |
| `packages/ui/src/__tests__/Empty.test.ts` | styled/Empty |
| `packages/ui/src/__tests__/Loading.test.ts` | styled/Loading |
| `packages/ui/src/__tests__/DataTable.test.ts` | business/DataTable |
| `packages/ui/src/__tests__/SearchForm.test.ts` | business/SearchForm |
| `packages/ui/src/__tests__/FileUpload.test.ts` | business/FileUpload |
| `packages/ui/src/__tests__/ErrorPage.test.ts` | business/ErrorPage |
| `packages/ui/src/__tests__/useButton.test.ts` | primitives/useButton |
| `packages/ui/src/__tests__/useInput.test.ts` | primitives/useInput |
| `packages/ui/src/__tests__/useDialog.test.ts` | primitives/useDialog |
| `packages/ui/src/__tests__/usePagination.test.ts` | primitives/usePagination |
| `packages/ui/src/__tests__/useTable.test.ts` | composables/useTable |
| `packages/ui/src/__tests__/useForm.test.ts` | composables/useForm |
| `packages/ui/src/__tests__/useTheme.test.ts` | composables/useTheme |

### 3.7 packages/shared / design-tokens / cli

| 包 | 文件 |
|----|------|
| `shared` | `src/index.test.ts` |
| `design-tokens` | `src/tokens/base.test.ts` / `src/tokens/colors.test.ts` |
| `cli` | `src/__tests__/commands/generate.test.ts` / `src/__tests__/commands/theme.test.ts` / `src/utils/__tests__/projectCreator.test.ts` |

### 3.8 Mock API 路由（非测试，但为 E2E 前提）

> 位置：`apps/admin/mock/routes/`

| 目录 | 说明 |
|------|------|
| `auth/login.ts` | 登录 + 验证码 |
| `system/*.ts` | 用户、角色、菜单、部门、字典、岗位、表单、知识、消息、通知、配置、OSS、文件、短信、SSO、第三方 |
| `monitor/*.ts` | 定时任务、登录日志、操作日志、在线用户、服务器监控 |
| `tenant/tenant.ts` | 租户 |
| `tool/gen.ts` | 代码生成器 |
| `workflow/index.ts` | 工作流 |
| `dashboard/`、`admin-dashboard/` | 仪表盘 |
| `report/report.ts` | 报表 |
| `utils/*` | 通用 mock helper（database / delay / response / validator） |

---

## 四、未完成 / 待建设项

以下按模块 + 优先级列出。**建议优先按 P0 → P1 → P2 的顺序推进**。

### 4.1 前端模块（apps/admin）

#### P0 — 高优补充

| 内容 | 说明 | 建议测试文件 |
|------|------|-------------|
| **业务视图页面**（`apps/admin/src/views/*`） | `dashboard-pro` / `system` / `tenant` / `monitor` / `tool` / `report` / `workflow` / `user` / `layout` / `error` 等 30+ 个页面仅通过 Playwright E2E 间接覆盖，没有组件级单测 | `apps/admin/src/__tests__/views/*` 关键页各 1 个 |
| **API 层** | `apps/admin/src/api/**`（admin-dashboard / auth / dashboard / search / report / user / workflow / system / tenant / tool / monitor 等）无测试 | `apps/admin/src/__tests__/api/*` |
| **composables** | `apps/admin/src/composables/` 中 `useCache` / `useDict` / `useInitApp` / `useScreenSize` / `useSearch` 等无测试 | `apps/admin/src/__tests__/composables/*.test.ts` |
| **router / permission** | `apps/admin/src/router/index.ts` + `permission.ts` 路由守卫无测试 | `apps/admin/src/__tests__/router/*.test.ts` |
| **状态管理 store** | 若使用 pinia/vuex，缺少针对 mutations / actions / getters 的单测 | `apps/admin/src/__tests__/store/*.test.ts` |

#### P1 — 中优补充

| 内容 | 说明 |
|------|------|
| **前端组件**（`apps/admin/src/components/` 非 CommonButton） | `LanguageSwitch` / `SafeHtml` / `TenantSelect` / `OssUpload` / `CommonTable` / `monitor/*` 无测试 |
| **布局组件** `layouts/` | 侧边栏 / 顶栏 / 标签页交互逻辑 |
| **国际化 locales** | 多语言切换 / 回退 / 缺失 key 行为 |

#### P2 — 可选增强

| 内容 | 说明 |
|------|------|
| **性能基线** | 页面首屏渲染时间 / LCP / bundle size 回归 |
| **a11y 可访问性** | axe-core 检测键盘可达 / 对比度 / 语义标签 |
| **视觉回归** | Storybook + Chromatic / Loki 像素级对比 |

### 4.2 packages/api-client（API 客户端）

**状态**：🟢 已有 13 个测试文件。仍可补齐：

| 模块 | 缺口 |
|------|------|
| `system/` | 目前只覆盖 `useUser` / `useRole` / `useMenu` / `useDept` / `usePost` / `usePermission`，若新增 `useNotice` / `useConfig` / `useDict` / `useFile` 等需同步补齐 |
| `adapters/` | axios / fetch 覆盖良好，但错误状态码（5xx）/ 超时 / 取消的组合场景可以加边缘回归 |
| 覆盖率配置 | 建议在 `packages/api-client/vitest.config.ts` 统一启用 `coverage`（v8） |

### 4.3 packages/server-core（后端核心）

**状态**：🟡 已有 21 个测试文件，但仍有缺口：

| 模块 | 说明 |
|------|------|
| `utils/index.test.ts`（聚合导出） | 若存在 `utils/index.ts` 的导出门面，建议加一个导出完整性测试 |
| 非 monitor 业务模块 | 系统模块 / 租户模块 / 工具模块等 service 层仍需按模块补齐 |
| `cache/` 集成测试 | 真实 Redis 容器的集成测试（建议 testcontainers） |
| `database/` 集成测试 | 真实 PostgreSQL 容器的集成测试 |

### 4.4 packages/server-express（后端 HTTP）

**状态**：🟢 已有 ~20 个测试文件。仍需补齐：

| 模块 | 说明 |
|------|------|
| `modules/system/` 细粒度 Controller | 目前使用 `controllers.test.ts` 聚合，建议按 Controller 拆文件（User / Role / Dept / Menu / Dict / Post / Config / Oss / File / Message / Notice 等） |
| `modules/sms/` 完整 SMS 控制器 | 发送 / 模板 / 日志查询等 |
| `modules/sso/` 完整 SSO 控制器 | 应用管理 / OAuth2 回调模拟 |
| `modules/third/` 完整第三方登录控制器 | bind / unbind / list |
| `routes.ts` 端到端路由测试 | supertest 模拟真实请求 |
| 认证 / 速率限制中间件完整组合 | 目前覆盖基础，可加针对 `X-Real-IP` / 白名单 / 黑名单的回归 |

### 4.5 Playwright E2E

**状态**：🟡 已覆盖 18 个 spec，仍可加强：

| 模块 | 建议 |
|------|------|
| **权限 / 角色矩阵** | 为不同角色（admin / tenant-admin / user 等）分别跑最小路径，验证可见性差异 |
| **上传下载** | 实际的文件上传 / 下载（playwright 原生支持） |
| **并发 / 冲突编辑** | 两个浏览器上下文同时编辑同一资源，观察冲突提示 |
| **暗黑主题** | useTheme 在 E2E 中验证暗色/亮色切换 |
| **移动端响应式** | `viewport: { width: 375, height: 812 }` 关键页 smoke |
| **失败重试** | `retries: 2` + trace on failure |
| **CI 浏览器并行** | shard 配置 `--shard 1/3` |

### 4.6 packages/ui（UI 组件库）

**状态**：🟢 已有 18 个测试文件，仍可补强：

| 组件 / composable | 建议 |
|------|------|
| **组合 composables** | `useTable` + `DataTable` 真实集成测试 |
| **无障碍 (a11y)** | Button / Dialog / Input 等关键组件的 a11y 扫描 |
| **视觉回归** | Storybook 快照（Chromatic / Loki） |

### 4.7 其它缺失项

| 项 | 状态 | 说明 |
|----|------|------|
| **统一覆盖率配置** | 未在根级或 `turbo.json` 中统一启用 `coverage` | 建议在所有 `vitest.config.ts` 启用 `coverage.provider: 'v8'`，并设定 `thresholds.lines` ≥ 60% 的基线 |
| **CI / CD 集成** | 未观察到 GitHub Actions 跑测试 | 建议 `.github/workflows/ci.yml` 增加 `turbo test` 步骤 |
| **Mock API 契约校验** | 手工维护，无契约校验 | 建议引入 `msw` + OpenAPI diff，避免与真实 API 漂移 |
| **E2E HTML 报告** | 可在 playwright.config.ts 中配置 `reporter: [['html', { open: 'never' }]]`，并在 CI 上传到 artifacts |
| **性能回归** | 无 | 对关键列表页 / API P99 做基线测试 |
| **a11y 测试** | 无 | `@axe-core/playwright` 接入 |
| **安全测试** | 无 | SQL 注入 / XSS / CSRF / 越权的最小样本集 |
| **Visual Regression** | 无 | Storybook + Chromatic / Loki |

---

## 五、已知失败用例

> 以下为本次调研中观察到的 **历史遗留 / 不稳定** 测试风险，非阻断但需优先修复：

| 测试文件 | 风险 | 建议修复 |
|---------|------|---------|
| `packages/server-express/src/__tests__/debug4.test.ts`（如存在） | 命名不规范，内容疑似调试 | 删除或合并到对应模块测试 |
| `*Controller.test.ts` 中多处权限 mock 不一致 | 部分测试不注入 `user.role=admin`，导致权限 guard 误判 | 统一使用 `createTestApp` helper 注入标准身份 |
| Postgres / Redis 依赖的 service 集成测试 | CI 无真实容器（本地可跑但 CI 不一定） | 引入 `testcontainers`（`@testcontainers/postgresql` + `@testcontainers/redis`） |
| `playwright/tests/*-ext.spec.ts` 稳定性 | 部分 `-ext` 场景依赖 mock 数据结构与真实前端组件对齐 | 建议对 `apps/admin/mock/routes/**` 做一次契约式 schema 校验 |

---

## 六、运行方式

### 6.1 本地运行

```bash
cd /workspace
pnpm install
pnpm run test           # 全量（推荐，使用 turbo 并行）

# 或者按子包单独执行：
cd apps/admin && npx vitest run
cd packages/api-client && npx vitest run
cd packages/server-core && npx vitest run
cd packages/server-express && npx vitest run
cd packages/ui && npx vitest run
cd packages/shared && npx vitest run
cd packages/design-tokens && npx vitest run
cd packages/cli && npx vitest run
```

### 6.2 覆盖率

```bash
# 全量覆盖率（需先在各 vitest.config.ts 中启用 coverage）
pnpm run test:coverage
```

### 6.3 Playwright E2E

```bash
# 首次运行：安装浏览器
cd /workspace
pnpm exec playwright install --with-deps chromium

# 运行
pnpm exec playwright test

# 查看 HTML 报告
pnpm exec playwright show-report
```

### 6.4 单文件调试

```bash
# 只跑一个测试文件
npx vitest run apps/admin/src/__tests__/utils/sanitize.test.ts

# watch 模式开发
npx vitest

# grep 过滤测试用例
npx vitest run -t "XSS"
```

---

## 七、测试规范与约定

### 7.1 文件命名

- **单元测试**：放置在被测试文件同级或上级 `__tests__/` 目录，文件名为 `<被测名>.test.ts` 或 `<被测名>-ext.test.ts`（扩展 / 边缘场景）
- **E2E 测试**：放置在 `playwright/tests/<模块>.spec.ts`，可使用 `-ext.spec.ts` 表示扩展深度覆盖
- **Mock / helper**：放置在 `__tests__/helpers/` 或项目根 `__mocks__/` 下，禁止与测试用例混写

### 7.2 测试描述

- 用 **中文** 描述测试意图
- 每个 `describe` 对应一个模块 / 组件；每个 `it` 对应一个具体行为
- 避免空测试 / `it.todo` 超过 3 个
- 测试标题应可读：`describe('sanitizeHtml 清洗 HTML', () => it('去除 <script> 标签', () => ...))`

### 7.3 测试分层金字塔

- **单元测试**（最多）：utils / composables / 纯函数 / service 层
- **组件测试**（中等）：Vue 组件 + 最小 mock
- **集成测试**（中等）：Controller 层 + supertest 模拟请求
- **E2E 测试**（最少）：仅覆盖核心用户路径（登录 / 仪表盘 / 系统管理 CRUD）

### 7.4 外部依赖 mock 规范

- HTTP / 数据库 / Redis 一律 mock，避免测试依赖网络
- Vue Router / Pinia / Element Plus 通过 `vi.mock()` 隔离
- Mock 数据放置在 `apps/admin/mock/routes/**` 或测试文件内 `const MOCK_*`

### 7.5 提交规范

- 新增/修改测试：`test(scope): 描述`
- 修复测试：`fix(tests): 描述`
- 仅调整 mock：`chore(mock): 描述`
- 新增测试文档：`docs(tests): 描述`

---

## 八、改进建议与路线图

### v1.1 目标（本期首选，建议 1-2 周内完成）

1. **apps/admin 单元测试补齐**：覆盖剩余 api / composables / router / store / 组件
2. **Playwright E2E**：完善 `-ext` 系列 spec 的断言粒度（从“可见”到“数据真实出现”）
3. **覆盖率 CI 基线**：在各 `vitest.config.ts` 启用 `coverage`，设置 `lines ≥ 60%` 阈值，CI 不达标失败
4. **CI 集成**：`.github/workflows/ci.yml` 跑 `turbo test` + `playwright test`

### v1.2 目标（中期，2-4 周）

1. **packages/server-core 全模块** 单测补齐，重点为业务模块
2. **packages/server-express 模块级 Controller** 按 Controller 拆文件
3. **a11y 扫描**：`@axe-core/playwright` 对关键页 smoke
4. **testcontainers**：替代手工 mock DB/Redis
5. **Mock API 契约校验**：避免 mock 与真实 API 漂移

### v1.3 目标（长期）

1. **性能回归测试**：LCP / bundle size / API P99 延迟
2. **Visual Regression**：Storybook + Chromatic
3. **安全测试最小集**：XSS / SQL 注入 / CSRF / 越权样本
4. **模糊测试**：关键输入（路由参数、JSON schema、上传文件名）
5. **Chaos / 故障注入**：关键服务失败时的系统行为

---

## 附录：测试文件全清单（按目录）

```
apps/admin/
├── src/__tests__/
│   ├── components/CommonButton.test.ts
│   └── utils/
│       ├── auth.test.ts
│       ├── auth-ext.test.ts
│       ├── cache.test.ts
│       ├── date.test.ts
│       ├── date-ext.test.ts
│       ├── httpClient.test.ts
│       ├── validate.test.ts
│       ├── validate-ext.test.ts
│       └── security/
│           ├── authStorage.test.ts
│           ├── authStorage-ext.test.ts
│           ├── sanitize.test.ts
│           ├── sanitize-ext.test.ts
│           ├── storage.test.ts
│           └── storage-ext.test.ts
└── mock/routes/
    ├── auth/login.ts
    ├── admin-dashboard/admin-dashboard.ts
    ├── dashboard/dashboard.ts
    ├── system/{dept,dict,form,knowledge,menu,message,notice,notification,post,role,sms,sso,third,user}.ts
    ├── monitor/{job,logininfor,online,operlog,server}.ts
    ├── tenant/tenant.ts
    ├── tool/gen.ts
    ├── report/report.ts
    ├── workflow/index.ts
    └── utils/{database,delay,response,validator}.ts

playwright/
└── tests/{login,login-ext,dashboard,dashboard-ext,system,system-ext,monitor,monitor-ext,tenant,tenant-ext,tool,tool-ext,report,user,workflow,layout,error}.spec.ts

packages/api-client/
├── src/core/{HttpClient,BaseAPI,types,middlewares}.test.ts
├── src/adapters/{axios/AxiosAdapter,fetch/FetchAdapter}.test.ts
├── src/system/{useUser,useRole,useMenu,useDept,usePost,usePermission}.test.ts
└── src/vue/vue.test.ts

packages/server-core/
├── src/base/__tests__/BaseService.test.ts
├── src/cache/__tests__/{BloomFilter,CacheDecorator,CacheWarmup,DistributedLock,RedisClient}.test.ts
├── src/config/__tests__/ConfigService.test.ts
├── src/database/__tests__/{IRepository,PostgresClient,PostgresQueryBuilder,PostgresRepository}.test.ts
├── src/decorators/__tests__/decorators.test.ts
├── src/errors/__tests__/BusinessError.test.ts
├── src/logger/__tests__/Logger.test.ts
├── src/middlewares/__tests__/auth.test.ts
├── src/migrations/__tests__/MigrationUtils.test.ts
├── src/modules/monitor/__tests__/{JobService,LogininforService,OnlineService,OperlogService,ServerService}.test.ts
└── src/utils/__tests__/{jwt,logger,safeJson}.test.ts

packages/server-express/
├── src/__tests__/
│   ├── app.test.ts
│   ├── routes.test.ts
│   ├── controller/BaseController.test.ts
│   ├── controllers/monitor.test.ts
│   ├── controllers/system.test.ts
│   ├── helpers/createTestApp.ts
│   ├── setup.ts
│   ├── i18n/i18n.test.ts
│   ├── middlewares/{auth,errorHandler,rateLimit,tenant,uploadGuard}.test.ts
│   └── modules/{gen/Gen,sms/SmsController,sso/SsoController,system/controllers,tenant/Tenant,third/ThirdController}.test.ts
└── src/modules/monitor/__tests__/{JobController,LogininforController,OnlineController,OperlogController,ServerController}.test.ts

packages/ui/
└── src/__tests__/
    ├── index.test.ts
    ├── {Button,Input,Dialog,Pagination,Empty,Loading,DataTable,SearchForm,FileUpload,ErrorPage}.test.ts
    └── {useButton,useInput,useDialog,usePagination,useTable,useForm,useTheme}.test.ts

packages/shared/       └── src/index.test.ts
packages/design-tokens/ └── src/tokens/{base,colors}.test.ts
packages/cli/          └── src/{__tests__/commands/{generate,theme},utils/__tests__/projectCreator}.test.ts
```

---

> **维护方式**：本文件由人工定期审查 + 自动清单补充。建议在 CI 中增加「测试文件覆盖率」告警，当新增源码而未新增测试时发出提醒。

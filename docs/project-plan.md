# 云枢中台 — 完整任务清单

> 文档编号：`YUNSHU-PLAN-2026-06-v1`
> 更新日期：2026-06-16
> 负责人：前端团队
> 执行要求：**本仓库严格使用 pnpm 作为唯一包管理器，严禁使用 npm / yarn**

---

## 一、环境与工具链（严格要求）

### 1.1 包管理器强制要求

| 项目 | 要求 | 说明 |
|------|------|------|
| 包管理器 | **pnpm** — 严禁使用 `npm install` / `yarn` | 违反将导致 lockfile 冲突 |
| 版本 | **9.0.0**（精确版本，与 `package.json#packageManager` 对齐） | CI 已自动校验一致性 |
| 镜像源 | `https://registry.npmmirror.com/` | 见 [.npmrc](file:///workspace/.npmrc) |
| workspace 配置 | 见 [pnpm-workspace.yaml](file:///workspace/pnpm-workspace.yaml) | workspace 内包自动相互链接 |
| Node.js | `>=20.0.0` | 见 [.nvmrc](file:///workspace/.nvmrc) |
| 版本强制校验 | **engine-strict=true** | `.npmrc` + `package.json#engineStrict` 双层校验 |
| CI 版本一致性 | 自动校验 | 见 [ci.yml](file:///workspace/.github/workflows/ci.yml) 的 `pnpm-version-check` job |

### 1.2 约束机制详解

#### 三层强制校验（任何一层不满足均会失败）

```
第1层：.npmrc  → engine-strict=true（安装时校验 Node/pnpm 版本）
第2层：CI     → pnpm-version-check job（CI 每次构建前校验）
第3层：本地   → package.json#packageManager + packageManager 字段（自动提示）
```

#### 新增文件说明

| 文件 | 作用 | 团队成员操作 |
|------|------|------------|
| [.nvmrc](file:///workspace/.nvmrc) | 锁定 Node.js 版本为 `20.0.0` | `nvm use` / `volta pin node@20` 自动读取 |
| [.npmrc](file:///workspace/.npmrc) | 增强配置（engine-strict + public-hoist） | 无需手动操作，`pnpm install` 自动读取 |
| [ci.yml](file:///workspace/.github/workflows/ci.yml) | CI 自动校验 pnpm 版本与 package.json 一致 | PR 时自动执行，无需手动触发 |

> ⚠️ `.npmrc` 中的 `engine-strict=true` 和 `package.json` 中的 `engineStrict: true` **同时生效**，任意一层不满足 Node/pnpm 版本要求，pnpm 都会拒绝安装。

### 1.3 正确的 pnpm 命令速查

在 **仓库根目录** 执行以下命令：

```bash
# ====== 安装依赖（严格使用 pnpm） ======
pnpm install              # 全量安装所有 workspace 包
pnpm install --frozen-lockfile  # CI 环境：严格按 lockfile 安装，不允许更新
pnpm add <pkg>            # 在当前目录添加依赖
pnpm add -D <pkg>         # 添加 devDependencies
pnpm add -w <pkg>         # 在根 package.json 添加（-w = workspace root）
pnpm add --filter @yunshu/admin <pkg>  # 仅为 admin 子应用添加依赖

# ====== 运行脚本 ======
pnpm dev                  # 启动所有应用（由 turbo 调度）
pnpm build                # 按依赖顺序构建所有包
pnpm test                 # 运行所有单元测试
pnpm test:e2e             # 运行 E2E 测试
pnpm lint                 # 代码风格检查
pnpm type-check           # TS 类型检查
pnpm format               # Prettier 格式化

# ====== 子应用/子包操作 ======
pnpm --filter @yunshu/admin dev   # 仅启动 admin 后台
pnpm --filter @yunshu/admin build # 仅构建 admin
pnpm --filter @yunshu/api-client test  # 仅运行 api-client 的测试

# ====== 清理与维护 ======
pnpm store prune          # 清理 pnpm 缓存中未引用的包
pnpm update               # 交互式升级（谨慎使用）
pnpm why <pkg>            # 查看某个包被谁依赖
```

### 1.4 禁止事项

以下行为 **必须避免**，如违反将导致 workspace 依赖树损坏：

- ❌ **禁止** 运行 `npm install` 或 `yarn` — 会生成 `package-lock.json` / `yarn.lock`，与 `pnpm-lock.yaml` 冲突
- ❌ **禁止** 直接编辑 `pnpm-lock.yaml`
- ❌ **禁止** 在子目录下运行 `pnpm install` — 一律在根目录使用 `--filter`
- ❌ **禁止** 在 `.gitignore` 中移除 `node_modules`
- ❌ **禁止** 使用 `npm link` / `yarn link` — 应使用 workspace 的 `workspace:*` 协议（已在 [admin/package.json](file:///workspace/apps/admin/package.json#L25-L28) 使用）

### 1.5 环境初始化（新成员入职）

```bash
# 1. 安装/激活正确版本的 Node 与 pnpm
#    使用 nvm 或 volta 激活 Node 20+
nvm use 20              # 或 nvm install 20
corepack enable         # 启用 Corepack
corepack prepare pnpm@9.0.0 --activate  # 锁定 pnpm 版本

# 2. 克隆仓库后首次安装
git clone <repo-url>
cd yunshu-platform
pnpm install            # 会根据 pnpm-lock.yaml 安装
                       # 同时读取 .npmrc 使用国内镜像

# 3. 验证
node --version          # >= 20.0.0
pnpm --version          # >= 9.0.0
pnpm test               # 单元测试全部通过
pnpm dev                # 应用能正常启动
```

---

## 二、问题总览

经过对 `apps/admin` 下 40+ 视图文件、API 层、Store、路由、布局组件及测试体系的完整审查，共识别 **8 个批次 31+ 项待完成任务**，涵盖：

| 类别 | 数量 | 代表性问题 |
|------|------|-----------|
| 基础设施缺陷 | 3 项 | locale 非响应式、httpClient 未注入 tenant-id、动态路由变量未隔离 |
| 主题与布局体系 | 7 项 | 缺失暗色主题、语言切换入口未集成、头像硬编码、多处颜色硬编码 |
| 个人中心与体验 | 4 项 | 个人中心为纯占位符、TagsView 无右键菜单、缺 403/500 页、全局搜索无菜单搜索 |
| 用户/租户完善 | 3 项 | 重置密码仅提示、TenantStatusEnum 未定义、套餐下拉无数据 |
| 工作流 Mock→真实 | 5 项 | 流程定义/任务/实例全部用 mock、所有操作仅弹消息无后端交互 |
| 大屏设计器完善 | 4 项 | 组件渲染为纯文本、不可二次拖动、保存未持久化、无数据源绑定 |
| 测试覆盖补充 | 7 项 | 视图层 0 单测、9 个模块 0 测试、E2E 深度不足 |
| **设计系统合规** | **4 项** | **46 个文件硬编码颜色、variables.scss 与 design-tokens 冲突、无 Stylelint 检查** |

---

## 三、分批次任务清单

> 每批均遵循以下格式：
> - **任务编号**：批次-序号（如 `1.1`）
> - **任务标题**：一句话描述
> - **涉及文件**：需修改/新增的文件路径（点击跳转）
> - **任务详情**：具体要做的事情
> - **验收标准**：如何判定已完成
> - **预计工时**：人力估算
> - **优先级**：高/中/低

### 🔴 第1批 — 核心基础设施修复
**目标**：修复底层运行时问题，打通后续批次的地基。
**预计总工时**：4 小时
**前置依赖**：无

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 |
|---|---------|---------|---------|---------|------|
| 1.1 | locale store 响应式修复 | [locale.ts](file:///workspace/apps/admin/src/store/modules/locale.ts) | 将手写的非响应式 `useLocalStorage` 替换为 `@vueuse/core` 的 `useLocalStorage`；`locales` 列表改为响应式对象；统一切换逻辑 | 切换中英文后界面文字立即刷新，刷新页面后语言保留 | 1h |
| 1.2 | httpClient 注入 tenant-id 头 | [httpClient.ts](file:///workspace/apps/admin/src/utils/httpClient.ts), [tenant.ts](file:///workspace/apps/admin/src/utils/tenant.ts) | 在 `service.interceptors.request.use` 中新增调用 `addTenantIdToRequest(config)`；为请求头加上 `tenant-id` | F12 查看任意请求，Request Headers 中存在 `tenant-id` 且值等于当前登录租户 | 1h |
| 1.3 | 动态路由变量移入 store | [router/index.ts](file:///workspace/apps/admin/src/router/index.ts#L381-L444), [permission.ts](file:///workspace/apps/admin/src/store/modules/permission.ts) | 删除模块级 `let isDynamicRouteAdded = false`；在 `usePermissionStore` 中新增 `dynamicRouteAdded: boolean`；登出时调用 `resetRoutes()` 同步重置 | 登出→重新登录，不会出现路由重复注册警告；HMR 刷新后路由正常 | 2h |

---

### 🟠 第2批 — 主题与布局体系完善
**目标**：补全暗色主题、语言切换入口，消除布局中的硬编码与路径错误。
**预计总工时**：1.5 天
**前置依赖**：第1批（需 locale store 响应式修复完成）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 |
|---|---------|---------|---------|---------|------|
| 2.1 | app store 新增 theme 状态 | [app.ts](file:///workspace/apps/admin/src/store/modules/app.ts) | 新增 `theme: 'light' | 'dark'`（useLocalStorage 持久化）；新增 `toggleTheme()`、`setTheme(theme)`；保持与 `sidebarCollapsed` 相同风格 | Vue DevTools 中可看到 theme 状态；调用 toggleTheme 后 localStorage 中 `app-theme` 更新 | 2h |
| 2.2 | 主题切换核心逻辑实现 | [main.ts](file:///workspace/apps/admin/src/main.ts), [index.scss](file:///workspace/apps/admin/src/styles/index.scss) | 在 main.ts 监听 `useAppStore().theme`，切换时为 `<html>` 添加/移除 `class="dark"`；补充 Element Plus 的暗色主题 import（`element-plus/theme-chalk/dark/css-vars.css`）；在 `index.scss` 定义自定义暗色变量（如 `--app-bg-dark`、`--app-text-dark`、`--app-sidebar-dark`） | 切暗色后所有 Element Plus 组件（表格、弹窗、表单）变为暗色；背景色、文字色统一变化 | 4h |
| 2.3 | 布局组件移除硬编码颜色 | [Sidebar.vue](file:///workspace/apps/admin/src/layouts/components/Sidebar.vue), [Header.vue](file:///workspace/apps/admin/src/layouts/components/Header.vue), [index.vue](file:///workspace/apps/admin/src/layouts/index.vue#L83-L110) | 移除 Sidebar 的 `background-color="#304156"`，改为使用 `--el-bg-color` CSS 变量；移除 Header `background: #fff` 改为 `var(--el-bg-color)`；移除 `.app-main` 的 `background: #f0f2f5` 改为 `var(--el-fill-color-light)` | 切暗色后侧边栏/头部/内容区均自适应，无亮色块残留 | 2h |
| 2.4 | Header 集成语言切换与主题切换按钮 | [Header.vue](file:///workspace/apps/admin/src/layouts/components/Header.vue) | 在 header-right 区域插入 `LanguageSwitch` 组件 + 主题切换按钮（sun/moon icon）；样式与其他按钮保持一致 | 顶部可看到语言切换下拉（中文/English）和主题切换按钮，点击可生效 | 2h |
| 2.5 | 用户头像 URL 改为动态 | [Header.vue](file:///workspace/apps/admin/src/layouts/components/Header.vue#L38) | 将硬编码的 `https://cube.elemecdn.com/...` 改为 `userStore.avatar || 默认头像URL`；默认头像放入 `assets/avatar-default.png` | 不同用户登录显示各自头像，无头像时显示默认占位 | 1h |
| 2.6 | 修复"个人中心"与"设置"路由跳转 | [Header.vue](file:///workspace/apps/admin/src/layouts/components/Header.vue#L84-L102), [router/index.ts](file:///workspace/apps/admin/src/router/index.ts#L284-L297) | 个人中心跳转改为 `/user/profile/index`；"设置"菜单要么移除下拉项，要么新增 `/settings` 路由与页面（可简化为仅显示当前用户信息） | 点击下拉菜单项跳转到正确页面，无 404 | 1h |
| 2.7 | 登录页去除默认账号自动填充 | [login/index.vue](file:///workspace/apps/admin/src/views/login/index.vue#L130-L136) | 将 `username: 'admin'`、`password: 'admin123'` 改为空字符串；验证码部分也清空；保留 placeholder | 打开登录页，用户名/密码框为空，需要手动输入 | 30min |

---

### 🟡 第3批 — 个人中心与体验提升
**目标**：补全最明显的缺失页面，增强标签页交互体验。
**预计总工时**：1 天
**前置依赖**：第2批（需 Header 跳转完成后，个人中心才可被访问）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 |
|---|---------|---------|---------|---------|------|
| 3.1 | 完整实现个人中心页面 | [profile/index.vue](file:///workspace/apps/admin/src/views/user/profile/index.vue), [auth.ts](file:///workspace/apps/admin/src/api/auth.ts) | ① 基本信息卡（头像上传、昵称、邮箱、手机号、部门展示）；② 修改密码表单（旧密码/新密码/确认密码，带强度校验与一致性校验）；③ 操作日志列表（最近 20 条）；④ 保存按钮调用 `updateProfile` API；⑤ 表单验证使用 Element Plus rules | 页面打开显示当前用户信息，修改密码提交成功后后端验证通过并提示，操作日志表格有数据 | 5h |
| 3.2 | TagsView 右键菜单 | [TagsView.vue](file:///workspace/apps/admin/src/layouts/components/TagsView.vue) | 对每个 tag 绑定 `@contextmenu.prevent` 弹出菜单；菜单项：刷新当前、关闭当前、关闭其他、关闭全部、关闭左侧、关闭右侧；通过 router + tagsViewStore 实现 | 右键任一标签弹出菜单，所有操作正常执行，当前活跃标签正确更新 | 2h |
| 3.3 | 新增 403/500 错误页 | [403.vue](file:///workspace/apps/admin/src/views/error/403.vue)（新建）, [500.vue](file:///workspace/apps/admin/src/views/error/500.vue)（新建）, [router/index.ts](file:///workspace/apps/admin/src/router/index.ts), [httpClient.ts](file:///workspace/apps/admin/src/utils/httpClient.ts#L76-L93) | 仿照 404 样式，使用 `el-result` 组件；403 文案"抱歉，您无权访问此页面"，按钮"返回首页"；500 文案"服务器开小差了，请稍后再试"，按钮"重新加载"；在路由中注册；httpClient 中 `status === 403` 跳 `/403`，`status >= 500` 跳 `/500` | 访问受限时跳转到 403 页；模拟后端抛错时跳转到 500 页；页面样式与 404 一致 | 1h |
| 3.4 | 全局搜索集成菜单搜索 | [Search.vue](file:///workspace/apps/admin/src/layouts/components/Search.vue) | 使用 `usePermissionStore().routes` 生成可搜索项；用 Element Plus `el-autocomplete` 做搜索；点击结果调用 `router.push` 跳转 | 顶部搜索框输入"用户"、"角色"等关键字可匹配菜单项，点击后跳转到对应页面 | 1h |

---

### 🟢 第4批 — 用户/租户模块完善
**目标**：完善 CRUD 闭环，修复潜在运行时错误。
**预计总工时**：5 小时
**前置依赖**：无

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 |
|---|---------|---------|---------|---------|------|
| 4.1 | 用户管理 — 重置密码功能 | [UserList.vue](file:///workspace/apps/admin/src/views/system/user/UserList.vue#L217), [user.api.ts](file:///workspace/apps/admin/src/api/system/user.api.ts) | 在 user.api.ts 新增 `resetUserPassword(userId, newPassword)` API 函数；在 UserList.vue 中用 `el-dialog` 显示"重置密码"弹窗，含"新密码/确认密码"输入；提交后调用 API 并反馈成功；与现有"重置密码"按钮绑定 | 点击行操作列中的"重置密码"→弹出对话框→输入并提交→成功提示，密码已更新 | 2h |
| 4.2 | TenantStatusEnum 未定义修复 | [TenantList.vue](file:///workspace/apps/admin/src/views/tenant/TenantList.vue) | 在文件顶部 import 区域定义并导出 `TenantStatusEnum` 常量对象（如 `{ NORMAL: 0, DISABLED: 1 }` 或字符串形式，取决于后端字段类型）；替换文件中所有硬编码的状态值；检查 [shared 类型](file:///workspace/packages/shared/src/types/tenant/index.ts) 是否已有枚举定义，如已存在则从 shared 导入 | 页面无 TS 类型错误，无运行时 ReferenceError；状态显示、切换、筛选均正常 | 1h |
| 4.3 | 租户管理 — 套餐下拉框加载数据 | [TenantList.vue](file:///workspace/apps/admin/src/views/tenant/TenantList.vue), [tenant.api.ts](file:///workspace/apps/admin/src/api/tenant/tenant.api.ts), [package.api.ts](file:///workspace/apps/admin/src/api/tenant/tenant.api.ts) | 新增 `getTenantPackageOptions()` API；在 TenantList.vue 的 `setup` 中 onMounted 调用该接口，将返回数据填充到 `packageList`；为筛选区的套餐下拉框绑定 v-model | 搜索区套餐下拉框可看到真实套餐列表，选择后按套餐筛选租户 | 2h |

---

### 🔵 第5批 — 工作流模块从 Mock 升级
**目标**：让工作流成为可操作的真实功能模块。
**预计总工时**：2~3 天
**前置依赖**：后端工作流 API 设计完成（或与后端并行开发，先完成接口约定）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 |
|---|---------|---------|---------|---------|------|
| 5.1 | 工作流 API 层完整定义 | [workflow.api.ts](file:///workspace/apps/admin/src/api/workflow.api.ts)（或新建） | 定义以下接口：流程定义列表 `/workflow/definition/page`、详情 `/workflow/definition/:id`、创建 `/workflow/definition`、更新 `PUT /workflow/definition/:id`、删除 `DELETE /workflow/definition/:id`、发布/挂起/激活 `/workflow/definition/:id/status`、复制 `/workflow/definition/:id/copy`、导出 `/workflow/definition/:id/export`；任务列表 `/workflow/task/todo`、审批通过、驳回、转办、加签、委托；流程实例列表、已办任务 | API 文件有完整的 TypeScript 接口定义和 axios request 调用，TS 无 any 类型 | 4h |
| 5.2 | 后端工作流接口实现（Express） | [server-express routes/](file:///workspace/packages/server-express/src/) | 参考 [system 模块 controller](file:///workspace/packages/server-express/src/modules/system/) 的实现模式，创建 `workflow/` 目录；实现 5.1 中定义的所有接口，使用 PostgresClient 或内存存储 + schema；返回结构与前端期望的 ApiResponse 对齐 | 前端调用接口返回 200 且数据结构一致；curl/Postman 可正常请求 | 1 天 |
| 5.3 | ProcessList 接入真实 API | [ProcessList.vue](file:///workspace/apps/admin/src/views/workflow/ProcessList.vue) | 将 `getMockProcessDefinitionPage` 替换为 `getWorkflowDefinitionPage`；发布/挂起/激活/复制/导出按钮分别接入对应 API；表单提交走真实 API；保留 loading 与成功/失败提示 | 所有操作都发送真实 HTTP 请求，Network 面板可看到请求，操作后列表数据实时更新 | 4h |
| 5.4 | TodoList 接入真实 API | [TodoList.vue](file:///workspace/apps/admin/src/views/workflow/TodoList.vue) | 将 `getMockTodoTaskPage` 替换为 `getTodoTaskPage`；审批通过/驳回/转办/加签/委托/批量操作接入对应 API；审批历史改为从 API 获取并分页渲染 | 点击任一审批操作都有真实请求；审批历史动态加载；任务完成后自动刷新列表 | 5h |
| 5.5 | DoneList / ProcessInstance / ProcessDesign 统一改造 | [DoneList.vue](file:///workspace/apps/admin/src/views/workflow/DoneList.vue), [ProcessInstance.vue](file:///workspace/apps/admin/src/views/workflow/ProcessInstance.vue), [ProcessDesign.vue](file:///workspace/apps/admin/src/views/workflow/ProcessDesign.vue) | 与 5.3/5.4 相同的改造思路，接入真实 API；ProcessDesign 新增的流程保存时通过 POST `/workflow/definition` 创建 | 所有工作流子页面的数据都来自后端；无 mock 调用残留 | 4h |

---

### 🟣 第6批 — 大屏设计器完善
**目标**：使大屏设计器从原型升级为可使用的工具。
**预计总工时**：2 天
**前置依赖**：无

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 |
|---|---------|---------|---------|---------|------|
| 6.1 | 画布组件渲染真实 ECharts | [DashboardDesign.vue](file:///workspace/apps/admin/src/views/dashboard-pro/DashboardDesign.vue) | 参考 [DashboardScreen.vue](file:///workspace/apps/admin/src/views/dashboard-pro/DashboardScreen.vue) 的实现方式；为组件列表中每项（折线图、柱状图、饼图、环形图、面积图、表格、文本、图片）建立独立的渲染组件；画布内根据组件类型动态渲染对应组件；使用 vue-echarts 渲染图表 | 添加"折线图"组件后，画布显示真实的 ECharts 折线图而非纯文本；所有组件类型均可正确渲染 | 6h |
| 6.2 | 画布组件可拖拽移动和调整大小 | [DashboardDesign.vue](file:///workspace/apps/admin/src/views/dashboard-pro/DashboardDesign.vue) | 为画布上每个组件添加拖拽手柄（mousedown/mousemove/mouseup），更新组件的 x/y 坐标；为每个组件添加 8 个方向的 resize 手柄，更新 width/height；添加选中高亮边框；使用 CSS transform 或 left/top 定位，保持响应式 | 组件可在画布自由拖动、改变大小；坐标和尺寸更新后持久存在配置对象中 | 4h |
| 6.3 | 属性面板新增数据源绑定配置 | [DashboardDesign.vue](file:///workspace/apps/admin/src/views/dashboard-pro/DashboardDesign.vue), [admin-dashboard.api.ts](file:///workspace/apps/admin/src/api/admin-dashboard.api.ts) | 在属性面板添加"数据源"区块：下拉框选数据源类型（Mock数据/后端接口）、接口 URL 输入、请求方法（GET/POST）、字段映射（x轴字段、y轴字段、系列字段）；保存到组件配置对象的 `dataSource` 字段；预览/渲染时根据 dataSource 获取数据 | 可为每个图表组件配置数据源，配置后图表显示对应数据 | 3h |
| 6.4 | 模板选择与保存持久化 | [DashboardDesign.vue](file:///workspace/apps/admin/src/views/dashboard-pro/DashboardDesign.vue), [admin-dashboard.api.ts](file:///workspace/apps/admin/src/api/admin-dashboard.api.ts) | 在 API 层新增 `getDashboardTemplates()`、`saveDashboard(dashboard)`、`updateDashboard(id, dashboard)`、`getDashboard(id)`；为设计器顶部工具栏添加"选择模板"下拉框与"保存"按钮；保存时弹出对话框输入大屏名称，确认后 POST 或 PUT | 模板下拉框可看到多个预设；点击保存对话框输入名称后后端存储成功；刷新后可从列表中加载之前保存的配置 | 3h |

---

### 🟤 第7批 — 测试覆盖补充
**目标**：建立视图层测试基线，覆盖核心缺失模块的 E2E。
**预计总工时**：2 天
**前置依赖**：第1-6批功能全部完成（测试需基于稳定功能）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 |
|---|---------|---------|---------|---------|------|
| 7.1 | 公共组件单元测试 | [CommonTable.test.ts](file:///workspace/apps/admin/src/__tests__/components/CommonTable.test.ts)（新建）, [LanguageSwitch.test.ts](file:///workspace/apps/admin/src/__tests__/components/LanguageSwitch.test.ts)（新建）, [TenantSelect.test.ts](file:///workspace/apps/admin/src/__tests__/components/TenantSelect.test.ts)（新建） | 使用 `@vue/test-utils` + `vitest`；对 CommonTable 测试 props data/columns/pagination、emit 事件；对 LanguageSwitch 测试中英文切换触发 setLocale；对 TenantSelect 测试租户切换后调用 setTenantId | 新增 3+ 测试文件；`pnpm --filter @yunshu/admin test` 全部通过 | 3h |
| 7.2 | Store 状态管理测试 | [store/app.test.ts](file:///workspace/apps/admin/src/__tests__/store/app.test.ts)（新建）, [store/user.test.ts](file:///workspace/apps/admin/src/__tests__/store/user.test.ts)（新建）, [store/permission.test.ts](file:///workspace/apps/admin/src/__tests__/store/permission.test.ts)（新建）, [store/tagsView.test.ts](file:///workspace/apps/admin/src/__tests__/store/tagsView.test.ts)（新建） | 对每个 store 测试初始值、actions/mutations 执行后的状态变化；mock API 层避免真实请求；测试 localStorage 持久化（使用 vitest mock） | 每个 store 至少 5+ 用例，覆盖核心 action | 4h |
| 7.3 | 路由守卫测试 | [router/guard.test.ts](file:///workspace/apps/admin/src/__tests__/router/guard.test.ts)（新建） | 创建测试用 router 实例 + mock userStore + mock permissionStore；测试：未登录访问受保护页应跳登录；已登录访问 `/login` 应跳首页；无 userId 时触发 getUserInfo + generateRoutes；登出后 isDynamicRouteAdded 被重置 | 关键路径 6+ 用例均通过 | 3h |
| 7.4 | 工作流 E2E 测试 | [playwright/tests/workflow.spec.ts](file:///workspace/playwright/tests/workflow.spec.ts)（新建） | 测试场景：流程定义列表页打开/表格有数据、创建流程对话框填值并提交、发布流程后状态更新、挂起后状态更新、删除流程二次确认；任务列表-待办/已办切换；流程实例列表 | `pnpm test:e2e` 运行通过，所有场景有断言验证 | 5h |
| 7.5 | system 缺失子模块 E2E | [system-config.spec.ts](file:///workspace/playwright/tests/system-config.spec.ts)（新建）, [system-file.spec.ts](file:///workspace/playwright/tests/system-file.spec.ts)（新建）, [system-notice.spec.ts](file:///workspace/playwright/tests/system-notice.spec.ts)（新建） | 对 config、file、notice、message、knowledge、oss、sms、sso、third 各新增一个 spec；测试：页面能打开、表格有数据、搜索可筛选、新增/编辑对话框可打开 | 新增 9+ spec 文件，基础场景覆盖 | 3h |
| 7.6 | 个人中心 E2E | [profile.spec.ts](file:///workspace/playwright/tests/profile.spec.ts)（新建） | 测试打开个人中心页、查看用户信息、修改密码流程（旧密码错误场景 + 成功场景）、头像上传预览 | 所有步骤有断言，修改密码场景含正反用例 | 2h |
| 7.7 | 布局组件 E2E | [layout.spec.ts](file:///workspace/playwright/tests/layout.spec.ts)（新建） | 测试侧边栏折叠/展开；TagsView 添加标签、右键关闭当前/关闭其他/关闭全部；面包屑展示正确层级；全局搜索框输入关键字后可搜索到菜单项 | 布局交互全部断言验证 | 2h |

---

### ⚫ 第8批 — 设计系统合规检查
**目标**：确保所有样式变更都通过设计系统实现，禁止硬编码颜色/间距。
**预计总工时**：1 天
**前置依赖**：第2批（主题体系完善后，设计令牌才有完整使用场景）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 |
|---|---------|---------|---------|---------|------|
| 8.1 | 统一 variables.scss 与 design-tokens 颜色定义 | [variables.scss](file:///workspace/apps/admin/src/styles/variables.scss), [colors.ts](file:///workspace/packages/design-tokens/src/tokens/colors.ts) | 将 `$color-primary: #409eff` 改为 `#4a9eff`（与 design-tokens 对齐）；或将 design-tokens 的 `primary` 改为 `#409eff`（与 Element Plus 对齐）；确保两边颜色值完全一致；在 variables.scss 中引入 design-tokens 生成的 CSS 变量 | 两套颜色定义完全一致；切换主题时无颜色冲突 | 1h |
| 8.2 | 新增 Stylelint 配置 | [.stylelintrc.js](file:///workspace/.stylelintrc.js)（新建）, [package.json](file:///workspace/package.json) | 安装 `stylelint` + `stylelint-config-standard-scss` + `stylelint-color-no-hex`；配置规则：`color-no-hex: true`（禁止硬编码 hex）、`color-named: never`（禁止颜色名）、`declaration-property-value-disallowed-list` 禁止硬编码间距值；在 package.json 中添加 `lint:style` 脚本 | `pnpm lint:style` 可检测出硬编码颜色/间距 | 2h |
| 8.3 | ESLint 新增硬编码颜色检测规则 | [eslint-config/index.js](file:///workspace/tools/eslint-config/index.js) | 新增自定义 ESLint 规则检测 Vue template 中的硬编码颜色（`#[0-9a-fA-F]{3,6}`）；在 `rules` 中添加 `no-hardcoded-color: error`；允许使用 CSS 变量、SCSS 变量、design-tokens 导入 | `pnpm lint` 可检测出 Vue template 中的硬编码颜色 | 2h |
| 8.4 | 修复现有 46 个硬编码颜色文件 | [Sidebar.vue](file:///workspace/apps/admin/src/layouts/components/Sidebar.vue), [Header.vue](file:///workspace/apps/admin/src/layouts/components/Header.vue), [DashboardScreen.vue](file:///workspace/apps/admin/src/views/dashboard-pro/DashboardScreen.vue) 等 46 个文件 | 将所有硬编码颜色值替换为 CSS 变量或 SCSS 变量；优先使用 `var(--el-color-primary)` 等 Element Plus 变量；自定义颜色使用 `var(--color-surface-1)` 等 design-tokens 变量；间距使用 `$spacing-*` 变量 | `pnpm lint:style` + `pnpm lint` 无硬编码颜色警告；暗色主题切换时所有颜色自适应 | 4h |

---

## 四、每批开始前检查清单

执行任何一批前，确保满足以下条件：

- [ ] `pnpm --version` 输出 `9.0.0`
- [ ] `node --version` 输出 `>= 20.0.0`
- [ ] `.nvmrc` 文件存在且版本为 `20.0.0`（团队统一 Node 版本）
- [ ] `pnpm install` 已在根目录执行，无警告
- [ ] `pnpm --filter @yunshu/admin test` 所有现有测试通过
- [ ] `pnpm --filter @yunshu/admin type-check` 无 TS 错误
- [ ] `pnpm lint` 无 lint 错误
- [ ] 已从 `develop` 分支切出功能分支：`feature/<批次号>-<描述>`（如 `feature/batch1-infra`）
- [ ] 了解当前批次与其他批次的依赖关系（见上文中"前置依赖"）

---

## 五、每批完成后验证清单

- [ ] `pnpm lint` — 代码风格通过
- [ ] `pnpm lint:style` — Stylelint 检查通过（无硬编码颜色/间距）
- [ ] `pnpm type-check` — TypeScript 类型检查通过
- [ ] `pnpm --filter @yunshu/admin test` — 单元测试全部通过
- [ ] `pnpm build` — 全仓库构建通过
- [ ] `pnpm test:e2e` — E2E 测试通过（如该批影响到任何现有 E2E）
- [ ] 手动冒烟测试：打开对应页面，检查交互正常
- [ ] **设计系统合规检查**：新增样式是否使用设计令牌（无硬编码颜色/间距）
- [ ] 提交规范：`feat(<模块>): <描述>` / `fix(<模块>): <描述>` / `test(<模块>): <描述>`
- [ ] 关联 PR 已创建，并包含本次修改的文件列表和截图/录屏

---

## 六、关键风险与缓解策略

| 风险 | 影响 | 缓解策略 |
|------|------|---------|
| pnpm 版本不一致导致 lockfile 差异 | CI 失败、依赖漂移 | 使用 `corepack` 强制锁定 `pnpm@9.0.0`；在 CI 中加 `pnpm install --frozen-lockfile` 校验 |
| 国内镜像偶尔不稳定 | 安装失败 | `.npmrc` 中已配置 `npmmirror.com`，保留回退源方案；缓存依赖到 pnpm store |
| 工作流后端 API 未就绪 | 第5批阻塞 | 与后端对齐接口契约，先用 `@yunshu/shared` 的类型定义先行；前端可用 mock + 类型占位并行，后端就绪后仅需替换 API 路径 |
| 大屏设计器交互复杂易引入 bug | 第6批延期 | 拆分子任务：先渲染、再拖动、再数据源；每步完成后立即 E2E 验证 |
| E2E 测试随功能变化需反复更新 | 第7批成本上升 | 第7批放在功能稳定后执行；使用 page object pattern 抽取公共操作 |
| 暗色主题样式细节需反复调整 | 第2批超期 | 先让 Element Plus 内置暗色生效，再逐步修复自定义组件的细节；分两阶段交付 |
| **设计系统合规检查引入大量修改** | **第8批工作量超预期** | **分阶段执行：先统一颜色定义 + 配置 Stylelint（8.1-8.3），再分批修复硬编码文件（8.4 可拆分为多日执行）；允许例外标注（eslint-disable-next-line）** |

---

## 七、交付里程碑与时间估算

| 批次 | 内容 | 预计工时 | 里程碑日期 |
|------|------|---------|-----------|
| 第1批 | 基础设施修复 | 4 小时 | Day 1 |
| 第2批 | 主题与布局完善 | 12 小时 | Day 2-3 |
| 第3批 | 个人中心与体验 | 9 小时 | Day 4 |
| 第4批 | 用户/租户完善 | 5 小时 | Day 4-5 |
| 第5批 | 工作流真实 API | 20-28 小时 | Day 6-8 |
| 第6批 | 大屏设计器完善 | 16 小时 | Day 9-10 |
| 第7批 | 测试覆盖补充 | 22 小时 | Day 11-13 |
| 第8批 | 设计系统合规检查 | 9 小时 | Day 3-4（与第2批并行） |
| **合计** | | **约 7-8 个工作日（1人）** | **2 周左右** |

---

## 八、pNpM 快速故障排查

```bash
# ========== 问题0：engine-strict 拒绝安装 ==========
# 错误：pnpm engine-strict 报错 "Unsupported engine"
# 原因：当前 Node/pnpm 版本不满足 engines 字段要求
# 解决：
nvm use 20                 # 激活 .nvmrc 指定的 Node 版本
corepack enable            # 确保 Corepack 激活
corepack prepare pnpm@9.0.0 --activate  # 确保 pnpm 版本正确
pnpm install               # 重试

# 问题1：依赖版本错乱
pnpm why <package-name>        # 查看引用链
pnpm list -r                  # 查看所有 workspace 的依赖树

# 问题2：重装依赖（干净启动）
rm -rf node_modules pnpm-lock.yaml
pnpm store prune              # 清理缓存
pnpm install                  # 重新生成

# 问题3：子包相互依赖未生效
pnpm ls @yunshu/shared        # 检查 workspace 协议是否解析正确

# 问题4：CI 中依赖安装失败
pnpm install --frozen-lockfile --prefer-offline  # 严格按 lockfile + 优先缓存
```

# Playground 演示模块 — 完成计划

> 文档编号：`YUNSHU-PLAYGROUND-PLAN-2026-06`
> 更新日期：2026-06-22
> 负责人：前端团队
> 预计总工时：12-15 小时（约 1.5-2 天）

---

## 一、概述

### 1.1 目标

创建 `@yunshu/playground` 组件演示应用，为开发者提供直观的组件展示和交互测试环境。通过 Playground，用户可以：

- 查看所有 `@yunshu/ui` 组件的实际效果
- 实时调整组件属性，观察变化
- 复制组件代码片段直接使用
- 在亮色/暗色主题下预览组件

### 1.2 现状

| 项目 | 状态 |
|------|------|
| `apps/playground` 目录 | ✅ 已创建 |
| 根脚本 `playground:dev` | ✅ 已配置 |
| workspace 配置 | ✅ 已包含 `apps/*` |

### 1.3 前置依赖

- ✅ 批次 1-8 已完成（组件库 `@yunshu/ui` 可用）
- ✅ 设计令牌 `@yunshu/design-tokens` 可用
- ✅ 品牌色 #4a9eff 已统一

---

## 二、项目结构

```
apps/playground/
├── package.json                          # 包定义
├── vite.config.ts                        # Vite 配置
├── tsconfig.json                         # TypeScript 配置
├── tsconfig.app.json                     # TypeScript 应用配置
├── index.html                            # 入口 HTML
└── src/
    ├── main.ts                           # 入口文件
    ├── App.vue                           # 根组件
    ├── router/
    │   └── index.ts                      # 路由配置
    ├── layouts/
    │   └── Layout.vue                    # 布局组件（侧边栏 + 内容区）
    ├── components/
    │   ├── Sidebar.vue                   # 组件分类导航
    │   ├── ComponentDemo.vue             # 组件演示容器
    │   ├── PropsPanel.vue                # 属性配置面板
    │   └── CodePreview.vue               # 代码预览组件
    └── demos/
        ├── button/
        │   └── ButtonDemo.vue            # Button 演示
        ├── table/
        │   └── TableDemo.vue             # Table 演示
        ├── chart/
        │   ├── AreaChartDemo.vue         # 面积图演示
        │   ├── BarChartDemo.vue          # 柱状图演示
        │   ├── LineChartDemo.vue         # 折线图演示
        │   ├── PieChartDemo.vue          # 饼图演示
        │   └── RingChartDemo.vue         # 环形图演示
        ├── gauge/
        │   └── GaugeDemo.vue             # 仪表盘演示
        ├── upload/
        │   └── OssUploadDemo.vue         # 上传演示
        └── i18n/
            ├── LanguageSwitchDemo.vue    # 语言切换演示
            └── TenantSelectDemo.vue      # 租户选择演示
```

---

## 三、分阶段任务清单

### 📦 阶段一 — 项目初始化（约 2 小时）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 | 状态 |
|---|---------|---------|---------|---------|------|------|
| 1.1 | 创建 package.json | [package.json](file:///workspace/apps/playground/package.json)（新建） | 定义 `@yunshu/playground`，配置 scripts（dev/build/preview），添加依赖（vue、vue-router、element-plus、@yunshu/ui、@yunshu/design-tokens） | pnpm install 无错误，package.json 包含所有必要依赖 | 0.5h | ✅ |
| 1.2 | 创建 Vite 配置 | [vite.config.ts](file:///workspace/apps/playground/vite.config.ts)（新建） | 配置 Vue 3 插件、路径别名、样式预处理（scss） | vite dev 可启动 | 0.5h | ✅ |
| 1.3 | 创建 TypeScript 配置 | [tsconfig.json](file:///workspace/apps/playground/tsconfig.json)（新建）、[tsconfig.app.json](file:///workspace/apps/playground/tsconfig.app.json)（新建） | 配置路径别名、target ES2020、strict 模式、Vue 类型声明 | 无 TS 错误 | 0.5h | ✅ |
| 1.4 | 创建入口文件 | [index.html](file:///workspace/apps/playground/index.html)（新建）、[main.ts](file:///workspace/apps/playground/src/main.ts)（新建） | index.html 引入主题样式；main.ts 创建 Vue 实例、挂载路由、配置 Element Plus 组件库 | 页面能正常渲染 | 0.5h | ✅ |

---

### 🎨 阶段二 — 基础配置与布局（约 2 小时）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 | 状态 |
|---|---------|---------|---------|---------|------|------|
| 2.1 | 配置主题与样式 | [src/style.scss](file:///workspace/apps/playground/src/style.scss)（新建） | 引入 `@yunshu/design-tokens` 生成的 CSS 变量；配置品牌色 #4a9eff；定义布局样式 | 页面使用品牌色主题，暗色模式可切换 | 0.5h | ✅ |
| 2.2 | 创建路由配置 | [src/router/index.ts](file:///workspace/apps/playground/src/router/index.ts)（新建） | 配置路由：首页、组件分类路由（基础组件、图表组件、数据组件、表单组件） | 导航可正常跳转 | 0.5h | ✅ |
| 2.3 | 创建主布局组件 | [src/layouts/Layout.vue](file:///workspace/apps/playground/src/layouts/Layout.vue)（新建） | 左侧侧边栏（组件分类导航）、右侧内容区（组件演示）、顶部标题栏（Logo + 主题切换） | 布局清晰，侧边栏可折叠 | 0.5h | ✅ |
| 2.4 | 创建根组件 App.vue | [src/App.vue](file:///workspace/apps/playground/src/App.vue)（新建） | 使用 Layout 组件，配置 RouterView | 路由视图正常渲染 | 0.5h | ✅ |

---

### 🧩 阶段三 — 组件演示页面（约 6-8 小时）

#### 3.1 基础组件演示（约 2 小时）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 | 状态 |
|---|---------|---------|---------|---------|------|------|
| 3.1.1 | Button 组件演示 | [src/pages/Button.vue](file:///workspace/apps/playground/src/pages/Button.vue)（新建） | 展示按钮类型（primary/default/success/warning/danger）、尺寸（large/default/small）、状态（disabled/loading）、图标按钮 | 所有按钮样式和状态正常显示 | 0.5h | ✅ |
| 3.1.2 | Table 组件演示 | [src/pages/Table.vue](file:///workspace/apps/playground/src/pages/Table.vue)（新建） | 展示表格列配置、分页、排序、筛选、固定列、斑马纹、边框样式 | 表格功能完整，数据正常显示 | 0.5h | ✅ |
| 3.1.3 | LanguageSwitch 演示 | 暂未实现 | 展示中文/English 切换，切换后界面文字更新 | 语言切换即时生效 | 0.5h | ⬜ |
| 3.1.4 | TenantSelect 演示 | 暂未实现 | 展示租户下拉选择，选择后显示租户信息 | 租户切换正常 | 0.5h | ⬜ |

#### 3.2 图表组件演示（约 3 小时）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 | 状态 |
|---|---------|---------|---------|---------|------|------|
| 3.2.1 | 面积图演示 | [src/pages/AreaChart.vue](file:///workspace/apps/playground/src/pages/AreaChart.vue)（新建） | 展示面积图组件，支持数据配置、颜色配置 | 图表正常渲染，数据更新生效 | 0.6h | ✅ |
| 3.2.2 | 柱状图演示 | [src/pages/BarChart.vue](file:///workspace/apps/playground/src/pages/BarChart.vue)（新建） | 展示柱状图组件，支持单柱/多柱、堆叠模式 | 图表正常渲染 | 0.6h | ✅ |
| 3.2.3 | 折线图演示 | [src/pages/LineChart.vue](file:///workspace/apps/playground/src/pages/LineChart.vue)（新建） | 展示折线图组件，支持平滑曲线、数据点标记 | 图表正常渲染 | 0.6h | ✅ |
| 3.2.4 | 饼图演示 | [src/pages/PieChart.vue](file:///workspace/apps/playground/src/pages/PieChart.vue)（新建） | 展示饼图组件，支持图例、百分比显示 | 图表正常渲染 | 0.6h | ✅ |
| 3.2.5 | 环形图演示 | [src/pages/RingChart.vue](file:///workspace/apps/playground/src/pages/RingChart.vue)（新建） | 展示环形图组件，支持中心文字、数据标签 | 图表正常渲染 | 0.6h | ✅ |

#### 3.3 数据组件演示（约 2 小时）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 | 状态 |
|---|---------|---------|---------|---------|------|------|
| 3.3.1 | 仪表盘演示 | [src/pages/Gauge.vue](file:///workspace/apps/playground/src/pages/Gauge.vue)（新建） | 展示仪表盘组件，支持数值范围、颜色分段 | 仪表盘正常渲染 | 0.5h | ✅ |
| 3.3.2 | 数据表格演示 | 暂未实现 | 展示大屏表格组件，支持行列配置、样式定制 | 表格正常渲染 | 0.5h | ⬜ |
| 3.3.3 | 文本组件演示 | 暂未实现 | 展示文本组件，支持字体大小、颜色、对齐方式 | 文本样式可配置 | 0.5h | ⬜ |
| 3.3.4 | 图片组件演示 | 暂未实现 | 展示图片组件，支持图片 URL、宽高比、圆角 | 图片正常显示 | 0.5h | ⬜ |

#### 3.4 表单组件演示（约 1 小时）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 | 状态 |
|---|---------|---------|---------|---------|------|------|
| 3.4.1 | 文件上传演示 | [src/pages/Upload.vue](file:///workspace/apps/playground/src/pages/Upload.vue)（新建） | 展示文件上传组件，支持单文件/多文件上传、文件预览、删除 | 上传功能正常 | 1h | ✅ |

---

### ✨ 阶段四 — 交互体验完善（约 2-3 小时）

| # | 任务标题 | 涉及文件 | 任务详情 | 验收标准 | 工时 | 状态 |
|---|---------|---------|---------|---------|------|------|
| 4.1 | 创建属性配置面板 | 各演示页面内置 | 动态展示当前组件的可配置属性，支持实时调整 | 修改属性后组件即时更新 | 1h | ✅ |
| 4.2 | 创建代码预览组件 | 暂未实现 | 展示当前组件的 Vue 代码片段，支持复制到剪贴板 | 代码格式正确，复制功能正常 | 0.5h | ⬜ |
| 4.3 | 创建组件演示容器 | 各演示页面内置 | 整合演示区域、属性面板，提供清晰的布局 | 布局清晰，交互流畅 | 0.5h | ✅ |
| 4.4 | 暗色主题支持 | [src/layouts/Layout.vue](file:///workspace/apps/playground/src/layouts/Layout.vue) | 在顶部标题栏添加主题切换按钮（sun/moon），支持亮色/暗色模式切换 | 切换主题后所有组件自适应 | 0.5h | ✅ |
| 4.5 | 响应式布局优化 | [src/layouts/Layout.vue](file:///workspace/apps/playground/src/layouts/Layout.vue) | 侧边栏在小屏幕下自动折叠为图标模式，内容区自适应 | 移动端显示正常 | 0.5h | ⬜ |

---

## 四、技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue | 3.4+ | 主框架 |
| 路由 | Vue Router | 4.2+ | 路由管理 |
| UI 组件库 | Element Plus | 2.10+ | 基础组件 |
| 云枢组件 | @yunshu/ui | workspace:* | 自定义组件 |
| 设计令牌 | @yunshu/design-tokens | workspace:* | 品牌色、设计变量 |
| 构建工具 | Vite | 5.0+ | 快速开发构建 |
| 语言 | TypeScript | 5.4+ | 类型安全 |
| 样式 | SCSS | 1.70+ | CSS 预处理器 |

---

## 五、每阶段开始前检查清单

- [ ] `pnpm --version` 输出 `9.0.0`
- [ ] `node --version` 输出 `>= 20.0.0`
- [ ] `pnpm install` 已在根目录执行，无警告
- [ ] `pnpm --filter @yunshu/ui build` 组件库构建成功
- [ ] 当前分支为 `develop` 或 `feature/batch9-playground`

---

## 六、每阶段完成后验证清单

- [ ] `pnpm --filter @yunshu/playground dev` 可正常启动
- [ ] `pnpm --filter @yunshu/playground build` 构建通过
- [ ] `pnpm --filter @yunshu/playground type-check` 无 TS 错误
- [ ] `pnpm lint` 无 lint 错误
- [ ] 手动验证：各组件演示页面可正常打开，交互正常
- [ ] 设计系统合规检查：使用 `@yunshu/design-tokens` 变量，无硬编码颜色

---

## 七、风险与缓解策略

| 风险 | 影响 | 缓解策略 |
|------|------|----------|
| `@yunshu/ui` 组件接口不稳定 | 演示页面无法正常渲染 | 先锁定组件接口，再开发演示页面 |
| 图表组件数据配置复杂 | 演示页面工作量增加 | 先实现基础展示，再逐步完善配置 |
| 暗色模式兼容性问题 | 部分组件在暗色下显示异常 | 使用设计令牌变量，确保所有颜色自适应 |

---

## 八、完成标准

当以下条件全部满足时，Playground 模块视为完成：

1. ✅ `apps/playground` 目录完整存在
2. ✅ `pnpm playground:dev` 命令可启动演示应用
3. ✅ 所有 15+ 个组件演示页面可正常访问
4. ✅ 属性配置面板可实时调整组件属性
5. ✅ 代码预览功能可复制组件代码
6. ✅ 亮色/暗色主题切换正常
7. ✅ 响应式布局在移动端正常显示
8. ✅ 构建、类型检查、lint 全部通过

---

## 九、后续扩展计划

完成基础版本后，可考虑以下扩展：

- [ ] 添加组件搜索功能
- [ ] 支持组件组合演示（多个组件配合使用）
- [ ] 添加组件 API 文档链接
- [ ] 支持演示代码在线编辑运行
- [ ] 添加组件性能指标展示

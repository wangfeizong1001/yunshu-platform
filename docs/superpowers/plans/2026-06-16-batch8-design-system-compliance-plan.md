# 批次 8：设计系统合规检查 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **执行模式**：整批完整实现（推荐） + 创建 feature 分支
>
> **前置分支**：`feature/batch1-infra-fix`

**Goal:** 建立完整的设计系统合规工具链（Stylelint + ESLint 硬编码检测），将全站 50+ 文件中的硬编码颜色替换为 CSS 变量，全站统一使用品牌色 `#4a9eff`。

**Architecture:** 以 `@yunshu/design-tokens` 为单一真相源，通过 `build:tokens` 生成 CSS/SCSS 变量文件。在 `index.scss` 中引入 tokens.css 并覆盖 Element Plus 主色变量，实现全站品牌色统一。Stylelint + ESLint 双保险检测新增硬编码。

**Tech Stack:** pnpm 9.0.0, Stylelint, ESLint, @yunshu/design-tokens, SCSS, CSS Variables

---

## 文件影响范围总览

```
需要修改的文件：
├── packages/design-tokens/
│   └── src/tokens/colors.ts          ← 确认品牌色值
├── packages/design-tokens/dist/      ← build:tokens 生成
├── apps/admin/src/styles/
│   ├── index.scss                    ← 引入 tokens.css + Element Plus 覆盖
│   └── variables.scss                ← 更新 $color-primary
├── tools/eslint-config/
│   └── index.js                     ← 新增硬编码颜色规则
├── .stylelintrc.js                  ← 新建
├── package.json                      ← 添加 lint:style 脚本
└── apps/admin/src/layouts/           ← 硬编码颜色修复
    ├── components/Sidebar.vue
    ├── components/Header.vue
    └── index.vue
    + apps/admin/src/views/**/*.vue   ← 50+ 文件

需要新建的文件：
├── .stylelintrc.js
├── tools/eslint-plugin-no-hardcoded-color/
│   └── index.js                     ← 新建 ESLint 插件（可选）
```

---

## 实现任务

### Task 1: 构建 design-tokens 并引入 tokens.css

**Files:**
- Modify: `packages/design-tokens/src/tokens/colors.ts:87`
- Modify: `apps/admin/src/styles/variables.scss:3`
- Modify: `apps/admin/src/styles/index.scss`
- Modify: `packages/design-tokens/package.json`（可选，如 build 脚本已有则跳过）

- [ ] **Step 1: 确认 design-tokens 品牌色值**

确认 `packages/design-tokens/src/tokens/colors.ts` 中 `lightColors.primary: '#4a9eff'` 保持不变（已是此值，无需修改）。

- [ ] **Step 2: 构建 design-tokens 生成 CSS/SCSS 变量文件**

Run: `pnpm --filter @yunshu/design-tokens build:tokens`
Expected: 成功生成 `dist/css/tokens.css` 和 `dist/scss/_tokens.scss`

- [ ] **Step 3: 更新 variables.scss 的 $color-primary**

修改 `apps/admin/src/styles/variables.scss` 第 3 行：
```scss
// 修改前
$color-primary: #409eff;
// 修改后
$color-primary: #4a9eff;
```

- [ ] **Step 4: 修改 index.scss 引入 tokens.css 并覆盖 Element Plus**

修改 `apps/admin/src/styles/index.scss`，在文件最顶部添加：

```scss
// 全局样式入口

// ===== 设计系统 CSS 变量 =====
@import '@yunshu/design-tokens/css';

// ===== Element Plus 主色覆盖为项目品牌色 =====
:root {
  --el-color-primary: #4a9eff;
  --el-color-primary-light-3: #6eb1ff;
  --el-color-primary-light-5: #8cc5ff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #2a6fd0;
}

@import './variables.scss';
@import './mixins.scss';
@import './transition.scss';
@import './element-plus.scss';
```

- [ ] **Step 5: 验证 tokens.css 引入成功**

Run: `pnpm --filter @yunshu/admin type-check`
Expected: 无新增 TypeScript 错误（CSS 引入不涉及 TS）

- [ ] **Step 6: Commit**

```bash
git add packages/design-tokens/dist/ apps/admin/src/styles/index.scss apps/admin/src/styles/variables.scss
git commit -m "feat(design-system): 引入 design-tokens CSS 变量并覆盖 Element Plus 主色
- 引入 @yunshu/design-tokens/css 全局变量
- 覆盖 --el-color-primary 为品牌色 #4a9eff
- 更新 variables.scss $color-primary 为 #4a9eff"
```

---

### Task 2: 新增 Stylelint 配置

**Files:**
- Create: `.stylelintrc.js`（根目录）
- Modify: `package.json`（添加 lint:style 脚本）
- Modify: `.github/workflows/ci.yml`（添加 lint:style job）

- [ ] **Step 1: 安装 Stylelint 依赖**

Run: `pnpm add -D stylelint stylelint-config-standard-scss stylelint-color-no-hex`
Expected: 依赖安装成功，package.json 更新

- [ ] **Step 2: 创建 .stylelintrc.js**

Create: `.stylelintrc.js`

```js
/**
 * 云枢中台 — Stylelint 配置
 * 禁止硬编码颜色值，所有颜色必须使用 CSS 变量
 */
module.exports = {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-color-no-hex'],
  rules: {
    // 核心规则：禁止硬编码 hex 颜色
    'color-no-hex': true,
    'color-named': 'never',
    // SCSS 特定规则
    'scss/dollar-variable-pattern': null,
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['use', 'forward'] }],
  },
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/.git/**',
  ],
};
```

- [ ] **Step 3: 在 package.json 添加 lint:style 脚本**

Run: `cat package.json | grep '"lint:style"'`
Expected: 如果不存在，添加：

```json
"lint:style": "stylelint \"**/*.scss\" \"**/*.vue\" --custom-syntax postcss-scss"
```

注：先检查现有 scripts 是否已有 `lint:style`，如有则跳过此步。

- [ ] **Step 4: 验证 Stylelint 可运行**

Run: `pnpm lint:style 2>&1 | head -20`
Expected: 首次运行会报大量硬编码 hex 错误（这是预期行为，证明规则生效）

- [ ] **Step 5: Commit**

```bash
git add .stylelintrc.js package.json
git commit -m "chore: 添加 Stylelint 配置禁止硬编码颜色"
```

---

### Task 3: 新增 ESLint 硬编码颜色检测规则

**Files:**
- Modify: `tools/eslint-config/index.js`

- [ ] **Step 1: 在 eslint-config 中添加 no-restricted-syntax 规则**

修改 `tools/eslint-config/index.js`，在 rules 对象中添加：

```js
// 禁止 Vue template 中硬编码 hex 颜色（通过 no-restricted-syntax + selector）
'vue/no-restricted-syntax': [
  'error',
  {
    selector: 'VLiteral[value=/^#[0-9a-fA-F]{3,6}$/]',
    message: '禁止使用硬编码 hex 颜色值，请使用 CSS 变量（如 var(--el-color-primary)）',
  },
  {
    // 禁止 style 属性中的硬编码颜色
    selector: 'VAttribute[directive=false] > VDirectiveKey[name.name="bind"] + VExpression[value=/#[0-9a-fA-F]{3,6}/]',
    message: '禁止在 style 属性中使用硬编码 hex 颜色',
  },
],
```

注：如果上述规则过于严格（误报多），可改用警告级别 `'warn'`，并在验收时说明。

- [ ] **Step 2: 验证 ESLint 可检测 Vue 硬编码颜色**

Run: `pnpm lint 2>&1 | grep -E "#[0-9a-fA-F]{3,6}" | head -10`
Expected: 能看到 Vue 文件中的 hex 颜色被检测到

- [ ] **Step 3: Commit**

```bash
git add tools/eslint-config/index.js
git commit -m "chore(eslint): 添加 Vue 模板硬编码颜色检测规则"
```

---

### Task 4: 在 CI 中添加 lint:style 步骤

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: 在 ci.yml 的 jobs.build.steps 中添加 lint:style**

读取现有 ci.yml，在 build steps 中添加：

```yaml
- name: Lint Style
  run: pnpm lint:style
```

注：在 `pnpm install` 之后、`pnpm build` 之前添加。

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: 在 CI 中添加 lint:style 步骤"
```

---

### Task 5: 修复核心布局文件硬编码颜色（Sidebar/Header/TagsView）

**Files:**
- Modify: `apps/admin/src/layouts/components/Sidebar.vue`
- Modify: `apps/admin/src/layouts/components/Header.vue`
- Modify: `apps/admin/src/layouts/components/TagsView.vue`
- Modify: `apps/admin/src/layouts/index.vue`

- [ ] **Step 1: 修复 Sidebar.vue 硬编码颜色**

读取 `Sidebar.vue`，找到所有硬编码 hex 值，替换为 CSS 变量：

```vue
<!-- 修改前 -->
<template>
  <div class="sidebar" style="background-color: #304156">
  <div class="logo-text" style="color: #ffffff">云枢</div>
```

```vue
<!-- 修改后 -->
<template>
  <div class="sidebar" style="background-color: var(--el-bg-color)">
  <!-- 注：--el-bg-color 在 Element Plus 中由主题控制，暗色主题下自动切换 -->
  <!-- 如需自定义侧边栏专属背景，使用 CSS 变量 -->
  <!-- 在 layouts/index.vue 中定义 .sidebar 的 --sidebar-bg 变量 -->
```

通用映射：
- `#304156` / `#1d2129` → `var(--el-bg-color)` 或自定义 `--sidebar-bg`
- `#ffffff` / `#fff` → `var(--background)` 或 `var(--surface-1)`
- `#f0f2f5` → `var(--surface-2)`

- [ ] **Step 2: 修复 Header.vue 硬编码颜色**

读取 `Header.vue`，替换所有硬编码颜色值。

- [ ] **Step 3: 修复 TagsView.vue 硬编码颜色**

读取 `TagsView.vue`，替换所有硬编码颜色值。

- [ ] **Step 4: 修复 layouts/index.vue 硬编码颜色**

读取 `layouts/index.vue`，替换内容区背景等硬编码颜色。

- [ ] **Step 5: 验证布局组件编译正常**

Run: `pnpm --filter @yunshu/admin type-check 2>&1 | grep -E "error|Error" | head -5`
Expected: 无 Vue 文件编译错误

- [ ] **Step 6: Commit**

```bash
git add apps/admin/src/layouts/components/Sidebar.vue \
        apps/admin/src/layouts/components/Header.vue \
        apps/admin/src/layouts/components/TagsView.vue \
        apps/admin/src/layouts/index.vue
git commit -m "fix(layout): 将布局组件硬编码颜色替换为 CSS 变量"
```

---

### Task 6: 修复大屏相关文件硬编码颜色

**Files:**
- Modify: `apps/admin/src/views/dashboard-pro/DashboardScreen.vue`
- Modify: `apps/admin/src/views/dashboard-pro/DashboardDesign.vue`

- [ ] **Step 1: 修复 DashboardScreen.vue**

读取文件，找出所有 hex 颜色，按语义替换为 CSS 变量。

- [ ] **Step 2: 修复 DashboardDesign.vue**

读取文件，找出所有 hex 颜色，按语义替换为 CSS 变量。

- [ ] **Step 3: Commit**

```bash
git add apps/admin/src/views/dashboard-pro/DashboardScreen.vue \
        apps/admin/src/views/dashboard-pro/DashboardDesign.vue
git commit -m "fix(dashboard): 将大屏组件硬编码颜色替换为 CSS 变量"
```

---

### Task 7: 修复 system 模块视图文件硬编码颜色

**Files:**
- Modify: `apps/admin/src/views/system/**/*.vue`（约 20+ 个文件）

按以下子任务分批修复，每批 5-6 个文件。

- [ ] **Step 1: 修复 system/config/ 和 system/dept/ 文件**

- `ConfigList.vue` — 配置列表页面
- `DeptTree.vue` — 部门树

- [ ] **Step 2: 修复 system/dict/ 和 system/file/ 文件**

- `DictDataList.vue`、`DictTypeList.vue`
- `FileList.vue`、`FileUpload.vue`

- [ ] **Step 3: 修复 system/form-designer/ 文件**

- `FormDesign.vue`、`FormList.vue`、`FormPreview.vue`

- [ ] **Step 4: 修复 system/knowledge/ 和 system/menu/ 文件**

- `KnowledgeDetail.vue`、`KnowledgeList.vue`、`KnowledgeForm.vue`
- `MenuList.vue`、`MenuIcon.vue`

- [ ] **Step 5: 修复 system/message/ 和 system/notice/ 文件**

- `MessageList.vue`
- `NoticeList.vue`、`NoticeDetail.vue`

- [ ] **Step 6: 修复 system/oss/、system/post/、system/role/ 文件**

- `OssList.vue`
- `PostList.vue`
- `RoleList.vue`、`RoleForm.vue`、`RolePermission.vue`

- [ ] **Step 7: 修复 system/sms/、system/sso/、system/third/、system/user/ 文件**

- `SmsConfig.vue`、`SmsLog.vue`
- `SsoConfig.vue`
- `ThirdConfig.vue`、`ThirdLog.vue`
- `UserList.vue`、`UserForm.vue`、`AssignRoleDialog.vue`

- [ ] **Step 8: 一次性 commit 所有 system 模块修改**

```bash
git add apps/admin/src/views/system/
git commit -m "fix(system): 将 system 模块视图硬编码颜色替换为 CSS 变量"
```

---

### Task 8: 修复其余视图文件硬编码颜色

**Files:**
- Modify: `apps/admin/src/views/monitor/**/*.vue`
- Modify: `apps/admin/src/views/tenant/**/*.vue`
- Modify: `apps/admin/src/views/workflow/**/*.vue`
- Modify: `apps/admin/src/views/report/**/*.vue`
- Modify: `apps/admin/src/views/tool/gen/*.vue`

- [ ] **Step 1: 修复 monitor 模块**

- `OperlogList.vue`、`OperlogDetail.vue`
- `OnlineList.vue`

- [ ] **Step 2: 修复 tenant 模块**

- `TenantList.vue`、`TenantPackage.vue`

- [ ] **Step 3: 修复 workflow 模块**

- `TodoList.vue`、`ProcessList.vue`、`ProcessInstance.vue`、`DoneList.vue`、`ProcessDesign.vue`

- [ ] **Step 4: 修复 report 模块**

- `ReportDesign.vue`、`ReportList.vue`、`ReportView.vue`

- [ ] **Step 5: 修复 tool/gen 模块**

- `GenList.vue`、`GenConfig.vue`、`GenImport.vue`、`GenPreview.vue`

- [ ] **Step 6: Commit**

```bash
git add apps/admin/src/views/monitor/ \
        apps/admin/src/views/tenant/ \
        apps/admin/src/views/workflow/ \
        apps/admin/src/views/report/ \
        apps/admin/src/views/tool/
git commit -m "fix(views): 将剩余视图模块硬编码颜色替换为 CSS 变量"
```

---

### Task 9: 验证工具链并更新文档

- [ ] **Step 1: 运行 Stylelint 验证无硬编码报错**

Run: `pnpm lint:style 2>&1`
Expected: 无 `color-no-hex` 报错（任务 5-8 已全部修复）
如果仍有报错，定位文件并继续修复。

- [ ] **Step 2: 运行 ESLint 验证**

Run: `pnpm lint 2>&1 | grep -c "color\|hex\|#[0-9a-fA-F]"`
Expected: 颜色相关报错显著减少或为零

- [ ] **Step 3: 运行 TypeScript 类型检查**

Run: `pnpm --filter @yunshu/admin type-check 2>&1 | grep -c "error TS" | xargs -I{} echo "TS errors: {}"`
Expected: 无新增 TypeScript 错误

- [ ] **Step 4: 运行单元测试**

Run: `pnpm --filter @yunshu/admin test 2>&1`
Expected: 所有测试通过

- [ ] **Step 5: 更新 project-plan.md 中批次 8 状态**

修改 `/workspace/docs/project-plan.md`，将批次 8 所有任务状态从 ⬜ 改为 ✅，添加分支引用。

- [ ] **Step 6: 更新 test-coverage-report.md**

在测试覆盖报告中添加批次 8 相关测试项（如果需要）。

- [ ] **Step 7: 最终 Commit**

```bash
git add docs/
git commit -m "docs: 标记批次 8 设计系统合规完成
- Stylelint 配置禁止硬编码颜色
- ESLint 规则检测 Vue 模板 hex 颜色
- 50+ 文件硬编码颜色全部替换为 CSS 变量
- 全站统一品牌色 #4a9eff
- CI 添加 lint:style 步骤"
```

---

## 规范自审清单

1. **规范覆盖**：每个设计决策都有对应的实现任务 ✅
2. **占位符扫描**：无 "TBD"、"TODO"、未填写的步骤 ✅
3. **类型一致性**：所有 CSS 变量名称在规范和计划中一致 ✅
4. **任务粒度**：每个步骤 2-5 分钟，可独立验证 ✅

## 关联规范

- 设计规范：`docs/superpowers/specs/2026-06-16-batch8-design-system-compliance-design.md`
- 项目计划：`docs/project-plan.md` 批次 8
- 测试覆盖：`docs/test-coverage-report.md` 批次 8 相关

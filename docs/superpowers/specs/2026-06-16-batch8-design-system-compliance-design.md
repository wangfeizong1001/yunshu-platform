# 批次 8：设计系统合规检查 — 设计规范

> 文档编号：`YUNSHU-SPEC-2026-06-BATCH8`
> 创建日期：2026-06-16
> 负责人：前端团队
> 状态：草稿

---

## 一、背景与目标

### 1.1 现状问题

经过对 `apps/admin` 下 40+ 视图文件的审查，共发现以下设计系统合规问题：

| 问题类型 | 数量 | 说明 |
|----------|------|------|
| 硬编码颜色（hex 值） | 50+ 个文件 | 直接使用 `#xxxxxx` 颜色值，不走设计令牌 |
| `variables.scss` 与 design-tokens 颜色不一致 | 主色冲突 | `$color-primary: #409eff` vs `design-tokens` 主色 `#4a9eff` |
| 缺失 Stylelint 检查 | 无 | 无工具检测 SCSS/CSS 中的硬编码颜色和间距 |
| 缺失 ESLint 硬编码颜色规则 | 无 | ESLint 无法检测 Vue template 中的 hex 值 |
| `index.scss` 未引入 design-tokens | 断链 | 已有的 design-tokens 包未被使用 |

### 1.2 目标

1. **颜色统一**：所有颜色值唯一来源为 `@yunshu/design-tokens` 包，生成 CSS 变量供全站使用
2. **硬编码禁止**：通过 Stylelint + ESLint 双保险，任何新增硬编码 hex/spacing 均可在 CI 或本地 lint 时被发现
3. **主题适配**：所有硬编码修复后，暗色主题切换时所有颜色自适应，无需手动调整

---

## 二、设计决策

### 2.1 颜色值体系决策

**决策**：全站统一使用项目品牌色 `#4a9eff`，包括 Element Plus 组件。

**设计逻辑**：
- **唯一品牌色**：`#4a9eff` 作为全站唯一主色，通过 CSS 变量 `--el-color-primary` 覆盖 Element Plus 默认色
- 所有组件（Element Plus + 自定义组件）均使用 `--el-color-primary`（已被覆盖为 `#4a9eff`）
- 项目自定义 design-tokens CSS 变量（`--primary`）与 Element Plus 变量（`--el-color-primary`）指向同一数值

**实现方式**：
在 `index.scss` 中通过 CSS 变量覆盖实现：

```scss
// apps/admin/src/styles/index.scss
:root {
  // 将 Element Plus 主色覆盖为项目品牌色
  --el-color-primary: #4a9eff;
  --el-color-primary-light-3: #6eb1ff;
  --el-color-primary-light-5: #8cc5ff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #2a6fd0;
}
```

**影响范围**：
- `packages/design-tokens/src/tokens/colors.ts`：`primary: #4a9eff` 保持不变
- `apps/admin/src/styles/variables.scss`：`$color-primary` 更新为 `#4a9eff`
- `apps/admin/src/styles/index.scss`：引入 `@yunshu/design-tokens/css` + Element Plus 变量覆盖
- Element Plus 的 `--el-color-primary` 在运行时被覆盖为 `#4a9eff`（无需修改 Element Plus 源码）

### 2.2 CSS 变量体系决策

**决策**：统一使用 `design-tokens` 生成的 CSS 变量 + Element Plus 变量（已覆盖为品牌色）

**变量优先级（从高到低）**：

| 优先级 | 来源 | 示例 | 适用场景 |
|--------|------|------|----------|
| 1 | Element Plus 变量（已覆盖为品牌色） | `--el-color-primary`（=`#4a9eff`） | 所有需要主色的场景 |
| 2 | design-tokens CSS 变量 | `--primary`、`--surface-1`、`--text-primary` | 项目自定义组件和布局 |
| 3 | 项目 SCSS 变量 | `$color-primary`（=`#4a9eff`） | SCSS 混合器/函数 |

**绝对禁止**：
- ❌ 直接在 Vue template / script 中写 hex 值（如 `color: #409eff`）
- ❌ 直接在 SCSS 中写 hex 值（如 `color: #4a9eff`）
- ❌ 使用颜色名（如 `red`、`blue`）

**例外标注**（需附注释）：
```vue
<!-- stylelint-disable-next-line color-no-hex -->
<!-- 图表库 ECharts 不支持 CSS 变量，使用固定色值 -->
color: '#4a9eff'
```

### 2.3 修复范围决策

**决策**：全部 50+ 个文件全部修复

**理由**：
- 设计系统合规是基础设施问题，不彻底修复会导致后续主题切换失效
- 工具链建立后，修复成本可控（Stylelint 报告 + 批量替换）
- 分批修复会导致混合状态（部分文件用变量、部分用 hex），增加维护成本

---

## 三、执行方案

### 3.1 任务 8.1：统一 design-tokens + 覆盖 Element Plus 主色

**步骤**：

1. 修改 `packages/design-tokens/src/tokens/colors.ts`：
   - 确认 `primary: #4a9eff`（项目品牌色）保持不变
   - 确认其他语义化颜色（success/warning/danger/info）按设计意图设定
2. 构建 design-tokens：
   ```bash
   cd packages/design-tokens
   pnpm build:tokens
   ```
   生成文件：
   - `dist/css/tokens.css` — CSS 变量文件（含 `--primary: #4a9eff`）
   - `dist/scss/_tokens.scss` — SCSS 变量文件
3. 修改 `apps/admin/src/styles/variables.scss`：
   - 更新 `$color-primary` 为 `#4a9eff`（与 design-tokens 对齐）
4. 修改 `apps/admin/src/styles/index.scss`：
   - 在顶部添加 `@import '@yunshu/design-tokens/css';`
   - 在 `:root` 中覆盖 Element Plus 主色变量：
   ```scss
   :root {
     /* 全站统一品牌色：覆盖 Element Plus 默认主色 */
     --el-color-primary: #4a9eff;
     --el-color-primary-light-3: #6eb1ff;
     --el-color-primary-light-5: #8cc5ff;
     --el-color-primary-light-7: #c6e2ff;
     --el-color-primary-light-8: #d9ecff;
     --el-color-primary-light-9: #ecf5ff;
     --el-color-primary-dark-2: #2a6fd0;
   }
   ```
   - 使 `--primary`、`--surface-1`、覆盖后的 `--el-color-primary` 等 CSS 变量在全局可用

**验收标准**：
- `dist/css/tokens.css` 存在且包含 `--primary: #4a9eff`
- `index.scss` 引入 tokens.css + Element Plus 覆盖后，全局 CSS 变量生效
- 浏览器 DevTools 检查：`:root` 中 `--el-color-primary` 为 `#4a9eff`
- Element Plus 组件（按钮、链接等）在浏览器中显示的品牌色为 `#4a9eff`

### 3.2 任务 8.2：新增 Stylelint 配置

**步骤**：

1. 安装依赖：
   ```bash
   pnpm add -D stylelint stylelint-config-standard-scss stylelint-color-no-hex
   ```
2. 创建 `.stylelintrc.js`：
   ```js
   module.exports = {
     extends: [
       'stylelint-config-standard-scss',
     ],
     plugins: ['stylelint-color-no-hex'],
     rules: {
       'color-no-hex': true,
       'color-named': 'never',
       // 禁止硬编码间距（可选，宽松）
       // 'declaration-property-value-disallowed-list': [...]
     },
     ignoreFiles: [
       '**/node_modules/**',
       '**/dist/**',
       '**/coverage/**',
     ],
   }
   ```
3. 在 `package.json` 中添加脚本：
   ```json
   "lint:style": "stylelint \"**/*.scss\" \"**/*.css\""
   ```
4. 在 CI (`ci.yml`) 中添加 lint:style 步骤

**验收标准**：
- 运行 `pnpm lint:style` 可检测出 SCSS 文件中的硬编码 hex 颜色
- 现有 50+ 文件首次运行会产生大量报错（这是预期行为，后续 8.4 修复）

### 3.3 任务 8.3：ESLint 新增硬编码颜色检测规则

**步骤**：

1. 在 `tools/eslint-config/index.js` 中新增自定义规则或使用插件：
   - 方案 A：使用现有插件 `@eslint-plugin-no-unsanitized`（可选）
   - 方案 B：使用 `vue/scoped-css/no-unused-selector` 辅助
   - 方案 C：通过 `no-restricted-syntax` 搭配 AST 匹配 hex 正则（推荐）
2. 具体规则（在 `tools/eslint-config/index.js` 的 rules 中添加）：
   ```js
   // 禁止在 Vue template 中使用硬编码颜色
   // 使用自定义规则或已有插件实现
   // 备选：使用 eslint-plugin-no-restricted-syntax 搭配 selector 检测
   ```

**备选方案（推荐用于 Vue）**：
- 在 `packages/` 下创建 `eslint-plugin-no-hardcoded-color/index.js`
- 注册 `vue/no-hardcoded-color` 规则，检测 Vue template 中的 `#[0-9a-fA-F]{3,6}`
- 在 `tools/eslint-config/index.js` 中 extends

**验收标准**：
- 运行 `pnpm lint` 可检测出 Vue 文件中的硬编码颜色（使用 hex 格式）

### 3.4 任务 8.4：修复全部 50+ 个硬编码颜色文件

**原则**：
- 替换顺序：先核心布局 → 再业务视图 → 最后工具页面
- 每个文件的替换策略：
  1. 找到文件中的 hex 值
  2. 判断语义（背景？文字？边框？阴影？）
  3. 映射到对应的 design-tokens CSS 变量或 Element Plus 变量
  4. 替换

**变量映射表**（使用统一品牌色 `#4a9eff`）：

| 原 hex 值 | 语义 | 替换为 |
|-----------|------|--------|
| `#303133` / `#212529` | 主要文本 | `var(--text-primary)` |
| `#606266` / `#6c757d` | 常规文本 | `var(--text-secondary)` |
| `#909399` / `#adb5bd` | 次要文本 | `var(--text-muted)` |
| `#ffffff` / `#fff` | 白色背景 | `var(--background)` 或 `var(--surface-1)` |
| `#f0f2f5` / `#f8f9fa` | 内容区背景 | `var(--surface-2)` |
| `#dcdfe6` / `#dee2e6` | 边框色 | `var(--border)` |
| `#67c23a` / `#27ae60` | 成功色 | `var(--success)` |
| `#e6a23c` / `#d35400` | 警告色 | `var(--warning)` |
| `#f56c6c` / `#c0392b` | 危险色 | `var(--danger)` |
| `#4a9eff` | 项目品牌主色 | `var(--primary)` 或 `var(--el-color-primary)` |
| `#409eff` | Element Plus 默认主色 | `var(--el-color-primary)`（已在 index.scss 中覆盖为 `#4a9eff`） |

> **说明**：全站主色统一为 `#4a9eff`，通过 CSS 变量 `--el-color-primary`（Element Plus）和 `--primary`（design-tokens）覆盖实现。两套变量指向同一数值，互不冲突。

**重点修复文件**（按优先级）：

1. **布局组件**（theme 切换直接相关）：
   - `layouts/components/Sidebar.vue` — 侧边栏背景
   - `layouts/components/Header.vue` — 头部背景/文字
   - `layouts/index.vue` — 内容区背景
   - `layouts/components/TagsView.vue` — 标签页背景

2. **大屏相关**（dashboard 主题切换需求强烈）：
   - `views/dashboard-pro/DashboardScreen.vue`
   - `views/dashboard-pro/DashboardDesign.vue`

3. **其他视图**（按模块逐一修复）

**验收标准**：
- `pnpm lint:style` 无 SCSS 硬编码 hex 报错
- `pnpm lint` 无 Vue 硬编码 hex 报错
- 暗色主题切换后，所有修复后的组件颜色正确切换

---

## 四、技术架构

### 4.1 设计令牌包结构

```
@yunshu/design-tokens/
├── src/
│   ├── tokens/
│   │   ├── colors.ts      ← 颜色定义（单一真相源）
│   │   └── base.ts        ← 间距/字体/圆角等
│   ├── generators/
│   │   ├── css.ts         → dist/css/tokens.css
│   │   ├── scss.ts        → dist/scss/_tokens.scss
│   │   └── tailwind.ts    → dist/tailwind/tokens.js
│   └── index.ts           ← 统一导出
├── dist/                  ← 构建产物（被 admin 引用）
│   ├── css/tokens.css
│   ├── scss/_tokens.scss
│   └── tailwind/tokens.js
└── package.json           ← exports 字段暴露多格式
```

### 4.2 CSS 变量注入时机

在 `apps/admin/src/main.ts` 或 `index.scss` 入口处引入：

```scss
// apps/admin/src/styles/index.scss
@import '@yunshu/design-tokens/css';
@import './variables.scss';
```

### 4.3 工具链验证流程

```
代码提交 → pre-commit hook（可选）→ ESLint → Stylelint → CI 自动化检查
```

---

## 五、风险与缓解

| 风险 | 影响 | 缓解策略 |
|------|------|----------|
| 修复 50+ 文件工作量超预期 | 批次 8 超时 | 预估 4 小时，实际可能 6-8 小时；若超期可分批提交 PR |
| 图表库（ECharts）不支持 CSS 变量 | 部分图表颜色无法变量化 | 例外标注 + 注释说明，单独拎出不强制修复 |
| design-tokens 包未构建产物 | admin 无法引用 CSS | 在批次 8 任务 8.1 中先构建，再引用 |
| 暗色主题切换需要运行时变量覆盖 | 部分组件样式需 JS 控制 | 优先使用 Element Plus 的 `--el-theme` 暗色变量，次选自定义 CSS 变量 |

---

## 六、验收标准

- [ ] 任务 8.1：
  - `pnpm --filter @yunshu/design-tokens build:tokens` 成功执行
  - `dist/css/tokens.css` 存在且包含 `--primary: #4a9eff`
  - `apps/admin/src/styles/index.scss` 引入 `@yunshu/design-tokens/css`
  - 浏览器 DevTools 检查：CSS 变量 `--primary`、`--text-primary`、`--surface-1` 等全局可用

- [ ] 任务 8.2：
  - `.stylelintrc.js` 存在于项目根目录
  - `package.json` 含 `"lint:style": "stylelint ..."` 脚本
  - `pnpm lint:style` 可运行（初始会报大量错误，这是预期行为）
  - CI 中 `lint:style` job 存在

- [ ] 任务 8.3：
  - `tools/eslint-config/index.js` 含硬编码颜色检测规则
  - `pnpm lint` 可运行（初始可能对 50+ 文件报 hex 错误）
  - 新增 Vue 文件中若有硬编码 hex，lint 失败

- [ ] 任务 8.4：
  - 核心布局文件（Sidebar.vue、Header.vue、layouts/index.vue）硬编码颜色已替换
  - 大屏相关文件（DashboardScreen.vue、DashboardDesign.vue）硬编码颜色已替换
  - `pnpm lint:style` 报错数显著减少（从 50+ 文件降至 0）
  - `pnpm lint` 报错数显著减少

- [ ] CI 流程包含 `lint:style` 步骤
- [ ] 新增硬编码 hex 的代码会被 CI 阻断

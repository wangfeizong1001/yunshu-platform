# 品牌色规范

云枢中台使用统一的品牌色 `#4a9eff` 替代 Element Plus 默认主色 `#409eff`。

## 主品牌色

| 颜色 | HEX | 用途 |
|------|-----|------|
| **主品牌色** | `#4a9eff` | 主按钮、链接、强调色 |
| **Hover 状态** | `#3a8ee8` | 鼠标悬停 |
| **Active 状态** | `#2c7ad6` | 按下激活 |
| **禁用状态** | `#a0cfff` | 禁用背景 |
| **背景浅色** | `#e8f3ff` | 选中背景 |

## 颜色变量系统

### SCSS 变量

[apps/admin/src/styles/variables.scss](file:///workspace/apps/admin/src/styles/variables.scss)：

```scss
$color-primary: #4a9eff;       // 品牌主色
$color-primary-light: #a0cfff; // 浅色
$color-primary-dark: #2c7ad6;  // 深色
$color-success: #67c23a;       // 成功
$color-warning: #e6a23c;       // 警告
$color-danger: #f56c6c;        // 危险
$color-info: #909399;          // 信息
```

### CSS 变量

[apps/admin/src/styles/element-plus.scss](file:///workspace/apps/admin/src/styles/element-plus.scss)：

```scss
:root {
  --el-color-primary: #4a9eff;
  --el-color-primary-light-3: #7eb6ff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c8dfff;
  --el-color-primary-light-8: #d9e9ff;
  --el-color-primary-light-9: #e8f3ff;
  --el-color-primary-dark-2: #3a8ee8;
}
```

## 使用规范

### ✅ 推荐：使用变量

```vue
<template>
  <el-button type="primary">主按钮</el-button>
</template>

<style lang="scss" scoped>
.title {
  color: var(--el-color-primary);
}
</style>
```

### ✅ 推荐：使用 SCSS 变量

```scss
.custom-button {
  background-color: $color-primary;

  &:hover {
    background-color: $color-primary-dark;
  }
}
```

### ❌ 禁止：硬编码颜色

```vue
<!-- ❌ 不推荐 -->
<style>
.title {
  color: #4a9eff;          /* 硬编码 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* 硬编码 */
}
</style>
```

## Lint 检查

[.stylelintrc.js](file:///workspace/.stylelintrc.js) 包含规则：

```js
{
  rules: {
    'color-no-hex': true,          // 禁止十六进制颜色
    'color-named': 'never',        // 禁止颜色名称
    'color-no-invalid-hex': true,  // 禁止无效十六进制
  }
}
```

运行检查：

```bash
pnpm lint:style
```

## CI 集成

[.github/workflows/ci.yml](file:///workspace/.github/workflows/ci.yml) 中 `lint-style` job 自动运行：

```yaml
lint-style:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - run: pnpm install
    - run: pnpm lint:style
```

## 辅助色

| 类别 | 颜色 | HEX |
|------|------|-----|
| 成功 | 🟢 | `#67c23a` |
| 警告 | 🟡 | `#e6a23c` |
| 危险 | 🔴 | `#f56c6c` |
| 信息 | ⚪ | `#909399` |

## 中性色

| 名称 | HEX | 用途 |
|------|-----|------|
| 主文本 | `#303133` | 主要文字 |
| 常规文本 | `#606266` | 次要文字 |
| 次要文本 | `#909399` | 辅助文字 |
| 占位文本 | `#c0c4cc` | 输入框占位 |
| 一级边框 | `#dcdfe6` | 主要边框 |
| 二级边框 | `#e4e7ed` | 次要边框 |
| 三级边框 | `#ebeef5` | 浅色边框 |
| 四级边框 | `#f2f6fc` | 最浅边框 |
| 一级背景 | `#ffffff` | 卡片背景 |
| 二级背景 | `#f5f7fa` | 浅灰背景 |
| 三级背景 | `#fafafa` | 最浅背景 |

## 主题适配

### 浅色模式（默认）

```css
--el-bg-color: #ffffff;
--el-text-color-primary: #303133;
```

### 深色模式

```css
html.dark {
  --el-bg-color: #1d1e1f;
  --el-text-color-primary: #e5eaf3;
  --el-color-primary: #4a9eff;  /* 品牌色保持不变 */
}
```

## 国际化

所有品牌色在切换语言时保持不变（品牌色是品牌资产，非本地化内容）。

## 升级指南

如需调整品牌色：

1. 修改 [variables.scss](file:///workspace/apps/admin/src/styles/variables.scss) 中的 `$color-primary`
2. 修改 [element-plus.scss](file:///workspace/apps/admin/src/styles/element-plus.scss) 中的 `--el-color-primary`
3. 运行 `pnpm lint:style` 检查
4. 在所有 SCSS/CSS 变量中传播
5. 更新文档中的颜色值

## 验证清单

- [ ] 所有页面使用 `var(--el-color-primary)` 或 `$color-primary`
- [ ] 没有硬编码的 `#4a9eff`、`#409eff` 等颜色
- [ ] CI 中 `lint-style` 通过
- [ ] 深色模式下品牌色保持一致
- [ ] 登录页渐变色使用品牌色变量

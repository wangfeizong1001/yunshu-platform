# 批次 2：主题与布局体系完善 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **执行模式**：整批完整实现（推荐） + 创建 feature 分支
>
> **前置分支**：`develop`

**Goal:** 完善暗色主题支持，集成语言切换和主题切换按钮到 Header，修复路由跳转，清除登录页默认填充。

**Architecture:** 以 `appStore.theme` 为单一状态源，main.ts 监听状态变化并操作 `<html class="dark">`，index.scss 中的 `html.dark {}` 覆盖所有 CSS 变量实现暗色主题。

**Tech Stack:** Vue 3 + Pinia + SCSS + Element Plus Icons (@element-plus/icons-vue)

---

## 文件影响范围总览

```
需要修改的文件：
├── apps/admin/src/store/modules/app.ts     ← 添加 theme 状态
├── apps/admin/src/main.ts                  ← 初始化主题 + 监听变化
├── apps/admin/src/styles/index.scss        ← 添加 html.dark {} 暗色变量
├── apps/admin/src/layouts/components/Header.vue  ← 集成语言切换 + 主题切换
├── apps/admin/src/views/login/index.vue    ← 清除默认账号填充
```

---

## 实现任务

### Task 1: app store 新增 theme 状态

**Files:**
- Modify: `apps/admin/src/store/modules/app.ts`

- [ ] **Step 1: 修改 AppState 接口**

在 `interface AppState` 中添加 `theme: 'light' | 'dark'`：

```typescript
interface AppState {
  sidebarCollapsed: boolean
  language: string
  size: string
  theme: 'light' | 'dark'  // 新增
}
```

- [ ] **Step 2: 添加 theme 状态和操作函数**

在 `defineStore` 的 state 部分添加：

```typescript
const theme = useLocalStorage<'light' | 'dark'>('app-theme', 'light')

const setTheme = (newTheme: 'light' | 'dark') => {
  theme.value = newTheme
}

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
```

- [ ] **Step 3: 更新 return 语句**

在 return 中添加：

```typescript
return {
  sidebarCollapsed,
  language,
  size,
  theme,          // 新增
  toggleSidebar,
  setLanguage,
  setSize,
  setTheme,      // 新增
  toggleTheme,    // 新增
}
```

- [ ] **Step 4: 验证 TypeScript 类型**

Run: `pnpm --filter @yunshu/admin type-check 2>&1 | grep -c "error TS" | xargs -I{} echo "TS errors: {}"`
Expected: 无新增 TS 错误

- [ ] **Step 5: Commit**

```bash
git add apps/admin/src/store/modules/app.ts
git commit -m "feat(app-store): 新增 theme 状态支持暗色主题切换"
```

---

### Task 2: 主题切换核心逻辑（main.ts + index.scss）

**Files:**
- Modify: `apps/admin/src/main.ts`
- Modify: `apps/admin/src/styles/index.scss`

- [ ] **Step 1: 修改 main.ts 添加主题初始化**

在 `app.use(i18n)` 之后、`app.mount('#app')` 之前添加：

```typescript
// 初始化暗色主题支持
const appStore = useAppStore()
const initTheme = () => {
  const currentTheme = appStore.theme
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark')
  }
}
initTheme()

// 监听 theme 状态变化，实时更新 html class
watch(() => appStore.theme, (newTheme) => {
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
```

**重要**：在 `app.mount('#app')` 之前必须先执行 `initTheme()`，因为 Pinia store 需要在 app 挂载后才能使用。

- [ ] **Step 2: 在 index.scss 添加 html.dark {} 暗色变量**

在 `:root {}` 块之后、`@import './variables.scss'` 之前添加：

```scss
// ===== 暗色主题变量覆盖 =====
// 注意：--el-color-primary 保持为品牌色 #4a9eff，不随主题变化
html.dark {
  /* 侧边栏 */
  --sidebar-bg: #1d1d1d;
  --sidebar-text-color: #b0b0b0;
  --sidebar-logo-color: #ffffff;

  /* 全局背景 */
  --background: #121212;
  --surface-1: #1e1e1e;
  --surface-2: #252525;

  /* 文字 */
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --text-muted: #707070;

  /* 边框 */
  --border: #333333;

  /* Element Plus 覆盖 */
  --el-bg-color: #1e1e1e;
  --el-fill-color-light: #2a2a2a;
  --el-fill-color-blank: #1e1e1e;
  --el-text-color-primary: #e0e0e0;
  --el-text-color-regular: #a0a0a0;
  --el-text-color-secondary: #707070;
  --el-border-color: #333333;
  --el-border-color-light: #2a2a2a;
}
```

- [ ] **Step 3: 验证构建**

Run: `pnpm --filter @yunshu/admin build 2>&1 | tail -10`
Expected: 构建成功，无 SCSS 语法错误

- [ ] **Step 4: Commit**

```bash
git add apps/admin/src/main.ts apps/admin/src/styles/index.scss
git commit -m "feat(theme): 添加暗色主题核心逻辑
- main.ts: 初始化 theme 并监听状态变化
- index.scss: 添加 html.dark {} 覆盖所有 CSS 变量"
```

---

### Task 3: Header 集成语言切换 + 主题切换按钮

**Files:**
- Modify: `apps/admin/src/layouts/components/Header.vue`

- [ ] **Step 1: 在 script 中 import LanguageSwitch**

读取 `components/LanguageSwitch/index.vue` 了解导出名称，在 `layouts/components/Header.vue` 的 script 中添加：

```typescript
import LanguageSwitch from '@/components/LanguageSwitch/index.vue'
import { Sunny, Moon } from '@element-plus/icons-vue'  // 确保已安装
```

- [ ] **Step 2: 在 template Header 右侧区域添加语言切换和主题切换**

在 `<!-- 通知 -->` 和 `<!-- 用户信息 -->` 之间添加：

```vue
<!-- 语言切换 -->
<div class="header-item">
  <LanguageSwitch />
</div>

<!-- 主题切换 -->
<div class="header-item theme-toggle" @click="toggleTheme" title="切换主题">
  <el-icon :size="18">
    <Sunny v-if="isDark" />
    <Moon v-else />
  </el-icon>
</div>
```

- [ ] **Step 3: 添加 toggleTheme 方法和 isDark 计算属性**

在 script 的 `isCollapsed` 附近添加：

```typescript
const isDark = computed(() => appStore.theme === 'dark')

const toggleTheme = () => {
  appStore.toggleTheme()
}
```

- [ ] **Step 4: 在 style 中添加主题切换按钮样式**

在现有 style 中添加：

```scss
.theme-toggle {
  cursor: pointer;
  color: var(--text-secondary);
  transition: color $transition-duration $transition-function;

  &:hover {
    color: var(--el-color-primary);
  }
}
```

- [ ] **Step 5: 验证**

Run: `pnpm --filter @yunshu/admin type-check 2>&1 | grep -c "error TS" | xargs -I{} echo "TS errors: {}"`
Expected: 无新增 TS 错误

- [ ] **Step 6: Commit**

```bash
git add apps/admin/src/layouts/components/Header.vue
git commit -m "feat(header): 集成语言切换和主题切换按钮
- Header 右侧添加 LanguageSwitch 组件
- 添加主题切换图标（Sunny/Moon）"
```

---

### Task 4: 用户头像 URL 改为动态

**Files:**
- Modify: `apps/admin/src/layouts/components/Header.vue`

- [ ] **Step 1: 在 Header.vue 的 script 中添加 avatarUrl 计算属性**

```typescript
const avatarUrl = computed(() => {
  const url = userStore.avatar
  // 如果有以 http 开头的 URL 则使用，否则返回空字符串（使用 el-avatar 默认占位图）
  if (url && typeof url === 'string' && url.startsWith('http')) {
    return url
  }
  return ''
})
```

- [ ] **Step 2: 修改 template 中的 el-avatar**

修改：
```vue
<!-- 修改前 -->
<el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />

<!-- 修改后 -->
<el-avatar :size="32" :src="avatarUrl" />
```

- [ ] **Step 3: Commit**

```bash
git add apps/admin/src/layouts/components/Header.vue
git commit -m "fix(header): 用户头像改为从 userStore 动态读取
- 移除硬编码的 elemecdn URL
- 无头像时显示 el-avatar 默认占位图"
```

---

### Task 5: 修复"个人中心"与"设置"路由跳转

**Files:**
- Modify: `apps/admin/src/layouts/components/Header.vue`

- [ ] **Step 1: 修改 template 移除"设置"菜单项**

找到 `<el-dropdown-item command="settings">` 相关代码并删除：

```vue
<!-- 删除这一整块 -->
<!-- <el-dropdown-item command="settings">
  <el-icon><Setting /></el-icon>
  设置
</el-dropdown-item> -->
```

- [ ] **Step 2: 修改 script 中的 handleCommand**

```typescript
// 修改前
case 'settings':
  router.push('/settings')
  break

// 修改后（删除 'settings' case）
```

```typescript
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile/index')
      break
    case 'logout':
      try {
        await userStore.logout()
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch {
        ElMessage.error('退出登录失败')
      }
      break
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/admin/src/layouts/components/Header.vue
git commit -m "fix(header): 修复路由跳转
- 个人中心跳转到 /user/profile/index（正确路径）
- 移除"设置"菜单项（无对应页面）"
```

---

### Task 6: 登录页去除默认账号填充

**Files:**
- Modify: `apps/admin/src/views/login/index.vue`

- [ ] **Step 1: 修改 loginForm reactive 初始值**

读取 `views/login/index.vue`，找到 `loginForm` 的定义：

```typescript
// 修改前
const loginForm = reactive({
  username: 'admin',
  password: 'admin123',
  code: '',
  uuid: '',
  rememberMe: false
})

// 修改后
const loginForm = reactive({
  username: '',
  password: '',
  code: '',
  uuid: '',
  rememberMe: false
})
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/src/views/login/index.vue
git commit -m "fix(login): 清除登录页默认账号填充"
```

---

### Task 7: 验证工具链并更新文档

- [ ] **Step 1: 运行单元测试**

Run: `pnpm --filter @yunshu/admin test 2>&1 | tail -10`
Expected: 所有测试通过

- [ ] **Step 2: 运行 TypeScript 检查**

Run: `pnpm --filter @yunshu/admin type-check 2>&1 | tail -5`
Expected: 无新增 TS 错误

- [ ] **Step 3: 运行构建**

Run: `pnpm --filter @yunshu/admin build 2>&1 | tail -5`
Expected: 构建成功

- [ ] **Step 4: 更新 project-plan.md**

读取 `/workspace/docs/project-plan.md`，找到"第2批"部分，将所有任务状态从 ⬜ 改为 ✅，添加分支引用。

- [ ] **Step 5: Commit**

```bash
git add docs/project-plan.md
git commit -m "docs: 标记批次 2 主题与布局体系完成"
```

---

## 规范自审清单

1. **规范覆盖**：每个设计规范章节都有对应的实现任务 ✅
   - 2.1（暗色主题方案）→ Task 1, 2
   - 2.2（Header 布局）→ Task 3
   - 2.3（头像动态）→ Task 4
   - 2.4（路由修复）→ Task 5
   - 2.5（登录页清理）→ Task 6

2. **占位符扫描**：无 "TBD"、"TODO"、未填写的步骤 ✅

3. **类型一致性**：所有 API 调用与方法名在所有任务中一致 ✅

## 关联规范

- 设计规范：`docs/superpowers/specs/2026-06-16-batch2-theme-layout-design.md`
- 项目计划：`docs/project-plan.md` 批次 2

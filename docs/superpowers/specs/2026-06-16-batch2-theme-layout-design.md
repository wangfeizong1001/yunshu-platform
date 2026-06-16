# 批次 2：主题与布局体系完善 — 设计规范

> 文档编号：`YUNSHU-SPEC-2026-06-BATCH2`
> 创建日期：2026-06-16
> 负责人：前端团队
> 状态：草稿

---

## 一、背景与目标

### 1.1 现状问题

经过代码审查，发现以下问题：

| 问题 | 说明 |
|------|------|
| 无暗色主题 | app store 无 theme 状态，main.ts 无主题初始化逻辑 |
| Header 缺少语言切换 | `LanguageSwitch` 组件已存在于 `components/LanguageSwitch/`，但未被 Header 集成 |
| Header 缺少主题切换按钮 | 无 sun/moon 图标切换按钮 |
| 头像 URL 硬编码 | Header 中头像使用 `cube.elemecdn.com` 固定 URL，未读取 userStore |
| 路由跳转错误 | Header 中 "个人中心" 跳 `/profile`，应为 `/user/profile/index` |
| 设置菜单无页面 | Header 中 "设置" 跳 `/settings`，无对应路由和页面 |
| 登录页默认填充 | login/index.vue 中 username=`admin`/password=`admin123`，需清空 |

### 1.2 目标

1. **暗色主题**：用户可在 Header 中切换浅色/暗色主题，状态持久化到 localStorage
2. **Header 功能完善**：集成语言切换 + 主题切换按钮
3. **路由修复**：个人中心跳转到正确路径，设置菜单移除
4. **登录页清理**：去除默认账号填充

---

## 二、设计决策

### 2.1 暗色主题技术方案

**决策**：采用纯 CSS 变量覆盖方案（`html.dark {}`）

**实现方式**：
- 在 `index.scss` 中通过 `html.dark {}` 覆盖所有 CSS 变量为暗色值
- 引入 `element-plus/theme-chalk/dark/css-vars.css` 使 Element Plus 组件自动适配
- main.ts 监听 app store theme 状态，为 `<html>` 添加/移除 `class="dark"`

**暗色变量值**：

```scss
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
  --border-light: #2a2a2a;

  /* Element Plus 覆盖 */
  --el-bg-color: #1e1e1e;
  --el-fill-color-light: #2a2a2a;
  --el-fill-color-blank: #1e1e1e;
  --el-text-color-primary: #e0e0e0;
  --el-text-color-regular: #a0a0a0;
  --el-border-color: #333333;
  --el-border-color-light: #2a2a2a;
  /* 注意：--el-color-primary 保持为品牌色 #4a9eff，不随主题变化 */
}
```

### 2.2 默认主题

**决策**：默认浅色主题，用户手动切换

**理由**：
- 首次访问默认显示浅色主题（符合大多数用户习惯）
- 状态通过 `useLocalStorage` 持久化，用户切换后记录到 localStorage，下次访问保持选择

### 2.3 Header 布局

**决策**：Header 顶栏右侧放置语言切换和主题切换按钮

**布局顺序（从左到右）**：

```
[搜索] [全屏] [通知] [语言切换] [主题切换 🌙/☀️] [用户头像]
```

**主题切换按钮样式**：
- 使用 Element Plus 图标 `<Sunny>` 和 `<Moon>` 切换
- 点击图标切换主题，同时更新 app store theme 状态
- 浅色主题显示 🌙 图标（点击切换到暗色）
- 暗色主题显示 ☀️ 图标（点击切换到浅色）

---

## 三、执行方案

### 3.1 任务 2.1：app store 新增 theme 状态

**步骤**：

1. 修改 `apps/admin/src/store/modules/app.ts`：
   - 在 `AppState` 接口中添加 `theme: 'light' | 'dark'`
   - 在 store 中添加 `theme = useLocalStorage('app-theme', 'light')`
   - 添加 `setTheme(theme)` 和 `toggleTheme()` 函数

```typescript
interface AppState {
  sidebarCollapsed: boolean
  language: string
  size: string
  theme: 'light' | 'dark'  // 新增
}

// store 中添加
const theme = useLocalStorage('app-theme', 'light')

const setTheme = (newTheme: 'light' | 'dark') => {
  theme.value = newTheme
}

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

return { theme, setTheme, toggleTheme, /* ... */ }
```

**验收标准**：
- Vue DevTools 中可看到 theme 状态，值为 `'light'` 或 `'dark'`
- 切换后 localStorage 中 `app-theme` 更新

---

### 3.2 任务 2.2：主题切换核心逻辑

**步骤**：

1. 修改 `apps/admin/src/main.ts`，在应用挂载后初始化主题：

```typescript
import { useAppStore } from '@/store/modules/app'

// 挂载后初始化主题
const appStore = useAppStore()
const initTheme = () => {
  const theme = appStore.theme
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
initTheme()

// 监听 theme 变化
watch(() => appStore.theme, (newTheme) => {
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
```

2. 修改 `apps/admin/src/styles/index.scss`，添加暗色主题变量：

在 `:root {}` 之后添加：

```scss
// ===== 暗色主题变量覆盖 =====
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
  --el-border-color: #333333;
  --el-border-color-light: #2a2a2a;
  /* 主色保持为品牌色 #4a9eff，不随主题变化 */
}
```

**验收标准**：
- 切换主题后 `<html>` 标签 class 属性正确切换
- Element Plus 组件（表格、弹窗、表单）自动变为暗色风格

---

### 3.3 任务 2.3：布局组件适配暗色主题

**说明**：批次 8 已将 Sidebar.vue、Header.vue 等的硬编码颜色替换为 CSS 变量（`--sidebar-bg` 等）。本任务检查并确保这些变量在 `html.dark {}` 中已覆盖。

**步骤**：

1. 确认 `index.scss` 中 `html.dark {}` 已包含 `--sidebar-bg`、`--sidebar-text-color`、`--sidebar-logo-color` 的暗色值
2. 确认 Sidebar.vue、Header.vue、layouts/index.vue 已使用 CSS 变量（批次 8 已完成）
3. 如有遗漏，在对应文件中替换为 CSS 变量

**验收标准**：
- 切换暗色主题后，侧边栏/头部/内容区均变为暗色，无亮色块残留

---

### 3.4 任务 2.4：Header 集成语言切换 + 主题切换按钮

**步骤**：

1. 读取 `components/LanguageSwitch/index.vue`，了解其 API

2. 修改 `layouts/components/Header.vue`：

   a. 在 script 中 import LanguageSwitch：
   ```typescript
   import LanguageSwitch from '@/components/LanguageSwitch/index.vue'
   ```

   b. 在 template 中 Header 右侧区域添加 LanguageSwitch 和 ThemeToggle：
   ```vue
   <!-- 语言切换 -->
   <div class="header-item">
     <LanguageSwitch />
   </div>

   <!-- 主题切换 -->
   <div class="header-item theme-toggle" @click="toggleTheme">
     <el-icon :size="18">
       <Sunny v-if="isDark" />
       <Moon v-else />
     </el-icon>
   </div>
   ```

   c. 添加 toggleTheme 方法：
   ```typescript
   const isDark = computed(() => appStore.theme === 'dark')

   const toggleTheme = () => {
     appStore.toggleTheme()
   }
   ```

   d. 在 style 中添加主题切换按钮样式：
   ```scss
   .theme-toggle {
     &:hover {
       color: var(--el-color-primary);
     }
   }
   ```

**验收标准**：
- Header 顶栏右侧显示语言切换下拉和主题切换图标
- 点击主题图标可切换暗色/浅色主题

---

### 3.5 任务 2.5：用户头像 URL 改为动态

**步骤**：

1. 读取 `userStore`，确认是否有 avatar 字段
2. 修改 `layouts/components/Header.vue`：
   ```vue
   <el-avatar :size="32" :src="avatarUrl" />
   ```

   ```typescript
   const avatarUrl = computed(() => {
     const url = userStore.avatar
     if (url && url.startsWith('http')) return url
     return '' // 使用 el-avatar 的默认占位图
   })
   ```

**验收标准**：
- 不同用户登录显示各自头像
- 无头像时显示默认占位图

---

### 3.6 任务 2.6：修复"个人中心"与"设置"路由跳转

**步骤**：

1. 修改 `layouts/components/Header.vue`：
   - `case 'profile'`：`router.push('/user/profile/index')`（正确路径已存在）
   - `case 'settings'`：移除此 case，并在 template 中移除"设置"菜单项

```vue
<!-- template: 移除 "设置" 菜单项 -->
<el-dropdown-item command="profile">
  <el-icon><User /></el-icon>
  个人中心
</el-dropdown-item>
<!-- 移除 "设置" dropdown-item -->
<el-dropdown-item divided command="logout">
```

```typescript
// script: 移除 'settings' case
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile/index')
      break
    case 'logout':
      // ...
      break
  }
}
```

**验收标准**：
- 点击"个人中心"跳转到正确页面
- 点击"设置"不再出现（已移除菜单项）

---

### 3.7 任务 2.7：登录页去除默认账号填充

**步骤**：

修改 `views/login/index.vue`：

```typescript
const loginForm = reactive({
  username: '',    // 原来是 'admin'
  password: '',    // 原来是 'admin123'
  code: '',
  uuid: '',
  rememberMe: false
})
```

**验收标准**：
- 打开登录页，用户名和密码输入框为空

---

## 四、验收标准

- [ ] 任务 2.1：app store 包含 theme 状态，`toggleTheme()` 可正常切换
- [ ] 任务 2.2：切换暗色后 `<html class="dark">` 存在，Element Plus 组件自动变为暗色
- [ ] 任务 2.3：侧边栏/头部/内容区暗色主题下无亮色残留
- [ ] 任务 2.4：Header 显示语言切换下拉和主题切换图标（☀️/🌙）
- [ ] 任务 2.5：头像 URL 来自 userStore，无头像时显示默认占位图
- [ ] 任务 2.6：个人中心跳转 `/user/profile/index`，设置菜单已移除
- [ ] 任务 2.7：登录页用户名/密码为空
- [ ] `pnpm --filter @yunshu/admin test` 全部通过
- [ ] `pnpm --filter @yunshu/admin type-check` 无新增 TS 错误

# 快速开始

## 安装

```bash
# npm
npm install @yunshu/design-tokens @yunshu/ui @yunshu/api-client

# pnpm（推荐）
pnpm add @yunshu/design-tokens @yunshu/ui @yunshu/api-client

# yarn
yarn add @yunshu/design-tokens @yunshu/ui @yunshu/api-client
```

## 引入设计令牌

在你的入口文件中导入 CSS 变量：

```typescript
// main.ts — Vue 3 项目
import '@yunshu/design-tokens/css';

// 现在所有 CSS 变量都可用
// color: var(--primary);
// background: var(--surface-1);
```

或使用 JS 运行时访问：

```typescript
import { lightColors, darkColors } from '@yunshu/design-tokens';

console.log(lightColors.primary); // '#4a9eff'
```

## 使用组件

```vue
<template>
  <YunButton variant="primary" @click="handleClick">
    点击我
  </YunButton>
</template>

<script setup lang="ts">
import { YunButton } from '@yunshu/ui';

function handleClick() {
  console.log('按钮被点击');
}
</script>
```

## 配置 API 客户端

```typescript
import { HttpClient, AxiosAdapter } from '@yunshu/api-client';

// 创建 HTTP 客户端
const adapter = new AxiosAdapter({ baseURL: '/api' });
const httpClient = new HttpClient(adapter, {
  dedup: { window: 1000 },
  cache: { enabled: true, ttl: 5 * 60 * 1000 },
});

// 使用
const { data } = await httpClient.get('/users', { page: 1 });

// 或使用 BaseAPI 模式
class UserAPI extends BaseAPI<IUser> {
  protected endpoint = '/users';
}
const userApi = new UserAPI(httpClient);
```

## 后端配置

```typescript
import express from 'express';
import { globalErrorHandler, notFoundHandler } from '@yunshu/server-express';

const app = express();

// ...路由配置...

// 404 处理
app.use(notFoundHandler());

// 全局错误处理（必须放在最后）
app.use(globalErrorHandler());
```

## 主题切换

```typescript
import { useTheme } from '@yunshu/ui';

const { theme, toggleTheme, isDark } = useTheme();

// 切换深色模式
toggleTheme();
```

# API 客户端示例

本目录包含 `@yunshu/api-client` 的完整使用示例。

## 目录结构

```
examples/api-client/
├── README.md           # 本文件
├── useUser.ts          # 用户管理完整示例
├── useRole.ts          # 角色管理完整示例
├── usePagination.ts    # 分页使用示例
└── useFilters.ts       # 筛选和排序使用示例
```

## 快速开始

### 安装依赖

确保在项目中已安装：

```bash
npm install @yunshu/api-client vue
```

### 配置 Vue 应用

```typescript
// main.ts
import { createApp } from 'vue'
import { createYunshuAPI } from '@yunshu/api-client/vue'
import { AxiosAdapter, HttpClient } from '@yunshu/api-client'

const adapter = new AxiosAdapter({ baseURL: '/api' })
const httpClient = new HttpClient(adapter)

const app = createApp(App)
app.use(createYunshuAPI({ httpClient }))
```

## 示例列表

### 1. useUser.ts - 用户管理

用户列表查询、详情获取、表单操作、导入导出等完整示例。

### 2. useRole.ts - 角色管理

角色列表查询、角色表单操作、权限分配等完整示例。

### 3. usePagination.ts - 分页使用

多种分页模式的实现方式，包括：
- 基础分页
- 无限滚动
- 分页器组件集成

### 4. useFilters.ts - 筛选和排序

高级筛选、排序、条件组合查询的使用方法。

## 运行示例

示例代码为 TypeScript 源码，直接复制到项目中使用即可。

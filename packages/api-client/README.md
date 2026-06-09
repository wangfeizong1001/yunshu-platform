# @yunshu/api-client

云枢中台 — 通用 HTTP 客户端，支持请求去重、缓存、自动 Token 刷新。

## 功能特性

- **框架无关**：核心模块不依赖任何前端框架，可与 Vue、React 或原生 JavaScript 配合使用
- **适配器模式**：支持 Axios 和 Fetch 两种 HTTP 适配器
- **请求去重**：相同请求在时间窗口内只发送一次，避免并发重复请求
- **内存缓存**：GET 请求结果自动缓存，支持自定义 TTL
- **中间件链**：可插拔的请求/响应处理中间件
- **自动 Token 刷新**：认证中间件支持 Token 自动刷新
- **Vue 3 集成**：提供 Composition API 风格的 Hooks

## 安装

```bash
npm install @yunshu/api-client
# 或
yarn add @yunshu/api-client
# 或
pnpm add @yunshu/api-client
```

## 快速开始

### 基础用法

```typescript
import { HttpClient, AxiosAdapter } from '@yunshu/api-client'

// 创建适配器
const adapter = new AxiosAdapter({ baseURL: '/api' })

// 创建 HTTP 客户端
const httpClient = new HttpClient(adapter)

// 发送请求
const { data } = await httpClient.get<User[]>('/users')
```

### Vue 3 用法

```typescript
import { createApp } from 'vue'
import { createYunshuAPI } from '@yunshu/api-client/vue'
import { AxiosAdapter, HttpClient } from '@yunshu/api-client'

const adapter = new AxiosAdapter({ baseURL: '/api' })
const httpClient = new HttpClient(adapter)

const app = createApp(App)
app.use(createYunshuAPI({ httpClient }))
```

在组件中使用：

```vue
<script setup>
import { inject } from 'vue'
import { useApi } from '@yunshu/api-client/vue'

const api = inject('$api')

const { data, loading, error, execute } = useApi(
  (id) => api.get(`/users/${id}`)
)

onMounted(() => execute(1))
</script>
```

## 系统管理模块

提供 Vue Composition API 风格的 Hooks，用于系统管理功能。

### 用户管理

```typescript
import { useUserList, useUserDetail, useUserForm, useUserImportExport } from '@yunshu/api-client'

// 用户列表
const { list, total, loading, queryParams, fetchList, resetParams } = useUserList({
  initialParams: { status: '0' },
  immediate: true
})

// 用户详情
const { data, loading, fetchDetail } = useUserDetail()
await fetchDetail(1)

// 用户表单（创建/更新/删除）
const { submitting, create, update, delete: deleteUser, changeStatus } = useUserForm()
await create({ nickname: '新用户', email: 'user@example.com' })
await update(1, { nickname: '更新后的名称' })
await changeStatus(1, '0')

// 导入导出
const { importing, exporting, importUsers, exportUsers } = useUserImportExport()
await exportUsers({ status: '0' })
```

### 角色管理

```typescript
import { useRoleList, useRoleDetail, useRoleForm, useRolePermission } from '@yunshu/api-client'

// 角色列表
const { list, total, loading, fetchList } = useRoleList()

// 角色表单
const { submitting, create, update, delete: deleteRole } = useRoleForm()
await create({ roleName: '管理员', roleKey: 'admin' })

// 角色权限
const { loading, submitting, assignMenus, assignDataScope, getRoleMenus } = useRolePermission()
await assignMenus(1, [1, 2, 3])
const menuIds = await getRoleMenus(1)
```

### 菜单管理

```typescript
import { useMenuList } from '@yunshu/api-client'

// 菜单列表
const { tree, loading, fetchTree, fetchDetail, create, update, delete: deleteMenu } = useMenuList()
await fetchTree()

// 获取菜单详情
const menu = await fetchDetail(1)

// 创建菜单
await create({
  menuName: '系统管理',
  parentId: 0,
  path: '/system',
  component: 'Layout'
})
```

### 部门管理

```typescript
import { useDeptList } from '@yunshu/api-client'

// 部门列表
const { tree, loading, fetchTree, fetchDetail, create, update, delete: deleteDept } = useDeptList()
await fetchTree()

// 获取部门下拉树
const { getDeptTreeSelect } = useDeptList()
const deptTree = await getDeptTreeSelect()
```

### 岗位管理

```typescript
import { usePostList } from '@yunshu/api-client'

// 岗位列表
const { list, total, loading, fetchList, resetParams, getPostSelect } = usePostList()

// 获取岗位下拉列表
const posts = await getPostSelect()
```

### 权限判断

```typescript
import { usePermission, useCurrentPermission } from '@yunshu/api-client'

// 权限判断
const { hasPermi, hasRole, isLoggedIn } = usePermission()
hasPermi('system:user:edit')     // 是否有指定权限
hasRole('admin')                  // 是否有指定角色
isLoggedIn.value                  // 是否已登录

// 设置权限信息（通常在登录后调用）
const { setPermissionInfo } = useCurrentPermission()
setPermissionInfo({
  userId: 1,
  username: 'admin',
  permissions: ['system:user:view', 'system:user:edit'],
  roles: ['admin']
})
```

## 分页、筛选、排序

### 分页查询

```typescript
const { list, total, queryParams, fetchList } = useUserList()

// 修改分页参数
queryParams.value.pageNum = 2
queryParams.value.pageSize = 20

// 重新获取数据
await fetchList()
```

### 筛选查询

```typescript
const { list, queryParams, fetchList, resetParams } = useUserList({
  initialParams: {
    status: '0',
    deptId: 1,
    keyword: '管理员'
  }
})

// 动态修改筛选条件
queryParams.value.status = '1'
await fetchList()

// 重置筛选条件
resetParams()
```

### 排序查询

通过 `sortBy` 和 `sortOrder` 参数进行排序：

```typescript
const { list, queryParams, fetchList } = useUserList()

// 按创建时间降序排序
queryParams.value.sortBy = 'createTime'
queryParams.value.sortOrder = 'desc'

await fetchList()
```

## 中间件

### 认证中间件

```typescript
import { createAuthMiddleware } from '@yunshu/api-client'

const authMiddleware = createAuthMiddleware({
  getToken: () => localStorage.getItem('token'),
  refreshToken: async () => {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    })
    const { data } = await response.json()
    localStorage.setItem('token', data.token)
    return data.token
  },
  onRefreshFailed: () => {
    // 刷新失败，跳转登录页
    window.location.href = '/login'
  }
})
```

### 缓存中间件

```typescript
import { createCacheMiddleware } from '@yunshu/api-client'

const cacheMiddleware = createCacheMiddleware(5 * 60 * 1000) // 5分钟缓存
```

### 重试中间件

```typescript
import { createRetryMiddleware } from '@yunshu/api-client'

const retryMiddleware = createRetryMiddleware({
  maxRetries: 3,
  delay: 1000,
  retryOnStatus: [408, 429, 502, 503, 504],
  backoffMultiplier: 2
})
```

### 日志中间件

```typescript
import { createLoggingMiddleware } from '@yunshu/api-client'

const loggingMiddleware = createLoggingMiddleware((msg, data) => {
  console.log(`[API] ${msg}`, data)
})
```

## API 参考

### HttpClient

```typescript
const httpClient = new HttpClient(adapter, options)
```

**选项：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| baseURL | string | '' | 基础 URL |
| timeout | number | 15000 | 默认超时时间（毫秒） |
| headers | Record<string, string> | {} | 默认请求头 |
| dedup | DedupConfig | { window: 1000 } | 请求去重配置 |
| cache | Partial<CacheOptions> | {} | 缓存配置 |

**方法：**

| 方法 | 说明 |
|------|------|
| get<T>(url, params?, cacheOptions?) | GET 请求 |
| post<T>(url, data?) | POST 请求 |
| put<T>(url, data?) | PUT 请求 |
| patch<T>(url, data?) | PATCH 请求 |
| delete<T>(url) | DELETE 请求 |
| upload<T>(url, file, options?) | 文件上传 |
| clearCache() | 清除所有缓存 |
| cancelAllRequests() | 取消所有请求 |

### BaseAPI

用于创建业务 API 类的基类：

```typescript
import { BaseAPI } from '@yunshu/api-client'

class UserAPI extends BaseAPI<SysUser, SysUserForm, SysUserForm> {
  protected endpoint = '/system/user'
}

const userApi = new UserAPI(httpClient)
const { data } = await userApi.getList({ pageNum: 1, pageSize: 10 })
const { data } = await userApi.getById(1)
const { data } = await userApi.create({ nickname: '新用户' })
```

## 类型定义

主要类型：

```typescript
// 分页参数
interface PaginationParams {
  page?: number
  pageSize?: number
  limit?: number
}

// 列表响应
interface ListResponse<T> {
  list: T[]
  items?: T[]
  total: number
  page?: number
  pageSize?: number
  hasMore?: boolean
}

// 过滤参数
interface FilterParams {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: unknown
}
```

## 注意事项

1. **Vue 依赖**：系统管理 Hooks 基于 Vue 3 Composition API，使用时需要安装 Vue 3
2. **共享类型**：依赖 `@yunshu/shared` 包提供类型定义
3. **CORS 配置**：后端需要配置相应的 CORS 策略允许跨域请求
4. **认证 Token**：生产环境建议配合认证中间件使用，自动处理 Token 刷新

# API 开发规范

本文档描述云枢中台 REST API 的设计规范与开发流程。

---

## 一、API 设计原则

### 1.1 RESTful 设计准则

| 原则 | 说明 |
|------|------|
| **资源导向** | 使用名词描述资源，避免使用动词 |
| **HTTP 方法** | GET/POST/PUT/DELETE 对应 CRUD |
| **HTTP 状态码** | 使用标准状态码表示请求结果 |
| **无状态** | 每个请求独立，不依赖会话状态 |
| **版本化** | API 变更通过版本号管理 |

### 1.2 URL 设计规范

```
格式: /api/v1/{resources}/{id}/{sub-resources}

示例:
  GET    /api/v1/users              # 获取用户列表
  POST   /api/v1/users              # 创建用户
  GET    /api/v1/users/1001         # 获取用户详情
  PUT    /api/v1/users/1001         # 更新用户
  DELETE /api/v1/users/1001         # 删除用户
  GET    /api/v1/users/1001/roles   # 获取用户角色
```

**命名规则**:

| 规则 | 示例 | 说明 |
|------|------|------|
| **小写字母** | `/users` | 统一使用小写 |
| **连字符** | `/user-profiles` | 多单词使用 kebab-case |
| **复数名词** | `/users` | 资源使用复数形式 |
| **层级清晰** | `/departments/100/users` | 父子关系通过路径表达 |

### 1.3 HTTP 方法使用

| 方法 | 用途 | 幂等 | 示例 |
|------|------|------|------|
| `GET` | 获取资源 | ✅ | `GET /api/v1/users` |
| `POST` | 创建资源 | ❌ | `POST /api/v1/users` |
| `PUT` | 更新资源（整体替换） | ✅ | `PUT /api/v1/users/1001` |
| `PATCH` | 更新资源（部分字段） | ✅ | `PATCH /api/v1/users/1001` |
| `DELETE` | 删除资源 | ✅ | `DELETE /api/v1/users/1001` |

---

## 二、统一响应格式

### 2.1 成功响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "userId": 1001,
    "userName": "zhangsan",
    "email": "zhangsan@example.com"
  }
}
```

### 2.2 分页列表响应

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      { "userId": 1001, "userName": "zhangsan" },
      { "userId": 1002, "userName": "lisi" }
    ],
    "total": 156,
    "page": 1,
    "pageSize": 10,
    "pages": 16
  }
}
```

### 2.3 错误响应

```json
{
  "code": 400,
  "message": "参数校验失败",
  "data": null,
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    },
    {
      "field": "password",
      "message": "密码长度不能少于 6 位"
    }
  ],
  "traceId": "abc-123-def"
}
```

### 2.4 HTTP 状态码对照表

| 状态码 | 含义 | 场景 |
|--------|------|------|
| `200 OK` | 成功 | GET/PUT/PATCH/DELETE 成功 |
| `201 Created` | 创建成功 | POST 创建资源成功 |
| `204 No Content` | 无内容 | 删除成功，无返回体 |
| `400 Bad Request` | 请求错误 | 参数校验失败 |
| `401 Unauthorized` | 未认证 | Token 缺失或无效 |
| `403 Forbidden` | 无权限 | 已认证但无操作权限 |
| `404 Not Found` | 资源不存在 | 请求的资源未找到 |
| `409 Conflict` | 冲突 | 资源状态冲突（如用户名已存在） |
| `422 Unprocessable Entity` | 业务错误 | 业务逻辑错误（如库存不足） |
| `429 Too Many Requests` | 请求过多 | 触发限流 |
| `500 Internal Server Error` | 服务器错误 | 未捕获的异常 |
| `503 Service Unavailable` | 服务不可用 | 临时维护或过载 |

---

## 三、前端 API 调用规范

### 3.1 API 模块组织

```
apps/admin/src/api/
├── index.ts              # 统一导出
├── request.ts            # 请求封装
├── httpClient.ts         # HTTP 客户端（基于 axios）
│
└── modules/              # 按业务模块组织
    ├── system/           # 系统管理模块
    │   ├── user.ts       # 用户 API
    │   ├── role.ts       # 角色 API
    │   ├── menu.ts       # 菜单 API
    │   ├── dept.ts       # 部门 API
    │   ├── dict.ts       # 字典 API
    │   ├── post.ts       # 岗位 API
    │   ├── config.ts     # 配置 API
    │   └── file.ts       # 文件 API
    │
    ├── monitor/          # 监控模块
    │   ├── operlog.ts    # 操作日志
    │   ├── logininfor.ts # 登录日志
    │   ├── online.ts     # 在线用户
    │   ├── server.ts     # 服务器监控
    │   └── job.ts        # 定时任务
    │
    ├── workflow/         # 工作流模块
    │   ├── process.ts
    │   ├── task.ts
    │   └── instance.ts
    │
    ├── report/           # 报表模块
    │   ├── design.ts
    │   ├── data.ts
    │   └── dashboard.ts
    │
    └── tenant/           # 多租户模块
        ├── tenant.ts
        └── package.ts
```

### 3.2 API 文件示例

```typescript
// apps/admin/src/api/modules/system/user.ts

import request from '@/utils/http'
import httpClient from '@/utils/httpClient'
import type {
  IUser,
  IUserListParams,
  IUserListResponse,
  IUserCreateParams,
  IUserUpdateParams
} from '@yunshu/shared'

/**
 * 用户 API 模块
 * @description 提供用户的 CRUD、角色分配、密码重置等操作
 */

/**
 * 获取用户列表
 * @param params 查询参数
 */
export function getUserList(params: IUserListParams) {
  return request<IUserListResponse>({
    url: '/system/user/list',
    method: 'GET',
    params
  })
}

/**
 * 获取用户详情
 * @param userId 用户 ID
 */
export function getUser(userId: number) {
  return request<IUser>({
    url: `/system/user/${userId}`,
    method: 'GET'
  })
}

/**
 * 创建用户
 * @param data 用户数据
 */
export function createUser(data: IUserCreateParams) {
  return request<void>({
    url: '/system/user',
    method: 'POST',
    data
  })
}

/**
 * 更新用户
 * @param userId 用户 ID
 * @param data 更新数据
 */
export function updateUser(userId: number, data: IUserUpdateParams) {
  return request<void>({
    url: `/system/user/${userId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除用户
 * @param userId 用户 ID
 */
export function deleteUser(userId: number) {
  return request<void>({
    url: `/system/user/${userId}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除用户
 * @param userIds 用户 ID 列表
 */
export function batchDeleteUsers(userIds: number[]) {
  return request<void>({
    url: '/system/user/batch',
    method: 'DELETE',
    data: { userIds }
  })
}

/**
 * 重置密码
 * @param userId 用户 ID
 * @param newPassword 新密码
 */
export function resetPassword(userId: number, newPassword: string) {
  return request<void>({
    url: `/system/user/${userId}/resetPwd`,
    method: 'PUT',
    data: { password: newPassword }
  })
}

/**
 * 分配用户角色
 * @param userId 用户 ID
 * @param roleIds 角色 ID 列表
 */
export function assignRoles(userId: number, roleIds: number[]) {
  return request<void>({
    url: `/system/user/${userId}/roles`,
    method: 'PUT',
    data: { roleIds }
  })
}

/**
 * 导出用户列表（Excel）
 * @param params 查询参数
 */
export function exportUsers(params: Partial<IUserListParams>) {
  return httpClient.download({
    url: '/system/user/export',
    method: 'GET',
    params,
    filename: `用户列表_${new Date().toISOString().slice(0, 10)}.xlsx`
  })
}
```

### 3.3 前端 HTTP 客户端封装

```typescript
// apps/admin/src/utils/http.ts

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'

import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { getToken } from '@/utils/security/auth'

/**
 * 通用响应结构
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  errors?: Array<{ field: string; message: string }>
  traceId?: string
}

/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

/**
 * 请求拦截器
 * 在请求发送前添加认证 Token
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加 Token
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求时间戳（防止 GET 请求缓存）
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...(config.params || {}),
        _t: Date.now()
      }
    }

    return config
  },
  (error) => {
    console.error('[HTTP] 请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 统一处理响应状态码和业务错误
 */
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data

    // 业务成功
    if (code === 200) {
      return data as any
    }

    // 未认证
    if (code === 401) {
      ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const userStore = useUserStore()
          userStore.logout()
          location.href = '/login'
        })
        .catch(() => {})
      return Promise.reject(new Error('未登录或登录已过期'))
    }

    // 无权限
    if (code === 403) {
      ElMessage.error('无操作权限')
      return Promise.reject(new Error('无权限'))
    }

    // 其他业务错误
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  (error) => {
    // HTTP 错误处理
    const status = error.response?.status

    const errorMessages: Record<number, string> = {
      400: '请求参数错误',
      401: '未登录或登录已过期',
      403: '无操作权限',
      404: '请求资源不存在',
      408: '请求超时',
      500: '服务器内部错误',
      501: '服务未实现',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    }

    const message =
      errorMessages[status] || error.message || '网络连接异常'
    ElMessage.error(message)

    return Promise.reject(error)
  }
)

/**
 * 通用请求函数
 * @param config 请求配置
 */
export default function request<T = any>(
  config: AxiosRequestConfig
): Promise<T> {
  return service.request<any, T>(config)
}
```

### 3.4 httpClient 封装

```typescript
// apps/admin/src/utils/httpClient.ts

import request, { type ApiResponse } from './http'

/**
 * HTTP 客户端
 * 提供常用的便捷方法
 */
export const httpClient = {
  /** GET 请求 */
  get<T = any>(url: string, params?: any): Promise<T> {
    return request<T>({ url, method: 'GET', params })
  },

  /** POST 请求 */
  post<T = any>(url: string, data?: any): Promise<T> {
    return request<T>({ url, method: 'POST', data })
  },

  /** PUT 请求 */
  put<T = any>(url: string, data?: any): Promise<T> {
    return request<T>({ url, method: 'PUT', data })
  },

  /** DELETE 请求 */
  delete<T = any>(url: string, data?: any): Promise<T> {
    return request<T>({ url, method: 'DELETE', data })
  },

  /** PATCH 请求 */
  patch<T = any>(url: string, data?: any): Promise<T> {
    return request<T>({ url, method: 'PATCH', data })
  },

  /** 文件下载 */
  async download(config: {
    url: string
    method?: 'GET' | 'POST'
    params?: any
    data?: any
    filename?: string
  }): Promise<void> {
    const { url, method = 'GET', params, data, filename } = config

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: data ? JSON.stringify(data) : undefined
    })

    if (!response.ok) {
      throw new Error(`下载失败: ${response.statusText}`)
    }

    const blob = await response.blob()
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)
  },

  /** 文件上传 */
  upload<T = any>(
    url: string,
    file: File | FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = file instanceof FormData ? file : new FormData()
    if (!(file instanceof FormData)) {
      formData.append('file', file)
    }

    return request<T>({
      url,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(progress)
        }
      }
    })
  }
}

export default httpClient
```

---

## 四、前端 Mock 数据规范

### 4.1 Mock 模块组织

```
apps/admin/src/mock/
├── index.ts              # Mock 入口（注册所有 Mock）
├── utils.ts              # Mock 工具函数
│
└── modules/              # 按业务模块组织
    ├── auth.mock.ts      # 认证 Mock
    ├── system/           # 系统管理 Mock
    │   ├── user.mock.ts
    │   ├── role.mock.ts
    │   └── menu.mock.ts
    ├── monitor/          # 监控 Mock
    │   └── server.mock.ts
    └── dashboard.mock.ts # 首页 Mock
```

### 4.2 Mock 示例

```typescript
// apps/admin/src/mock/modules/system/user.mock.ts

import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/mock-api/system/user/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 10, userName, status } = query

      // Mock 数据生成
      const mockUsers = Array.from({ length: 50 }, (_, i) => ({
        userId: 1000 + i,
        deptId: 103,
        userName: `user${i + 1}`,
        nickName: `用户${i + 1}`,
        email: `user${i + 1}@example.com`,
        phonenumber: `138${String(10000000 + i).padStart(8, '0')}`,
        sex: i % 2 === 0 ? '0' : '1',
        status: String(i % 3),
        createTime: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`
      }))

      // 过滤
      let filtered = mockUsers
      if (userName) {
        filtered = filtered.filter((u) => u.userName.includes(userName))
      }
      if (status !== undefined) {
        filtered = filtered.filter((u) => u.status === status)
      }

      // 分页
      const start = (pageNum - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)

      return {
        code: 200,
        message: '查询成功',
        data: {
          list,
          total: filtered.length,
          page: Number(pageNum),
          pageSize: Number(pageSize)
        }
      }
    }
  },

  {
    url: '/mock-api/system/user',
    method: 'post',
    response: ({ body }) => {
      console.log('[Mock] 创建用户:', body)
      return {
        code: 200,
        message: '创建成功',
        data: { userId: Date.now() }
      }
    }
  }
] as MockMethod[]
```

### 4.3 Mock 入口

```typescript
// apps/admin/src/mock/index.ts

import type { MockMethod } from 'vite-plugin-mock'
import userMock from './modules/system/user.mock'
import roleMock from './modules/system/role.mock'
import menuMock from './modules/system/menu.mock'
import serverMock from './modules/monitor/server.mock'
import dashboardMock from './modules/dashboard.mock'

/**
 * 所有 Mock 方法集合
 * 在 vite.config.ts 中通过 vite-plugin-mock 注册
 */
const mockModules: MockMethod[] = [
  ...userMock,
  ...roleMock,
  ...menuMock,
  ...serverMock,
  ...dashboardMock
]

export default mockModules
```

---

## 五、类型定义规范

### 5.1 共享类型（@yunshu/shared）

```typescript
// packages/shared/src/types/system/user.ts

/**
 * 用户基本信息
 */
export interface IUser {
  userId: number
  deptId?: number
  userName: string
  nickName?: string
  userType?: string
  email?: string
  phonenumber?: string
  sex?: '0' | '1' | '2' // 0=男, 1=女, 2=未知
  avatar?: string
  status?: '0' | '1' // 0=正常, 1=停用
  delFlag?: '0' | '2'
  loginIp?: string
  loginDate?: string
  createTime?: string
  remark?: string
  tenantId?: string
}

/**
 * 用户列表查询参数
 */
export interface IUserListParams {
  pageNum: number
  pageSize: number
  userName?: string
  phonenumber?: string
  status?: string
  deptId?: number
}

/**
 * 用户列表响应
 */
export interface IUserListResponse {
  list: IUser[]
  total: number
  page: number
  pageSize: number
  pages: number
}

/**
 * 创建用户参数
 */
export interface IUserCreateParams {
  deptId?: number
  userName: string
  nickName?: string
  email?: string
  phonenumber?: string
  sex?: string
  password: string
  status?: string
  roleIds?: number[]
  postIds?: number[]
  remark?: string
}

/**
 * 更新用户参数
 */
export interface IUserUpdateParams extends Partial<IUserCreateParams> {
  userId: number
}
```

### 5.2 类型导出

```typescript
// packages/shared/src/index.ts

export * from './types/system/user'
export * from './types/system/role'
export * from './types/system/menu'
export * from './types/system/department'
// ... 更多类型
```

---

## 六、前端调用示例

### 6.1 在页面中使用

```vue
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
  exportUsers
} from '@/api/modules/system/user'

import type { IUser, IUserListParams } from '@yunshu/shared'

// ========== 响应式数据 ==========
const loading = ref(false)
const userList = ref<IUser[]>([])
const total = ref(0)

const queryParams = reactive<IUserListParams>({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  status: ''
})

// ========== 方法 ==========
/** 获取用户列表 */
const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await getUserList(queryParams)
    userList.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

/** 新增用户 */
const handleCreate = async (formData: any) => {
  await createUser(formData)
  ElMessage.success('创建成功')
  fetchUserList()
}

/** 更新用户 */
const handleUpdate = async (userId: number, formData: any) => {
  await updateUser(userId, formData)
  ElMessage.success('更新成功')
  fetchUserList()
}

/** 删除用户 */
const handleDelete = async (userId: number) => {
  await ElMessageBox.confirm('确认删除该用户吗？', '提示', {
    type: 'warning'
  })
  await deleteUser(userId)
  ElMessage.success('删除成功')
  fetchUserList()
}

/** 导出用户 */
const handleExport = async () => {
  await exportUsers(queryParams)
  ElMessage.success('导出成功')
}

// ========== 生命周期 ==========
onMounted(fetchUserList)
</script>

<template>
  <div class="user-page">
    <!-- 查询条件 -->
    <el-form :inline="true" :model="queryParams">
      <el-form-item label="用户名">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          @keyup.enter="fetchUserList"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchUserList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <div class="mb-4 flex gap-2">
      <el-button type="primary" @click="handleCreate({})">新增</el-button>
      <el-button @click="handleExport">导出</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="userList"
      border
      stripe
    >
      <el-table-column prop="userId" label="用户ID" width="80" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="handleUpdate(row.userId, row)">
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row.userId)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="fetchUserList"
      @current-change="fetchUserList"
    />
  </div>
</template>
```

---

## 七、API 文档生成（可选）

### 7.1 OpenAPI / Swagger

后端服务启动后，可通过以下地址访问 Swagger UI：

```
http://localhost:8080/swagger-ui.html
http://localhost:8080/v3/api-docs
```

### 7.2 前端类型生成（从 OpenAPI）

```bash
# 使用 openapi-typescript 从 OpenAPI 规范生成 TypeScript 类型
# （如果后端提供 OpenAPI 规范）
pnpm add -D openapi-typescript
pnpm openapi-typescript http://localhost:8080/v3/api-docs -o src/types/api.ts
```

---

## 八、安全规范

### 8.1 认证

- 所有需要登录的 API 必须携带 `Authorization: Bearer <token>`
- Token 存储在安全的地方（推荐使用 httpOnly Cookie 或加密的 localStorage）

### 8.2 权限校验

- 前端按钮级权限通过 `v-permission` 指令控制
- 后端每个 API 必须做独立的权限校验（前端控制仅为体验优化）

### 8.3 输入验证

- 所有用户输入必须在前端和后端双端验证
- 使用白名单验证而非黑名单
- 防范 SQL 注入、XSS、CSRF 等攻击

### 8.4 敏感数据

- 密码、Token 等敏感数据不得写入日志
- 敏感数据传输必须使用 HTTPS
- 敏感字段不得出现在 URL 参数中

---

## 九、性能优化

### 9.1 请求优化

```typescript
// ✅ 使用请求取消（AbortController）
const controller = new AbortController()

fetch(url, { signal: controller.signal })

// 组件卸载时取消
onBeforeUnmount(() => {
  controller.abort()
})

// ✅ 避免重复请求（去重）
const pendingRequests = new Map()

function requestWithDedup(config) {
  const key = JSON.stringify(config)
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)
  }
  const promise = request(config)
  pendingRequests.set(key, promise)
  return promise.finally(() => pendingRequests.delete(key))
}
```

### 9.2 缓存策略

```typescript
// ✅ 简单的内存缓存
const cache = new Map()

function getCached(key, fetcher, ttl = 60000) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data
  }
  const data = fetcher()
  cache.set(key, { data, timestamp: Date.now() })
  return data
}
```

---

## 十、API 质量检查清单

- [ ] URL 使用名词复数，遵循 REST 风格
- [ ] 使用正确的 HTTP 方法（GET/POST/PUT/DELETE）
- [ ] 使用正确的 HTTP 状态码
- [ ] 请求/响应有明确的 TypeScript 类型
- [ ] 统一的响应格式
- [ ] 错误信息对用户友好
- [ ] 分页参数标准化（pageNum, pageSize）
- [ ] 敏感字段不暴露在前端
- [ ] 输入参数有完整校验
- [ ] 文档化所有 API（用途、参数、返回值）

---

**相关文档**:
- [开发规范](../../DEVELOP.md)
- [组件开发规范](component.md)
- [国际化规范](i18n.md)
- [API 参考](../../API.md)

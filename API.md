# API 文档

云枢中台 API 文档，描述了系统的前后端交互接口规范。

## 📋 目录

- [概述](#概述)
- [认证](#认证)
- [用户管理](#用户管理)
- [角色管理](#角色管理)
- [菜单管理](#菜单管理)
- [权限管理](#权限管理)
- [系统日志](#系统日志)
- [错误码](#错误码)

## 概述

### 基础信息

| 项目 | 说明 |
|------|------|
| 基础 URL | `https://api.yunshu.dev` (生产环境) |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 认证方式 | Bearer Token |

### 请求格式

```http
POST /api/v1/users HTTP/1.1
Host: api.yunshu.dev
Content-Type: application/json
Authorization: Bearer <token>
Accept: application/json

{
  "username": "admin",
  "email": "admin@example.com"
}
```

### 响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "1",
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

### 分页响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## 认证

### 登录

用户登录系统，获取访问令牌。

```http
POST /api/v1/auth/login
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码（MD5 加密） |

**请求示例：**

```json
{
  "username": "admin",
  "password": "e10adc3949ba59abbe56e057f20f883e"
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "user": {
      "id": "1",
      "username": "admin",
      "realName": "管理员",
      "email": "admin@example.com",
      "avatar": "https://example.com/avatar.png",
      "roles": ["admin"]
    }
  }
}
```

### 刷新令牌

```http
POST /api/v1/auth/refresh
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| refreshToken | string | 是 | 刷新令牌 |

### 退出登录

```http
POST /api/v1/auth/logout
```

## 用户管理

### 获取用户列表

```http
GET /api/v1/users
```

**查询参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 10 |
| username | string | 否 | 用户名（模糊搜索） |
| status | number | 否 | 状态：0-禁用，1-启用 |
| roleId | string | 否 | 角色 ID |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "1",
        "username": "admin",
        "realName": "管理员",
        "email": "admin@example.com",
        "phone": "13800138000",
        "status": 1,
        "roles": [
          { "id": "1", "name": "admin", "label": "管理员" }
        ],
        "createTime": "2024-01-01T00:00:00Z",
        "lastLoginTime": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 获取用户详情

```http
GET /api/v1/users/{id}
```

**路径参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 用户 ID |

### 创建用户

```http
POST /api/v1/users
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| realName | string | 是 | 真实姓名 |
| email | string | 是 | 邮箱 |
| phone | string | 否 | 手机号 |
| roleIds | string[] | 是 | 角色 ID 列表 |
| status | number | 否 | 状态，默认 1 |

### 更新用户

```http
PUT /api/v1/users/{id}
```

### 删除用户

```http
DELETE /api/v1/users/{id}
```

### 修改密码

```http
PUT /api/v1/users/{id}/password
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| oldPassword | string | 是 | 旧密码 |
| newPassword | string | 是 | 新密码 |

### 修改状态

```http
PATCH /api/v1/users/{id}/status
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | number | 是 | 状态：0-禁用，1-启用 |

## 角色管理

### 获取角色列表

```http
GET /api/v1/roles
```

### 获取角色详情

```http
GET /api/v1/roles/{id}
```

### 创建角色

```http
POST /api/v1/roles
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 角色名称 |
| code | string | 是 | 角色编码 |
| description | string | 否 | 描述 |
| status | number | 否 | 状态，默认 1 |
| menuIds | string[] | 是 | 菜单 ID 列表 |
| dataScope | number | 否 | 数据权限范围 |

### 更新角色

```http
PUT /api/v1/roles/{id}
```

### 删除角色

```http
DELETE /api/v1/roles/{id}
```

### 分配权限

```http
PUT /api/v1/roles/{id}/permissions
```

## 菜单管理

### 获取菜单列表

```http
GET /api/v1/menus
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "1",
      "parentId": "0",
      "name": "system",
      "path": "/system",
      "icon": "ri:settings-line",
      "sort": 1,
      "children": [
        {
          "id": "2",
          "parentId": "1",
          "name": "user",
          "path": "/system/user",
          "icon": "ri:user-line",
          "sort": 1,
          "children": []
        }
      ]
    }
  ]
}
```

### 创建菜单

```http
POST /api/v1/menus
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| parentId | string | 是 | 父菜单 ID |
| name | string | 是 | 菜单名称 |
| path | string | 是 | 路由路径 |
| icon | string | 否 | 图标 |
| sort | number | 否 | 排序 |
| permission | string | 否 | 权限标识 |
| type | number | 是 | 类型：1-目录，2-菜单，3-按钮 |
| status | number | 否 | 状态，默认 1 |

### 更新菜单

```http
PUT /api/v1/menus/{id}
```

### 删除菜单

```http
DELETE /api/v1/menus/{id}
```

## 权限管理

### 获取权限列表

```http
GET /api/v1/permissions
```

### 分配数据权限

```http
PUT /api/v1/users/{id}/data-permissions
```

## 系统日志

### 登录日志

```http
GET /api/v1/logs/login
```

**查询参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |
| username | string | 否 | 用户名 |
| status | number | 否 | 登录状态 |
| startTime | string | 否 | 开始时间 |
| endTime | string | 否 | 结束时间 |

### 操作日志

```http
GET /api/v1/logs/operation
```

### 获取日志详情

```http
GET /api/v1/logs/{id}
```

## 错误码

### 成功

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 204 | 删除成功 |

### 客户端错误

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权，请登录 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 422 | 数据验证失败 |
| 429 | 请求过于频繁 |

### 服务器错误

| 错误码 | 说明 |
|--------|------|
| 500 | 服务器内部错误 |
| 502 | 网关错误 |
| 503 | 服务不可用 |
| 504 | 网关超时 |

### 错误响应格式

```json
{
  "code": 400,
  "message": "请求参数错误",
  "errors": [
    {
      "field": "username",
      "message": "用户名不能为空"
    }
  ]
}
```

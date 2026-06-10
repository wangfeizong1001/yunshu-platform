# REST API 参考文档

本文档提供云枢中台主要 REST API 的参考说明。注意：以下 API 基于 Mock 数据结构，实际后端接口定义请以 Swagger/OpenAPI 规范为准。

---

## 一、认证与授权

### 1.1 用户登录

**POST** `/api/auth/login`

**请求体**:

```json
{
  "username": "admin",
  "password": "admin123",
  "captcha": "1234"
}
```

**字段说明**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码（明文传输，依赖 HTTPS） |
| captcha | string | 否 | 验证码 |

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "refreshToken": "..."
  }
}
```

**失败响应** `401 Unauthorized`:

```json
{
  "code": 401,
  "message": "用户名或密码错误"
}
```

**前端调用**:

```typescript
// apps/admin/src/api/modules/auth.ts
import request from '@/utils/http'

interface LoginParams {
  username: string
  password: string
  captcha?: string
}

interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
}

export function login(params: LoginParams) {
  return request<LoginResponse>({
    url: '/auth/login',
    method: 'POST',
    data: params
  })
}
```

---

### 1.2 用户登出

**POST** `/api/auth/logout`

**请求头**:

```
Authorization: Bearer <token>
```

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "message": "退出成功"
}
```

---

### 1.3 获取当前用户信息

**GET** `/api/auth/me`

**请求头**:

```
Authorization: Bearer <token>
```

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": 1,
    "userName": "admin",
    "nickName": "超级管理员",
    "email": "admin@example.com",
    "phonenumber": "13800138000",
    "avatar": "/avatar.png",
    "roles": ["admin"],
    "permissions": ["*:*:*"]
  }
}
```

---

### 1.4 刷新 Token

**POST** `/api/auth/refresh`

**请求体**:

```json
{
  "refreshToken": "..."
}
```

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "data": {
    "accessToken": "new-token...",
    "expiresIn": 86400
  }
}
```

---

## 二、用户管理

### 2.1 获取用户列表

**GET** `/api/system/user/list`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNum | number | 是 | 页码 |
| pageSize | number | 是 | 每页数量 |
| userName | string | 否 | 用户名（模糊搜索） |
| phonenumber | string | 否 | 手机号 |
| status | string | 否 | 状态（0 正常 1 停用） |
| deptId | number | 否 | 部门 ID |

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "userId": 1,
        "deptId": 103,
        "userName": "admin",
        "nickName": "超级管理员",
        "email": "admin@example.com",
        "phonenumber": "13800138000",
        "sex": "1",
        "status": "0",
        "createTime": "2024-01-15 10:30:00"
      }
    ],
    "total": 156,
    "page": 1,
    "pageSize": 10,
    "pages": 16
  }
}
```

**前端调用**:

```typescript
import { getUserList } from '@/api/modules/system/user'

const { list, total } = await getUserList({
  pageNum: 1,
  pageSize: 10,
  userName: 'admin'
})
```

---

### 2.2 获取用户详情

**GET** `/api/system/user/{userId}`

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | number | 是 | 用户 ID |

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "data": {
    "userId": 1,
    "userName": "admin",
    "nickName": "超级管理员",
    "email": "admin@example.com",
    "phonenumber": "13800138000",
    "sex": "1",
    "status": "0",
    "roleIds": [1, 2],
    "postIds": [1],
    "remark": "系统管理员"
  }
}
```

---

### 2.3 创建用户

**POST** `/api/system/user`

**请求体**:

```json
{
  "userName": "zhangsan",
  "nickName": "张三",
  "email": "zhangsan@example.com",
  "phonenumber": "13800138001",
  "sex": "1",
  "password": "password123",
  "status": "0",
  "deptId": 103,
  "roleIds": [2],
  "postIds": [1],
  "remark": "新用户"
}
```

**成功响应** `201 Created`:

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "userId": 101
  }
}
```

---

### 2.4 更新用户

**PUT** `/api/system/user/{userId}`

**请求体**:

```json
{
  "nickName": "张三（已更新）",
  "email": "new@example.com",
  "status": "0",
  "roleIds": [2, 3]
}
```

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "message": "更新成功"
}
```

---

### 2.5 删除用户

**DELETE** `/api/system/user/{userId}`

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

### 2.6 批量删除用户

**DELETE** `/api/system/user/batch`

**请求体**:

```json
{
  "userIds": [101, 102, 103]
}
```

---

### 2.7 重置密码

**PUT** `/api/system/user/{userId}/resetPwd`

**请求体**:

```json
{
  "password": "new-password-123"
}
```

---

### 2.8 获取用户角色列表

**GET** `/api/system/user/{userId}/roles`

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "data": [
    { "roleId": 1, "roleName": "超级管理员" },
    { "roleId": 2, "roleName": "普通用户" }
  ]
}
```

---

### 2.9 分配用户角色

**PUT** `/api/system/user/{userId}/roles`

**请求体**:

```json
{
  "roleIds": [1, 2, 3]
}
```

---

### 2.10 导出用户列表

**GET** `/api/system/user/export`

**查询参数**: 与列表查询参数相同

**响应**: Excel 文件下载

---

## 三、角色管理

### 3.1 获取角色列表

**GET** `/api/system/role/list`

**查询参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNum | number | 页码 |
| pageSize | number | 每页数量 |
| roleName | string | 角色名搜索 |
| status | string | 状态 |

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "roleId": 1,
        "roleName": "超级管理员",
        "roleKey": "admin",
        "roleSort": 1,
        "dataScope": "1",
        "status": "0",
        "createTime": "2024-01-01 00:00:00"
      }
    ],
    "total": 5
  }
}
```

---

### 3.2 创建角色

**POST** `/api/system/role`

**请求体**:

```json
{
  "roleName": "审计员",
  "roleKey": "auditor",
  "roleSort": 5,
  "dataScope": "3",
  "status": "0",
  "menuIds": [1, 2, 3, 4],
  "deptIds": [100, 101],
  "remark": "负责系统审计"
}
```

**dataScope 说明**:

| 值 | 数据范围 |
|----|---------|
| 1 | 全部数据权限 |
| 2 | 自定义数据权限（配合 deptIds） |
| 3 | 本部门数据权限 |
| 4 | 本部门及以下 |
| 5 | 仅本人数据 |

---

### 3.3 更新角色权限

**PUT** `/api/system/role/{roleId}/permissions`

**请求体**:

```json
{
  "menuIds": [100, 101, 200, 201]
}
```

---

### 3.4 删除角色

**DELETE** `/api/system/role/{roleId}`

---

## 四、菜单管理

### 4.1 获取菜单树

**GET** `/api/system/menu/tree`

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "data": [
    {
      "menuId": 1,
      "menuName": "系统管理",
      "parentId": 0,
      "orderNum": 1,
      "path": "/system",
      "component": null,
      "menuType": "M",
      "visible": "0",
      "status": "0",
      "children": [
        {
          "menuId": 100,
          "menuName": "用户管理",
          "parentId": 1,
          "path": "user",
          "component": "system/user/index",
          "menuType": "C",
          "perms": "system:user:list",
          "children": []
        }
      ]
    }
  ]
}
```

**menuType 说明**:

| 值 | 类型 |
|----|------|
| M | 目录（Menu） |
| C | 菜单/页面（Component） |
| F | 按钮/权限（Function） |

---

### 4.2 获取当前用户菜单

**GET** `/api/getRouters`

**说明**: 返回当前登录用户有权限访问的菜单树（用于前端动态路由生成）

---

## 五、部门管理

### 5.1 获取部门树

**GET** `/api/system/dept/tree`

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "data": [
    {
      "deptId": 100,
      "parentId": 0,
      "ancestors": "0",
      "deptName": "总公司",
      "orderNum": 1,
      "leader": "张三",
      "phone": "13800138000",
      "email": "hq@example.com",
      "status": "0",
      "children": [
        {
          "deptId": 103,
          "parentId": 100,
          "deptName": "技术部",
          "children": []
        }
      ]
    }
  ]
}
```

---

## 六、字典管理

### 6.1 获取字典类型列表

**GET** `/api/system/dict/type/list`

---

### 6.2 获取字典数据

**GET** `/api/system/dict/data/type/{dictType}`

**示例**: `GET /api/system/dict/data/type/sys_user_sex`

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "data": [
    { "dictCode": 1, "dictLabel": "男", "dictValue": "0", "listClass": "primary" },
    { "dictCode": 2, "dictLabel": "女", "dictValue": "1", "listClass": "success" },
    { "dictCode": 3, "dictLabel": "未知", "dictValue": "2", "listClass": "info" }
  ]
}
```

---

## 七、系统监控

### 7.1 操作日志

**GET** `/api/monitor/operlog/list`

**查询参数**: pageNum, pageSize, title, operName, status

**响应字段**:

| 字段 | 说明 |
|------|------|
| operId | 操作日志 ID |
| title | 模块标题 |
| businessType | 业务类型（0 其他 1 新增 2 修改 3 删除） |
| method | 请求方法 |
| requestMethod | HTTP 方法 |
| operatorType | 操作类别（0 其他 1 后台 2 手机端） |
| operName | 操作人员 |
| deptName | 部门名称 |
| operUrl | 请求 URL |
| operIp | 操作 IP |
| operLocation | 操作地点 |
| operParam | 请求参数 |
| jsonResult | 返回参数 |
| status | 状态（0 正常 1 失败） |
| errorMsg | 错误消息 |
| operTime | 操作时间 |
| costTime | 消耗时间（毫秒） |

---

### 7.2 登录日志

**GET** `/api/monitor/logininfor/list`

**响应字段**: infoId, userName, ipaddr, loginLocation, browser, os, status, msg, loginTime

---

### 7.3 在线用户

**GET** `/api/monitor/online/list`

---

### 7.4 服务器信息

**GET** `/api/monitor/server`

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "data": {
    "cpu": {
      "cores": 8,
      "usage": 45.6
    },
    "memory": {
      "total": 16384,
      "used": 8192,
      "free": 8192,
      "usage": 50.0
    },
    "disk": [
      {
        "path": "/",
        "total": 512000,
        "used": 256000,
        "free": 256000,
        "usage": 50.0
      }
    ],
    "uptime": "10d 5h 30m"
  }
}
```

---

### 7.5 定时任务

**GET** `/api/monitor/job/list`

**POST** `/api/monitor/job` - 新增任务

**PUT** `/api/monitor/job/{jobId}` - 更新任务

**PUT** `/api/monitor/job/{jobId}/run` - 立即执行

**DELETE** `/api/monitor/job/{jobId}` - 删除任务

---

## 八、参数配置

### 8.1 获取配置列表

**GET** `/api/system/config/list`

---

### 8.2 根据键名获取配置值

**GET** `/api/system/config/configKey/{configKey}`

**示例**: `GET /api/system/config/configKey/sys.index.title`

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "data": "云枢中台管理系统"
}
```

---

## 九、文件管理

### 9.1 上传文件

**POST** `/api/system/file/upload`

**Content-Type**: `multipart/form-data`

**请求体**:

| 字段 | 类型 | 说明 |
|------|------|------|
| file | File | 文件（最大 10MB） |
| path | string | 可选，自定义存储路径 |

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileId": "uuid-string",
    "fileName": "avatar.png",
    "fileUrl": "/uploads/2024/01/15/uuid.png",
    "fileSize": 102400,
    "mimeType": "image/png"
  }
}
```

**前端调用示例**:

```typescript
// 使用 httpClient.upload 上传
const formData = new FormData()
formData.append('file', file)

const result = await httpClient.upload<{
  fileId: string
  fileUrl: string
}>('/system/file/upload', file)

// 或使用 Element Plus el-upload
// action="/api/system/file/upload"
```

---

### 9.2 下载文件

**GET** `/api/system/file/{fileId}`

**响应**: 文件流

---

### 9.3 删除文件

**DELETE** `/api/system/file/{fileId}`

---

## 十、OSS 对象存储配置

### 10.1 获取 OSS 配置列表

**GET** `/api/system/oss-config/list`

---

### 10.2 切换 OSS 配置

**PUT** `/api/system/oss-config/{configId}/activate`

---

## 十一、通知公告

### 11.1 获取公告列表

**GET** `/api/system/notice/list`

---

### 11.2 获取公告详情

**GET** `/api/system/notice/{noticeId}`

---

## 十二、多租户相关

### 12.1 获取租户列表

**GET** `/api/tenant/list`

---

### 12.2 创建租户

**POST** `/api/tenant`

---

### 12.3 获取套餐列表

**GET** `/api/tenant/package/list`

---

## 十三、健康检查

### 13.1 健康检查

**GET** `/api/health`

**成功响应** `200 OK`:

```json
{
  "code": 200,
  "message": "ok",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "services": {
      "database": "healthy",
      "redis": "healthy"
    }
  }
}
```

---

## 十四、统一错误码

| HTTP 状态码 | 业务码 | 说明 |
|------------|--------|------|
| 200 | 200 | 操作成功 |
| 201 | 200 | 创建成功 |
| 400 | 400 | 请求参数错误 |
| 401 | 401 | 未认证/Token 无效 |
| 403 | 403 | 无权限访问 |
| 404 | 404 | 资源不存在 |
| 409 | 409 | 资源冲突（如唯一键重复） |
| 422 | 422 | 业务逻辑错误 |
| 429 | 429 | 请求过多，限流 |
| 500 | 500 | 服务器内部错误 |

---

## 十五、分页响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [/* 数据列表 */],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "pages": 10
  }
}
```

---

## 十六、前端 API 组织示例

```
apps/admin/src/api/modules/
├── auth.ts              # 认证相关
│   ├── login()
│   ├── logout()
│   ├── getCurrentUser()
│   └── refreshToken()
│
├── system/
│   ├── user.ts          # 用户管理
│   ├── role.ts          # 角色管理
│   ├── menu.ts          # 菜单管理
│   ├── dept.ts          # 部门管理
│   ├── dict.ts          # 字典管理
│   ├── post.ts          # 岗位管理
│   ├── config.ts        # 参数配置
│   ├── file.ts          # 文件管理
│   └── form-designer.ts # 表单设计
│
├── monitor/
│   ├── operlog.ts       # 操作日志
│   ├── logininfor.ts    # 登录日志
│   ├── online.ts        # 在线用户
│   ├── server.ts        # 服务器监控
│   └── job.ts           # 定时任务
│
└── tenant/
    ├── tenant.ts        # 租户管理
    └── package.ts       # 套餐管理
```

---

**相关文档**:
- [API 开发规范](../development/api.md)
- [OpenAPI 规范](../OPENAPI.md)
- [权限体系设计](../architecture/permission.md)

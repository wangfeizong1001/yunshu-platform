# 开发指南

本文档详细介绍云枢中台项目的开发规范、流程和最佳实践。

## 📋 目录

- [开发环境](#开发环境)
- [项目结构](#项目结构)
- [包开发](#包开发)
- [应用开发](#应用开发)
- [组件开发](#组件开发)
- [API 开发](#api开发)
- [样式开发](#样式开发)
- [测试开发](#测试开发)
- [调试技巧](#调试技巧)

## 开发环境

### 环境要求

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Git >= 2.30

### 首次初始化

```bash
# 1. 克隆项目
git clone https://github.com/wangfeizong1001/yunshu-platform.git
cd yunshu-platform

# 2. 安装依赖
pnpm install

# 3. 复制环境变量文件
cp apps/admin/.env.development apps/admin/.env.local

# 4. 启动开发服务器
pnpm dev
```

### 常用命令

```bash
# 开发所有包
pnpm dev

# 开发指定应用（如 admin）
pnpm dev --filter=@yunshu/admin

# 开发指定包（如 ui）
pnpm dev --filter=@yunshu/ui

# 构建所有包
pnpm build

# 构建指定包
pnpm build --filter=@yunshu/ui

# 构建指定应用
pnpm build --filter=@yunshu/admin

# 运行测试
pnpm test

# 运行所有测试
pnpm test:all

# 运行带 UI 的测试
pnpm test:ui

# 代码检查
pnpm lint

# 代码修复
pnpm lint:fix

# 类型检查
pnpm type-check

# 清理缓存
pnpm clean

# 格式化代码
pnpm format
```

## 项目结构

### Monorepo 架构

项目采用 **Monorepo** 架构，使用 **Turborepo** 管理：

```
yunshu-platform/
├── apps/                   # 应用
│   ├── admin/              # 后台管理应用
│   └── docs/               # 文档站点
├── packages/               # 共享包
│   ├── design-tokens/      # 设计令牌
│   ├── shared/             # 共享类型定义
│   ├── api-client/         # API 客户端封装
│   ├── ui/                 # UI 组件库
│   ├── server-core/        # 后端核心
│   └── server-express/     # Express 适配器
├── tools/                  # 开发工具
├── templates/              # 项目模板
└── examples/              # 示例代码
```

### 包类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `app` | 终端应用 | admin, docs |
| `package` | 共享包 | ui, api-client |

### 核心包说明

#### @yunshu/shared
共享类型定义包，提供跨应用的 TypeScript 类型定义。

```
packages/shared/
├── src/
│   ├── index.ts              # 统一导出
│   ├── types/                 # 类型定义
│   │   ├── user.types.ts     # 用户相关类型
│   │   ├── system.types.ts   # 系统相关类型
│   │   └── common.types.ts   # 通用类型
│   ├── interfaces/            # 接口定义
│   │   └── IUserService.ts   # 服务接口
│   └── constants/            # 共享常量
│       └── index.ts
```

#### @yunshu/api-client
基于 axios 的 HTTP 请求封装，提供统一的请求/响应拦截处理。

```
packages/api-client/
├── src/
│   ├── index.ts              # 主入口
│   ├── HttpClient.ts         # HTTP 客户端核心类
│   ├── adapters/             # 适配器
│   │   └── axios.ts          # Axios 适配器
│   ├── types/                # 类型定义
│   │   ├── request.types.ts
│   │   └── response.types.ts
│   └── utils/                # 工具函数
│       └── index.ts
```

**主要特性**：
- 自动请求重试机制
- 请求/响应拦截器
- 统一错误处理
- TypeScript 类型支持
- 请求取消支持

#### @yunshu/ui
Vue 3 组件库，基于 Element Plus 封装的业务组件库。

```
packages/ui/
├── src/
│   ├── components/           # 组件目录
│   │   ├── Basic/           # 基础组件
│   │   ├── Form/            # 表单组件
│   │   ├── Table/           # 表格组件
│   │   └── .../
│   ├── composables/          # 组合式函数
│   ├── directives/           # 指令
│   ├── hooks/                # Hooks
│   ├── styles/               # 样式文件
│   │   ├── common/          # 通用样式
│   │   ├── variables/       # 主题变量
│   │   └── mixins/          # SCSS 混入
│   └── utils/                # 工具函数
├── package.json
└── vitest.config.ts
```

#### @yunshu/design-tokens
设计令牌包，定义设计系统的基础变量。

```
packages/design-tokens/
├── src/
│   ├── index.ts
│   ├── colors/               # 颜色令牌
│   │   ├── primary.ts
│   │   ├── success.ts
│   │   └── ...
│   ├── typography/           # 字体令牌
│   ├── spacing/             # 间距令牌
│   ├── border/              # 边框令牌
│   └── shadow/              # 阴影令牌
├── json/                    # JSON 格式令牌
└── scss/                    # SCSS 格式令牌
```

### 包的详细说明

#### 包命名规范
- 私有包：`@yunshu/xxx`
- 应用包：`@yunshu/admin`、`@yunshu/docs`
- 组件包：`@yunshu/ui`
- 工具包：`@yunshu/api-client`、`@yunshu/shared`

#### 包版本管理
- 使用语义化版本 (semver)
- 发布前确保通过所有测试
- 更新 CHANGELOG.md 记录变更

#### 包依赖管理
- 生产依赖：业务逻辑必需的依赖
- 开发依赖：构建、测试、文档等工具
- 避免循环依赖
- 合理控制依赖版本

## 包开发

### 创建新包

1. **创建目录结构**

```bash
packages/
└── my-package/
    ├── src/
    │   ├── index.ts      # 入口文件
    │   └── ...
    ├── package.json
    ├── tsconfig.json
    ├── tsup.config.ts    # 构建配置（可选）
    └── vitest.config.ts   # 测试配置（可选）
```

2. **配置 package.json**

```json
{
  "name": "@yunshu/my-package",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "test": "vitest"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

3. **配置 tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

4. **添加到 workspace**

pnpm workspace 会自动识别 `packages/` 目录下的包。

### 包导出规范

```typescript
// src/index.ts

// 导出类型
export type { IUser, ILoginParams } from './types';

// 导出类
export { UserService } from './services/UserService';

// 导出函数
export { formatDate } from './utils/format';

// 导出常量
export { DEFAULT_PAGE_SIZE } from './constants';
```

## 应用开发

### 应用类型

| 应用 | 说明 | 端口 |
|------|------|------|
| `@yunshu/admin` | 后台管理应用 | 3000 |
| `@yunshu/docs` | 文档站点 | 3001 |

### admin 应用结构

```
apps/admin/
├── src/
│   ├── api/                 # API 接口模块
│   │   ├── modules/        # 按模块组织的 API
│   │   │   └── system/     # 系统模块
│   │   │       ├── user.api.ts
│   │   │       ├── role.api.ts
│   │   │       ├── menu.api.ts
│   │   │       └── log.api.ts
│   │   └── index.ts        # API 统一导出
│   ├── assets/             # 静态资源
│   │   ├── images/         # 图片资源
│   │   ├── icons/          # 图标资源
│   │   └── fonts/          # 字体资源
│   ├── components/         # 公共业务组件
│   │   ├── common/         # 通用组件
│   │   ├── form/           # 表单组件
│   │   └── table/          # 表格组件
│   ├── composables/        # 组合式函数
│   │   ├── useUser.ts
│   │   └── usePermissions.ts
│   ├── config/              # 配置文件
│   │   ├── app.config.ts   # 应用配置
│   │   └── menu.config.ts  # 菜单配置
│   ├── directives/         # 自定义指令
│   │   ├── permission.ts   # 权限指令
│   │   └── loading.ts      # 加载指令
│   ├── hooks/              # Hooks
│   │   ├── usePagination.ts
│   │   └── useSelection.ts
│   ├── layouts/            # 布局组件
│   │   ├── DefaultLayout.vue
│   │   ├── BlankLayout.vue
│   │   └── components/
│   │       ├── Header.vue
│   │       ├── Sidebar.vue
│   │       └── TagsView.vue
│   ├── router/             # 路由配置
│   │   ├── index.ts        # 路由主入口
│   │   ├── routes/         # 路由模块
│   │   │   ├── index.ts
│   │   │   ├── system/
│   │   │   │   ├── index.ts
│   │   │   │   ├── user.ts
│   │   │   │   ├── role.ts
│   │   │   │   └── menu.ts
│   │   │   └── ...
│   │   └── guards/          # 路由守卫
│   │       ├── auth.ts
│   │       └── permission.ts
│   ├── stores/             # 状态管理
│   │   ├── user.store.ts
│   │   ├── permission.store.ts
│   │   └── settings.store.ts
│   ├── styles/             # 全局样式
│   │   ├── common/         # 通用样式
│   │   │   ├── reset.scss
│   │   │   └── common.scss
│   │   ├── variables/      # 样式变量
│   │   │   ├── _colors.scss
│   │   │   ├── _typography.scss
│   │   │   └── _variables.scss
│   │   └── mixins/         # SCSS混入
│   │       ├── _flex.scss
│   │       └── _transition.scss
│   ├── types/             # 类型定义
│   │   ├── api.d.ts       # API 类型
│   │   ├── store.d.ts     # Store 类型
│   │   └── views.d.ts     # 视图类型
│   ├── utils/             # 工具函数
│   │   ├── http.ts        # HTTP 请求封装
│   │   ├── storage.ts     # 本地存储
│   │   ├── validate.ts    # 表单验证
│   │   └── format.ts      # 格式化函数
│   ├── views/             # 页面组件
│   │   ├── system/        # 系统管理
│   │   │   ├── user/
│   │   │   │   ├── UserList.vue
│   │   │   │   ├── UserForm.vue
│   │   │   │   └── UserDetail.vue
│   │   │   ├── role/
│   │   │   └── menu/
│   │   ├── dashboard/     # 仪表盘
│   │   └── login/         # 登录页
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── .env.test              # 测试环境变量
├── index.html             # HTML 入口
├── vite.config.ts         # Vite 配置
└── tsconfig.json          # TypeScript 配置
```

### admin 应用开发指南

#### 环境变量配置

```bash
# apps/admin/.env.development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=云枢中台
VITE_APP_VERSION=1.0.0
VITE_ENABLE_MOCK=false
```

#### 开发流程

1. **创建功能模块目录**
```bash
# 创建系统管理下的用户管理模块
apps/admin/src/views/system/user/
apps/admin/src/api/modules/system/user.api.ts
apps/admin/src/router/routes/system/user.ts
```

2. **实现路由和权限**
```typescript
// 路由配置
{
  path: '/system/user',
  name: 'SystemUser',
  component: () => import('@/views/system/user/UserList.vue'),
  meta: {
    title: '用户管理',
    icon: 'ri:user-line',
    permission: 'system:user:list',
    keepAlive: true,  // 需要缓存
  },
}
```

3. **遵循开发规范**
- 使用组合式 API (`<script setup lang="ts">`)
- 类型定义优先
- 组件职责单一
- 样式 scoped 隔离

### 添加新页面

#### 1. 创建视图组件

```vue
<!-- src/views/system/user/UserList.vue -->
<template>
  <div class="user-list">
    <div class="toolbar">
      <YunButton type="primary" @click="handleCreate">
        {{ t('system.user.create') }}
      </YunButton>
    </div>

    <YunTable
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @page-change="handlePageChange"
    >
      <template #status="{ row }">
        <YunTag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </YunTag>
      </template>
      <template #action="{ row }">
        <YunButton link @click="handleEdit(row)">编辑</YunButton>
        <YunButton link type="danger" @click="handleDelete(row)">删除</YunButton>
      </template>
    </YunTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from '@yunshu/ui';
import { UserApi } from '@/api/modules/system/user.api';
import type { IUser, IUserQuery } from '@yunshu/shared';

const { t } = useI18n();

// 状态
const loading = ref(false);
const tableData = ref<IUser[]>([]);
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

// 表格列定义
const columns = [
  { prop: 'username', label: '用户名', width: 150 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'realName', label: '真实姓名', width: 120 },
  { slot: 'status', label: '状态', width: 100 },
  { slot: 'action', label: '操作', width: 180, fixed: 'right' },
];

// 生命周期
onMounted(() => {
  loadData();
});

// 方法
const loadData = async () => {
  loading.value = true;
  try {
    const params: IUserQuery = {
      page: pagination.page,
      pageSize: pagination.pageSize,
    };
    const { data } = await UserApi.list(params);
    tableData.value = data.list;
    pagination.total = data.total;
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  pagination.page = page;
  loadData();
};

const handleCreate = () => {
  // 创建用户
};

const handleEdit = (row: IUser) => {
  // 编辑用户
};

const handleDelete = async (row: IUser) => {
  // 删除用户
};
</script>
```

#### 2. 配置路由

```typescript
// src/router/routes/system/user.ts
import type { RouteRecordRaw } from 'vue-router';

export const systemUserRoutes: RouteRecordRaw[] = [
  {
    path: '/system/user',
    name: 'SystemUser',
    component: () => import('@/views/system/user/UserList.vue'),
    meta: {
      title: '用户管理',
      icon: 'ri:user-line',
      permission: 'system:user:list',
    },
  },
];
```

#### 3. 添加 API

```typescript
// src/api/modules/system/user.api.ts
import { http } from '@/utils/http';
import type { IUser, IUserQuery, IUserCreate, IUserUpdate } from '@yunshu/shared';
import type { IPageResult } from '@yunshu/shared';

export const UserApi = {
  /** 获取用户列表 */
  list: (params: IUserQuery) =>
    http.get<IPageResult<IUser>>('/system/user', { params }),

  /** 获取用户详情 */
  getById: (id: string) =>
    http.get<IUser>(`/system/user/${id}`),

  /** 创建用户 */
  create: (data: IUserCreate) =>
    http.post<IUser>('/system/user', data),

  /** 更新用户 */
  update: (id: string, data: IUserUpdate) =>
    http.put<IUser>(`/system/user/${id}`, data),

  /** 删除用户 */
  delete: (id: string) =>
    http.delete<void>(`/system/user/${id}`),

  /** 重置密码 */
  resetPassword: (id: string, password: string) =>
    http.post<void>(`/system/user/${id}/reset-password`, { password }),

  /** 修改状态 */
  changeStatus: (id: string, status: number) =>
    http.patch<void>(`/system/user/${id}/status`, { status }),
};
```

#### 4. 注册路由

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { systemUserRoutes } from './routes/system/user';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ...
    ...systemUserRoutes,
  ],
});

export default router;
```

## 数据库开发

### 数据库架构

项目采用 **PostgreSQL 16** + **Redis 7** 的数据架构：

| 组件 | 版本 | 用途 |
|------|------|------|
| PostgreSQL | 16.x | 主数据库，存储业务数据、权限配置、日志等 |
| Redis | 7.x | 二级缓存、分布式锁、会话缓存、布隆过滤器 |

### 环境变量配置

在 packages/server-express/.env.production 或 .env.development 中配置：

```bash
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yunshu
DB_USER=yunshu
DB_PASSWORD=yunshupassword

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_MAX_RETRIES=3
REDIS_RETRY_DELAY_MS=1000
```

### PostgreSQL 开发规范

#### 连接管理

`PostgresClientManager` 提供单例连接池管理，推荐使用统一入口：

```typescript
import { PostgresClientManager } from '@yunshu/server-core';

const pool = PostgresClientManager.getInstance().getPool();
const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
```

#### Repository 模式

数据访问通过 `IRepository` 接口，PostgreSQL 具体实现由 `PostgresRepository` 提供：

```typescript
interface IRepository<T, TId> {
  findById(id: TId): Promise<T | null>;
  findAll(filter?: Record<string, unknown>): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: TId, data: Partial<T>): Promise<T>;
  delete(id: TId): Promise<boolean>;
}
```

#### BaseService 基础服务

所有业务服务继承自 `BaseService<T, TId>`，获得通用 CRUD 能力：

```typescript
import { BaseService } from '@yunshu/server-core';
import { PostgresRepository } from '@yunshu/server-core/repositories/PostgresRepository';

class UserService extends BaseService<IUser, string> {
  constructor() {
    super('users', new PostgresRepository(pool, 'users'));
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this.repository.findOne({ username });
  }
}
```

#### 错误处理

`errorHandler` 中间件统一处理 PostgreSQL 错误，自动识别：

| 错误码 | 场景 | HTTP 状态码 |
|--------|------|------------|
| 23505 | 唯一键冲突（字段重复） | 409 |
| 23503 | 外键约束（关联数据不存在） | 409 |
| 23502 | 非空约束（必填字段为空） | 400 |
| 22P02 | 类型转换错误 | 400 |
| 42P01 | 表不存在 | 500 |
| 28P01 | 认证失败 | 500 |

在 Controller 层无需手动捕获，只需抛出业务错误：

```typescript
import { AppError, errorHandler } from '@yunshu/server-express/middlewares/errorHandler';

try {
  await userService.create(data);
} catch (err) {
  // 统一交由 errorHandler 处理
  throw new AppError('业务逻辑错误', 400);
}
```

### 代码生成器

项目内置基于模板的代码生成器，可一键生成 PostgreSQL 表结构：

```bash
# 生成数据库表 SQL + 前后端代码
pnpm gen

# 仅生成 SQL
pnpm gen:sql
```

模板定义位于 `packages/server-express/src/modules/gen/templates/sql.hbs`，支持：

- 主键定义（`id` + `PRIMARY KEY`）
- 索引创建（`CREATE INDEX`）
- 注释（`COMMENT ON`）
- 字段类型推断（从 JSON 配置映射到 PostgreSQL 类型）

### SQL 编写规范

1. **标识符使用双引号**：`"user"`、`"username"`
2. **字符串使用单引号**：`'text value'`
3. **命名规范**：小写 + 下划线（snake_case），如 `user_login_log`
4. **必填字段**：`id`、`created_at`、`updated_at`、`is_deleted`
5. **软删除**：使用 `is_deleted` 标志，避免真实删除

### Redis 缓存开发

#### Redis 连接管理器

使用单例 `RedisClientManager` 管理连接：

```typescript
import { RedisClientManager, getRedisClient } from '@yunshu/server-core/cache/RedisClient';

// 健康检查
const health = RedisClientManager.getInstance().healthCheck();
console.log('Redis 状态:', health.status, '响应时间(ms):', health.latency);

// 获取原生客户端
const redis = getRedisClient();
await redis.set('key', 'value', 'EX', 3600);
```

#### 二级缓存装饰器

在 Service 层使用 `cacheable` 装饰器声明缓存策略：

```typescript
import { cacheable } from '@yunshu/server-core/cache/CacheDecorator';

class UserService extends BaseService<IUser, string> {
  // 启用二级缓存，L1 30s / L2 300s / 布隆过滤器防穿透
  @cacheable({
    keyPrefix: 'user:byId',
    ttl: 300,
    ttlJitter: 30,
    enableL1: true,
    l1Ttl: 30,
    enableBloomFilter: true,
    cacheNull: true,
  })
  async findById(id: string): Promise<IUser | null> {
    return super.findById(id);
  }
}
```

#### 缓存统计与监控

```typescript
import { getCacheReport } from '@yunshu/server-core/cache/CacheDecorator';

const report = getCacheReport('user:byId');
console.log('缓存命中率:', report.hitRate);
console.log('L1 命中数:', report.stats.l1Hits);
console.log('L2 命中数:', report.stats.l2Hits);
console.log('布隆过滤命中数:', report.stats.bloomFiltered);
```

#### 分布式锁

使用 Redis 分布式锁保护热点数据更新：

```typescript
import { acquireLock } from '@yunshu/server-core/cache/DistributedLock';

const lock = await acquireLock('user:balance:update:123', {
  ttl: 5000,      // 锁有效期 5s
  retries: 3,     // 重试 3 次
  retryDelay: 100,// 每次间隔 100ms
});

if (lock) {
  try {
    // 业务操作...
  } finally {
    await lock.release();
  }
}
```

#### 缓存预热

在服务启动阶段通过 `WarmupManager` 预加载热点数据到缓存：

```typescript
import { WarmupManager } from '@yunshu/server-core/cache/CacheWarmup';

const manager = new WarmupManager({ autoStart: true, startupDelay: 1000 });

manager.register({
  name: 'hot-users',
  handler: async () => {
    const users = await userService.findHotUsers(100);
    // 写入缓存...
  },
  priority: 1,
  interval: 60000, // 每分钟刷新
});

await manager.start();
```

## 缓存开发最佳实践

| 场景 | 推荐策略 |
|------|---------|
| 高频读 + 低频写 | 启用 L1 + L2 双层缓存 |
| 热点键并发更新 | 分布式锁 + 热点键保护（hotKeyThreshold） |
| 防止缓存穿透 | 布隆过滤器 + null 缓存 |
| 防止缓存雪崩 | TtlJitter 随机化过期时间 |
| 冷启动场景 | WarmupManager 预热热点数据 |
| 短周期临时缓存 | 直接操作 Redis 原生客户端 |

## 组件开发

### Element Plus 组件使用规范

#### 组件导入方式
```typescript
// 全局导入（main.ts）
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
app.use(ElementPlus);

// 按需导入
import { ElButton, ElTable, ElForm, ElInput } from 'element-plus';
```

#### 常用组件使用示例

**ElButton 按钮**
```vue
<template>
  <div class="button-group">
    <el-button type="primary" @click="handleClick">
      主要按钮
    </el-button>
    <el-button type="success" size="medium" :loading="loading">
      成功按钮
    </el-button>
    <el-button type="warning" plain>
      警告按钮
    </el-button>
    <el-button type="danger" round :disabled="disabled">
      危险按钮
    </el-button>
  </div>
</template>
```

**ElTable 表格**
```vue
<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    stripe
    border
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="username" label="用户名" width="150" />
    <el-table-column prop="email" label="邮箱" min-width="180" />
    <el-table-column prop="status" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180" fixed="right">
      <template #default="{ row }">
        <el-button link type="primary" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button link type="danger" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
```

**ElForm 表单**
```vue
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="120px"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="formData.email" placeholder="请输入邮箱" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="formData.status">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="0">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

const formRef = ref<FormInstance>();
const formData = reactive({
  username: '',
  email: '',
  status: 1,
});

const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      // 提交表单
    }
  });
};

const handleReset = () => {
  formRef.value?.resetFields();
};
</script>
```

**ElDialog 对话框**
```vue
<template>
  <el-dialog
    v-model="dialogVisible"
    title="用户信息"
    width="600px"
    :close-on-click-modal="false"
  >
    <div class="user-info">
      <p>用户名：{{ userInfo.username }}</p>
      <p>邮箱：{{ userInfo.email }}</p>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>
```

**ElMessage 消息提示**
```typescript
import { ElMessage } from 'element-plus';

// 成功消息
ElMessage.success('操作成功');

// 错误消息
ElMessage.error('操作失败');

// 警告消息
ElMessage.warning('请注意');

// 	info消息
ElMessage.info('这是一条信息');
```

**ElMessageBox 确认框**
```typescript
import { ElMessageBox } from 'element-plus';

// 确认删除
const handleDelete = async (row: IUser) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 ${row.username} 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    // 执行删除
  } catch {
    // 用户取消
  }
};
```

### 组件结构

```
components/
└── MyComponent/
    ├── src/
    │   └── MyComponent.vue    # 组件源码
    ├── __tests__/
    │   └── MyComponent.test.ts # 测试文件
    ├── index.ts               # 导出文件
    └── package.json           # 包配置（可选）
```

### 组件模板

```vue
<template>
  <div class="my-component" :class="{ 'my-component--disabled': disabled }">
    <slot name="prefix" />
    <span class="my-component__text">{{ text }}</span>
    <slot name="suffix" />
  </div>
</template>

<script setup lang="ts">
/**
 * MyComponent - 我的组件
 * @description 用于展示和交互的组件
 */
interface Props {
  /** 显示文本 */
  text: string;
  /** 是否禁用 */
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  /** 点击事件 */
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style scoped>
.my-component {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__text {
    color: var(--yun-color-text-primary);
  }
}
</style>
```

### 组件注册

```typescript
// packages/ui/src/components/index.ts
import MyComponent from './MyComponent';

export const MyComponentPlugin = {
  install(app: App) {
    app.component('MyComponent', MyComponent);
  },
};

export { MyComponent };
```

## API 开发

### axios-based 请求工具使用

#### HttpClient 核心用法

```typescript
// src/utils/http.ts
import { HttpClient } from '@yunshu/api-client';
import { AxiosAdapter } from '@yunshu/api-client/adapters/axios';

const http = new HttpClient(new AxiosAdapter(), {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  retry: 3,
  retryDelay: 1000,
});
```

#### 请求拦截器

```typescript
// 请求拦截器 - 添加 Token
http.interceptors.request.use((config) => {
  const token = useUserStore().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 请求拦截器 - 添加时间戳（防止缓存）
http.interceptors.request.use((config) => {
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }
  return config;
});
```

#### 响应拦截器

```typescript
// 响应拦截器 - 统一处理
http.interceptors.response.use(
  (response) => {
    const { data } = response;
    // 业务错误处理
    if (data.code !== 0) {
      ElMessage.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message));
    }
    return data;
  },
  async (error) => {
    const { response } = error;

    switch (response?.status) {
      case 401:
        // Token 过期，尝试刷新或跳转登录
        await handleUnauthorized();
        break;
      case 403:
        ElMessage.error('无权限访问');
        break;
      case 404:
        ElMessage.error('请求资源不存在');
        break;
      case 500:
        ElMessage.error('服务器错误，请稍后重试');
        break;
      case 502:
      case 503:
        ElMessage.error('服务暂不可用');
        break;
      default:
        ElMessage.error(error.message || '网络错误');
    }

    return Promise.reject(error);
  }
);
```

#### 认证过期处理

```typescript
// 处理 Token 过期
const handleUnauthorized = async () => {
  const userStore = useUserStore();

  // 尝试刷新 Token
  try {
    await userStore.refreshToken();
    // 重试原请求
    return;
  } catch {
    // 刷新失败，跳转登录
    userStore.logout();
    router.push('/login');
  }
};
```

#### 常用请求示例

```typescript
// GET 请求
const fetchUserList = (params: IUserQuery) => {
  return http.get<IUser[]>('/users', { params });
};

// POST 请求
const createUser = (data: IUserCreate) => {
  return http.post<IUser>('/users', data);
};

// PUT 请求
const updateUser = (id: string, data: IUserUpdate) => {
  return http.put<IUser>(`/users/${id}`, data);
};

// PATCH 请求
const updateUserStatus = (id: string, status: number) => {
  return http.patch<void>(`/users/${id}/status`, { status });
};

// DELETE 请求
const deleteUser = (id: string) => {
  return http.delete<void>(`/users/${id}`);
};

// 文件上传
const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return http.upload<IFileInfo>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 文件下载
const downloadFile = (id: string) => {
  return http.download('/download/${id}', { id }, {
    responseType: 'blob',
  });
};
```

#### 请求取消

```typescript
// 创建取消令牌
const controller = new AbortController();

// 使用
const fetchData = () => {
  return http.get('/data', {
    signal: controller.signal,
  });
};

// 取消请求
controller.abort();
```

### HTTP 客户端配置

```typescript
// src/utils/http.ts
import { HttpClient } from '@yunshu/api-client';
import { AxiosAdapter } from '@yunshu/api-client/adapters/axios';

const http = new HttpClient(new AxiosAdapter(), {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  retry: 3,
  retryDelay: 1000,
});

// 请求拦截器
http.interceptors.request.use((config) => {
  const token = useUserStore().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    switch (response?.status) {
      case 401:
        // Token 过期，刷新或跳转登录
        await handleUnauthorized();
        break;
      case 403:
        // 无权限
        ElMessage.error('无权限访问');
        break;
      case 500:
        // 服务器错误
        ElMessage.error('服务器错误');
        break;
    }

    return Promise.reject(error);
  }
);

export { http };
```

### API 模块化

```typescript
// src/api/index.ts
export * from './modules/system/user.api';
export * from './modules/system/role.api';
export * from './modules/system/menu.api';
export * from './modules/system/log.api';
```

## 样式开发

### SCSS 规范

#### 目录结构
```
styles/
├── common/           # 通用样式
│   ├── _reset.scss   # CSS 重置
│   ├── _common.scss  # 通用类
│   └── _transition.scss # 过渡动画
├── variables/        # 变量文件
│   ├── _colors.scss # 颜色变量
│   ├── _typography.scss # 字体变量
│   ├── _spacing.scss # 间距变量
│   └── _variables.scss # 全局变量
├── mixins/          # SCSS 混入
│   ├── _flex.scss   # Flex 布局混入
│   ├── _grid.scss   # Grid 布局混入
│   └── _responsive.scss # 响应式混入
└── index.scss       # 主入口
```

#### 变量定义规范
```scss
// 颜色变量（使用设计令牌）
$primary-color: var(--yun-color-primary);
$success-color: var(--yun-color-success);
$warning-color: var(--yun-color-warning);
$danger-color: var(--yun-color-danger);

// 字体
$font-family-base: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
$font-size-base: 14px;
$font-size-small: 12px;
$font-size-large: 16px;

// 间距
$spacing-base: 8px;
$spacing-xs: $spacing-base / 2;  // 4px
$spacing-sm: $spacing-base;       // 8px
$spacing-md: $spacing-base * 2;  // 16px
$spacing-lg: $spacing-base * 3;  // 24px
$spacing-xl: $spacing-base * 4;  // 32px

// 圆角
$border-radius-sm: 4px;
$border-radius-base: 8px;
$border-radius-lg: 12px;

// 阴影
$shadow-base: 0 2px 8px rgba(0, 0, 0, 0.1);
$shadow-light: 0 1px 4px rgba(0, 0, 0, 0.08);
```

#### Mixin 混入规范
```scss
// Flex 布局混入
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}

// 响应式混入
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// 文字省略
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin text-clamp($lines) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

#### 基础样式规范
```scss
// BEM 命名规范
.component {
  &__element {
    color: $primary-color;
  }

  &--modifier {
    color: $danger-color;
  }
}

// 使用混入
.card {
  @include flex-column;
  @include flex-center;
  padding: $spacing-md;
  background: #fff;
  border-radius: $border-radius-base;
  box-shadow: $shadow-base;

  &__title {
    @include text-ellipsis;
    font-size: $font-size-large;
    font-weight: 600;
  }

  &__content {
    @include text-clamp(3);
    color: $text-color-secondary;
  }

  &--primary {
    border-left: 4px solid $primary-color;
  }
}
```

#### 响应式断点
```scss
$breakpoints: (
  'xs': 480px,
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px,
);

// 使用
.container {
  width: 100%;
  padding: 0 $spacing-sm;

  @include respond-to('md') {
    padding: 0 $spacing-md;
    max-width: 720px;
  }

  @include respond-to('lg') {
    padding: 0 $spacing-lg;
    max-width: 960px;
  }

  @include respond-to('xl') {
    max-width: 1140px;
  }
}
```

### CSS 变量

```scss
// 使用设计令牌的 CSS 变量
.component {
  color: var(--yun-color-text-primary);
  background: var(--yun-color-bg-page);
  border: 1px solid var(--yun-color-border);
  border-radius: var(--yun-border-radius-md);
  padding: var(--yun-spacing-4);
}
```

### 主题变量

```scss
// 浅色主题（默认）
:root {
  --yun-color-primary: #409eff;
}

// 深色主题
[data-theme='dark'] {
  --yun-color-primary: #79bbff;
}
```

### 响应式断点

```scss
// 断点定义
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px,
);

// 使用
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}
```

## 测试开发

### Vitest + Playwright 测试规范

#### 测试目录结构
```
tests/
├── unit/              # 单元测试
│   ├── utils/
│   ├── composables/
│   └── components/
├── integration/       # 集成测试
├── e2e/              # E2E 测试 (Playwright)
│   ├── pages/
│   ├── components/
│   └── specs/
└── fixtures/         # 测试数据
```

#### Vitest 配置
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'dist',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
});
```

### 单元测试规范

#### 工具函数测试
```typescript
// src/utils/__tests__/format.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { formatDate, formatDateTime, formatCurrency } from '../format';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15T10:30:00');
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
  });

  it('should format datetime correctly', () => {
    const date = new Date('2024-01-15T10:30:00');
    expect(formatDateTime(date)).toBe('2024-01-15 10:30:00');
  });

  it('should handle invalid date', () => {
    expect(formatDate(null as any)).toBe('-');
  });
});

describe('formatCurrency', () => {
  it('should format currency with default symbol', () => {
    expect(formatCurrency(1234.56)).toBe('¥1,234.56');
  });

  it('should format currency with custom symbol', () => {
    expect(formatCurrency(1234.56, '$')).toBe('$1,234.56');
  });
});
```

#### 组合式函数测试
```typescript
// src/composables/__tests__/usePagination.test.ts
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  it('should initialize with default values', () => {
    const { page, pageSize, total, pageCount } = usePagination();

    expect(page.value).toBe(1);
    expect(pageSize.value).toBe(10);
    expect(total.value).toBe(0);
    expect(pageCount.value).toBe(0);
  });

  it('should calculate pageCount correctly', () => {
    const { page, pageSize, total, pageCount } = usePagination();
    total.value = 100;

    expect(pageCount.value).toBe(10);
  });

  it('should reset page to 1 when pageSize changes', () => {
    const { page, pageSize } = usePagination();
    page.value = 5;
    pageSize.value = 20;

    expect(page.value).toBe(1);
  });
});
```

### 组件测试规范

#### 基本组件测试
```typescript
// components/Button/__tests__/Button.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button.vue';

describe('Button', () => {
  it('should render correctly with default props', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Button Text',
      },
    });

    expect(wrapper.text()).toBe('Button Text');
    expect(wrapper.classes()).toContain('yun-button');
    expect(wrapper.classes()).toContain('yun-button--default');
  });

  it('should apply correct type class', () => {
    const wrapper = mount(Button, {
      props: { type: 'primary' },
      slots: { default: 'Primary' },
    });

    expect(wrapper.classes()).toContain('yun-button--primary');
  });

  it('should emit click event', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('should not emit click when disabled', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('should show loading state', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
    });

    expect(wrapper.find('.yun-button__loading').exists()).toBe(true);
  });
});
```

### Playwright E2E 测试规范

#### Playwright 配置
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

#### E2E 测试示例
```typescript
// tests/e2e/specs/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('登录功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('应该能够使用正确凭据登录', async ({ page }) => {
    await page.getByLabel('用户名').fill('admin');
    await page.getByLabel('密码').fill('admin123');
    await page.getByRole('button', { name: '登录' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('欢迎回来')).toBeVisible();
  });

  test('应该在凭据错误时显示错误提示', async ({ page }) => {
    await page.getByLabel('用户名').fill('admin');
    await page.getByLabel('密码').fill('wrongpassword');
    await page.getByRole('button', { name: '登录' }).click();

    await expect(page.getByText('用户名或密码错误')).toBeVisible();
  });

  test('应该能够记住登录状态', async ({ page }) => {
    await page.getByLabel('用户名').fill('admin');
    await page.getByLabel('密码').fill('admin123');
    await page.getByLabel('记住我').check();
    await page.getByRole('button', { name: '登录' }).click();

    // 关闭浏览器，重新打开
    await page.context().browser()?.close();
    const newContext = await page.context().browser().newContext();
    const newPage = await newContext.newPage();
    await newPage.goto('/dashboard');

    // 应该已登录
    await expect(newPage).not.toHaveURL('/login');
  });
});
```

#### 页面对象模式
```typescript
// tests/e2e/pages/LoginPage.ts
import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('用户名');
    this.passwordInput = page.getByLabel('密码');
    this.rememberMeCheckbox = page.getByLabel('记住我');
    this.submitButton = page.getByRole('button', { name: '登录' });
  }

  async login(username: string, password: string, rememberMe = false) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    await this.submitButton.click();
  }
}
```

### Mock 数据

```typescript
// src/utils/__tests__/format.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { formatDate, formatDateTime } from '../format';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15T10:30:00');
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
  });

  it('should format datetime correctly', () => {
    const date = new Date('2024-01-15T10:30:00');
    expect(formatDateTime(date)).toBe('2024-01-15 10:30:00');
  });
});
```

### 组件测试

```typescript
// components/Button/__tests__/Button.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Button from '../Button.vue';

describe('Button', () => {
  it('should render correctly', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
      },
      slots: {
        default: 'Button Text',
      },
    });

    expect(wrapper.text()).toBe('Button Text');
    expect(wrapper.classes()).toContain('yun-button--primary');
  });

  it('should emit click event', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
```

### Mock 数据

```typescript
// src/api/__mocks__/user.api.ts
export const UserApi = {
  list: vi.fn().mockResolvedValue({
    data: {
      list: [
        { id: '1', username: 'admin', email: 'admin@example.com' },
        { id: '2', username: 'user', email: 'user@example.com' },
      ],
      total: 2,
    },
  }),

  getById: vi.fn().mockResolvedValue({
    data: { id: '1', username: 'admin', email: 'admin@example.com' },
  }),

  create: vi.fn().mockResolvedValue({
    data: { id: '3', username: 'new', email: 'new@example.com' },
  }),
};
```

## 调试技巧

### Vue DevTools

#### 简介
Vue DevTools 是 Vue 官方提供的浏览器开发工具扩展，用于调试 Vue 应用。

#### 安装
1. **Chrome**: 从 [Chrome Web Store](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 安装
2. **Firefox**: 从 [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/vuejs-devtools/) 安装

#### 功能
- **组件检查**: 查看组件树结构和组件状态
- **Props/State 编辑**: 实时修改组件属性和状态
- **事件追踪**: 查看组件触发的所有事件
- **性能分析**: 分析组件渲染性能
- **Vuex/Pinia**: 调试状态管理

#### 使用技巧
```typescript
// 在组件中输出调试信息
defineComponent({
  created() {
    // Vue DevTools 会显示这个输出
    console.log('Component created');
  },
});

// 使用 devtools 钩子
import { devtools } from '@vue/devtools';

if (import.meta.env.DEV) {
  devtools.connect('http://localhost', 8098);
}
```

### 浏览器开发者工具

#### Network 面板
- 查看所有 HTTP 请求
- 过滤特定类型的请求 (XHR, Fetch, JS, CSS)
- 查看请求详情和响应数据
- 复制请求为 cURL

#### Console 面板
```typescript
// 使用 console 进行调试
console.log('普通信息');
console.info('提示信息');
console.warn('警告信息');
console.error('错误信息');

// 对象格式化
console.table([{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]);

// 计时
console.time('operation');
// ... 执行操作
console.timeEnd('operation');

// 分组
console.group('User Details');
console.log('Name:', user.name);
console.log('Email:', user.email);
console.groupEnd();
```

### VS Code 调试

#### 调试配置

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug: Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/apps/admin",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "mappings:": "${webRoot}/src"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug: Tests",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test", "--run", "--reporter=verbose"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug: Vitest",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["exec", "vitest", "--run"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

#### VS Code 调试面板
- 使用 F5 或点击 Run and Debug 面板
- 设置断点
- 监视变量
- 调用堆栈

### API 调试

#### 使用浏览器开发者工具
- 打开 Network 面板
- 筛选 XHR/Fetch 请求
- 查看请求 Headers、Payload、Response
- 右键复制为 cURL

#### 使用 REST Client 插件
```typescript
// .http 文件
### 获取用户列表
GET http://localhost:8080/api/system/user
Content-Type: application/json
Authorization: Bearer {{token}}

### 创建用户
POST http://localhost:8080/api/system/user
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "username": "test",
  "email": "test@example.com"
}
```

#### 请求模拟
```typescript
// src/api/__mocks__/user.api.ts
import { http } from '@/utils/http';

export const UserApiMock = {
  list: vi.fn().mockResolvedValue({
    data: {
      list: [
        { id: '1', username: 'admin', email: 'admin@example.com', status: 1 },
        { id: '2', username: 'user', email: 'user@example.com', status: 1 },
      ],
      total: 2,
    },
  }),

  getById: vi.fn().mockResolvedValue({
    data: { id: '1', username: 'admin', email: 'admin@example.com', status: 1 },
  }),

  create: vi.fn().mockResolvedValue({
    data: { id: '3', username: 'new', email: 'new@example.com', status: 1 },
  }),

  update: vi.fn().mockResolvedValue({
    data: { id: '1', username: 'admin', email: 'admin@example.com', status: 1 },
  }),

  delete: vi.fn().mockResolvedValue({
    data: null,
  }),
};

// 切换到 Mock
export const enableMock = () => {
  if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
    Object.assign(UserApi, UserApiMock);
  }
};
```

### Pinia 状态调试

```typescript
// stores/user.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const token = ref('');
  const userInfo = ref<IUserInfo | null>(null);

  // Pinia 支持 Vue DevTools
  return { token, userInfo };
});
```

打开 Vue DevTools 的 Pinia 面板可以：
- 查看所有 store 状态
- 追踪状态变化历史
- 手动修改状态进行测试
- 查看 actions 调用记录

### 常见问题

#### 1. 依赖安装失败

```bash
# 清理缓存
pnpm store prune

# 清理 node_modules
rm -rf node_modules
rm -rf apps/admin/node_modules

# 重新安装
pnpm install
```

#### 2. 构建失败

```bash
# 清理构建缓存
pnpm clean

# 检查 TypeScript 错误
pnpm type-check

# 重新构建
pnpm build
```

#### 3. 类型错误

```bash
# 检查类型错误
pnpm type-check

# 生成类型声明
pnpm build --filter=@yunshu/ui

# 更新 @tsconfig 配置
pnpm exec tsc --noEmit
```

#### 4. 测试失败

```bash
# 运行测试（单个文件）
pnpm test src/utils/format.test.ts

# 运行测试（带 UI）
pnpm test:ui

# 更新快照
pnpm test --update
```

#### 5. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 或
netstat -ano | findstr :3000

# 结束进程
kill -9 <PID>
```

#### 6. 开发服务器启动慢

```bash
# 使用 esbuild 预构建依赖
pnpm dev --filter=@yunshu/admin --force
```

#### 7. 热更新不生效

```bash
# 清除 Vite 缓存
rm -rf node_modules/.vite

# 重启开发服务器
pnpm dev
```

#### 8. CORS 问题

检查后端 CORS 配置：
```typescript
// 确保后端设置了正确的 CORS 头
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

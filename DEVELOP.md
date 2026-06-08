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

- Node.js >= 18.0.0
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

# 开发指定包
pnpm dev --filter=@yunshu/ui

# 构建所有包
pnpm build

# 构建指定包
pnpm build --filter=@yunshu/ui

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 类型检查
pnpm type-check
```

## 项目结构

### Monorepo 架构

项目采用 **Monorepo** 架构，使用 **Turborepo** 管理：

```
yunshu-platform/
├── apps/              # 应用
│   ├── admin/         # 后台管理应用
│   └── docs/          # 文档站点
├── packages/          # 共享包
│   ├── design-tokens/ # 设计令牌
│   ├── shared/        # 共享类型
│   ├── api-client/    # API 客户端
│   ├── ui/            # UI 组件库
│   ├── server-core/   # 后端核心
│   └── server-express/# Express 适配器
├── tools/             # 开发工具
├── templates/         # 项目模板
└── examples/         # 示例代码
```

### 包类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `app` | 终端应用 | admin, docs |
| `package` | 共享包 | ui, api-client |

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

### admin 应用结构

```
apps/admin/
├── src/
│   ├── api/           # API 接口模块
│   │   ├── modules/   # 按模块组织的 API
│   │   └── index.ts   # API 统一导出
│   ├── assets/        # 静态资源
│   ├── components/    # 公共组件
│   ├── composables/   # 组合式函数
│   ├── config/        # 配置文件
│   ├── directives/    # 自定义指令
│   ├── hooks/         # Hooks
│   ├── layouts/       # 布局组件
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── styles/        # 全局样式
│   ├── types/         # 类型定义
│   ├── utils/         # 工具函数
│   ├── views/         # 页面组件
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── .env.development   # 开发环境变量
├── .env.production    # 生产环境变量
├── .env.test          # 测试环境变量
└── index.html         # HTML 入口
```

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

## 组件开发

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

### 单元测试

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

### VS Code 调试

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test", "--run"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Vue DevTools

安装 Vue DevTools 浏览器扩展进行组件调试。

### API 调试

使用浏览器开发者工具的 Network 面板查看 API 请求。

### 常见问题

#### 1. 依赖安装失败

```bash
# 清理缓存
pnpm store prune

# 重新安装
rm -rf node_modules
pnpm install
```

#### 2. 构建失败

```bash
# 清理构建缓存
pnpm clean

# 重新构建
pnpm build
```

#### 3. 类型错误

```bash
# 检查类型错误
pnpm type-check

# 生成类型声明
pnpm build --filter=@yunshu/ui
```

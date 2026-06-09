<p align="center">
  <h1>☁️ 云枢中台 (Yunshu Platform)</h1>
</p>

<p align="center">
  开箱即用的中台前端/设计解决方案 — 沉淀自云枢网站导航系统 ~238,000 行生产级代码
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> •
  <a href="#特性">特性</a> •
  <a href="#包列表">包列表</a> •
  <a href="#项目结构">项目结构</a> •
  <a href="#开发指南">开发指南</a> •
  <a href="https://docs.yunshu.dev">文档</a>
</p>

---

## ✨ 特性

### 🎨 设计系统

- **完整的设计令牌系统** — 颜色、字体、间距、阴影等设计决策的标准化
- **多格式输出** — 支持 CSS/SCSS/JS/Tailwind 等多种格式
- **双主题支持** — 浅色/深色主题，开箱即用
- **无障碍标准** — 遵循 WCAG AA 级对比度标准

### 🚀 开发效率

- **代码生成器** — 一键生成前后端代码，提升开发效率
- **动态路由** — 根据用户权限自动生成菜单
- **Mock 数据** — 无需后端即可进行前端开发
- **国际化** — 支持中英文切换，开箱即用

### 🔐 企业级权限

- **RBAC 权限模型** — 基于角色的访问控制
- **按钮级权限控制** — 精确到按钮的权限管理
- **数据权限控制** — 细粒度的数据访问控制
- **多租户 SaaS** — 支持多租户架构

### 📊 系统监控

- **操作日志** — 记录用户关键操作
- **登录日志** — 完整的登录审计
- **在线用户** — 实时监控在线用户
- **服务监控** — 系统健康状态监控

### 🛠️ 基础设施

- **Monorepo 架构** — 使用 Turborepo 管理多包仓库
- **TypeScript 严格模式** — 完整的类型安全
- **完善的错误处理** — 统一的错误处理体系

---

## 📦 包列表

| 包名 | 说明 | 状态 |
|------|------|------|
| [`@yunshu/design-tokens`](./packages/design-tokens) | 设计令牌 — CSS/SCSS/JS/Tailwind 多格式输出 | ✅ |
| [`@yunshu/shared`](./packages/shared) | 共享类型和工具函数 | ✅ |
| [`@yunshu/api-client`](./packages/api-client) | HTTP 客户端 — 请求去重/缓存/Token 刷新 | ✅ |
| [`@yunshu/ui`](./packages/ui) | Vue 3 UI 组件库 — 三层架构 | ✅ |
| [`@yunshu/server-core`](./packages/server-core) | 后端核心 — BaseService/装饰器/错误体系 | ✅ |
| [`@yunshu/server-express`](./packages/server-express) | Express 适配器 — BaseController/中间件 | ✅ |
| [`@yunshu/cli`](./packages/cli) | 脚手架 CLI — 项目创建/代码生成 | 🚧 开发中 |
| [`@yunshu/admin-pro`](./packages/admin-pro) | 后台管理 Pro 版 — 开箱即用 | 📋 计划中 |

---

## 🚀 快速开始

### 环境要求

| 工具 | 版本要求 |
|------|----------|
| Node.js | >= 18.0.0 |
| pnpm | >= 9.0.0 |

### 安装

```bash
# 克隆项目
git clone https://github.com/wangfeizong1001/yunshu-platform.git
cd yunshu-platform

# 安装依赖（使用 pnpm）
pnpm install

# 如果遇到网络问题，请配置国内镜像
pnpm config set registry https://registry.npmmirror.com/
```

### 开发模式

```bash
# 启动所有包开发模式
pnpm dev

# 启动文档站点
pnpm docs:dev

# 启动 Playground
pnpm playground:dev
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建并发布
pnpm release
```

### 测试

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

### 代码质量

```bash
# 代码格式化和检查
pnpm lint

# 类型检查
pnpm type-check

# 代码格式化（仅格式化）
pnpm format
```

---

## 🏗️ 项目结构

```
yunshu-platform/
├── apps/
│   ├── admin/                  # 后台管理应用
│   │   ├── src/
│   │   │   ├── api/           # API 接口
│   │   │   ├── assets/        # 静态资源
│   │   │   ├── components/    # 公共组件
│   │   │   ├── composables/   # 组合式函数
│   │   │   ├── config/        # 配置文件
│   │   │   ├── directives/    # 自定义指令
│   │   │   ├── hooks/         # Hooks
│   │   │   ├── layouts/       # 布局组件
│   │   │   ├── router/        # 路由配置
│   │   │   ├── stores/        # 状态管理
│   │   │   ├── styles/        # 全局样式
│   │   │   ├── types/         # 类型定义
│   │   │   ├── utils/         # 工具函数
│   │   │   └── views/         # 页面组件
│   │   ├── .env.development   # 开发环境变量
│   │   ├── .env.production    # 生产环境变量
│   │   └── .env.test          # 测试环境变量
│   └── docs/                   # 文档站点
│
├── packages/
│   ├── design-tokens/          # 设计令牌
│   │   ├── src/
│   │   │   ├── tokens/        # 设计令牌定义
│   │   │   ├── transform/     # 格式转换器
│   │   │   └── index.ts       # 入口文件
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                  # 共享类型和工具
│   │   ├── src/
│   │   │   ├── types/         # 类型定义
│   │   │   ├── utils/         # 工具函数
│   │   │   └── index.ts       # 入口文件
│   │   └── package.json
│   │
│   ├── api-client/             # API 客户端
│   │   ├── src/
│   │   │   ├── core/          # 核心功能
│   │   │   ├── adapters/      # 适配器
│   │   │   └── index.ts       # 入口文件
│   │   └── package.json
│   │
│   ├── ui/                     # Vue 3 组件库
│   │   ├── src/
│   │   │   ├── components/     # 组件
│   │   │   ├── composables/   # 组合式函数
│   │   │   ├── directives/    # 指令
│   │   │   └── index.ts       # 入口文件
│   │   └── package.json
│   │
│   ├── server-core/            # 后端核心
│   │   ├── src/
│   │   │   ├── services/      # 服务基类
│   │   │   ├── decorators/    # 装饰器
│   │   │   ├── errors/        # 错误体系
│   │   │   └── index.ts       # 入口文件
│   │   └── package.json
│   │
│   ├── server-express/         # Express 适配器
│   │   ├── src/
│   │   │   ├── controllers/   # 控制器基类
│   │   │   ├── middlewares/    # 中间件
│   │   │   └── index.ts        # 入口文件
│   │   └── package.json
│   │
│   └── cli/                    # CLI 脚手架
│       ├── src/
│       │   ├── commands/      # 命令
│       │   ├── generators/    # 生成器
│       │   └── index.ts       # 入口文件
│       └── package.json
│
├── templates/                   # 项目模板
│   ├── admin/                  # 管理后台模板
│   └── spa/                   # 单页应用模板
│
├── tools/                       # 开发工具
│   ├── tsconfig/              # TypeScript 配置
│   └── eslint/                # ESLint 配置
│
├── docs/                        # 迁移指南等
├── examples/                    # 示例代码
├── README.md                    # 项目说明
├── CONTRIBUTING.md             # 贡献指南
├── DEVELOP.md                  # 开发指南
├── DEPLOY.md                   # 部署指南
├── CHANGELOG.md                # 更新日志
└── package.json                # 根 package.json
```

---

## 🛠️ 开发指南

### 创建新页面

#### 1. 创建页面组件

```vue
<!-- src/views/example/ExamplePage.vue -->
<template>
  <div class="example-page">
    <h1>{{ t('example.title') }}</h1>
    <YunButton type="primary" @click="handleClick">
      {{ t('example.button') }}
    </YunButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from '@yunshu/ui';
import { YunButton } from '@yunshu/ui';

const { t } = useI18n();
const loading = ref(false);

const handleClick = () => {
  console.log('Button clicked');
};
</script>

<style scoped>
.example-page {
  padding: 24px;
}
</style>
```

#### 2. 配置路由

```typescript
// src/router/routes/example.ts
import type { RouteRecordRaw } from 'vue-router';

export const exampleRoutes: RouteRecordRaw[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('@/views/example/ExamplePage.vue'),
    meta: {
      title: '示例页面',
      icon: 'ri:guide-line',
      permission: 'example:view',
    },
  },
];
```

#### 3. 添加权限配置（可选）

```typescript
// src/api/example.api.ts
import { HttpClient } from '@yunshu/api-client';
import type { IExampleItem, IExampleQuery } from '@yunshu/shared';

const http = new HttpClient(new AxiosAdapter());

export const ExampleApi = {
  // 获取列表
  list: (params: IExampleQuery) =>
    http.get<IExampleItem[]>('/example', { params }),

  // 获取详情
  getById: (id: string) =>
    http.get<IExampleItem>(`/example/${id}`),

  // 创建
  create: (data: Partial<IExampleItem>) =>
    http.post<IExampleItem>('/example', data),

  // 更新
  update: (id: string, data: Partial<IExampleItem>) =>
    http.put<IExampleItem>(`/example/${id}`, data),

  // 删除
  delete: (id: string) =>
    http.delete<void>(`/example/${id}`),
};
```

### 使用组件库

```vue
<template>
  <div class="demo">
    <!-- 基础按钮 -->
    <YunButton type="primary">主要按钮</YunButton>
    <YunButton type="default">默认按钮</YunButton>
    <YunButton type="danger">危险按钮</YunButton>

    <!-- 带图标 -->
    <YunButton type="primary" :icon="Plus">新建</YunButton>

    <!-- 加载状态 -->
    <YunButton type="primary" :loading="saving">保存</YunButton>

    <!-- 表单 -->
    <YunForm :model="form" :rules="rules" @submit="handleSubmit">
      <YunFormItem label="用户名" prop="username">
        <YunInput v-model="form.username" placeholder="请输入用户名" />
      </YunFormItem>
      <YunFormItem label="密码" prop="password">
        <YunInput v-model="form.password" type="password" placeholder="请输入密码" />
      </YunFormItem>
    </YunForm>

    <!-- 表格 -->
    <YunTable :data="tableData" :columns="columns" :loading="loading">
      <template #action="{ row }">
        <YunButton link @click="handleEdit(row)">编辑</YunButton>
        <YunButton link type="danger" @click="handleDelete(row)">删除</YunButton>
      </template>
    </YunTable>

    <!-- 弹窗 -->
    <YunDialog
      v-model="dialogVisible"
      title="提示"
      width="500px"
    >
      <p>这是一段内容</p>
      <template #footer>
        <YunButton @click="dialogVisible = false">取消</YunButton>
        <YunButton type="primary" @click="handleConfirm">确定</YunButton>
      </template>
    </YunDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  YunButton,
  YunForm,
  YunFormItem,
  YunInput,
  YunTable,
  YunDialog,
  useI18n,
} from '@yunshu/ui';
import { Plus } from '@iconify/vue';

const { t } = useI18n();
const saving = ref(false);
const dialogVisible = ref(false);

const form = reactive({
  username: '',
  password: '',
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const tableData = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
]);

const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'email', label: '邮箱' },
  { slot: 'action', label: '操作', width: 200 },
];

const handleSubmit = () => {
  console.log('Form submitted:', form);
};

const handleEdit = (row: any) => {
  console.log('Edit:', row);
};

const handleDelete = (row: any) => {
  console.log('Delete:', row);
};

const handleConfirm = () => {
  dialogVisible.value = false;
};
</script>
```

### 使用 API 客户端

```typescript
import { HttpClient } from '@yunshu/api-client';
import { AxiosAdapter } from '@yunshu/api-client/adapters/axios';
import type { IUser, ILoginParams } from '@yunshu/shared';

// 初始化 HTTP 客户端
const http = new HttpClient(new AxiosAdapter(), {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  retry: 3,
});

// 请求拦截器
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token 过期，刷新 Token
      await refreshToken();
      // 重试请求
      return http.request(error.config);
    }
    return Promise.reject(error);
  }
);

// API 定义
export const UserApi = {
  // 登录
  login: (params: ILoginParams) =>
    http.post<{ token: string; user: IUser }>('/auth/login', params),

  // 获取用户信息
  getUserInfo: () =>
    http.get<IUser>('/users/me'),

  // 获取用户列表
  getUsers: (params: { page: number; pageSize: number }) =>
    http.get<{ list: IUser[]; total: number }>('/users', { params }),

  // 创建用户
  createUser: (data: Partial<IUser>) =>
    http.post<IUser>('/users', data),

  // 更新用户
  updateUser: (id: string, data: Partial<IUser>) =>
    http.put<IUser>(`/users/${id}`, data),

  // 删除用户
  deleteUser: (id: string) =>
    http.delete<void>(`/users/${id}`),
};

// 使用示例
async function example() {
  try {
    // 登录
    const { data: loginData } = await UserApi.login({
      username: 'admin',
      password: '123456',
    });
    console.log('Token:', loginData.token);

    // 获取用户列表
    const { data: usersData } = await UserApi.getUsers({
      page: 1,
      pageSize: 10,
    });
    console.log('Users:', usersData.list);
    console.log('Total:', usersData.total);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 使用设计令牌

```typescript
// 在 JavaScript/TypeScript 中使用
import tokens from '@yunshu/design-tokens';

console.log('Primary color:', tokens.color.primary);
console.log('Font size:', tokens.font.size.base);
console.log('Spacing:', tokens.spacing[4]);

// 在 CSS 中使用
// 请参考 packages/design-tokens 包的 SCSS 输出
```

```scss
// 在 SCSS 中使用
@use '@yunshu/design-tokens/scss' as tokens;

.button {
  background-color: tokens.$color-primary;
  padding: tokens.$spacing-4 tokens.$spacing-6;
  border-radius: tokens.$border-radius-md;
  font-size: tokens.$font-size-base;
}
```

---

## 📚 文档

更多文档请访问 [云枢文档站](https://docs.yunshu.dev)。

| 文档 | 说明 |
|------|------|
| [快速开始](https://docs.yunshu.dev/guide/quick-start) | 5 分钟快速上手 |
| [设计令牌](https://docs.yunshu.dev/guide/design-tokens) | 设计系统令牌详解 |
| [权限设计](https://docs.yunshu.dev/guide/permission) | RBAC 权限模型 |
| [国际化](https://docs.yunshu.dev/guide/i18n) | 多语言支持 |
| [代码生成](https://docs.yunshu.dev/guide/gen) | 代码生成器使用 |
| [部署指南](./DEPLOY.md) | 生产环境部署 |
| [开发指南](./DEVELOP.md) | 开发规范 |
| [贡献指南](./CONTRIBUTING.md) | 如何贡献代码 |

---

## 📖 学习资源

| 资源 | 说明 |
|------|------|
| [Vue 3 文档](https://vuejs.org/) | Vue 3 官方文档 |
| [TypeScript 文档](https://www.typescriptlang.org/) | TypeScript 官方文档 |
| [Element Plus](https://element-plus.org/) | 基于 Vue 3 的组件库 |
| [Vite 文档](https://vitejs.dev/) | 下一代前端构建工具 |
| [Turborepo](https://turbo.build/repo) | 高性能构建系统 |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-First CSS 框架 |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

请阅读 [贡献指南](./CONTRIBUTING.md) 了解如何参与项目开发。

---

## 📄 许可证

MIT License

---

<p align="center">
  用 ❤️ 打造，为每个中台项目提供坚实底座
</p>

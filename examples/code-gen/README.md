# 代码生成示例

本目录包含云枢中台代码生成器的使用示例。

## 目录结构

```
code-gen/
├── src/
│   ├── generators/    # 生成器
│   ├── templates/    # 模板文件
│   └── README.md
└── README.md
```

## 生成器配置

### CLI 配置

```json
{
  "generators": {
    "api": {
      "template": "./templates/api.hbs",
      "output": "./src/api/modules/{{module}}.api.ts"
    },
    "view": {
      "template": "./templates/view.vue.hbs",
      "output": "./src/views/{{module}}/{{name}}.vue"
    },
    "types": {
      "template": "./templates/types.hbs",
      "output": "./src/types/{{module}}.ts"
    }
  }
}
```

## 模板变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `{{module}}` | 模块名称 | user, role, menu |
| `{{name}}` | 名称（PascalCase） | UserList, UserEdit |
| `{{name kebabCase}}` | 名称（kebab-case） | user-list, user-edit |
| `{{name camelCase}}` | 名称（camelCase） | userList, userEdit |
| `{{fields}}` | 字段列表 | - |
| `{{primaryKey}}` | 主键字段 | id |
| `{{timestamp}}` | 时间戳 | 2024-01-01 |

## 生成示例

### 1. 生成 API 模块

```bash
# 使用 CLI 生成 API
pnpm gen api user --fields "id,username,email,status,createTime"
```

**生成结果：**

```typescript
// src/api/modules/user.api.ts
import { http } from '@/utils/http';
import type { IUser, IUserQuery } from '@/types/user';

export const UserApi = {
  /** 获取用户列表 */
  list: (params: IUserQuery) =>
    http.get<IUser[]>('/users', { params }),

  /** 获取用户详情 */
  getById: (id: string) =>
    http.get<IUser>(`/users/${id}`),

  /** 创建用户 */
  create: (data: Partial<IUser>) =>
    http.post<IUser>('/users', data),

  /** 更新用户 */
  update: (id: string, data: Partial<IUser>) =>
    http.put<IUser>(`/users/${id}`, data),

  /** 删除用户 */
  delete: (id: string) =>
    http.delete<void>(`/users/${id}`),
};
```

### 2. 生成视图页面

```bash
# 生成列表页
pnpm gen view user UserList --type list

# 生成编辑页
pnpm gen view user UserEdit --type edit

# 生成详情页
pnpm gen view user UserDetail --type detail
```

**列表页生成结果：**

```vue
<!-- src/views/user/UserList.vue -->
<template>
  <div class="user-list">
    <div class="toolbar">
      <YunButton type="primary" @click="handleCreate">
        {{ t('system.user.create') }}
      </YunButton>
    </div>

    <YunTable :data="tableData" :loading="loading" :columns="columns">
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
import { ref, onMounted } from 'vue';
import { useI18n } from '@yunshu/ui';
import { UserApi } from '@/api/modules/user.api';

const { t } = useI18n();
const loading = ref(false);
const tableData = ref([]);

const columns = [
  { prop: 'username', label: '用户名' },
  { prop: 'email', label: '邮箱' },
  { slot: 'status', label: '状态' },
  { slot: 'action', label: '操作' },
];

onMounted(() => {
  loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    const { data } = await UserApi.list({ page: 1, pageSize: 10 });
    tableData.value = data.list;
  } finally {
    loading.value = false;
  }
};

const handleCreate = () => {
  // TODO: 跳转到创建页面
};

const handleEdit = (row: any) => {
  // TODO: 跳转到编辑页面
};

const handleDelete = async (row: any) => {
  // TODO: 删除确认并调用 API
};
</script>
```

### 3. 生成类型定义

```bash
# 生成类型
pnpm gen types user --fields "id:string,username:string,email:string,status:number,createTime:date"
```

**生成结果：**

```typescript
// src/types/user.ts

/*** 用户状态 */
export enum UserStatus {
  Disabled = 0,
  Enabled = 1,
}

/*** 用户信息 */
export interface IUser {
  /** 用户 ID */
  id: string;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 状态 */
  status: UserStatus;
  /** 创建时间 */
  createTime: Date;
}

/*** 用户查询参数 */
export interface IUserQuery {
  page?: number;
  pageSize?: number;
  username?: string;
  status?: UserStatus;
}

/*** 创建用户参数 */
export interface IUserCreate {
  username: string;
  email: string;
  password?: string;
  status?: UserStatus;
}

/*** 更新用户参数 */
export interface IUserUpdate {
  username?: string;
  email?: string;
  status?: UserStatus;
}
```

## 自定义模板

### 创建自定义 API 模板

```handlebars
// templates/custom-api.hbs
import { http } from '@/utils/http';
import type { I{{name}}, I{{name}}Query } from '@/types/{{kebabCase module}}';

{{#each fields}}
/** {{comment}} */
export interface I{{name}}{{#each ../fields}}{{/each}} {
{{/each}}

export const {{name}}Api = {
  list: (params: I{{name}}Query) =>
    http.get<I{{name}}[]>('/{{kebabCase module}}', { params }),

  getById: (id: string) =>
    http.get<I{{name}}>(`/{{kebabCase module}}/${id}`),

  create: (data: Partial<I{{name}}>) =>
    http.post<I{{name}}>('/{{kebabCase module}}', data),

  update: (id: string, data: Partial<I{{name}}>) =>
    http.put<I{{name}}>(`/{{kebabCase module}}/${id}`, data),

  delete: (id: string) =>
    http.delete<void>(`/{{kebabCase module}}/${id}`),
};
```

### 创建自定义视图模板

```handlebars
// templates/custom-view.hbs
<template>
  <div class="{{kebabCase name}}">
    <YunPageHeader :title="t('{{module}}.{{kebabCase name}}.title')" @back="handleBack">
      <template #extra>
        <YunButton @click="handleReset">{{ t('common.reset') }}</YunButton>
        <YunButton type="primary" :loading="saving" @click="handleSubmit">
          {{ t('common.save') }}
        </YunButton>
      </template>
    </YunPageHeader>

    <YunCard>
      <YunForm :model="form" :rules="rules" label-width="120px">
        {{#each fields}}
        <YunFormItem label="{{comment}}" prop="{{camelCase name}}">
          <YunInput v-model="form.{{camelCase name}}" placeholder="请输入{{comment}}" />
        </YunFormItem>
        {{/each}}
      </YunForm>
    </YunCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from '@yunshu/ui';
import { {{name}}Api } from '@/api/modules/{{kebabCase module}}.api';
import { useRoute, useRouter } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const saving = ref(false);
const form = reactive({
  {{#each fields}}
  {{camelCase name}}: undefined,
  {{/each}}
});

const rules = {
  {{#each fields}}
  {{camelCase name}}: [{ required: {{required}}, message: '{{t 'common.required'}}', trigger: 'blur' }],
  {{/each}}
};

onMounted(() => {
  const id = route.params.id;
  if (id) {
    loadData(id);
  }
});

const loadData = async (id: string) => {
  const { data } = await {{name}}Api.getById(id);
  Object.assign(form, data);
};

const handleSubmit = async () => {
  // TODO: 提交表单
};

const handleReset = () => {
  // TODO: 重置表单
};

const handleBack = () => {
  router.back();
};
</script>
```

## 使用 Generator API

```typescript
// src/tools/generator.ts
import { Generator } from '@yunshu/cli';

const generator = new Generator({
  templates: './templates',
  output: './src',
});

await generator.generate('api', {
  module: 'user',
  fields: [
    { name: 'id', type: 'string', comment: '用户ID' },
    { name: 'username', type: 'string', comment: '用户名', required: true },
    { name: 'email', type: 'string', comment: '邮箱', required: true },
  ],
});
```

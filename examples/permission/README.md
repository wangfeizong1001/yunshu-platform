# 权限示例

本目录包含云枢中台权限管理的使用示例。

## 目录结构

```
permission/
├── src/
│   ├── directives/  # 权限指令示例
│   ├── guards/      # 路由守卫示例
│   ├── api/         # 权限 API 示例
│   └── README.md
└── README.md
```

## 权限指令

### v-permission 指令

```typescript
// src/directives/permission.ts
import type { Directive } from 'vue';

export const permissionDirective: Directive = {
  mounted(el, binding) {
    const { value } = binding;
    const permissions = getUserPermissions();

    if (value && !permissions.includes(value)) {
      el.parentNode?.removeChild(el);
    }
  },
};

// 使用方式
// <YunButton v-permission="'user:create'">创建用户</YunButton>
```

### v-if-permission 指令

```typescript
// 显示/隐藏模式
// <YunButton v-if-permission="'user:delete'">删除</YunButton>
```

## 路由守卫

### 权限验证

```typescript
// src/router/guards/permission.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { getRoutePermissions } from '@/utils/permission';

export async function permissionGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const userStore = useUserStore();

  // 获取路由所需的权限
  const requiredPermission = to.meta.permission;

  // 检查用户是否有权限
  if (requiredPermission && !userStore.hasPermission(requiredPermission)) {
    // 无权限，跳转到 403 页面
    next({ name: 'Forbidden' });
    return;
  }

  next();
}
```

### 角色验证

```typescript
// src/router/guards/role.ts
export async function roleGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const userStore = useUserStore();
  const requiredRoles = to.meta.roles as string[] | undefined;

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = requiredRoles.some(role => 
      userStore.roles.includes(role)
    );
    
    if (!hasRole) {
      next({ name: 'Forbidden' });
      return;
    }
  }

  next();
}
```

## API 示例

### 获取用户权限

```typescript
// src/api/modules/auth.api.ts
import { http } from '@/utils/http';
import type { IUser, ILoginParams } from '@yunshu/shared';

export const AuthApi = {
  login: (params: ILoginParams) =>
    http.post<{ token: string; user: IUser }>('/auth/login', params),

  getPermissions: () =>
    http.get<string[]>('/auth/permissions'),

  getUserInfo: () =>
    http.get<IUser>('/users/me'),
};
```

### 权限检查 Hook

```typescript
// src/composables/usePermission.ts
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

export function usePermission() {
  const userStore = useUserStore();

  const permissions = computed(() => userStore.permissions);
  const roles = computed(() => userStore.roles);

  const hasPermission = (permission: string): boolean => {
    return permissions.value.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    return roles.value.includes(role);
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some(p => permissions.value.includes(p));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every(p => permissions.value.includes(p));
  };

  return {
    permissions,
    roles,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
  };
}
```

### 在组件中使用

```vue
<template>
  <div>
    <!-- 使用 Hook 检查权限 -->
    <YunButton 
      v-if="hasPermission('user:create')" 
      type="primary"
      @click="handleCreate"
    >
      创建用户
    </YunButton>

    <!-- 批量权限检查 -->
    <YunButton 
      v-if="hasAnyPermission(['user:edit', 'user:admin'])" 
      @click="handleEdit"
    >
      编辑
    </YunButton>
  </div>
</template>

<script setup>
import { usePermission } from '@/composables/usePermission';

const { hasPermission, hasAnyPermission } = usePermission();
</script>
```

## 数据权限

### 数据范围枚举

```typescript
// 数据权限范围
export enum DataScope {
  ALL = 1,           // 全部数据
  CUSTOM = 2,        // 自定义数据
  DEPT = 3,          // 本部门数据
  DEPT_AND_CHILD = 4, // 本部门及以下数据
  SELF = 5,          // 仅本人数据
}
```

### 使用数据权限

```typescript
// 获取带有数据权限的列表
const loadDataWithScope = async () => {
  const params = {
    page: 1,
    pageSize: 10,
    // 后端会根据用户的数据权限自动过滤数据
  };
  
  const { data } = await UserApi.list(params);
  return data;
};
```

## 权限配置

### 角色配置

```typescript
// 角色权限配置
const rolePermissions = {
  admin: [
    '*', // 最高管理员，拥有所有权限
  ],
  userManager: [
    'user:list',
    'user:view',
    'user:create',
    'user:edit',
    'role:list',
    'role:view',
  ],
  viewer: [
    'user:list',
    'user:view',
    'role:list',
    'role:view',
  ],
};
```

### 菜单权限配置

```typescript
// 菜单与权限绑定
const menuPermissions = [
  {
    path: '/system/user',
    name: 'SystemUser',
    meta: {
      title: '用户管理',
      permission: 'user:list',
    },
  },
  {
    path: '/system/role',
    name: 'SystemRole',
    meta: {
      title: '角色管理',
      permission: 'role:list',
    },
  },
];
```

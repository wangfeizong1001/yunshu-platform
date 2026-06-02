# 权限设计

云枢中台推荐使用 **RBAC（基于角色的访问控制）** 模型。

## 后端

`@yunshu/server-express` 提供了完整的认证授权中间件工厂：

```typescript
import { createAuthMiddleware, createRoleMiddleware, requireAdmin } from '@yunshu/server-express';

// JWT 认证
router.use(createAuthMiddleware(tokenVerifier, userLookup));

// 角色鉴权
router.delete('/users/:id', requireAdmin(), handler);
```

## 前端

前端通过路由守卫 + 指令实现权限控制：

```typescript
// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next('/login');
  } else {
    next();
  }
});
```

## 权限模型

```
角色 (Role)
  ├── super_admin  → 全部权限
  ├── admin        → 管理权限
  └── user         → 基础权限

权限 (Permission)
  ├── user:read    → 查看用户
  ├── user:write   → 编辑用户
  └── user:delete  → 删除用户
```

详见：[认证中间件](/server/middlewares)

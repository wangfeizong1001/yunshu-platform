# 中间件

`@yunshu/server-express` 提供丰富的中间件。

## 认证中间件

```typescript
import { createAuthMiddleware } from '@yunshu/server-express';

router.use(createAuthMiddleware(tokenVerifier, userLookup));
```

## 角色鉴权

```typescript
import { createRoleMiddleware, requireAdmin } from '@yunshu/server-express';

router.get('/admin', requireAdmin(), handler);
router.get('/manage', createRoleMiddleware(['admin', 'manager']), handler);
```

## 错误处理

```typescript
import { asyncHandler, notFoundHandler, globalErrorHandler } from '@yunshu/server-express';

// 包装异步路由
router.get('/users', asyncHandler(async (req, res) => { ... }));

// 404
app.use(notFoundHandler());

// 全局错误（必须最后）
app.use(globalErrorHandler());
```

## 限流

```typescript
import { rateLimitHandler } from '@yunshu/server-express';
app.use('/api', rateLimitHandler());
```

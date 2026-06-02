# 中间件

API 客户端支持可插拔的中间件体系。

## 认证中间件

```typescript
import { createAuthMiddleware } from '@yunshu/api-client';

const auth = createAuthMiddleware({
  getToken: () => localStorage.getItem('token'),
  refreshToken: async () => {
    const res = await fetch('/api/auth/refresh');
    return res.ok ? (await res.json()).token : null;
  },
  onRefreshFailed: () => router.push('/login'),
});
```

## 可用中间件

| 中间件 | 说明 |
|--------|------|
| `createAuthMiddleware` | Bearer Token + 401 自动刷新 |
| `createDedupMiddleware` | GET 请求去重 |
| `createCacheMiddleware` | 响应内存缓存 |
| `createRetryMiddleware` | 指数退避重试 |
| `createLoggingMiddleware` | 请求日志 |

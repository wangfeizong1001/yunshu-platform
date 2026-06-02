# 错误体系

云枢后端提供 22 种标准化错误码 + 全局错误处理。

## BusinessError

```typescript
import { BusinessError, ErrorCode } from '@yunshu/server-core';

throw new BusinessError(ErrorCode.NOT_FOUND, '用户不存在');
// → HTTP 404: { success: false, errorCode: "NOT_FOUND" }
```

## 错误码列表

| 错误码 | HTTP | 说明 |
|--------|------|------|
| `NOT_FOUND` | 404 | 资源不存在 |
| `ALREADY_EXISTS` | 409 | 已存在 |
| `VALIDATION_ERROR` | 400 | 参数验证失败 |
| `UNAUTHORIZED` | 401 | 未认证 |
| `TOKEN_EXPIRED` | 401 | Token 过期 |
| `FORBIDDEN` | 403 | 权限不足 |
| `DATABASE_ERROR` | 500 | 数据库错误 |
| `LIMIT_EXCEEDED` | 429 | 超出限制 |

## 全局错误处理

`globalErrorHandler()` 自动处理：
- BusinessError → 对应 HTTP 状态码
- MongoDB (E11000/Validation/Cast) → 友好提示
- JWT (过期/无效) → 401
- 文件上传 (Multer) → 413/400
- 未知错误 → 500 (生产环境脱敏)

# 错误处理

云枢中台提供**全类型错误处理体系**，覆盖前端 API 调用和后端服务层。

## 前端错误处理

`@yunshu/api-client` 的 `RequestError` 提供类型化错误：

```typescript
import { RequestError } from '@yunshu/api-client';

try {
  await userApi.getById('123');
} catch (error) {
  if (error instanceof RequestError) {
    console.log('HTTP 状态码:', error.status);
    console.log('业务错误码:', error.code);
  }
}
```

## 后端错误处理

`BusinessError` 提供 22 种标准化错误码：

```typescript
import { BusinessError, ErrorCode } from '@yunshu/server-core';

throw new BusinessError(ErrorCode.NOT_FOUND, '用户不存在');
// → HTTP 404: { success: false, errorCode: "NOT_FOUND", message: "用户不存在" }
```

## 全局错误中间件

`globalErrorHandler()` 自动处理所有错误类型：

- ✅ BusinessError → 对应 HTTP 状态码
- ✅ PostgreSQL 错误（23505/23503/23502/22P02/Validation）
- ✅ JWT 错误（过期/无效）
- ✅ 文件上传错误（Multer）
- ✅ 未知错误 → 500（生产环境脱敏）

详见：[BusinessError 详解](/server/errors) | [BaseController 响应方法](/server/base-controller)

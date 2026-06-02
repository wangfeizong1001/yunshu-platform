# BaseController

`BaseController` 提供统一的 API 响应方法。

## 使用

```typescript
import { BaseController } from '@yunshu/server-express';

class UserController extends BaseController {
  async getUser(req, res) {
    const user = await userService.findById(req.params.id);
    return this.success(res, user);
  }
}
```

## 响应方法

| 方法 | HTTP 状态 | 说明 |
|------|-----------|------|
| `success(res, data, message?)` | 200 | 成功响应 |
| `created(res, data)` | 201 | 创建成功 |
| `noContent(res)` | 204 | 无内容 |
| `paginate(res, result)` | 200 | 分页响应 |
| `error(res, error)` | 自动 | 错误响应 |

## 便捷错误方法

`badRequest()` / `unauthorized()` / `forbidden()` / `notFound()` / `conflict()` / `serverError()`

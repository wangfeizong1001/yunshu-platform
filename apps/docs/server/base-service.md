# BaseService

`BaseService` 是框架无关的 CRUD 服务基类。

## 使用

```typescript
import { BaseService } from '@yunshu/server-core';

class UserService extends BaseService<UserModel, IUser, CreateUserDTO, UpdateUserDTO> {
  constructor() {
    super(UserModel, {
      entityName: '用户',
      softDelete: true, // 启用软删除
    });
  }

  async findByEmail(email: string) {
    return this.findOne({ email });
  }
}
```

## 内置方法

| 方法 | 说明 |
|------|------|
| `findById(id)` | 根据 ID 查找 |
| `findAll(query?)` | 查找全部 |
| `create(data)` | 创建 |
| `update(id, data)` | 更新 |
| `delete(id)` | 删除（支持软删除） |
| `findWithPagination(params)` | 安全分页查询 |
| `count(query?)` | 统计数量 |
| `exists(id)` | 检查是否存在 |
| `restore(id)` | 恢复软删除 |

## 返回值

所有方法统一返回 `ServiceResult<T>` 格式，不直接操作 HTTP Response。

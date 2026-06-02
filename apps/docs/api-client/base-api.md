# BaseAPI

`BaseAPI` 提供标准 CRUD 操作的基础实现。

## 使用

```typescript
import { BaseAPI, HttpClient } from '@yunshu/api-client';

interface User {
  id: string;
  name: string;
  email: string;
}

class UserAPI extends BaseAPI<User> {
  protected endpoint = '/users';

  // 自定义方法
  async findByEmail(email: string) {
    return this.getList({ email });
  }
}

const userApi = new UserAPI(httpClient);
await userApi.getList({ page: 1, limit: 10 });
await userApi.getById('123');
await userApi.create({ name: '张三', email: 'zhang@test.com' });
```

## 内置方法

| 方法 | 说明 |
|------|------|
| `getList(params?)` | 获取分页列表 |
| `getById(id)` | 根据 ID 获取 |
| `create(data)` | 创建 |
| `update(id, data)` | 更新 |
| `patch(id, data)` | 部分更新 |
| `delete(id)` | 删除 |
| `batchDelete(ids)` | 批量删除 |
| `batchCreate(data)` | 批量创建 |
| `count(params?)` | 获取总数 |
| `exists(id)` | 检查是否存在 |

# Vue 3 集成

`@yunshu/api-client/vue` 提供 Vue 3 Composition API 集成。

## 插件

```typescript
// main.ts
import { createYunshuAPI } from '@yunshu/api-client/vue';
app.use(createYunshuAPI({ httpClient }));
```

## Hooks

### useApi — 通用请求

```typescript
const { data, loading, error, execute } = useApi(
  (id: string) => userApi.getById(id)
);

await execute('user-123');
```

### useApiList — 列表请求

```typescript
const { data, total, loading, setPage, hasMore } = useApiList(
  (params) => userApi.getList(params)
);
```

### useMutation — 写操作

```typescript
const { mutate, loading } = useMutation(
  (data) => userApi.create(data)
);

await mutate({ name: '新用户' });
```

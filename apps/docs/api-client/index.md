# API 客户端

`@yunshu/api-client` 是框架无关的 HTTP 客户端，支持请求去重、缓存、Token 刷新。

## 安装

```bash
pnpm add @yunshu/api-client
```

## 核心特性

- **请求去重**：相同 GET 请求在时间窗口内只发送一次
- **内存缓存**：LRU 缓存，5 分钟默认 TTL
- **中间件**：Auth / Dedup / Cache / Retry / Logging 可插拔
- **双适配器**：Axios + Fetch，可自行扩展
- **Vue 3 集成**：useApi / useApiList / useMutation hooks

## 快速开始

```typescript
import { HttpClient, AxiosAdapter } from '@yunshu/api-client';

const http = new HttpClient(
  new AxiosAdapter({ baseURL: '/api' }),
  { cache: { enabled: true, ttl: 300000 } }
);

const { data } = await http.get('/users', { page: 1 });
```

# HttpClient

`HttpClient` 是框架无关的 HTTP 请求客户端核心。

## 构造

```typescript
const http = new HttpClient(adapter, {
  baseURL: '/api',       // 基础 URL
  timeout: 15000,        // 超时（毫秒）
  headers: {},           // 默认请求头
  dedup: { window: 1000 }, // 去重窗口
  cache: { enabled: true, ttl: 300000 }, // 缓存
});
```

## 方法

| 方法 | 说明 |
|------|------|
| `get<T>(url, params?, cacheOptions?)` | GET 请求（带缓存和去重） |
| `post<T>(url, data?)` | POST 请求 |
| `put<T>(url, data?)` | PUT 请求 |
| `patch<T>(url, data?)` | PATCH 请求 |
| `delete<T>(url)` | DELETE 请求 |
| `upload<T>(url, file, options?)` | 文件上传 |

## 缓存管理

```typescript
http.clearCache();             // 清除所有缓存
http.clearCacheByPrefix('/users'); // 按前缀清除
http.removeCache('key');       // 删除指定缓存
```

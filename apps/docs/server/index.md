# 后端基础设施

云枢中台的后端包提供了生产级的基础设施，支持 Express 开箱即用。

## 包结构

| 包 | 说明 |
|----|------|
| `@yunshu/server-core` | 框架无关核心 — BaseService + BusinessError + 装饰器 |
| `@yunshu/server-express` | Express 适配器 — BaseController + 全类型错误处理 + 认证中间件 |

## 安装

```bash
pnpm add @yunshu/server-core @yunshu/server-express
```

## 快速开始

```typescript
import express from 'express';
import { globalErrorHandler, notFoundHandler } from '@yunshu/server-express';

const app = express();
app.use('/api', routes);
app.use(notFoundHandler());
app.use(globalErrorHandler());
app.listen(3000);
```

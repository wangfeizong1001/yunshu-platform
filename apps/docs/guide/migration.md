# 从云枢迁移

## 概述

本指南帮助现有云枢网站导航系统用户迁移到云枢中台平台。

## 迁移路径

### 前端迁移

原云枢项目的前端代码可以直接逐步替换为 `@yunshu/ui` 组件和 `@yunshu/api-client`：

```typescript
// 原代码
import { http } from '@/utils/request';

// 迁移后
import { HttpClient, AxiosAdapter } from '@yunshu/api-client';
const client = new HttpClient(new AxiosAdapter({ baseURL: '/api' }));
```

### 后端迁移

原后端的 Service/Controller 可逐步继承 `@yunshu/server-core` 和 `@yunshu/server-express`：

```typescript
// 原代码
class UserController { ... }

// 迁移后
import { BaseController } from '@yunshu/server-express';
class UserController extends BaseController { ... }
```

## 兼容性

云枢中台的设计令牌系统完全兼容原项目的 SCSS 主题变量。

详见：[快速开始](./quick-start)

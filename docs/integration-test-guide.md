# 云枢中台 — 集成测试指南

## 快速开始

### 运行全部测试

```bash
pnpm install
pnpm run test:all
```

### 按模块运行测试

```bash
# 前端单元测试
pnpm --filter @yunshu/admin test

# 后端单元测试
pnpm --filter @yunshu/server-express test

# 安全工具测试（重点）
pnpm --filter @yunshu/admin test -- security
```

## 测试范围

### 1. 认证与登录

| 场景 | 测试用例 | 优先级 |
|------|---------|--------|
| 正常登录 | 正确用户名密码 → 返回 Token | P0 |
| 密码错误 | 错误密码 → 认证失败 | P0 |
| Token 过期 | 过期 Token → 登出 | P0 |
| 未授权访问 | 未登录访问受保护接口 → 401 | P0 |
| 权限不足 | 无权限访问 → 403 | P1 |
| CSRF 防护 | 缺少 CSRF Token → 拒绝 | P1 |

### 2. 权限控制

| 场景 | 测试用例 | 优先级 |
|------|---------|--------|
| 菜单权限 | 不同角色看到不同菜单 | P0 |
| 按钮权限 | 无权限按钮不可见/不可用 | P1 |
| 路由权限 | 无权限路由重定向 | P1 |
| 数据权限 | 不同租户数据隔离 | P0 |

### 3. API 响应格式

| 场景 | 测试用例 | 优先级 |
|------|---------|--------|
| 统一响应格式 | `{ success, data, message, errorCode }` | P0 |
| 错误响应格式 | 错误时 `success=false` + `errorCode` | P0 |
| 分页响应格式 | `{ rows, total }` | P1 |

### 4. 安全测试

| 场景 | 测试用例 | 优先级 |
|------|---------|--------|
| XSS 防护 | 富文本内容清洗 | P0 |
| SQL 注入 | 参数化查询正确使用 | P0 |
| 速率限制 | 登录接口防暴力破解 | P1 |
| 文件上传 | 文件类型/大小限制 | P1 |
| Token 存储 | Cookie (HttpOnly/Secure/SameSite) | P0 |

### 5. 文件上传

| 场景 | 测试用例 | 优先级 |
|------|---------|--------|
| 图片上传 | PNG/JPG/GIF/WEBP 正常上传 | P0 |
| 文档上传 | PDF/DOC/XLS 正常上传 | P1 |
| 大小限制 | 超过 10MB 拒绝 | P0 |
| 类型限制 | 可执行文件/危险文件拒绝 | P0 |
| 魔数校验 | 扩展名伪造拦截 | P1 |

## 类型检查

### 运行类型检查

```bash
# 前端
pnpm --filter @yunshu/admin exec vue-tsc --noEmit

# 后端
pnpm --filter @yunshu/server-express exec tsc --noEmit
```

### any 类型规范

- **禁止**：业务代码（`src/views/`, `src/api/`, `src/store/`）中使用 any
- **允许**：测试文件（`__tests__/`）、mock 数据文件
- **例外**：第三方库集成时需显式标注 `// eslint-disable-next-line @typescript-eslint/no-explicit-any`

## CI/CD 流程

每次提交/PR 自动运行：

1. ✅ TypeScript 类型检查（strict 模式）
2. ✅ ESLint 代码检查
3. ✅ 单元测试（Vitest）
4. ✅ 前端构建（vite build）

失败将阻止 PR 合并。

## 测试数据

测试账号：
- 管理员：`admin / admin123`（仅测试环境）
- 普通用户：`user / user123`（仅测试环境）

## 手动测试清单

每次发布前验证：

- [ ] 登录/登出流程正常
- [ ] 菜单/路由权限正常
- [ ] 用户 CRUD 正常
- [ ] 角色权限分配正常
- [ ] 文件上传/下载正常
- [ ] 表格/列表分页正常
- [ ] 搜索/筛选功能正常
- [ ] 响应式布局正常（桌面/平板/移动）
- [ ] 深色/浅色模式切换正常
- [ ] 表单校验正常（必填/格式/长度）

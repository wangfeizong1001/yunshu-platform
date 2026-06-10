# 安全策略

云枢中台项目高度重视应用安全。本文档描述了我们的安全策略、漏洞报告流程和安全最佳实践。

---

## 一、支持的版本

以下版本正在持续接收安全更新：

| 版本 | 发布日期 | 支持状态 | 说明 |
|------|---------|---------|------|
| 0.2.x | 2025-06-09 | ✅ 积极支持 | 最新功能分支，包含所有安全补丁 |
| 0.1.x | 2025-01-08 | ⚠️ 关键漏洞修复 | 仅修复严重安全漏洞 |
| < 0.1 | - | ❌ 不再支持 | 建议立即升级 |

---

## 二、报告安全漏洞

### 2.1 报告流程

**⚠️ 请不要公开报告未公开的安全漏洞。**

如发现安全漏洞，请通过以下方式报告：

1. **优先方式（推荐）**：通过 GitHub Security Advisory 私密提交
   - 访问：https://github.com/wangfeizong1001/yunshu-platform/security/advisories/new
   - 选择 "Report a vulnerability"
   - 详细描述漏洞复现步骤和影响范围

2. **邮件方式**：发送加密邮件至项目维护者邮箱
   - 请在邮件中包含：漏洞描述、复现步骤、影响评估、修复建议（如有）
   - 可提供 PGP 公钥请求加密通信

### 2.2 响应时间

| 严重等级 | 响应时间 | 修复时间目标 |
|---------|---------|-------------|
| 严重 (Critical) | 24 小时内 | 7 天 |
| 高 (High) | 48 小时内 | 14 天 |
| 中 (Medium) | 72 小时内 | 30 天 |
| 低 (Low) | 5 个工作日 | 90 天 |

### 2.3 漏洞处理流程

```
报告接收 → 验证确认 → 影响评估 → 优先级分配 →
修复开发 → 代码审查 → 测试验证 → 发布补丁 → 公开披露
```

### 2.4 披露政策

- 在安全补丁发布前，漏洞细节将保持私密
- 补丁发布后，将在 CHANGELOG 中披露漏洞信息（可能延迟 7-30 天以允许用户升级）
- 安全相关提交将使用 `security:` 前缀
- 感谢报告者时会在安全公告中提及（如报告者同意）

---

## 三、已内置的安全措施

### 3.1 前端安全

| 措施 | 说明 | 位置 |
|------|------|------|
| ✅ 认证拦截器 | 自动处理 Token 过期和重新认证 | `apps/admin/src/utils/http.ts` |
| ✅ XSS 防护 | DOMPurify HTML 清洗、Vue 默认转义 | `apps/admin/src/utils/security/sanitize.ts` |
| ✅ 安全存储 | Token 存储在 localStorage，支持 secure cookie | `apps/admin/src/utils/security/auth.ts` |
| ✅ HTTPS 强制 | 生产环境配置 Strict-Transport-Security | `DEPLOY.md` |
| ✅ CSP 支持 | 内容安全策略配置 | `DEPLOY.md` |
| ✅ 权限路由守卫 | 未认证用户自动重定向至登录页 | `apps/admin/src/router/` |
| ✅ 按钮级权限检查 | v-permission 指令细粒度控制 | `apps/admin/src/utils/permission.ts` |
| ✅ 敏感数据脱敏 | 密码、Token 等敏感字段不输出到日志 | - |

### 3.2 请求安全

| 措施 | 说明 |
|------|------|
| ✅ Bearer Token 认证 | 所有 API 请求携带 JWT 令牌 |
| ✅ CSRF 保护 | 需在后端配置（参考后端文档） |
| ✅ HTTP 安全头 | 建议在 Nginx 配置完整的安全响应头 |
| ✅ 上传文件校验 | 文件类型、大小、扩展名多重校验 | `apps/admin/src/utils/security/` |

### 3.3 后端安全

| 措施 | 说明 | 位置 |
|------|------|------|
| ✅ 请求限流 | 基于 IP 的速率限制，防止暴力攻击 | `packages/server-express/src/middlewares/` |
| ✅ 上传安全 | 文件类型白名单、魔数校验、大小限制 | `packages/server-express/src/middlewares/uploadGuard.ts` |
| ✅ JWT 认证 | 无状态 Token，支持吊销机制 | - |
| ✅ 结构化日志 | Winston + Loki 集中收集 | `packages/server-core/src/` |
| ✅ 密码哈希 | 使用 bcrypt/scrypt（后端实现） | - |
| ✅ 输入验证 | Zod 运行时类型校验 | - |

---

## 四、配置安全最佳实践

### 4.1 环境变量配置

**⚠️ 永远不要提交真实密钥到 Git 仓库。**

```bash
# 以下是必须修改的默认值（生产环境）：

# JWT 密钥 - 必须至少 32 个字符的随机字符串
JWT_SECRET=change-me-to-a-long-random-secret-key-at-least-32-chars

# Redis 密码（如启用认证）
REDIS_PASSWORD=your-strong-redis-password

# Session 密钥（如使用会话）
SESSION_SECRET=another-long-random-string

# 数据库密码
DATABASE_PASSWORD=your-database-password
```

### 4.2 生成安全密钥

```bash
# 方法一：使用 openssl
openssl rand -hex 32

# 方法二：使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 方法三：使用 pwgen
pwgen -s 64 1
```

### 4.3 .env.example 原则

- 模板中使用占位符而非真实值
- 包含明确的注释说明
- 列出所有必需的配置项
- 标明默认值是否安全

---

## 五、依赖安全

### 5.1 依赖审计

```bash
# 审计所有依赖漏洞
pnpm audit

# 仅显示高严重级别漏洞
pnpm audit --audit-level high

# 尝试自动修复可修复的漏洞
pnpm audit --fix

# 使用 pnpm dedupe 减少重复依赖
pnpm dedupe
```

### 5.2 自动化扫描

- CI 流水线自动运行 `pnpm audit`
- GitHub Dependabot 每周扫描依赖更新
- 安全更新在 CHANGELOG 中以 `[Security]` 标签标识

### 5.3 第三方依赖安全建议

| 依赖 | 说明 |
|------|------|
| Vue 3.x | 使用官方最新稳定版本，及时修复安全补丁 |
| Element Plus | 跟随官方安全公告 |
| Axios | 避免 SSRF，配置正确的 URL 白名单 |
| Pinia | 避免在 store 中存储敏感明文 |
| DOMPurify | 始终保持最新版本（XSS 防护核心） |

---

## 六、安全编码规范

开发人员在编写代码时应遵循以下原则：

### 6.1 输入验证

```typescript
// ✅ 使用白名单验证
function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// ✅ 使用类型系统
interface UserInput {
  username: string;
  email: string;
}

// ❌ 避免信任任何外部输入
// const data = JSON.parse(unsanitizedInput);
```

### 6.2 输出编码

```typescript
// ✅ 使用 DOMPurify 处理用户生成的 HTML
import { sanitize } from '@/utils/security/sanitize';

const safeHtml = sanitize(userProvidedHtml);
document.getElementById('content')!.innerHTML = safeHtml;

// ✅ 动态渲染使用 Vue 模板自动转义
// <div>{{ userProvidedText }}</div>
```

### 6.3 敏感数据处理

```typescript
// ✅ 不在日志中输出敏感信息
logger.info({ userId: user.id, action: 'login' }, '用户登录');
// logger.info(`用户登录: ${JSON.stringify(user)}`); // ❌ 避免

// ✅ 在错误消息中不暴露内部实现细节
throw new AppError('认证失败', 401); // ✅
// throw new Error(`SQL错误: ${sql}`); // ❌
```

### 6.4 文件上传安全

```typescript
// ✅ 白名单验证 MIME 类型
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('不支持的文件类型');
}

// ✅ 限制文件大小
const maxSize = 5 * 1024 * 1024; // 5MB
if (file.size > maxSize) {
  throw new Error('文件过大');
}

// ✅ 使用安全的文件名（路径遍历攻击防护）
const safeFileName = sanitize(file.name);
```

---

## 七、安全公告

重大安全问题将在以下位置发布：

1. GitHub Security Advisories: https://github.com/wangfeizong1001/yunshu-platform/security/advisories
2. CHANGELOG.md（标记 `[Security]`）
3. 项目 README 的安全章节

---

## 八、安全测试

建议在部署前进行以下测试：

```bash
# 运行项目测试
pnpm test

# 依赖安全审计
pnpm audit

# 构建并检查产物
pnpm build

# 运行 Playwright E2E（如配置）
pnpm exec playwright test
```

---

## 九、已知安全限制

- **开发模式**：`VITE_ENABLE_MOCK=true` 时使用的 Mock 数据绕过真实后端认证，**禁止在生产中启用**
- **本地存储**：Token 存储在 localStorage，存在 XSS 攻击风险，需配合严格 CSP 使用
- **WebSocket**：如启用 WebSocket 需独立配置认证（默认未启用）

---

## 十、致谢

感谢所有为云枢中台项目安全做出贡献的安全研究员和开发人员。我们致力于及时响应所有合法的漏洞报告，并与安全社区保持良好合作。

---

**最后更新**: 2025-06-09
**文档版本**: v1.0

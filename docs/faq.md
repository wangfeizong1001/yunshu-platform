# 常见问题 FAQ

本文件汇总云枢中台的常见问题及解决方案。

---

## 🚀 安装与启动

### Q1: 安装依赖时卡在 fetchMetadata 或卡住不动

**问题描述**: 运行 `pnpm install` 时，长时间卡在依赖下载阶段。

**解决方案**:

```bash
# 方案一：切换到国内镜像
pnpm config set registry https://registry.npmmirror.com
pnpm install

# 方案二：清理缓存后重试
pnpm store prune
pnpm install

# 方案三：使用离线模式（如有缓存）
pnpm install --offline
```

### Q2: 启动报错 "Cannot find module '@yunshu/shared'"

**问题描述**: 启动开发服务器时，找不到内部包。

**原因: `@yunshu/*` 包的类型声明文件未生成。

**解决方案**:

```bash
# 先构建共享包
pnpm build --filter=@yunshu/shared
pnpm build --filter=@yunshu/api-client

# 然后重新启动
pnpm dev --filter=@yunshu/admin
```

### Q3: 启动后页面空白

**问题描述**: 浏览器打开 http://localhost:5173 后页面空白。

**原因一: Vite 缓存问题。

**解决方案**:

```bash
# 清理 Vite 缓存
rm -rf apps/admin/node_modules/.vite

# 重新启动
pnpm dev --filter=@yunshu/admin
```

**原因二**: 路由配置问题。

**解决方案**: 检查浏览器 Console 中是否有 JS 报错，路由解析失败。

### Q4: node_modules 占用空间过大？

**问题描述：

```bash
# 清理 pnpm 使用硬链接机制，可能看起来很大，但实际占用较小
# 如需清理旧版本共享存储
pnpm store path  # 查看存储路径
du -sh $(pnpm store path)

# 清理未使用的包
pnpm store prune
```

---

## 🔧 开发调试

### Q5: 如何调试前端代码？

**VS Code 配置：

1. 安装 **Volar** 扩展
2. 安装 **Debugger for Chrome** 扩展
3. 在 VS Code 中按 F5 启动调试

**浏览器调试**:
- 打开 Chrome DevTools
- Source 面板中搜索源文件
- 添加断点调试

### Q6: TypeScript 报错但代码看起来正常？

**常见类型检查命令：

```bash
# 全量类型检查
pnpm type-check

# 仅检查 admin 应用
cd apps/admin
pnpm exec vue-tsc --noEmit
```

**常见类型错误及解决：

| 错误 | 原因 | 解决 |
|-----|------|-----|
| TS7006 | 参数隐式具有 any 类型 | 添加类型注解 |
| TS2307 | 找不到模块 | 检查 import 路径是否正确，或运行 pnpm build 生成声明 |
| TS2345 | 参数类型不兼容 | 核对调用方/被调用方类型 |

### Q7: 如何查看完整的错误日志？

**前端日志**:
- 浏览器 Console 面板
- `pnpm dev` 启动的终端输出

**后端日志**:
- docker-compose logs -f backend

**结构化日志**:
- 查看 apps/admin/src/utils/security/ 下的日志

---

## 🔐 权限与认证

### Q8: Mock 数据的默认账号是什么？

**开发环境默认账号：

| 账号 | 密码 | 角色 |
|------|------|
| admin | admin123 | 超级管理员 |

### Q9: 忘记密码了怎么办？

**开发环境**: 修改 Mock 数据中的密码加密方式**:

```bash
# 查看 Mock 数据路径
vim apps/admin/src/mock/user.mock.ts

# 重置密码可在登录页面使用明文密码
```

### Q10: 如何修改 Token 过期时间？

修改配置文件：

```typescript
// apps/admin/.env.development
# Token 过期时间（秒）
# 默认 2 小时
```

---

## 🐳 Docker 相关

### Q11: Docker Compose 启动失败？

**检查端口占用**:

```bash
# 查看端口占用
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :8080  # 后端
lsof -i :80    # 前端
```

**检查容器状态**:

```bash
docker-compose ps
docker-compose logs -f [service-name]
```

### Q12: 如何进入 Docker 容器内部？

```bash
# 查看容器列表
docker-compose ps

# 进入 PostgreSQL
docker-compose exec postgres psql -U yunshu -d yunshu

# 进入 Redis
docker-compose exec redis redis-cli

# 进入后端容器
docker-compose exec backend sh
```

### Q13: 如何重置数据库？

```bash
# 停止并删除数据卷
docker-compose down -v

# 重新启动
docker-compose up -d
```

---

## 📦 构建与部署

### Q14: 生产构建失败？

**常见原因**:

1. **TypeScript 类型错误
   - 运行 `pnpm type-check` 检查
2. **ESLint 错误
   - 运行 `pnpm lint`
3. **内存不足
   - 增加 Node.js 内存：`NODE_OPTIONS="--max-old-space-size=4096" pnpm build`

**完整的清理重建流程**:

```bash
# 全量清理
rm -rf node_modules
rm -rf apps/admin/dist
rm -rf packages/*/dist
pnpm install
pnpm build --filter=@yunshu/admin
```

### Q15: 构建后如何部署？

**Nginx 部署**

```bash
# 拷贝 dist 到服务器
scp -r apps/admin/dist/* user@server:/var/www/yunshu-admin/

# Nginx 配置示例见 docs/deploy/nginx-config.md
```

**Docker 部署**

```bash
docker build -t yunshu-admin:latest .
docker run -p 80:80 yunshu-admin:latest
```

---

## 📊 性能与优化

### Q16: 前端加载慢？

**优化建议**:

1. **开启 Gzip 压缩
2. **配置 CDN
3. **图片优化
4. **路由懒加载

```bash
# 分析构建产物
pnpm build --filter=@yunshu/admin
# 查看 dist/assets 大小
ls -lh apps/admin/dist/assets/
```

### Q17: 内存占用过高？

**Node.js 内存优化**:

```bash
# 增加内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

---

## 🧪 测试相关

### Q18: 如何运行单个测试文件？

```bash
# 运行指定文件
pnpm test -- apps/admin/src/__tests__/utils/httpClient.test.ts

# 监听模式
pnpm test -- --watch

# 生成覆盖率
pnpm test:coverage
```

### Q19: E2E 测试如何运行？

```bash
# 先启动开发服务器
pnpm dev --filter=@yunshu/admin

# 新开终端运行 Playwright
pnpm exec playwright test
```

---

## 🛠️ 工具与配置

### Q20: 推荐的 VS Code 扩展？

**必装扩展**:

- Vue - Official (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- Error Lens

**推荐扩展**:

- GitLens
- Auto Rename Tag
- Path Intellisense
- CSS Navigation

**配置示例 settings.json**:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### Q21: 如何配置 ESLint/Prettier？

项目根目录已配置：
- `eslint.config.js` - ESLint 配置
- `.prettierrc` - Prettier 配置

**手动运行格式化**:

```bash
pnpm lint
pnpm format
```

---

## 📝 Git 与版本管理

### Q22: 如何处理 merge conflict？

```bash
# 拉取最新代码
git pull origin develop

# 如果有冲突，手动解决后
git add .
git commit -m "chore: resolve merge conflicts"
git push
```

### Q23: 提交代码时 Hooks 报错？

**原因**: Husky 钩子校验提交信息。

**解决**: 检查提交信息是否符合规范格式

```
feat(模块): 描述
fix(模块): 描述
docs: 文档更新
```

---

## 🌐 多语言 / 国际化

### Q24: 如何添加新语言？

```bash
# 1. 创建语言文件
# apps/admin/src/locales/<lang>/
# ├── common.ts
# ├── views/
# │   ├── system/
# │   └── ...

# 2. 在 index.ts 中注册

# 3. 在布局中切换
```

---

## 🔒 安全相关

### Q25: 安全最佳实践？

1. **生产环境必须**:
   - 禁用 console.log 和 debug 模式
   - 启用 HTTPS
   - 配置正确的 CSP

2. **前端安全**:
   - XSS 防护已内置
   - CSRF 防护
   - SQL 注入防护（后端处理）

---

## 📞 遇到其他问题？

- **GitHub Issues**: https://github.com/wangfeizong1001/yunshu-platform/issues

提交问题时请提供：

1. 环境信息（Node.js 版本、pnpm 版本、操作系统）
2. 错误截图或错误日志
3. 复现步骤
4. 预期行为 vs 实际行为

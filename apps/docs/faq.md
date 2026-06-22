# 常见问题 (FAQ)

## 安装问题

### Q: pnpm install 失败怎么办？

**A:** 检查 Node.js 版本（需要 >= 18）和 pnpm 版本（需要 >= 9）：

```bash
node --version    # 需要 >= 18
pnpm --version    # 需要 >= 9
```

如果版本过低：

```bash
# 升级 Node.js (使用 nvm)
nvm install 20
nvm use 20

# 升级 pnpm
npm install -g pnpm@9
```

### Q: 镜像源问题导致安装失败？

**A:** 切换到国内镜像：

```bash
pnpm config set registry https://registry.npmmirror.com/
```

## 启动问题

### Q: `pnpm dev` 启动后页面空白？

**A:** 检查以下几点：

1. 浏览器控制台是否有报错
2. 端口是否被占用（3000）
3. 后端服务是否启动（如使用真实 API）
4. 切换到 Mock 模式：[vite.config.ts 第 14 行](file:///workspace/apps/admin/vite.config.ts#L14) `mock: { enable: true }`

### Q: 启动时提示"Cannot find module"？

**A:** 删除 `node_modules` 和锁文件重新安装：

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## API 问题

### Q: API 请求 404？

**A:** 检查 [vite.config.ts](file:///workspace/apps/admin/vite.config.ts) 中的代理配置：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // 后端地址
      changeOrigin: true,
    },
  },
}
```

### Q: 登录接口返回 401？

**A:** 检查 token 是否正确传递。参考 [apps/admin/src/utils/auth.ts](file:///workspace/apps/admin/src/utils/auth.ts)：

```typescript
// Token 应在请求头中
request({
  url: '/api/user/info',
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
})
```

### Q: 跨域问题？

**A:** 开发环境使用 Vite 代理；生产环境使用 Nginx 代理。详细配置见 [Nginx 配置](/deploy/nginx)。

## 样式问题

### Q: 颜色硬编码报错？

**A:** 使用 CSS 变量代替硬编码：

```scss
// ❌ 错误
color: #4a9eff;

// ✅ 正确
color: var(--el-color-primary);
```

运行 `pnpm lint:style` 检查。

### Q: Element Plus 主题色如何修改？

**A:** 修改 [element-plus.scss](file:///workspace/apps/admin/src/styles/element-plus.scss)：

```scss
:root {
  --el-color-primary: #4a9eff;  // 修改这里
}
```

## 工作流问题

### Q: 流程设计器保存后数据丢失？

**A:** 确保：
1. 流程定义有 `xml` 字段
2. 后端正确接收并存储
3. 检查浏览器控制台是否有报错

### Q: 待办任务列表为空？

**A:** 检查：
1. 用户是否已登录且有任务分配
2. 后端 `/workflow/todo/page` 是否返回数据
3. 任务分配人是否正确

## 大屏设计器问题

### Q: 图表不显示数据？

**A:** 检查数据源配置：
1. 数据源类型是否正确（Mock / API）
2. API URL 是否可访问
3. 字段映射是否正确

### Q: 组件无法拖动？

**A:** 检查：
1. 组件是否被选中
2. 浏览器控制台是否有报错
3. 是否触发了 mousedown 事件

## 构建问题

### Q: `pnpm build` 失败？

**A:** 常见原因：
1. TypeScript 类型错误：运行 `pnpm type-check` 修复
2. ESLint 错误：运行 `pnpm lint` 修复
3. 资源文件缺失：检查 import 路径

### Q: 打包后页面 404？

**A:** Nginx 配置需要支持 SPA history 模式：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

详细见 [Nginx 配置](/deploy/nginx)。

## 部署问题

### Q: Docker 镜像构建失败？

**A:** 检查：
1. Dockerfile 路径是否正确
2. .dockerignore 是否排除了 node_modules
3. pnpm-lock.yaml 是否提交到仓库

### Q: CI/CD 工作流失败？

**A:** 查看 GitHub Actions 日志，常见原因：
1. pnpm 版本不匹配
2. Node.js 版本不匹配
3. 缓存未命中导致超时

## Git 问题

### Q: 合并冲突如何解决？

**A:** 使用编辑器或命令行解决冲突后：

```bash
git add .
git commit -m "merge: 解决冲突"
```

### Q: 如何回滚错误的提交？

**A:** 撤销本地未推送的提交：

```bash
git reset --soft HEAD~1
```

撤销已推送的提交（创建新提交撤销）：

```bash
git revert HEAD
git push
```

## 性能问题

### Q: 首屏加载慢？

**A:** 优化建议：
1. 路由懒加载
2. 组件按需引入
3. 静态资源 CDN 加速
4. gzip 压缩

### Q: 列表渲染卡顿？

**A:** 使用虚拟滚动：

```vue
<el-table-v2 :data="data" />
```

## 其他

### Q: 如何贡献代码？

**A:** 见 [贡献指南](/contributing)。

### Q: 如何报告 Bug？

**A:** 在 [GitHub Issues](https://github.com/wangfeizong1001/yunshu-platform/issues) 创建 Issue，附上：

- 复现步骤
- 期望结果
- 实际结果
- 环境信息（浏览器、Node.js 版本等）
- 截图或日志

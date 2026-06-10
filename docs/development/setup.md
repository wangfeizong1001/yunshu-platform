# 开发环境搭建

本文档指导你从零开始搭建云枢中台的本地开发环境。

---

## 一、环境要求

### 1.1 必需软件

| 软件 | 版本要求 | 说明 |
|------|---------|------|
| Node.js | >= 20.0.0 | JavaScript 运行时 |
| pnpm | >= 9.0.0 | 包管理器 |
| Git | 最新版本 | 版本控制 |
| VS Code（推荐） | 最新版本 | IDE |

### 1.2 可选软件（完整后端环境）

| 软件 | 版本 | 说明 |
|------|------|------|
| Docker | 24+ | 容器化 |
| Docker Compose | v2+ | 多容器编排 |
| PostgreSQL | 16+ | 主数据库 |
| Redis | 7+ | 缓存 |

### 1.3 验证环境

```bash
# 检查 Node.js
node -v        # 输出: v20.x.x

# 检查 pnpm
pnpm -v        # 输出: 9.x.x

# 检查 Git
git --version  # 输出: git version 2.x.x

# 检查 Docker（可选）
docker -v      # 输出: Docker version 24.x
docker-compose -v  # 输出: Docker Compose version v2.x
```

### 1.4 安装缺失依赖

```bash
# 安装 pnpm
npm install -g pnpm

# 或者使用 corepack（Node.js 16+ 自带）
corepack enable
corepack prepare pnpm@latest --activate

# 安装 nvm（管理多版本 Node.js，可选）
# macOS / Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

---

## 二、获取代码

### 2.1 克隆项目

```bash
# HTTPS 方式
git clone https://github.com/wangfeizong1001/yunshu-platform.git

# SSH 方式（推荐，配置过 SSH Key）
git clone git@github.com:wangfeizong1001/yunshu-platform.git

cd yunshu-platform
```

### 2.2 切换到开发分支

```bash
# 查看所有分支
git branch -a

# 切换到 develop 分支
git checkout develop

# 拉取最新代码
git pull origin develop
```

### 2.3 配置 Git（首次使用）

```bash
# 配置用户名和邮箱
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 设置默认编辑器（可选）
git config core.editor "code --wait"

# 配置换行符（跨平台开发）
git config core.autocrlf input
```

---

## 三、安装依赖

### 3.1 配置国内镜像（可选，加速安装）

```bash
# 配置 pnpm 使用淘宝镜像
pnpm config set registry https://registry.npmmirror.com

# 验证配置
pnpm config get registry
# 输出: https://registry.npmmirror.com/

# 如需恢复官方源
pnpm config set registry https://registry.npmjs.org
```

### 3.2 安装项目依赖

```bash
# 在项目根目录执行
pnpm install

# 首次安装可能需要较长时间，请耐心等待
# pnpm 会自动处理所有 workspace 包间的依赖
```

### 3.3 安装过程常见问题

**问题 1: 卡在 fetchMetadata**

```bash
# 清理缓存重试
pnpm store prune
pnpm install

# 或者使用离线模式（如有缓存）
pnpm install --offline
```

**问题 2: 网络超时**

```bash
# 增加超时时间
pnpm install --fetch-timeout=600000

# 或者使用代理
export HTTPS_PROXY=http://127.0.0.1:7890
pnpm install
```

**问题 3: Node.js 版本不兼容**

```bash
# 检查版本
node -v  # 需要 >= 20

# 使用 nvm 切换版本
nvm install 20
nvm use 20
```

### 3.4 验证安装

```bash
# 查看依赖树
pnpm ls

# 检查是否有缺失依赖
pnpm doctor
```

---

## 四、配置环境变量

### 4.1 前端环境变量

admin 应用使用 `.env.development` 作为开发环境配置：

```bash
# 文件位置: apps/admin/.env.development

# 开发模式标志
NODE_ENV=development

# API 基础地址（Mock 模式下留空或指向 Mock 服务）
VITE_API_BASE_URL=

# 应用标题
VITE_APP_TITLE=云枢中台管理系统

# 是否启用 Mock 数据（开发环境建议开启）
VITE_ENABLE_MOCK=true

# Mock API 前缀
VITE_API_MOCK_PREFIX=/mock-api

# WebSocket 地址（如需要）
VITE_WS_BASE_URL=ws://localhost:5173/ws
```

### 4.2 创建本地配置（可选，不提交到 Git）

```bash
# 复制模板
cp apps/admin/.env.development apps/admin/.env.local

# 编辑本地配置（覆盖默认配置）
code apps/admin/.env.local
```

### 4.3 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | API 基础地址 | 空（使用 Mock） |
| `VITE_APP_TITLE` | 应用标题 | 云枢中台管理系统 |
| `VITE_ENABLE_MOCK` | 是否启用 Mock | true |
| `VITE_API_MOCK_PREFIX` | Mock API 前缀 | `/mock-api` |

---

## 五、启动开发服务器

### 5.1 快速启动（推荐）

```bash
# 启动 admin 应用（Vue 3 + Vite）
pnpm dev --filter=@yunshu/admin

# 或使用根目录快捷命令
pnpm dev
```

### 5.2 启动后的终端输出

```
VITE v5.4.x  ready in 3200 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help

hmr update /@fs/.../src/views/login/index.vue
```

### 5.3 访问系统

在浏览器中打开：

```
http://localhost:5173
```

**Mock 数据默认账号**

| 账号 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | 超级管理员 |
| operator | 123456 | 普通用户 |

### 5.4 启动参数

```bash
# 指定端口
pnpm dev --filter=@yunshu/admin -- --port 3000

# 暴露到局域网（可通过手机/其他电脑访问）
pnpm dev --filter=@yunshu/admin -- --host

# HTTPS 模式（需要证书）
pnpm dev --filter=@yunshu/admin -- --https
```

---

## 六、Docker Compose 启动完整环境（含真实后端）

### 6.1 一键启动

```bash
# 启动所有服务（前端 + 后端 + 数据库 + 缓存）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看所有日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f admin
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis
```

### 6.2 服务端口映射

| 服务 | 容器端口 | 主机端口 | 访问地址 |
|------|---------|---------|---------|
| Admin UI (Nginx) | 80 | 80 | http://localhost |
| Backend API | 8080 | 8080 | http://localhost:8080 |
| PostgreSQL | 5432 | 5432 | localhost:5432 |
| Redis | 6379 | 6379 | localhost:6379 |
| pgAdmin（可选） | 80 | 5050 | http://localhost:5050 |

### 6.3 停止服务

```bash
# 停止但保留数据
docker-compose down

# 停止并删除数据（⚠️ 谨慎使用）
docker-compose down -v

# 停止单个服务
docker-compose stop backend
docker-compose start backend
```

### 6.4 进入容器

```bash
# 进入后端容器
docker-compose exec backend sh

# 进入 PostgreSQL
docker-compose exec postgres psql -U yunshu -d yunshu

# 进入 Redis
docker-compose exec redis redis-cli

# 查看表结构
docker-compose exec postgres psql -U yunshu -d yunshu -c "\dt"
```

---

## 七、代码格式化与检查

### 7.1 Prettier 格式化

```bash
# 检查格式
pnpm format:check

# 自动修复格式
pnpm format

# 仅格式化指定文件
pnpm exec prettier --write "apps/admin/src/views/**/*.vue"
```

### 7.2 ESLint 代码检查

```bash
# 运行 ESLint
pnpm lint

# 自动修复可修复的问题
pnpm lint:fix

# 检查特定目录
pnpm lint --filter=@yunshu/admin
```

### 7.3 TypeScript 类型检查

```bash
# 全量类型检查
pnpm type-check

# 仅检查 admin
cd apps/admin
pnpm exec vue-tsc --noEmit

# 监听模式（开发时建议）
cd apps/admin
pnpm exec vue-tsc --watch --noEmit
```

### 7.4 完整代码质量检查（提交前必跑）

```bash
# 一键运行所有检查
pnpm check

# 或分步运行
pnpm type-check && pnpm lint && pnpm format:check
```

---

## 八、运行测试

### 8.1 单元测试

```bash
# 运行所有单元测试
pnpm test

# 监听模式（文件变更时自动重跑）
pnpm test -- --watch

# 运行指定文件
pnpm test -- apps/admin/src/__tests__/utils/httpClient.test.ts

# 生成覆盖率报告
pnpm test:coverage

# 查看覆盖率报告（生成后自动打开浏览器）
# 报告位置: coverage/index.html
```

### 8.2 E2E 测试（Playwright）

```bash
# 1. 先启动开发服务器
pnpm dev --filter=@yunshu/admin

# 2. 新开终端运行 Playwright
pnpm exec playwright test

# 3. 查看测试报告
pnpm exec playwright show-report

# 可视化模式（调试用）
pnpm exec playwright test --ui

# 生成测试代码
pnpm exec playwright codegen http://localhost:5173
```

### 8.3 集成测试

```bash
# 运行集成测试
pnpm test:integration

# 查看测试结果
# 报告位置: reports/integration/index.html
```

---

## 九、项目构建

### 9.1 开发构建

```bash
# 构建 admin 应用
pnpm build --filter=@yunshu/admin

# 查看构建产物
ls -lh apps/admin/dist/
```

### 9.2 构建产物结构

```
apps/admin/dist/
├── index.html              # 入口 HTML
├── assets/                 # 资源文件
│   ├── index.[hash].js     # 主 JS
│   ├── index.[hash].css    # 主 CSS
│   └── [chunk].js          # 分包（按需加载）
├── favicon.ico             # 网站图标
├── robots.txt              # 爬虫规则
└── mock-service-worker.js  # Mock Service Worker
```

### 9.3 预览构建结果

```bash
# 启动静态服务器预览构建结果
pnpm preview --filter=@yunshu/admin

# 访问 http://localhost:4173
```

---

## 十、VS Code 开发配置（推荐）

### 10.1 必需扩展

| 扩展名称 | 说明 | 用途 |
|---------|------|------|
| Vue - Official (Volar) | Vue 3 官方扩展 | 语法高亮、类型检查 |
| TypeScript Vue Plugin (Volar) | Vue TS 插件 | `.vue` 文件类型支持 |
| ESLint | 代码检查 | 实时检查代码规范 |
| Prettier | 代码格式化 | 统一代码风格 |
| Error Lens | 行内错误显示 | 错误信息直接在行内显示 |

### 10.2 推荐扩展

| 扩展名称 | 用途 |
|---------|------|
| GitLens | Git 增强，显示每行代码的提交信息 |
| Auto Rename Tag | 自动重命名 HTML/XML 标签 |
| Path Intellisense | 路径自动补全 |
| CSS Navigation | CSS 类名跳转 |
| DotENV | `.env` 文件语法高亮 |
| Playwright Test for VS Code | E2E 测试可视化 |
| Thunder Client | REST API 测试（替代 Postman） |

### 10.3 推荐 settings.json

```json
{
  // 编辑器
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.tabSize": 2,
  "editor.wordWrap": "on",

  // 文件关联
  "files.associations": {
    "*.vue": "vue"
  },

  // Vue 配置
  "vue.autoInsert.dotValue": true,

  // TypeScript 配置
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,

  // 终端
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.defaultProfile.windows": "PowerShell",

  // ESLint
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],

  // 搜索忽略
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true,
    "**/coverage": true
  }
}
```

### 10.4 推荐扩展安装命令

```bash
# 快速安装所有推荐扩展
code --install-extension Vue.volar
code --install-extension Vue.vscode-typescript-vue-plugin
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension usernamehw.errorlens
code --install-extension eamodio.gitlens
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension mikestead.dotenv
```

---

## 十一、常见问题排查

### 11.1 启动问题

**Q: `Cannot find module '@yunshu/shared'`**

```bash
# 构建共享包
pnpm build --filter=@yunshu/shared
pnpm build --filter=@yunshu/api-client

# 重新启动
pnpm dev --filter=@yunshu/admin
```

**Q: Vite 启动后页面白屏**

```bash
# 清除 Vite 缓存
rm -rf apps/admin/node_modules/.vite
rm -rf node_modules/.vite

# 重启
pnpm dev --filter=@yunshu/admin
```

### 11.2 类型问题

**Q: TypeScript 报错但代码看起来正确**

```bash
# 重新构建 workspace 包
pnpm build

# 重启 TS 服务（VS Code）
# Ctrl/CMD + Shift + P → "TypeScript: Restart TS Server"
```

### 11.3 依赖问题

**Q: node_modules 占用空间过大**

```bash
# pnpm 使用硬链接节省空间，无需担心
# 如需清理可执行
pnpm store prune
```

**Q: 安装依赖报权限错误**

```bash
# 修复权限
sudo chown -R $(whoami) ~/.pnpm-store
# 或重新安装
pnpm install
```

### 11.4 HMR（热更新）问题

**Q: 修改代码后页面不自动刷新**

```bash
# 清除 Vite 缓存
rm -rf apps/admin/node_modules/.vite
rm -rf node_modules/.vite

# 重启 dev 服务器
# 检查浏览器控制台是否有 HMR 日志
# [vite] hot updated: /src/views/...
```

---

## 十二、下一步

完成环境搭建后，建议阅读：

1. **[项目规范](../DEVELOP.md)** - 了解开发规范与最佳实践
2. **[架构设计](../architecture/architecture.md)** - 理解系统架构设计
3. **[贡献指南](../CONTRIBUTING.md)** - 了解如何贡献代码
4. **[API 文档](../API.md)** - 查看 REST API 接口定义

---

## 十三、获取帮助

如遇到文档未提及的问题：

- **GitHub Issues**: https://github.com/wangfeizong1001/yunshu-platform/issues
- **常见问题**: 查看 [FAQ.md](../faq.md)
- **架构文档**: [architecture/architecture.md](../architecture/architecture.md)

---

**祝你编码愉快！🚀**

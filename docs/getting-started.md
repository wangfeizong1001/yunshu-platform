# 快速开始指南

本指南将帮助你在 5 分钟内启动云枢中台开发环境。

## 前置条件

请确保你的开发环境已安装以下工具：

| 工具 | 版本要求 | 验证命令 |
|------|---------|---------|
| Node.js | >= 20.0.0 | `node -v` |
| pnpm | >= 9.0.0 | `pnpm -v` |
| Git | 最新版本 | `git --version` |

> **提示**: 如果还未安装 pnpm，请运行 `npm install -g pnpm`

### 安装 Node.js 版本管理工具（推荐）

```bash
# 使用 nvm（macOS/Linux）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# 或使用 volta（跨平台）
curl https://get.volta.sh | bash
volta install node@20
```

## 一分钟快速启动

```bash
# 1. 克隆项目
git clone https://github.com/wangfeizong1001/yunshu-platform.git
cd yunshu-platform

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

访问 http://localhost:5173 即可查看管理后台。

## 完整开发环境搭建

### 1. 代码准备

```bash
# 克隆主仓库
git clone https://github.com/wangfeizong1001/yunshu-platform.git
cd yunshu-platform

# 切换到 develop 分支（最新开发代码）
git checkout develop

# 配置国内镜像（可选，加速依赖安装）
pnpm config set registry https://registry.npmmirror.com
```

### 2. 安装依赖

```bash
# 安装所有依赖（pnpm 会自动处理 workspace）
pnpm install

# 如果遇到网络问题，可以尝试
pnpm install --prefer-offline

# 或清理缓存后重试
pnpm store prune
pnpm install
```

### 3. 环境变量配置

admin 应用的环境变量文件位于 `apps/admin/.env.*`：

| 文件 | 说明 |
|------|------|
| `.env.development` | 开发环境配置 |
| `.env.test` | 测试环境配置 |
| `.env.production` | 生产环境配置 |

创建本地配置文件（可选，不会提交到 Git）：

```bash
# 复制示例配置
cp apps/admin/.env.development apps/admin/.env.local
```

关键配置项说明：

```env
# API 基础地址（开发环境通常指向 Mock 数据）
VITE_API_BASE_URL=/mock-api

# 应用标题
VITE_APP_TITLE=云枢中台

# 是否启用 Mock（开发环境建议开启）
VITE_ENABLE_MOCK=true
```

### 4. 启动开发模式

```bash
# 启动 admin 应用（推荐）
pnpm dev --filter=@yunshu/admin

# 或启动所有应用
pnpm dev
```

启动成功后终端会显示：

```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### 5. 访问系统

在浏览器打开 http://localhost:5173

默认登录账号（Mock 数据）：

| 账号 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | 超级管理员 |

## 常用命令速查

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev
pnpm dev --filter=@yunshu/admin

# 类型检查（重要！提交前必须运行）
pnpm type-check

# 代码规范检查
pnpm lint

# 代码自动修复
pnpm lint:fix

# 代码格式化
pnpm format

# 单元测试
pnpm test

# 测试覆盖率
pnpm test:coverage

# 生产构建
pnpm build --filter=@yunshu/admin

# 预览生产构建
pnpm preview --filter=@yunshu/admin

# 清理构建产物
pnpm clean
```

## 构建生产版本

```bash
# 1. 构建 admin 应用
pnpm build --filter=@yunshu/admin

# 2. 预览构建结果
pnpm preview --filter=@yunshu/admin

# 构建产物位于 apps/admin/dist/ 目录
ls -la apps/admin/dist/
```

## 使用 Docker 一键启动（含真实后端）

```bash
# 启动完整服务（PostgreSQL + Redis + 后端 + 前端）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f admin
docker-compose logs -f backend

# 停止服务
docker-compose down
```

## 常见问题速解

### Q: 安装依赖卡在 fetchMetadata？

**原因**: 网络问题导致无法访问 npm 源

**解决**:

```bash
# 切换到国内镜像
pnpm config set registry https://registry.npmmirror.com

# 清理重试
pnpm store prune
pnpm install
```

### Q: 启动后页面空白？

**原因**: 通常是路由或构建缓存问题

**解决**:

```bash
# 清理缓存
rm -rf apps/admin/node_modules/.vite
rm -rf node_modules/.vite

# 重新启动
pnpm dev
```

### Q: TypeScript 类型检查报错？

**原因**: workspace 包的类型声明未正确生成

**解决**:

```bash
# 先构建 shared 包
pnpm build --filter=@yunshu/shared

# 再运行类型检查
pnpm type-check
```

### Q: pnpm 命令找不到？

**原因**: pnpm 未正确安装或不在 PATH 中

**解决**:

```bash
# npm 全局安装
npm install -g pnpm

# 或使用 corepack（Node.js 16+ 自带）
corepack enable
corepack prepare pnpm@latest --activate
```

更多问题请查看 [FAQ.md](faq.md)

## 下一步

- 了解 [项目架构](architecture/architecture.md)
- 阅读 [开发规范](../DEVELOP.md)
- 查看 [API 文档](../API.md)
- 了解 [贡献指南](../CONTRIBUTING.md)

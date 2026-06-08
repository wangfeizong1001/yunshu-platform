# 部署指南

本文档详细介绍云枢中台项目的生产环境部署流程和配置。

## 📋 目录

- [部署前准备](#部署前准备)
- [环境配置](#环境配置)
- [构建流程](#构建流程)
- [部署方式](#部署方式)
- [容器化部署](#容器化部署)
- [持续集成/部署](#持续集成部署)
- [监控与日志](#监控与日志)
- [故障排除](#故障排除)

## 部署前准备

### 系统要求

| 项目 | 要求 |
|------|------|
| CPU | 2 核以上 |
| 内存 | 4GB 以上 |
| 磁盘 | 20GB 以上 |
| 操作系统 | Ubuntu 20.04+ / CentOS 7+ |
| Node.js | >= 18.0.0 |
| pnpm | >= 9.0.0 |

### 安装 Node.js

```bash
# 使用 nvm 安装 Node.js 18
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
node -v  # v18.x.x

# 安装 pnpm
npm install -g pnpm
pnpm -v  # 9.x.x
```

### 安装 Nginx

```bash
# Ubuntu/Debian
apt update && apt install nginx -y

# CentOS/RHEL
yum install nginx -y

# 启动 Nginx
systemctl start nginx
systemctl enable nginx
```

## 环境配置

### 生产环境变量

创建 `apps/admin/.env.production.local`：

```bash
# API 配置
VITE_API_BASE_URL=https://api.your-domain.com
VITE_API_TIMEOUT=30000

# 应用配置
VITE_APP_TITLE=云枢中台
VITE_APP_VERSION=1.0.0

# 功能开关
VITE_ENABLE_MOCK=false
VITE_ENABLE_DEBUG=false

# 监控配置
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx

# SEO 配置
VITE_SITE_URL=https://www.your-domain.com
```

### 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_API_BASE_URL` | API 基础地址 | `https://api.example.com` |
| `VITE_API_TIMEOUT` | 请求超时时间(ms) | `30000` |
| `VITE_APP_TITLE` | 应用标题 | `云枢中台` |
| `VITE_ENABLE_MOCK` | 是否启用 Mock | `false` |
| `VITE_SENTRY_DSN` | Sentry DSN | `https://xxx@sentry.io/xxx` |

## 构建流程

### 1. 安装依赖

```bash
# 克隆项目
git clone https://github.com/wangfeizong1001/yunshu-platform.git
cd yunshu-platform

# 安装依赖（使用生产环境）
pnpm install --prod=false
```

### 2. 构建包

```bash
# 构建所有包
pnpm build

# 或构建指定包
pnpm build --filter=@yunshu/ui
pnpm build --filter=@yunshu/api-client
```

### 3. 构建应用

```bash
# 构建管理后台
pnpm build --filter=@yunshu/admin

# 输出目录: apps/admin/dist
```

### 4. 预览构建结果

```bash
# 本地预览
pnpm preview --filter=@yunshu/admin
```

## 部署方式

### 方式一：Nginx 部署

#### 1. 配置 Nginx

```bash
# 创建 Nginx 配置
sudo vim /etc/nginx/sites-available/yunshu-admin
```

```nginx
server {
    listen 80;
    server_name www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.your-domain.com;

    # SSL 配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 前端文件目录
    root /var/www/yunshu-admin/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml application/json;

    # 前端路由 (SPA)
    location / {
        try_files $uri $uri/ /index.html;

        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket 代理（如果需要）
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 2. 启用配置

```bash
# 链接配置
sudo ln -s /etc/nginx/sites-available/yunshu-admin /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

#### 3. 上传构建文件

```bash
# 创建目录
sudo mkdir -p /var/www/yunshu-admin

# 复制构建文件
sudo cp -r apps/admin/dist/* /var/www/yunshu-admin/

# 设置权限
sudo chown -R www-data:www-data /var/www/yunshu-admin
```

### 方式二：PM2 部署

#### 1. 安装 PM2

```bash
npm install -g pm2
```

#### 2. 创建 PM2 配置文件

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'yunshu-admin',
      script: 'apps/admin/dist/index.html',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

#### 3. 启动应用

```bash
# 启动
pm2 start ecosystem.config.js --env production

# 保存进程列表
pm2 save

# 设置开机启动
pm2 startup
```

### 方式三：Docker 部署

#### 1. 创建 Dockerfile

```dockerfile
# Dockerfile
FROM nginx:alpine

# 复制构建文件
COPY apps/admin/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80 443

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 Nginx 配置

```nginx
# deploy/nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://host.docker.internal:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3. 构建和运行

```bash
# 构建镜像
docker build -t yunshu-admin:latest .

# 运行容器
docker run -d -p 80:80 --name yunshu-admin yunshu-admin:latest
```

## 容器化部署

### Docker Compose 部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  admin:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
    networks:
      - yunshu-network

  api:
    image: node:18-alpine
    working_dir: /app
    command: node server/index.js
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://user:pass@db:3306/yunshu
    depends_on:
      - db
    networks:
      - yunshu-network

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE Yunshu
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - yunshu-network

volumes:
  mysql_data:

networks:
  yunshu-network:
    driver: bridge
```

启动：

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 持续集成/部署

### GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      - name: Deploy to Server
        if: github.ref == 'refs/heads/main'
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /var/www/yunshu-admin
            git pull origin main
            pnpm install --frozen-lockfile
            pnpm build
            sudo systemctl reload nginx

      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        run: |
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 配置 GitHub Secrets

在 GitHub 仓库 Settings → Secrets 中添加：

| Secret 名称 | 说明 |
|-------------|------|
| `VITE_API_BASE_URL` | API 基础地址 |
| `DEPLOY_HOST` | 部署服务器地址 |
| `DEPLOY_USER` | 部署服务器用户名 |
| `DEPLOY_KEY` | SSH 私钥 |
| `VERCEL_TOKEN` | Vercel Token |

## 监控与日志

### Nginx 日志配置

```nginx
# 访问日志
access_log /var/log/nginx/yunshu-admin.access.log;

# 错误日志
error_log /var/log/nginx/yunshu-admin.error.log warn;
```

### PM2 日志

```bash
# 查看日志
pm2 logs yunshu-admin

# 实时查看
pm2 logs yunshu-admin --f

# 日志文件位置
~/.pm2/logs/
```

### 性能监控

使用 **PM2 Plus** 或 **Datadog** 进行监控：

```bash
# 启用 PM2 Plus
pm2 link <secret-key> <public-key>

# 查看仪表板
pm2 d
```

## 故障排除

### 常见问题

#### 1. 页面空白

**原因**：通常是路由 history 模式配置问题。

**解决**：确保 Nginx 配置了 `try_files $uri $uri/ /index.html;`

#### 2. 静态资源 404

**原因**：资源路径配置错误。

**解决**：检查 `VITE_PUBLIC_PATH` 配置，确保以 `/` 结尾。

#### 3. API 请求失败

**原因**：CORS 配置或代理配置错误。

**解决**：检查 Nginx 代理配置或后端 CORS 配置。

#### 4. 内存溢出

**原因**：Node.js 内存限制或内存泄漏。

**解决**：增加内存限制或使用 PM2 集群模式。

```bash
# 增加内存限制
node --max-old-space-size=4096 server.js

# 使用集群模式
pm2 start ecosystem.config.js -i max
```

### 回滚操作

```bash
# 查看历史版本
pm2 list

# 回滚到指定版本
pm2 stop yunshu-admin
pm2 delete yunshu-admin
pm2 start ecosystem.config.js

# 使用 Git 回滚
git checkout v1.0.0
pnpm build
pm2 restart yunshu-admin
```

### 健康检查

```bash
# 检查服务状态
systemctl status nginx
pm2 status

# 检查端口监听
netstat -tlnp | grep -E '80|443'

# 检查 DNS 解析
nslookup www.your-domain.com

# 检查 SSL 证书
openssl s_client -connect www.your-domain.com:443
```

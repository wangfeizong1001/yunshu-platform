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
| Node.js | >= 20.0.0 |
| pnpm | >= 9.0.0 |

### 安装 Node.js

```bash
# 使用 nvm 安装 Node.js 20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node -v  # v20.x.x

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

### 安装 Docker 和 Docker Compose

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | bash
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

## 环境配置

### 应用结构

项目包含多个应用，位于 `apps/` 目录下：

```
apps/
├── admin/          # 管理后台应用
├── portal/         # 门户应用
└── mobile/         # 移动端应用
```

### 环境变量文件说明

每个应用都有自己的环境变量文件，命名规则：

| 环境 | 文件名 | 说明 |
|------|--------|------|
| 通用 | `.env` | 所有环境共享的变量 |
| 开发 | `.env.development` | 开发环境专用 |
| 预发布 | `.env.staging` | 预发布环境专用 |
| 生产 | `.env.production` | 生产环境专用 |
| 本地覆盖 | `.env.production.local` | 本地生产环境覆盖（不提交到版本控制） |

### 生产环境变量（admin 应用）

创建 `apps/admin/.env.production`：

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
VITE_SENTRY_ENVIRONMENT=production

# SEO 配置
VITE_SITE_URL=https://www.your-domain.com

# 公共路径
VITE_PUBLIC_PATH=/
```

### 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_API_BASE_URL` | API 基础地址 | `https://api.example.com` |
| `VITE_API_TIMEOUT` | 请求超时时间(ms) | `30000` |
| `VITE_APP_TITLE` | 应用标题 | `云枢中台` |
| `VITE_ENABLE_MOCK` | 是否启用 Mock | `false` |
| `VITE_SENTRY_DSN` | Sentry DSN | `https://xxx@sentry.io/xxx` |
| `VITE_SENTRY_ENVIRONMENT` | Sentry 环境 | `production` |
| `VITE_PUBLIC_PATH` | 公共资源路径 | `/` 或 `/admin/` |

## 构建流程

### 1. 安装依赖

```bash
# 克隆项目
git clone https://github.com/wangfeizong1001/yunshu-platform.git
cd yunshu-platform

# 安装依赖（使用生产环境）
pnpm install --prod=false
```

### 2. 构建包（内部包）

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

# 构建门户应用
pnpm build --filter=@yunshu/portal

# 构建移动端应用
pnpm build --filter=@yunshu/mobile

# 输出目录: apps/admin/dist
```

### 4. 各环境构建命令

```bash
# 开发环境构建
pnpm build:dev

# 预发布环境构建
pnpm build:staging

# 生产环境构建
pnpm build:prod

# 构建所有应用
pnpm build:all

# 构建并分析 bundle
pnpm build:analyze
```

### 5. 预览构建结果

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

### 方式三：Vercel 部署

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 部署到 Vercel

```bash
# 登录 Vercel
vercel login

# 进入应用目录
cd apps/admin

# 部署预览环境
vercel

# 部署生产环境
vercel --prod
```

#### 3. 使用 vercel.json 配置

创建 `apps/admin/vercel.json`：

```json
{
  "buildCommand": "pnpm build --filter=@yunshu/admin",
  "outputDirectory": "dist",
  "framework": "vite",
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 方式四：Netlify 部署

#### 1. 创建 netlify.toml 配置

创建 `apps/admin/netlify.toml`：

```toml
[build]
  command = "pnpm build --filter=@yunshu/admin"
  publish = "apps/admin/dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
```

#### 2. 部署命令

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署预览
netlify deploy

# 部署生产
netlify deploy --prod
```

## 容器化部署

### Docker Compose 部署

#### 1. 完整 docker-compose.yml

创建项目根目录下的 `docker-compose.yml`：

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 前端应用
  admin:
    build:
      context: .
      dockerfile: Dockerfile.admin
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
    networks:
      - yunshu-network
    restart: unless-stopped

  # API 服务
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://user:pass@db:3306/yunshu
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    networks:
      - yunshu-network
    restart: unless-stopped

  # 数据库
  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=yunshu
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "3306:3306"
    networks:
      - yunshu-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Redis 缓存
  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - yunshu-network
    command: redis-server --appendonly yes
    restart: unless-stopped

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
      - "8443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - admin
      - api
    networks:
      - yunshu-network
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:

networks:
  yunshu-network:
    driver: bridge
```

#### 2. Dockerfile.admin（前端应用）

```dockerfile
# Dockerfile.admin
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 复制源码
COPY . .

# 构建应用
RUN pnpm build --filter=@yunshu/admin

# 生产镜像
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80 443

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Dockerfile.api（API 服务）

```dockerfile
# Dockerfile.api
FROM node:20-alpine

WORKDIR /app

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# 安装依赖
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# 复制源码
COPY . .

# 设置用户
RUN chown -R nodejs:nodejs /app

USER nodejs

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "server/index.js"]
```

#### 4. nginx.conf（反向代理配置）

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # 性能优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss;

    # 上游服务
    upstream admin {
        server admin:80;
    }

    upstream api {
        server api:3000;
    }

    server {
        listen 80;
        server_name localhost;

        # 前端应用
        location / {
            proxy_pass http://admin;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API 服务
        location /api {
            proxy_pass http://api;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 超时设置
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # WebSocket
        location /ws {
            proxy_pass http://api;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }
}
```

#### 5. 环境变量文件

创建 `.env` 文件：

```bash
# 数据库
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=yunshu
MYSQL_USER=yunshu_user
MYSQL_PASSWORD=your_password

# Redis
REDIS_PASSWORD=your_redis_password

# API
NODE_ENV=production
DATABASE_URL=mysql://yunshu_user:your_password@db:3306/yunshu
```

#### 6. 启动和管理

```bash
# 启动所有服务
docker-compose up -d

# 带日志启动
docker-compose up -d

# 查看日志
docker-compose logs -f
docker-compose logs -f admin

# 查看服务状态
docker-compose ps

# 停止服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v

# 重启服务
docker-compose restart
docker-compose restart admin

# 重新构建
docker-compose build --no-cache
docker-compose up -d

# 进入容器调试
docker-compose exec admin sh
docker-compose exec api sh
```

## 持续集成/部署

### GitHub Actions

#### 1. 部署到 Staging 环境

创建 `.github/workflows/deploy-staging.yml`：

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - develop
  pull_request:
    branches:
      - develop

env:
  NODE_VERSION: '20'
  VITE_PUBLIC_PATH: '/'

jobs:
  build-and-deploy-staging:
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
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
        run: pnpm build --filter=@yunshu/admin
        env:
          VITE_API_BASE_URL: ${{ secrets.STAGING_API_BASE_URL }}
          VITE_SENTRY_DSN: ${{ secrets.STAGING_SENTRY_DSN }}
          VITE_SENTRY_ENVIRONMENT: staging

      - name: Deploy to Staging Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_KEY }}
          script: |
            cd /var/www/yunshu-staging
            git pull origin develop
            pnpm install --frozen-lockfile
            pnpm build --filter=@yunshu/admin
            sudo systemctl reload nginx

      - name: Deploy to Vercel Staging
        run: |
          cd apps/admin
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }} --yes
```

#### 2. 部署到 Production 环境（手动触发）

创建 `.github/workflows/deploy-production.yml`：

```yaml
name: Deploy to Production

on:
  workflow_dispatch:
    inputs:
      version:
        description: '版本号/标签'
        required: true
        type: string

env:
  NODE_VERSION: '20'

jobs:
  build-and-deploy-production:
    runs-on: ubuntu-latest
    environment: production
    concurrency:
      group: production-deploy

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          ref: ${{ inputs.version }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
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
        run: pnpm build --filter=@yunshu/admin
        env:
          VITE_API_BASE_URL: ${{ secrets.PROD_API_BASE_URL }}
          VITE_SENTRY_DSN: ${{ secrets.PROD_SENTRY_DSN }}
          VITE_SENTRY_ENVIRONMENT: production

      - name: Create Deployment Package
        run: |
          tar -czf deployment.tar.gz apps/admin/dist

      - name: Upload Build Artifact
        uses: actions/upload-artifact@v4
        with:
          name: production-build
          path: deployment.tar.gz
          retention-days: 7

  deploy-to-server:
    needs: build-and-deploy-production
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Download Build Artifact
        uses: actions/download-artifact@v4
        with:
          name: production-build

      - name: Deploy to Production Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_KEY }}
          script: |
            cd /var/www/yunshu-admin
            tar -xzf /tmp/deployment.tar.gz
            sudo systemctl reload nginx
            echo "Deployment completed at $(date)" >> deployments.log

      - name: Notify Deployment
        if: always()
        uses: slackapi/slack-github-action@v1.25.0
        with:
          payload: |
            {
              "text": "生产环境部署完成",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*生产环境部署状态*\n版本: ${{ inputs.version }}\n状态: ${{ job.status }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

#### 3. 配置 GitHub Secrets

在 GitHub 仓库 Settings → Secrets 中添加：

| Secret 名称 | 说明 |
|-------------|------|
| `STAGING_API_BASE_URL` | Staging 环境 API 地址 |
| `STAGING_SENTRY_DSN` | Staging 环境 Sentry DSN |
| `STAGING_HOST` | Staging 服务器地址 |
| `STAGING_USER` | Staging 服务器用户名 |
| `STAGING_KEY` | Staging 服务器 SSH 私钥 |
| `PROD_API_BASE_URL` | 生产环境 API 地址 |
| `PROD_SENTRY_DSN` | 生产环境 Sentry DSN |
| `PROD_HOST` | 生产服务器地址 |
| `PROD_USER` | 生产服务器用户名 |
| `PROD_KEY` | 生产服务器 SSH 私钥 |
| `VERCEL_TOKEN` | Vercel Token |
| `SLACK_WEBHOOK_URL` | Slack 通知 Webhook |

### 手动部署到 Production

#### 1. 服务器端准备

```bash
# 创建部署目录
sudo mkdir -p /var/www/yunshu-admin
sudo chown -R $USER:$USER /var/www/yunshu-admin

# 克隆仓库
cd /var/www/yunshu-admin
git clone https://github.com/wangfeizong1001/yunshu-platform.git .
git checkout main
```

#### 2. 执行部署

```bash
# 进入目录
cd /var/www/yunshu-admin

# 拉取最新代码
git pull origin main

# 安装依赖
pnpm install --frozen-lockfile

# 构建应用
pnpm build --filter=@yunshu/admin

# 复制构建文件
cp -r apps/admin/dist/* /var/www/yunshu-admin/

# 重载 Nginx
sudo systemctl reload nginx

# 创建部署回滚脚本
#!/bin/bash
# rollback.sh
PREVIOUS_COMMIT=$(git rev-parse HEAD~1)
git checkout $PREVIOUS_COMMIT
pnpm install --frozen-lockfile
pnpm build --filter=@yunshu/admin
sudo systemctl reload nginx
```

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

### Vue Sentry 监控配置

#### 1. 安装 Sentry SDK

```bash
pnpm add @sentry/vue vite-plugin-sentry
```

#### 2. 配置 Sentry 插件

创建 `apps/admin/vite.config.ts`：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import SentryVitePlugin from 'vite-plugin-sentry'

export default defineConfig({
  plugins: [
    vue(),
    SentryVitePlugin({
      url: 'https://sentry.io',
      org: 'your-org',
      project: 'your-project',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: process.env.VITE_APP_VERSION,
      deploy: {
        env: process.env.VITE_SENTRY_ENVIRONMENT || 'production'
      },
      sourceMaps: {
        assets: './apps/admin/dist/assets/*.js'
      }
    })
  ],
  build: {
    sourcemap: true
  }
})
```

#### 3. Vue 应用中初始化 Sentry

创建 `apps/admin/src/plugins/sentry.ts`：

```typescript
import * as Sentry from '@sentry/vue'

export function initSentry(app: any) {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
      release: import.meta.env.VITE_APP_VERSION,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false
        })
      ],
      // 采样率
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      // 自定义标签
      beforeSend(event) {
        event.tags = {
          ...event.tags,
          app_version: import.meta.env.VITE_APP_VERSION
        }
        return event
      }
    })
  }
}
```

#### 4. 性能监控指标

```typescript
// 监控页面性能
import * as Sentry from '@sentry/vue'

// 监控页面加载
Sentry.addTracingMetadataFromEvent(document)

# Sentry Dashboard 关键指标
- **错误率**: 错误数量 / 总请求数
- **性能指标**: Web Vitals (LCP, FID, CLS)
- **用户影响**: 受影响用户数
- **发布对比**: 版本间错误率变化
```

### Docker 监控

```bash
# 查看容器资源使用
docker stats

# 查看所有容器状态
docker-compose ps

# 查看容器日志
docker-compose logs -f --tail=100

# 检查容器健康状态
docker inspect --format='{{json .State.Health}}' container_name
```

## 故障排除

### 常见问题

#### 1. 页面空白

**原因**：通常是路由 history 模式配置问题。

**解决**：确保 Nginx 配置了 `try_files $uri $uri/ /index.html;`

**排查步骤**：
```bash
# 检查 Nginx 配置
nginx -t

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 检查构建文件是否存在
ls -la /var/www/yunshu-admin/dist/
```

#### 2. 静态资源 404

**原因**：资源路径配置错误。

**解决**：
- 检查 `VITE_PUBLIC_PATH` 配置，确保以 `/` 结尾
- 如果部署在子路径，如 `/admin/`，设置 `VITE_PUBLIC_PATH=/admin/`

```bash
# 验证资源路径
curl -I https://your-domain.com/static/js/app.js
```

#### 3. API 请求失败

**原因**：CORS 配置或代理配置错误。

**解决**：
- 检查 Nginx 代理配置
- 检查后端 CORS 配置
- 验证 API 地址是否正确

```bash
# 测试 API 连接
curl -I https://your-domain.com/api/health

# 检查后端服务状态
docker-compose ps api
pm2 status
```

#### 4. 内存溢出

**原因**：Node.js 内存限制或内存泄漏。

**解决**：
- 增加内存限制
- 使用 PM2 集群模式
- 检查内存泄漏

```bash
# 增加内存限制
node --max-old-space-size=4096 server.js

# 使用集群模式
pm2 start ecosystem.config.js -i max

# 查看内存使用
pm2 monit
```

#### 5. Docker 容器启动失败

**原因**：端口冲突、镜像构建失败、依赖缺失。

**解决**：

```bash
# 检查端口占用
netstat -tlnp | grep -E '80|443|3000'

# 查看容器构建日志
docker-compose build --no-cache

# 查看容器详细日志
docker-compose logs -f admin

# 清理未使用的 Docker 资源
docker system prune -a
```

#### 6. 构建失败

**原因**：依赖安装失败、Node 版本不兼容、环境变量缺失。

**解决**：

```bash
# 清除缓存重新安装
rm -rf node_modules
rm -rf ~/.npm
pnpm install

# 检查 Node 版本
node -v

# 检查环境变量
pnpm env:list
```

#### 7. SSL 证书问题

**原因**：证书过期、证书路径错误、证书格式不正确。

**解决**：

```bash
# 检查证书有效性
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# 续期 Let's Encrypt 证书
certbot renew

# 检查证书文件权限
ls -la /etc/nginx/ssl/
```

#### 8. 数据库连接失败

**原因**：数据库未启动、网络隔离、凭据错误。

**解决**：

```bash
# 检查数据库容器
docker-compose ps db

# 测试数据库连接
docker-compose exec db mysql -u user -p

# 检查连接字符串
echo $DATABASE_URL
```

### 回滚操作

#### 1. PM2 回滚

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

#### 2. Docker 回滚

```bash
# 查看历史镜像
docker images

# 使用历史镜像启动
docker-compose down
docker pull your-image:previous-tag
docker-compose up -d

# 使用 Docker Compose 回滚
docker-compose down
git checkout previous-commit
docker-compose build
docker-compose up -d
```

#### 3. Nginx 配置回滚

```bash
# 恢复默认配置
sudo cp /etc/nginx/sites-available/yunshu-admin /etc/nginx/sites-available/yunshu-admin.bak
sudo nginx -t
sudo systemctl reload nginx
```

### 健康检查

```bash
# 检查服务状态
systemctl status nginx
pm2 status
docker-compose ps

# 检查端口监听
netstat -tlnp | grep -E '80|443'

# 检查 DNS 解析
nslookup www.your-domain.com

# 检查 SSL 证书
openssl s_client -connect www.your-domain.com:443

# 检查应用健康状态
curl -I https://your-domain.com/health
curl -I https://your-domain.com/api/health

# 检查 Docker 容器健康
docker inspect --format='{{.State.Health.Status}}' container_name
```

### 性能调优

#### 1. Nginx 调优

```nginx
#  worker 进程数设置为 CPU 核心数
worker_processes auto;

#  文件描述符限制
worker_rlimit_nofile 65535;

#  开启高效文件传输
sendfile on;
tcp_nopush on;
tcp_nodelay on;

#  缓存文件描述符
open_file_cache max=65535 inactive=60s;
open_file_cache_valid 30s;
open_file_cache_min_uses 2;
```

#### 2. Node.js 调优

```bash
# 生产环境优化
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=4096"

# 使用 PM2 集群模式
pm2 start ecosystem.config.js -i max
```

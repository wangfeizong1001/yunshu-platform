# 部署指南

本文档描述云枢中台的部署流程，包括 Docker Compose 一键部署、Nginx 配置、生产环境最佳实践等。

---

## 一、环境要求

### 1.1 服务器要求

| 配置 | 最低要求 | 推荐配置 |
|------|---------|---------|
| 操作系统 | Ubuntu 20.04 / CentOS 8 / Debian 11 | Ubuntu 22.04 LTS |
| CPU | 2 核 | 4 核+ |
| 内存 | 4 GB | 8 GB+ |
| 硬盘 | 40 GB SSD | 100 GB SSD+ |
| 网络 | 稳定的互联网连接 | 100 Mbps+ |

### 1.2 软件要求

| 软件 | 版本要求 |
|------|---------|
| Docker | 20.10+ |
| Docker Compose | v2.0+ |
| Nginx（可选） | 1.18+ |
| PostgreSQL（可选独立部署） | 16+ |
| Redis（可选独立部署） | 7.x |

### 1.3 验证环境

```bash
# 检查 Docker
docker --version
# 输出: Docker version 24.0.5, build ced0996

# 检查 Docker Compose
docker compose version
# 输出: Docker Compose version v2.20.2

# 检查系统资源
free -h      # 内存
df -h        # 硬盘
nproc        # CPU 核心数
```

---

## 二、Docker Compose 一键部署

### 2.1 目录结构

```
yunshu-platform/           # 项目根目录
├── docker-compose.yml      # Docker Compose 配置
├── .env.example           # 环境变量示例
├── .env                   # 环境变量（复制自 .env.example）
│
├── docker/                # Docker 相关文件
│   ├── admin/             # 前端 Dockerfile
│   │   └── Dockerfile
│   ├── backend/           # 后端 Dockerfile
│   │   └── Dockerfile
│   └── nginx/             # Nginx 配置
│       └── default.conf
│
└── data/                  # 持久化数据（自动创建）
    ├── postgres/          # PostgreSQL 数据
    ├── redis/             # Redis 数据
    └── logs/              # 日志文件
```

### 2.2 docker-compose.yml

```yaml
version: '3.8'

services:
  # ========== PostgreSQL ==========
  postgres:
    image: postgres:16-alpine
    container_name: yunshu-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-yunshu}
      POSTGRES_USER: ${POSTGRES_USER:-yunshu}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-yunshu123}
      TZ: ${TZ:-Asia/Shanghai}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
      - ./docker/postgres/init:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - yunshu-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-yunshu}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ========== Redis ==========
  redis:
    image: redis:7-alpine
    container_name: yunshu-redis
    restart: unless-stopped
    command:
      - "redis-server"
      - "--appendonly"
      - "yes"
      - "--requirepass"
      - "${REDIS_PASSWORD:-yunshu123}"
    volumes:
      - ./data/redis:/data
    ports:
      - "6379:6379"
    networks:
      - yunshu-network
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:-yunshu123}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ========== 后端 API ==========
  backend:
    image: yunshu/backend:latest
    build:
      context: .
      dockerfile: ./docker/backend/Dockerfile
    container_name: yunshu-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: production
      TZ: ${TZ:-Asia/Shanghai}
      # 数据库连接
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${POSTGRES_DB:-yunshu}
      DB_USER: ${POSTGRES_USER:-yunshu}
      DB_PASSWORD: ${POSTGRES_PASSWORD:-yunshu123}
      # Redis 连接
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD:-yunshu123}
      # 应用配置
      APP_PORT: 8080
      JWT_SECRET: ${JWT_SECRET:-change-me-to-a-random-secret-key}
      JWT_EXPIRE: 86400
      # 日志
      LOG_LEVEL: info
    ports:
      - "8080:8080"
    volumes:
      - ./data/logs/backend:/app/logs
    networks:
      - yunshu-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # ========== 前端 Admin ==========
  admin:
    image: yunshu/admin:latest
    build:
      context: .
      dockerfile: ./docker/admin/Dockerfile
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL:-/api}
    container_name: yunshu-admin
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      TZ: ${TZ:-Asia/Shanghai}
    ports:
      - "80:80"
    volumes:
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./data/logs/nginx:/var/log/nginx
    networks:
      - yunshu-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  yunshu-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
```

### 2.3 环境变量配置

```bash
# 复制环境变量示例
cp .env.example .env

# 编辑环境变量
vim .env
```

`.env` 文件内容示例：

```env
# ============================================
# 云枢中台环境变量配置
# ============================================

# 时区
TZ=Asia/Shanghai

# ---------- PostgreSQL ----------
POSTGRES_DB=yunshu
POSTGRES_USER=yunshu
POSTGRES_PASSWORD=your-strong-db-password-here

# ---------- Redis ----------
REDIS_PASSWORD=your-strong-redis-password-here

# ---------- JWT ----------
# ⚠️ 生产环境必须修改为随机字符串
# 生成命令: openssl rand -hex 32
JWT_SECRET=change-me-to-a-long-random-secret-key-at-least-32-chars
JWT_EXPIRE=86400

# ---------- 前端 ----------
VITE_API_BASE_URL=/api
VITE_APP_TITLE=云枢中台
VITE_ENABLE_MOCK=false

# ---------- 应用 ----------
APP_PORT=8080
LOG_LEVEL=info
```

### 2.4 启动服务

```bash
# 1. 克隆项目
git clone https://github.com/wangfeizong1001/yunshu-platform.git
cd yunshu-platform

# 2. 配置环境变量
cp .env.example .env
vim .env  # 修改密码等敏感信息

# 3. 创建数据目录
mkdir -p data/postgres data/redis data/logs

# 4. 拉取镜像（或构建）并启动
docker compose up -d

# 5. 查看服务状态
docker compose ps

# 6. 查看日志（确认无错误）
docker compose logs -f

# 7. 等待所有服务 healthy
docker compose ps
```

### 2.5 访问系统

启动成功后，访问：

- **管理后台**: http://服务器IP
- **API 文档**: http://服务器IP:8080/swagger-ui.html
- **健康检查**: http://服务器IP:8080/health

**默认账号**（首次启动后请立即修改）:

| 账号 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | 超级管理员 |

### 2.6 停止服务

```bash
# 停止服务（保留数据）
docker compose down

# 停止并删除所有数据（⚠️ 谨慎使用）
docker compose down -v
```

### 2.7 更新服务

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建并启动
docker compose up -d --build

# 3. 查看状态
docker compose ps
```

---

## 三、后端 Dockerfile

```dockerfile
# docker/backend/Dockerfile

# ========== 构建阶段 ==========
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装依赖
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建（如有构建脚本）
RUN pnpm build --filter=@yunshu/server-express

# ========== 运行阶段 ==========
FROM node:20-alpine AS runtime

WORKDIR /app

# 设置时区
RUN apk add --no-cache tzdata curl && \
    cp /usr/share/zoneinfo/${TZ:-Asia/Shanghai} /etc/localtime && \
    echo ${TZ:-Asia/Shanghai} > /etc/timezone

# 复制 package 文件
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装生产依赖
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile --prod

# 从 builder 复制构建产物
COPY --from=builder /app/packages/server-express/dist ./packages/server-express/dist
COPY --from=builder /app/packages/server-core/dist ./packages/server-core/dist

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# 启动命令
CMD ["pnpm", "start:prod"]
```

---

## 四、前端 Dockerfile（Nginx）

```dockerfile
# docker/admin/Dockerfile

# ========== 构建阶段 ==========
FROM node:20-alpine AS builder

WORKDIR /app

# 构建参数
ARG VITE_API_BASE_URL=/api
ARG VITE_APP_TITLE=云枢中台
ARG VITE_ENABLE_MOCK=false

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_ENABLE_MOCK=$VITE_ENABLE_MOCK

# 复制 package 文件
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装依赖
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建前端应用
RUN pnpm build --filter=@yunshu/admin

# ========== 运行阶段 ==========
FROM nginx:1.25-alpine AS runtime

# 设置时区
RUN apk add --no-cache tzdata curl && \
    cp /usr/share/zoneinfo/${TZ:-Asia/Shanghai} /etc/localtime && \
    echo ${TZ:-Asia/Shanghai} > /etc/timezone

# 复制 Nginx 配置
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# 从 builder 复制构建产物
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

---

## 五、Nginx 配置

```nginx
# docker/nginx/default.conf

server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # 日志
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # 开启 gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        application/json
        application/javascript
        application/xml+rss
        image/svg+xml
        font/ttf
        font/otf;

    # 隐藏 Nginx 版本
    server_tokens off;

    # ========== 前端静态资源 ==========
    location / {
        try_files $uri $uri/ /index.html;

        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, max-age=2592000, immutable";
            try_files $uri =404;
        }

        # HTML 不缓存
        location ~* \.html$ {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            expires -1;
        }
    }

    # ========== API 反向代理 ==========
    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 60s;

        # 缓冲区设置
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }

    # ========== WebSocket 支持（如需要）==========
    location /ws/ {
        proxy_pass http://backend:8080/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }

    # ========== 健康检查 ==========
    location = /health {
        access_log off;
        return 200 "OK";
    }

    # ========== 禁止访问隐藏文件 ==========
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 六、生产环境最佳实践

### 6.1 使用 HTTPS

**使用 Let's Encrypt + Certbot 自动获取免费证书**

```bash
# 1. 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 2. 生成证书（替换为你的域名）
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 3. 证书会自动续期（Certbot 会配置 cron job）

# 4. 验证证书
sudo certbot renew --dry-run
```

**HTTPS Nginx 配置示例**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5:!3DES;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # X-Frame-Options
    add_header X-Frame-Options SAMEORIGIN;

    # X-Content-Type-Options
    add_header X-Content-Type-Options nosniff;

    # X-XSS-Protection
    add_header X-XSS-Protection "1; mode=block";

    # ========== 其他配置与上面相同 ==========
    # ... root, gzip, location /, /api/, /health 等
}
```

### 6.2 容器资源限制

```yaml
# docker-compose.yml（更新）
services:
  backend:
    # ... 其他配置 ...
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M

  postgres:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G

  redis:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
```

### 6.3 数据库备份策略

```bash
# scripts/backup-database.sh
#!/bin/bash

# 备份目录
BACKUP_DIR="/data/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="yunshu"
DB_USER="yunshu"
KEEP_DAYS=7

# 创建备份目录
mkdir -p ${BACKUP_DIR}

# 执行备份（使用 docker exec）
docker exec yunshu-postgres pg_dump -U ${DB_USER} ${DB_NAME} \
  | gzip > ${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz

# 删除旧备份
find ${BACKUP_DIR} -name "*.sql.gz" -type f -mtime +${KEEP_DAYS} -delete

# 打印信息
echo "备份完成: ${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz"
ls -lh ${BACKUP_DIR}/
```

**添加到 crontab 定时执行**

```bash
# 编辑 crontab
crontab -e

# 每天凌晨 2 点执行备份
0 2 * * * /path/to/scripts/backup-database.sh >> /var/log/backup.log 2>&1

# 验证
crontab -l
```

### 6.4 日志管理

**集中式日志收集（可选：ELK 或 Loki）**

```yaml
# 添加 Loki 服务
services:
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=your-admin-password
```

**容器日志轮转（配置 Docker daemon）**

```json
// /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}
```

### 6.5 监控与告警

**推荐方案：Prometheus + Grafana**

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./data/prometheus:/prometheus
    ports:
      - "9090:9090"

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: your-grafana-password
```

### 6.6 防火墙配置

```bash
# Ubuntu / Debian 使用 ufw
sudo ufw allow 22/tcp         # SSH
sudo ufw allow 80/tcp         # HTTP
sudo ufw allow 443/tcp        # HTTPS

# 限制内部服务仅本机访问（数据库等不对外暴露）
sudo ufw deny 5432/tcp        # PostgreSQL（内部使用）
sudo ufw deny 6379/tcp        # Redis（内部使用）

sudo ufw enable
sudo ufw status
```

### 6.7 安全加固清单

- [ ] 使用 HTTPS（TLS 1.2+）
- [ ] 设置强密码（数据库、Redis、JWT Secret）
- [ ] 定期更新依赖和系统补丁
- [ ] 配置防火墙，仅开放必要端口
- [ ] 启用容器资源限制
- [ ] 定期备份数据库
- [ ] 配置监控和告警
- [ ] 配置日志轮转
- [ ] 禁用不必要的服务
- [ ] 定期安全审计

---

## 七、常见问题

### Q1: 启动后访问 502 Bad Gateway

**原因**: 后端服务还未完全启动

**解决**:

```bash
# 查看服务状态
docker compose ps

# 查看后端日志
docker compose logs -f backend

# 等待服务健康检查通过
# 确认 backend 服务状态显示 healthy
```

### Q2: PostgreSQL 连接失败

```bash
# 检查 PostgreSQL 状态
docker compose logs postgres

# 手动测试连接
docker exec -it yunshu-postgres psql -U yunshu -d yunshu

# 检查环境变量
docker compose config
```

### Q3: 前端页面空白

```bash
# 检查 Nginx 配置
docker compose exec admin cat /etc/nginx/conf.d/default.conf

# 查看构建产物
docker compose exec admin ls /usr/share/nginx/html

# 查看 Nginx 错误日志
docker compose logs admin | tail -50
```

### Q4: 静态资源缓存问题

```nginx
# 确保 HTML 不缓存
location ~* \.html$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    expires -1;
}
```

### Q5: 容器无法访问外网

```bash
# 检查 Docker 网络
docker network ls
docker network inspect yunshu-platform_yunshu-network

# 重启 Docker
sudo systemctl restart docker
```

---

## 八、部署检查清单

- [ ] 所有敏感信息（密码、密钥）已修改为强随机值
- [ ] HTTPS 已配置（生产环境必须）
- [ ] 数据库备份策略已配置
- [ ] 防火墙已正确配置
- [ ] 容器资源限制已设置
- [ ] 日志轮转已配置
- [ ] 监控和告警已配置
- [ ] 健康检查正常
- [ ] 前端/后端/数据库全部 healthy
- [ ] 默认账号密码已修改
- [ ] API 文档访问控制已配置

---

## 九、升级与回滚

### 9.1 升级流程

```bash
# 1. 备份数据
docker exec yunshu-postgres pg_dump -U yunshu yunshu | gzip > backup-$(date +%Y%m%d).sql.gz

# 2. 拉取最新代码
git pull origin main

# 3. 重新构建并启动（零停机：使用蓝绿部署）
docker compose up -d --build

# 4. 验证
curl http://localhost/health
curl http://localhost:8080/health
```

### 9.2 回滚流程

```bash
# 1. 停掉新容器
docker compose down

# 2. 恢复旧版本代码
git checkout <previous-version-tag>

# 3. 恢复数据库
gunzip < backup-xxx.sql.gz | docker exec -i yunshu-postgres psql -U yunshu yunshu

# 4. 启动旧版本
docker compose up -d
```

---

**相关文档**:
- [快速开始](../getting-started.md)
- [FAQ](../faq.md)
- [开发规范](../DEVELOP.md)

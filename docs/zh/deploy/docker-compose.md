# Docker Compose 部署

本项目使用 Docker Compose 实现一键化部署，包含 PostgreSQL、Redis、后端服务和管理前端四个容器。

## 系统架构

```
┌───────────────────────────────────────────────────────────┐
│                        Docker Network                      │
│  ┌──────────┐    ┌───────────┐    ┌──────────┐   ┌───────┐  │
│  │  Admin   │───▶│  Backend  │───▶│ PostgreSQL │   │ Redis  │  │
│  │  (Port 80) │    │ (Port 8080) │    │ (Port 5432) │   │(6379) │  │
│  └──────────┘    └───────────┘    └──────────┘   └───────┘  │
└───────────────────────────────────────────────────────────┘
```

## 服务清单

| 服务 | 镜像 | 端口映射 | 说明 |
|------|------|----------|------|
| `postgres` | `postgres:16-alpine` | `5432:5432` | 关系型数据库，存储业务数据 |
| `redis` | `redis:7-alpine` | `6379:6379` | 缓存与分布式锁 |
| `backend` | 本地构建 (`Dockerfile`) | `8080:8080` | 后端 API 服务 |
| `admin` | 本地构建 (`apps/admin/Dockerfile`) | `80:80` | 管理前端 |

## 前置要求

| 工具 | 最低版本 | 说明 |
|------|----------|------|
| Docker | 20.10+ | 容器运行时 |
| Docker Compose | 2.0+ | 容器编排工具 |

## 快速部署

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd yunshu
```

### 2. 启动所有服务

```bash
docker-compose up -d
```

### 3. 查看服务状态

```bash
docker-compose ps
```

预期输出应显示所有 4 个服务均为 `Up` 状态。

### 4. 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f postgres
```

### 5. 停止服务

```bash
# 仅停止容器
docker-compose stop

# 停止并删除容器（保留数据卷）
docker-compose down

# 停止并删除容器和数据卷（谨慎使用）
docker-compose down -v
```

## 服务配置详解

### PostgreSQL

```yaml
postgres:
  image: postgres:16-alpine
  container_name: yunshu-postgres
  restart: unless-stopped
  environment:
    POSTGRES_DB: yunshu
    POSTGRES_USER: yunshu
    POSTGRES_PASSWORD: yunshupassword
  ports:
    - "5432:5432"
  volumes:
    - postgres-data:/var/lib/postgresql/data
    - ./docker/postgres/init:/docker-entrypoint-initdb.d
  networks:
    - yunshu-network
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U yunshu -d yunshu"]
    interval: 10s
    timeout: 5s
    retries: 5
```

**关键点**：
- 使用 `postgres:16-alpine` 轻量级镜像
- 数据库名、用户名、密码通过环境变量配置
- 数据持久化到命名卷 `postgres-data`
- 启动时自动执行 `./docker/postgres/init` 目录下的 SQL 脚本
- 健康检查每 10 秒执行一次 `pg_isready`

### Redis

```yaml
redis:
  image: redis:7-alpine
  container_name: yunshu-redis
  restart: unless-stopped
  ports:
    - "6379:6379"
  volumes:
    - redis-data:/data
  networks:
    - yunshu-network
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5
```

**关键点**：
- 使用 `redis:7-alpine` 轻量级镜像
- 数据持久化到命名卷 `redis-data`
- 健康检查通过 `redis-cli ping` 验证

### 后端服务

```yaml
backend:
  build:
    context: .
    dockerfile: Dockerfile
  container_name: yunshu-backend
  restart: unless-stopped
  ports:
    - "8080:8080"
  environment:
    NODE_ENV: production
    DB_HOST: postgres
    DB_PORT: 5432
    DB_NAME: yunshu
    DB_USER: yunshu
    DB_PASSWORD: yunshupassword
    REDIS_HOST: redis
    REDIS_PORT: 6379
  depends_on:
    postgres:
      condition: service_healthy
    redis:
      condition: service_healthy
  networks:
    - yunshu-network
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

**关键点**：
- **依赖顺序**：必须在 PostgreSQL 和 Redis 健康检查通过后才启动
- **数据库连接**：使用服务名 `postgres` 和 `redis` 作为主机名（Docker 网络内部 DNS 解析）
- **健康检查**：调用 `/health` 端点，有 40 秒启动缓冲期

### 管理前端

```yaml
admin:
  build:
    context: .
    dockerfile: apps/admin/Dockerfile
  container_name: yunshu-admin
  restart: unless-stopped
  ports:
    - "80:80"
  depends_on:
    backend:
      condition: service_healthy
  networks:
    - yunshu-network
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
    interval: 30s
    timeout: 10s
    retries: 3
```

**关键点**：
- 依赖后端服务健康检查通过后启动
- 生产环境建议配置 HTTPS 反向代理

## 网络与数据卷

### 网络

```yaml
networks:
  yunshu-network:
    driver: bridge
```

- 所有服务都连接到 `yunshu-network` 桥接网络
- 服务之间可以通过容器名（服务名）互相访问
- 容器之间的通信不需要通过宿主机端口

### 数据卷

```yaml
volumes:
  postgres-data:
  redis-data:
```

- 使用 Docker 命名卷（Named Volume）而非绑定挂载（Bind Mount）
- 数据持久化存储，即使容器删除也保留数据
- 备份和迁移更便捷

## 生产环境优化建议

### 1. 使用环境变量文件

创建 `.env` 文件管理敏感信息：

```bash
# .env
POSTGRES_PASSWORD=your-secure-password
REDIS_PASSWORD=your-redis-password
DB_PASSWORD=your-secure-password
```

在 `docker-compose.yml` 中引用：

```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

### 2. 限制端口暴露

生产环境不建议直接暴露数据库端口：

```yaml
services:
  postgres:
    # ports:   # 注释掉，仅内部访问
    #   - "5432:5432"
  redis:
    # ports:   # 注释掉，仅内部访问
    #   - "6379:6379"
```

### 3. 配置 Redis 密码

```yaml
redis:
  command: >
    redis-server
    --requirepass ${REDIS_PASSWORD}
    --maxmemory 256mb
    --maxmemory-policy allkeys-lru
```

### 4. 使用资源限制

```yaml
services:
  postgres:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 256M
  redis:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
  backend:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
```

### 5. 日志配置

```yaml
x-logging: &default-logging
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

services:
  postgres:
    logging: *default-logging
  # ...其他服务同理
```

## 常用运维命令

### 数据库操作

```bash
# 进入 PostgreSQL 交互模式
docker exec -it yunshu-postgres psql -U yunshu -d yunshu

# 备份数据库
docker exec yunshu-postgres pg_dump -U yunshu yunshu > backup.sql

# 恢复数据库
docker exec -i yunshu-postgres psql -U yunshu -d yunshu < backup.sql

# 查看数据库连接
docker exec yunshu-postgres psql -U yunshu -d yunshu -c "SELECT count(*) FROM pg_stat_activity;"
```

### Redis 操作

```bash
# 进入 Redis CLI
docker exec -it yunshu-redis redis-cli

# 查看键数量
docker exec yunshu-redis redis-cli DBSIZE

# 清空缓存（谨慎使用）
docker exec yunshu-redis redis-cli FLUSHALL

# 查看内存使用
docker exec yunshu-redis redis-cli INFO memory
```

### 容器管理

```bash
# 重启单个服务
docker-compose restart backend

# 重新构建并启动
docker-compose up -d --build backend

# 查看资源使用
docker stats

# 清理未使用的镜像和容器
docker system prune -a
```

## 故障排查

### 服务无法启动

1. **检查容器状态**
   ```bash
   docker-compose ps
   ```

2. **查看详细日志**
   ```bash
   docker-compose logs --tail=100 backend
   ```

3. **验证网络连接**
   ```bash
   # 检查容器是否在正确的网络中
   docker network inspect yunshu-yunshu-network
   ```

### 数据库连接失败

1. **检查 PostgreSQL 健康状态**
   ```bash
   docker exec yunshu-postgres pg_isready -U yunshu -d yunshu
   ```

2. **验证环境变量**
   ```bash
   docker exec yunshu-backend env | grep -E "DB_|REDIS_"
   ```

3. **测试容器间连通性**
   ```bash
   docker exec yunshu-backend ping postgres
   docker exec yunshu-backend nc -zv postgres 5432
   ```

### 缓存不工作

1. **检查 Redis 连接**
   ```bash
   docker exec yunshu-redis redis-cli ping
   ```

2. **查看缓存命中率**
   ```bash
   docker exec yunshu-redis redis-cli INFO stats
   ```

3. **检查键空间**
   ```bash
   docker exec yunshu-redis redis-cli KEYS "*"
   ```

## 安全加固建议

### 1. 修改默认密码

**强烈建议**在部署到生产环境前修改所有默认密码。

### 2. 使用 Docker Secrets（Swarm 模式）

```yaml
secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
  redis_password:
    file: ./secrets/redis_password.txt

services:
  postgres:
    secrets:
      - postgres_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
```

### 3. 配置防火墙

只开放必要的端口（80、443），数据库和缓存端口不对外暴露。

### 4. 定期更新镜像

```bash
# 拉取最新镜像并重建
docker-compose pull
docker-compose up -d

# 清理旧镜像
docker image prune
```

### 5. 启用 HTTPS

生产环境必须使用 HTTPS，建议配置：
- Nginx 反向代理 + Let's Encrypt 证书
- 或使用 Traefik 自动证书管理

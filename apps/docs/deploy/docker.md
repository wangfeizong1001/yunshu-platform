# Docker 部署

使用 Docker 容器化部署 admin 后台。

## Dockerfile

参考 [apps/admin/Dockerfile](file:///workspace/apps/admin/Dockerfile)：

```dockerfile
# 多阶段构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @yunshu/admin build

FROM nginx:1.25-alpine
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
COPY --from=builder /app/apps/admin/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 构建镜像

```bash
# 在项目根目录
docker build -t yunshu-admin:v1.0.0 -f apps/admin/Dockerfile .

# 查看镜像
docker images | grep yunshu-admin
```

## 运行容器

```bash
# 基本运行
docker run -d \
  --name yunshu-admin \
  -p 3000:80 \
  yunshu-admin:v1.0.0

# 完整配置（包含环境变量）
docker run -d \
  --name yunshu-admin \
  -p 3000:80 \
  -e VITE_API_BASE_URL=https://api.example.com \
  -e VITE_APP_TITLE=云枢中台 \
  yunshu-admin:v1.0.0
```

## Docker Compose

`docker-compose.yml`：

```yaml
version: '3.8'

services:
  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
    ports:
      - "3000:80"
    environment:
      - VITE_API_BASE_URL=https://api.example.com
    restart: unless-stopped
    networks:
      - yunshu-net

  # 后续可添加后端服务
  api:
    image: yunshu-api:latest
    ports:
      - "8080:8080"
    networks:
      - yunshu-net

networks:
  yunshu-net:
    driver: bridge
```

启动：

```bash
docker-compose up -d
```

## 镜像推送到阿里云

```bash
# 登录阿里云 Docker Registry
docker login registry.cn-hangzhou.aliyuncr.com \
  --username=your-username \
  --password=your-password

# 打标签
docker tag yunshu-admin:v1.0.0 \
  registry.cn-hangzhou.aliyuncr.com/your-namespace/yunshu-admin:v1.0.0

# 推送
docker push registry.cn-hangzhou.aliyuncr.com/your-namespace/yunshu-admin:v1.0.0
```

## 常用命令

```bash
# 查看容器日志
docker logs -f yunshu-admin

# 进入容器
docker exec -it yunshu-admin sh

# 停止容器
docker stop yunshu-admin

# 删除容器
docker rm yunshu-admin

# 删除镜像
docker rmi yunshu-admin:v1.0.0
```

## 镜像优化建议

1. **多阶段构建**：减小最终镜像体积
2. **使用 alpine 基础镜像**：减小体积约 80%
3. **.dockerignore 文件**：排除 node_modules 等不必要文件
4. **缓存层优化**：先复制 package.json 安装依赖
5. **使用 pnpm**：比 npm 节省 ~50% 空间

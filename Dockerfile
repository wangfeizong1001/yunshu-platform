# ========================================
# Stage 1: Builder - 构建阶段
# 负责安装依赖并编译 TypeScript 源码
# ========================================
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm 包管理器（版本与 package.json 中 packageManager 对齐）
RUN npm install -g pnpm@9.0.0

# 复制 monorepo 配置文件（用于 pnpm workspace）
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY tsconfig.base.json ./
COPY turbo.json ./

# 复制所有 packages 源码（包含 server-express 及其依赖）
COPY packages ./packages
COPY apps ./apps
COPY tools ./tools

# 安装所有依赖（使用 frozen-lockfile 保证版本一致）
RUN pnpm install --frozen-lockfile

# 构建所有包（使用 turbo 的缓存能力，按依赖顺序构建）
RUN pnpm build

# ========================================
# Stage 2: Runner - 运行阶段
# 仅保留构建产物和运行所需依赖，最小化镜像体积
# ========================================
FROM node:20-alpine AS runner

# 设置工作目录
WORKDIR /app

# 设置环境变量（生产环境）
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# 创建非 root 用户（提升安全性，避免以 root 运行应用）
RUN addgroup -g 1001 -S nodejs \
    && adduser -S yunshu -u 1001

# 安装 wget 用于健康检查
RUN apk add --no-cache wget

# 从 builder 阶段复制整个构建后的工作区（保留 pnpm workspace 结构以便依赖解析）
COPY --from=builder /app /app

# 仅保留生产依赖，移除 devDependencies 减小体积
RUN npm install -g pnpm@9.0.0 \
    && pnpm install --frozen-lockfile --prod

# 将应用目录权限授予非 root 用户
RUN chown -R yunshu:nodejs /app

# 切换到非 root 用户
USER yunshu

# 暴露服务端口
EXPOSE 3000

# 健康检查：每 30 秒检查一次 /api/health 接口，超时 5 秒，重试 3 次后标记为 unhealthy
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/health || exit 1

# 启动 Express 后端服务
CMD ["node", "packages/server-express/dist/index.js"]

#!/usr/bin/env bash
# ========================================
# 云枢中台 — 开发环境启动脚本
# ========================================
# 功能：
#   1. 使用 Docker Compose 启动 PostgreSQL 和 Redis 基础设施
#   2. 等待数据库就绪（通过健康检查确认）
#   3. 启动后端 Express 应用开发模式（热更新）
#
# 使用方式：
#   ./scripts/start-dev.sh
#
# 停止方式：
#   docker compose -f docker-compose.dev.yml down
# ========================================

# 严格模式：命令失败立即退出 / 使用未定义变量报错 / 管道命令失败即失败
set -euo pipefail

# ------------------------------------------------------------------------
# 颜色定义（让输出更友好）
# ------------------------------------------------------------------------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'  # No Color

# 日志辅助函数
log_info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ------------------------------------------------------------------------
# 前置检查
# ------------------------------------------------------------------------
log_info "检查运行环境..."

if ! command -v docker &> /dev/null; then
    log_error "未检测到 docker 命令，请先安装 Docker Desktop 或 Docker Engine"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    log_error "未检测到 pnpm 命令，请先安装：npm install -g pnpm@9.0.0"
    exit 1
fi

log_ok "环境检查通过"

# ------------------------------------------------------------------------
# 确保在项目根目录执行
# ------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"
log_info "项目目录：$PROJECT_ROOT"

# ------------------------------------------------------------------------
# [1/3] 启动基础设施服务（PostgreSQL + Redis）
# ------------------------------------------------------------------------
echo ""
log_info "[1/3] 启动 PostgreSQL & Redis 基础设施..."

docker compose -f docker-compose.dev.yml up -d postgres redis

# ------------------------------------------------------------------------
# [2/3] 等待服务就绪
# ------------------------------------------------------------------------
echo ""
log_info "[2/3] 等待服务就绪（最多 60 秒）..."

MAX_WAIT=60
WAIT_COUNT=0
SERVICES_READY=false

while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    # 检查 postgres 健康状态
    PG_STATUS=$(docker inspect --format='{{.State.Health.Status}}' yunshu-dev-postgres 2>/dev/null || echo "unhealthy")
    # 检查 redis 健康状态
    REDIS_STATUS=$(docker inspect --format='{{.State.Health.Status}}' yunshu-dev-redis 2>/dev/null || echo "unhealthy")

    if [ "$PG_STATUS" = "healthy" ] && [ "$REDIS_STATUS" = "healthy" ]; then
        SERVICES_READY=true
        break
    fi

    WAIT_COUNT=$((WAIT_COUNT + 2))
    printf "  等待中... %2s/%ss (postgres: %s, redis: %s)\r" \
        "$WAIT_COUNT" "$MAX_WAIT" "$PG_STATUS" "$REDIS_STATUS"
    sleep 2
done

echo ""
if [ "$SERVICES_READY" = true ]; then
    log_ok "基础设施服务已就绪"
    log_info "  - PostgreSQL: localhost:5432 (user: yunshu, db: yunshu)"
    log_info "  - Redis:      localhost:6379"
else
    log_warn "等待超时，但服务可能仍在启动中，将尝试继续..."
    log_warn "  可手动检查：docker compose -f docker-compose.dev.yml ps"
fi

# ------------------------------------------------------------------------
# [3/3] 启动后端开发服务
# ------------------------------------------------------------------------
echo ""
log_info "[3/3] 启动后端 Express 开发服务..."
log_info "  提示：Ctrl+C 停止后端服务，基础设施容器将继续运行"
log_info "  停止基础设施：docker compose -f docker-compose.dev.yml down"
echo ""

# 使用 exec 替换当前进程（便于 Ctrl+C 正确传递给子进程）
exec pnpm --filter @yunshu/server-express dev

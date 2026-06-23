#!/bin/bash
# ========================================
# 云枢中台 - 一键部署脚本
# ========================================
# 功能：支持本地开发环境启动和 Docker Compose 生产部署
# 使用方式：
#   ./scripts/quick-deploy.sh dev      # 启动本地开发环境
#   ./scripts/quick-deploy.sh prod     # 启动 Docker Compose 生产环境
#   ./scripts/quick-deploy.sh clean    # 清理所有容器和数据
#   ./scripts/quick-deploy.sh status   # 查看服务状态
# ========================================

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info "${BLUE}========================================${NC}"
log_info "${BLUE}     云枢中台 - 一键部署脚本${NC}"
log_info "${BLUE}========================================${NC}"

# 检查命令是否存在
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "请先安装 $1"
        exit 1
    fi
}

# 检查必要依赖
check_dependencies() {
    log_info "检查系统依赖..."
    
    if [[ "$1" == "dev" ]]; then
        check_command node
        check_command pnpm
    elif [[ "$1" == "prod" ]]; then
        check_command docker
        check_command docker-compose
    fi
    
    log_info "依赖检查通过"
}

# 初始化环境变量
init_env() {
    if [[ ! -f .env ]]; then
        log_info "初始化环境变量文件..."
        cp .env.example .env
        
        # 生成随机密码
        POSTGRES_PASSWORD=$(openssl rand -hex 16)
        REDIS_PASSWORD=$(openssl rand -hex 16)
        JWT_SECRET=$(openssl rand -hex 32)
        
        sed -i "s/POSTGRES_PASSWORD=/POSTGRES_PASSWORD=$POSTGRES_PASSWORD/" .env
        sed -i "s/REDIS_PASSWORD=/REDIS_PASSWORD=$REDIS_PASSWORD/" .env
        sed -i "s/JWT_SECRET=/JWT_SECRET=$JWT_SECRET/" .env
        
        log_info "环境变量已生成，密码已写入 .env 文件"
    fi
}

# 本地开发环境启动
start_dev() {
    log_info "启动本地开发环境..."
    
    # 安装依赖
    log_info "安装项目依赖..."
    pnpm install
    
    # 启动开发服务
    log_info "启动开发服务器..."
    log_info "前端管理后台: http://localhost:5173"
    log_info "后端 API: http://localhost:3000"
    
    # 并行启动前端和后端
    pnpm --filter @yunshu/admin dev &
    pnpm --filter @yunshu/server-express dev
    
    wait
}

# Docker Compose 生产部署
start_prod() {
    log_info "启动 Docker Compose 生产环境..."
    
    # 初始化环境变量
    init_env
    
    # 停止旧容器
    log_info "停止现有容器..."
    docker-compose down 2>/dev/null || true
    
    # 构建并启动
    log_info "构建并启动服务..."
    docker-compose up -d --build
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    log_info "检查服务状态..."
    docker-compose ps
    
    log_info "${GREEN}========================================${NC}"
    log_info "${GREEN}         部署完成！${NC}"
    log_info "${GREEN}========================================${NC}"
    log_info "访问地址:"
    log_info "  管理后台: http://localhost/admin"
    log_info "  API 接口: http://localhost/api"
    log_info "  数据库:   localhost:5432 (PostgreSQL)"
    log_info "  缓存:     localhost:6379 (Redis)"
    log_info ""
    log_info "管理命令:"
    log_info "  docker-compose logs -f        # 查看实时日志"
    log_info "  docker-compose down           # 停止服务"
    log_info "  docker-compose restart        # 重启服务"
}

# 清理所有容器和数据
clean_all() {
    log_warn "清理所有容器、镜像和数据卷..."
    
    read -p "确定要删除所有数据吗？(y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "取消操作"
        exit 0
    fi
    
    docker-compose down -v --rmi all
    log_info "清理完成"
}

# 查看服务状态
show_status() {
    log_info "当前服务状态:"
    docker-compose ps
    
    echo ""
    log_info "端口占用情况:"
    ss -tlnp | grep -E ":80|:3000|:5432|:6379" 2>/dev/null || netstat -tlnp | grep -E ":80|:3000|:5432|:6379" 2>/dev/null || echo "无法检测端口状态"
}

# 显示帮助
show_help() {
    echo "云枢中台 - 一键部署脚本"
    echo ""
    echo "使用方式:"
    echo "  $0 dev      启动本地开发环境"
    echo "  $0 prod     启动 Docker Compose 生产环境"
    echo "  $0 clean    清理所有容器和数据"
    echo "  $0 status   查看服务状态"
    echo "  $0 help     显示此帮助信息"
    echo ""
    echo "环境变量配置:"
    echo "  复制 .env.example 为 .env 并修改配置"
    echo "  首次运行 prod 模式会自动生成随机密码"
    echo ""
}

# 主入口
case "${1:-help}" in
    dev)
        check_dependencies dev
        start_dev
        ;;
    prod)
        check_dependencies prod
        start_prod
        ;;
    clean)
        clean_all
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "未知命令: $1"
        show_help
        exit 1
        ;;
esac
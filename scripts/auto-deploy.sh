#!/bin/bash
# ========================================
# 云枢中台 - 一键全自动部署脚本
# ========================================
# 功能：自动克隆仓库 → 安装依赖 → 配置环境 → 启动服务
# 使用方式：
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/wangfeizong1001/yunshu-platform/main/scripts/auto-deploy.sh)"
#   或
#   ./scripts/auto-deploy.sh
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

log_step() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}[$1] $2${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# 检查命令是否存在
check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# 安装系统依赖（Ubuntu/Debian）
install_system_deps() {
    log_step "1/5" "安装系统依赖"
    
    if check_command apt-get; then
        log_info "更新系统包列表..."
        sudo apt-get update -y
        
        # 安装基础依赖
        if ! check_command git; then
            log_info "安装 Git..."
            sudo apt-get install -y git
        fi
        
        if ! check_command docker; then
            log_info "安装 Docker..."
            sudo apt-get install -y docker.io docker-compose
            sudo systemctl start docker
            sudo systemctl enable docker
            sudo usermod -aG docker $USER
        fi
        
        if ! check_command docker-compose; then
            log_info "安装 Docker Compose..."
            sudo apt-get install -y docker-compose
        fi
        
        if ! check_command node; then
            log_info "安装 Node.js..."
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get install -y nodejs
        fi
        
        if ! check_command pnpm; then
            log_info "安装 pnpm..."
            curl -fsSL https://get.pnpm.io/install.sh | sh -
            export PATH="$HOME/.local/share/pnpm:$PATH"
        fi
    else
        log_warn "无法自动安装依赖，请手动安装：git, docker, docker-compose, node, pnpm"
        exit 1
    fi
}

# 克隆仓库
clone_repo() {
    log_step "2/5" "克隆代码仓库"
    
    REPO_URL="https://github.com/wangfeizong1001/yunshu-platform.git"
    REPO_DIR="yunshu-platform"
    
    if [[ -d "$REPO_DIR" ]]; then
        log_info "检测到已存在项目目录"
        log_info "拉取最新代码..."
        cd "$REPO_DIR"
        git pull origin main
    else
        log_info "克隆仓库: $REPO_URL"
        git clone "$REPO_URL" "$REPO_DIR"
        cd "$REPO_DIR"
    fi
    
    log_info "当前分支: $(git rev-parse --abbrev-ref HEAD)"
}

# 安装项目依赖
install_project_deps() {
    log_step "3/5" "安装项目依赖"
    
    log_info "使用 pnpm 安装依赖..."
    pnpm install
}

# 初始化环境变量
init_env() {
    log_step "4/5" "初始化环境变量"
    
    if [[ ! -f .env ]]; then
        log_info "生成环境变量文件..."
        cp .env.example .env
        
        # 生成随机密码
        POSTGRES_PASSWORD=$(openssl rand -hex 16)
        REDIS_PASSWORD=$(openssl rand -hex 16)
        JWT_SECRET=$(openssl rand -hex 32)
        
        sed -i "s/POSTGRES_PASSWORD=/POSTGRES_PASSWORD=$POSTGRES_PASSWORD/" .env
        sed -i "s/REDIS_PASSWORD=/REDIS_PASSWORD=$REDIS_PASSWORD/" .env
        sed -i "s/JWT_SECRET=/JWT_SECRET=$JWT_SECRET/" .env
        
        log_info "环境变量已生成"
    else
        log_info "环境变量文件已存在，跳过初始化"
    fi
}

# 启动生产环境
start_production() {
    log_step "5/5" "启动生产环境"
    
    log_info "停止现有容器..."
    docker-compose down 2>/dev/null || true
    
    log_info "构建并启动服务..."
    docker-compose up -d --build
    
    log_info "等待服务启动..."
    sleep 15
    
    # 检查服务状态
    log_info "检查服务状态..."
    docker-compose ps
    
    # 检查服务健康
    log_info "检查服务健康状态..."
    if check_command curl; then
        sleep 5
        if curl -s http://localhost:80/health > /dev/null; then
            log_info "Nginx 服务正常"
        else
            log_warn "Nginx 服务可能未完全启动"
        fi
        
        if curl -s http://localhost:3000/api/health > /dev/null; then
            log_info "后端 API 服务正常"
        else
            log_warn "后端 API 服务可能未完全启动"
        fi
    fi
}

# 显示完成信息
show_completion() {
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}         🎉 一键部署完成！🎉${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}访问地址:${NC}"
    echo -e "  管理后台: ${GREEN}http://localhost/admin${NC}"
    echo -e "  API 接口: ${GREEN}http://localhost/api${NC}"
    echo -e "  数据库:   ${GREEN}localhost:5432${NC} (PostgreSQL)"
    echo -e "  缓存:     ${GREEN}localhost:6379${NC} (Redis)"
    echo ""
    echo -e "${BLUE}管理命令:${NC}"
    echo -e "  docker-compose logs -f        # 查看实时日志"
    echo -e "  docker-compose down           # 停止服务"
    echo -e "  docker-compose restart        # 重启服务"
    echo ""
    echo -e "${BLUE}项目目录:${NC} $(pwd)"
    echo ""
}

# 主函数
main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  云枢中台 - 一键全自动部署脚本${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    log_info "开始全自动部署流程..."
    
    # 步骤1: 安装系统依赖
    install_system_deps
    
    # 步骤2: 克隆/更新仓库
    clone_repo
    
    # 步骤3: 安装项目依赖
    install_project_deps
    
    # 步骤4: 初始化环境变量
    init_env
    
    # 步骤5: 启动生产环境
    start_production
    
    # 显示完成信息
    show_completion
}

# 运行主函数
main "$@"
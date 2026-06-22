#!/bin/bash
# 云枢中台部署脚本
# 使用方式: ./scripts/deploy-cloud.sh [环境]

set -e

# 配置
SERVER_IP="120.48.97.237"
SERVER_USER="root"
SERVER_PORT="22"
DEPLOY_PATH="/var/www/yunshu-platform"
BACKUP_PATH="/var/www/yunshu-platform-backup"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# 远程执行命令
remote_exec() {
    ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_IP} "$1"
}

# 上传文件
upload_file() {
    local local_path=$1
    local remote_path=$2
    scp -P ${SERVER_PORT} -r ${local_path} ${SERVER_USER}@${SERVER_IP}:${remote_path}
}

# 部署函数
deploy() {
    log_info "开始部署云枢中台..."
    
    # 1. 创建远程目录
    log_info "创建远程目录..."
    remote_exec "mkdir -p ${DEPLOY_PATH} ${BACKUP_PATH}"
    
    # 2. 备份当前版本
    log_info "备份当前版本..."
    remote_exec "if [ -d '${DEPLOY_PATH}' ]; then cp -r ${DEPLOY_PATH} ${BACKUP_PATH}/backup-$(date +%Y%m%d%H%M%S); fi"
    
    # 3. 构建项目
    log_info "构建项目..."
    pnpm build 2>/dev/null || npm run build 2>/dev/null || yarn build
    
    # 4. 上传构建产物
    log_info "上传构建产物..."
    upload_file "apps/admin/dist" "${DEPLOY_PATH}/admin"
    upload_file "apps/docs/.vitepress/dist" "${DEPLOY_PATH}/docs"
    
    # 5. 配置 Nginx
    log_info "配置 Nginx..."
    remote_exec "cat > /etc/nginx/conf.d/yunshu.conf << 'EOF'
server {
    listen 80;
    server_name _;
    
    # 管理后台
    location /admin {
        alias ${DEPLOY_PATH}/admin;
        try_files \$uri \$uri/ /admin/index.html;
    }
    
    # 文档站
    location /docs {
        alias ${DEPLOY_PATH}/docs;
        try_files \$uri \$uri/ /docs/index.html;
    }
    
    # API 代理
    location /api {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    # 前端静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    root ${DEPLOY_PATH}/admin;
    index index.html;
}
EOF"
    
    # 6. 测试并重载 Nginx
    log_info "测试并重载 Nginx..."
    remote_exec "nginx -t && systemctl reload nginx"
    
    log_info "部署完成!"
    log_info "访问地址:"
    log_info "  管理后台: http://${SERVER_IP}/admin"
    log_info "  文档站:   http://${SERVER_IP}/docs"
}

# 回滚函数
rollback() {
    log_info "回滚到上一个版本..."
    remote_exec "if [ -d '${BACKUP_PATH}' ]; then cp -r \$(ls -t ${BACKUP_PATH} | head -1)/* ${DEPLOY_PATH}/; systemctl reload nginx; fi"
    log_info "回滚完成!"
}

# 显示帮助
show_help() {
    echo "云枢中台部署脚本"
    echo ""
    echo "使用方式:"
    echo "  $0 deploy    部署到云服务器"
    echo "  $0 rollback  回滚到上一版本"
    echo ""
}

# 主入口
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    rollback)
        rollback
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

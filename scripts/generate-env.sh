#!/usr/bin/env bash
# ========================================
# 云枢中台 — 生成 .env 配置文件
# ========================================
# 功能：
#   - 若 .env 不存在：从 .env.example 复制一份
#   - 若 .env 已存在：跳过并提示
#   - 提醒用户修改 JWT_SECRET 等敏感配置
#
# 使用方式：
#   ./scripts/generate-env.sh
# ========================================

set -euo pipefail

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }

# ------------------------------------------------------------------------
# 确保在项目根目录执行
# ------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

ENV_FILE="$PROJECT_ROOT/.env"
ENV_EXAMPLE_FILE="$PROJECT_ROOT/.env.example"

# ------------------------------------------------------------------------
# 检查 .env.example 是否存在
# ------------------------------------------------------------------------
if [ ! -f "$ENV_EXAMPLE_FILE" ]; then
    echo -e "${YELLOW}[WARN]${NC} 未找到 .env.example，无法生成 .env"
    exit 1
fi

# ------------------------------------------------------------------------
# 复制或跳过
# ------------------------------------------------------------------------
if [ ! -f "$ENV_FILE" ]; then
    cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
    log_ok "已创建 .env 文件（基于 .env.example）"
    log_info "  路径：$ENV_FILE"
else
    log_warn ".env 已存在，跳过创建（如需重新生成请先手动删除）"
    log_info "  路径：$ENV_FILE"
fi

# ------------------------------------------------------------------------
# JWT_SECRET 提示与自动生成（可选）
# ------------------------------------------------------------------------
echo ""
log_info "安全提示："
echo "  - 生产环境务必修改 JWT_SECRET 为强随机字符串"
echo "  - 可通过以下命令生成随机密钥："
echo "      node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""

# 若当前系统安装了 node，自动生成一个随机密钥示例供参考
if command -v node &> /dev/null; then
    RANDOM_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
    echo ""
    log_info "建议的随机密钥（可复制替换 .env 中的 JWT_SECRET）："
    echo "  JWT_SECRET=$RANDOM_SECRET"
fi

echo ""
log_ok "完成！请根据实际环境编辑 $ENV_FILE"

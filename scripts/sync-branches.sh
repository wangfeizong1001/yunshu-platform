#!/bin/bash
#===============================================================================
# 云枢中台 - 分支同步脚本
#
# 用途：同步 Pre-merge-to-main 分支到 develop（保持同步）
#      以及同步 develop 分支到 Pre-merge-to-main（准备发布）
#
# 使用方法：
#   ./scripts/sync-branches.sh sync-to-develop    # Pre-merge-to-main -> develop
#   ./scripts/sync-branches.sh sync-to-release    # develop -> Pre-merge-to-main
#   ./scripts/sync-branches.sh create-pr          # 创建 PR
#
#===============================================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 分支名称
RELEASE_BRANCH="Pre-merge-to-main"
DEVELOP_BRANCH="develop"
MAIN_BRANCH="main"

# 打印带颜色的消息
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 git 状态
check_git() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "请在 git 仓库根目录执行此脚本"
        exit 1
    fi
}

# 拉取最新代码
pull_latest() {
    log_info "拉取最新代码..."
    git fetch origin
    git fetch --tags origin
}

# 同步到 develop 分支 (Pre-merge-to-main -> develop)
sync_to_develop() {
    log_info "同步 Pre-merge-to-main 到 develop..."

    # 确保在 develop 分支
    git checkout $DEVELOP_BRANCH
    git pull origin $DEVELOP_BRANCH

    # 合并 Pre-merge-to-main
    log_info "合并 $RELEASE_BRANCH 到 $DEVELOP_BRANCH..."
    git merge --no-ff origin/$RELEASE_BRANCH -m "merge: 同步发布流程到 develop"

    # 推送
    log_info "推送到远端..."
    git push origin $DEVELOP_BRANCH

    log_success "同步完成！"
}

# 同步到 Pre-merge-to-main 分支 (develop -> Pre-merge-to-main)
sync_to_release() {
    log_info "同步 develop 到 Pre-merge-to-main（准备发布）..."

    # 确保在 Pre-merge-to-main 分支
    git checkout $RELEASE_BRANCH
    git pull origin $RELEASE_BRANCH

    # 合并 develop
    log_info "合并 $DEVELOP_BRANCH 到 $RELEASE_BRANCH..."
    git merge --no-ff origin/$DEVELOP_BRANCH -m "merge: 准备发布，从 develop 同步"

    # 推送
    log_info "推送到远端..."
    git push origin $RELEASE_BRANCH

    log_success "同步完成！"
}

# 发布到 main 分支
publish_to_main() {
    VERSION=${1:-"v0.0.1"}

    log_info "发布到 main 分支..."

    # 确保在 main 分支
    git checkout $MAIN_BRANCH
    git pull origin $MAIN_BRANCH

    # 合并 Pre-merge-to-main
    log_info "合并 $RELEASE_BRANCH 到 $MAIN_BRANCH..."
    git merge --no-ff origin/$RELEASE_BRANCH -m "release: $VERSION 正式发布"

    # 创建标签
    log_info "创建标签 $VERSION..."
    git tag -a $VERSION -m "$VERSION 正式发布"

    # 推送
    log_info "推送到远端..."
    git push origin $MAIN_BRANCH
    git push origin $VERSION

    # 同步回 develop
    log_info "同步回 develop 分支..."
    git checkout $DEVELOP_BRANCH
    git merge --no-ff $MAIN_BRANCH -m "merge: 同步发布后的更改"
    git push origin $DEVELOP_BRANCH

    # 同步到 Pre-merge-to-main
    log_info "同步到 Pre-merge-to-main..."
    git checkout $RELEASE_BRANCH
    git merge --no-ff $MAIN_BRANCH
    git push origin $RELEASE_BRANCH

    log_success "发布完成！版本: $VERSION"
}

# 显示帮助信息
show_help() {
    echo "云枢中台 - 分支同步脚本"
    echo ""
    echo "用法: $0 <命令>"
    echo ""
    echo "命令:"
    echo "  sync-to-develop     同步 Pre-merge-to-main 到 develop（同步发布流程）"
    echo "  sync-to-release     同步 develop 到 Pre-merge-to-main（准备发布）"
    echo "  publish-to-main     发布到 main 分支（需要指定版本号）"
    echo "  help               显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 sync-to-develop"
    echo "  $0 sync-to-release"
    echo "  $0 publish-to-main v1.0.0"
    echo ""
}

# 主逻辑
main() {
    check_git

    case "${1:-help}" in
        sync-to-develop)
            pull_latest
            sync_to_develop
            ;;
        sync-to-release)
            pull_latest
            sync_to_release
            ;;
        publish-to-main)
            pull_latest
            publish_to_main $2
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"

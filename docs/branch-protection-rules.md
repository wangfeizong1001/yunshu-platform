# GitHub 分支保护规则配置
# 
# 此文件用于文档记录，实际配置需要在 GitHub 仓库 Settings 中设置
# Settings -> Branches -> Branch protection rules -> Add rule
#
# 或者使用 GitHub CLI 配置:
# gh api repos/{owner}/{repo}/branches/{branch}/protection -X PUT -f required_status_checks='{"strict":true,"contexts":["ci"]}' -f enforce_admins=true -f required_pull_request_reviews='{"required_approving_review_count":1}'
#
#===============================================================================

#------------------------------------------------------------------------------
# main 分支 - 最高保护级别
#------------------------------------------------------------------------------
Branch name pattern: main

保护设置:
  # 1. 需要通过 PR 合并
  Require pull request reviews before merging: ✅
    Required approving reviews: 1
  
  # 2. 需要状态检查通过
  Require status checks to pass before merging: ✅
    Require branches to be up to date before merging: ✅
    Status checks:
      - ci (lint, type-check, test, build)
  
  # 3. 禁止强制推送
  Allow force pushes: ❌
  
  # 4. 允许删除分支
  Allow deletions: ❌
  
  # 5. 要求管理员也通过审查
  Include administrators: ✅

#------------------------------------------------------------------------------
# Pre-merge-to-main 分支 - 高级保护
#------------------------------------------------------------------------------
Branch name pattern: Pre-merge-to-main

保护设置:
  # 1. 需要通过 PR 合并
  Require pull request reviews before merging: ✅
    Required approving reviews: 1
  
  # 2. 需要状态检查通过
  Require status checks to pass before merging: ✅
    Require branches to be up to date before merging: ✅
    Status checks:
      - ci
      - staging-deploy
  
  # 3. 禁止强制推送
  Allow force pushes: ❌
  
  # 4. 允许删除分支
  Allow deletions: ❌
  
  # 5. 要求管理员也通过审查
  Include administrators: ✅

#------------------------------------------------------------------------------
# develop 分支 - 中级保护
#------------------------------------------------------------------------------
Branch name pattern: develop

保护设置:
  # 1. 需要通过 PR 合并
  Require pull request reviews before merging: ✅
    Required approving reviews: 1
  
  # 2. 需要状态检查通过
  Require status checks to pass before merging: ✅
    Require branches to be up to date before merging: ❌
    Status checks:
      - ci
  
  # 3. 禁止强制推送
  Allow force pushes: ❌
  
  # 4. 允许删除分支
  Allow deletions: ❌
  
  # 5. 要求管理员也通过审查
  Include administrators: ❌

#------------------------------------------------------------------------------
# 功能分支规则 - 自动匹配
#------------------------------------------------------------------------------
Branch name pattern: *

保护设置:
  # 功能分支不设置强制保护，但建议:
  # - feature/*, fix/*, release/*, hotfix/* 可以直接推送
  # - 需要合并时通过 PR 进行审查

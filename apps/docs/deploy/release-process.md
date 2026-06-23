# 发布流程

## 概述

本项目采用三层 GitFlow 发布模型，确保代码在合并到生产分支 `main` 前经过充分的验证和审查。

## 分支模型

```
feature/fix → develop → Pre-merge to main → main
                ↑              ↓
                └──────────────┘ (同步)
```

### 分支职责

| 分支 | 职责 | 保护级别 |
|------|------|----------|
| `main` | 生产环境，存储已发布版本 | 最高保护 |
| `Pre-merge to main` | 预发布分支，代码冻结并经过严格验证 | 高级保护 |
| `develop` | 日常开发整合分支 | 中级保护 |
| `feature/*` | 功能开发分支 | 无保护 |
| `fix/*` | Bug 修复分支 | 无保护 |
| `release/*` | 发布准备分支 | 无保护 |
| `hotfix/*` | 生产紧急修复 | 无保护 |

## 发布流程

### 1. 常规发布

#### 第一步：功能开发完成后合并到 develop

```bash
# 在 feature 分支完成开发
git checkout develop
git pull origin develop
git merge --no-ff feature/your-feature
git push origin develop
```

#### 第二步：从 develop 创建预发布分支

```bash
git checkout develop
git pull origin develop
git checkout -b Pre-merge-to-main
git push origin Pre-merge-to-main
```

#### 第三步：预发布环境验证

- CI 自动运行：Lint、单元测试、构建检查、E2E 测试
- 手动验证：Staging 环境部署、回归测试、性能测试
- 团队代码审查：所有 PR 必须有至少 1 个 Approve

#### 第四步：合并预发布分支到 main

```bash
# 确保 Pre-merge-to-main 分支所有测试通过
git checkout main
git pull origin main
git merge --no-ff Pre-merge-to-main
git tag -a v1.0.0 -m "版本 1.0.0 发布"
git push origin main --tags
```

#### 第五步：同步 main 回 develop

```bash
git checkout develop
git merge --no-ff main
git push origin develop
```

### 2. 紧急修复（Hotfix）

#### 紧急修复分支创建

```bash
git checkout main
git pull origin main
git checkout -b hotfix/v1.0.1
```

#### 修复后合并

```bash
# 合并到 main
git checkout main
git merge --no-ff hotfix/v1.0.1
git tag -a v1.0.1 -m "紧急修复"
git push origin main --tags

# 同步到 develop
git checkout develop
git merge --no-ff hotfix/v1.0.1
git push origin develop

# 同步到 Pre-merge-to-main（如果有）
git checkout Pre-merge-to-main
git merge --no-ff hotfix/v1.0.1
git push origin Pre-merge-to-main
```

## 自动化 CI/CD

### CI 工作流（Pull Request 触发）

- ESLint 代码检查
- TypeScript 类型检查
- 单元测试（覆盖率 ≥ 80%）
- 构建验证
- 集成测试

### Staging 部署（合并到 Pre-merge-to-main 触发）

- 自动部署到预发布环境
- 自动化端到端测试
- 性能基线检查

### Production 部署（合并到 main 触发）

- 自动构建生产版本
- 自动部署到生产环境
- 发布后通知团队

## 版本号规范

采用 [语义化版本控制](https://semver.org/)：

- **MAJOR**：不兼容的 API 变更
- **MINOR**：向后兼容的功能性新增
- **PATCH**：向后兼容的问题修复

示例：

```bash
v1.0.0    # 主版本
v1.1.0    # 次版本
v1.1.1    # 修订版本
v2.0.0-alpha.1  # 预发布版本
```

## 发布检查清单

- [ ] 所有单元测试通过
- [ ] 集成测试通过
- [ ] E2E 测试通过
- [ ] 测试覆盖率 ≥ 80%
- [ ] 代码审查完成（至少 1 人 Approve）
- [ ] CHANGELOG.md 已更新
- [ ] 版本号已正确更新
- [ ] package.json 中版本号已更新
- [ ] 文档已同步更新
- [ ] Staging 环境验证通过
- [ ] 数据库迁移脚本准备就绪（如适用）
- [ ] 监控和日志配置已就绪

## 回滚策略

### 自动回滚

如果 Production 部署后 5 分钟内检测到错误率超过 1%：

1. GitHub Actions 自动触发回滚工作流
2. 恢复到上一个稳定版本
3. 通知相关人员

### 手动回滚

```bash
# 回滚到上一个版本
git checkout main
git revert <commit-hash>
git tag -a v1.0.1 -m "回滚到 v1.0.0"
git push origin main --tags
```

## 同步脚本

项目提供 `scripts/sync-branches.sh` 脚本，支持以下命令：

```bash
# 同步 develop 到 Pre-merge-to-main
./scripts/sync-branches.sh sync-to-release

# 同步 main 回 develop
./scripts/sync-branches.sh sync-to-develop

# 发布到 main
./scripts/sync-branches.sh publish-to-main
```

## 常见问题

### Q: 紧急修复如何处理？

A: 使用 hotfix 分支从 main 创建，修复后同时合并到 main、develop、Pre-merge-to-main 三个分支。

### Q: 预发布分支如何处理冲突？

A: 在 Pre-merge-to-main 分支上执行 rebase develop 解决冲突，然后重新推送。

### Q: 版本号如何管理？

A: 使用 `npm version` 命令自动更新版本号，并自动创建 git tag。

## 相关文档

- [分支保护规则](https://github.com/wangfeizong1001/yunshu-platform/blob/main/docs/branch-protection-rules.md)
- [Docker 部署](./docker.md)
- [Nginx 配置](./nginx.md)
- [CI/CD 流程](./cicd.md)

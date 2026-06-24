# 云枢中台 — 发布流程规范

> 文档编号：`YUNSHU-RELEASE-2026-06-v1`
> 创建日期：2026-06-22
> 负责人：前端团队

---

## 一、分支模型

```
┌─────────────────────────────────────────────────────────────────┐
│                          main                                    │
│                   (生产环境，稳定版本)                              │
│                    受保护，禁止直接推送                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │ 手动触发/审核后合并
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Pre-merge to main                            │
│               (预发布分支，发布前最终审核)                         │
│                  受保护，需要 PR 审查                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │ 开发完成，经过完整测试
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                          develop                                  │
│                     (开发集成分支)                                │
│                  所有功能分支合并到此                              │
└─────────────────────────────────────────────────────────────────┘
                      ▲
                      │ feature/fix/release/hotfix 分支
┌─────────────────────────────────────────────────────────────────┐
│   feature/*  │  fix/*  │  release/*  │  hotfix/*              │
│              (功能/修复/发布/紧急修复分支)                         │
└─────────────────────────────────────────────────────────────────┘
```

### 分支说明

| 分支名称 | 用途 | 保护级别 | 合并来源 |
|----------|------|----------|----------|
| `main` | 生产环境稳定版本 | 最高保护，禁止直接推送 | `Pre-merge to main` |
| `Pre-merge to main` | 预发布审核分支 | 高级保护，禁止直接推送 | `develop` |
| `develop` | 开发集成分支 | 中级保护，禁止直接推送 | 功能分支 |
| `feature/*` | 功能开发分支 | 可自由推送 | 从 `develop` 创建 |
| `fix/*` | Bug 修复分支 | 可自由推送 | 从 `develop` 创建 |
| `release/*` | 发布准备分支 | 可自由推送 | 从 `develop` 创建 |
| `hotfix/*` | 紧急修复分支 | 可自由推送 | 从 `main` 创建 |

---

## 二、发布流程

### 2.1 常规发布流程

```
develop ──▶ Pre-merge to main ──▶ main
    │              │                   │
    │              │                   │
    │         代码审查              正式发布
    │         CI 检查            生产环境部署
    │         人工审核
```

#### Step 1：准备发布 (develop 分支)

```bash
# 1. 确保 develop 分支是最新的
git checkout develop
git pull origin develop

# 2. 运行完整检查
pnpm lint                    # 代码风格检查
pnpm lint:style             # 样式检查
pnpm type-check              # TypeScript 类型检查
pnpm test                    # 单元测试
pnpm build                   # 构建验证

# 3. 更新 CHANGELOG.md
# 4. 更新版本号 (如需要)
```

#### Step 2：创建 Pre-merge to main 分支

```bash
# 1. 从 develop 创建预发布分支
git checkout develop
git checkout -b Pre-merge-to-main

# 2. 推送预发布分支
git push origin Pre-merge-to-main
```

#### Step 3：预发布审核

1. **创建 Pull Request**
   - 源分支：`develop`
   - 目标分支：`Pre-merge-to-main`
   - PR 标题格式：`release: v{x.y.z} 预发布审核`

2. **审核内容**
   - [ ] 代码审查通过
   - [ ] 所有 CI 检查通过
   - [ ] 功能测试通过
   - [ ] CHANGELOG.md 已更新
   - [ ] 版本号已更新

3. **合并到 Pre-merge to main**
   ```bash
   # 审核通过后合并
   git checkout Pre-merge-to-main
   git merge --no-ff develop
   git push origin Pre-merge-to-main
   ```

#### Step 4：最终发布 (Pre-merge to main → main)

1. **创建 Release Pull Request**
   - 源分支：`Pre-merge-to-main`
   - 目标分支：`main`
   - PR 标题格式：`release: v{x.y.z} 正式发布`

2. **发布前最终检查**
   - [ ] 预发布分支 CI 全部通过
   - [ ] 预发布环境测试通过
   - [ ] 文档已更新
   - [ ] 版本号已确认

3. **合并到 main 并打标签**
   ```bash
   # 合并到 main
   git checkout main
   git merge --no-ff Pre-merge-to-main

   # 创建版本标签
   git tag -a v{x.y.z} -m "版本 {x.y.z} 正式发布"
   git push origin main --tags

   # 合并回 develop
   git checkout develop
   git merge --no-ff Pre-merge-to-main
   git push origin develop
   ```

---

### 2.2 紧急修复流程

```
main ──▶ hotfix/* ──▶ develop + main
              │
              └── PR审查 ──▶ Pre-merge to main (如需要)
```

```bash
# 1. 从 main 创建紧急修复分支
git checkout main
git pull origin main
git checkout -b hotfix/v1.0.1

# 2. 修复问题并提交
git add .
git commit -m "fix: 紧急修复生产环境问题"

# 3. 推送到远端
git push origin hotfix/v1.0.1

# 4. 创建 PR 合并到 main (跳过 Pre-merge to main)
# 或按正常流程经过 Pre-merge to main

# 5. 合并到 main 并打标签
git checkout main
git merge --no-ff hotfix/v1.0.1
git tag -a v1.0.1 -m "紧急修复 v1.0.1"
git push origin main --tags

# 6. 合并回 develop
git checkout develop
git merge --no-ff hotfix/v1.0.1
git push origin develop

# 7. 删除紧急修复分支
git branch -d hotfix/v1.0.1
git push origin :hotfix/v1.0.1
```

---

## 三、CI/CD 自动化

### 3.1 工作流触发条件

| 工作流 | 触发条件 | 说明 |
|--------|----------|------|
| `ci.yml` | push/PR 到 main/develop/Pre-merge-to-main | 代码检查、测试、构建 |
| `release.yml` | push 到 Pre-merge-to-main | 预发布环境部署 |
| `deploy.yml` | push 到 main | 生产环境部署 |

### 3.2 发布检查清单

#### Pre-merge to main 阶段
- [ ] `pnpm lint` 通过
- [ ] `pnpm lint:style` 通过
- [ ] `pnpm type-check` 通过
- [ ] `pnpm test` 全部通过
- [ ] `pnpm build` 构建成功
- [ ] 代码审查通过 (至少 1 人审批)
- [ ] CHANGELOG.md 已更新
- [ ] 版本号已更新

#### main 阶段 (最终发布)
- [ ] Pre-merge to main 所有 CI 通过
- [ ] 预发布环境测试通过
- [ ] 最终人工审核通过
- [ ] 文档完整
- [ ] 版本标签已创建
- [ ] 变更日志已归档

---

## 四、版本号规范

### 4.1 语义化版本

```
v{MAJOR}.{MINOR}.{PATCH}

- MAJOR: 不兼容的重大变更
- MINOR: 向后兼容的功能新增
- PATCH: 向后兼容的问题修复
```

### 4.2 版本示例

| 版本 | 说明 |
|------|------|
| `v1.0.0` | 初始正式版本 |
| `v1.0.1` | 修复第一个 bug |
| `v1.1.0` | 新增功能 (向后兼容) |
| `v2.0.0` | 重大版本，不兼容 |

---

## 五、GitHub Actions 工作流

### 5.1 CI 工作流 (ci.yml)

```yaml
name: CI

on:
  push:
    branches: [main, develop, Pre-merge-to-main]
  pull_request:
    branches: [main, develop, Pre-merge-to-main]

jobs:
  # 代码检查
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm lint:style
      - run: pnpm type-check

  # 测试
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm test -- --run

  # 构建
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm build
```

### 5.2 预发布工作流 (staging.yml)

```yaml
name: Staging Deploy

on:
  push:
    branches: [Pre-merge-to-main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      # 部署到预发布环境
```

### 5.3 生产发布工作流 (production.yml)

```yaml
name: Production Release

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      # 部署到生产环境
```

---

## 六、问题处理

### 6.1 合并冲突

```bash
# 1. 更新最新代码
git fetch origin

# 2. 切换到目标分支
git checkout develop

# 3. 合并冲突分支
git merge origin/feature/xxx

# 4. 解决冲突后
git add .
git commit -m "merge: 解决与 feature/xxx 的合并冲突"

# 5. 推送
git push origin develop
```

### 6.2 回滚

```bash
# 回滚到上一个版本
git revert HEAD
git push origin develop

# 回滚特定提交
git revert <commit-hash>
git push origin develop
```

### 6.3 标签管理

```bash
# 查看所有标签
git tag -l

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin :refs/tags/v1.0.0

# 创建带注释的标签
git tag -a v1.0.0 -m "正式发布 v1.0.0"

# 推送标签到远程
git push origin v1.0.0
```

---

## 七、流程总结

```
1. 开发完成 ──▶ push 到功能分支 ──▶ PR 合并到 develop
                                                      │
2. 准备发布 ──▶ 从 develop 创建 Pre-merge to main ──▶ PR 审核
                                                                    │
3. 审核通过 ──▶ 合并到 Pre-merge to main ──▶ CI 自动化测试
                                                                    │
4. 测试通过 ──▶ PR 合并到 main ──▶ 打标签发布
                                                                    │
5. 完成发布 ──▶ 合并回 develop ──▶ 删除临时分支
```

# CI/CD 流程

云枢中台使用 GitHub Actions 自动化 CI/CD 流程。

## 工作流总览

| 工作流 | 触发条件 | 作用 |
|--------|----------|------|
| `ci.yml` | push/PR 到 main/develop/Pre-merge-to-main | 代码检查、测试、构建 |
| `staging.yml` | push 到 Pre-merge-to-main | 预发布环境部署 |
| `production.yml` | push 到 main 或 tag v* | 生产环境发布 |
| `release-process.md` | 文档 | 发布流程规范 |

## CI 工作流

[.github/workflows/ci.yml](file:///workspace/.github/workflows/ci.yml) 包含以下 job：

### 1. 代码检查

```yaml
lint:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - run: pnpm install
    - run: pnpm lint          # ESLint
    - run: pnpm lint:style   # Stylelint
    - run: pnpm type-check   # TypeScript
```

### 2. 单元测试

```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - run: pnpm install
    - run: pnpm test -- --run
```

### 3. 构建验证

```yaml
build:
  runs-on: ubuntu-latest
  needs: [lint, test]
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - run: pnpm install
    - run: pnpm build
```

## 预发布工作流

[.github/workflows/staging.yml](file:///workspace/.github/workflows/staging.yml)：

```yaml
name: Staging Deploy
on:
  push:
    branches: [Pre-merge-to-main]

jobs:
  staging-deploy:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @yunshu/admin build
      # 部署到预发布环境
```

## 生产工作流

[.github/workflows/production.yml](file:///workspace/.github/workflows/production.yml)：

```yaml
name: Production Release
on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: softprops/action-gh-release@v1
        with:
          tag_name: ${{ github.ref_name }}
          generate_release_notes: true
```

## 完整发布流程

```
1. 开发完成
   └─> feature/xxx 推送到远端
   └─> 创建 PR 合并到 develop
       └─> CI 自动运行
       └─> Code Review

2. 准备发布
   └─> 从 develop 创建 Pre-merge-to-main
   └─> PR 审核
   └─> staging.yml 自动部署到预发布环境

3. 正式发布
   └─> PR 合并到 main
   └─> production.yml 自动部署到生产环境
   └─> 创建 GitHub Release

4. 同步回 develop
   └─> main 同步回 develop
   └─> 删除临时分支
```

## 镜像加速配置

`package.json` 中已配置 npm 镜像：

```json
{
  "packageManager": "pnpm@9.0.0"
}
```

GitHub Actions 中默认使用官方 registry，如有需要可配置：

```yaml
env:
  REGISTRY: https://registry.npmmirror.com
```

## 缓存优化

使用 pnpm 缓存加速：

```yaml
- uses: pnpm/action-setup@v4
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'
```

## 详细文档

- 📖 [发布流程规范](file:///workspace/docs/release-process.md)
- 📖 [分支保护规则](file:///workspace/docs/branch-protection-rules.md)
- 📖 [分支同步脚本](file:///workspace/scripts/sync-branches.sh)

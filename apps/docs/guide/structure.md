# 项目结构

## 推荐的项目结构

```
my-app/
├── src/
│   ├── api/               # API 模块
│   │   ├── http.ts         # HttpClient 实例
│   │   └── user.api.ts     # 业务 API
│   ├── components/         # 业务组件
│   ├── composables/        # 组合式函数
│   ├── layouts/            # 布局组件
│   ├── views/              # 页面
│   ├── styles/
│   │   └── theme.css       # 导入 'yunshu/design-tokens/css'
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 分层原则

```
视图层 (views)     → 页面组合
  ├── 业务组件层 (components) → 领域逻辑
  ├── 通用组件层 (@yunshu/ui) → UI 组件
  └── 基础层 (@yunshu/design-tokens) → 设计令牌
```

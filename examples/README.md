# 云枢中台示例目录

本目录包含云枢中台的各种使用示例。

## 目录结构

```
examples/
├── basic/          # 基础示例
│   ├── components/ # 组件使用示例
│   ├── composables/# 组合式函数示例
│   ├── api/        # API 调用示例
│   └── utils/      # 工具函数示例
│
├── permission/    # 权限示例
│   ├── directives/ # 权限指令
│   ├── guards/     # 路由守卫
│   └── api/        # 权限 API
│
├── i18n/           # 国际化示例
│   ├── locales/    # 语言文件
│   └── composables/# i18n Hooks
│
└── code-gen/       # 代码生成示例
    ├── generators/ # 生成器
    └── templates/  # 模板文件
```

## 示例列表

### 1. 基础示例 (basic/)

包含云枢 UI 组件库的基础使用示例：

- **Button** - 按钮组件
- **Input** - 输入框组件
- **Table** - 表格组件
- **Form** - 表单组件
- **Dialog** - 对话框组件
- **Message** - 消息提示

### 2. 权限示例 (permission/)

包含完整的权限管理使用示例：

- **v-permission 指令** - 权限指令
- **路由守卫** - 路由权限验证
- **API 权限** - 接口权限控制
- **数据权限** - 行级数据权限

### 3. 国际化示例 (i18n/)

包含多语言支持使用示例：

- **语言文件配置** - 中英文配置
- **useI18n** - 组合式函数
- **动态语言切换** - 运行时切换语言
- **日期/数字格式化** - 格式化本地化

### 4. 代码生成示例 (code-gen/)

包含代码生成器的使用示例：

- **CLI 使用** - 命令行工具
- **模板配置** - 自定义模板
- **Generator API** - API 调用

## 快速开始

```bash
# 进入示例目录
cd examples/basic

# 安装依赖
pnpm install

# 启动示例
pnpm dev
```

## 更多文档

- [主 README](../../README.md)
- [开发指南](../../DEVELOP.md)
- [API 文档](../../API.md)

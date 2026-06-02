# 设计令牌

云枢中台的设计令牌系统是一套**平台无关**的设计决策数据。

## 核心概念

设计令牌将设计决策（颜色、间距、字体等）抽象为**纯数据**，再通过生成器输出为各种目标格式。

```
设计决策数据 (TypeScript)
    ↓
生成器
    ↓
CSS 变量 / SCSS 变量 / JS 对象 / Tailwind 配置
```

## 使用方式

```typescript
// JS 运行时
import { lightColors, spacing } from '@yunshu/design-tokens';

// CSS 变量
import '@yunshu/design-tokens/css';
// 现在可以使用: var(--primary), var(--spacing-md) 等

// SCSS
// @use '@yunshu/design-tokens/scss' as yun;
// .card { padding: yun.$spacing-md; }
```

详见：[颜色系统](./colors) | [主题](./themes)

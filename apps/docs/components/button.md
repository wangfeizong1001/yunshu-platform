# Button 按钮

常用的操作按钮。

## 基础用法

```vue
<script setup>
import { YunButton } from '@yunshu/ui';
</script>

<template>
  <YunButton variant="primary">主要按钮</YunButton>
  <YunButton variant="secondary">次要按钮</YunButton>
  <YunButton variant="outline">边框按钮</YunButton>
  <YunButton variant="text">文本按钮</YunButton>
  <YunButton variant="danger">危险按钮</YunButton>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | `'primary' \| 'secondary' \| 'outline' \| 'text' \| 'danger'` | `'primary'` | 按钮变体 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 按钮尺寸 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 加载状态 |
| block | `boolean` | `false` | 块级按钮 |
| round | `boolean` | `false` | 圆角按钮 |

## Events

| 事件名 | 说明 |
|--------|------|
| click | 点击按钮时触发 |

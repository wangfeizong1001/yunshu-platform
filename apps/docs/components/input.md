# Input 输入框

通过鼠标或键盘输入字符。

## 基础用法

```vue
<script setup>
import { ref } from 'vue';
import { YunInput } from '@yunshu/ui';

const value = ref('');
</script>

<template>
  <YunInput v-model="value" placeholder="请输入内容" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string` | — | 绑定值 |
| placeholder | `string` | — | 占位提示 |
| type | `string` | `'text'` | 输入类型 |
| disabled | `boolean` | `false` | 禁用 |
| readonly | `boolean` | `false` | 只读 |
| clearable | `boolean` | `false` | 可清除 |
| error | `string` | — | 错误信息 |
| prefixIcon | `string` | — | 前缀图标 |
| suffixIcon | `string` | — | 后缀图标 |

## Events

| 事件名 | 说明 |
|--------|------|
| update:modelValue | 值变化时触发 |
| focus | 获得焦点 |
| blur | 失去焦点 |
| clear | 点击清除按钮 |

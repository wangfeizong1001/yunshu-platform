# Dialog 弹窗

模态对话框，用于重要的信息展示或需要用户交互确认。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { YunDialog } from '@yunshu/ui'

const visible = ref(false)
</script>

<template>
  <el-button @click="visible = true">打开弹窗</el-button>
  <YunDialog v-model="visible" title="提示">
    <span>这是弹窗内容</span>
  </YunDialog>
</template>
```

## 确认弹窗

```vue
<script setup>
import { ElMessageBox } from '@yunshu/ui'

async function handleDelete() {
  try {
    await ElMessageBox.confirm('确定删除该记录吗？', '提示', {
      type: 'warning',
    })
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | `false` | 是否显示 |
| title | `string` | - | 标题 |
| width | `string \| number` | `'50%'` | 宽度 |
| fullscreen | `boolean` | `false` | 是否全屏 |
| top | `string` | `'15vh'` | 顶部距离 |
| modal | `boolean` | `true` | 是否需要遮罩层 |
| draggable | `boolean` | `false` | 是否可拖拽 |
| destroyOnClose | `boolean` | `false` | 关闭时是否销毁 |
| closeOnClickModal | `boolean` | `true` | 点击遮罩是否关闭 |
| closeOnPressEscape | `boolean` | `true` | 按 ESC 是否关闭 |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 显示状态变化 | `(value: boolean)` |
| open | 打开时触发 | - |
| close | 关闭时触发 | - |

## Slots

| 名称 | 说明 |
|------|------|
| default | 弹窗主体内容 |
| header | 自定义标题 |
| footer | 自定义底部按钮 |

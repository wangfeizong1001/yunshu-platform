# Loading 加载

加载状态指示器，用于异步操作期间给用户反馈。

## 基础用法

```vue
<template>
  <div v-loading="loading">数据区域</div>
</template>

<script setup>
import { ref } from 'vue'
const loading = ref(true)
</script>
```

## 指令方式

```vue
<template>
  <!-- 区域加载 -->
  <div v-loading="loading">内容</div>

  <!-- 全屏加载 -->
  <button @click="showFullscreen">全屏加载</button>
</template>

<script setup>
import { ElLoading } from '@yunshu/ui'

function showFullscreen() {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => loading.close(), 2000)
}
</script>
```

## 组件方式

```vue
<template>
  <YunLoading :loading="loading" text="数据加载中" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| loading | `boolean` | `false` | 是否显示加载 |
| text | `string` | - | 提示文字 |
| background | `string` | - | 背景色 |
| spinner | `string` | - | 自定义加载图标 |
| fullscreen | `boolean` | `false` | 是否全屏 |
| lock | `boolean` | `false` | 锁定屏幕 |
| element | `HTMLElement` | - | 加载的目标元素 |

## 最佳实践

```vue
<!-- ✅ 推荐：使用变量控制 -->
<div v-loading="tableLoading">
  <el-table :data="data" />
</div>

<!-- ❌ 不推荐：硬编码 -->
<div v-loading="true">内容</div>
```

## 服务方式

```typescript
import { ElLoading } from '@yunshu/ui'

// 启动加载
const loading = ElLoading.service({
  lock: true,
  text: '正在处理...',
})

// 关闭加载
loading.close()
```

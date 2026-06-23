# Pagination 分页

分页组件，用于大量数据的分页展示。

## 基础用法

```vue
<template>
  <YunPagination
    v-model:current-page="queryParams.pageNum"
    v-model:page-size="queryParams.pageSize"
    :total="total"
  />
</template>

<script setup>
import { reactive, ref } from 'vue'

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
})
const total = ref(100)
</script>
```

## 完整示例

```vue
<template>
  <el-table :data="pagedData" />

  <div class="pagination">
    <YunPagination
      v-model:current-page="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)
const allData = ref([])

const pagedData = computed(() => {
  const start = (queryParams.pageNum - 1) * queryParams.pageSize
  return allData.value.slice(start, start + queryParams.pageSize)
})

function handleSizeChange(size) {
  queryParams.pageSize = size
  queryParams.pageNum = 1
  // 重新加载数据
}

function handleCurrentChange(page) {
  queryParams.pageNum = page
  // 重新加载数据
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| currentPage | `number` | `1` | 当前页码 |
| pageSize | `number` | `10` | 每页条数 |
| total | `number` | `0` | 总条数 |
| pageSizes | `number[]` | `[10, 20, 50, 100]` | 每页条数选项 |
| layout | `string` | `'prev, pager, next'` | 布局方式 |
| background | `boolean` | `false` | 是否为分页按钮添加背景色 |
| small | `boolean` | `false` | 是否使用小型分页 |
| disabled | `boolean` | `false` | 是否禁用 |

## Layout 可选值

| 值 | 说明 |
|-----|------|
| `total` | 总条数 |
| `sizes` | 每页条数选择器 |
| `prev` | 上一页按钮 |
| `pager` | 页码列表 |
| `next` | 下一页按钮 |
| `jumper` | 跳转输入框 |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:currentPage | 当前页变化 | `(page: number)` |
| update:pageSize | 每页条数变化 | `(size: number)` |
| size-change | 每页条数变化 | `(size: number)` |
| current-change | 当前页变化 | `(page: number)` |

## 服务端分页

```typescript
import { getUserPage } from '@/api/system/user.api'

async function fetchData() {
  const res = await getUserPage({
    pageNum: queryParams.pageNum,
    pageSize: queryParams.pageSize,
    keyword: queryParams.keyword,
  })
  tableData.value = res.rows
  total.value = res.total
}
```

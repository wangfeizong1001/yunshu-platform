<template>
  <div class="log-table">
    <slot name="search">
      <!-- 搜索区域插槽 -->
    </slot>

    <slot name="toolbar">
      <!-- 工具栏插槽 -->
    </slot>

    <el-table
      v-loading="loading"
      :data="data"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="showSelection" type="selection" width="50" align="center" />
      <slot name="columns" />
    </el-table>

    <div v-if="showPagination" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        :layout="layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  loading?: boolean
  data?: Record<string, unknown>[]
  total?: number
  page?: number
  limit?: number
  pageSizes?: number[]
  layout?: string
  showSelection?: boolean
  showPagination?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  data: () => [],
  total: 0,
  page: 1,
  limit: 10,
  pageSizes: () => [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  showSelection: true,
  showPagination: true,
})

const emit = defineEmits<{
  (e: 'query', params: { page: number; limit: number }): void
  (e: 'selection-change', selection: unknown[]): void
}>()

const currentPage = ref(props.page)
const pageSize = ref(props.limit)

watch(() => props.page, (val) => {
  currentPage.value = val
})

watch(() => props.limit, (val) => {
  pageSize.value = val
})

const handleSizeChange = (val: number) => {
  emit('query', { page: currentPage.value, limit: val })
}

const handleCurrentChange = (val: number) => {
  emit('query', { page: val, limit: pageSize.value })
}

const handleSelectionChange = (selection: unknown[]) => {
  emit('selection-change', selection)
}

defineExpose({
  currentPage,
  pageSize,
})
</script>

<style lang="scss" scoped>
.log-table {
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>

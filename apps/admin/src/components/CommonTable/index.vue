<template>
  <div class="common-table">
    <el-table
      v-loading="loading"
      :data="tableData"
      :stripe="stripe"
      :border="border"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="showSelection" type="selection" width="55" />
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align || 'left'"
        :fixed="column.fixed"
        :sortable="column.sortable"
      >
        <template v-if="column.slot" #default="scope">
          <slot :name="column.slot" :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>

    <div v-if="showPagination" class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Column {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  sortable?: boolean
  slot?: string
}

interface Row {
  [key: string]: unknown
}

interface Props {
  data: Row[]
  columns: Column[]
  loading?: boolean
  stripe?: boolean
  border?: boolean
  showSelection?: boolean
  showPagination?: boolean
  total?: number
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  loading: false,
  stripe: true,
  border: true,
  showSelection: false,
  showPagination: true,
  total: 0,
  pageSize: 10
})

const emit = defineEmits(['selectionChange', 'pageChange'])

const currentPage = ref(1)
const pageSize = ref(props.pageSize)

const tableData = computed(() => props.data as Row[])

const handleSelectionChange = (selection: Row[]) => {
  emit('selectionChange', selection)
}

const handleSizeChange = (val: number) => {
  emit('pageChange', { page: currentPage.value, pageSize: val })
}

const handleCurrentChange = (val: number) => {
  emit('pageChange', { page: val, pageSize: props.pageSize })
}

watch(
  () => props.pageSize,
  (val) => {
    pageSize.value = val
  }
)
</script>

<style lang="scss" scoped>
.common-table {
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>

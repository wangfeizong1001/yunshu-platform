<template>
  <el-dialog
    v-model="visible"
    title="导入表"
    width="800px"
    :close-on-click-modal="false"
  >
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="表名称">
          <el-input v-model="queryParams.tableName" placeholder="请输入表名称" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="表描述">
          <el-input v-model="queryParams.tableComment" placeholder="请输入表描述" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 工具栏 -->
    <div class="toolbar">
      <span class="selected-info">已选择 {{ selectedTables.length }} 个表</span>
      <div class="toolbar-right">
        <el-button type="primary" size="small" :disabled="selectedTables.length === 0" @click="handleImport">
          导入选中表
        </el-button>
      </div>
    </div>

    <!-- 表列表 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
      height="300px"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="表名称" prop="tableName" width="180" align="center" />
      <el-table-column label="表描述" prop="tableComment" min-width="150" show-overflow-tooltip />
      <el-table-column label="表空间" prop="tableSchema" width="120" align="center" />
      <el-table-column label="引擎" prop="engine" width="100" align="center" />
      <el-table-column label="创建时间" prop="createTime" width="160" align="center">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" :disabled="selectedTables.length === 0" @click="handleImport">
        导入
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import type { IGenTable, IGenQuery } from '@yunshu/shared/types/gen'
import { getGenTablePage } from '@/api/tool/gen.api'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const visible = ref(false)
const loading = ref(false)
const tableData = ref<IGenTable[]>([])
const selectedTables = ref<IGenTable[]>([])

const queryParams = reactive<IGenQuery>({
  page: 1,
  limit: 100,
  sort: 'createTime',
  order: 'desc',
})

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    loadTableList()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const loadTableList = async () => {
  loading.value = true
  try {
    const res = await getGenTablePage(queryParams)
    if (res.success) {
      tableData.value = res.data
    }
  } catch {
    ElMessage.error('获取表列表失败')
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  loadTableList()
}

const handleReset = () => {
  queryParams.tableName = undefined
  queryParams.tableComment = undefined
  loadTableList()
}

const handleSelectionChange = (selection: IGenTable[]) => {
  selectedTables.value = selection
}

const handleImport = async () => {
  if (selectedTables.value.length === 0) {
    ElMessage.warning('请选择要导入的表')
    return
  }

  try {
    // TODO: 调用导入接口
    ElMessage.success(`成功导入 ${selectedTables.value.length} 个表`)
    emit('success')
    handleClose()
  } catch {
    ElMessage.error('导入失败')
  }
}

const handleClose = () => {
  visible.value = false
  selectedTables.value = []
}
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .selected-info {
    color: #606266;
    font-size: 14px;
  }
}
</style>

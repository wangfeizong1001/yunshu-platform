<template>
  <el-dialog
    v-model="visible"
    title="导入表"
    width="900px"
    :close-on-click-modal="false"
    class="import-dialog"
  >
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" inline>
        <el-form-item label="表名称">
          <el-input
            v-model="queryParams.tableName"
            placeholder="请输入表名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="表描述">
          <el-input
            v-model="queryParams.tableComment"
            placeholder="请输入表描述"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="handleQuery">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="toolbar">
      <div class="toolbar-left">
        <span class="selected-info">
          已选择 <el-tag size="small" type="primary">{{ selectedTables.length }}</el-tag> 个表
        </span>
      </div>
      <div class="toolbar-right">
        <el-button type="primary" size="small" :loading="importing" :disabled="selectedTables.length === 0" @click="handleImport">
          导入选中表
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
      height="400"
      border
      stripe
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表名称" prop="tableName" width="200" align="center">
        <template #default="{ row }">
          <div class="table-name-cell">
            <el-icon><Tickets /></el-icon>
            <span>{{ row.tableName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="表描述" prop="tableComment" min-width="180" show-overflow-tooltip />
      <el-table-column label="表空间" prop="tableSchema" width="120" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.tableSchema" size="small" type="info">
            {{ row.tableSchema }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="引擎" prop="engine" width="100" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.engine" size="small" type="success">
            {{ row.engine }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="180" align="center">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleSingleImport(row as IGenTable)">
            导入
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.limit"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleQuery"
        @current-change="handleQuery"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button
          type="primary"
          :loading="importing"
          :disabled="selectedTables.length === 0"
          @click="handleImport"
        >
          导入
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Tickets } from '@element-plus/icons-vue'
import type { IGenTable, IGenQuery } from '@yunshu/shared'
import { getGenDbList, importGenTable } from '@/api/tool/gen.api'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const visible = ref(false)
const loading = ref(false)
const importing = ref(false)
const tableData = ref<IGenTable[]>([])
const selectedTables = ref<IGenTable[]>([])
const total = ref(0)

const queryParams = reactive<IGenQuery>({
  page: 1,
  limit: 20,
  sort: 'createTime',
  order: 'desc'
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

const formatDate = (date: string | undefined): string => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const loadTableList = async () => {
  loading.value = true
  try {
    const res = await getGenDbList(queryParams)
    if (res.success) {
      tableData.value = res.data || []
      total.value = res.pagination?.total || 0
    }
  } catch {
    ElMessage.error('获取表列表失败')
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.page = 1
  loadTableList()
}

const handleReset = () => {
  queryParams.page = 1
  queryParams.limit = 20
  queryParams.tableName = undefined
  queryParams.tableComment = undefined
  loadTableList()
}

const handleSelectionChange = (selection: IGenTable[]) => {
  selectedTables.value = selection
}

const doImport = async (tables: IGenTable[]) => {
  if (tables.length === 0) {
    ElMessage.warning('请选择要导入的表')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要导入 ${tables.length} 个表吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    importing.value = true
    const tableNames = tables.map(t => t.tableName)
    const res = await importGenTable(tableNames)

    if (res.success) {
      ElMessage.success(`成功导入 ${tables.length} 个表`)
      emit('success')
      handleClose()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '导入失败')
    }
  } finally {
    importing.value = false
  }
}

const handleImport = () => {
  doImport(selectedTables.value)
}

const handleSingleImport = (table: IGenTable) => {
  doImport([table])
}

const handleClose = () => {
  visible.value = false
  selectedTables.value = []
}
</script>

<style lang="scss" scoped>
.import-dialog {
  :deep(.el-dialog__body) {
    padding: 15px 20px;
  }

  .search-card {
    margin-bottom: 16px;
    background: #f5f7fa;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .toolbar-left {
      .selected-info {
        color: #606266;
        font-size: 14px;
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .table-name-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    .el-icon {
      color: #409eff;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>


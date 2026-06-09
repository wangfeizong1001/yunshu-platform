<template>
  <div class="config-list">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入参数名称/键名/键值"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="参数类型" prop="configType">
          <el-select v-model="queryParams.configType" placeholder="请选择参数类型" clearable>
            <el-option label="系统内置" value="Y" />
            <el-option label="自定义" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格工具栏 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="table-header">
          <div class="left">
            <el-button
              v-has-permi="['system:config:add']"
              type="primary"
              :icon="Plus"
              @click="handleAdd"
            >
              新增
            </el-button>
            <el-button
              v-has-permi="['system:config:export']"
              type="success"
              :icon="Download"
              @click="handleExport"
            >
              导出
            </el-button>
            <el-button
              v-has-permi="['system:config:remove']"
              type="danger"
              :icon="Delete"
              :disabled="selectedRows.length === 0"
              @click="handleBatchDelete"
            >
              删除
            </el-button>
          </div>
          <div class="right">
            <el-button :icon="Refresh" circle @click="refreshTable" />
          </div>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="configList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="configId" label="参数编号" width="100" />
        <el-table-column prop="configName" label="参数名称" width="200" />
        <el-table-column prop="configKey" label="参数键名" width="250">
          <template #default="{ row }">
            <el-tooltip :content="row.configKey" placement="top" :show-after="300">
              <span class="config-key">{{ row.configKey }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="configValue" label="参数键值" min-width="200">
          <template #default="{ row }">
            <el-tooltip :content="row.configValue" placement="top" :show-after="300">
              <span class="config-value">{{ row.configValue }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="configType" label="系统内置" width="120">
          <template #default="{ row }">
            <el-tag :type="row.configType === 'Y' ? 'success' : 'warning'">
              {{ row.configType === 'Y' ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['system:config:edit']"
              link
              type="primary"
              @click="handleEdit(row as SysConfig)"
            >
              编辑
            </el-button>
            <el-button
              v-has-permi="['system:config:remove']"
              link
              type="danger"
              :disabled="row.configType === 'Y'"
              @click="handleDelete(row as SysConfig)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </el-card>

    <!-- 参数表单弹窗 -->
    <ConfigForm v-model="formVisible" :config-data="currentConfig" @refresh="handleQuery" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Download, Delete } from '@element-plus/icons-vue'
import { getConfigPage, deleteConfig, batchDeleteConfig, exportConfig } from '@/api/system/config.api'
import type { SysConfig, SysConfigQuery } from '@yunshu/shared'
import ConfigForm from './ConfigForm.vue'

// 状态
const loading = ref(false)
const configList = ref<SysConfig[]>([])
const total = ref(0)
const selectedRows = ref<SysConfig[]>([])
const formVisible = ref(false)
const currentConfig = ref<SysConfig | null>(null)

// 查询参数
const queryParams = reactive<SysConfigQuery>({
  keyword: '',
  configType: undefined,
  pageNum: 1,
  pageSize: 10,
})

// 加载参数列表
async function fetchConfigList() {
  loading.value = true
  try {
    const res = await getConfigPage(queryParams) as { rows: SysConfig[]; total: number }
    configList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchConfigList()
}

// 重置查询
function resetQuery() {
  queryParams.keyword = ''
  queryParams.configType = undefined
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchConfigList()
}

// 新增
function handleAdd() {
  currentConfig.value = null
  formVisible.value = true
}

// 编辑
function handleEdit(row: SysConfig) {
  currentConfig.value = { ...row }
  formVisible.value = true
}

// 删除
async function handleDelete(row: SysConfig) {
  try {
    await ElMessageBox.confirm(`是否确认删除参数"${row.configName}"？`, '提示', {
      type: 'warning',
    })
    await deleteConfig(row.configId)
    ElMessage.success('删除成功')
    fetchConfigList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 批量删除
async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(`是否确认删除选中的${selectedRows.value.length}个参数？`, '提示', {
      type: 'warning',
    })
    const ids = selectedRows.value.map((row) => row.configId)
    await batchDeleteConfig(ids)
    ElMessage.success('删除成功')
    fetchConfigList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 导出
async function handleExport() {
  try {
    await exportConfig(queryParams)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败', error)
  }
}

// 批量选择
function handleSelectionChange(selection: SysConfig[]) {
  selectedRows.value = selection
}

// 初始化
onMounted(() => {
  fetchConfigList()
})
</script>

<style scoped lang="scss">
.config-list {
  .search-card {
    margin-bottom: 16px;
  }

  .table-card {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .config-key,
  .config-value {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
}
</style>

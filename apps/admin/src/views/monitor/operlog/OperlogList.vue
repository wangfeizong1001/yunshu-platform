<template>
  <div class="page-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="操作人">
          <el-input v-model="queryParams.operName" placeholder="请输入操作人" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="queryParams.operType" placeholder="请选择" clearable style="width: 140px">
            <el-option label="查询" value="查询" />
            <el-option label="新增" value="新增" />
            <el-option label="修改" value="修改" />
            <el-option label="删除" value="删除" />
            <el-option label="导出" value="导出" />
            <el-option label="导入" value="导入" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作模块">
          <el-select v-model="queryParams.operModule" placeholder="请选择" clearable style="width: 140px">
            <el-option label="用户管理" value="用户管理" />
            <el-option label="角色管理" value="角色管理" />
            <el-option label="菜单管理" value="菜单管理" />
            <el-option label="部门管理" value="部门管理" />
            <el-option label="岗位管理" value="岗位管理" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="成功" value="0" />
            <el-option label="失败" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 工具栏 -->
    <el-card class="toolbar-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
          <el-button type="warning" :icon="Delete" @click="handleClean">清空日志</el-button>
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
        </div>
        <div class="toolbar-right">
          <el-button :icon="Refresh" circle @click="handleRefresh" />
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="日志编号" prop="operId" width="80" align="center" />
        <el-table-column label="操作人" prop="operName" width="100" align="center" />
        <el-table-column label="操作时间" prop="operTime" width="180" align="center" sortable="custom">
          <template #default="{ row }">
            {{ formatDate(row.operTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作类型" prop="operType" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getOperTypeTagType(row.operType)">{{ row.operType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作模块" prop="operModule" width="120" align="center" />
        <el-table-column label="操作状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="getOperlogStatusTagType(row.status)">
              {{ getOperlogStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="请求方法" prop="requestMethod" width="100" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.requestMethod }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作地址" prop="operUrl" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作IP" prop="operIp" width="140" align="center" />
        <el-table-column label="耗时" prop="costTime" width="100" align="center">
          <template #default="{ row }">
            {{ row.costTime }}ms
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row as IOperlog)">详情</el-button>
            <el-button link type="danger" @click="handleDelete(row as IOperlog)">删除</el-button>
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
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="操作日志详情" width="700px" destroy-on-close>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="日志编号">{{ currentRow?.operId }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{ currentRow?.operName }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ formatDate(currentRow?.operTime) }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getOperTypeTagType(currentRow?.operType || '')">{{ currentRow?.operType }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作模块">{{ currentRow?.operModule }}</el-descriptions-item>
        <el-descriptions-item label="操作状态">
          <el-tag :type="getOperlogStatusTagType(currentRow?.status || '')">
            {{ getOperlogStatusLabel(currentRow?.status || '') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="请求方法">{{ currentRow?.requestMethod }}</el-descriptions-item>
        <el-descriptions-item label="操作地址" :span="2">{{ currentRow?.operUrl }}</el-descriptions-item>
        <el-descriptions-item label="操作IP">{{ currentRow?.operIp }}</el-descriptions-item>
        <el-descriptions-item label="操作系统">{{ currentRow?.operSystem }}</el-descriptions-item>
        <el-descriptions-item label="浏览器">{{ currentRow?.browser }}</el-descriptions-item>
        <el-descriptions-item label="操作地点">{{ currentRow?.operLocation }}</el-descriptions-item>
        <el-descriptions-item label="耗时">{{ currentRow?.costTime }}ms</el-descriptions-item>
        <el-descriptions-item label="操作参数" :span="2">
          <pre style="margin: 0; white-space: pre-wrap">{{ formatJson(currentRow?.operParam) }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="返回结果" :span="2">
          <pre style="margin: 0; white-space: pre-wrap">{{ formatJson(currentRow?.jsonResult) }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete, Download } from '@element-plus/icons-vue'
import type { IOperlog, IOperlogQuery } from '@yunshu/shared'
import * as operlogApi from '@/api/monitor/operlog.api'

// 状态常量
const OPERLOG_STATUS_SUCCESS = '0'
const OPERLOG_STATUS_FAIL = '1'

const getOperlogStatusTagType = (val: string) =>
  val === OPERLOG_STATUS_SUCCESS ? 'success' : 'danger'

const getOperlogStatusLabel = (val: string) =>
  val === OPERLOG_STATUS_SUCCESS ? '成功' : '失败'

const loading = ref(false)
const tableData = ref<IOperlog[]>([])
const total = ref(0)
const selectedIds = ref<string[]>([])
const dateRange = ref<[string, string] | null>(null)
const detailVisible = ref(false)
const currentRow = ref<IOperlog | null>(null)

const queryParams = reactive<IOperlogQuery>({
  page: 1,
  limit: 10,
  sort: 'operTime',
  order: 'desc',
})

const getOperTypeTagType = (type: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    查询: 'info',
    新增: 'success',
    修改: 'warning',
    删除: 'danger',
    导出: 'primary',
    导入: 'success',
  }
  return map[type] || 'info'
}

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const formatJson = (str: string | undefined) => {
  if (!str) return '-'
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch {
    return str
  }
}

const handleQuery = async () => {
  loading.value = true
  try {
    if (dateRange.value) {
      queryParams.beginTime = dateRange.value[0]
      queryParams.endTime = dateRange.value[1]
    } else {
      delete queryParams.beginTime
      delete queryParams.endTime
    }
    const res = await operlogApi.getOperlogPage(queryParams) as { success: boolean; data: IOperlog[]; pagination: { total: number } }
    if (res.success) {
      tableData.value = res.data || []
      total.value = res.pagination?.total || 0
    }
  } catch {
    ElMessage.error('获取操作日志失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  queryParams.page = 1
  queryParams.limit = 10
  queryParams.operName = undefined
  queryParams.operType = undefined
  queryParams.operModule = undefined
  queryParams.status = undefined
  delete queryParams.beginTime
  delete queryParams.endTime
  dateRange.value = null
  handleQuery()
}

const handleRefresh = () => {
  handleQuery()
}

const handleSelectionChange = (selection: IOperlog[]) => {
  selectedIds.value = selection.map((item) => item.operId)
}

const handleSortChange = ({ prop, order }: { prop: string | null; order: string | null }) => {
  queryParams.sort = prop || 'operTime'
  queryParams.order = order === 'ascending' ? 'asc' : 'desc'
  handleQuery()
}

const handleViewDetail = (row: IOperlog) => {
  currentRow.value = row
  detailVisible.value = true
}

const handleDelete = async (row: IOperlog) => {
  try {
    await ElMessageBox.confirm('确认删除该操作日志吗？', '提示', { type: 'warning' })
    await operlogApi.deleteOperlog(Number(row.operId))
    ElMessage.success('删除成功')
    handleQuery()
  } catch (err) {
    if (!String((err as Error)?.message)?.includes('cancel')) {
      console.error('[OperlogList] handleDelete failed:', err)
      ElMessage.error('删除失败，请重试')
    }
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 条操作日志吗？`, '提示', { type: 'warning' })
    await operlogApi.batchDeleteOperlog(selectedIds.value.map(id => Number(id)))
    ElMessage.success('删除成功')
    handleQuery()
  } catch (err) {
    if (!String((err as Error)?.message)?.includes('cancel')) {
      console.error('[OperlogList] handleBatchDelete failed:', err)
      ElMessage.error('删除失败，请重试')
    }
  }
}

const handleClean = async () => {
  try {
    await ElMessageBox.confirm('确认清空所有操作日志吗？此操作不可恢复！', '警告', { type: 'warning' })
    await operlogApi.cleanOperlog()
    ElMessage.success('清空成功')
    handleQuery()
  } catch (err) {
    if (!String((err as Error)?.message)?.includes('cancel')) {
      console.error('[OperlogList] handleClean failed:', err)
      ElMessage.error('清空失败，请重试')
    }
  }
}

const handleExport = () => {
  // 导出功能暂时注释
  // operlogApi.exportOperlog(queryParams)
}

onMounted(() => {
  handleQuery()
})
</script>

<style lang="scss" scoped>
.page-container {
  .search-card {
    margin-bottom: 16px;
  }

  .toolbar-card {
    margin-bottom: 16px;

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .toolbar-left {
        display: flex;
        gap: 12px;
      }
    }
  }

  .table-card {
    .pagination-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  }
}
</style>

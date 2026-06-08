<template>
  <div class="page-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="任务名称">
          <el-input v-model="queryParams.jobName" placeholder="请输入任务名称" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="任务分组">
          <el-select v-model="queryParams.jobGroup" placeholder="请选择" clearable style="width: 120px">
            <el-option label="默认" value="default" />
            <el-option label="系统" value="system" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="正常" value="0" />
            <el-option label="暂停" value="1" />
            <el-option label="删除" value="2" />
          </el-select>
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
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增任务</el-button>
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-button :icon="Refresh" circle @click="handleRefresh" />
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="任务ID" prop="jobId" width="80" align="center" />
        <el-table-column label="任务名称" prop="jobName" width="140" align="center" />
        <el-table-column label="任务分组" prop="jobGroup" width="100" align="center">
          <template #default="{ row }">
            <el-tag>{{ getGroupName(row.jobGroup) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="调用目标" prop="invokeTarget" min-width="180" show-overflow-tooltip />
        <el-table-column label="cron表达式" prop="cronExpression" width="140" align="center" />
        <el-table-column label="执行策略" prop="misfirePolicy" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getMisfirePolicyType(row.misfirePolicy)">
              {{ getMisfirePolicyName(row.misfirePolicy) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="并发执行" prop="concurrent" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.concurrent === '0' ? 'success' : 'warning'">
              {{ row.concurrent === '0' ? '允许' : '禁止' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="下次执行" prop="nextValidTime" width="160" align="center">
          <template #default="{ row }">
            {{ formatDate(row.nextValidTime) }}
          </template>
        </el-table-column>
        <el-table-column label="最后执行" prop="lastRunTime" width="160" align="center">
          <template #default="{ row }">
            {{ formatDate(row.lastRunTime) }}
          </template>
        </el-table-column>
        <el-table-column label="执行次数" prop="runCount" width="100" align="center" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleExecute(row)">执行</el-button>
            <el-button link type="primary" @click="handleViewLog(row)">日志</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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

    <!-- 任务表单弹窗 -->
    <JobForm v-model="formVisible" :job-data="currentJob" @success="handleQuery" />

    <!-- 任务日志抽屉 -->
    <JobLogDrawer v-model="logDrawerVisible" :job-data="currentJob" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete, Plus } from '@element-plus/icons-vue'
import type { IJob, IJobQuery } from '@yunshu/shared/types/monitor'
import * as jobApi from '@/api/monitor/job.api'
import JobForm from './JobForm.vue'
import JobLogDrawer from './JobLogDrawer.vue'

const loading = ref(false)
const tableData = ref<IJob[]>([])
const total = ref(0)
const selectedIds = ref<string[]>([])
const formVisible = ref(false)
const logDrawerVisible = ref(false)
const currentJob = ref<IJob | null>(null)

const queryParams = reactive<IJobQuery>({
  page: 1,
  limit: 10,
  sort: 'createTime',
  order: 'desc',
})

const getGroupName = (group: string) => {
  const map: Record<string, string> = {
    default: '默认',
    system: '系统',
    custom: '自定义',
  }
  return map[group] || group
}

const getMisfirePolicyName = (policy: string) => {
  const map: Record<string, string> = {
    '0': '默认策略',
    '1': '立即执行',
    '2': '执行一次',
  }
  return map[policy] || policy
}

const getMisfirePolicyType = (policy: string) => {
  const map: Record<string, string> = {
    '0': 'info',
    '1': 'success',
    '2': 'warning',
  }
  return map[policy] || 'info'
}

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const handleQuery = async () => {
  loading.value = true
  try {
    const res = await jobApi.getJobPage(queryParams)
    if (res.success) {
      tableData.value = res.data
      total.value = res.pagination.total
    }
  } catch {
    ElMessage.error('获取定时任务失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  queryParams.page = 1
  queryParams.limit = 10
  queryParams.jobName = undefined
  queryParams.jobGroup = undefined
  queryParams.status = undefined
  handleQuery()
}

const handleRefresh = () => {
  handleQuery()
}

const handleSelectionChange = (selection: IJob[]) => {
  selectedIds.value = selection.map((item) => item.jobId)
}

const handleAdd = () => {
  currentJob.value = null
  formVisible.value = true
}

const handleEdit = (row: IJob) => {
  currentJob.value = row
  formVisible.value = true
}

const handleDelete = async (row: IJob) => {
  try {
    await ElMessageBox.confirm('确认删除该任务吗？', '提示', { type: 'warning' })
    await jobApi.deleteJob(row.jobId)
    ElMessage.success('删除成功')
    handleQuery()
  } catch {
    // 用户取消
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个任务吗？`, '提示', { type: 'warning' })
    for (const id of selectedIds.value) {
      await jobApi.deleteJob(id)
    }
    ElMessage.success('删除成功')
    handleQuery()
  } catch {
    // 用户取消
  }
}

const handleStatusChange = async (row: IJob) => {
  try {
    await jobApi.changeJobStatus(row.jobId, row.status)
    ElMessage.success(row.status === '0' ? '任务已启用' : '任务已暂停')
  } catch {
    ElMessage.error('状态修改失败')
    handleQuery()
  }
}

const handleExecute = async (row: IJob) => {
  try {
    await ElMessageBox.confirm(`确认立即执行任务"${row.jobName}"吗？`, '提示', { type: 'warning' })
    await jobApi.executeJob(row.jobId)
    ElMessage.success('任务执行成功')
    handleQuery()
  } catch {
    // 用户取消
  }
}

const handleViewLog = (row: IJob) => {
  currentJob.value = row
  logDrawerVisible.value = true
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

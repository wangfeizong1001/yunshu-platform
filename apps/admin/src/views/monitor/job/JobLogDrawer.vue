<template>
  <el-drawer
    v-model="visible"
    title="任务执行日志"
    size="800px"
    :before-close="handleClose"
  >
    <!-- 搜索表单 -->
    <el-form :model="queryParams" inline class="search-form">
      <el-form-item label="执行状态">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 100px">
          <el-option label="成功" value="0" />
          <el-option label="失败" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="执行时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width: 220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="warning" :icon="Delete" @click="handleClean">清空日志</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="tableData" class="log-table">
      <el-table-column label="日志ID" prop="logId" width="80" align="center" />
      <el-table-column label="任务名称" prop="jobName" width="140" align="center" />
      <el-table-column label="调用目标" prop="invokeTarget" min-width="160" show-overflow-tooltip />
      <el-table-column label="执行状态" prop="status" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === '0' ? 'success' : 'danger'">
            {{ row.status === '0' ? '成功' : '失败' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" prop="executeTime" width="160" align="center">
        <template #default="{ row }">
          {{ formatDate(row.executeTime) }}
        </template>
      </el-table-column>
      <el-table-column label="耗时" prop="costTime" width="100" align="center">
        <template #default="{ row }">
          {{ row.costTime }}ms
        </template>
      </el-table-column>
      <el-table-column label="执行信息" prop="message" min-width="200" show-overflow-tooltip />
      <el-table-column label="异常信息" prop="error" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          <span v-if="row.error" class="error-text">{{ row.error }}</span>
          <span v-else>-</span>
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
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import type { IJobLog, IJobLogQuery } from '@yunshu/shared/types/monitor'
import * as jobApi from '@/api/monitor/job.api'

const props = defineProps<{
  modelValue: boolean
  jobData: IJob | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const loading = ref(false)
const tableData = ref<IJobLog[]>([])
const total = ref(0)
const dateRange = ref<[string, string] | null>(null)

const queryParams = ref<IJobLogQuery>({
  page: 1,
  limit: 10,
  sort: 'executeTime',
  order: 'desc',
})

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const handleQuery = async () => {
  if (!props.jobData) return

  loading.value = true
  try {
    queryParams.value.jobId = props.jobData.jobId
    if (dateRange.value) {
      queryParams.value.beginTime = dateRange.value[0]
      queryParams.value.endTime = dateRange.value[1]
    } else {
      delete queryParams.value.beginTime
      delete queryParams.value.endTime
    }
    const res = await jobApi.getJobLogPage(queryParams.value)
    if (res.success) {
      tableData.value = res.data
      total.value = res.pagination.total
    }
  } catch {
    ElMessage.error('获取任务日志失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  queryParams.value.page = 1
  queryParams.value.limit = 10
  queryParams.value.status = undefined
  delete queryParams.value.beginTime
  delete queryParams.value.endTime
  dateRange.value = null
  handleQuery()
}

const handleClean = async () => {
  try {
    await ElMessageBox.confirm('确认清空该任务的所有日志吗？此操作不可恢复！', '警告', { type: 'warning' })
    await jobApi.cleanJobLog()
    ElMessage.success('清空成功')
    handleQuery()
  } catch {
    // 用户取消
  }
}

const handleClose = () => {
  visible.value = false
}

watch(visible, (val) => {
  if (val) {
    handleQuery()
  }
})

watch(
  () => props.jobData,
  () => {
    if (visible.value && props.jobData) {
      handleQuery()
    }
  },
)
</script>

<style lang="scss" scoped>
.search-form {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.toolbar {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.log-table {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}

.error-text {
  color: #f56c6c;
  font-size: 12px;
}
</style>

<template>
  <div class="sms-log">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="queryParams.mobile"
            placeholder="请输入手机号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="模板CODE" prop="templateCode">
          <el-input
            v-model="queryParams.templateCode"
            placeholder="请输入模板CODE"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="成功" value="1" />
            <el-option label="失败" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>短信记录</span>
          <el-button :icon="Refresh" circle @click="refreshTable" />
        </div>
      </template>

      <el-table v-loading="loading" :data="logList" stripe border>
        <el-table-column prop="id" label="日志ID" width="80" />
        <el-table-column prop="mobile" label="手机号" width="130" />
        <el-table-column prop="templateCode" label="模板CODE" width="150" />
        <el-table-column prop="content" label="短信内容" min-width="250" show-overflow-tooltip />
        <el-table-column prop="params" label="参数" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.params || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getSmsStatusTagType(row.status)" size="small">
              {{ getSmsStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" label="发送时间" width="180" />
        <el-table-column prop="errorMsg" label="错误信息" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.errorMsg || '-' }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getSmsLogList } from '@/api/system/sms.api'
import type { SmsLog, SmsLogQuery } from '@yunshu/shared'

// 状态常量
const SMS_STATUS_SUCCESS = '1'
const SMS_STATUS_FAIL = '0'

const getSmsStatusTagType = (val: string) =>
  val === SMS_STATUS_SUCCESS ? 'success' : 'danger'

const getSmsStatusLabel = (val: string) =>
  val === SMS_STATUS_SUCCESS ? '成功' : '失败'

// 状态
const loading = ref(false)
const logList = ref<SmsLog[]>([])
const total = ref(0)
const dateRange = ref<string[]>([])

// 查询参数
const queryParams = reactive<SmsLogQuery>({
  mobile: '',
  templateCode: '',
  status: undefined,
  startDate: '',
  endDate: '',
  pageNum: 1,
  pageSize: 10,
})

// 加载日志列表
async function fetchLogList() {
  loading.value = true
  try {
    // 处理日期范围
    if (dateRange.value && dateRange.value.length === 2) {
      queryParams.startDate = dateRange.value[0]
      queryParams.endDate = dateRange.value[1]
    } else {
      queryParams.startDate = ''
      queryParams.endDate = ''
    }

    const res = await getSmsLogList(queryParams) as { rows: SmsLog[]; total: number }
    logList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchLogList()
}

// 重置查询
function resetQuery() {
  queryParams.mobile = ''
  queryParams.templateCode = ''
  queryParams.status = undefined
  dateRange.value = []
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchLogList()
}

// 初始化
onMounted(() => {
  fetchLogList()
})
</script>

<style scoped lang="scss">
.sms-log {
  .search-card {
    margin-bottom: 16px;
  }

  .table-card {
    .card-header {
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
}
</style>

<template>
  <div class="third-log">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="平台" prop="platform">
          <el-select v-model="queryParams.platform" placeholder="请选择平台" clearable>
            <el-option label="微信" value="wechat" />
            <el-option label="GitHub" value="github" />
            <el-option label="企业微信" value="wecom" />
            <el-option label="钉钉" value="dingtalk" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名"
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
        <el-form-item label="登录时间">
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
          <span>登录日志</span>
          <el-button :icon="Refresh" circle @click="refreshTable" />
        </div>
      </template>

      <el-table v-loading="loading" :data="logList" stripe border>
        <el-table-column prop="id" label="日志ID" width="80" />
        <el-table-column prop="platform" label="平台" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ getPlatformName(row.platform) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="openId" label="Open ID" width="180" show-overflow-tooltip />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" show-overflow-tooltip />
        <el-table-column prop="userName" label="关联账号" width="120">
          <template #default="{ row }">
            {{ row.userName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP 地址" width="140" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getThirdLogStatusTagType(row.status)" size="small">
              {{ getThirdLogStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="loginTime" label="登录时间" width="180" />
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
import { getThirdLoginLogList } from '@/api/system/third.api'
import type { ThirdLoginLog, ThirdLoginLogQuery } from '@yunshu/shared'

// 状态常量
const THIRD_LOG_SUCCESS = '1'
const THIRD_LOG_ERROR = '0'

const getThirdLogStatusTagType = (val: string) =>
  val === THIRD_LOG_SUCCESS ? 'success' : 'danger'

const getThirdLogStatusLabel = (val: string) =>
  val === THIRD_LOG_SUCCESS ? '成功' : '失败'

// 状态
const loading = ref(false)
const logList = ref<ThirdLoginLog[]>([])
const total = ref(0)
const dateRange = ref<string[]>([])

// 查询参数
const queryParams = reactive<ThirdLoginLogQuery>({
  platform: undefined,
  username: '',
  status: undefined,
  startDate: '',
  endDate: '',
  pageNum: 1,
  pageSize: 10,
})

// 获取平台名称
function getPlatformName(platform: string): string {
  const platformMap: Record<string, string> = {
    wechat: '微信',
    github: 'GitHub',
    wecom: '企业微信',
    dingtalk: '钉钉',
  }
  return platformMap[platform] || platform
}

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

    const res = await getThirdLoginLogList(queryParams) as { rows: ThirdLoginLog[]; total: number }
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
  queryParams.platform = undefined
  queryParams.username = ''
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
.third-log {
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

<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalCount }}</div>
            <div class="stat-label">总在线人数</div>
          </div>
          <div class="stat-icon total">
            <el-icon :size="32"><User /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-info">
            <div class="stat-value">{{ stats.pcCount }}</div>
            <div class="stat-label">PC端在线</div>
          </div>
          <div class="stat-icon pc">
            <el-icon :size="32"><Monitor /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-info">
            <div class="stat-value">{{ stats.mobileCount }}</div>
            <div class="stat-label">移动端在线</div>
          </div>
          <div class="stat-icon mobile">
            <el-icon :size="32"><Cellphone /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="用户名称">
          <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable style="width: 140px" />
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
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0" @click="handleBatchForceLogout">
            批量强制下线
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
        <el-table-column label="会话编号" prop="tokenId" width="200" show-overflow-tooltip />
        <el-table-column label="用户名称" prop="userName" width="120" align="center" />
        <el-table-column label="部门名称" prop="deptName" width="120" align="center" />
        <el-table-column label="浏览器" prop="browser" width="120" align="center" show-overflow-tooltip />
        <el-table-column label="操作系统" prop="os" width="120" align="center" show-overflow-tooltip />
        <el-table-column label="登录IP" prop="ipaddr" width="140" align="center" />
        <el-table-column label="登录时间" prop="loginTime" width="180" align="center">
          <template #default="{ row }">
            {{ formatDate(row.loginTime) }}
          </template>
        </el-table-column>
        <el-table-column label="最后访问" prop="lastAccessTime" width="180" align="center">
          <template #default="{ row }">
            {{ formatDate(row.lastAccessTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleForceLogout(row)">强制下线</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete, User, Monitor, Cellphone } from '@element-plus/icons-vue'
import type { OnlineInfo, OnlineQuery } from '@/api/monitor/online.api'
import * as onlineApi from '@/api/monitor/online.api'

interface OnlineStats {
  totalCount: number
  pcCount: number
  mobileCount: number
  onlineCount?: number
}

const loading = ref(false)
const tableData = ref<OnlineInfo[]>([])
const total = ref(0)
const selectedIds = ref<string[]>([])
const stats = ref<OnlineStats>({
  totalCount: 0,
  pcCount: 0,
  mobileCount: 0,
})

const queryParams = reactive<OnlineQuery>({
  pageNum: 1,
  pageSize: 10,
})

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const loadStats = async () => {
  try {
    const res = await onlineApi.getOnlineList()
    const responseData = res as Record<string, unknown>
    if (responseData.success) {
      const data = responseData.data as Record<string, unknown>
      stats.value.onlineCount = Number(data.onlineCount) || 0
    }
  } catch (err) {
    console.error('[OnlineList] loadStats failed:', err)
    // 静默降级，保持 stats 为 0
  }
}

const handleQuery = async () => {
  loading.value = true
  try {
    const res = await onlineApi.getOnlinePage(queryParams)
    const responseData = res as Record<string, unknown>
    if (responseData.success) {
      tableData.value = responseData.data as OnlineInfo[]
      const pagination = responseData.pagination as Record<string, unknown>
      total.value = Number(pagination.total) || 0
    }
  } catch {
    ElMessage.error('获取在线用户失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  queryParams.pageNum = 1
  queryParams.pageSize = 10
  queryParams.userName = undefined
  handleQuery()
}

const handleRefresh = () => {
  loadStats()
  handleQuery()
}

const handleSelectionChange = (selection: OnlineInfo[]) => {
  selectedIds.value = selection.map((item) => item.tokenId)
}

const handleForceLogout = async (row: OnlineInfo) => {
  try {
    await ElMessageBox.confirm(`确认强制下线用户 ${row.userName} 吗？`, '提示', { type: 'warning' })
    await onlineApi.forceLogout(row.tokenId)
    ElMessage.success('强制下线成功')
    loadStats()
    handleQuery()
  } catch (err) {
    if (!String((err as Error)?.message)?.includes('cancel')) {
      console.error('[OnlineList] handleForceLogout failed:', err)
      ElMessage.error('强制下线失败，请重试')
    }
  }
}

const handleBatchForceLogout = async () => {
  try {
    await ElMessageBox.confirm(`确认强制下线选中的 ${selectedIds.value.length} 名用户吗？`, '提示', { type: 'warning' })
    await onlineApi.batchForceLogout(selectedIds.value)
    ElMessage.success('批量强制下线成功')
    loadStats()
    handleQuery()
  } catch (err) {
    if (!String((err as Error)?.message)?.includes('cancel')) {
      console.error('[OnlineList] handleBatchForceLogout failed:', err)
      ElMessage.error('批量强制下线失败，请重试')
    }
  }
}

onMounted(() => {
  loadStats()
  handleQuery()
})
</script>

<style lang="scss" scoped>
.page-container {
  .stats-row {
    margin-bottom: 16px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;

    .stat-info {
      .stat-value {
        font-size: 32px;
        font-weight: 700;
        color: var(--el-text-color-primary);
      }

      .stat-label {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin-top: 4px;
      }
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-bg-color);

      &.total {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.pc {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.mobile {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
    }
  }

  .search-card {
    margin-bottom: 16px;
  }

  .toolbar-card {
    margin-bottom: 16px;

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

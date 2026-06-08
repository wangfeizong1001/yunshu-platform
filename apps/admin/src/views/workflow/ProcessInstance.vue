<template>
  <div class="process-instance">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="流程名称" prop="processName">
          <el-input v-model="queryParams.processName" placeholder="请输入流程名称" clearable />
        </el-form-item>
        <el-form-item label="业务编号" prop="businessKey">
          <el-input v-model="queryParams.businessKey" placeholder="请输入业务编号" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="运行中" value="running" />
            <el-option label="已完成" value="completed" />
            <el-option label="已终止" value="terminated" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="table-header">
          <div class="left">
            <span class="title">流程实例</span>
            <el-tag type="info" class="count-tag">{{ total }}条</el-tag>
          </div>
          <div class="right">
            <el-button :icon="Refresh" circle @click="refreshTable" />
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="instanceList" stripe border>
        <el-table-column prop="processDefinitionName" label="流程名称" width="150" />
        <el-table-column prop="businessKey" label="业务编号" width="180" />
        <el-table-column prop="startUserId" label="发起人" width="120" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180">
          <template #default="{ row }">
            {{ row.endTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'running'" type="primary">运行中</el-tag>
            <el-tag v-else-if="row.status === 'completed'" type="success">已完成</el-tag>
            <el-tag v-else-if="row.status === 'terminated'" type="danger">已终止</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currentTaskNames" label="当前节点" min-width="150">
          <template #default="{ row }">
            <el-tag v-if="row.currentTaskNames && row.currentTaskNames.length > 0" type="info" size="small">
              {{ row.currentTaskNames[0] }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.status === 'running'"
              link
              type="danger"
              @click="handleTerminate(row)"
            >
              终止
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <el-drawer
      v-model="viewDrawerVisible"
      title="流程实例详情"
      size="60%"
    >
      <div v-if="currentInstance" class="instance-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="流程名称">{{ currentInstance.processDefinitionName }}</el-descriptions-item>
          <el-descriptions-item label="业务编号">{{ currentInstance.businessKey }}</el-descriptions-item>
          <el-descriptions-item label="发起人">{{ currentInstance.startUserId }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ currentInstance.startTime }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ currentInstance.endTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag v-if="currentInstance.status === 'running'" type="primary">运行中</el-tag>
            <el-tag v-else-if="currentInstance.status === 'completed'" type="success">已完成</el-tag>
            <el-tag v-else-if="currentInstance.status === 'terminated'" type="danger">已终止</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="flow-chart-section">
          <h4>流程进度</h4>
          <div class="flow-chart">
            <div class="flow-node start">
              <div class="node-icon">●</div>
              <div class="node-label">开始</div>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-node done">
              <div class="node-icon">▢</div>
              <div class="node-label">发起申请</div>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-node current">
              <div class="node-icon">▢</div>
              <div class="node-label">部门经理审批</div>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-node pending">
              <div class="node-icon">◉</div>
              <div class="node-label">结束</div>
            </div>
          </div>
        </div>

        <div class="history-section">
          <h4>审批历史</h4>
          <el-timeline>
            <el-timeline-item
              v-for="(item, idx) in instanceHistory"
              :key="idx"
              :timestamp="item.time"
            >
              <div class="timeline-content">
                <div class="timeline-user">{{ item.user }}</div>
                <div class="timeline-action" :class="item.action">{{ item.actionText }}</div>
                <div class="timeline-comment" v-if="item.comment">{{ item.comment }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { type ProcessInstance } from '@/api/workflow.api'
import { getMockProcessInstancePage } from '@/mock/workflow.mock'

const loading = ref(false)
const instanceList = ref<ProcessInstance[]>([])
const total = ref(0)

const queryParams = reactive({
  processName: '',
  businessKey: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
})

const viewDrawerVisible = ref(false)
const currentInstance = ref<ProcessInstance | null>(null)

const instanceHistory = ref([
  {
    user: '张三',
    action: 'start',
    actionText: '发起申请',
    comment: '申请年假3天，从6月1日到6月3日',
    time: '2024-06-01 09:00:00',
  },
])

async function fetchInstanceList() {
  loading.value = true
  try {
    const res = getMockProcessInstancePage(queryParams)
    instanceList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.pageNum = 1
  fetchInstanceList()
}

function resetQuery() {
  queryParams.processName = ''
  queryParams.businessKey = ''
  queryParams.status = ''
  queryParams.pageNum = 1
  handleQuery()
}

function refreshTable() {
  fetchInstanceList()
}

function handleView(row: ProcessInstance) {
  currentInstance.value = row
  viewDrawerVisible.value = true
}

async function handleTerminate(row: ProcessInstance) {
  try {
    await ElMessageBox.confirm('确定要终止该流程实例吗？', '提示', {
      type: 'warning',
    })
    ElMessage.success('终止成功')
    refreshTable()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('终止失败', error)
    }
  }
}

onMounted(() => {
  fetchInstanceList()
})
</script>

<style scoped lang="scss">
.process-instance {
  .search-card {
    margin-bottom: 16px;
  }

  .table-card {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 16px;
        font-weight: 600;
      }
      .count-tag {
        margin-left: 8px;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .instance-detail {
    .flow-chart-section,
    .history-section {
      margin-top: 24px;
      h4 {
        margin-bottom: 16px;
      }
    }

    .flow-chart {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: #f5f7fa;
      border-radius: 8px;
      .flow-node {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        .node-icon {
          font-size: 24px;
        }
        &.start .node-icon {
          color: #67c23a;
        }
        &.done .node-icon {
          color: #67c23a;
        }
        &.current {
          .node-icon {
            color: #409eff;
            animation: pulse 2s infinite;
          }
          .node-label {
            color: #409eff;
            font-weight: 600;
          }
        }
        &.pending .node-icon {
          color: #c0c4cc;
        }
      }
      .flow-arrow {
        color: #c0c4cc;
        font-size: 20px;
      }
    }

    .timeline-content {
      .timeline-user {
        font-weight: 600;
      }
      .timeline-action {
        margin-top: 4px;
        &.start {
          color: #67c23a;
        }
      }
      .timeline-comment {
        margin-top: 8px;
        color: #606266;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>

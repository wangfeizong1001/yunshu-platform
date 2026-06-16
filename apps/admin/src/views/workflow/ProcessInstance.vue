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
            {{ (row as ProcessInstance).endTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="(row as ProcessInstance).status === 'running'" type="primary">运行中</el-tag>
            <el-tag v-else-if="(row as ProcessInstance).status === 'completed'" type="success">已完成</el-tag>
            <el-tag v-else-if="(row as ProcessInstance).status === 'terminated'" type="danger">已终止</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currentTaskNames" label="当前节点" min-width="150">
          <template #default="{ row }">
            <el-tag v-if="(row as ProcessInstance).currentTaskNames && (row as ProcessInstance).currentTaskNames!.length > 0" type="info" size="small">
              {{ (row as ProcessInstance).currentTaskNames![0] }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link @click="handleView(row as unknown as ProcessInstance)">查看</el-button>
            <el-button
              v-if="(row as ProcessInstance).status === 'running'"
              link
              type="danger"
              @click="handleTerminate(row as unknown as ProcessInstance)"
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
          <div class="flow-chart" v-if="instanceFlowNodes.length > 0">
            <template v-for="(node, idx) in instanceFlowNodes" :key="node.id">
              <div
                class="flow-node"
                :class="{
                  start: node.type === 'start',
                  done: node.status === 'done',
                  current: node.status === 'current',
                  pending: node.status === 'pending',
                }"
              >
                <div class="node-icon">{{ node.icon }}</div>
                <div class="node-label">{{ node.name }}</div>
                <div class="node-assignee" v-if="node.assignee">{{ node.assignee }}</div>
              </div>
              <div class="flow-arrow" v-if="idx < instanceFlowNodes.length - 1">→</div>
            </template>
          </div>
          <div v-else class="flow-chart-simple">
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

        <div class="variables-section">
          <h4>流程变量</h4>
          <el-table :data="instanceVariables" border size="small">
            <el-table-column prop="name" label="变量名" width="150" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="value" label="值" min-width="200" />
            <el-table-column prop="updateTime" label="更新时间" width="180" />
          </el-table>
        </div>

        <div class="history-section">
          <h4>审批历史</h4>
          <el-table :data="instanceHistory" border stripe size="small">
            <el-table-column prop="taskName" label="任务名称" width="150" />
            <el-table-column prop="assignee" label="处理人" width="100" />
            <el-table-column prop="action" label="操作" width="100">
              <template #default="{ row }">
                <el-tag :type="getActionType(row.action)" size="small">{{ row.actionText }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="审批意见" min-width="200" />
            <el-table-column prop="duration" label="处理时长" width="100">
              <template #default="{ row }">
                {{ row.duration || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="完成时间" width="180" />
          </el-table>
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

// 流程进度节点
interface FlowNodeItem {
  id: string
  name: string
  type: string
  icon: string
  assignee?: string
  status: 'done' | 'current' | 'pending'
}

const instanceFlowNodes = ref<FlowNodeItem[]>([])

// 流程变量
interface ProcessVariable {
  name: string
  type: string
  value: string
  updateTime: string
}

const instanceVariables = ref<ProcessVariable[]>([])

// 审批历史
interface HistoryItem {
  taskName: string
  assignee: string
  action: string
  actionText: string
  comment?: string
  duration?: string
  endTime: string
}

const instanceHistory = ref<HistoryItem[]>([
  {
    taskName: '发起申请',
    assignee: '张三',
    action: 'start',
    actionText: '发起申请',
    comment: '申请年假3天，从6月1日到6月3日',
    duration: '0分钟',
    endTime: '2024-06-01 09:00:00',
  },
  {
    taskName: '部门经理审批',
    assignee: '李四',
    action: 'approve',
    actionText: '审批通过',
    comment: '同意申请',
    duration: '2小时30分钟',
    endTime: '2024-06-01 11:30:00',
  },
])

async function fetchInstanceList() {
  loading.value = true
  try {
    const res = getMockProcessInstancePage(queryParams)
    instanceList.value = res.rows as unknown as ProcessInstance[]
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
  loadInstanceDetail(row)
  viewDrawerVisible.value = true
}

function loadInstanceDetail(row: ProcessInstance) {
  // 模拟加载流程进度节点
  if (row.status === 'running') {
    instanceFlowNodes.value = [
      { id: '1', name: '开始', type: 'start', icon: '●', status: 'done' },
      { id: '2', name: '发起申请', type: 'task', icon: '▢', assignee: '张三', status: 'done' },
      { id: '3', name: '部门经理审批', type: 'task', icon: '▢', assignee: '李四', status: 'current' },
      { id: '4', name: '结束', type: 'end', icon: '◉', status: 'pending' },
    ]
  } else {
    instanceFlowNodes.value = [
      { id: '1', name: '开始', type: 'start', icon: '●', status: 'done' },
      { id: '2', name: '发起申请', type: 'task', icon: '▢', assignee: '张三', status: 'done' },
      { id: '3', name: '部门经理审批', type: 'task', icon: '▢', assignee: '李四', status: 'done' },
      { id: '4', name: '结束', type: 'end', icon: '◉', status: 'done' },
    ]
  }

  // 模拟加载流程变量
  instanceVariables.value = [
    { name: 'days', type: 'Integer', value: '3', updateTime: '2024-06-01 09:00:00' },
    { name: 'startDate', type: 'Date', value: '2024-06-01', updateTime: '2024-06-01 09:00:00' },
    { name: 'endDate', type: 'Date', value: '2024-06-03', updateTime: '2024-06-01 09:00:00' },
    { name: 'reason', type: 'String', value: '年假', updateTime: '2024-06-01 09:00:00' },
    { name: 'amount', type: 'Double', value: '0.0', updateTime: '2024-06-01 09:00:00' },
  ]

  // 模拟加载审批历史
  instanceHistory.value = [
    {
      taskName: '发起申请',
      assignee: '张三',
      action: 'start',
      actionText: '发起申请',
      comment: '申请年假3天，从6月1日到6月3日',
      duration: '0分钟',
      endTime: '2024-06-01 09:00:00',
    },
    {
      taskName: '部门经理审批',
      assignee: '李四',
      action: 'approve',
      actionText: '审批通过',
      comment: '同意申请',
      duration: '2小时30分钟',
      endTime: '2024-06-01 11:30:00',
    },
  ]
}

function getActionType(action: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    start: 'success',
    approve: 'primary',
    reject: 'danger',
    delegate: 'warning',
    addSign: 'info',
  }
  return typeMap[action] || 'info'
}

async function handleTerminate(_row: ProcessInstance) {
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
    .variables-section,
    .history-section {
      margin-top: 24px;
      h4 {
        margin-bottom: 16px;
      }
    }

    .flow-chart,
    .flow-chart-simple {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: var(--surface-2);
      border-radius: 8px;
      flex-wrap: wrap;
      .flow-node {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        min-width: 80px;
        .node-icon {
          font-size: 24px;
        }
        .node-label {
          font-size: 12px;
        }
        .node-assignee {
          font-size: 10px;
          color: var(--text-muted);
        }
        &.start .node-icon {
          color: var(--success);
        }
        &.done .node-icon {
          color: var(--success);
        }
        &.done .node-label {
          color: var(--success);
        }
        &.current {
          .node-icon {
            color: var(--el-color-primary);
          }
          .node-label {
            color: var(--el-color-primary);
            font-weight: 600;
          }
        }
        &.pending .node-icon {
          color: var(--text-muted);
        }
        &.pending .node-label {
          color: var(--text-muted);
        }
      }
      .flow-arrow {
        color: var(--text-muted);
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
          color: var(--success);
        }
      }
      .timeline-comment {
        margin-top: 8px;
        color: var(--text-secondary);
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

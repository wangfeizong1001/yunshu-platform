<template>
  <div class="todo-list">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入任务名称" clearable />
        </el-form-item>
        <el-form-item label="流程名称" prop="processName">
          <el-input v-model="queryParams.processName" placeholder="请输入流程名称" clearable />
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
            <span class="title">待办任务</span>
            <el-tag type="danger" class="count-tag">{{ total }}条</el-tag>
          </div>
          <div class="right">
            <el-button :icon="Refresh" circle @click="refreshTable" />
            <el-button :icon="Download" @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <div class="batch-actions" v-if="selectedTasks.length > 0">
        <el-alert type="info" :closable="false">
          已选择 {{ selectedTasks.length }} 项，
          <el-button type="primary" link @click="handleBatchApprove">批量通过</el-button>
          <el-button type="danger" link @click="handleBatchReject">批量驳回</el-button>
          <el-button type="warning" link @click="handleBatchTransfer">批量转办</el-button>
          <el-button link @click="selectedTasks = []">清空选择</el-button>
        </el-alert>
      </div>

      <el-table
        v-loading="loading"
        :data="taskList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="任务名称" min-width="150" />
        <el-table-column prop="processDefinitionName" label="流程名称" width="150" />
        <el-table-column prop="businessKey" label="业务编号" width="180" />
        <el-table-column prop="startTime" label="接收时间" width="180" />
        <el-table-column prop="assignee" label="处理人" width="120">
          <template #default="{ row }">
            {{ row.assignee || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.priority >= 80" type="danger">高</el-tag>
            <el-tag v-else-if="row.priority >= 50" type="warning">中</el-tag>
            <el-tag v-else type="info">低</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="360" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleApprove(row as Task)">审批</el-button>
            <el-button type="success" link @click="handleAddSign(row as Task)">加签</el-button>
            <el-button type="warning" link @click="handleDelegate(row as Task)">转办</el-button>
            <el-button type="info" link @click="handleAssign(row as Task)">委托</el-button>
            <el-button link @click="handleView(row as Task)">查看</el-button>
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

    <el-dialog
      v-model="approveDialogVisible"
      title="审批"
      width="500px"
    >
      <el-form :model="approveForm" label-width="80px">
        <el-form-item label="审批意见">
          <el-input
            v-model="approveForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入审批意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="handleRejectSubmit">驳回</el-button>
        <el-button type="primary" @click="handleApproveSubmit">通过</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="delegateDialogVisible"
      title="转办"
      width="500px"
    >
      <el-form :model="delegateForm" label-width="80px">
        <el-form-item label="转办给">
          <el-select v-model="delegateForm.userId" placeholder="请选择用户" style="width: 100%">
            <el-option label="管理员" value="1" />
            <el-option label="张三" value="2" />
            <el-option label="李四" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="delegateForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="delegateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDelegateSubmit">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="assignDialogVisible"
      title="委托"
      width="500px"
    >
      <el-form :model="assignForm" label-width="80px">
        <el-form-item label="委托给">
          <el-select v-model="assignForm.userId" placeholder="请选择用户" style="width: 100%">
            <el-option label="管理员" value="1" />
            <el-option label="张三" value="2" />
            <el-option label="李四" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="assignForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAssignSubmit">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="addSignDialogVisible"
      title="加签"
      width="500px"
    >
      <el-form :model="addSignForm" label-width="80px">
        <el-form-item label="加签类型">
          <el-radio-group v-model="addSignForm.type">
            <el-radio value="before">前加签</el-radio>
            <el-radio value="after">后加签</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="加签人">
          <el-select v-model="addSignForm.userId" placeholder="请选择用户" style="width: 100%">
            <el-option label="管理员" value="1" />
            <el-option label="张三" value="2" />
            <el-option label="李四" value="3" />
            <el-option label="王五" value="4" />
            <el-option label="赵六" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="加签意见">
          <el-input
            v-model="addSignForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入加签意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addSignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSignSubmit">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="batchTransferDialogVisible"
      title="批量转办"
      width="500px"
    >
      <el-form :model="batchTransferForm" label-width="80px">
        <el-form-item label="转办给">
          <el-select v-model="batchTransferForm.userId" placeholder="请选择用户" style="width: 100%">
            <el-option label="管理员" value="1" />
            <el-option label="张三" value="2" />
            <el-option label="李四" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="转办原因">
          <el-input
            v-model="batchTransferForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入转办原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchTransferDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchTransferSubmit">确认转办</el-button>
      </template>
    </el-dialog>

    <el-drawer
      v-model="viewDrawerVisible"
      title="任务详情"
      size="50%"
    >
      <div v-if="currentTask" class="task-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="任务名称">{{ currentTask.name }}</el-descriptions-item>
          <el-descriptions-item label="流程名称">{{ currentTask.processDefinitionName }}</el-descriptions-item>
          <el-descriptions-item label="业务编号">{{ currentTask.businessKey }}</el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag v-if="currentTask.priority >= 80" type="danger">高</el-tag>
            <el-tag v-else-if="currentTask.priority >= 50" type="warning">中</el-tag>
            <el-tag v-else type="info">低</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="接收时间">{{ currentTask.startTime }}</el-descriptions-item>
          <el-descriptions-item label="处理人">{{ currentTask.assignee || '-' }}</el-descriptions-item>
          <el-descriptions-item label="任务描述" :span="2">{{ currentTask.description || '-' }}</el-descriptions-item>
        </el-descriptions>

        <div class="history-section">
          <h4>审批历史</h4>
          <el-timeline>
            <el-timeline-item
              v-for="(item, idx) in taskHistory"
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
import { ElMessage } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { type Task } from '@/api/workflow.api'
import { getMockTodoTaskPage } from '@/mock/workflow.mock'

const loading = ref(false)
const taskList = ref<Task[]>([])
const total = ref(0)
const selectedTasks = ref<Task[]>([])

const queryParams = reactive({
  name: '',
  processName: '',
  pageNum: 1,
  pageSize: 10,
})

const approveDialogVisible = ref(false)
const delegateDialogVisible = ref(false)
const assignDialogVisible = ref(false)
const addSignDialogVisible = ref(false)
const batchTransferDialogVisible = ref(false)
const viewDrawerVisible = ref(false)

const currentTask = ref<Task | null>(null)

const approveForm = reactive({
  comment: '',
})

const delegateForm = reactive({
  userId: '',
  comment: '',
})

const assignForm = reactive({
  userId: '',
  comment: '',
})

const addSignForm = reactive({
  type: 'after',
  userId: '',
  comment: '',
})

const batchTransferForm = reactive({
  userId: '',
  reason: '',
})

const taskHistory = ref([
  {
    user: '张三',
    action: 'start',
    actionText: '发起申请',
    comment: '申请年假3天，从6月1日到6月3日',
    time: '2024-06-01 09:00:00',
  },
])

async function fetchTaskList() {
  loading.value = true
  try {
    const res = getMockTodoTaskPage(queryParams)
    taskList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.pageNum = 1
  fetchTaskList()
}

function resetQuery() {
  queryParams.name = ''
  queryParams.processName = ''
  queryParams.pageNum = 1
  handleQuery()
}

function refreshTable() {
  fetchTaskList()
}

function handleApprove(row: Task) {
  currentTask.value = row
  approveForm.comment = ''
  approveDialogVisible.value = true
}

function handleDelegate(row: Task) {
  currentTask.value = row
  delegateForm.userId = ''
  delegateForm.comment = ''
  delegateDialogVisible.value = true
}

function handleAssign(row: Task) {
  currentTask.value = row
  assignForm.userId = ''
  assignForm.comment = ''
  assignDialogVisible.value = true
}

function handleView(row: Task) {
  currentTask.value = row
  viewDrawerVisible.value = true
}

function handleApproveSubmit() {
  ElMessage.success('审批通过')
  approveDialogVisible.value = false
  refreshTable()
}

function handleRejectSubmit() {
  ElMessage.success('已驳回')
  approveDialogVisible.value = false
  refreshTable()
}

function handleDelegateSubmit() {
  if (!delegateForm.userId) {
    ElMessage.warning('请选择转办对象')
    return
  }
  ElMessage.success('转办成功')
  delegateDialogVisible.value = false
  refreshTable()
}

function handleAssignSubmit() {
  if (!assignForm.userId) {
    ElMessage.warning('请选择委托对象')
    return
  }
  ElMessage.success('委托成功')
  assignDialogVisible.value = false
  refreshTable()
}

function handleAddSign(row: Task) {
  currentTask.value = row
  addSignForm.type = 'after'
  addSignForm.userId = ''
  addSignForm.comment = ''
  addSignDialogVisible.value = true
}

function handleAddSignSubmit() {
  if (!addSignForm.userId) {
    ElMessage.warning('请选择加签人')
    return
  }
  const typeText = addSignForm.type === 'before' ? '前加签' : '后加签'
  ElMessage.success(`${typeText}成功`)
  addSignDialogVisible.value = false
  refreshTable()
}

function handleSelectionChange(selection: Task[]) {
  selectedTasks.value = selection
}

function handleBatchApprove() {
  if (selectedTasks.value.length === 0) {
    ElMessage.warning('请先选择任务')
    return
  }
  ElMessage.success(`已批量通过 ${selectedTasks.value.length} 项任务`)
  selectedTasks.value = []
  refreshTable()
}

function handleBatchReject() {
  if (selectedTasks.value.length === 0) {
    ElMessage.warning('请先选择任务')
    return
  }
  ElMessage.success(`已批量驳回 ${selectedTasks.value.length} 项任务`)
  selectedTasks.value = []
  refreshTable()
}

function handleBatchTransfer() {
  if (selectedTasks.value.length === 0) {
    ElMessage.warning('请先选择任务')
    return
  }
  batchTransferForm.userId = ''
  batchTransferForm.reason = ''
  batchTransferDialogVisible.value = true
}

function handleBatchTransferSubmit() {
  if (!batchTransferForm.userId) {
    ElMessage.warning('请选择转办对象')
    return
  }
  ElMessage.success(`已批量转办 ${selectedTasks.value.length} 项任务`)
  batchTransferDialogVisible.value = false
  selectedTasks.value = []
  refreshTable()
}

function handleExport() {
  ElMessage.info('正在导出任务数据...')
}

onMounted(() => {
  fetchTaskList()
})
</script>

<style scoped lang="scss">
.todo-list {
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

  .batch-actions {
    margin-bottom: 16px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .task-detail {
    .history-section {
      margin-top: 24px;
      h4 {
        margin-bottom: 16px;
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
}
</style>

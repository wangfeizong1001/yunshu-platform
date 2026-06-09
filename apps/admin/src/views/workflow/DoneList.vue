<template>
  <div class="done-list">
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
            <span class="title">已办任务</span>
            <el-tag type="info" class="count-tag">{{ total }}条</el-tag>
          </div>
          <div class="right">
            <el-button :icon="Refresh" circle @click="refreshTable" />
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="taskList" stripe border>
        <el-table-column prop="name" label="任务名称" min-width="150" />
        <el-table-column prop="processDefinitionName" label="流程名称" width="150" />
        <el-table-column prop="businessKey" label="业务编号" width="180" />
        <el-table-column prop="startTime" label="接收时间" width="180" />
        <el-table-column prop="endTime" label="完成时间" width="180" />
        <el-table-column prop="assignee" label="处理人" width="120">
          <template #default="{ row }">
            {{ row.assignee || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
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
          <el-descriptions-item label="接收时间">{{ currentTask.startTime }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ currentTask.endTime }}</el-descriptions-item>
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
import { Search, Refresh } from '@element-plus/icons-vue'
import { type Task } from '@/api/workflow.api'
import { getMockDoneTaskPage } from '@/mock/workflow.mock'

const loading = ref(false)
const taskList = ref<Task[]>([])
const total = ref(0)

const queryParams = reactive({
  name: '',
  processName: '',
  pageNum: 1,
  pageSize: 10,
})

const viewDrawerVisible = ref(false)
const currentTask = ref<Task | null>(null)

const taskHistory = ref([
  {
    user: '张三',
    action: 'start',
    actionText: '发起申请',
    comment: '申请年假3天，从6月1日到6月3日',
    time: '2024-06-01 09:00:00',
  },
  {
    user: '管理员',
    action: 'approve',
    actionText: '审批通过',
    comment: '同意',
    time: '2024-06-01 10:30:00',
  },
])

async function fetchTaskList() {
  loading.value = true
  try {
    const res = getMockDoneTaskPage(queryParams)
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

function handleView(row: Task) {
  currentTask.value = row
  viewDrawerVisible.value = true
}

onMounted(() => {
  fetchTaskList()
})
</script>

<style scoped lang="scss">
.done-list {
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
          &.approve {
            color: #409eff;
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

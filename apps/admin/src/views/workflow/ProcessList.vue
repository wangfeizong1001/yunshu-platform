<template>
  <div class="process-list">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入流程名称" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="active" />
            <el-option label="已挂起" value="suspended" />
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
            <el-button type="primary" :icon="Plus" @click="handleAdd">新建流程</el-button>
          </div>
          <div class="right">
            <el-button :icon="Refresh" circle @click="refreshTable" />
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="processList" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" fixed />
        <el-table-column prop="name" label="流程名称" min-width="150" />
        <el-table-column prop="key" label="流程标识" width="180" />
        <el-table-column prop="version" label="版本" width="80" align="center" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType((row as ProcessDefinition).status)">
              {{ getStatusLabel((row as ProcessDefinition).status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDesign(row as unknown as ProcessDefinition)">设计</el-button>
            <el-button
              v-if="(row as ProcessDefinition).status === 'draft'"
              link
              type="success"
              @click="handleDeploy(row as unknown as ProcessDefinition)"
            >
              发布
            </el-button>
            <el-button
              v-if="(row as ProcessDefinition).status === 'active'"
              link
              type="warning"
              @click="handleSuspend(row as unknown as ProcessDefinition)"
            >
              挂起
            </el-button>
            <el-button
              v-if="(row as ProcessDefinition).status === 'suspended'"
              link
              type="success"
              @click="handleActivate(row as unknown as ProcessDefinition)"
            >
              激活
            </el-button>
            <el-dropdown trigger="click">
              <el-button link type="primary">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleEdit(row as unknown as ProcessDefinition)">编辑</el-dropdown-item>
                  <el-dropdown-item @click="handleCopy(row as unknown as ProcessDefinition)">复制</el-dropdown-item>
                  <el-dropdown-item @click="handleExport(row as unknown as ProcessDefinition)">导出</el-dropdown-item>
                  <el-dropdown-item divided @click="handleDelete(row as unknown as ProcessDefinition)" type="danger">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

    <!-- 流程表单对话框 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="isEdit ? '编辑流程' : '新建流程'"
      width="500px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入流程名称" />
        </el-form-item>
        <el-form-item label="流程标识" prop="key">
          <el-input v-model="formData.key" placeholder="请输入流程标识" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择分类" clearable>
            <el-option label="OA" value="OA" />
            <el-option label="财务" value="财务" />
            <el-option label="采购" value="采购" />
            <el-option label="法务" value="法务" />
            <el-option label="HR" value="HR" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import {
  type ProcessDefinition,
  type ProcessDefinitionForm,
} from '@/api/workflow.api'
import {
  getMockProcessDefinitionPage,
} from '@/mock/workflow.mock'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态
const loading = ref(false)
const processList = ref<ProcessDefinition[]>([])
const total = ref(0)
const selectedRows = ref<ProcessDefinition[]>([])
const formDialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive<ProcessDefinitionForm>({
  id: '',
  name: '',
  key: '',
  category: '',
  description: '',
})

// 查询参数
const queryParams = reactive({
  name: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
})

// 表单验证规则
const formRules: FormRules<ProcessDefinitionForm> = {
  name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入流程标识', trigger: 'blur' }],
}

// 获取流程定义列表
async function fetchProcessList() {
  loading.value = true
  try {
    const res = getMockProcessDefinitionPage(queryParams)
    processList.value = res.rows as unknown as ProcessDefinition[]
    total.value = res.total
  } catch (error) {
    console.error('获取流程列表失败', error)
  } finally {
    loading.value = false
  }
}

function getStatusType(status: string): 'success' | 'primary' | 'warning' | 'info' | 'danger' {
  const typeMap: Record<string, 'success' | 'primary' | 'warning' | 'info' | 'danger'> = {
    draft: 'info',
    active: 'success',
    suspended: 'warning',
  }
  return (typeMap[status] || 'info') as 'success' | 'primary' | 'warning' | 'info' | 'danger'
}

// 获取状态标签
function getStatusLabel(status: string) {
  const labelMap: Record<string, string> = {
    draft: '草稿',
    active: '已发布',
    suspended: '已挂起',
  }
  return labelMap[status] || status
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchProcessList()
}

// 重置查询
function resetQuery() {
  queryParams.name = ''
  queryParams.status = ''
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchProcessList()
}

// 新增
function handleAdd() {
  isEdit.value = false
  Object.assign(formData, {
    id: '',
    name: '',
    key: '',
    category: '',
    description: '',
  })
  formDialogVisible.value = true
}

// 编辑
function handleEdit(row: ProcessDefinition) {
  isEdit.value = true
  Object.assign(formData, row)
  formDialogVisible.value = true
}

// 设计
function handleDesign(row: ProcessDefinition) {
  router.push(`/workflow/process/design/${row.id}`)
}

// 发布
async function handleDeploy(row: ProcessDefinition) {
  try {
    await ElMessageBox.confirm(`确认发布流程"${row.name}"吗？`, '提示', {
      type: 'warning',
    })
    ElMessage.success('发布成功')
    refreshTable()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('发布失败', error)
    }
  }
}

// 挂起
async function handleSuspend(row: ProcessDefinition) {
  try {
    await ElMessageBox.confirm(`确认挂起流程"${row.name}"吗？`, '提示', {
      type: 'warning',
    })
    ElMessage.success('挂起成功')
    refreshTable()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('挂起失败', error)
    }
  }
}

// 激活
async function handleActivate(row: ProcessDefinition) {
  try {
    await ElMessageBox.confirm(`确认激活流程"${row.name}"吗？`, '提示', {
      type: 'warning',
    })
    ElMessage.success('激活成功')
    refreshTable()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('激活失败', error)
    }
  }
}

// 复制
function handleCopy(_row: ProcessDefinition) {
  ElMessage.info('复制功能开发中')
}

// 导出
function handleExport(_row: ProcessDefinition) {
  ElMessage.info('导出功能开发中')
}

// 删除
async function handleDelete(row: ProcessDefinition) {
  try {
    await ElMessageBox.confirm(`确认删除流程"${row.name}"吗？`, '提示', {
      type: 'warning',
    })
    ElMessage.success('删除成功')
    refreshTable()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 表单提交
async function handleFormSubmit() {
  await formRef.value?.validate()
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
  formDialogVisible.value = false
  refreshTable()
}

// 选择变化
function handleSelectionChange(selection: ProcessDefinition[]) {
  selectedRows.value = selection
}

// 初始化
onMounted(() => {
  fetchProcessList()
})
</script>

<style scoped lang="scss">
.process-list {
  .search-card {
    margin-bottom: 16px;
  }

  .table-card {
    .table-header {
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

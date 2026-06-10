<template>
  <div class="report-list">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="报表名称" prop="reportName">
          <el-input
            v-model="queryParams.reportName"
            placeholder="请输入报表名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="报表类型" prop="reportType">
          <el-select v-model="queryParams.reportType" placeholder="请选择报表类型" clearable>
            <el-option label="图表" value="chart" />
            <el-option label="表格" value="table" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格工具栏 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="table-header">
          <div class="left">
            <el-button
              v-has-permi="['report:add']"
              type="primary"
              :icon="Plus"
              @click="handleAdd"
            >
              新增
            </el-button>
            <el-button
              v-has-permi="['report:delete']"
              type="danger"
              :icon="Delete"
              :disabled="selectedRows.length === 0"
              @click="handleBatchDelete"
            >
              批量删除
            </el-button>
          </div>
          <div class="right">
            <el-button :icon="Refresh" circle @click="refreshTable" />
          </div>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="reportList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="reportId" label="报表ID" width="100" />
        <el-table-column prop="reportName" label="报表名称" width="200" />
        <el-table-column prop="reportCode" label="报表编码" width="150" />
        <el-table-column prop="reportType" label="报表类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.reportType === 'chart' ? 'primary' : 'success'">
              {{ row.reportType === 'chart' ? '图表' : '表格' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['report:view']"
              link
              type="primary"
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              v-has-permi="['report:edit']"
              link
              type="primary"
              @click="handleEdit(row)"
            >
              设计
            </el-button>
            <el-button
              v-has-permi="['report:export']"
              link
              type="success"
              @click="handleExport(row)"
            >
              导出
            </el-button>
            <el-button
              v-has-permi="['report:delete']"
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑报表' : '新增报表'"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="报表名称" prop="reportName">
          <el-input v-model="formData.reportName" placeholder="请输入报表名称" />
        </el-form-item>
        <el-form-item label="报表编码" prop="reportCode">
          <el-input v-model="formData.reportCode" placeholder="请输入报表编码" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="报表类型" prop="reportType">
          <el-select v-model="formData.reportType" placeholder="请选择报表类型">
            <el-option label="图表" value="chart" />
            <el-option label="表格" value="table" />
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
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio value="0">正常</el-radio>
            <el-radio value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 导出对话框 -->
    <el-dialog
      v-model="exportDialogVisible"
      title="导出报表"
      width="400px"
      destroy-on-close
    >
      <el-form label-width="100px">
        <el-form-item label="导出格式">
          <el-radio-group v-model="exportFormat">
            <el-radio value="excel">Excel</el-radio>
            <el-radio value="pdf">PDF</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="exportLoading" @click="handleConfirmExport">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import {
  getReportPage,
  addReport,
  updateReport,
  deleteReport,
  batchDeleteReport,
  exportReport,
  getReportData,
  type ReportForm
} from '@/api/report.api'
import { exportToExcel } from '@/utils/export'

const router = useRouter()

// 状态
const loading = ref(false)
const submitLoading = ref(false)
const exportLoading = ref(false)
const reportList = ref<unknown[]>([])
const total = ref(0)
const selectedRows = ref<unknown[]>([])
const dialogVisible = ref(false)
const exportDialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentReport = ref<unknown>(null)
const exportFormat = ref('excel')

// 查询参数
const queryParams = reactive({
  reportName: '',
  reportType: '',
  status: '',
  pageNum: 1,
  pageSize: 10
})

// 表单数据
const formData = reactive<ReportForm>({
  reportName: '',
  reportCode: '',
  reportType: 'chart',
  description: '',
  status: '0',
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  reportName: [{ required: true, message: '请输入报表名称', trigger: 'blur' }],
  reportCode: [
    { required: true, message: '请输入报表编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '报表编码只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  reportType: [{ required: true, message: '请选择报表类型', trigger: 'change' }]
}

// 加载报表列表
async function fetchReportList() {
  loading.value = true
  try {
    const res = await getReportPage(queryParams) as { rows: unknown[]; total: number }
    reportList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchReportList()
}

// 重置查询
function resetQuery() {
  queryParams.reportName = ''
  queryParams.reportType = ''
  queryParams.status = ''
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchReportList()
}

// 新增
function handleAdd() {
  isEdit.value = false
  Object.assign(formData, {
    reportName: '',
    reportCode: '',
    reportType: 'chart',
    description: '',
    status: '0',
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑
function handleEdit(row: Record<string, unknown>) {
  router.push(`/report/design/${row.reportId}`)
}

// 查看
function handleView(row: Record<string, unknown>) {
  router.push(`/report/view/${row.reportId}`)
}

// 删除
async function handleDelete(row: Record<string, unknown>) {
  try {
    await ElMessageBox.confirm(`是否确认删除报表"${row.reportName}"？`, '提示', {
      type: 'warning'
    })
    await deleteReport(row.reportId)
    ElMessage.success('删除成功')
    fetchReportList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

// 批量删除
async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(
      `是否确认删除选中的 ${selectedRows.value.length} 个报表？`,
      '提示',
      {
        type: 'warning'
      }
    )
    const ids = selectedRows.value.map(item => item.reportId)
    await batchDeleteReport(ids)
    ElMessage.success('删除成功')
    fetchReportList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

// 导出
function handleExport(row: Record<string, unknown>) {
  currentReport.value = row
  exportFormat.value = 'excel'
  exportDialogVisible.value = true
}

// 确认导出
async function handleConfirmExport() {
  if (!currentReport.value) return
  
  exportLoading.value = true
  try {
    // 获取报表数据
    const dataRes = await getReportData({ reportId: currentReport.value.reportId }) as { data: unknown }
    const reportData = dataRes.data
    
    if (reportData && reportData.data) {
      if (exportFormat.value === 'excel') {
        exportToExcel(reportData.data, currentReport.value.reportName)
      } else if (exportFormat.value === 'pdf') {
        // 使用 API 导出
        await exportReport(currentReport.value.reportId, 'pdf')
      }
      ElMessage.success('导出成功')
    } else {
      ElMessage.warning('报表数据为空')
    }
    
    exportDialogVisible.value = false
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

// 提交
async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEdit.value && formData.reportId) {
          await updateReport(formData)
          ElMessage.success('修改成功')
        } else {
          await addReport(formData)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        fetchReportList()
      } catch (error) {
        console.error('操作失败:', error)
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 选择变化
function handleSelectionChange(selection: unknown[]) {
  selectedRows.value = selection
}

// 初始化
onMounted(() => {
  fetchReportList()
})
</script>

<style scoped lang="scss">
.report-list {
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

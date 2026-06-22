<template>
  <div class="dept-tree">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="请输入部门名称"
            clearable
            @keyup.enter="handleQuery"
          />
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

    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="table-header">
          <div class="left">
            <el-button
              v-has-permi="['system:dept:add']"
              type="primary"
              :icon="Plus"
              @click="() => handleAdd()"
            >
              新增
            </el-button>
          </div>
          <div class="right">
            <el-button :icon="Refresh" circle @click="refreshTable" />
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="deptList"
        row-key="deptId"
        default-expand-all
        stripe
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="deptName" label="部门名称" width="250" />
        <el-table-column prop="deptId" label="部门编号" width="100" />
        <el-table-column prop="leader" label="负责人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getDeptStatusTagType(row.status)">
              {{ getDeptStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="80" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['system:dept:add']"
              link
              type="primary"
              @click="handleAdd(row as SysDept)"
            >
              新增
            </el-button>
            <el-button
              v-has-permi="['system:dept:edit']"
              link
              type="primary"
              @click="handleEdit(row as SysDept)"
            >
              编辑
            </el-button>
            <el-button
              v-has-permi="['system:dept:delete']"
              link
              type="danger"
              @click="handleDelete(row as SysDept)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 部门表单弹窗 -->
    <DeptForm v-model="formVisible" :dept-data="currentDept" :parent-dept="parentDept" @refresh="fetchDeptTree" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getDeptTree, deleteDept } from '@/api/system/dept.api'
import type { DeptInfo, DeptQuery } from '@/api/system/dept.api'
import type { SysDept } from '@yunshu/shared'
import DeptForm from './DeptForm.vue'

// ========== 状态常量（与后端约定字段值） ==========
const DEPT_STATUS_NORMAL = '0'

/** 部门状态 tag 类型 */
const getDeptStatusTagType = (val: string) =>
  val === DEPT_STATUS_NORMAL ? 'success' : 'danger'

/** 部门状态文本 */
const getDeptStatusLabel = (val: string) =>
  val === DEPT_STATUS_NORMAL ? '正常' : '停用'

// 状态
const loading = ref(false)
const deptList = ref<SysDept[]>([])
const formVisible = ref(false)
const currentDept = ref<SysDept | null>(null)
const parentDept = ref<SysDept | null>(null)

// 查询参数
const queryParams = reactive<DeptQuery>({
  deptName: '',
  status: '',
})

// 加载部门树
async function fetchDeptTree() {
  loading.value = true
  try {
    const res = await getDeptTree(queryParams)
    deptList.value = (res.data as DeptInfo[]) as unknown as SysDept[]
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  fetchDeptTree()
}

// 重置查询
function resetQuery() {
  queryParams.deptName = ''
  queryParams.status = ''
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchDeptTree()
}

// 新增
function handleAdd(row?: SysDept) {
  if (row) {
    parentDept.value = row
  } else {
    parentDept.value = null
  }
  currentDept.value = null
  formVisible.value = true
}

// 编辑
function handleEdit(row: SysDept) {
  currentDept.value = { ...row }
  parentDept.value = null
  formVisible.value = true
}

// 删除
async function handleDelete(row: SysDept) {
  if (row.children?.length) {
    ElMessage.warning('该部门存在下级部门，无法删除')
    return
  }
  try {
    await ElMessageBox.confirm(`是否确认删除部门"${row.deptName}"？`, '提示', {
      type: 'warning',
    })
    await deleteDept(row.deptId)
    ElMessage.success('删除成功')
    fetchDeptTree()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 初始化
onMounted(() => {
  fetchDeptTree()
})
</script>

<style scoped lang="scss">
.dept-tree {
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
}
</style>

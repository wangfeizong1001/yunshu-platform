<template>
  <div class="user-list">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入用户名称/昵称/手机号"
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
        <el-form-item label="部门" prop="deptId">
          <el-tree-select
            v-model="queryParams.deptId"
            :data="deptTree"
            :props="{ label: 'deptName', children: 'children' }"
            placeholder="请选择部门"
            check-strictly
            filterable
            clearable
          />
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
            <el-button v-has-permi="['system:user:add']" type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
            <el-button v-has-permi="['system:user:export']" type="success" :icon="Download" @click="handleExport">导出</el-button>
          </div>
          <div class="right">
            <el-button :icon="Refresh" circle @click="refreshTable" />
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="userList" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="userId" label="用户编号" width="100" />
        <el-table-column prop="username" label="用户名称" width="120" />
        <el-table-column prop="nickname" label="用户昵称" width="120" />
        <el-table-column prop="deptName" label="部门" width="150" />
        <el-table-column prop="phone" label="手机号码" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="sex" label="性别" width="80">
          <template #default="{ row }">
            {{ getSexLabel(row.sex) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getUserStatusTagType(row.status)">
              {{ getUserStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="loginDate" label="最后登录" width="180" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-has-permi="['system:user:edit']" link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button v-has-permi="['system:user:delete']" link type="danger" @click="handleDelete(row)">删除</el-button>
            <el-dropdown trigger="click">
              <el-button link type="primary" :icon="More">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-has-permi="['system:user:resetPwd']" @click="handleResetPassword(row)">重置密码</el-dropdown-item>
                  <el-dropdown-item v-has-permi="['system:user:assignRole']" @click="handleAssignRole(row)">分配角色</el-dropdown-item>
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

    <UserForm v-model="formVisible" :user-data="currentUser" @refresh="handleQuery" />
    <AssignRoleDialog v-model="assignRoleVisible" :user-id="currentUserId" @refresh="handleQuery" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Download, More } from '@element-plus/icons-vue'
import { getUserPage, deleteUser, exportUser } from '@/api/system/user.api'
import { getDeptTreeSelect } from '@/api/system/dept.api'
import type { UserInfo, DeptInfo } from './types'
import UserForm from './UserForm.vue'
import AssignRoleDialog from './AssignRoleDialog.vue'

const loading = ref(false)
const userList = ref<UserInfo[]>([])
const total = ref(0)
const deptTree = ref<DeptInfo[]>([])
const selectedRows = ref<UserInfo[]>([])
const formVisible = ref(false)
const assignRoleVisible = ref(false)
const currentUser = ref<UserInfo | null>(null)
const currentUserId = ref<number>()

const queryParams = reactive({
  keyword: '',
  status: '',
  deptId: undefined as number | undefined,
  pageNum: 1,
  pageSize: 10,
})

// ========== 状态常量（与后端约定字段值） ==========
const USER_SEX_MALE = '0'
const USER_SEX_FEMALE = '1'
const USER_STATUS_NORMAL = '0'
const USER_STATUS_DISABLED = '1'

/** 性别文本 */
const getSexLabel = (val: string) =>
  val === USER_SEX_MALE ? '男' : val === USER_SEX_FEMALE ? '女' : '未知'

/** 用户状态 tag 类型 */
const getUserStatusTagType = (val: string) =>
  val === USER_STATUS_NORMAL ? 'success' : 'danger'

/** 用户状态文本 */
const getUserStatusLabel = (val: string) =>
  val === USER_STATUS_NORMAL ? '正常' : '停用'

async function fetchUserList() {
  loading.value = true
  try {
    const res = await getUserPage(queryParams)
    const pageData = res?.data as { rows: UserInfo[]; total: number } | undefined
    userList.value = pageData?.rows ?? []
    total.value = pageData?.total ?? 0
  } finally {
    loading.value = false
  }
}

async function fetchDeptTree() {
  try {
    const res = await getDeptTreeSelect()
    deptTree.value = (res?.data as DeptInfo[]) || []
  } catch (error) {
    console.error('加载部门树失败', error)
  }
}

function handleQuery() {
  queryParams.pageNum = 1
  fetchUserList()
}

function resetQuery() {
  queryParams.keyword = ''
  queryParams.status = ''
  queryParams.deptId = undefined
  queryParams.pageNum = 1
  handleQuery()
}

function refreshTable() {
  fetchUserList()
}

function handleAdd() {
  currentUser.value = null
  formVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  currentUser.value = { ...row } as UserInfo
  formVisible.value = true
}

async function handleDelete(row: Record<string, unknown>) {
  try {
    await ElMessageBox.confirm(`是否确认删除用户"${row.username}"？`, '提示', {
      type: 'warning',
    })
    await deleteUser(row.userId as number)
    ElMessage.success('删除成功')
    fetchUserList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

function handleResetPassword(row: Record<string, unknown>) {
  ElMessage.info(`重置密码功能开发中，用户ID: ${row.userId}`)
}

function handleAssignRole(row: Record<string, unknown>) {
  currentUserId.value = row.userId as number
  assignRoleVisible.value = true
}

async function handleExport() {
  try {
    await exportUser(queryParams)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败', error)
  }
}

function handleSelectionChange(selection: UserInfo[]) {
  selectedRows.value = selection
}

onMounted(() => {
  fetchUserList()
  fetchDeptTree()
})
</script>

<style scoped lang="scss">
.user-list {
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

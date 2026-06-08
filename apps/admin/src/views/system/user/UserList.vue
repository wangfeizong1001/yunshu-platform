<template>
  <div class="user-list">
    <!-- 搜索表单 -->
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
            :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
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

    <!-- 表格工具栏 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="table-header">
          <div class="left">
            <el-button
              v-has-permi="['system:user:add']"
              type="primary"
              :icon="Plus"
              @click="handleAdd"
            >
              新增
            </el-button>
            <el-button
              v-has-permi="['system:user:export']"
              type="success"
              :icon="Download"
              @click="handleExport"
            >
              导出
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
        :data="userList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="userId" label="用户编号" width="100" />
        <el-table-column prop="username" label="用户名称" width="120" />
        <el-table-column prop="nickname" label="用户昵称" width="120" />
        <el-table-column prop="deptName" label="部门" width="150" />
        <el-table-column prop="phone" label="手机号码" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="sex" label="性别" width="80">
          <template #default="{ row }">
            {{ row.sex === '0' ? '男' : row.sex === '1' ? '女' : '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="loginDate" label="最后登录" width="180" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['system:user:edit']"
              link
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-has-permi="['system:user:delete']"
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
            <el-dropdown trigger="click">
              <el-button link type="primary" :icon="More">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-has-permi="['system:user:resetPwd']"
                    @click="handleResetPassword(row)"
                  >
                    重置密码
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-has-permi="['system:user:assignRole']"
                    @click="handleAssignRole(row)"
                  >
                    分配角色
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

    <!-- 用户表单弹窗 -->
    <UserForm v-model="formVisible" :user-data="currentUser" @refresh="handleQuery" />

    <!-- 分配角色弹窗 -->
    <AssignRoleDialog
      v-model="assignRoleVisible"
      :user-id="currentUserId"
      @refresh="handleQuery"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Download, More } from '@element-plus/icons-vue'
import { getUserPage, deleteUser, exportUser } from '@/api/system/user.api'
import { getDeptTreeSelect } from '@/api/system/dept.api'
import type { SysUser, SysDept } from '@yunshu/shared/types/system'
import UserForm from './UserForm.vue'
import AssignRoleDialog from './AssignRoleDialog.vue'

// 状态
const loading = ref(false)
const userList = ref<SysUser[]>([])
const total = ref(0)
const deptTree = ref<SysDept[]>([])
const selectedRows = ref<SysUser[]>([])
const formVisible = ref(false)
const assignRoleVisible = ref(false)
const currentUser = ref<SysUser | null>(null)
const currentUserId = ref<number>()

// 查询参数
const queryParams = reactive({
  keyword: '',
  status: '',
  deptId: undefined as number | undefined,
  pageNum: 1,
  pageSize: 10,
})

// 加载用户列表
async function fetchUserList() {
  loading.value = true
  try {
    const res = await getUserPage(queryParams)
    userList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 加载部门树
async function fetchDeptTree() {
  try {
    deptTree.value = await getDeptTreeSelect()
  } catch (error) {
    console.error('加载部门树失败', error)
  }
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchUserList()
}

// 重置查询
function resetQuery() {
  queryParams.keyword = ''
  queryParams.status = ''
  queryParams.deptId = undefined
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchUserList()
}

// 新增
function handleAdd() {
  currentUser.value = null
  formVisible.value = true
}

// 编辑
function handleEdit(row: SysUser) {
  currentUser.value = { ...row }
  formVisible.value = true
}

// 删除
async function handleDelete(row: SysUser) {
  try {
    await ElMessageBox.confirm(`是否确认删除用户"${row.username}"？`, '提示', {
      type: 'warning',
    })
    await deleteUser(row.userId)
    ElMessage.success('删除成功')
    fetchUserList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 重置密码
function handleResetPassword(row: SysUser) {
  ElMessage.info(`重置密码功能开发中，用户ID: ${row.userId}`)
}

// 分配角色
function handleAssignRole(row: SysUser) {
  currentUserId.value = row.userId
  assignRoleVisible.value = true
}

// 导出
async function handleExport() {
  try {
    await exportUser(queryParams)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败', error)
  }
}

// 批量选择
function handleSelectionChange(selection: SysUser[]) {
  selectedRows.value = selection
}

// 初始化
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

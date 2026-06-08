<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="用户名">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="queryParams.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        border
        stripe
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="用户ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" width="150" align="center" />
        <el-table-column prop="nickname" label="昵称" width="150" align="center" />
        <el-table-column prop="email" label="邮箱" width="200" align="center" />
        <el-table-column prop="phone" label="手机号" width="150" align="center" />
        <el-table-column prop="gender" label="性别" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.gender === 1 ? 'primary' : 'info'">
              {{ row.gender === 1 ? '男' : '女' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </el-card>

    <UserForm
      v-model:visible="formVisible"
      :user-id="currentUserId"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import type { User } from './types'
import * as api from './api'
import UserForm from './form.vue'

const loading = ref(false)
const tableData = ref<User[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])
const formVisible = ref(false)
const currentUserId = ref<number | null>(null)

const queryParams = reactive({
  page: 1,
  limit: 10,
  username: '',
  nickname: '',
  status: undefined as number | undefined
})

const handleQuery = async () => {
  loading.value = true
  try {
    const res = await api.getUserList(queryParams)
    if (res.success) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch {
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  queryParams.page = 1
  queryParams.username = ''
  queryParams.nickname = ''
  queryParams.status = undefined
  handleQuery()
}

const handleSelectionChange = (selection: User[]) => {
  selectedIds.value = selection.map(item => item.id!)
}

const handleAdd = () => {
  currentUserId.value = null
  formVisible.value = true
}

const handleEdit = (row: User) => {
  currentUserId.value = row.id!
  formVisible.value = true
}

const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await api.deleteUser(row.id!)
    ElMessage.success('删除成功')
    handleQuery()
  } catch {
    // 用户取消
  }
}

const handleSuccess = () => {
  handleQuery()
}

onMounted(() => {
  handleQuery()
})
</script>

<style lang="scss" scoped>
.page-container {
  .search-card {
    margin-bottom: 16px;
  }

  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pagination-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  }
}
</style>

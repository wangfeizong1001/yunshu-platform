<template>
  <div class="post-list">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入岗位编码/名称"
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

    <!-- 表格工具栏 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="table-header">
          <div class="left">
            <el-button
              v-has-permi="['system:post:add']"
              type="primary"
              :icon="Plus"
              @click="handleAdd"
            >
              新增
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
        :data="postList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="postId" label="岗位编号" width="100" />
        <el-table-column prop="postCode" label="岗位编码" width="150" />
        <el-table-column prop="postName" label="岗位名称" width="150" />
        <el-table-column prop="postSort" label="显示顺序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['system:post:edit']"
              link
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-has-permi="['system:post:delete']"
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

    <!-- 岗位表单弹窗 -->
    <PostForm v-model="formVisible" :post-data="currentPost" @refresh="handleQuery" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getPostPage, deletePost } from '@/api/system/post.api'
import type { SysPost, SysPostQuery } from '@yunshu/shared/types/system'
import PostForm from './PostForm.vue'

// 状态
const loading = ref(false)
const postList = ref<SysPost[]>([])
const total = ref(0)
const selectedRows = ref<SysPost[]>([])
const formVisible = ref(false)
const currentPost = ref<SysPost | null>(null)

// 查询参数
const queryParams = reactive<SysPostQuery>({
  keyword: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
})

// 加载岗位列表
async function fetchPostList() {
  loading.value = true
  try {
    const res = await getPostPage(queryParams)
    postList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchPostList()
}

// 重置查询
function resetQuery() {
  queryParams.keyword = ''
  queryParams.status = ''
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchPostList()
}

// 新增
function handleAdd() {
  currentPost.value = null
  formVisible.value = true
}

// 编辑
function handleEdit(row: SysPost) {
  currentPost.value = { ...row }
  formVisible.value = true
}

// 删除
async function handleDelete(row: SysPost) {
  try {
    await ElMessageBox.confirm(`是否确认删除岗位"${row.postName}"？`, '提示', {
      type: 'warning',
    })
    await deletePost(row.postId)
    ElMessage.success('删除成功')
    fetchPostList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 批量选择
function handleSelectionChange(selection: SysPost[]) {
  selectedRows.value = selection
}

// 初始化
onMounted(() => {
  fetchPostList()
})
</script>

<style scoped lang="scss">
.post-list {
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

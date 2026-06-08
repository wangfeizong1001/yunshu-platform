<template>
  <div class="notice-list">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入公告标题"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="公告类型" prop="noticeType">
          <el-select v-model="queryParams.noticeType" placeholder="请选择公告类型" clearable>
            <el-option label="通知" value="1" />
            <el-option label="公告" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="发布" value="0" />
            <el-option label="撤回" value="1" />
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
              v-has-permi="['system:notice:add']"
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
        :data="noticeList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="noticeId" label="公告编号" width="100" />
        <el-table-column prop="noticeTitle" label="公告标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="noticeType" label="公告类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.noticeType === '1' ? 'primary' : 'info'">
              {{ row.noticeType === '1' ? '通知' : '公告' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'warning'">
              {{ row.status === '0' ? '发布' : '撤回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['system:notice:edit']"
              link
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-has-permi="['system:notice:query']"
              link
              type="success"
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              v-if="row.status === '1'"
              v-has-permi="['system:notice:publish']"
              link
              type="warning"
              @click="handlePublish(row)"
            >
              发布
            </el-button>
            <el-button
              v-if="row.status === '0'"
              v-has-permi="['system:notice:withdraw']"
              link
              type="warning"
              @click="handleWithdraw(row)"
            >
              撤回
            </el-button>
            <el-button
              v-has-permi="['system:notice:remove']"
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

    <!-- 公告表单弹窗 -->
    <NoticeForm v-model="formVisible" :notice-data="currentNotice" @refresh="handleQuery" />

    <!-- 公告详情弹窗 -->
    <NoticeDetail v-model="detailVisible" :notice-id="currentNoticeId" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import {
  getNoticePage,
  deleteNotice,
  publishNotice,
  withdrawNotice,
} from '@/api/system/notice.api'
import type { SysNotice, SysNoticeQuery } from '@yunshu/shared'
import NoticeForm from './NoticeForm.vue'
import NoticeDetail from './NoticeDetail.vue'

// 状态
const loading = ref(false)
const noticeList = ref<SysNotice[]>([])
const total = ref(0)
const selectedRows = ref<SysNotice[]>([])
const formVisible = ref(false)
const detailVisible = ref(false)
const currentNotice = ref<SysNotice | null>(null)
const currentNoticeId = ref<number>()

// 查询参数
const queryParams = reactive<SysNoticeQuery>({
  keyword: '',
  noticeType: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
})

// 加载公告列表
async function fetchNoticeList() {
  loading.value = true
  try {
    const res = await getNoticePage(queryParams)
    noticeList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchNoticeList()
}

// 重置查询
function resetQuery() {
  queryParams.keyword = ''
  queryParams.noticeType = ''
  queryParams.status = ''
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchNoticeList()
}

// 新增
function handleAdd() {
  currentNotice.value = null
  formVisible.value = true
}

// 编辑
function handleEdit(row: SysNotice) {
  currentNotice.value = { ...row }
  formVisible.value = true
}

// 查看
function handleView(row: SysNotice) {
  currentNoticeId.value = row.noticeId
  detailVisible.value = true
}

// 发布
async function handlePublish(row: SysNotice) {
  try {
    await ElMessageBox.confirm(`是否确认发布公告"${row.noticeTitle}"？`, '提示', {
      type: 'warning',
    })
    await publishNotice(row.noticeId)
    ElMessage.success('发布成功')
    fetchNoticeList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('发布失败', error)
    }
  }
}

// 撤回
async function handleWithdraw(row: SysNotice) {
  try {
    await ElMessageBox.confirm(`是否确认撤回公告"${row.noticeTitle}"？`, '提示', {
      type: 'warning',
    })
    await withdrawNotice(row.noticeId)
    ElMessage.success('撤回成功')
    fetchNoticeList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('撤回失败', error)
    }
  }
}

// 删除
async function handleDelete(row: SysNotice) {
  try {
    await ElMessageBox.confirm(`是否确认删除公告"${row.noticeTitle}"？`, '提示', {
      type: 'warning',
    })
    await deleteNotice(row.noticeId)
    ElMessage.success('删除成功')
    fetchNoticeList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 批量选择
function handleSelectionChange(selection: SysNotice[]) {
  selectedRows.value = selection
}

// 初始化
onMounted(() => {
  fetchNoticeList()
})
</script>

<style scoped lang="scss">
.notice-list {
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

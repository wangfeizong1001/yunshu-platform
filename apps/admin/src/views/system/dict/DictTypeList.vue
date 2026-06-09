<template>
  <div class="dict-type-list">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入字典名称/类型"
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
              v-has-permi="['system:dict:add']"
              type="primary"
              :icon="Plus"
              @click="handleAdd"
            >
              新增
            </el-button>
            <el-button
              v-has-permi="['system:dict:export']"
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
        :data="dictTypeList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="dictId" label="字典编号" width="100" />
        <el-table-column prop="dictName" label="字典名称" width="150" />
        <el-table-column prop="dictType" label="字典类型" width="200">
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewData(row as SysDictType)">{{ row.dictType }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['system:dict:edit']"
              link
              type="primary"
              @click="handleEdit(row as SysDictType)"
            >
              编辑
            </el-button>
            <el-button
              v-has-permi="['system:dict:remove']"
              link
              type="danger"
              @click="handleDelete(row as SysDictType)"
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

    <!-- 字典类型表单弹窗 -->
    <DictTypeForm v-model="formVisible" :dict-type-data="currentDictType" @refresh="handleQuery" />

    <!-- 字典数据列表弹窗 -->
    <DictDataList v-model="dataVisible" :dict-type="currentDictType?.dictType" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Download } from '@element-plus/icons-vue'
import { getDictTypePage, deleteDictType, exportDictType } from '@/api/system/dict.api'
import type { SysDictType, SysDictTypeQuery } from '@yunshu/shared'
import DictTypeForm from './DictTypeForm.vue'
import DictDataList from './DictDataList.vue'

// 状态
const loading = ref(false)
const dictTypeList = ref<SysDictType[]>([])
const total = ref(0)
const selectedRows = ref<SysDictType[]>([])
const formVisible = ref(false)
const dataVisible = ref(false)
const currentDictType = ref<SysDictType | null>(null)

// 查询参数
const queryParams = reactive<SysDictTypeQuery>({
  keyword: '',
  status: undefined,
  pageNum: 1,
  pageSize: 10,
})

// 加载字典类型列表
async function fetchDictTypeList() {
  loading.value = true
  try {
    const res = await getDictTypePage(queryParams) as { rows: SysDictType[]; total: number }
    dictTypeList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchDictTypeList()
}

// 重置查询
function resetQuery() {
  queryParams.keyword = ''
  queryParams.status = undefined
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchDictTypeList()
}

// 新增
function handleAdd() {
  currentDictType.value = null
  formVisible.value = true
}

// 编辑
function handleEdit(row: SysDictType) {
  currentDictType.value = { ...row }
  formVisible.value = true
}

// 查看字典数据
function handleViewData(row: SysDictType) {
  currentDictType.value = row
  dataVisible.value = true
}

// 删除
async function handleDelete(row: SysDictType) {
  try {
    await ElMessageBox.confirm(`是否确认删除字典"${row.dictName}"？`, '提示', {
      type: 'warning',
    })
    await deleteDictType(row.dictId)
    ElMessage.success('删除成功')
    fetchDictTypeList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 导出
async function handleExport() {
  try {
    await exportDictType(queryParams)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败', error)
  }
}

// 批量选择
function handleSelectionChange(selection: SysDictType[]) {
  selectedRows.value = selection
}

// 初始化
onMounted(() => {
  fetchDictTypeList()
})
</script>

<style scoped lang="scss">
.dict-type-list {
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

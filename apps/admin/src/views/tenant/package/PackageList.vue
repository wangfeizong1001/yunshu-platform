<template>
  <div class="package-list">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入套餐名称"
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
        <el-form-item label="套餐类型" prop="packageType">
          <el-select v-model="queryParams.packageType" placeholder="请选择类型" clearable>
            <el-option label="免费版" value="0" />
            <el-option label="基础版" value="1" />
            <el-option label="高级版" value="2" />
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
              v-has-permi="['tenant:package:add']"
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
      <el-table v-loading="loading" :data="packageList" stripe border>
        <el-table-column prop="packageId" label="套餐ID" width="80" />
        <el-table-column prop="packageName" label="套餐名称" width="120" />
        <el-table-column prop="packageType" label="套餐类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getPackageTypeColor(row.packageType)">
              {{ getPackageTypeLabel(row.packageType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userLimit" label="用户限制" width="100" />
        <el-table-column prop="storageLimit" label="存储限制(MB)" width="120" />
        <el-table-column prop="flowLimit" label="月流量(GB)" width="110" />
        <el-table-column prop="price" label="价格(元)" width="100">
          <template #default="{ row }">
            {{ row.price === 0 ? '免费' : `¥${row.price}` }}
          </template>
        </el-table-column>
        <el-table-column prop="expireType" label="过期类型" width="100">
          <template #default="{ row }">
            {{ getExpireTypeLabel(row.expireType) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getPackageStatusTagType(row.status)">
              {{ getPackageStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['tenant:package:edit']"
              link
              type="primary"
              @click="handleEdit(row as TenantPackage)"
            >
              编辑
            </el-button>
            <el-button
              v-has-permi="['tenant:package:delete']"
              link
              type="danger"
              @click="handleDelete(row as TenantPackage)"
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

    <!-- 套餐表单弹窗 -->
    <PackageForm v-model="formVisible" :package-data="currentPackage" @refresh="handleQuery" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getPackagePage, deletePackage } from '@/api/tenant/tenant.api'
import type { TenantPackage, TenantPackageQuery } from '@yunshu/shared'
import { PackageTypeEnum, ExpireTypeEnum } from '@yunshu/shared'
import PackageForm from './PackageForm.vue'

// ========== 状态常量（与后端约定字段值） ==========
const PACKAGE_STATUS_NORMAL = '0'
const PACKAGE_STATUS_DISABLED = '1'

/** 套餐状态 tag 类型 */
const getPackageStatusTagType = (val: string) =>
  val === PACKAGE_STATUS_NORMAL ? 'success' : 'danger'

/** 套餐状态文本 */
const getPackageStatusLabel = (val: string) =>
  val === PACKAGE_STATUS_NORMAL ? '正常' : '停用'

// 状态
const loading = ref(false)
const packageList = ref<TenantPackage[]>([])
const total = ref(0)
const formVisible = ref(false)
const currentPackage = ref<TenantPackage | null>(null)

// 查询参数
const queryParams = reactive<TenantPackageQuery>({
  keyword: '',
  status: undefined as unknown as number | undefined,
  packageType: undefined as unknown as string | undefined,
  pageNum: 1,
  pageSize: 10,
})

// 获取套餐类型标签
function getPackageTypeLabel(type: string) {
  return PackageTypeEnum[type as keyof typeof PackageTypeEnum]?.label || type
}

// 获取套餐类型颜色
function getPackageTypeColor(type: string) {
  return PackageTypeEnum[type as keyof typeof PackageTypeEnum]?.color || 'info'
}

// 获取过期类型标签
function getExpireTypeLabel(type: string) {
  return ExpireTypeEnum[type as keyof typeof ExpireTypeEnum]?.label || type
}

// 加载套餐列表
async function fetchPackageList() {
  loading.value = true
  try {
    const res = await getPackagePage(queryParams)
    packageList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchPackageList()
}

// 重置查询
function resetQuery() {
  queryParams.keyword = ''
  queryParams.status = undefined as unknown as number | undefined
  queryParams.packageType = undefined as unknown as string | undefined
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchPackageList()
}

// 新增
function handleAdd() {
  currentPackage.value = null
  formVisible.value = true
}

// 编辑
function handleEdit(row: TenantPackage) {
  currentPackage.value = { ...row }
  formVisible.value = true
}

// 删除
async function handleDelete(row: TenantPackage) {
  try {
    await ElMessageBox.confirm(`是否确认删除套餐"${row.packageName}"？`, '提示', {
      type: 'warning',
    })
    await deletePackage(row.packageId)
    ElMessage.success('删除成功')
    fetchPackageList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 初始化
onMounted(() => {
  fetchPackageList()
})
</script>

<style scoped lang="scss">
.package-list {
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

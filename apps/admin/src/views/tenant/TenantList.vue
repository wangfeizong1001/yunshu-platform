<template>
  <div class="tenant-list">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入租户名称/编码/联系人"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
            <el-option label="到期" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐" prop="packageId">
          <el-select v-model="queryParams.packageId" placeholder="请选择套餐" clearable>
            <el-option
              v-for="pkg in packageList"
              :key="pkg.packageId"
              :label="pkg.packageName"
              :value="pkg.packageId"
            />
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
              v-has-permi="['tenant:tenant:add']"
              type="primary"
              :icon="Plus"
              @click="handleAdd"
            >
              新增
            </el-button>
            <el-button
              v-has-permi="['tenant:tenant:export']"
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
      <el-table v-loading="loading" :data="tenantList" stripe border>
        <el-table-column prop="tenantId" label="租户ID" width="80" />
        <el-table-column prop="tenantName" label="租户名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="tenantCode" label="租户编码" width="120" />
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="packageName" label="套餐" width="100">
          <template #default="{ row }">
            <el-tag type="info">{{ row.packageName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userLimit" label="用户数/上限" width="100">
          <template #default="{ row }">
            {{ row.userCount }}/{{ row.userLimit }}
          </template>
        </el-table-column>
        <el-table-column prop="expireTime" label="到期时间" width="170" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="domain" label="域名" min-width="150" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
            <el-button
              v-has-permi="['tenant:tenant:edit']"
              link
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-has-permi="['tenant:tenant:package']"
              link
              type="success"
              @click="handlePackage(row)"
            >
              套餐
            </el-button>
            <el-dropdown trigger="click">
              <el-button link type="primary" :icon="More">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-has-permi="['tenant:tenant:status']"
                    @click="handleChangeStatus(row)"
                  >
                    {{ getTenantStatusToggleLabel(row.status) }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-has-permi="['tenant:tenant:delete']"
                    @click="handleDelete(row)"
                  >
                    删除
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

    <!-- 租户表单弹窗 -->
    <TenantForm v-model="formVisible" :tenant-data="currentTenant" @refresh="handleQuery" />

    <!-- 租户详情弹窗 -->
    <TenantDetail v-model="detailVisible" :tenant-id="currentTenantId" />

    <!-- 租户套餐配置弹窗 -->
    <TenantPackage v-model="packageVisible" :tenant-id="currentTenantId" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Download, More } from '@element-plus/icons-vue'
import {
  getTenantPage,
  deleteTenant,
  changeTenantStatus,
} from '@/api/tenant/tenant.api'
import type { Tenant, TenantQuery } from '@yunshu/shared'
import TenantForm from './TenantForm.vue'
import TenantDetail from './TenantDetail.vue'
import TenantPackage from './TenantPackage.vue'

// ========== 状态常量（与后端约定字段值） ==========
const TENANT_STATUS_NORMAL = '0'
const TENANT_STATUS_DISABLED = '1'

/** 租户状态 tag 类型 */
const getTenantStatusTagType = (val: string) =>
  val === TENANT_STATUS_NORMAL ? 'success' : 'danger'

/** 租户状态文本 */
const getTenantStatusLabel = (val: string) =>
  val === TENANT_STATUS_NORMAL ? '正常' : '停用'

/** 租户状态切换操作文本 */
const getTenantStatusToggleLabel = (val: string) =>
  val === TENANT_STATUS_NORMAL ? '停用' : '启用'

// 状态
const loading = ref(false)
const tenantList = ref<Tenant[]>([])
const total = ref(0)
const packageList = ref<{ packageId: number; packageName: string }[]>([])
const formVisible = ref(false)
const detailVisible = ref(false)
const packageVisible = ref(false)
const currentTenant = ref<Tenant | null>(null)
const currentTenantId = ref<number>()

// 查询参数
const queryParams = reactive<TenantQuery>({
  keyword: '',
  status: undefined,
  packageId: undefined,
  pageNum: 1,
  pageSize: 10,
})

// 获取状态标签
function getStatusLabel(status: string) {
  return TenantStatusEnum[status as keyof typeof TenantStatusEnum]?.label || status
}

// 获取状态类型
function getStatusType(status: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    '0': 'success',
    '1': 'danger',
    '2': 'warning',
  }
  return typeMap[status] || 'info'
}

// 加载租户列表
async function fetchTenantList() {
  loading.value = true
  try {
    const res = await getTenantPage(queryParams)
    tenantList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchTenantList()
}

// 重置查询
function resetQuery() {
  queryParams.keyword = ''
  queryParams.status = undefined
  queryParams.packageId = undefined
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchTenantList()
}

// 新增
function handleAdd() {
  currentTenant.value = null
  formVisible.value = true
}

// 编辑
function handleEdit(row: Record<string, unknown>) {
  currentTenant.value = { ...row }
  formVisible.value = true
}

// 详情
function handleDetail(row: Record<string, unknown>) {
  currentTenantId.value = row.tenantId
  detailVisible.value = true
}

// 套餐配置
function handlePackage(row: Record<string, unknown>) {
  currentTenantId.value = row.tenantId
  packageVisible.value = true
}

// 修改状态
async function handleChangeStatus(row: Record<string, unknown>) {
  const newStatus = row.status === TENANT_STATUS_NORMAL ? TENANT_STATUS_DISABLED : TENANT_STATUS_NORMAL
  const actionLabel = getTenantStatusToggleLabel(row.status)
  try {
    await ElMessageBox.confirm(`是否确认${actionLabel}租户"${row.tenantName}"？`, '提示', {
      type: 'warning',
    })
    await changeTenantStatus(row.tenantId, newStatus as '0' | '1' | '2')
    ElMessage.success(`${actionLabel}成功`)
    fetchTenantList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(`[TenantList] handleChangeStatus failed:`, error)
      ElMessage.error(`${actionLabel}失败，请重试`)
    }
  }
}

// 删除
async function handleDelete(row: Record<string, unknown>) {
  try {
    await ElMessageBox.confirm(`是否确认删除租户"${row.tenantName}"？`, '提示', {
      type: 'warning',
    })
    await deleteTenant(row.tenantId)
    ElMessage.success('删除成功')
    fetchTenantList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 导出
async function handleExport() {
  ElMessage.info('导出功能开发中')
}

// 初始化
onMounted(() => {
  fetchTenantList()
})
</script>

<style scoped lang="scss">
.tenant-list {
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

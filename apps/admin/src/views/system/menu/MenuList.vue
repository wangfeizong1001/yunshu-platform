<template>
  <div class="menu-list">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入菜单名称"
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
              v-has-permi="['system:menu:add']"
              type="primary"
              :icon="Plus"
              @click="() => handleAdd()"
            >
              新增
            </el-button>
          </div>
          <div class="right">
            <el-button :icon="Expand" circle @click="expandAll" />
            <el-button :icon="Fold" circle @click="collapseAll" />
            <el-button :icon="Refresh" circle @click="refreshTable" />
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="menuId"
        :default-expand-all="isExpandAll"
        stripe
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="menuName" label="菜单名称" width="250">
          <template #default="{ row }">
            <span v-if="row.icon">
              <el-icon><component :is="row.icon" /></el-icon>
            </span>
            {{ row.menuName }}
          </template>
        </el-table-column>
        <el-table-column prop="menuType" label="菜单类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.menuType === 'M'" type="warning">目录</el-tag>
            <el-tag v-else-if="row.menuType === 'C'" type="success">菜单</el-tag>
            <el-tag v-else type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="perms" label="权限标识" width="200" show-overflow-tooltip />
        <el-table-column prop="path" label="路由路径" width="180" show-overflow-tooltip />
        <el-table-column prop="component" label="组件路径" width="200" show-overflow-tooltip />
        <el-table-column prop="orderNum" label="显示顺序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['system:menu:add']"
              link
              type="primary"
              @click="handleAdd(row as SysMenu)"
            >
              新增
            </el-button>
            <el-button
              v-has-permi="['system:menu:edit']"
              link
              type="primary"
              @click="handleEdit(row as SysMenu)"
            >
              编辑
            </el-button>
            <el-button
              v-has-permi="['system:menu:delete']"
              link
              type="danger"
              @click="handleDelete(row as SysMenu)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 菜单表单弹窗 -->
    <MenuForm v-model="formVisible" :menu-data="currentMenu" :parent-menu="parentMenu" @refresh="fetchMenuTree" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Expand, Fold } from '@element-plus/icons-vue'
import { getMenuTree, deleteMenu } from '@/api/system/menu.api'
import type { MenuInfo } from '@/api/system/menu.api'
import type { SysMenu, SysMenuQuery } from '@yunshu/shared'
import MenuForm from './MenuForm.vue'

// 状态
const loading = ref(false)
const menuList = ref<SysMenu[]>([])
const isExpandAll = ref(true)
const formVisible = ref(false)
const currentMenu = ref<SysMenu | null>(null)
const parentMenu = ref<SysMenu | null>(null)

// 查询参数
const queryParams = reactive<SysMenuQuery>({
  keyword: '',
  status: undefined,
})

// 加载菜单树
async function fetchMenuTree() {
  loading.value = true
  try {
    const res = await getMenuTree(queryParams)
    menuList.value = (res.data as MenuInfo[]) as unknown as SysMenu[]
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  fetchMenuTree()
}

// 重置查询
function resetQuery() {
  queryParams.keyword = ''
  queryParams.status = undefined
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchMenuTree()
}

// 展开全部
function expandAll() {
  isExpandAll.value = true
}

// 折叠全部
function collapseAll() {
  isExpandAll.value = false
}

// 新增
function handleAdd(row?: SysMenu) {
  if (row) {
    parentMenu.value = row
  } else {
    parentMenu.value = null
  }
  currentMenu.value = null
  formVisible.value = true
}

// 编辑
function handleEdit(row: SysMenu) {
  currentMenu.value = { ...row }
  parentMenu.value = null
  formVisible.value = true
}

// 删除
async function handleDelete(row: SysMenu) {
  if (row.children?.length) {
    ElMessage.warning('该菜单存在下级菜单，无法删除')
    return
  }
  try {
    await ElMessageBox.confirm(`是否确认删除菜单"${row.menuName}"？`, '提示', {
      type: 'warning',
    })
    await deleteMenu(row.menuId)
    ElMessage.success('删除成功')
    fetchMenuTree()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 初始化
onMounted(() => {
  fetchMenuTree()
})
</script>

<style scoped lang="scss">
.menu-list {
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

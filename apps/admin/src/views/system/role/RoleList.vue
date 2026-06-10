<template>
  <div class="role-list">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入角色名称/权限字符"
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
              v-has-permi="['system:role:add']"
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
        :data="roleList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="roleId" label="角色编号" width="100" />
        <el-table-column prop="roleName" label="角色名称" width="150" />
        <el-table-column prop="roleKey" label="权限字符" width="150" />
        <el-table-column prop="roleSort" label="显示顺序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['system:role:edit']"
              link
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-has-permi="['system:role:permission']"
              link
              type="primary"
              @click="handlePermission(row)"
            >
              权限分配
            </el-button>
            <el-button
              v-has-permi="['system:role:delete']"
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

    <!-- 角色表单弹窗 -->
    <RoleForm v-model="formVisible" :role-data="currentRole" @refresh="handleQuery" />

    <!-- 权限分配弹窗 -->
    <RolePermission v-model="permissionVisible" :role-id="currentRoleId" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { Search, Refresh, Plus } from '@element-plus/icons-vue';
  import { getRolePage, deleteRole } from '@/api/system/role.api';
  import type { SysRole } from '@yunshu/shared';
  import RoleForm from './RoleForm.vue';
  import RolePermission from './RolePermission.vue';

  // 状态
  const loading = ref(false);
  const roleList = ref<SysRole[]>([]);
  const total = ref(0);
  const selectedRows = ref<SysRole[]>([]);
  const formVisible = ref(false);
  const permissionVisible = ref(false);
  const currentRole = ref<SysRole | null>(null);
  const currentRoleId = ref<number>();

  // 查询参数
  const queryParams = reactive<any>({
    keyword: '',
    status: undefined,
    pageNum: 1,
    pageSize: 10,
  });

  // 加载角色列表
  async function fetchRoleList() {
    loading.value = true;
    try {
      const res = (await getRolePage(queryParams)) as any;
      roleList.value = res.rows;
      total.value = res.total;
    } finally {
      loading.value = false;
    }
  }

  // 查询
  function handleQuery() {
    queryParams.pageNum = 1;
    fetchRoleList();
  }

  // 重置查询
  function resetQuery() {
    queryParams.keyword = '';
    queryParams.status = undefined;
    queryParams.pageNum = 1;
    handleQuery();
  }

  // 刷新表格
  function refreshTable() {
    fetchRoleList();
  }

  // 新增
  function handleAdd() {
    currentRole.value = null;
    formVisible.value = true;
  }

  // 编辑
  function handleEdit(row: any) {
    currentRole.value = { ...row };
    formVisible.value = true;
  }

  // 权限分配
  function handlePermission(row: any) {
    currentRoleId.value = row.roleId;
    permissionVisible.value = true;
  }

  // 删除
  async function handleDelete(row: any) {
    try {
      await ElMessageBox.confirm(`是否确认删除角色"${row.roleName}"？`, '提示', {
        type: 'warning',
      });
      await deleteRole(row.roleId);
      ElMessage.success('删除成功');
      fetchRoleList();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败', error);
      }
    }
  }

  // 批量选择
  function handleSelectionChange(selection: SysRole[]) {
    selectedRows.value = selection;
  }

  // 初始化
  onMounted(() => {
    fetchRoleList();
  });
</script>

<style scoped lang="scss">
  .role-list {
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

<template>
  <div class="page-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="表名称">
          <el-input
            v-model="queryParams.tableName"
            placeholder="请输入表名称"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="表描述">
          <el-input
            v-model="queryParams.tableComment"
            placeholder="请输入表描述"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 工具栏 -->
    <el-card class="toolbar-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" :icon="Download" @click="handleImport">导入表</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-button :icon="Refresh" circle @click="handleRefresh" />
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="表名称" prop="tableName" width="180" align="center">
          <template #default="{ row }">
            <el-link type="primary" @click="handlePreview(row)">{{ row.tableName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="表描述" prop="tableComment" min-width="150" show-overflow-tooltip />
        <el-table-column label="表空间" prop="tableSchema" width="120" align="center" />
        <el-table-column label="引擎" prop="engine" width="100" align="center" />
        <el-table-column label="创建时间" prop="createTime" width="180" align="center">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleConfig(row)">编辑</el-button>
            <el-button link type="primary" @click="handlePreview(row)">预览</el-button>
            <el-button link type="success" @click="handleGenerate(row)">生成</el-button>
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

    <!-- 导入表弹窗 -->
    <GenImport v-model="importVisible" @success="handleQuery" />

    <!-- 代码预览弹窗 -->
    <GenPreview v-model="previewVisible" :table-name="currentTableName" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { Search, Refresh, Delete, Download } from '@element-plus/icons-vue';
  import type { IGenTable, IGenQuery } from '@yunshu/shared';
  import { getGenTablePage } from '@/api/tool/gen.api';
  import GenImport from './GenImport.vue';
  import GenPreview from './GenPreview.vue';

  const router = useRouter();

  const loading = ref(false);
  const tableData = ref<IGenTable[]>([]);
  const total = ref(0);
  const selectedIds = ref<string[]>([]);
  const importVisible = ref(false);
  const previewVisible = ref(false);
  const currentTableName = ref('');

  const queryParams = reactive<IGenQuery>({
    page: 1,
    limit: 10,
    sort: 'createTime',
    order: 'desc',
  });

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('zh-CN');
  };

  const handleQuery = async () => {
    loading.value = true;
    try {
      const res = (await getGenTablePage(queryParams)) as any;
      if (res.success) {
        tableData.value = res.data;
        total.value = res.pagination?.total || 0;
      }
    } catch {
      ElMessage.error('获取表列表失败');
    } finally {
      loading.value = false;
    }
  };

  const handleReset = () => {
    queryParams.page = 1;
    queryParams.limit = 10;
    queryParams.tableName = undefined;
    queryParams.tableComment = undefined;
    handleQuery();
  };

  const handleRefresh = () => {
    handleQuery();
  };

  const handleSelectionChange = (selection: IGenTable[]) => {
    selectedIds.value = selection.map((item) => item.tableName);
  };

  const handleImport = () => {
    importVisible.value = true;
  };

  const handleConfig = (row: any) => {
    router.push({
      path: '/tool/gen/config',
      query: { tableName: row.tableName },
    });
  };

  const handlePreview = (row: any) => {
    currentTableName.value = row.tableName;
    previewVisible.value = true;
  };

  const handleGenerate = async (row: any) => {
    try {
      await ElMessageBox.confirm(`确认生成表"${row.tableName}"的代码吗？`, '提示', {
        type: 'warning',
      });
      router.push({
        path: '/tool/gen/config',
        query: { tableName: row.tableName, generate: 'true' },
      });
    } catch {
      // 用户取消
    }
  };

  const handleDelete = async (_row: any) => {
    try {
      await ElMessageBox.confirm('确认删除该表的生成配置吗？', '提示', { type: 'warning' });
      ElMessage.success('删除成功');
      handleQuery();
    } catch {
      // 用户取消
    }
  };

  const handleBatchDelete = async () => {
    try {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 个表配置吗？`,
        '提示',
        { type: 'warning' },
      );
      // TODO: 调用批量删除接口
      ElMessage.success('删除成功');
      handleQuery();
    } catch {
      // 用户取消
    }
  };

  onMounted(() => {
    handleQuery();
  });
</script>

<style lang="scss" scoped>
  .page-container {
    .search-card {
      margin-bottom: 16px;
    }

    .toolbar-card {
      margin-bottom: 16px;

      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .toolbar-left {
          display: flex;
          gap: 12px;
        }
      }
    }

    .table-card {
      .pagination-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 16px;
      }
    }
  }
</style>

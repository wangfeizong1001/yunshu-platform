<template>
  <div class="page-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="用户名称">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="登录状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择"
            clearable
            style="width: 120px"
          >
            <el-option label="成功" value="0" />
            <el-option label="失败" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="登录时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
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
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
          <el-button type="warning" :icon="Delete" @click="handleClean">清空日志</el-button>
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
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
        <el-table-column label="访问编号" prop="infoId" width="80" align="center" />
        <el-table-column label="用户名称" prop="userName" width="120" align="center" />
        <el-table-column label="登录状态" prop="status" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="登录地址" prop="loginLocation" width="140" align="center" />
        <el-table-column
          label="操作系统"
          prop="os"
          width="120"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="浏览器"
          prop="browser"
          width="120"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="登录时间" prop="loginTime" width="180" align="center">
          <template #default="{ row }">
            {{ formatDate(row.loginTime) }}
          </template>
        </el-table-column>
        <el-table-column label="登录信息" prop="msg" min-width="200" show-overflow-tooltip />
        <el-table-column label="登录IP" prop="ipaddr" width="140" align="center" />
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row as any)">详情</el-button>
            <el-button link type="danger" @click="handleDelete(row as any)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="登录日志详情" width="600px" destroy-on-close>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="访问编号">{{ currentRow?.infoId }}</el-descriptions-item>
        <el-descriptions-item label="用户名称">{{ currentRow?.userName }}</el-descriptions-item>
        <el-descriptions-item label="登录状态">
          <el-tag :type="currentRow?.status === '0' ? 'success' : 'danger'">
            {{ currentRow?.status === '0' ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="登录地址">{{
          currentRow?.loginLocation
        }}</el-descriptions-item>
        <el-descriptions-item label="操作系统">{{ currentRow?.os }}</el-descriptions-item>
        <el-descriptions-item label="浏览器">{{ currentRow?.browser }}</el-descriptions-item>
        <el-descriptions-item label="登录时间" :span="2">{{
          formatDate(currentRow?.loginTime)
        }}</el-descriptions-item>
        <el-descriptions-item label="登录IP">{{ currentRow?.ipaddr }}</el-descriptions-item>
        <el-descriptions-item label="登录信息" :span="2">{{
          currentRow?.msg
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { Search, Refresh, Delete, Download } from '@element-plus/icons-vue';
  import type { LogininforQuery, LogininforInfo } from '@/api/monitor/logininfor.api';
  import * as logininforApi from '@/api/monitor/logininfor.api';

  const loading = ref(false);
  const tableData = ref<LogininforInfo[]>([]);
  const total = ref(0);
  const selectedIds = ref<number[]>([]);
  const dateRange = ref<[string, string] | null>(null);
  const detailVisible = ref(false);
  const currentRow = ref<LogininforInfo | null>(null);

  const queryParams = reactive<LogininforQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('zh-CN');
  };

  const handleQuery = async () => {
    loading.value = true;
    try {
      if (dateRange.value) {
        queryParams.startTime = dateRange.value[0];
        queryParams.endTime = dateRange.value[1];
      } else {
        delete queryParams.startTime;
        delete queryParams.endTime;
      }
      const res = await logininforApi.getLogininforPage(queryParams);
      const responseData = res as Record<string, unknown>;
      if (responseData.success) {
        tableData.value = responseData.data as LogininforInfo[];
        const pagination = responseData.pagination as Record<string, unknown>;
        total.value = Number(pagination.total) || 0;
      }
    } catch {
      ElMessage.error('获取登录日志失败');
    } finally {
      loading.value = false;
    }
  };

  const handleReset = () => {
    queryParams.pageNum = 1;
    queryParams.pageSize = 10;
    queryParams.userName = undefined;
    delete queryParams.startTime;
    delete queryParams.endTime;
    dateRange.value = null;
    handleQuery();
  };

  const handleRefresh = () => {
    handleQuery();
  };

  const handleSelectionChange = (selection: LogininforInfo[]) => {
    selectedIds.value = selection.map((item) => Number(item.infoId));
  };

  const handleViewDetail = (row: LogininforInfo) => {
    currentRow.value = row;
    detailVisible.value = true;
  };

  const handleDelete = async (row: LogininforInfo) => {
    try {
      await ElMessageBox.confirm('确认删除该登录日志吗？', '提示', { type: 'warning' });
      await logininforApi.deleteLogininfor(row.infoId);
      ElMessage.success('删除成功');
      handleQuery();
    } catch {
      // 用户取消
    }
  };

  const handleBatchDelete = async () => {
    try {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 条登录日志吗？`,
        '提示',
        { type: 'warning' },
      );
      await logininforApi.batchDeleteLogininfor(selectedIds.value);
      ElMessage.success('删除成功');
      handleQuery();
    } catch {
      // 用户取消
    }
  };

  const handleClean = async () => {
    try {
      await ElMessageBox.confirm('确认清空所有登录日志吗？此操作不可恢复！', '警告', {
        type: 'warning',
      });
      await logininforApi.cleanLogininfor();
      ElMessage.success('清空成功');
      handleQuery();
    } catch {
      // 用户取消
    }
  };

  const handleExport = () => {
    logininforApi.exportLogininfor(queryParams);
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

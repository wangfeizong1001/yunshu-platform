<template>
  <div class="knowledge-list">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入文档标题或内容"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="文档分类" prop="categoryId">
          <el-select v-model="queryParams.categoryId" placeholder="请选择分类" clearable>
            <el-option
              v-for="category in categoryList"
              :key="category.categoryId"
              :label="category.categoryName"
              :value="category.categoryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="发布" value="0" />
            <el-option label="草稿" value="1" />
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
              v-has-permi="['system:knowledge:add']"
              type="primary"
              :icon="Plus"
              @click="handleAdd"
            >
              新增文档
            </el-button>
            <el-button
              v-has-permi="['system:knowledge:remove']"
              type="danger"
              :icon="Delete"
              :disabled="selectedRows.length === 0"
              @click="handleBatchDelete"
            >
              批量删除
            </el-button>
          </div>
          <div class="right">
            <el-button :icon="Refresh" circle @click="fetchKnowledgeList" />
          </div>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="knowledgeList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="knowledgeId" label="文档编号" width="100" />
        <el-table-column prop="title" label="文档标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="tags" label="标签" width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag
              v-for="(tag, index) in row.tags?.split(',') || []"
              :key="index"
              size="small"
              style="margin-right: 4px; margin-bottom: 4px"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'info'">
              {{ row.status === '0' ? '发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览次数" width="100" sortable />
        <el-table-column prop="createBy" label="创建者" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['system:knowledge:edit']"
              link
              type="primary"
              @click="handleEdit(row as KnowledgeInfo)"
            >
              编辑
            </el-button>
            <el-button
              v-has-permi="['system:knowledge:query']"
              link
              type="success"
              @click="handleView(row as KnowledgeInfo)"
            >
              预览
            </el-button>
            <el-button
              v-if="row.status === '1'"
              v-has-permi="['system:knowledge:publish']"
              link
              type="warning"
              @click="handlePublish(row as KnowledgeInfo)"
            >
              发布
            </el-button>
            <el-button
              v-if="row.status === '0'"
              v-has-permi="['system:knowledge:publish']"
              link
              type="info"
              @click="handleWithdraw(row as KnowledgeInfo)"
            >
              撤回
            </el-button>
            <el-button
              v-has-permi="['system:knowledge:remove']"
              link
              type="danger"
              @click="handleDelete(row as KnowledgeInfo)"
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

    <!-- 文档编辑弹窗 -->
    <KnowledgeForm
      v-model="formVisible"
      :knowledge-data="currentKnowledge"
      @refresh="fetchKnowledgeList"
    />

    <!-- 文档预览弹窗 -->
    <KnowledgeDetail v-model="detailVisible" :knowledge-id="currentKnowledgeId" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue';
  import {
    getKnowledgePage,
    getCategoryList,
    deleteKnowledge,
    batchDeleteKnowledge,
    publishKnowledge,
    withdrawKnowledge,
    type KnowledgeInfo,
  } from '@/api/system/knowledge.api';
  import KnowledgeForm from './KnowledgeForm.vue';
  import KnowledgeDetail from './KnowledgeDetail.vue';

  // 状态
  const loading = ref(false);
  const knowledgeList = ref<KnowledgeInfo[]>([]);
  const categoryList = ref<any[]>([]);
  const total = ref(0);
  const selectedRows = ref<KnowledgeInfo[]>([]);
  const formVisible = ref(false);
  const detailVisible = ref(false);
  const currentKnowledge = ref<KnowledgeInfo | null>(null);
  const currentKnowledgeId = ref<number>();

  // 查询参数
  const queryParams = reactive({
    keyword: '',
    categoryId: undefined as number | undefined,
    status: '',
    visible: '',
    pageNum: 1,
    pageSize: 10,
  });

  // 获取分类列表
  async function fetchCategoryList() {
    try {
      const res = (await getCategoryList()) as { data: any[] };
      categoryList.value = res.data || [];
    } catch (error) {
      console.error('获取分类列表失败', error);
    }
  }

  // 获取知识库文档列表
  async function fetchKnowledgeList() {
    loading.value = true;
    try {
      const res = (await getKnowledgePage(queryParams)) as {
        data?: { rows: KnowledgeInfo[]; total: number };
      };
      knowledgeList.value = res.data?.rows || [];
      total.value = res.data?.total || 0;
    } catch (error) {
      console.error('获取知识库文档列表失败', error);
    } finally {
      loading.value = false;
    }
  }

  // 查询
  function handleQuery() {
    queryParams.pageNum = 1;
    fetchKnowledgeList();
  }

  // 重置查询
  function resetQuery() {
    queryParams.keyword = '';
    queryParams.categoryId = undefined;
    queryParams.status = '';
    queryParams.visible = '';
    queryParams.pageNum = 1;
    handleQuery();
  }

  // 新增
  function handleAdd() {
    currentKnowledge.value = null;
    formVisible.value = true;
  }

  // 编辑
  function handleEdit(row: KnowledgeInfo) {
    currentKnowledge.value = { ...row };
    formVisible.value = true;
  }

  // 预览
  function handleView(row: KnowledgeInfo) {
    currentKnowledgeId.value = row.knowledgeId;
    detailVisible.value = true;
  }

  // 发布
  async function handlePublish(row: KnowledgeInfo) {
    try {
      await ElMessageBox.confirm(`是否确认发布文档"${row.title}"？`, '提示', {
        type: 'warning',
      });
      await publishKnowledge(row.knowledgeId);
      ElMessage.success('发布成功');
      fetchKnowledgeList();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('发布失败', error);
      }
    }
  }

  // 撤回
  async function handleWithdraw(row: KnowledgeInfo) {
    try {
      await ElMessageBox.confirm(`是否确认撤回文档"${row.title}"？`, '提示', {
        type: 'warning',
      });
      await withdrawKnowledge(row.knowledgeId);
      ElMessage.success('撤回成功');
      fetchKnowledgeList();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('撤回失败', error);
      }
    }
  }

  // 删除
  async function handleDelete(row: KnowledgeInfo) {
    try {
      await ElMessageBox.confirm(`是否确认删除文档"${row.title}"？`, '提示', {
        type: 'warning',
      });
      await deleteKnowledge(row.knowledgeId);
      ElMessage.success('删除成功');
      fetchKnowledgeList();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败', error);
      }
    }
  }

  // 批量删除
  async function handleBatchDelete() {
    try {
      await ElMessageBox.confirm(
        `是否确认删除选中的 ${selectedRows.value.length} 个文档？`,
        '提示',
        {
          type: 'warning',
        },
      );
      await batchDeleteKnowledge(selectedRows.value.map((row) => row.knowledgeId));
      ElMessage.success('批量删除成功');
      fetchKnowledgeList();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('批量删除失败', error);
      }
    }
  }

  // 表格选择
  function handleSelectionChange(selection: KnowledgeInfo[]) {
    selectedRows.value = selection;
  }

  // 初始化
  onMounted(() => {
    fetchCategoryList();
    fetchKnowledgeList();
  });
</script>

<style scoped lang="scss">
  .knowledge-list {
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

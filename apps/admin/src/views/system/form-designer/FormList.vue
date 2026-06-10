<template>
  <div class="form-list">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="表单名称" prop="formName">
          <el-input
            v-model="queryParams.formName"
            placeholder="请输入表单名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="草稿" value="0" />
            <el-option label="已发布" value="1" />
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
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
            <el-button
              v-if="selectedRows.length > 0"
              type="danger"
              :icon="Delete"
              @click="handleBatchDelete"
            >
              批量删除
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
        :data="formList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="formId" label="表单ID" width="80" />
        <el-table-column prop="formName" label="表单名称" width="200" />
        <el-table-column prop="formCode" label="表单编码" width="200" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'info'">
              {{ row.status === '1' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDesign(row)">设计</el-button>
            <el-button link type="primary" @click="handlePreview(row)">预览</el-button>
            <el-button v-if="row.status === '0'" link type="success" @click="handlePublish(row)">
              发布
            </el-button>
            <el-button v-if="row.status === '1'" link type="warning" @click="handleStop(row)">
              停用
            </el-button>
            <el-button link type="primary" @click="handleCopy(row)">复制</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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

    <!-- 表单弹窗 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="currentForm ? '编辑表单' : '新增表单'"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="表单名称" prop="formName">
          <el-input v-model="formData.formName" placeholder="请输入表单名称" />
        </el-form-item>
        <el-form-item label="表单编码" prop="formCode">
          <el-input
            v-model="formData.formCode"
            placeholder="请输入表单编码"
            :disabled="!!currentForm"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
  import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue';
  import { useRouter } from 'vue-router';
  import {
    getFormPage,
    getForm,
    addForm,
    updateForm,
    deleteForm,
    batchDeleteForm,
    copyForm,
    publishForm,
    stopForm,
    type FormForm,
  } from '@/api/system/form.api';

  const router = useRouter();

  // 状态
  const loading = ref(false);
  const formList = ref<any[]>([]);
  const total = ref(0);
  const selectedRows = ref<any[]>([]);
  const formDialogVisible = ref(false);
  const currentForm = ref<any>(null);
  const formRef = ref<FormInstance>();
  const formData = reactive<FormForm>({
    formName: '',
    formCode: '',
    description: '',
    remark: '',
  });

  // 表单校验规则
  const formRules: FormRules = {
    formName: [{ required: true, message: '请输入表单名称', trigger: 'blur' }],
    formCode: [
      { required: true, message: '请输入表单编码', trigger: 'blur' },
      {
        pattern: /^[a-zA-Z0-9_]+$/,
        message: '表单编码只能包含字母、数字和下划线',
        trigger: 'blur',
      },
    ],
  };

  // 查询参数
  const queryParams = reactive({
    formName: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  });

  // 获取表单列表
  async function fetchFormList() {
    loading.value = true;
    try {
      const res = await getFormPage(queryParams);
      formList.value = res.rows;
      total.value = res.total;
    } finally {
      loading.value = false;
    }
  }

  // 查询
  function handleQuery() {
    queryParams.pageNum = 1;
    fetchFormList();
  }

  // 重置查询
  function resetQuery() {
    queryParams.formName = '';
    queryParams.status = '';
    queryParams.pageNum = 1;
    handleQuery();
  }

  // 刷新表格
  function refreshTable() {
    fetchFormList();
  }

  // 新增
  function handleAdd() {
    currentForm.value = null;
    resetForm();
    formDialogVisible.value = true;
  }

  // 编辑
  async function handleEdit(row: any) {
    try {
      const res = await getForm(row.formId);
      currentForm.value = res;
      Object.assign(formData, {
        formName: res.formName,
        formCode: res.formCode,
        description: res.description,
        remark: res.remark,
      });
      formDialogVisible.value = true;
    } catch (error) {
      console.error('获取表单详情失败', error);
    }
  }

  // 删除
  async function handleDelete(row: any) {
    try {
      await ElMessageBox.confirm(`是否确认删除表单"${row.formName}"？`, '提示', {
        type: 'warning',
      });
      await deleteForm(row.formId);
      ElMessage.success('删除成功');
      fetchFormList();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败', error);
      }
    }
  }

  // 批量删除
  async function handleBatchDelete() {
    try {
      await ElMessageBox.confirm(`是否确认删除选中的${selectedRows.value.length}个表单？`, '提示', {
        type: 'warning',
      });
      await batchDeleteForm(selectedRows.value.map((row) => row.formId));
      ElMessage.success('删除成功');
      fetchFormList();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败', error);
      }
    }
  }

  // 复制
  async function handleCopy(row: any) {
    try {
      await ElMessageBox.confirm(`是否确认复制表单"${row.formName}"？`, '提示', {
        type: 'warning',
      });
      await copyForm(row.formId);
      ElMessage.success('复制成功');
      fetchFormList();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('复制失败', error);
      }
    }
  }

  // 发布
  async function handlePublish(row: any) {
    try {
      await ElMessageBox.confirm(`是否确认发布表单"${row.formName}"？`, '提示', {
        type: 'warning',
      });
      await publishForm(row.formId);
      ElMessage.success('发布成功');
      fetchFormList();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('发布失败', error);
      }
    }
  }

  // 停用
  async function handleStop(row: any) {
    try {
      await ElMessageBox.confirm(`是否确认停用表单"${row.formName}"？`, '提示', {
        type: 'warning',
      });
      await stopForm(row.formId);
      ElMessage.success('停用成功');
      fetchFormList();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('停用失败', error);
      }
    }
  }

  // 设计
  function handleDesign(row: any) {
    router.push(`/system/form-design/${row.formId}`);
  }

  // 预览
  function handlePreview(row: any) {
    router.push(`/system/form-preview/${row.formId}`);
  }

  // 提交
  async function handleSubmit() {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          if (currentForm.value) {
            await updateForm({
              formId: currentForm.value.formId,
              ...formData,
            });
          } else {
            await addForm(formData);
          }
          ElMessage.success('操作成功');
          formDialogVisible.value = false;
          fetchFormList();
        } catch (error) {
          console.error('操作失败', error);
        }
      }
    });
  }

  // 重置表单
  function resetForm() {
    formData.formName = '';
    formData.formCode = '';
    formData.description = '';
    formData.remark = '';
    formRef.value?.resetFields();
  }

  // 批量选择
  function handleSelectionChange(selection: any[]) {
    selectedRows.value = selection;
  }

  // 初始化
  onMounted(() => {
    fetchFormList();
  });
</script>

<style scoped lang="scss">
  .form-list {
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

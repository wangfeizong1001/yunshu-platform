<template>
  <div class="sms-config">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>短信配置</span>
          <el-button type="primary" :icon="Edit" @click="handleEdit">修改配置</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="短信平台">
          <el-tag :type="config.platform === 'aliyun' ? 'success' : 'warning'">
            {{ config.platform === 'aliyun' ? '阿里云短信' : '腾讯云短信' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="签名">
          {{ config.signName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="模板CODE">
          {{ config.templateCode || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="config.status === '1' ? 'success' : 'danger'">
            {{ config.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 短信模板 -->
    <el-card shadow="never" class="template-card">
      <template #header>
        <div class="card-header">
          <span>短信模板</span>
          <el-button type="primary" :icon="Plus" @click="handleAddTemplate">新增模板</el-button>
        </div>
      </template>

      <el-table v-loading="templateLoading" :data="templateList" stripe border>
        <el-table-column prop="id" label="模板ID" width="80" />
        <el-table-column prop="templateCode" label="模板CODE" width="150" />
        <el-table-column prop="templateName" label="模板名称" width="150" />
        <el-table-column prop="content" label="模板内容" min-width="300" show-overflow-tooltip />
        <el-table-column prop="platform" label="平台" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.platform === 'aliyun' ? '阿里云' : '腾讯云' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'danger'" size="small">
              {{ row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEditTemplate(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDeleteTemplate(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改配置弹窗 -->
    <el-dialog v-model="configVisible" title="修改短信配置" width="500px" append-to-body>
      <el-form ref="configFormRef" :model="configForm" :rules="configRules" label-width="100px">
        <el-form-item label="短信平台" prop="platform">
          <el-select v-model="configForm.platform" placeholder="请选择短信平台">
            <el-option label="阿里云短信" value="aliyun" />
            <el-option label="腾讯云短信" value="qcloud" />
          </el-select>
        </el-form-item>
        <el-form-item label="AccessKey" prop="accessKey">
          <el-input v-model="configForm.accessKey" placeholder="请输入 AccessKey" show-password />
        </el-form-item>
        <el-form-item label="SecretKey" prop="secretKey">
          <el-input v-model="configForm.secretKey" placeholder="请输入 SecretKey" show-password />
        </el-form-item>
        <el-form-item label="签名" prop="signName">
          <el-input v-model="configForm.signName" placeholder="请输入短信签名" />
        </el-form-item>
        <el-form-item label="模板CODE" prop="templateCode">
          <el-input v-model="configForm.templateCode" placeholder="请输入模板CODE" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="configForm.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="configVisible = false">取消</el-button>
        <el-button type="primary" :loading="configLoading" @click="handleSaveConfig"
          >保存</el-button
        >
      </template>
    </el-dialog>

    <!-- 模板表单弹窗 -->
    <el-dialog
      v-model="templateVisible"
      :title="templateForm.id ? '编辑模板' : '新增模板'"
      width="600px"
      append-to-body
    >
      <el-form
        ref="templateFormRef"
        :model="templateForm"
        :rules="templateRules"
        label-width="100px"
      >
        <el-form-item label="模板CODE" prop="templateCode">
          <el-input v-model="templateForm.templateCode" placeholder="请输入模板CODE" />
        </el-form-item>
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="templateForm.templateName" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-select v-model="templateForm.platform" placeholder="请选择平台">
            <el-option label="阿里云短信" value="aliyun" />
            <el-option label="腾讯云短信" value="qcloud" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板内容" prop="content">
          <el-input
            v-model="templateForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入模板内容，使用 ${param} 作为变量占位符"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="templateForm.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="templateForm.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="templateVisible = false">取消</el-button>
        <el-button type="primary" :loading="templateLoading" @click="handleSaveTemplate"
          >保存</el-button
        >
      </template>
    </el-dialog>

    <!-- 发送短信弹窗 -->
    <el-dialog v-model="sendVisible" title="发送短信" width="500px" append-to-body>
      <el-form ref="sendFormRef" :model="sendForm" :rules="sendRules" label-width="100px">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="sendForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="模板" prop="templateCode">
          <el-select v-model="sendForm.templateCode" placeholder="请选择模板">
            <el-option
              v-for="item in templateList.filter((t) => t.status === '1')"
              :key="item.templateCode"
              :label="item.templateName"
              :value="item.templateCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参数">
          <el-input
            v-model="sendParams"
            type="textarea"
            :rows="3"
            placeholder='请输入参数，JSON格式，如: {"code":"123456"}'
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="sendVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTestSend">发送测试</el-button>
        <el-button type="primary" :loading="sendLoading" @click="handleSend">发送</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { Edit, Plus } from '@element-plus/icons-vue';
  import { getSmsConfig, saveSmsConfig, sendSms } from '@/api/system/sms.api';
  import type { SmsConfig, SmsTemplate } from '@yunshu/shared';

  // 配置相关
  const config = reactive<SmsConfig>({
    id: 0,
    platform: 'aliyun',
    accessKey: '',
    secretKey: '',
    signName: '',
    templateCode: '',
    status: '0',
  });

  const configVisible = ref(false);
  const configLoading = ref(false);
  const configFormRef = ref();
  const configForm = reactive({
    platform: 'aliyun' as 'aliyun' | 'qcloud',
    accessKey: '',
    secretKey: '',
    signName: '',
    templateCode: '',
    status: '1',
  });

  const configRules = {
    platform: [{ required: true, message: '请选择短信平台', trigger: 'change' }],
    accessKey: [{ required: true, message: '请输入 AccessKey', trigger: 'blur' }],
    secretKey: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
    signName: [{ required: true, message: '请输入签名', trigger: 'blur' }],
    templateCode: [{ required: true, message: '请输入模板CODE', trigger: 'blur' }],
  };

  // 模板相关
  const templateLoading = ref(false);
  const templateList = ref<SmsTemplate[]>([]);
  const templateVisible = ref(false);
  const templateFormRef = ref();
  const templateForm = reactive({
    id: 0,
    templateCode: '',
    templateName: '',
    content: '',
    platform: 'aliyun' as 'aliyun' | 'qcloud',
    status: '1',
    remark: '',
  });

  const templateRules = {
    templateCode: [{ required: true, message: '请输入模板CODE', trigger: 'blur' }],
    templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
    content: [{ required: true, message: '请输入模板内容', trigger: 'blur' }],
  };

  // 发送相关
  const sendVisible = ref(false);
  const sendLoading = ref(false);
  const sendFormRef = ref();
  const sendForm = reactive({
    mobile: '',
    templateCode: '',
  });
  const sendParams = ref('');

  const sendRules = {
    mobile: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    ],
    templateCode: [{ required: true, message: '请选择模板', trigger: 'change' }],
  };

  // 加载配置
  async function loadConfig() {
    try {
      const res = await getSmsConfig();
      Object.assign(config, res);
      Object.assign(configForm, res);
    } catch (error) {
      console.error('加载配置失败', error);
    }
  }

  // 加载模板列表
  async function loadTemplateList() {
    templateLoading.value = true;
    try {
      templateList.value = [];
    } finally {
      templateLoading.value = false;
    }
  }

  // 修改配置
  function handleEdit() {
    Object.assign(configForm, config);
    configVisible.value = true;
  }

  // 保存配置
  async function handleSaveConfig() {
    try {
      await configFormRef.value?.validate();
      configLoading.value = true;
      await saveSmsConfig(configForm as any);
      ElMessage.success('保存成功');
      configVisible.value = false;
      loadConfig();
    } catch (error) {
      console.error('保存配置失败', error);
    } finally {
      configLoading.value = false;
    }
  }

  // 新增模板
  function handleAddTemplate() {
    templateForm.id = 0;
    templateForm.templateCode = '';
    templateForm.templateName = '';
    templateForm.content = '';
    templateForm.platform = 'aliyun';
    templateForm.status = '1';
    templateForm.remark = '';
    templateVisible.value = true;
  }

  // 编辑模板
  function handleEditTemplate(row: any) {
    Object.assign(templateForm, row);
    templateVisible.value = true;
  }

  // 保存模板
  async function handleSaveTemplate() {
    try {
      await templateFormRef.value?.validate();
      templateLoading.value = true;
      ElMessage.success('保存成功');
      templateVisible.value = false;
      loadTemplateList();
    } catch (error) {
      console.error('保存模板失败', error);
    } finally {
      templateLoading.value = false;
    }
  }

  // 删除模板
  async function handleDeleteTemplate(row: any) {
    try {
      await ElMessageBox.confirm(`是否确认删除模板"${row.templateName}"？`, '提示', {
        type: 'warning',
      });
      ElMessage.success('删除成功');
      loadTemplateList();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除模板失败', error);
      }
    }
  }

  // 发送短信
  function handleTestSend() {
    sendVisible.value = true;
  }

  // 确认发送
  async function handleSend() {
    try {
      await sendFormRef.value?.validate();
      sendLoading.value = true;
      await sendSms(sendForm.mobile, sendParams.value || '');
      ElMessage.success('发送成功');
      sendVisible.value = false;
    } catch (error) {
      console.error('发送失败', error);
    } finally {
      sendLoading.value = false;
    }
  }

  // 初始化
  onMounted(() => {
    loadConfig();
    loadTemplateList();
  });
</script>

<style scoped lang="scss">
  .sms-config {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .template-card {
      margin-top: 16px;
    }
  }
</style>

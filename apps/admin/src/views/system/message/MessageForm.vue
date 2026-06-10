<template>
  <el-dialog
    v-model="visible"
    title="发送消息"
    width="700px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="接收人" prop="receiverIds">
        <el-select
          v-model="formData.receiverIds"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请选择接收人"
          style="width: 100%"
          :remote-method="handleRemoteSearch"
          :loading="userLoading"
        >
          <el-option
            v-for="user in userOptions"
            :key="user.userId"
            :label="user.nickname || user.username"
            :value="user.userId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio label="normal">普通消息</el-radio>
          <el-radio label="system">系统消息</el-radio>
          <el-radio label="reminder">提醒消息</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-radio-group v-model="formData.priority">
          <el-radio label="low">低</el-radio>
          <el-radio label="medium">中</el-radio>
          <el-radio label="high">高</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="6"
          placeholder="请输入消息内容"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">发送</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { ElMessage } from 'element-plus';
  import { sendMessage, type MessageForm as MessageFormType } from '@/api/system/message.api';

  interface UserOption {
    userId: number;
    username: string;
    nickname?: string;
  }

  const props = defineProps<{
    modelValue: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'refresh'): void;
  }>();

  const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });

  const formRef = ref();
  const submitLoading = ref(false);
  const userLoading = ref(false);
  const userOptions = ref<UserOption[]>([]);

  const defaultFormData: MessageFormType = {
    receiverIds: [],
    title: '',
    type: 'normal',
    priority: 'medium',
    content: '',
  };

  const formData = reactive<MessageFormType>({ ...defaultFormData });

  const rules = {
    receiverIds: [{ required: true, message: '请选择接收人', trigger: 'change' }],
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
    content: [{ required: true, message: '请输入消息内容', trigger: 'blur' }],
  };

  async function handleRemoteSearch(query: string) {
    if (query) {
      userLoading.value = true;
      try {
        userOptions.value = [
          { userId: 1, username: 'admin', nickname: '管理员' },
          { userId: 2, username: 'test', nickname: '测试用户' },
          { userId: 3, username: 'user1', nickname: '用户1' },
        ].filter(
          (user) =>
            user.username.includes(query) || (user.nickname && user.nickname.includes(query)),
        );
      } finally {
        userLoading.value = false;
      }
    } else {
      userOptions.value = [];
    }
  }

  function resetForm() {
    Object.assign(formData, { ...defaultFormData });
    formRef.value?.resetFields();
  }

  async function handleSubmit() {
    try {
      await formRef.value?.validate();
      submitLoading.value = true;
      await sendMessage(formData);
      ElMessage.success('发送成功');
      visible.value = false;
      emit('refresh');
    } catch (error) {
      if (error !== false) {
        console.error('发送失败:', error);
      }
    } finally {
      submitLoading.value = false;
    }
  }

  function handleCancel() {
    visible.value = false;
  }

  function handleClosed() {
    resetForm();
  }
</script>

<style scoped lang="scss">
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
</style>

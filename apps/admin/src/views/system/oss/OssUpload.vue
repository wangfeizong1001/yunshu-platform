<template>
  <el-dialog v-model="visible" title="上传文件" width="500px" append-to-body @close="handleClose">
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="存储类型" prop="storageType">
        <el-select v-model="form.storageType" placeholder="请选择存储类型">
          <el-option label="本地存储" value="local" />
          <el-option label="阿里云 OSS" value="aliyun" />
          <el-option label="腾讯云 COS" value="qcloud" />
          <el-option label="七牛云" value="qiniu" />
        </el-select>
      </el-form-item>
      <el-form-item label="文件" prop="file">
        <el-upload
          ref="uploadRef"
          :action="uploadUrl"
          :headers="headers"
          :data="{ storageType: form.storageType }"
          :before-upload="handleBeforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-progress="handleProgress"
          drag
          :show-file-list="false"
          accept="*"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">文件大小不能超过 100MB</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="uploadProgress > 0 && uploadProgress < 100" label="上传进度">
        <el-progress :percentage="uploadProgress" :stroke-width="10" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue';
  import { ElMessage } from 'element-plus';
  import { UploadFilled } from '@element-plus/icons-vue';
  import { getToken } from '@/utils/auth';

  interface Props {
    modelValue: boolean;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    refresh: [];
  }>();

  const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });

  const formRef = ref();
  const uploadRef = ref();

  const form = reactive({
    storageType: 'local',
  });

  const uploadProgress = ref(0);

  const uploadUrl = computed(() => {
    const baseUrl = (import.meta as any).env.VITE_APP_BASE_API || '';
    return `${baseUrl}/api/system/oss/upload`;
  });

  const headers = computed(() => ({
    Authorization: `Bearer ${getToken() || ''}`,
  }));

  // 上传前验证
  function handleBeforeUpload(file: File) {
    if (file.size > 100 * 1024 * 1024) {
      ElMessage.error('文件大小不能超过 100MB');
      return false;
    }
    return true;
  }

  // 上传成功
  function handleSuccess(res: any) {
    if (res.code === 200 || res.code === 0 || res.success) {
      ElMessage.success('上传成功');
      emit('refresh');
      handleClose();
    } else {
      ElMessage.error(res.msg || res.message || '上传失败');
    }
  }

  // 上传失败
  function handleError(err: any) {
    ElMessage.error('上传失败');
    console.error('上传失败', err);
  }

  // 上传进度
  function handleProgress(event: any) {
    uploadProgress.value = Math.round(event.percent || 0);
  }

  // 关闭弹窗
  function handleClose() {
    form.storageType = 'local';
    uploadProgress.value = 0;
    visible.value = false;
  }

  // 重置表单
  function resetForm() {
    formRef.value?.resetFields();
  }

  // 监听弹窗关闭
  watch(visible, (val) => {
    if (!val) {
      resetForm();
    }
  });
</script>

<style scoped lang="scss">
  .el-icon--upload {
    font-size: 67px;
    color: var(--el-text-color-placeholder);
    margin-bottom: 16px;
  }

  .el-upload__text {
    color: var(--el-text-color-regular);
    font-size: 14px;

    em {
      color: var(--el-color-primary);
      font-style: normal;
    }
  }
</style>

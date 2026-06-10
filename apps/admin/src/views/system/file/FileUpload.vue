<template>
  <el-dialog
    v-model="visible"
    title="上传文件"
    width="500px"
    append-to-body
    @close="handleClose"
  >
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :auto-upload="false"
      :limit="10"
      :on-exceed="handleExceed"
      :on-change="handleChange"
      drag
      multiple
      class="file-upload"
    >
      <el-icon class="upload-icon"><UploadFilled /></el-icon>
      <div class="upload-text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="upload-tip">
          支持多文件上传，单个文件不超过10MB
        </div>
      </template>
    </el-upload>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="uploading" @click="handleSubmit">
        上传
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadInstance } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { uploadFile } from '@/api/system/file.api'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 状态
const uploadRef = ref<UploadInstance>()
const fileList = ref<unknown[]>([])
const uploading = ref(false)

// 处理文件超出限制
function handleExceed(files: File[], _uploadFiles: unknown[]) {
  ElMessage.warning(`最多只能上传10个文件，当前已选择${files.length}个文件`)
}

// 处理文件变化
function handleChange(_file: unknown, uploadFiles: unknown[]) {
  fileList.value = uploadFiles
}

// 提交上传
async function handleSubmit() {
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择要上传的文件')
    return
  }

  uploading.value = true
  let successCount = 0
  let failCount = 0

  try {
    for (const item of fileList.value) {
      if (item.status === 'ready') {
        try {
          await uploadFile(item.raw)
          successCount++
        } catch (error) {
          failCount++
          console.error(`文件${item.name}上传失败`, error)
        }
      }
    }

    if (successCount > 0) {
      ElMessage.success(`成功上传${successCount}个文件${failCount > 0 ? `，${failCount}个文件上传失败` : ''}`)
      emit('refresh')
      handleClose()
    } else if (failCount > 0) {
      ElMessage.error(`文件上传失败`)
    }
  } finally {
    uploading.value = false
  }
}

// 关闭弹窗
function handleClose() {
  fileList.value = []
  visible.value = false
}
</script>

<style scoped lang="scss">
.file-upload {
  .upload-icon {
    font-size: 67px;
    color: #8c939d;
    margin-bottom: 16px;
  }

  .upload-text {
    color: #606266;
    font-size: 14px;

    em {
      color: #409eff;
      font-style: normal;
    }
  }

  .upload-tip {
    color: #909399;
    font-size: 12px;
    margin-top: 8px;
  }
}
</style>

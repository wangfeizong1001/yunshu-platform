<template>
  <el-upload
    ref="uploadRef"
    :action="uploadUrl"
    :headers="headers"
    :data="extraData"
    :before-upload="handleBeforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-progress="handleProgress"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :file-list="internalFileList"
    :accept="accept"
    :disabled="disabled"
    :limit="limit"
    :multiple="multiple"
    :drag="drag"
    :show-file-list="showFileList"
    :class="[{ 'hide-upload': hideUploadBtn }, 'oss-upload']"
  >
    <slot>
      <el-button type="primary" :icon="Upload" :disabled="disabled">
        {{ drag ? '将文件拖到此处，或点击上传' : '上传文件' }}
      </el-button>
    </slot>
    <template #tip>
      <div v-if="tip" class="el-upload__tip">
        {{ tip }}
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'
import type { UploadUserFile } from 'element-plus'

interface UploadResponseData {
  url?: string
  filePath?: string
}

interface UploadResponse {
  code?: number
  success?: boolean
  data?: UploadResponseData | string
  msg?: string
  message?: string
}

interface Props {
  modelValue?: string
  action?: string
  extraData?: Record<string, unknown>
  accept?: string
  maxSize?: number
  disabled?: boolean
  limit?: number
  multiple?: boolean
  drag?: boolean
  showFileList?: boolean
  tip?: string
  fileType?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  action: '/api/system/oss/upload',
  accept: '*',
  maxSize: 10,
  disabled: false,
  limit: 1,
  multiple: false,
  drag: false,
  showFileList: true,
  tip: '',
  fileType: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'success': [data: unknown]
  'error': [error: unknown]
  'progress': [event: unknown]
  'change': [file: unknown, fileList: unknown[]]
  'remove': [file: unknown, fileList: unknown[]]
}>()

const uploadRef = ref<InstanceType<typeof import('element-plus')['ElUpload']> | null>(null)

const uploadUrl = computed(() => {
  const env = (import.meta as unknown as { env: Record<string, string> }).env
  const baseUrl = env.VITE_API_BASE_URL || ''
  return `${baseUrl}${props.action}`
})

const headers = computed(() => ({
  Authorization: `Bearer ${getToken() || ''}`,
}))

const extraData = computed(() => {
  return {
    ...props.extraData,
  }
})

const hideUploadBtn = computed(() => {
  if (!props.multiple && props.limit === 1) {
    return !!props.modelValue && props.showFileList
  }
  return false
})

const internalFileList = ref<UploadUserFile[]>([])

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const fileName = val.split('/').pop() || val
      internalFileList.value = [
        {
          name: fileName,
          url: val,
          uid: Date.now(),
        } as UploadUserFile,
      ]
    } else {
      internalFileList.value = []
    }
  },
  { immediate: true }
)

function handleBeforeUpload(file: File) {
  if (props.maxSize > 0 && file.size > props.maxSize * 1024 * 1024) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`)
    return false
  }
  if (props.fileType.length > 0) {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
    const isValidType = props.fileType.some((type) => {
      if (type.startsWith('.')) {
        return type.toLowerCase() === `.${fileExt}`
      }
      return type === fileExt
    })
    if (!isValidType) {
      ElMessage.error(`文件类型不允许，仅支持：${props.fileType.join('、')}`)
      return false
    }
  }
  return true
}

function handleSuccess(res: unknown) {
  const r = res as UploadResponse
  if (r.code === 200 || r.code === 0 || r.success) {
    let url = ''
    if (typeof r.data && typeof r.data === 'object') {
      url = (r.data as UploadResponseData).url || (r.data as UploadResponseData).filePath || ''
    } else if (typeof r.data === 'string') {
      url = r.data
    }
    emit('update:modelValue', url)
    emit('success', r.data)
    ElMessage.success('上传成功')
  } else {
    emit('error', r)
    ElMessage.error(r.msg || r.message || '上传失败')
    internalFileList.value = []
  }
}

function handleError(err: unknown) {
  emit('error', err)
  ElMessage.error('上传失败')
}

function handleProgress(event: unknown) {
  emit('progress', event)
}

function handleChange(file: unknown, fileList: unknown[]) {
  emit('change', file, fileList)
}

function handleRemove(file: unknown, fileList: unknown[]) {
  if ((fileList as unknown[]).length === 0) {
    emit('update:modelValue', '')
  }
  emit('remove', file, fileList)
}

function submit() {
  uploadRef.value?.submit()
}

function clearFiles() {
  uploadRef.value?.clearFiles()
}

function abort(file?: unknown) {
  uploadRef.value?.abort(file)
}

defineExpose({
  submit,
  clearFiles,
  abort,
  uploadRef,
})
</script>

<style scoped lang="scss">
.oss-upload {
  :deep(.el-upload) {
    &.is-drag {
      border: 2px dashed var(--el-border-color);
      border-radius: 6px;
      padding: 20px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
  }

  &.hide-upload {
    :deep(.el-upload) {
      display: none;
    }
  }
}

.el-upload__tip {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-top: 7px;
}
</style>

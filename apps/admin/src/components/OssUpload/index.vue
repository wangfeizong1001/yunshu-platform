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

interface Props {
  /** 绑定的文件路径 */
  modelValue?: string
  /** 上传地址 */
  action?: string
  /** 额外参数 */
  extraData?: Record<string, unknown>
  /** 接受的文件类型 */
  accept?: string
  /** 文件大小限制 (MB) */
  maxSize?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 文件数量限制 */
  limit?: number
  /** 是否多选 */
  multiple?: boolean
  /** 是否拖拽上传 */
  drag?: boolean
  /** 是否显示文件列表 */
  showFileList?: boolean
  /** 提示文字 */
  tip?: string
  /** 文件类型验证正则 */
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

const uploadRef = ref()

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

// 隐藏上传按钮
const hideUploadBtn = computed(() => {
  if (!props.multiple && props.limit === 1) {
    return !!props.modelValue && props.showFileList
  }
  return false
})

// 内部文件列表
const internalFileList = ref<unknown[]>([])

// 监听外部值变化
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const fileName = val.split('/').pop() || val
      internalFileList.value = [
        {
          name: fileName,
          url: val,
        },
      ]
    } else {
      internalFileList.value = []
    }
  },
  { immediate: true }
)

// 上传前验证
function handleBeforeUpload(file: File) {
  // 检查文件大小
  if (props.maxSize > 0 && file.size > props.maxSize * 1024 * 1024) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`)
    return false
  }

  // 检查文件类型
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

// 上传成功
function handleSuccess(res: Record<string, unknown>) {
  if (res.code === 200 || res.code === 0 || res.success) {
    const url = res.data?.url || res.data?.filePath || res.data
    emit('update:modelValue', url)
    emit('success', res.data)
    ElMessage.success('上传成功')
  } else {
    emit('error', res)
    ElMessage.error(res.msg || res.message || '上传失败')
    // 清空文件列表
    internalFileList.value = []
  }
}

// 上传失败
function handleError(err: unknown) {
  emit('error', err)
  ElMessage.error('上传失败')
}

// 上传进度
function handleProgress(event: unknown) {
  emit('progress', event)
}

// 文件改变
function handleChange(file: unknown, fileList: unknown[]) {
  emit('change', file, fileList)
}

// 文件移除
function handleRemove(file: unknown, fileList: unknown[]) {
  if (fileList.length === 0) {
    emit('update:modelValue', '')
  }
  emit('remove', file, fileList)
}

// 手动上传
function submit() {
  uploadRef.value?.submit()
}

// 清除文件
function clearFiles() {
  uploadRef.value?.clearFiles()
}

// 取消上传
function abort(file?: unknown) {
  uploadRef.value?.abort(file)
}

// 获取上传组件引用
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
      transition: border-color 0.3s;

      &:hover {
        border-color: var(--el-color-primary);
      }
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
  line-height: 1.4;
}
</style>

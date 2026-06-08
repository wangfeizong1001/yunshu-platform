<template>
  <el-dialog
    v-model="visible"
    title="代码预览"
    width="90%"
    :close-on-click-modal="false"
    class="preview-dialog"
  >
    <div class="preview-container">
      <!-- 文件列表 -->
      <div class="file-list">
        <div class="file-list-header">
          <span>生成文件 ({{ fileList.length }})</span>
        </div>
        <div class="file-list-content">
          <div
            v-for="file in fileList"
            :key="file.filePath"
            :class="['file-item', { active: currentFile?.filePath === file.filePath }]"
            @click="handleSelectFile(file)"
          >
            <el-icon><Document /></el-icon>
            <span class="file-name">{{ file.fileName }}</span>
            <el-tag size="small" type="info">{{ getFileExt(file.fileName) }}</el-tag>
          </div>
        </div>
      </div>

      <!-- 代码预览 -->
      <div class="code-preview">
        <div class="code-header">
          <span class="file-path">{{ currentFile?.filePath }}</span>
          <el-button type="primary" size="small" :icon="DocumentCopy" @click="handleCopy">复制</el-button>
        </div>
        <div class="code-content">
          <pre><code>{{ currentFile?.content }}</code></pre>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="success" :icon="Download" @click="handleDownload">下载代码</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, DocumentCopy, Download } from '@element-plus/icons-vue'
import type { IGenPreview, IGenPreviewItem, IGenConfig } from '@yunshu/shared/types/gen'
import { previewCode, downloadCode } from '@/api/tool/gen.api'

const props = defineProps<{
  modelValue: boolean
  tableName?: string
  config?: IGenConfig
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const visible = ref(false)
const loading = ref(false)
const previewData = ref<IGenPreview | null>(null)

const fileList = computed(() => previewData.value?.files || [])
const currentFile = ref<IGenPreviewItem | null>(null)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.tableName) {
    loadPreviewData()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const loadPreviewData = async () => {
  if (!props.tableName) return

  loading.value = true
  try {
    const config: IGenConfig = {
      tableName: props.tableName,
      tableComment: props.config?.tableComment || '',
      className: props.config?.className || '',
      moduleName: props.config?.moduleName || '',
      packageName: props.config?.packageName || 'com.yunshu.generator',
      author: props.config?.author || '云枢',
      email: props.config?.email,
      generateType: props.config?.generateType || 'single',
      generateMenu: props.config?.generateMenu ?? true,
      generateApi: props.config?.generateApi ?? true,
      generateView: props.config?.generateView ?? true,
      generateTypeScript: props.config?.generateTypeScript ?? true,
    }

    const res = await previewCode(config)
    if (res.success) {
      previewData.value = res.data
      if (fileList.value.length > 0) {
        currentFile.value = fileList.value[0]
      }
    }
  } catch {
    ElMessage.error('加载预览数据失败')
  } finally {
    loading.value = false
  }
}

const handleSelectFile = (file: IGenPreviewItem) => {
  currentFile.value = file
}

const getFileExt = (fileName: string) => {
  const ext = fileName.split('.').pop() || ''
  const extMap: Record<string, string> = {
    java: 'Java',
    ts: 'TypeScript',
    vue: 'Vue',
    sql: 'SQL',
    xml: 'XML',
    yml: 'YAML',
    properties: 'Properties',
  }
  return extMap[ext] || ext.toUpperCase()
}

const handleCopy = async () => {
  if (!currentFile.value?.content) return

  try {
    await navigator.clipboard.writeText(currentFile.value.content)
    ElMessage.success('复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}

const handleDownload = () => {
  if (!props.tableName) return
  downloadCode(props.tableName, props.config)
  ElMessage.success('代码生成已触发，请等待下载')
}

const handleClose = () => {
  visible.value = false
}
</script>

<style lang="scss" scoped>
.preview-dialog {
  .preview-container {
    display: flex;
    height: 60vh;

    .file-list {
      width: 280px;
      border-right: 1px solid #e4e7ed;
      display: flex;
      flex-direction: column;

      .file-list-header {
        padding: 12px 16px;
        background: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;
        font-weight: 500;
      }

      .file-list-content {
        flex: 1;
        overflow-y: auto;
        padding: 8px;

        .file-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 4px;
          margin-bottom: 4px;

          &:hover {
            background: #f5f7fa;
          }

          &.active {
            background: #e6f7ff;
            color: #1890ff;
          }

          .file-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .code-preview {
      flex: 1;
      display: flex;
      flex-direction: column;

      .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;

        .file-path {
          font-family: monospace;
          font-size: 13px;
          color: #666;
        }
      }

      .code-content {
        flex: 1;
        overflow: auto;
        padding: 16px;
        background: #1e1e1e;
        margin: 0;

        pre {
          margin: 0;
          code {
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #d4d4d4;
            white-space: pre;
          }
        }
      }
    }
  }
}
</style>

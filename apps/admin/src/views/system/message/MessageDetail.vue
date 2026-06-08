<template>
  <el-dialog
    v-model="visible"
    title="消息详情"
    width="600px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <div v-loading="loading" class="message-detail">
      <el-descriptions v-if="messageInfo" :column="1" border>
        <el-descriptions-item label="标题">
          <div class="detail-title">
            <el-tag v-if="messageInfo.status === '0'" type="warning" size="small">未读</el-tag>
            {{ messageInfo.title }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="类型">
          <el-tag :type="getTypeTagType(messageInfo.type)">
            {{ getTypeLabel(messageInfo.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityTagType(messageInfo.priority)">
            {{ getPriorityLabel(messageInfo.priority) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发送人">{{ messageInfo.senderName }}</el-descriptions-item>
        <el-descriptions-item label="发送时间">{{ messageInfo.sendTime }}</el-descriptions-item>
        <el-descriptions-item v-if="messageInfo.readTime" label="阅读时间">{{ messageInfo.readTime }}</el-descriptions-item>
        <el-descriptions-item label="消息内容">
          <div class="detail-content">{{ messageInfo.content }}</div>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button v-if="messageInfo && messageInfo.status === '0'" type="primary" @click="handleMarkRead">标为已读</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getMessage, markAsRead, type MessageInfo } from '@/api/system/message.api'

const props = defineProps<{
  modelValue: boolean
  messageId?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'mark-read', messageId: number): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const messageInfo = ref<MessageInfo | null>(null)

async function fetchMessageDetail() {
  if (!props.messageId) return

  loading.value = true
  try {
    messageInfo.value = await getMessage(props.messageId)
  } catch (error) {
    console.error('获取消息详情失败:', error)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  visible.value = false
}

function handleClosed() {
  messageInfo.value = null
}

async function handleMarkRead() {
  if (!props.messageId) return

  try {
    await markAsRead(props.messageId)
    ElMessage.success('标记成功')
    emit('mark-read', props.messageId)
    await fetchMessageDetail()
  } catch (error) {
    console.error('标记失败:', error)
  }
}

watch(() => props.modelValue, (val) => {
  if (val && props.messageId) {
    fetchMessageDetail()
  }
})

function getTypeLabel(type: string) {
  const labels: Record<string, string> = {
    system: '系统消息',
    normal: '普通消息',
    reminder: '提醒消息'
  }
  return labels[type] || type
}

function getTypeTagType(type: string) {
  const types: Record<string, any> = {
    system: 'danger',
    normal: 'info',
    reminder: 'warning'
  }
  return types[type] || ''
}

function getPriorityLabel(priority: string) {
  const labels: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return labels[priority] || priority
}

function getPriorityTagType(priority: string) {
  const types: Record<string, any> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return types[priority] || ''
}
</script>

<style scoped lang="scss">
.message-detail {
  .detail-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  .detail-content {
    min-height: 100px;
    line-height: 1.6;
    white-space: pre-wrap;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

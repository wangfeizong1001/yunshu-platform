<template>
  <el-dialog
    v-model="visible"
    title="公告详情"
    width="700px"
    append-to-body
    @close="handleClose"
  >
    <div v-loading="loading" class="notice-detail">
      <div class="notice-header">
        <h2 class="notice-title">{{ noticeData?.noticeTitle }}</h2>
        <div class="notice-meta">
          <el-tag :type="getNoticeTypeTagType(noticeData?.noticeType)" size="small">
          {{ getNoticeTypeLabel(noticeData?.noticeType) }}
        </el-tag>
        <el-tag :type="getNoticeStatusTagType(noticeData?.status)" size="small">
          {{ getNoticeStatusLabel(noticeData?.status) }}
        </el-tag>
          <span class="create-time">创建时间：{{ noticeData?.createTime }}</span>
        </div>
      </div>
      <el-divider />
      <SafeHtml :html="noticeData?.noticeContent || ''" custom-class="notice-content" />
      <el-divider />
      <div class="notice-footer">
        <span v-if="noticeData?.remark">备注：{{ noticeData?.remark }}</span>
        <span class="create-by">创建者：{{ noticeData?.createBy }}</span>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SafeHtml from '@/components/SafeHtml/index.vue'
import { getNoticeDetail } from '@/api/system/notice.api'
import type { SysNotice } from '@yunshu/shared'

// ========== 状态常量（与后端约定字段值） ==========
const NOTICE_TYPE_NOTIFY = '1'
const NOTICE_STATUS_PUBLISHED = '0'

/** 公告类型 tag 类型 */
const getNoticeTypeTagType = (val?: string) =>
  val === NOTICE_TYPE_NOTIFY ? 'primary' : 'info'

/** 公告类型文本 */
const getNoticeTypeLabel = (val?: string) =>
  val === NOTICE_TYPE_NOTIFY ? '通知' : '公告'

/** 公告状态 tag 类型 */
const getNoticeStatusTagType = (val?: string) =>
  val === NOTICE_STATUS_PUBLISHED ? 'success' : 'warning'

/** 公告状态文本 */
const getNoticeStatusLabel = (val?: string) =>
  val === NOTICE_STATUS_PUBLISHED ? '已发布' : '已撤回'

interface Props {
  modelValue: boolean
  noticeId?: number
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 状态
const loading = ref(false)
const noticeData = ref<SysNotice | null>(null)

// 加载公告详情
async function fetchNoticeDetail() {
  if (!props.noticeId) return

  loading.value = true
  try {
    const res = await getNoticeDetail(props.noticeId) as { data: SysNotice }
    noticeData.value = res.data
  } catch (error) {
    console.error('加载公告详情失败', error)
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
function handleClose() {
  noticeData.value = null
  visible.value = false
}

// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fetchNoticeDetail()
  }
})
</script>

<style scoped lang="scss">
.notice-detail {
  .notice-header {
    margin-bottom: 16px;

    .notice-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .notice-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #909399;
      font-size: 14px;

      .create-time {
        margin-left: auto;
      }
    }
  }

  .notice-content {
    line-height: 1.8;
    min-height: 200px;

    :deep(p) {
      margin: 0 0 16px 0;
    }
  }

  .notice-footer {
    display: flex;
    justify-content: space-between;
    color: #909399;
    font-size: 14px;
  }
}
</style>

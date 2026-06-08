<template>
  <el-dialog
    v-model="visible"
    title="文档预览"
    width="800px"
    append-to-body
    @close="handleClose"
  >
    <div v-loading="loading" class="knowledge-detail">
      <div v-if="knowledgeData" class="detail-content">
        <div class="detail-header">
          <h1 class="detail-title">{{ knowledgeData.title }}</h1>
          <div class="detail-meta">
            <el-tag size="small" type="info">{{ knowledgeData.categoryName }}</el-tag>
            <el-tag
              v-for="(tag, index) in knowledgeData.tags?.split(',') || []"
              :key="index"
              size="small"
              style="margin-right: 4px;"
            >
              {{ tag }}
            </el-tag>
            <el-tag :type="knowledgeData.status === '0' ? 'success' : 'info'" size="small">
              {{ knowledgeData.status === '0' ? '已发布' : '草稿' }}
            </el-tag>
            <span class="meta-item">
              <el-icon><View /></el-icon>
              {{ knowledgeData.viewCount }}
            </span>
            <span class="meta-item">
              <el-icon><User /></el-icon>
              {{ knowledgeData.createBy }}
            </span>
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              {{ knowledgeData.createTime }}
            </span>
          </div>
        </div>

        <el-divider />

        <div v-if="knowledgeData.summary" class="detail-summary">
          <h4>文档摘要</h4>
          <p>{{ knowledgeData.summary }}</p>
        </div>

        <div class="detail-body">
          <div class="content-wrapper" v-html="knowledgeData.content"></div>
        </div>

        <el-divider />

        <div v-if="knowledgeData.remark" class="detail-footer">
          <span class="remark">备注：{{ knowledgeData.remark }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { View, User, Clock } from '@element-plus/icons-vue'
import { getKnowledge, type KnowledgeInfo } from '@/api/system/knowledge.api'

interface Props {
  modelValue: boolean
  knowledgeId?: number
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 状态
const loading = ref(false)
const knowledgeData = ref<KnowledgeInfo | null>(null)

// 获取文档详情
async function fetchKnowledgeDetail() {
  if (!props.knowledgeId) return

  loading.value = true
  try {
    const res = await getKnowledge(props.knowledgeId)
    knowledgeData.value = res.data || null
  } catch (error) {
    console.error('获取文档详情失败', error)
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
function handleClose() {
  knowledgeData.value = null
  visible.value = false
}

// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fetchKnowledgeDetail()
  }
})
</script>

<style scoped lang="scss">
.knowledge-detail {
  .detail-content {
    .detail-header {
      margin-bottom: 16px;

      .detail-title {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 12px 0;
        color: #303133;
      }

      .detail-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        color: #909399;
        font-size: 14px;

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
      }
    }

    .detail-summary {
      background-color: #f5f7fa;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 24px;

      h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #606266;
      }

      p {
        margin: 0;
        color: #606266;
        line-height: 1.6;
      }
    }

    .detail-body {
      .content-wrapper {
        line-height: 1.8;
        color: #303133;
        font-size: 15px;

        :deep(h1),
        :deep(h2),
        :deep(h3),
        :deep(h4),
        :deep(h5),
        :deep(h6) {
          margin: 20px 0 10px 0;
          font-weight: 600;
          color: #303133;
        }

        :deep(h1) {
          font-size: 22px;
        }

        :deep(h2) {
          font-size: 20px;
        }

        :deep(h3) {
          font-size: 18px;
        }

        :deep(p) {
          margin: 0 0 16px 0;
        }

        :deep(ul),
        :deep(ol) {
          margin: 0 0 16px 20px;
          padding: 0;
        }

        :deep(li) {
          margin: 4px 0;
        }

        :deep(blockquote) {
          border-left: 4px solid #409eff;
          padding: 10px 15px;
          margin: 16px 0;
          background-color: #f0f9ff;
          color: #606266;
        }

        :deep(img) {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }

        :deep(code) {
          background-color: #f5f7fa;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 14px;
          color: #e6a23c;
        }

        :deep(pre) {
          background-color: #2d2d2d;
          padding: 16px;
          border-radius: 4px;
          overflow-x: auto;
          margin: 16px 0;

          code {
            background-color: transparent;
            color: #f8f8f2;
            padding: 0;
          }
        }

        :deep(table) {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;

          th,
          td {
            border: 1px solid #dcdfe6;
            padding: 8px 12px;
            text-align: left;
          }

          th {
            background-color: #f5f7fa;
            font-weight: 600;
          }
        }
      }
    }

    .detail-footer {
      .remark {
        color: #909399;
        font-size: 14px;
      }
    }
  }
}
</style>

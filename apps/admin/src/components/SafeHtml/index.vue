<template>
  <!--
    云枢中台 — 安全 HTML 渲染组件

    使用场景：
      - 渲染富文本编辑器内容（公告、知识库等）
      - 渲染用户提交的任何 HTML 内容

    为什么用本组件而不是直接 v-html：
      1. 默认通过 DOMPurify 深度清洗，防止 XSS 攻击
      2. ESLint 规则禁止裸用 v-html，本组件为唯一例外点
      3. 统一配置安全策略，便于后续集中调整

    示例：
      <SafeHtml :html="notice.content" class="article-body" />
      <SafeHtml :html="knowledge.content" :max-length="500" />
  -->
  <div
    :class="['safe-html-content', customClass]"
    :style="customStyle"
    v-html="sanitizedContent"
  />
</template>

<script setup lang="ts">
/**
 * 安全 HTML 组件 —— 防止 XSS 攻击的富文本渲染
 * @module components/SafeHtml
 */

import { computed } from 'vue'
import { sanitizeHtml, truncateHtml } from '@/utils/security/sanitize'

/**
 * 组件 Props
 */
interface SafeHtmlProps {
  html: string                    // 原始 HTML 内容
  maxLength?: number              // 可选：最大字符长度（超过截断）
  customClass?: string            // 可选：自定义 CSS class
  customStyle?: Record<string, string>  // 可选：自定义内联样式
}

const props = withDefaults(defineProps<SafeHtmlProps>(), {
  maxLength: undefined,
  customClass: '',
  customStyle: () => ({})
})

/**
 * 经过清洗的安全 HTML（计算属性自动响应式）
 */
const sanitizedContent = computed(() => {
  const safe = sanitizeHtml(props.html)
  if (props.maxLength && props.maxLength > 0) {
    return truncateHtml(safe, props.maxLength)
  }
  return safe
})
</script>

<style lang="scss" scoped>
.safe-html-content {
  line-height: 1.7;
  word-break: break-word;

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
  }

  :deep(th), :deep(td) {
    border: 1px solid var(--el-border-color-light);
    padding: 8px 12px;
  }

  :deep(pre) {
    background: var(--el-fill-color-light);
    padding: 12px 16px;
    border-radius: 4px;
    overflow-x: auto;
  }

  :deep(code) {
    background: var(--el-fill-color-lighter);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.9em;
  }

  :deep(blockquote) {
    border-left: 4px solid var(--el-border-color);
    padding-left: 16px;
    color: var(--el-text-color-secondary);
    margin: 12px 0;
  }
}
</style>

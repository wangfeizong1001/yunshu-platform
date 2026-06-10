<!--
  云枢中台 — 安全 HTML 渲染组件

  使用 sanitizeHtml 清洗后再渲染，防御 XSS：
    <SafeHtml :html="richText" />
    <SafeHtml :html="richText" :sanitize-config="{ ALLOWED_TAGS: ['b','i','p'] }" />
--><script setup lang="ts">
import { computed } from 'vue';
import { sanitizeHtml, type SanitizeOptions } from '@/utils/security/sanitize';

interface Props {
  /** 待渲染的 HTML 内容（未经过滤 —— 组件内部会清理） */
  html: string;
  /** 可选的自定义清理规则 */
  sanitizeConfig?: SanitizeOptions;
}

const props = withDefaults(defineProps<Props>(), {
  sanitizeConfig: () => ({}),
});

const safeHtml = computed(() => sanitizeHtml(props.html, props.sanitizeConfig));
</script>

<template>
  <span class="yunshu-safe-html" v-html="safeHtml"></span>
</template>

<style scoped>
.yunshu-safe-html {
  display: contents;
}
</style>

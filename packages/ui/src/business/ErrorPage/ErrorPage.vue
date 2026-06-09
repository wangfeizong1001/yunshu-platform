<script setup lang="ts">
/**
 * YunErrorPage — 通用错误页面组件
 *
 * 沉淀自云枢 ErrorPages 组件体系。
 * 支持 403/404/500 状态码，内置动画和操作引导。
 */
import { computed } from 'vue';
import YunButton from '../../styled/Button/Button.vue';

export interface ErrorPageProps {
  /** HTTP 错误码 */
  code?: 403 | 404 | 500;
  /** 自定义标题 */
  title?: string;
  /** 自定义描述 */
  description?: string;
  /** 是否显示返回首页按钮 */
  showHomeBtn?: boolean;
  /** 首页路径 */
  homePath?: string;
}

const props = withDefaults(defineProps<ErrorPageProps>(), {
  code: 404,
  showHomeBtn: true,
  homePath: '/',
});

const emit = defineEmits<{
  back: [];
}>();

const defaultConfig = computed(() => {
  const configs: Record<number, { title: string; description: string; emoji: string }> = {
    403: {
      title: '访问被拒绝',
      description: '抱歉，您没有权限访问此页面。如需帮助，请联系管理员。',
      emoji: '🔒',
    },
    404: {
      title: '页面未找到',
      description: '您访问的页面不存在或已被移除。请检查链接是否正确。',
      emoji: '🔍',
    },
    500: {
      title: '服务器错误',
      description: '服务器暂时无法处理您的请求，请稍后重试。',
      emoji: '⚠️',
    },
  };
  return configs[props.code] ?? configs[404];
});
</script>

<template>
  <div class="yun-error-page">
    <div class="yun-error-page__icon">{{ defaultConfig.emoji }}</div>
    <div class="yun-error-page__code">{{ code }}</div>
    <h1 class="yun-error-page__title">{{ title || defaultConfig.title }}</h1>
    <p class="yun-error-page__desc">{{ description || defaultConfig.description }}</p>
    <div class="yun-error-page__actions">
      <YunButton v-if="showHomeBtn" variant="primary" @click="emit('back')">
        返回首页
      </YunButton>
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.yun-error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 64px 24px;
  text-align: center;
}

.yun-error-page__icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.yun-error-page__code {
  font-size: 72px;
  font-weight: var(--font-weight-bold);
  color: var(--text-muted);
  opacity: 0.4;
  line-height: 1;
  margin-bottom: 16px;
}

.yun-error-page__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 12px;
}

.yun-error-page__desc {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  max-width: 480px;
  margin: 0 0 32px;
  line-height: var(--line-height-relaxed);
}

.yun-error-page__actions {
  display: flex;
  gap: 12px;
}
</style>

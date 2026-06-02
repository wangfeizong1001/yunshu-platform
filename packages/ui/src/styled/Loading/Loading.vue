<script setup lang="ts">
/**
 * YunLoading — 加载组件
 */

interface Props {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
  size: 'md',
});
</script>

<template>
  <div class="yun-loading" :class="`yun-loading--${size}`">
    <div class="yun-loading__spinner">
      <div class="yun-loading__dot" />
      <div class="yun-loading__dot" />
      <div class="yun-loading__dot" />
    </div>
    <p v-if="text" class="yun-loading__text">{{ text }}</p>
  </div>
</template>

<style scoped>
.yun-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.yun-loading__spinner {
  display: flex;
  gap: 6px;
}

.yun-loading__dot {
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
  animation: yun-loading-bounce 1.4s ease-in-out infinite both;
}

.yun-loading__dot:nth-child(1) { animation-delay: -0.32s; }
.yun-loading__dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes yun-loading-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.yun-loading__text {
  margin-top: 16px;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.yun-loading--sm .yun-loading__dot { width: 6px; height: 6px; }
.yun-loading--lg .yun-loading__dot { width: 14px; height: 14px; }
</style>

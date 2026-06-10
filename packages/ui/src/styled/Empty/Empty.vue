<script setup lang="ts">
  /**
   * YunEmpty — 空状态组件
   */

  interface Props {
    description?: string;
  }

  withDefaults(defineProps<Props>(), {
    description: '暂无数据',
  });
</script>

<template>
  <div class="yun-empty">
    <div class="yun-empty__icon">
      <slot name="image">
        <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
          <rect
            x="16"
            y="20"
            width="48"
            height="40"
            rx="4"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="24"
            y1="32"
            x2="56"
            y2="32"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="24"
            y1="40"
            x2="48"
            y2="40"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="24"
            y1="48"
            x2="40"
            y2="48"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </slot>
    </div>
    <p class="yun-empty__text">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<style scoped>
  .yun-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
  }

  .yun-empty__icon {
    color: var(--text-muted);
    margin-bottom: 16px;
  }

  .yun-empty__text {
    color: var(--text-muted);
    font-size: var(--font-size-base);
    margin: 0 0 16px;
  }
</style>

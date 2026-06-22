<script setup lang="ts">
/**
 * YunButton — 通用按钮组件
 *
 * 支持多种变体（填充/边框/文本）、尺寸、加载状态。
 * 基于 useButton 无头组件 + 设计令牌样式。
 */
import { computed } from 'vue';
import { useButton } from '../../primitives/useButton';
import type { UseButtonProps } from '../../primitives/useButton';

export interface ButtonProps extends UseButtonProps {
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  /** 按钮尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否块级 */
  block?: boolean;
  /** 是否圆角 */
  round?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  round: false,
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();

const { isHovered, isFocused, isPressed, isDisabled, handlers } = useButton(props);

const classes = computed(() => ({
  'yun-btn': true,
  [`yun-btn--${props.variant}`]: true,
  [`yun-btn--${props.size}`]: true,
  'yun-btn--block': props.block,
  'yun-btn--round': props.round,
  'yun-btn--hover': isHovered.value,
  'yun-btn--focus': isFocused.value,
  'yun-btn--active': isPressed.value,
  'yun-btn--disabled': isDisabled.value,
  'yun-btn--loading': props.loading,
}));

function onClick(e: MouseEvent) {
  if (!isDisabled.value) {
    emit('click', e);
  }
}
</script>

<template>
  <button
    :class="classes"
    :disabled="isDisabled"
    v-bind="handlers"
    @click="onClick"
  >
    <span v-if="loading" class="yun-btn__spinner" />
    <span class="yun-btn__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.yun-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  border: 1px solid transparent;
  border-radius: var(--radius-base);
  font-family: inherit;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  cursor: pointer;
  user-select: none;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast),
    box-shadow var(--transition-fast);
  outline: none;
}

/* 尺寸 */
.yun-btn--sm { padding: 4px 12px; font-size: var(--font-size-sm); height: 32px; }
.yun-btn--md { padding: 8px 20px; height: 40px; }
.yun-btn--lg { padding: 12px 24px; font-size: var(--font-size-lg); height: 48px; }

/* 主要 */
.yun-btn--primary {
  background: var(--primary);
  color: #fff;
}
.yun-btn--primary:hover { background: var(--primary-light); }
.yun-btn--primary:active { background: var(--primary-dark); }

/* 次要 */
.yun-btn--secondary {
  background: var(--surface-2);
  color: var(--text-primary);
}
.yun-btn--secondary:hover { background: var(--surface-3); }

/* 边框 */
.yun-btn--outline {
  background: transparent;
  color: var(--primary);
  border-color: var(--primary);
}
.yun-btn--outline:hover { background: var(--primary-alpha-10); }

/* 文本 */
.yun-btn--text {
  background: transparent;
  color: var(--primary);
  border-color: transparent;
}
.yun-btn--text:hover { background: var(--primary-alpha-10); }

/* 危险 */
.yun-btn--danger {
  background: var(--danger);
  color: #fff;
}
.yun-btn--danger:hover { background: var(--error-light); }

/* 状态 */
.yun-btn--block { display: flex; width: 100%; }
.yun-btn--round { border-radius: var(--radius-full); }
.yun-btn--disabled { opacity: 0.5; cursor: not-allowed; }
.yun-btn--loading { cursor: wait; }
.yun-btn--focus { box-shadow: 0 0 0 3px var(--primary-alpha-20); }

/* 旋转图标 */
.yun-btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: yun-spin 0.6s linear infinite;
}

@keyframes yun-spin {
  to { transform: rotate(360deg); }
}
</style>

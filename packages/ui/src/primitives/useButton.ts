/**
 * UI — useButton 无头组件
 *
 * 封装按钮的交互状态管理（hover/active/focus/disabled/loading），
 * 不包含任何样式或 DOM 结构，可在任意框架中复用。
 *
 * @module @yunshu/ui/primitives/useButton
 */

import { ref, computed } from 'vue';

export interface UseButtonProps {
  disabled?: boolean;
  loading?: boolean;
}

export function useButton(props: UseButtonProps = {}) {
  const isHovered = ref(false);
  const isFocused = ref(false);
  const isPressed = ref(false);

  const isDisabled = computed(() => props.disabled || props.loading);

  function onPointerEnter() { isHovered.value = true; }
  function onPointerLeave() { isHovered.value = false; isPressed.value = false; }
  function onFocus() { isFocused.value = true; }
  function onBlur() { isFocused.value = false; }
  function onPointerDown() { isPressed.value = true; }
  function onPointerUp() { isPressed.value = false; }

  return {
    isHovered,
    isFocused,
    isPressed,
    isDisabled,
    handlers: {
      onPointerenter: onPointerEnter,
      onPointerleave: onPointerLeave,
      onFocus: onFocus,
      onBlur: onBlur,
      onPointerdown: onPointerDown,
      onPointerup: onPointerUp,
    },
  };
}

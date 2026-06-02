/**
 * UI — useInput 无头组件
 *
 * 封装输入框的通用逻辑：值管理、焦点状态、校验反馈。
 *
 * @module @yunshu/ui/primitives/useInput
 */

import { ref, computed } from 'vue';

export interface UseInputProps {
  modelValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  error?: string;
}

export function useInput(props: UseInputProps = {}) {
  const isFocused = ref(false);
  const isDirty = ref(false);

  const hasError = computed(() => !!props.error);
  const isValid = computed(() => isDirty.value && !props.error);

  function onFocus() { isFocused.value = true; }
  function onBlur() { isFocused.value = false; isDirty.value = true; }

  return {
    isFocused,
    isDirty,
    hasError,
    isValid,
    handlers: {
      onFocus,
      onBlur,
    },
  };
}

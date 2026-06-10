<script setup lang="ts">
  /**
   * YunInput — 通用输入组件
   *
   * 支持前缀/后缀图标、错误状态、清除按钮。
   */

  import { computed, ref } from 'vue';
  import { useInput } from '../../primitives/useInput';

  export interface InputProps {
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    type?: string;
    error?: string;
    clearable?: boolean;
    prefixIcon?: string;
    suffixIcon?: string;
  }

  const props = withDefaults(defineProps<InputProps>(), {
    type: 'text',
    clearable: false,
  });

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    focus: [e: FocusEvent];
    blur: [e: FocusEvent];
    clear: [];
  }>();

  const { isFocused, hasError, handlers } = useInput(props);
  const inputRef = ref<HTMLInputElement>();

  const classes = computed(() => ({
    'yun-input-wrapper': true,
    'yun-input--focused': isFocused.value,
    'yun-input--error': hasError.value,
    'yun-input--disabled': props.disabled,
  }));

  function onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    emit('update:modelValue', target.value);
  }

  function onClear() {
    emit('update:modelValue', '');
    emit('clear');
    inputRef.value?.focus();
  }

  function onFocus(e: FocusEvent) {
    handlers.onFocus();
    emit('focus', e);
  }

  function onBlur(e: FocusEvent) {
    handlers.onBlur();
    emit('blur', e);
  }
</script>

<template>
  <div :class="classes">
    <span v-if="prefixIcon" class="yun-input__prefix">
      <slot name="prefix">
        <i :class="prefixIcon" />
      </slot>
    </span>

    <input
      ref="inputRef"
      class="yun-input"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />

    <span v-if="clearable && modelValue" class="yun-input__clear" @click="onClear"> ✕ </span>

    <span v-if="suffixIcon" class="yun-input__suffix">
      <i :class="suffixIcon" />
    </span>
  </div>
  <p v-if="error" class="yun-input__error">{{ error }}</p>
</template>

<style scoped>
  .yun-input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: var(--radius-base);
    background: var(--surface-1);
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);
  }
  .yun-input--focused {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-alpha-10);
  }
  .yun-input--error {
    border-color: var(--danger);
  }
  .yun-input--disabled {
    opacity: 0.5;
    background: var(--surface-2);
  }

  .yun-input {
    flex: 1;
    padding: 8px 12px;
    border: none;
    background: transparent;
    color: var(--text-primary);
    font-size: var(--font-size-base);
    outline: none;
    width: 100%;
  }
  .yun-input::placeholder {
    color: var(--text-muted);
  }
  .yun-input:disabled {
    cursor: not-allowed;
  }

  .yun-input__prefix,
  .yun-input__suffix {
    padding: 0 8px;
    color: var(--text-muted);
  }

  .yun-input__clear {
    padding: 0 8px;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 14px;
  }
  .yun-input__clear:hover {
    color: var(--text-secondary);
  }

  .yun-input__error {
    margin-top: 4px;
    font-size: var(--font-size-sm);
    color: var(--danger);
  }
</style>

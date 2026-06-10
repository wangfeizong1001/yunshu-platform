<script setup lang="ts">
  /**
   * YunDialog — 通用弹窗组件
   *
   * 支持标题、内容、底部操作区、自定义宽度。
   */

  import { computed } from 'vue';
  import { useDialog } from '../../primitives/useDialog';

  export interface DialogProps {
    open?: boolean;
    title?: string;
    width?: string;
    closeOnEsc?: boolean;
    closeOnOverlay?: boolean;
    showClose?: boolean;
  }

  const props = withDefaults(defineProps<DialogProps>(), {
    width: '520px',
    closeOnEsc: true,
    closeOnOverlay: false,
    showClose: true,
  });

  const emit = defineEmits<{
    'update:open': [value: boolean];
    close: [];
    open: [];
  }>();

  const { isOpen, isClosing, closeDialog, openDialog } = useDialog({
    open: props.open,
    closeOnEsc: props.closeOnEsc,
  });

  function onClose() {
    closeDialog();
    setTimeout(() => {
      emit('update:open', false);
      emit('close');
    }, 200);
  }

  function onOverlayClick() {
    if (props.closeOnOverlay) onClose();
  }
</script>

<template>
  <Teleport to="body">
    <Transition name="yun-dialog">
      <div
        v-if="isOpen"
        class="yun-dialog-overlay"
        :class="{ 'is-closing': isClosing }"
        @click="onOverlayClick"
      >
        <div class="yun-dialog" :style="{ width }" @click.stop>
          <!-- 头部 -->
          <div v-if="title || showClose" class="yun-dialog__header">
            <h3 class="yun-dialog__title">{{ title }}</h3>
            <button v-if="showClose" class="yun-dialog__close" @click="onClose">✕</button>
          </div>

          <!-- 内容 -->
          <div class="yun-dialog__body">
            <slot />
          </div>

          <!-- 底部操作 -->
          <div v-if="$slots.footer" class="yun-dialog__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .yun-dialog-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--overlay);
    z-index: var(--z-modal);
  }

  .yun-dialog {
    background: var(--surface-1);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }

  .yun-dialog__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 0;
  }

  .yun-dialog__title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin: 0;
  }

  .yun-dialog__close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--text-muted);
    padding: 4px;
    border-radius: var(--radius-sm);
  }
  .yun-dialog__close:hover {
    background: var(--surface-2);
    color: var(--text-primary);
  }

  .yun-dialog__body {
    padding: 24px;
    overflow-y: auto;
    color: var(--text-secondary);
  }

  .yun-dialog__footer {
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    border-top: 1px solid var(--divider);
  }

  /* 过渡动画 */
  .yun-dialog-enter-active {
    transition: opacity var(--transition-normal);
  }
  .yun-dialog-enter-active .yun-dialog {
    transition: transform var(--transition-normal);
  }
  .yun-dialog-leave-active {
    transition: opacity var(--transition-normal);
  }
  .yun-dialog-leave-active .yun-dialog {
    transition: transform var(--transition-normal);
  }
  .yun-dialog-enter-from {
    opacity: 0;
  }
  .yun-dialog-enter-from .yun-dialog {
    transform: scale(0.95) translateY(-10px);
  }
  .yun-dialog-leave-to {
    opacity: 0;
  }
  .yun-dialog-leave-to .yun-dialog {
    transform: scale(0.95) translateY(-10px);
  }
</style>

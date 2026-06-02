/**
 * UI — useDialog 无头组件
 *
 * 封装弹窗/模态框的打开关闭状态管理和键盘可访问性。
 *
 * @module @yunshu/ui/primitives/useDialog
 */

import { ref, onMounted, onUnmounted } from 'vue';

export interface UseDialogProps {
  /** 初始是否打开 */
  open?: boolean;
  /** 是否在 ESC 时关闭 */
  closeOnEsc?: boolean;
  /** 是否在点击背景时关闭 */
  closeOnOverlay?: boolean;
}

export function useDialog(props: UseDialogProps = {}) {
  const { open = false, closeOnEsc = true } = props;

  const isOpen = ref(open);
  const isClosing = ref(false);

  function openDialog() {
    isOpen.value = true;
    isClosing.value = false;
  }

  function closeDialog() {
    isClosing.value = true;
    // 等待关闭动画完成
    setTimeout(() => {
      isOpen.value = false;
      isClosing.value = false;
    }, 200);
  }

  function toggleDialog() {
    if (isOpen.value) closeDialog();
    else openDialog();
  }

  /** ESC 键处理 */
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && closeOnEsc && isOpen.value) {
      closeDialog();
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });

  return { isOpen, isClosing, openDialog, closeDialog, toggleDialog };
}

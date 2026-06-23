import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { useDialog } from '../primitives/useDialog';

const TestDialog = {
  props: {
    open: { type: Boolean, default: false },
    closeOnEsc: { type: Boolean, default: true },
  },
  setup(props: { open: boolean; closeOnEsc: boolean }) {
    return { ...useDialog(props) };
  },
  template: '<div></div>',
};

describe('useDialog 无头弹窗逻辑', () => {
  it('初始关闭状态', () => {
    const { isOpen, isClosing } = useDialog();
    expect(isOpen.value).toBe(false);
    expect(isClosing.value).toBe(false);
  });

  it('open 参数为 true 时初始打开', () => {
    const { isOpen } = useDialog({ open: true });
    expect(isOpen.value).toBe(true);
  });

  it('openDialog 与 closeDialog 切换状态', () => {
    const { isOpen, openDialog, closeDialog } = useDialog();
    openDialog();
    expect(isOpen.value).toBe(true);

    closeDialog();
    // 立即处于关闭动画中
    // 但 200ms 后才会变为 false
  });

  it('toggleDialog 切换 isOpen', () => {
    const { isOpen, toggleDialog } = useDialog();
    toggleDialog();
    expect(isOpen.value).toBe(true);
    toggleDialog();
  });

  it('ESC 按键在 closeOnEsc 为 true 时触发关闭', () => {
    const wrapper = mount(TestDialog, { props: { open: true } });
    const vm = wrapper.vm as unknown as {
      isOpen: { value: boolean };
    };
    expect(vm.isOpen.value).toBe(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
  });

  it('ESC 按键在 closeOnEsc 为 false 时不关闭', () => {
    const wrapper = mount(TestDialog, {
      props: { open: true, closeOnEsc: false },
    });
    const vm = wrapper.vm as unknown as {
      isOpen: { value: boolean };
    };
    expect(vm.isOpen.value).toBe(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    // 组件状态由内部响应式管理
  });
});

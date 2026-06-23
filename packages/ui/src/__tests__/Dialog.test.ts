import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Dialog from '../styled/Dialog/Dialog.vue';

describe('Dialog 弹窗组件', () => {
  it('默认显示标题和关闭按钮', async () => {
    const wrapper = mount(Dialog, {
      props: { open: true, title: '提示' },
      attachTo: document.body,
    });
    expect(wrapper.text()).toContain('提示');
    expect(wrapper.find('.yun-dialog__close').exists()).toBe(true);
    wrapper.unmount();
  });

  it('showClose=false 时不显示关闭按钮', () => {
    const wrapper = mount(Dialog, {
      props: { open: true, showClose: false },
      attachTo: document.body,
    });
    expect(wrapper.find('.yun-dialog__close').exists()).toBe(false);
    wrapper.unmount();
  });

  it('slot 默认内容渲染', () => {
    const wrapper = mount(Dialog, {
      props: { open: true },
      slots: { default: 'body text' },
      attachTo: document.body,
    });
    expect(wrapper.text()).toContain('body text');
    wrapper.unmount();
  });

  it('footer slot 渲染', () => {
    const wrapper = mount(Dialog, {
      props: { open: true },
      slots: { footer: 'footer text' },
      attachTo: document.body,
    });
    expect(wrapper.find('.yun-dialog__footer').exists()).toBe(true);
    wrapper.unmount();
  });
});

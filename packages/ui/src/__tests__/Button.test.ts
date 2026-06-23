import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '../styled/Button/Button.vue';

describe('Button 按钮组件', () => {
  it('能够渲染默认 slot', () => {
    const wrapper = mount(Button, { slots: { default: '确认' } });
    expect(wrapper.text()).toContain('确认');
  });

  it('默认 variant 为 primary', () => {
    const wrapper = mount(Button);
    expect(wrapper.classes()).toContain('yun-btn--primary');
  });

  it('支持 variant=outline/text/danger', () => {
    for (const variant of ['outline', 'text', 'danger', 'secondary'] as const) {
      const wrapper = mount(Button, { props: { variant } });
      expect(wrapper.classes()).toContain(`yun-btn--${variant}`);
    }
  });

  it('size 能够切换尺寸类', () => {
    const wrapper = mount(Button, { props: { size: 'lg' } });
    expect(wrapper.classes()).toContain('yun-btn--lg');
  });

  it('block 和 round 类能够切换', () => {
    const wrapper = mount(Button, { props: { block: true, round: true } });
    expect(wrapper.classes()).toContain('yun-btn--block');
    expect(wrapper.classes()).toContain('yun-btn--round');
  });

  it('disabled 时不触发 click 事件', async () => {
    const wrapper = mount(Button, { props: { disabled: true } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('正常点击会触发 click 事件', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('loading 时显示 spinner 并禁用按钮', () => {
    const wrapper = mount(Button, { props: { loading: true } });
    expect(wrapper.classes()).toContain('yun-btn--loading');
    expect(wrapper.find('.yun-btn__spinner').exists()).toBe(true);
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Loading from '../styled/Loading/Loading.vue';

describe('Loading 加载组件', () => {
  it('默认显示 加载中... 文本', () => {
    const wrapper = mount(Loading);
    expect(wrapper.text()).toContain('加载中...');
  });

  it('支持自定义文本', () => {
    const wrapper = mount(Loading, { props: { text: '正在处理...' } });
    expect(wrapper.text()).toContain('正在处理...');
  });

  it('渲染 spinner 点元素', () => {
    const wrapper = mount(Loading);
    expect(wrapper.find('.yun-loading__spinner').exists()).toBe(true);
    expect(wrapper.findAll('.yun-loading__dot')).toHaveLength(3);
  });

  it('size=sm 具有对应尺寸类', () => {
    const wrapper = mount(Loading, { props: { size: 'sm' } });
    expect(wrapper.classes()).toContain('yun-loading--sm');
  });
});

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Empty from '../styled/Empty/Empty.vue';

describe('Empty 空状态组件', () => {
  it('默认渲染暂无数据描述', () => {
    const wrapper = mount(Empty);
    expect(wrapper.text()).toContain('暂无数据');
  });

  it('支持自定义 description', () => {
    const wrapper = mount(Empty, { props: { description: '没有内容' } });
    expect(wrapper.text()).toContain('没有内容');
  });

  it('支持自定义 image slot', () => {
    const wrapper = mount(Empty, {
      slots: { image: '<span class="custom-image">image</span>' },
    });
    expect(wrapper.find('.custom-image').exists()).toBe(true);
  });

  it('支持自定义 action slot', () => {
    const wrapper = mount(Empty, {
      slots: { action: '<button>刷新</button>' },
    });
    expect(wrapper.find('button').exists()).toBe(true);
  });
});

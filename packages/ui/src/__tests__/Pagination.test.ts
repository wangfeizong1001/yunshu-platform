import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from '../styled/Pagination/Pagination.vue';

describe('Pagination 分页组件', () => {
  it('渲染所有页码按钮', () => {
    const wrapper = mount(Pagination, { props: { current: 1, total: 5 } });
    const buttons = wrapper.findAll('.yun-pagination__btn');
    expect(buttons.length).toBeGreaterThanOrEqual(5);
  });

  it('点击非当前页触发 change 事件', async () => {
    const wrapper = mount(Pagination, { props: { current: 1, total: 5 } });
    await wrapper.findAll('.yun-pagination__btn')[1].trigger('click');
    expect(wrapper.emitted('change')).toBeTruthy();
  });

  it('当前页按钮具有激活样式', () => {
    const wrapper = mount(Pagination, { props: { current: 3, total: 5 } });
    expect(wrapper.find('.is-active').exists()).toBe(true);
  });
});

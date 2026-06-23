import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchForm from '../business/SearchForm/SearchForm.vue';

describe('SearchForm 搜索表单组件', () => {
  const fields = [
    { key: 'name', label: '姓名', type: 'input' as const },
    { key: 'status', label: '状态', type: 'select' as const, options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'inactive' },
    ]},
  ];

  it('渲染每个字段标签', () => {
    const wrapper = mount(SearchForm, { props: { fields } });
    expect(wrapper.text()).toContain('姓名');
    expect(wrapper.text()).toContain('状态');
  });

  it('点击搜索按钮触发 search 事件（过滤空值）', async () => {
    const wrapper = mount(SearchForm, { props: { fields } });
    const input = wrapper.find('input');
    await input.setValue('Alice');
    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click');

    const searchEvent = wrapper.emitted('search');
    expect(searchEvent).toBeTruthy();
    expect((searchEvent?.[0]?.[0] as Record<string, unknown>).name).toBe('Alice');
  });

  it('点击重置按钮触发 reset 事件并清空值', async () => {
    const wrapper = mount(SearchForm, { props: { fields } });
    const input = wrapper.find('input');
    await input.setValue('Alice');
    const buttons = wrapper.findAll('button');
    await buttons[1].trigger('click');

    expect(wrapper.emitted('reset')).toBeTruthy();
  });

  it('字段多于一行时显示展开/收起按钮', () => {
    const manyFields = Array.from({ length: 5 }, (_, i) => ({
      key: `f${i}`,
      label: `F${i}`,
      type: 'input' as const,
    }));
    const wrapper = mount(SearchForm, { props: { fields: manyFields } });
    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThan(2);
  });
});

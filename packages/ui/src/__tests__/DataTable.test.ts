import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DataTable from '../business/DataTable/DataTable.vue';

describe('DataTable 表格组件', () => {
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '名称', sortable: true },
  ];

  it('挂载后会调用 fetchFn 并渲染数据', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      list: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
      total: 2,
    });

    const wrapper = mount(DataTable, {
      props: { columns, fetchFn, pageSize: 10 },
    });

    await flushPromises();
    expect(fetchFn).toHaveBeenCalled();
    expect(wrapper.text()).toContain('Alice');
    expect(wrapper.text()).toContain('Bob');
  });

  it('点击排序的列会触发重新加载', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ list: [], total: 0 });
    const wrapper = mount(DataTable, {
      props: { columns, fetchFn },
    });
    await flushPromises();
    fetchFn.mockClear();

    const ths = wrapper.findAll('th');
    await ths[1].trigger('click');
    await flushPromises();
    expect(fetchFn).toHaveBeenCalled();
  });

  it('fetchFn 返回空时显示空状态', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ list: [], total: 0 });
    const wrapper = mount(DataTable, {
      props: { columns, fetchFn },
    });
    await flushPromises();
    expect(wrapper.find('.yun-empty').exists()).toBe(true);
  });
});

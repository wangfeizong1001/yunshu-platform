import { describe, it, expect, vi } from 'vitest';
import { useTable } from '../composables/useTable';

describe('useTable 表格管理组合式函数', () => {
  it('初始化时返回默认状态', () => {
    const fetchFn = vi.fn().mockResolvedValue({ list: [], total: 0 });
    const table = useTable({ fetchFn });

    expect(table.data.value).toEqual([]);
    expect(table.total.value).toBe(0);
    expect(table.loading.value).toBe(false);
    expect(table.error.value).toBeNull();
    expect(table.page.value).toBe(1);
    expect(table.pageSize.value).toBe(10);
    expect(table.sortField.value).toBe('createdAt');
    expect(table.sortOrder.value).toBe('desc');
    expect(table.selectedRows.value).toEqual([]);
  });

  it('支持自定义默认分页大小和排序', () => {
    const fetchFn = vi.fn().mockResolvedValue({ list: [], total: 0 });
    const table = useTable({
      fetchFn,
      defaultPageSize: 20,
      defaultSort: { field: 'name', order: 'asc' },
    });

    expect(table.pageSize.value).toBe(20);
    expect(table.sortField.value).toBe('name');
    expect(table.sortOrder.value).toBe('asc');
  });

  it('loadData 正常调用 fetchFn 并更新数据', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      list: [{ id: 1, name: 'A' }],
      total: 1,
    });
    const table = useTable({ fetchFn });

    await table.loadData();

    expect(fetchFn).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: 'desc',
    });
    expect(table.data.value).toHaveLength(1);
    expect(table.total.value).toBe(1);
    expect(table.loading.value).toBe(false);
  });

  it('totalPages 计算正确', () => {
    const fetchFn = vi.fn().mockResolvedValue({ list: [], total: 0 });
    const table = useTable({ fetchFn, defaultPageSize: 10 });

    table.total.value = 25;
    expect(table.totalPages.value).toBe(3);

    table.total.value = 0;
    expect(table.totalPages.value).toBe(1);
  });

  it('hasMore 反映是否有更多数据', () => {
    const fetchFn = vi.fn().mockResolvedValue({ list: [], total: 0 });
    const table = useTable({ fetchFn, defaultPageSize: 10 });

    table.total.value = 25;
    table.page.value = 1;
    expect(table.hasMore.value).toBe(true);

    table.page.value = 3;
    expect(table.hasMore.value).toBe(false);
  });

  it('setPage 切换页码并加载数据', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ list: [], total: 0 });
    const table = useTable({ fetchFn });

    table.setPage(3);
    expect(table.page.value).toBe(3);
    // 等待下一个 tick 让 async loadData 执行
    await Promise.resolve();
    await new Promise((r) => setTimeout(r, 0));
    expect(fetchFn).toHaveBeenCalled();
  });

  it('setSort 相同字段切换排序方向，不同字段重置为 desc', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ list: [], total: 0 });
    const table = useTable({ fetchFn });

    table.setSort('name');
    expect(table.sortField.value).toBe('name');
    expect(table.sortOrder.value).toBe('desc');

    table.setSort('name');
    expect(table.sortOrder.value).toBe('asc');

    table.setSort('createdAt');
    expect(table.sortField.value).toBe('createdAt');
    expect(table.sortOrder.value).toBe('desc');
  });

  it('onSelectionChange 更新 selectedRows', () => {
    const fetchFn = vi.fn().mockResolvedValue({ list: [], total: 0 });
    const table = useTable({ fetchFn });
    const rows = [{ id: 1 }, { id: 2 }];

    table.onSelectionChange(rows);
    expect(table.selectedRows.value).toEqual(rows);
  });

  it('refresh 重置页码为 1 并加载数据', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ list: [], total: 0 });
    const table = useTable({ fetchFn });

    table.page.value = 5;
    await table.refresh();

    expect(table.page.value).toBe(1);
    expect(fetchFn).toHaveBeenCalled();
  });

  it('fetchFn 失败时设置 error 并关闭 loading', async () => {
    const err = new Error('network error');
    const fetchFn = vi.fn().mockRejectedValue(err);
    const table = useTable({ fetchFn });

    await table.loadData();

    expect(table.error.value).toBe(err);
    expect(table.loading.value).toBe(false);
  });

  it('非 Error 类型的失败被包装为 Error 对象', async () => {
    const fetchFn = vi.fn().mockRejectedValue('string error');
    const table = useTable({ fetchFn });

    await table.loadData();

    expect(table.error.value).toBeInstanceOf(Error);
    expect(table.error.value?.message).toBe('string error');
  });
});

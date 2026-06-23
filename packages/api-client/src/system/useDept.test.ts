/**
 * useDept.test.ts — 单元测试
 */

import { describe, it, expect } from 'vitest';
import { setupSystemTest } from './_testUtils';
import { useDeptList } from './useDept';

describe('useDept', () => {
  const ctx = setupSystemTest();

  it('useDeptList：fetchTree 发起 /api/system/dept/tree', async () => {
    ctx.setResponse([{ id: 1, name: '总部' }]);
    const { tree, fetchTree } = useDeptList({ immediate: false });
    await fetchTree();
    expect(tree.value).toEqual([{ id: 1, name: '总部' }]);
    expect(ctx.calls[0].input as string).toContain('/api/system/dept/tree');
  });

  it('useDeptList：fetchDetail 发起 /api/system/dept/{id}', async () => {
    ctx.setResponse({ id: 2, name: '研发部' });
    const { fetchDetail } = useDeptList({ immediate: false });
    const result = await fetchDetail(2);
    expect(result).toEqual({ id: 2, name: '研发部' });
    expect(ctx.calls[0].input as string).toContain('/api/system/dept/2');
  });

  it('useDeptList：create POST', async () => {
    ctx.setResponse({ id: 3, name: '新部门' });
    const { create } = useDeptList({ immediate: false });
    const result = await create({ name: '新部门' } as unknown as Parameters<typeof create>[0]);
    expect(result).toEqual({ id: 3, name: '新部门' });
    expect((ctx.calls[0].init as RequestInit).method).toBe('POST');
  });

  it('useDeptList：update PUT', async () => {
    ctx.setResponse({ id: 3, name: '改' });
    const { update } = useDeptList({ immediate: false });
    await update(3, { name: '改' } as unknown as Parameters<typeof update>[1]);
    expect((ctx.calls[0].init as RequestInit).method).toBe('PUT');
    expect(ctx.calls[0].input as string).toContain('/api/system/dept/3');
  });

  it('useDeptList：delete DELETE', async () => {
    ctx.setResponse(null);
    const { delete: del } = useDeptList({ immediate: false });
    await del(5);
    expect((ctx.calls[0].init as RequestInit).method).toBe('DELETE');
  });

  it('useDeptList：getDeptTreeSelect 发起 /treeSelect', async () => {
    ctx.setResponse([{ id: 100, name: 'A' }]);
    const { getDeptTreeSelect } = useDeptList({ immediate: false });
    const res = await getDeptTreeSelect();
    expect(res).toEqual([{ id: 100, name: 'A' }]);
    expect(ctx.calls[0].input as string).toContain('/api/system/dept/treeSelect');
  });

  it('useDeptList：getDeptTreeSelectIncludeDisabled 带 includeDisabled', async () => {
    ctx.setResponse([{ id: 200, name: '禁用' }]);
    const { getDeptTreeSelectIncludeDisabled } = useDeptList({ immediate: false });
    await getDeptTreeSelectIncludeDisabled();
    const input = ctx.calls[0].input as string;
    expect(input).toContain('/api/system/dept/treeSelect');
    expect(input).toContain('includeDisabled');
  });
});

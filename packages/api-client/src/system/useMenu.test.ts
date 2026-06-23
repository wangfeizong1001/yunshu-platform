/**
 * useMenu.test.ts — 单元测试
 */

import { describe, it, expect } from 'vitest';
import { setupSystemTest } from './_testUtils';
import { useMenuList } from './useMenu';

describe('useMenu', () => {
  const ctx = setupSystemTest();

  it('useMenuList：fetchTree 发起 /api/system/menu/tree', async () => {
    ctx.setResponse([{ id: 1, name: '首页' }]);
    const { tree, fetchTree } = useMenuList({ immediate: false });
    await fetchTree();
    expect(tree.value).toEqual([{ id: 1, name: '首页' }]);
    expect(ctx.calls[0].input as string).toContain('/api/system/menu/tree');
  });

  it('useMenuList：fetchDetail 发起 /api/system/menu/{id}', async () => {
    ctx.setResponse({ id: 7, name: '设置' });
    const { fetchDetail } = useMenuList({ immediate: false });
    const result = await fetchDetail(7);
    expect(result).toEqual({ id: 7, name: '设置' });
    expect(ctx.calls[0].input as string).toContain('/api/system/menu/7');
  });

  it('useMenuList：create 发起 POST /api/system/menu/', async () => {
    ctx.setResponse({ id: 3, name: '新建' });
    const { create } = useMenuList({ immediate: false });
    const res = await create({ name: '新建' } as unknown as Parameters<typeof create>[0]);
    expect(res).toEqual({ id: 3, name: '新建' });
    expect((ctx.calls[0].init as RequestInit).method).toBe('POST');
  });

  it('useMenuList：update 发起 PUT /api/system/menu/{id}', async () => {
    ctx.setResponse({ id: 3, name: '更新' });
    const { update } = useMenuList({ immediate: false });
    await update(3, { name: '更新' } as unknown as Parameters<typeof update>[1]);
    expect((ctx.calls[0].init as RequestInit).method).toBe('PUT');
    expect(ctx.calls[0].input as string).toContain('/api/system/menu/3');
  });

  it('useMenuList：delete 发起 DELETE /api/system/menu/{id}', async () => {
    ctx.setResponse(null);
    const { delete: del } = useMenuList({ immediate: false });
    await del(5);
    expect((ctx.calls[0].init as RequestInit).method).toBe('DELETE');
    expect(ctx.calls[0].input as string).toContain('/api/system/menu/5');
  });

  it('useMenuList：getMenuTreeSelect 发起 /treeSelect', async () => {
    ctx.setResponse([{ id: 1, name: '根' }]);
    const { getMenuTreeSelect } = useMenuList({ immediate: false });
    const result = await getMenuTreeSelect();
    expect(result).toEqual([{ id: 1, name: '根' }]);
    expect(ctx.calls[0].input as string).toContain('/api/system/menu/treeSelect');
  });

  it('useMenuList：getRoleMenuTree 发起 /api/system/menu/role/{id}/menus', async () => {
    ctx.setResponse([{ id: 10 }]);
    const { getRoleMenuTree } = useMenuList({ immediate: false });
    const result = await getRoleMenuTree(2);
    expect(result).toEqual([{ id: 10 }]);
    expect(ctx.calls[0].input as string).toContain('/api/system/menu/role/2/menus');
  });
});

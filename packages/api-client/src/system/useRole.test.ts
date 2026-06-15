/**
 * useRole.test.ts — 单元测试
 */

import { describe, it, expect } from 'vitest';
import { setupSystemTest } from './_testUtils';
import {
  useRoleList,
  useRoleDetail,
  useRoleForm,
  useRolePermission,
} from './useRole';

describe('useRole', () => {
  const ctx = setupSystemTest();

  it('useRoleList：fetchList 发起 GET /api/system/role/list', async () => {
    ctx.setResponse({
      rows: [
        { id: 1, name: 'admin' },
        { id: 2, name: 'guest' },
      ],
      total: 2,
    });
    const { list, total, fetchList } = useRoleList({ immediate: false });
    await fetchList();
    expect(list.value).toEqual([
      { id: 1, name: 'admin' },
      { id: 2, name: 'guest' },
    ]);
    expect(total.value).toBe(2);
    expect(ctx.calls[0].input as string).toContain('/api/system/role/list');
  });

  it('useRoleList：resetParams 重置为默认值', () => {
    const { queryParams, resetParams } = useRoleList({ immediate: false });
    queryParams.value = { pageNum: 9, pageSize: 99 } as unknown as typeof queryParams.value;
    resetParams();
    expect(queryParams.value.pageNum).toBe(1);
    expect(queryParams.value.pageSize).toBe(10);
  });

  it('useRoleDetail：fetchDetail 发起 GET /api/system/role/{id}', async () => {
    ctx.setResponse({ id: 1, name: 'admin' });
    const { data, fetchDetail } = useRoleDetail();
    await fetchDetail(1);
    expect(data.value).toEqual({ id: 1, name: 'admin' });
    expect(ctx.calls[0].input as string).toContain('/api/system/role/1');
  });

  it('useRoleForm：create POST', async () => {
    ctx.setResponse({ id: 1, name: 'new' });
    const { create } = useRoleForm();
    const res = await create({ name: 'new' } as unknown as Parameters<typeof create>[0]);
    expect(res).toEqual({ id: 1, name: 'new' });
    expect((ctx.calls[0].init as RequestInit).method).toBe('POST');
    expect(ctx.calls[0].input as string).toContain('/api/system/role/');
  });

  it('useRoleForm：update PUT', async () => {
    ctx.setResponse({ id: 1, name: 'u' });
    const { update } = useRoleForm();
    await update(1, { name: 'u' } as unknown as Parameters<typeof update>[1]);
    const init = ctx.calls[0].init as RequestInit;
    expect(init.method).toBe('PUT');
    expect(ctx.calls[0].input as string).toContain('/api/system/role/1');
  });

  it('useRoleForm：delete DELETE', async () => {
    ctx.setResponse(null);
    const { delete: del } = useRoleForm();
    await del(3);
    expect((ctx.calls[0].init as RequestInit).method).toBe('DELETE');
    expect(ctx.calls[0].input as string).toContain('/api/system/role/3');
  });

  it('useRoleForm：batchDelete 携带 roleIds', async () => {
    ctx.setResponse(null);
    const { batchDelete } = useRoleForm();
    await batchDelete([1, 2]);
    const body = (ctx.calls[0].init as RequestInit).body as string;
    const parsed = JSON.parse(body) as unknown as { data?: { roleIds?: number[] } };
    expect(parsed.data?.roleIds).toEqual([1, 2]);
  });

  it('useRoleForm：changeStatus PUT /role/{id}/status', async () => {
    ctx.setResponse(null);
    const { changeStatus } = useRoleForm();
    await changeStatus(1, '0');
    expect(ctx.calls[0].input as string).toContain('/api/system/role/1/status');
  });

  it('useRolePermission：getRoleMenus 返回列表', async () => {
    ctx.setResponse([10, 20, 30]);
    const { getRoleMenus } = useRolePermission();
    const result = await getRoleMenus(1);
    expect(result).toEqual([10, 20, 30]);
    expect(ctx.calls[0].input as string).toContain('/api/system/role/1/menus');
  });

  it('useRolePermission：getRoleDataScope 返回对象', async () => {
    ctx.setResponse({ dataScope: 'custom', deptIds: [1, 2] });
    const { getRoleDataScope } = useRolePermission();
    const result = await getRoleDataScope(1);
    expect(result).toEqual({ dataScope: 'custom', deptIds: [1, 2] });
    expect(ctx.calls[0].input as string).toContain('/api/system/role/1/dataScope');
  });

  it('useRolePermission：assignMenus & assignDataScope PUT', async () => {
    ctx.setResponse(null);
    const { assignMenus, assignDataScope } = useRolePermission();

    await assignMenus(1, [10, 20]);
    expect(ctx.calls[0].input as string).toContain('/api/system/role/1/menus');
    expect((ctx.calls[0].init as RequestInit).method).toBe('PUT');

    ctx.setResponse(null); // reset
    await assignDataScope(2, 'custom', [3, 4]);
    expect(ctx.calls[1].input as string).toContain('/api/system/role/2/dataScope');
    const body = (ctx.calls[1].init as RequestInit).body as string;
    expect(body).toContain('dataScope');
    expect(body).toContain('deptIds');
  });
});

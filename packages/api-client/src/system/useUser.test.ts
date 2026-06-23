/**
 * useUser.test.ts — 单元测试
 */

import { describe, it, expect } from 'vitest';
import { setupSystemTest } from './_testUtils';
import {
  useUserList,
  useUserDetail,
  useUserForm,
  useUserImportExport,
} from './useUser';

describe('useUser（系统管理用户 Hook）', () => {
  const ctx = setupSystemTest();

  it('useUserList：fetchList 应发起 GET /api/system/user/list 并填充 list/total', async () => {
    ctx.setResponse({
      rows: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
      total: 2,
    });
    const { list, total, loading, fetchList } = useUserList({ immediate: false });
    await fetchList();
    expect(loading.value).toBe(false);
    expect(list.value).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
    expect(total.value).toBe(2);
    const input = ctx.calls[0].input as string;
    expect(input).toContain('/api/system/user/list');
    const init = ctx.calls[0].init as RequestInit;
    expect(init?.method ?? 'GET').toBe('GET');
  });

  it('useUserList：resetParams 应重置 queryParams 为默认值', () => {
    const { queryParams, resetParams } = useUserList({ immediate: false });
    queryParams.value = { pageNum: 99, pageSize: 999 } as unknown as typeof queryParams.value;
    resetParams();
    expect(queryParams.value.pageNum).toBe(1);
    expect(queryParams.value.pageSize).toBe(10);
  });

  it('useUserDetail：fetchDetail 应发起 GET /api/system/user/{userId}', async () => {
    ctx.setResponse({ id: 3, name: 'Charlie' });
    const { data, fetchDetail } = useUserDetail();
    await fetchDetail(3);
    expect(data.value).toEqual({ id: 3, name: 'Charlie' });
    const input = ctx.calls[0].input as string;
    expect(input).toContain('/api/system/user/3');
  });

  it('useUserForm：create 应 POST /api/system/user/ 并返回结果', async () => {
    ctx.setResponse({ id: 5, name: 'Dan' });
    const { create, submitting } = useUserForm();
    const res = await create({ name: 'Dan' } as unknown as Parameters<typeof create>[0]);
    expect(res).toEqual({ id: 5, name: 'Dan' });
    expect(submitting.value).toBe(false);
    const input = ctx.calls[0].input as string;
    expect(input).toContain('/api/system/user/');
    const init = ctx.calls[0].init as RequestInit;
    expect(init.method).toBe('POST');
  });

  it('useUserForm：update 应 PUT /api/system/user/{userId}', async () => {
    ctx.setResponse({ id: 5, name: 'Danny' });
    const { update } = useUserForm();
    await update(5, { name: 'Danny' } as unknown as Parameters<typeof update>[1]);
    const input = ctx.calls[0].input as string;
    expect(input).toContain('/api/system/user/5');
    const init = ctx.calls[0].init as RequestInit;
    expect(init.method).toBe('PUT');
  });

  it('useUserForm：delete 应 DELETE /api/system/user/{userId}', async () => {
    ctx.setResponse(null);
    const { delete: deleteUser } = useUserForm();
    await deleteUser(7);
    const input = ctx.calls[0].input as string;
    expect(input).toContain('/api/system/user/7');
    const init = ctx.calls[0].init as RequestInit;
    expect(init.method).toBe('DELETE');
  });

  it('useUserForm：batchDelete 应 DELETE /api/system/user/batch 携带 userIds', async () => {
    ctx.setResponse(null);
    const { batchDelete } = useUserForm();
    await batchDelete([1, 2, 3]);
    const init = ctx.calls[0].init as RequestInit;
    expect(init.method).toBe('DELETE');
    const body = init.body as string;
    const parsed = JSON.parse(body) as unknown as { data?: { userIds?: number[] } };
    expect(parsed.data?.userIds).toEqual([1, 2, 3]);
  });

  it('useUserForm：changeStatus 应 PUT /api/system/user/{userId}/status', async () => {
    ctx.setResponse(null);
    const { changeStatus } = useUserForm();
    await changeStatus(9, '0');
    const input = ctx.calls[0].input as string;
    expect(input).toContain('/api/system/user/9/status');
    const init = ctx.calls[0].init as RequestInit;
    expect(init.method).toBe('PUT');
  });

  it('useUserForm：resetPassword 应 PUT /api/system/user/{userId}/password', async () => {
    ctx.setResponse(null);
    const { resetPassword } = useUserForm();
    await resetPassword(11, 'new-secret');
    const input = ctx.calls[0].input as string;
    expect(input).toContain('/api/system/user/11/password');
  });

  it('useUserImportExport：importUsers 应 POST /api/system/user/import 为 FormData', async () => {
    ctx.setResponse(null);
    const { importUsers, importing } = useUserImportExport();
    const fakeFile = new Blob(['csv'], { type: 'text/csv' }) as unknown as File;
    await importUsers(fakeFile);
    expect(importing.value).toBe(false);
    const input = ctx.calls[0].input as string;
    expect(input).toContain('/api/system/user/import');
    const init = ctx.calls[0].init as RequestInit;
    expect(init.method).toBe('POST');
  });

  it('useUserImportExport：exportUsers 是一个函数', () => {
    const { exportUsers } = useUserImportExport();
    expect(typeof exportUsers).toBe('function');
  });
});

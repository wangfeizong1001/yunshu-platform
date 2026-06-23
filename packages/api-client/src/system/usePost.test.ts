/**
 * usePost.test.ts — 单元测试
 */

import { describe, it, expect } from 'vitest';
import { setupSystemTest } from './_testUtils';
import { usePostList } from './usePost';

describe('usePost', () => {
  const ctx = setupSystemTest();

  it('usePostList：fetchList 发起 GET /api/system/post/list', async () => {
    ctx.setResponse({
      rows: [
        { id: 1, name: '主管' },
        { id: 2, name: '员工' },
      ],
      total: 2,
    });
    const { list, total, fetchList } = usePostList({ immediate: false });
    await fetchList();
    expect(list.value).toEqual([
      { id: 1, name: '主管' },
      { id: 2, name: '员工' },
    ]);
    expect(total.value).toBe(2);
    expect(ctx.calls[0].input as string).toContain('/api/system/post/list');
  });

  it('usePostList：resetParams 重置', () => {
    const { queryParams, resetParams } = usePostList({ immediate: false });
    queryParams.value = { pageNum: 10, pageSize: 200 } as unknown as typeof queryParams.value;
    resetParams();
    expect(queryParams.value.pageNum).toBe(1);
    expect(queryParams.value.pageSize).toBe(10);
  });

  it('usePostList：fetchDetail 发起 GET /api/system/post/{id}', async () => {
    ctx.setResponse({ id: 5, name: '测试岗位' });
    const { fetchDetail } = usePostList({ immediate: false });
    const result = await fetchDetail(5);
    expect(result).toEqual({ id: 5, name: '测试岗位' });
    expect(ctx.calls[0].input as string).toContain('/api/system/post/5');
  });

  it('usePostList：create POST', async () => {
    ctx.setResponse({ id: 6, name: '新' });
    const { create } = usePostList({ immediate: false });
    const res = await create({ name: '新' } as unknown as Parameters<typeof create>[0]);
    expect(res).toEqual({ id: 6, name: '新' });
    expect((ctx.calls[0].init as RequestInit).method).toBe('POST');
  });

  it('usePostList：update PUT', async () => {
    ctx.setResponse({ id: 7, name: '改' });
    const { update } = usePostList({ immediate: false });
    await update(7, { name: '改' } as unknown as Parameters<typeof update>[1]);
    expect((ctx.calls[0].init as RequestInit).method).toBe('PUT');
    expect(ctx.calls[0].input as string).toContain('/api/system/post/7');
  });

  it('usePostList：delete DELETE', async () => {
    ctx.setResponse(null);
    const { delete: del } = usePostList({ immediate: false });
    await del(8);
    expect((ctx.calls[0].init as RequestInit).method).toBe('DELETE');
    expect(ctx.calls[0].input as string).toContain('/api/system/post/8');
  });

  it('usePostList：batchDelete 携带 postIds', async () => {
    ctx.setResponse(null);
    const { batchDelete } = usePostList({ immediate: false });
    await batchDelete([1, 2]);
    const body = (ctx.calls[0].init as RequestInit).body as string;
    const parsed = JSON.parse(body) as unknown as { data?: { postIds?: number[] } };
    expect(parsed.data?.postIds).toEqual([1, 2]);
  });

  it('usePostList：changeStatus PUT /post/{id}/status', async () => {
    ctx.setResponse(null);
    const { changeStatus } = usePostList({ immediate: false });
    await changeStatus(1, '1');
    expect(ctx.calls[0].input as string).toContain('/api/system/post/1/status');
  });

  it('usePostList：getPostSelect 发起 /api/system/post/select', async () => {
    ctx.setResponse([{ id: 1, name: 'A' }]);
    const { getPostSelect } = usePostList({ immediate: false });
    const res = await getPostSelect();
    expect(res).toEqual([{ id: 1, name: 'A' }]);
    expect(ctx.calls[0].input as string).toContain('/api/system/post/select');
  });
});

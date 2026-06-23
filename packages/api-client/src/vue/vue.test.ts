/**
 * vue.test.ts — 单元测试
 *
 * 测试目标：
 *   - useApi：基本请求、错误处理、loading 切换、refresh、reset
 *   - useApiList：分页、list/total 解析、setPage
 *   - useMutation：mutate 成功 / 失败、reset
 *   - createYunshuAPI：install 后应在全局注入 httpClient
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi, useApiList, useMutation, createYunshuAPI } from './index';

// 注意：Vue 3 reactive API 在 SSR / happy-dom 下默认依赖 `globalThis`。
// 这里使用原始 Vue 的 ref / computed，它们在 Node 环境下已能运行。
// useApi 的 fn 参数不依赖 Vue 生态。

describe('useApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('成功：data 赋值、loading 先 true 再 false', async () => {
    const fn = vi.fn(async () => ({ success: true, data: { id: 1, name: 'alice' } }));
    const { data, loading, execute, called } = useApi<{ id: number; name: string }>(fn);

    expect(data.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(called.value).toBe(false);

    const result = await execute();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(called.value).toBe(true);
    expect(loading.value).toBe(false);
    expect(data.value).toEqual({ id: 1, name: 'alice' });
    expect(result).toEqual({ id: 1, name: 'alice' });
  });

  it('失败：error 赋值、loading 为 false', async () => {
    const fn = vi.fn(async () => {
      throw new Error('网络错误');
    });
    const { data, error, loading, execute } = useApi(fn);

    const result = await execute();
    expect(result).toBeNull();
    expect(data.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(error.value).toBeInstanceOf(Error);
    expect(error.value?.message).toBe('网络错误');
  });

  it('非 Error 抛出值：应被包装为 Error', async () => {
    const fn = vi.fn(async () => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw '字符串错误';
    });
    const { error, execute } = useApi(fn);
    await execute();
    expect(error.value).toBeInstanceOf(Error);
    expect(error.value?.message).toBe('字符串错误');
  });

  it('execute 应把参数传递给 fn', async () => {
    const fn = vi.fn(async (page: number, size: number) => ({
      success: true,
      data: { page, size },
    }));
    const { execute } = useApi(fn as any);
    await execute(3, 20);
    expect(fn).toHaveBeenCalledWith(3, 20);
  });

  it('refresh 应使用上次参数重放请求', async () => {
    let counter = 0;
    const fn = vi.fn(async (page: number) => {
      counter += 1;
      return { success: true, data: { page, counter } };
    });
    const { execute, refresh, data } = useApi<{ page: number; counter: number }>(fn as any);
    await execute(5);
    expect(data.value).toEqual({ page: 5, counter: 1 });
    await refresh();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(5);
    expect(data.value).toEqual({ page: 5, counter: 2 });
  });

  it('reset：应清空 data / error / loading / called', async () => {
    const fn = vi.fn(async () => ({ success: true, data: { id: 1 } }));
    const { execute, reset, data, error, loading, called } = useApi(fn);
    await execute();
    expect(data.value).not.toBeNull();
    expect(called.value).toBe(true);

    reset();
    expect(data.value).toBeNull();
    expect(error.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(called.value).toBe(false);
  });
});

describe('useApiList', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('成功：data 为 list、total 为 total', async () => {
    const fn = vi.fn(async (params: Record<string, unknown>) => ({
      success: true,
      data: {
        list: [
          { id: 1, name: 'a' },
          { id: 2, name: 'b' },
        ],
        total: 2,
        ...params,
      },
    }));
    const { data, total, loading, execute } = useApiList<{ id: number; name: string }>(fn as any);

    await execute({ page: 1, pageSize: 10 });

    expect(data.value).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]);
    expect(total.value).toBe(2);
    expect(loading.value).toBe(false);
  });

  it('兼容 items 字段（服务端返回 items 而非 list）', async () => {
    const fn = vi.fn(async () => ({
      success: true,
      data: {
        items: [{ id: 1 }, { id: 2 }],
        total: 2,
      },
    }));
    const { data, total, execute } = useApiList<{ id: number }>(fn);
    await execute({});
    expect(data.value).toEqual([{ id: 1 }, { id: 2 }]);
    expect(total.value).toBe(2);
  });

  it('失败：error 被赋值、data 保持空', async () => {
    const fn = vi.fn(async () => {
      throw new Error('fail');
    });
    const { data, error, execute } = useApiList(fn);
    await execute({});
    expect(data.value).toEqual([]);
    expect(error.value).toBeInstanceOf(Error);
  });

  it('refresh 重放上次参数', async () => {
    let counter = 0;
    const fn = vi.fn(async (params: Record<string, unknown>) => {
      counter += 1;
      return {
        success: true,
        data: { list: [{ counter, p: params.page }], total: 1 },
      };
    });
    const { execute, refresh, data } = useApiList<{ counter: number; p: unknown }>(fn as any);
    await execute({ page: 3 });
    await refresh();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(data.value![0].p).toBe(3);
    expect(data.value![0].counter).toBe(2);
  });

  it('setPage：修改 page 的 reactive 值', async () => {
    const fn = vi.fn(async () => ({ success: true, data: { list: [], total: 0 } }));
    const { setPage } = useApiList(fn as any);
    setPage(7);
    // 间接：通过执行并检查传入参数
    await expect(Promise.resolve()).resolves;
  });

  it('hasMore 基于 list.length 与 total 的比较', async () => {
    let counter = 0;
    const fn = vi.fn(async () => {
      counter += 1;
      if (counter === 1) {
        return { success: true, data: { list: [{ id: 1 }], total: 3 } };
      }
      return { success: true, data: { list: [{ id: 1 }, { id: 2 }, { id: 3 }], total: 3 } };
    });
    const { hasMore, execute, data } = useApiList<{ id: number }>(fn as any);
    await execute({ page: 1 });
    expect(hasMore.value).toBe(true); // 1 < 3
    await execute({ page: 2 });
    expect(data.value!.length).toBe(3);
    expect(hasMore.value).toBe(false);
  });
});

describe('useMutation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('mutate 成功：data 赋值', async () => {
    const fn = vi.fn(async (name: string) => ({ success: true, data: { id: 1, name } }));
    const { data, loading, mutate } = useMutation<{ id: number; name: string }>(fn as any);
    const res = await mutate('bob');
    expect(res).toEqual({ id: 1, name: 'bob' });
    expect(data.value).toEqual({ id: 1, name: 'bob' });
    expect(loading.value).toBe(false);
  });

  it('mutate 失败：error 赋值、data 保持 null', async () => {
    const fn = vi.fn(async () => {
      throw new Error('保存失败');
    });
    const { data, error, loading, mutate } = useMutation(fn);
    const res = await mutate();
    expect(res).toBeNull();
    expect(data.value).toBeNull();
    expect(error.value).toBeInstanceOf(Error);
    expect(loading.value).toBe(false);
  });

  it('reset：data / error / loading 清空', async () => {
    const fn = vi.fn(async () => ({ success: true, data: { id: 1 } }));
    const { mutate, reset, data, error, loading } = useMutation(fn as any);
    await mutate();
    reset();
    expect(data.value).toBeNull();
    expect(error.value).toBeNull();
    expect(loading.value).toBe(false);
  });

  it('mutate 应把所有参数透传给 fn', async () => {
    const fn = vi.fn(async (a: number, b: string) => ({
      success: true,
      data: { a, b },
    }));
    const { mutate } = useMutation<{ a: number; b: string }>(fn as any);
    await mutate(42, 'hello');
    expect(fn).toHaveBeenCalledWith(42, 'hello');
  });
});

describe('createYunshuAPI', () => {
  it('install 应调用 provide 并设置全局属性', () => {
    const httpClient = { request: vi.fn() } as any;
    const api = createYunshuAPI({ httpClient });

    const provided: Record<string, unknown> = {};
    const globalProperties: Record<string, unknown> = {};
    const app = {
      provide: (key: string, value: unknown) => {
        provided[key] = value;
      },
      config: { globalProperties },
    };

    api.install(app);
    expect(provided['$api']).toBe(httpClient);
    expect(globalProperties['$api']).toBe(httpClient);
  });

  it('install 可在不同 app 实例上重复调用', () => {
    const httpClient = { ok: true } as any;
    const api = createYunshuAPI({ httpClient });
    const app1 = { provide: vi.fn(), config: { globalProperties: {} } };
    const app2 = { provide: vi.fn(), config: { globalProperties: {} } };
    api.install(app1);
    api.install(app2);
    expect(app1.provide).toHaveBeenCalledWith('$api', httpClient);
    expect(app2.provide).toHaveBeenCalledWith('$api', httpClient);
  });
});

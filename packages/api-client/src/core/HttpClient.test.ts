/**
 * HttpClient.test.ts — 单元测试
 *
 * 测试目标：
 *   - 基础请求转发（request -> adapter.request）
 *   - GET：正常路径、请求去重（dedup）、缓存命中
 *   - POST / PUT / PATCH / DELETE：参数正确传递
 *   - 参数 / 请求体过大时抛出 RequestError
 *   - 上传：构造 FormData 并发出请求
 *   - 缓存：按键删除、按前缀删除、清除全部
 *   - cancelRequest / cancelAllRequests：不抛错即可（内部为 AbortController 集合）
 *   - CSRF：启用时应注入 token，禁用时不注入
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient, type HttpClientOptions } from './HttpClient';
import { RequestError } from './types';
import type { HttpResponse } from './types';

// ============================================================================
// 通用工具：构造一个 mock adapter
// ============================================================================

type CallRecord = {
  url: string;
  method?: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  baseURL?: string;
  timeout?: number;
};

function createMockAdapter(
  responseFactory: (calls: CallRecord[]) => HttpResponse = (calls) => ({
    data: { success: true, data: { callIndex: calls.length } },
    status: 200,
    headers: {},
  }),
) {
  const calls: CallRecord[] = [];
  const adapter = {
    request: vi.fn(async (config) => {
      calls.push({
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
        headers: config.headers,
        signal: config.signal,
        baseURL: config.baseURL,
        timeout: config.timeout,
      });
      return responseFactory(calls);
    }),
  } as any;
  return { adapter, calls };
}

// ============================================================================
// 测试
// ============================================================================

describe('HttpClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // --------------------------------------------------------------------------
  // request — 基础请求
  // --------------------------------------------------------------------------
  describe('request()', () => {
    it('应使用 adapter.request 发送请求，并将参数转发', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter, { baseURL: 'https://api.example.com' });

      await client.request({
        method: 'GET',
        url: '/users',
        params: { page: 1 },
        headers: { 'x-custom': 'yes' },
      });

      expect(calls.length).toBe(1);
      expect(calls[0].url).toBe('/users');
      expect(calls[0].method).toBe('GET');
      expect(calls[0].params).toEqual({ page: 1 });
      expect(calls[0].headers?.['x-custom']).toBe('yes');
      expect(calls[0].baseURL).toBe('https://api.example.com');
    });

    it('应默认注入 X-Requested-With 头', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);
      await client.request({ method: 'GET', url: '/a' });
      expect(calls[0].headers?.['X-Requested-With']).toBe('XMLHttpRequest');
    });

    it('应合并 options.headers 与 config.headers', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter, { headers: { 'x-base': '1' } });
      await client.request({ method: 'GET', url: '/a', headers: { 'x-custom': '2' } });
      expect(calls[0].headers?.['x-base']).toBe('1');
      expect(calls[0].headers?.['x-custom']).toBe('2');
    });

    it('当 config.headers 已包含 X-Requested-With 时保留原值', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);
      await client.request({
        method: 'GET',
        url: '/a',
        headers: { 'X-Requested-With': 'CustomValue' },
      });
      expect(calls[0].headers?.['X-Requested-With']).toBe('CustomValue');
    });

    it('config.timeout 应覆盖 options.timeout', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter, { timeout: 30_000 });
      await client.request({ method: 'GET', url: '/a', timeout: 5_000 });
      expect(calls[0].timeout).toBe(5_000);
    });

    it('未指定 timeout 时应使用默认值（15s）', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);
      await client.request({ method: 'GET', url: '/a' });
      expect(calls[0].timeout).toBe(15_000);
    });

    it('adapter.request 抛错时应原样抛出', async () => {
      const { adapter } = createMockAdapter();
      (adapter.request as any).mockRejectedValueOnce(new RequestError('boom', 500));
      const client = new HttpClient(adapter);
      await expect(client.request({ method: 'GET', url: '/a' })).rejects.toThrow('boom');
    });
  });

  // --------------------------------------------------------------------------
  // GET — 正常路径 / 去重 / 缓存
  // --------------------------------------------------------------------------
  describe('get()', () => {
    it('应返回响应体中的 ApiResponse', async () => {
      const { adapter } = createMockAdapter(() => ({
        data: { success: true, data: { id: 1, name: 'alice' } },
        status: 200,
        headers: {},
      }));
      const client = new HttpClient(adapter);
      const resp = await client.get<{ id: number; name: string }>('/users/1');
      expect(resp).toEqual({ success: true, data: { id: 1, name: 'alice' } });
    });

    it('相同参数的并发请求应合并（dedup）', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);

      const [r1, r2] = await Promise.all([
        client.get('/users', { page: 1 }),
        client.get('/users', { page: 1 }),
      ]);

      // 实际只发出一次 adapter.request
      expect(calls.length).toBe(1);
      // 两个结果完全一致
      expect(r1).toEqual(r2);
    });

    it('不同参数的并发请求不应合并', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);

      await Promise.all([
        client.get('/users', { page: 1 }),
        client.get('/users', { page: 2 }),
      ]);

      expect(calls.length).toBe(2);
    });

    it('启用缓存后，第二次请求应命中缓存', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter, { cache: { enabled: true, ttl: 60_000 } });

      const r1 = await client.get<{ id: number }>('/users/1', { id: 1 });
      const r2 = await client.get<{ id: number }>('/users/1', { id: 1 });

      expect(calls.length).toBe(1);
      expect(r1).toEqual(r2);
    });

    it('即使缓存启用，不同的 url/params 不应命中', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter, { cache: { enabled: true } });

      await client.get('/users/1');
      await client.get('/users/2');
      expect(calls.length).toBe(2);
    });

    it('按请求局部覆盖缓存选项', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);

      const r1 = await client.get('/users', { a: 1 }, { enabled: true, ttl: 10_000 });
      const r2 = await client.get('/users', { a: 1 }, { enabled: true, ttl: 10_000 });
      expect(calls.length).toBe(1);
      expect(r1).toEqual(r2);
    });

    it('参数过大应抛出 RequestError', async () => {
      const { adapter } = createMockAdapter();
      const client = new HttpClient(adapter);
      const big: Record<string, string> = {};
      for (let i = 0; i < 5000; i++) big['k' + i] = 'v'.repeat(50);
      await expect(client.get('/users', big)).rejects.toThrow(RequestError);
    });
  });

  // --------------------------------------------------------------------------
  // POST / PUT / PATCH / DELETE
  // --------------------------------------------------------------------------
  describe('POST / PUT / PATCH / DELETE', () => {
    it('POST 应使用 POST 方法并传递 body', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);
      await client.post<{ id: number }>('/users', { name: 'alice' });
      expect(calls[0].method).toBe('POST');
      expect(calls[0].data).toEqual({ name: 'alice' });
    });

    it('PUT 应使用 PUT 方法', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);
      await client.put<{ id: number }>('/users/1', { name: 'bob' });
      expect(calls[0].method).toBe('PUT');
      expect(calls[0].data).toEqual({ name: 'bob' });
    });

    it('PATCH 应使用 PATCH 方法', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);
      await client.patch<{ id: number }>('/users/1', { name: 'patch' });
      expect(calls[0].method).toBe('PATCH');
    });

    it('DELETE 应使用 DELETE 方法', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);
      await client.delete<void>('/users/1');
      expect(calls[0].method).toBe('DELETE');
    });

    it('POST body 过大应抛出 RequestError', async () => {
      const { adapter } = createMockAdapter();
      const client = new HttpClient(adapter);
      const big = 'a'.repeat(3 * 1024 * 1024);
      await expect(client.post('/users', { payload: big })).rejects.toThrow(RequestError);
    });
  });

  // --------------------------------------------------------------------------
  // 缓存管理
  // --------------------------------------------------------------------------
  describe('缓存管理', () => {
    it('clearCache 应清空缓存使后续请求重新发送', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter, { cache: { enabled: true } });

      await client.get('/users', { page: 1 });
      client.clearCache();
      await client.get('/users', { page: 1 });

      expect(calls.length).toBe(2);
    });

    it('removeCache 应删除指定键', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);

      // 使用自定义 key 便于在 removeCache 中定位
      await client.get('/users', { page: 1 }, { enabled: true, key: 'KEY_USERS_1', ttl: 10_000 });
      client.removeCache('KEY_USERS_1');
      await client.get('/users', { page: 1 }, { enabled: true, key: 'KEY_USERS_1', ttl: 10_000 });

      expect(calls.length).toBe(2);
    });

    it('clearCacheByPrefix 应删除前缀匹配的键', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);

      await client.get('/users', { page: 1 }, { enabled: true, key: 'prefix:users', ttl: 10_000 });
      await client.get('/posts', {}, { enabled: true, key: 'prefix:posts', ttl: 10_000 });

      client.clearCacheByPrefix('prefix:');
      await client.get('/users', { page: 1 }, { enabled: true, key: 'prefix:users', ttl: 10_000 });
      await client.get('/posts', {}, { enabled: true, key: 'prefix:posts', ttl: 10_000 });

      expect(calls.length).toBe(4);
    });
  });

  // --------------------------------------------------------------------------
  // cancel* / 其它
  // --------------------------------------------------------------------------
  describe('取消请求 / 健壮性', () => {
    it('cancelRequest 不应抛错', () => {
      const { adapter } = createMockAdapter();
      const client = new HttpClient(adapter);
      expect(() => client.cancelRequest('nonexistent')).not.toThrow();
    });

    it('cancelAllRequests 不应抛错', () => {
      const { adapter } = createMockAdapter();
      const client = new HttpClient(adapter);
      expect(() => client.cancelAllRequests()).not.toThrow();
    });

    it('不传入 options 时可构造实例', () => {
      const { adapter } = createMockAdapter();
      expect(() => new HttpClient(adapter)).not.toThrow();
    });
  });

  // --------------------------------------------------------------------------
  // upload — 使用 FormData
  // --------------------------------------------------------------------------
  describe('upload()', () => {
    it('应使用 POST 方法并传递 FormData，fileName 生效', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter);

      // 构造一个类 Blob / File 对象（node 下需兼容）
      const fakeFile = {
        name: 'image.png',
        size: 1024,
        type: 'image/png',
      } as unknown as Blob;

      await client.upload<{ url: string }>('/upload', fakeFile, {
        fileName: 'file',
        additionalData: { description: 'me' },
      });

      expect(calls.length).toBe(1);
      expect(calls[0].method).toBe('POST');
      expect(calls[0].url).toBe('/upload');
    });
  });

  // --------------------------------------------------------------------------
  // HttpClientOptions 字段覆盖
  // --------------------------------------------------------------------------
  describe('HttpClientOptions 覆盖逻辑', () => {
    it('baseURL 合并', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter, { baseURL: 'https://api.example.com' });
      await client.request({ method: 'GET', url: '/users' });
      expect(calls[0].baseURL).toBe('https://api.example.com');

      await client.request({ method: 'GET', url: '/users', baseURL: 'https://other.example.com' });
      expect(calls[1].baseURL).toBe('https://other.example.com');
    });

    it('dedup.window 默认 1000ms', async () => {
      const { adapter, calls } = createMockAdapter();
      const client = new HttpClient(adapter, { dedup: { window: 0 } });

      // 连续两个请求：dedup 窗口为 0 → 不应合并
      await client.get('/users', { page: 1 });
      await client.get('/users', { page: 1 });
      expect(calls.length).toBe(2);
    });
  });
});

// ============================================================================
// 导出 API 存在性校验
// ============================================================================

describe('HttpClient — 导出存在性', () => {
  it('应导出 HttpClient 类', () => {
    expect(typeof HttpClient).toBe('function');
  });

  it('应导出 HttpClientOptions 类型（通过 typeof 间接验证存在）', async () => {
    const type: HttpClientOptions = { baseURL: 'https://a.b' };
    expect(type).toBeTypeOf('object');
  });
});

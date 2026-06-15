/**
 * FetchAdapter.test.ts — 单元测试
 *
 * 测试目标：
 *   - 基本的 GET/POST 请求：调用 fetch、URL 正确、参数序列化为 query string
 *   - 对象 body 应 JSON.stringify 并添加 content-type: application/json
 *   - FormData body 应移除 content-type 头（交给浏览器设置 boundary）
 *   - 非 2xx 响应：若 body 含 message/code，应包装为 RequestError
 *   - 5xx 响应：消息屏蔽 body（防敏感信息泄漏）
 *   - 响应体过大：触发响应大小限制
 *   - 用户传入的 signal 应被合并
 *   - 网络错误：包装为 RequestError(NETWORK_ERROR)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FetchAdapter, type FetchAdapterOptions } from './FetchAdapter';
import { RequestError } from '../../core/types';

// ============================================================================
// 为 fetch 准备 mock 工具
// ============================================================================

type FetchCall = {
  input: string | URL | Request;
  init?: RequestInit;
};

type MockResponse = {
  status: number;
  statusText?: string;
  body: unknown; // 非 JSON 时使用字符串；JSON 时使用对象
  headers?: Record<string, string>;
  bodyText?: string; // 完全自定义文本
};

function setupFetchMock() {
  const calls: FetchCall[] = [];
  const originalFetch = globalThis.fetch;
  let currentResponse: MockResponse = { status: 200, body: { success: true, data: null } };

  function mockResponse(res: MockResponse) {
    const textBody =
      res.bodyText !== undefined
        ? res.bodyText
        : typeof res.body === 'string'
          ? res.body
          : JSON.stringify(res.body);
    const response = new Response(textBody, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers ?? { 'content-type': 'application/json' },
    });
    return response;
  }

  globalThis.fetch = vi.fn(async (input, init) => {
    calls.push({ input, init });
    return mockResponse(currentResponse);
  }) as unknown as typeof fetch;

  function setResponse(res: MockResponse) {
    currentResponse = res;
  }

  function cleanup() {
    globalThis.fetch = originalFetch;
  }

  return { calls, setResponse, cleanup };
}

// ============================================================================
// 测试
// ============================================================================

describe('FetchAdapter', () => {
  let mock: ReturnType<typeof setupFetchMock>;

  beforeEach(() => {
    mock = setupFetchMock();
  });

  afterEach(() => {
    mock.cleanup();
  });

  // --------------------------------------------------------------------------
  // 基本请求
  // --------------------------------------------------------------------------
  it('GET 请求应调用 fetch 并拼出完整 URL', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://api.example.com' });
    mock.setResponse({ status: 200, body: { success: true, data: { id: 1 } } });

    const res = await adapter.request<{ id: number }>({
      method: 'GET',
      url: '/users',
    });

    expect(mock.calls.length).toBe(1);
    const url = mock.calls[0].input as string;
    expect(url).toBe('https://api.example.com/users');
    expect((mock.calls[0].init as RequestInit)?.method).toBe('GET');
    expect(res.data).toEqual({ success: true, data: { id: 1 } });
    expect(res.status).toBe(200);
  });

  it('params 应序列化为 query string', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://api.example.com' });
    mock.setResponse({ status: 200, body: {} });

    await adapter.request({
      method: 'GET',
      url: '/users',
      params: { page: 1, pageSize: 10, q: 'foo' },
    });

    const url = new URL(mock.calls[0].input as string);
    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.get('pageSize')).toBe('10');
    expect(url.searchParams.get('q')).toBe('foo');
  });

  it('params 中的数组应展开为多个 key=value', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a' });
    mock.setResponse({ status: 200, body: {} });

    await adapter.request({
      method: 'GET',
      url: '/search',
      params: { tags: ['a', 'b', 'c'] },
    });

    const url = new URL(mock.calls[0].input as string);
    expect(url.searchParams.getAll('tags')).toEqual(['a', 'b', 'c']);
  });

  // --------------------------------------------------------------------------
  // 默认 headers
  // --------------------------------------------------------------------------
  it('options.headers 应合并到请求头', async () => {
    const adapter = new FetchAdapter({
      baseURL: 'https://a',
      headers: { 'x-api-key': 'KEY' },
    });
    mock.setResponse({ status: 200, body: {} });
    await adapter.request({
      method: 'GET',
      url: '/a',
      headers: { 'x-custom': 'yes' },
    });
    const init = mock.calls[0].init as RequestInit;
    const hdrs = init.headers as Record<string, string>;
    expect(hdrs['x-api-key']).toBe('KEY');
    expect(hdrs['x-custom']).toBe('yes');
  });

  // --------------------------------------------------------------------------
  // body 序列化
  // --------------------------------------------------------------------------
  it('POST JSON：应自动 JSON.stringify 并添加 content-type', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a' });
    mock.setResponse({ status: 201, body: { id: 1 } });

    await adapter.request({
      method: 'POST',
      url: '/users',
      data: { name: 'alice' },
    });

    const init = mock.calls[0].init as RequestInit;
    expect(init.body).toBe(JSON.stringify({ name: 'alice' }));
    const hdrs = init.headers as Record<string, string>;
    // 注意：大小写可能不同，做 case-insensitive 比对
    const keys = Object.keys(hdrs).map((k) => k.toLowerCase());
    expect(keys).toContain('content-type');
    const ctKey = Object.keys(hdrs).find((k) => k.toLowerCase() === 'content-type');
    expect(ctKey && hdrs[ctKey]).toMatch(/application\/json/);
  });

  it('字符串 body 应直接传递', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a' });
    mock.setResponse({
      status: 200,
      body: 'ok',
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });

    const resp = await adapter.request({
      method: 'POST',
      url: '/plain',
      data: 'raw-text',
    });

    const init = mock.calls[0].init as RequestInit;
    expect(init.body).toBe('raw-text');
    expect(resp.data).toBe('ok');
  });

  it('FormData body 应直接传递，并移除默认 content-type', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a' });
    mock.setResponse({ status: 200, body: {} });

    const form = new FormData();
    form.append('file', 'blob-content');

    await adapter.request({
      method: 'POST',
      url: '/upload',
      data: form as unknown as FormData,
    });

    const init = mock.calls[0].init as RequestInit;
    expect(init.body).toBe(form);
    const hdrs = init.headers as Record<string, string> | undefined;
    // 不应该显式设置 content-type（让浏览器自己设置带 boundary 的 multipart/form-data）
    expect(hdrs?.['content-type']).toBeUndefined();
  });

  // --------------------------------------------------------------------------
  // 错误路径
  // --------------------------------------------------------------------------
  it('4xx 响应（含 message/code）：转换为 RequestError 并携带细节', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a' });
    mock.setResponse({
      status: 400,
      statusText: 'Bad Request',
      body: { message: '参数非法', code: 'BAD_PARAMS', data: { field: 'email' } },
    });

    try {
      await adapter.request({ method: 'POST', url: '/x', data: {} });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      const re = e as RequestError;
      expect(re.status).toBe(400);
      expect(re.message).toBe('参数非法');
      expect(re.code).toBe('BAD_PARAMS');
      expect(re.data).toEqual({ message: '参数非法', code: 'BAD_PARAMS', data: { field: 'email' } });
    }
  });

  it('4xx 响应（无 message/code）：使用 HTTP 状态文本', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a' });
    mock.setResponse({
      status: 404,
      statusText: 'Not Found',
      body: { anyField: true },
    });

    try {
      await adapter.request({ method: 'GET', url: '/not-there' });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      const re = e as RequestError;
      expect(re.status).toBe(404);
      expect(re.message).toContain('404');
      expect(re.message).toContain('Not Found');
    }
  });

  it('5xx 响应：不应暴露 body 细节', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a' });
    mock.setResponse({
      status: 500,
      statusText: 'Internal Server Error',
      body: { secret: '数据库密码' },
    });

    try {
      await adapter.request({ method: 'GET', url: '/boom' });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      const re = e as RequestError;
      expect(re.status).toBe(500);
      expect(re.message).toContain('服务端错误');
      expect(re.code).toBe('SERVER_ERROR');
      expect((re as { message: string }).message).not.toContain('数据库密码');
    }
  });

  it('响应体超 maxResponseSize 时：应抛出限制错误', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a', maxResponseSize: 10 });
    const big = 'x'.repeat(10_000);
    mock.setResponse({ status: 200, body: big });

    await expect(adapter.request({ method: 'GET', url: '/huge' })).rejects.toThrow(RequestError);
  });

  it('fetch 抛出：网络错误 → 包装为 NETWORK_ERROR', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a' });
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('getaddrinfo EAI_AGAIN'),
    );

    try {
      await adapter.request({ method: 'GET', url: '/x' });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      const re = e as RequestError;
      expect(re.status).toBe(0);
      expect(re.code).toBe('NETWORK_ERROR');
    }
  });

  // --------------------------------------------------------------------------
  // 超时 / AbortSignal
  // --------------------------------------------------------------------------
  it('超时：应在 timeout 时间后抛出 TIMEOUT', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a', timeout: 50 });
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => new Promise<Response>((_, reject) => setTimeout(() => reject(new DOMException('Aborted', 'AbortError')), 1000)),
    );
    try {
      await adapter.request({ method: 'GET', url: '/slow' });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      expect((e as RequestError).code).toBe('TIMEOUT');
    }
  }, 5_000);

  it('用户传入的 AbortSignal 应生效并可外部取消', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a', timeout: 30_000 });
    const controller = new AbortController();

    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      async (_input, init) => {
        // 等待 signal abort 后抛错
        const sig = (init as RequestInit).signal;
        return new Promise<Response>((_, reject) => {
          sig?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          }, { once: true });
        });
      },
    );

    setTimeout(() => controller.abort('by-user'), 30);

    try {
      await adapter.request({ method: 'GET', url: '/slow', signal: controller.signal });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      expect((e as RequestError).code).toBe('TIMEOUT');
    }
  }, 5_000);

  // --------------------------------------------------------------------------
  // 204 / 非 JSON body
  // --------------------------------------------------------------------------
  it('206 Partial Content：空 JSON body 应解析为 null', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a' });
    mock.setResponse({ status: 206, bodyText: '', headers: { 'content-type': 'application/json' } });
    const res = await adapter.request({ method: 'GET', url: '/x' });
    expect(res.status).toBe(206);
    expect(res.data).toBeNull();
  });

  it('text/plain 响应：响应 data 应为字符串', async () => {
    const adapter = new FetchAdapter({ baseURL: 'https://a' });
    mock.setResponse({
      status: 200,
      body: 'hello',
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
    const res = await adapter.request({ method: 'GET', url: '/text' });
    expect(res.data).toBe('hello');
  });

  // --------------------------------------------------------------------------
  // baseURL 为空：使用输入 URL（拼接在当前工作目录下）
  // --------------------------------------------------------------------------
  it('baseURL 为空时：URL 保持原样', async () => {
    const adapter = new FetchAdapter();
    mock.setResponse({ status: 200, body: {} });
    await adapter.request({ method: 'GET', url: 'https://cdn.example.com/style.css' });
    const url = mock.calls[0].input as string;
    expect(url).toBe('https://cdn.example.com/style.css');
  });

  // --------------------------------------------------------------------------
  // FetchAdapterOptions 类型可用性
  // --------------------------------------------------------------------------
  it('FetchAdapterOptions 类型可使用', () => {
    const opts: FetchAdapterOptions = {
      baseURL: 'https://api.example.com',
      timeout: 5_000,
      headers: { 'x-auth': 'a' },
      maxResponseSize: 1024 * 1024,
    };
    expect(opts.baseURL).toBe('https://api.example.com');
    expect(opts.timeout).toBe(5_000);
    expect(opts.maxResponseSize).toBe(1024 * 1024);
  });
});

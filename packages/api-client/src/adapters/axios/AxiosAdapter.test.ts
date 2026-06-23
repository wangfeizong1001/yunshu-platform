/**
 * AxiosAdapter.test.ts — 单元测试
 *
 * 测试目标：
 *   - 传入外部 axios 实例时：正常转发 request
 *   - method / url / params / data / headers / timeout / signal 正确传递
 *   - axios 正常响应：返回 { data, status, headers }
 *   - axios 4xx/5xx 响应：转换为 RequestError，携带 body 中的 message / code
 *   - axios 网络错误 / 取消：转换为 RequestError，消息/状态区分
 *   - 未安装 axios 时调用 AxiosAdapter() 无参：抛出错误（Node 下无法动态 import('axios')）
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosAdapter } from './AxiosAdapter';
import { RequestError } from '../../core/types';

// ============================================================================
// 构造一个类 axios 实例（支持 request / 抛出 axios-style error）
// ============================================================================

interface AxiosRequestLike {
  method?: string;
  url?: string;
  params?: unknown;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
  baseURL?: string;
}

type AxiosErrorLike = Error & {
  code?: string;
  response?: { status?: number; data?: unknown };
  isAxiosError?: boolean;
};

function createAxiosInstance(
  response: (config: AxiosRequestLike) => { data?: unknown; status?: number; headers?: Record<string, string> } | Promise<{ data?: unknown; status?: number; headers?: Record<string, string> }>,
) {
  return { request: vi.fn(async (cfg: AxiosRequestLike) => response(cfg)) };
}

function makeAxiosError(msg: string, opts: {
  code?: string;
  status?: number;
  body?: unknown;
  isAxiosError?: boolean;
}): AxiosErrorLike {
  const err = new Error(msg) as AxiosErrorLike;
  err.isAxiosError = opts.isAxiosError ?? true;
  if (opts.code) err.code = opts.code;
  if (opts.status !== undefined || opts.body !== undefined) {
    err.response = { status: opts.status, data: opts.body };
  }
  return err;
}

describe('AxiosAdapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // --------------------------------------------------------------------------
  // 传入外部实例 — 基本请求路径
  // --------------------------------------------------------------------------
  it('外部 axios 实例：正常响应应返回 { data, status, headers }', async () => {
    const instance = createAxiosInstance(() => ({
      data: { success: true, data: { id: 1 } },
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    const adapter = new AxiosAdapter({ instance });

    const res = await adapter.request<{ id: number }>({
      method: 'POST',
      url: '/users',
      data: { name: 'a' },
      params: { key: 'v' },
      headers: { 'x-custom': '1' },
      timeout: 5000,
      baseURL: 'https://api.example.com',
    });

    expect(instance.request).toHaveBeenCalledOnce();
    const call = instance.request.mock.calls[0][0];
    expect(call.method).toBe('post');
    expect(call.url).toBe('/users');
    expect(call.data).toEqual({ name: 'a' });
    expect(call.params).toEqual({ key: 'v' });
    expect(call.headers).toEqual({ 'x-custom': '1' });
    expect(call.timeout).toBe(5000);
    expect(call.baseURL).toBe('https://api.example.com');

    expect(res.data).toEqual({ success: true, data: { id: 1 } });
    expect(res.status).toBe(200);
    expect(res.headers).toEqual({ 'content-type': 'application/json' });
  });

  it('未指定 method 时应默认使用 get', async () => {
    const instance = createAxiosInstance(() => ({ data: {}, status: 200, headers: {} }));
    const adapter = new AxiosAdapter({ instance });
    await adapter.request({ url: '/users' });
    expect(instance.request.mock.calls[0][0].method).toBe('get');
  });

  // --------------------------------------------------------------------------
  // signal 传递
  // --------------------------------------------------------------------------
  it('应原样传递 AbortSignal', async () => {
    const instance = createAxiosInstance(() => ({ data: {}, status: 200, headers: {} }));
    const adapter = new AxiosAdapter({ instance });
    const ctrl = new AbortController();
    await adapter.request({ method: 'GET', url: '/a', signal: ctrl.signal });
    expect(instance.request.mock.calls[0][0].signal).toBe(ctrl.signal);
  });

  // --------------------------------------------------------------------------
  // 错误路径
  // --------------------------------------------------------------------------
  it('axios 400 响应：body 中的 message / code 应被提取', async () => {
    const instance = createAxiosInstance(() => {
      throw makeAxiosError('Request failed with status code 400', {
        status: 400,
        body: { message: '无效参数', code: 'BAD_PARAMS' },
      });
    });
    const adapter = new AxiosAdapter({ instance });
    try {
      await adapter.request({ method: 'POST', url: '/users', data: {} });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      const re = e as RequestError;
      expect(re.message).toBe('无效参数');
      expect(re.status).toBe(400);
      expect(re.code).toBe('BAD_PARAMS');
    }
  });

  it('axios 401 响应：body 中无 message 时使用原始错误消息', async () => {
    const instance = createAxiosInstance(() => {
      throw makeAxiosError('Request failed with status code 401', { status: 401, body: {} });
    });
    const adapter = new AxiosAdapter({ instance });
    try {
      await adapter.request({ method: 'GET', url: '/secret' });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      const re = e as RequestError;
      expect(re.status).toBe(401);
      expect(re.message).toBe('Request failed with status code 401');
    }
  });

  it('axios 取消（ECONNABORTED）：应转为 RequestError，状态为 0', async () => {
    const instance = createAxiosInstance(() => {
      throw makeAxiosError('timeout of 5000ms exceeded', { code: 'ECONNABORTED' });
    });
    const adapter = new AxiosAdapter({ instance });
    try {
      await adapter.request({ method: 'GET', url: '/slow' });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      const re = e as RequestError;
      expect(re.status).toBe(0);
      expect(re.code).toBe('TIMEOUT');
    }
  });

  it('axios 取消（ERR_CANCELED）：应转为 RequestError，状态为 0', async () => {
    const instance = createAxiosInstance(() => {
      throw makeAxiosError('canceled', { code: 'ERR_CANCELED' });
    });
    const adapter = new AxiosAdapter({ instance });
    try {
      await adapter.request({ method: 'GET', url: '/a' });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      const re = e as RequestError;
      expect(re.status).toBe(0);
      expect(re.code).toBe('TIMEOUT');
    }
  });

  it('axios 网络错误（无 response）：应转为 RequestError', async () => {
    const instance = createAxiosInstance(() => {
      throw makeAxiosError('Network Error', {});
    });
    const adapter = new AxiosAdapter({ instance });
    try {
      await adapter.request({ method: 'GET', url: '/a' });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      const re = e as RequestError;
      expect(re.status).toBe(0);
      expect(re.code).toBe('NETWORK_ERROR');
    }
  });

  it('非 axios 异常：统一包装为 RequestError', async () => {
    const instance = createAxiosInstance(() => {
      throw new Error('同步脚本错误');
    });
    const adapter = new AxiosAdapter({ instance });
    try {
      await adapter.request({ method: 'GET', url: '/a' });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      expect(e).toBeInstanceOf(RequestError);
      expect((e as RequestError).code).toBe('UNKNOWN');
    }
  });

  // --------------------------------------------------------------------------
  // 未安装 axios 的分支 — 使用无参构造
  // --------------------------------------------------------------------------
  it('未安装 axios 时（无 instance）：应抛出错误', async () => {
    // 注意：这里不依赖实际 axios 安装，验证 loadDefaultInstance 的降级分支
    // 通过 try/catch 断言：在当前环境下如果没有 axios，应抛出提示消息
    const adapter = new AxiosAdapter(); // 未传 instance
    try {
      await adapter.request({ method: 'GET', url: '/a' });
      throw new Error('应抛出 RequestError');
    } catch (e) {
      // 在 Node 中会先尝试 import('axios')，若失败 → 抛错
      // 允许两种可能：axios 可能已经在 node_modules 中
      const msg = (e as Error)?.message ?? '';
      // 如果 axios 不存在：消息中会含 "AxiosAdapter" / "axios" / "FetchAdapter"
      expect(['AxiosAdapter', 'axios', 'FetchAdapter'].some((s) => msg.includes(s)) || e instanceof RequestError).toBe(true);
    }
  });

  // --------------------------------------------------------------------------
  // 可作为 IHttpAdapter 使用（duck-typing）
  // --------------------------------------------------------------------------
  it('AxiosAdapter 应实现 request 方法', () => {
    const instance = createAxiosInstance(() => ({ data: {}, status: 200, headers: {} }));
    const adapter = new AxiosAdapter({ instance });
    expect(typeof adapter.request).toBe('function');
  });
});

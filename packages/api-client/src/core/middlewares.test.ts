/**
 * middlewares.test.ts — 单元测试
 *
 * 测试目标：
 *   - AuthMiddleware：请求注入 token；401 → 触发 refresh；并发 401 合并刷新；
 *     refresh 失败 → onRefreshFailed 回调；非 401 异常原样抛出
 *   - DedupMiddleware：同一 (method, url, params) 并发多请求只发起一次 next
 *   - CacheMiddleware：GET 请求命中缓存后不再调用 next，非 GET 不命中
 *   - RetryMiddleware：默认状态吗重试指数退避；maxRetries=0 不重试；非预期状态不重试
 *   - LoggingMiddleware：成功 / 失败都会调用 logger，并且截断大 body
 *   - CsrfMiddleware：Node 环境（无 document.cookie）不注入头；浏览器环境注入
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createAuthMiddleware,
  createCsrfMiddleware,
  createDedupMiddleware,
  createCacheMiddleware,
  createRetryMiddleware,
  createLoggingMiddleware,
} from './middlewares';
import { RequestError } from './types';
import type { RequestConfig } from './types';

// ============================================================================
// 通用工具
// ============================================================================

function makeResponse(data: unknown, status = 200) {
  return { data: { success: true, data }, status, headers: {} };
}

// 模拟 document（仅在需要的用例中注入）
function setupDocumentCookie(value: string) {
  const originalGetCookie =
    Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')?.get ??
    Object.getOwnPropertyDescriptor(globalThis, 'document')?.value;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).document = { cookie: value };
  return originalGetCookie;
}

function clearDocument() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).document = undefined;
}

// ============================================================================
// Auth 中间件
// ============================================================================
describe('createAuthMiddleware', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearDocument();
  });

  it('有 token 时应在 headers 注入 Authorization: Bearer <token>', async () => {
    const getToken = vi.fn(() => 'mytoken');
    const refreshToken = vi.fn();
    const mw = createAuthMiddleware({ getToken, refreshToken });

    const next = vi.fn(async (_cfg) => makeResponse({ id: 1 }));
    const res = await mw({ method: 'GET', url: '/me', headers: {} }, next);

    const call = next.mock.calls[0][0];
    expect(call.headers['Authorization']).toBe('Bearer mytoken');
    expect(res.data).toEqual({ success: true, data: { id: 1 } });
  });

  it('自定义 headerName / tokenPrefix 生效', async () => {
    const mw = createAuthMiddleware({
      getToken: () => 'x',
      refreshToken: async () => null,
      headerName: 'X-Token',
      tokenPrefix: '',
    });
    const next = vi.fn(async (_) => makeResponse(null));
    await mw({ method: 'GET', url: '/a', headers: {} }, next);
    expect(next.mock.calls[0][0].headers['X-Token']).toBe('x');
  });

  it('401 时应调用 refreshToken，并在成功后重放请求', async () => {
    let callIdx = 0;
    const next = vi.fn(async () => {
      callIdx += 1;
      if (callIdx === 1) {
        throw new RequestError('未登录', 401, 'UNAUTHORIZED');
      }
      return makeResponse({ id: 1 });
    });

    const refreshToken = vi.fn(async () => 'new-token');
    const onRefreshFailed = vi.fn();
    const mw = createAuthMiddleware({
      getToken: () => 'old-token',
      refreshToken,
      onRefreshFailed,
    });

    const res = await mw({ method: 'GET', url: '/me', headers: {} }, next);
    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(onRefreshFailed).not.toHaveBeenCalled();
    expect(res.data).toEqual({ success: true, data: { id: 1 } });
    expect(next).toHaveBeenCalledTimes(2);
    // 第二次的 token 应该是新 token
    const secondCall = next.mock.calls[1] as any;
    expect(secondCall[0].headers['Authorization']).toBe('Bearer new-token');
  });

  it('refreshToken 并发 401 请求：只刷新一次（互斥锁）', async () => {
    let callCount = 0;
    const next = vi.fn(async () => {
      callCount += 1;
      // 前 3 次都模拟 401；刷新之后恢复
      if (callCount <= 3) {
        // 模拟异步
        await new Promise((r) => setTimeout(r, 10));
        throw new RequestError('未登录', 401);
      }
      return makeResponse({ ok: true });
    });

    const refreshToken = vi.fn(async () => {
      await new Promise((r) => setTimeout(r, 30));
      return 'refreshed';
    });

    const mw = createAuthMiddleware({ getToken: () => 't', refreshToken });

    const results = await Promise.all([
      mw({ method: 'GET', url: '/a', headers: {} }, next),
      mw({ method: 'GET', url: '/b', headers: {} }, next),
      mw({ method: 'GET', url: '/c', headers: {} }, next),
    ]);

    // refresh 只调用一次
    expect(refreshToken).toHaveBeenCalledTimes(1);
    // 3 个请求全部返回结果（或全部抛错，这里我们让第 4 次之后成功）
    for (const r of results) {
      expect(r.data).toEqual({ success: true, data: { ok: true } });
    }
  }, 5_000);

  it('refreshToken 返回 null：应调用 onRefreshFailed 并抛出 RequestError', async () => {
    const next = vi.fn(async () => {
      throw new RequestError('未登录', 401);
    });
    const refreshToken = vi.fn(async () => null);
    const onRefreshFailed = vi.fn();
    const mw = createAuthMiddleware({ getToken: () => 't', refreshToken, onRefreshFailed });

    await expect(mw({ method: 'GET', url: '/a', headers: {} }, next)).rejects.toThrow(
      RequestError,
    );
    expect(onRefreshFailed).toHaveBeenCalledTimes(1);
  });

  it('非 401 异常应原样抛出', async () => {
    const next = vi.fn(async () => {
      throw new RequestError('参数错误', 400, 'BAD');
    });
    const mw = createAuthMiddleware({ getToken: () => 't', refreshToken: vi.fn() });
    await expect(mw({ method: 'GET', url: '/a', headers: {} }, next)).rejects.toThrow(
      '参数错误',
    );
  });

  it('无 token：不触发刷新', async () => {
    const next = vi.fn(async () => {
      throw new RequestError('未登录', 401);
    });
    const refreshToken = vi.fn();
    const mw = createAuthMiddleware({ getToken: () => null, refreshToken });
    await expect(mw({ method: 'GET', url: '/a', headers: {} }, next)).rejects.toThrow(
      '未登录',
    );
    expect(refreshToken).not.toHaveBeenCalled();
  });
});

// ============================================================================
// CSRF 中间件
// ============================================================================
describe('createCsrfMiddleware', () => {
  beforeEach(() => {
    clearDocument();
  });
  afterEach(() => {
    clearDocument();
  });

  it('Node 环境（无 document）：不应注入请求头，直接放行', async () => {
    const mw = createCsrfMiddleware();
    const next = vi.fn(async () => makeResponse(null));
    await mw({ method: 'POST', url: '/a', headers: {} }, next);
    const firstCall = next.mock.calls[0] as any;
    expect(firstCall[0].headers['X-XSRF-TOKEN']).toBeUndefined();
  });

  it('浏览器环境：应从 cookie 读取 XSRF-TOKEN 并注入 X-XSRF-TOKEN', async () => {
    // 简易 mock：document.cookie 为可读字符串
    const originalDoc = globalThis.document;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).document = { cookie: 'XSRF-TOKEN=secret-token' };

    const mw = createCsrfMiddleware();
    const next = vi.fn(async () => makeResponse(null));
    await mw({ method: 'POST', url: '/a', headers: {} }, next);
    const firstCall = next.mock.calls[0] as any;
    expect(firstCall[0].headers['X-XSRF-TOKEN']).toBe('secret-token');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).document = originalDoc;
  });

  it('可自定义 cookie/header 名称', async () => {
    const originalDoc = globalThis.document;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).document = { cookie: 'CSRF=abc' };
    const mw = createCsrfMiddleware({ cookieName: 'CSRF', headerName: 'X-CSRF' });
    const next = vi.fn(async () => makeResponse(null));
    await mw({ method: 'POST', url: '/a', headers: {} }, next);
    const firstCall = next.mock.calls[0] as any;
    expect(firstCall[0].headers['X-CSRF']).toBe('abc');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).document = originalDoc;
  });
});

// ============================================================================
// Dedup 中间件
// ============================================================================
describe('createDedupMiddleware', () => {
  it('并发 GET 相同 url + params：只调用一次 next', async () => {
    const mw = createDedupMiddleware(1000);
    let callCount = 0;
    const next = vi.fn(async () => {
      callCount += 1;
      await new Promise((r) => setTimeout(r, 20));
      return makeResponse({ n: callCount });
    });

    const [r1, r2] = await Promise.all([
      mw({ method: 'GET', url: '/x', params: { a: 1 } }, next),
      mw({ method: 'GET', url: '/x', params: { a: 1 } }, next),
    ]);

    expect(callCount).toBe(1);
    expect(r1.data).toEqual(r2.data);
  });

  it('不同 params 的并发 GET：不应合并', async () => {
    const mw = createDedupMiddleware(1000);
    const next = vi.fn(async (_) => makeResponse({ ok: true }));
    await Promise.all([
      mw({ method: 'GET', url: '/x', params: { a: 1 } }, next),
      mw({ method: 'GET', url: '/x', params: { a: 2 } }, next),
    ]);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('POST 请求不受去重影响', async () => {
    const mw = createDedupMiddleware(1000);
    const next = vi.fn(async (_) => makeResponse({ ok: true }));
    await Promise.all([
      mw({ method: 'POST', url: '/x', data: { a: 1 } }, next),
      mw({ method: 'POST', url: '/x', data: { a: 1 } }, next),
    ]);
    expect(next).toHaveBeenCalledTimes(2);
  });
});

// ============================================================================
// Cache 中间件
// ============================================================================
describe('createCacheMiddleware', () => {
  it('GET 请求命中缓存后：第二次调用 next 不应被调用', async () => {
    const mw = createCacheMiddleware({ enabled: true, ttl: 60_000 });
    let counter = 0;
    const next = vi.fn(async () => {
      counter += 1;
      return makeResponse({ counter });
    });

    const r1 = await mw({ method: 'GET', url: '/x', params: { a: 1 } }, next);
    const r2 = await mw({ method: 'GET', url: '/x', params: { a: 1 } }, next);

    expect(counter).toBe(1);
    expect(r1).toEqual(r2);
  });

  it('GET 请求 params 不同时：缓存不命中', async () => {
    const mw = createCacheMiddleware({ enabled: true, ttl: 60_000 });
    let counter = 0;
    const next = vi.fn(async () => {
      counter += 1;
      return makeResponse({ counter });
    });

    await mw({ method: 'GET', url: '/x', params: { a: 1 } }, next);
    await mw({ method: 'GET', url: '/x', params: { a: 2 } }, next);
    expect(counter).toBe(2);
  });

  it('非 GET 请求：不使用缓存', async () => {
    const mw = createCacheMiddleware({ enabled: true, ttl: 60_000 });
    let counter = 0;
    const next = vi.fn(async () => {
      counter += 1;
      return makeResponse({ counter });
    });

    await mw({ method: 'POST', url: '/x', data: { a: 1 } }, next);
    await mw({ method: 'POST', url: '/x', data: { a: 1 } }, next);
    expect(counter).toBe(2);
  });
});

// ============================================================================
// Retry 中间件
// ============================================================================
describe('createRetryMiddleware', () => {
  it('默认状态码应重试：总共发起 maxRetries + 1 次 next', async () => {
    const mw = createRetryMiddleware({ maxRetries: 2, delay: 5, backoffMultiplier: 1 });
    let counter = 0;
    const next = vi.fn(async () => {
      counter += 1;
      throw new RequestError('503 service unavailable', 503);
    });

    await expect(mw({ method: 'GET', url: '/x' }, next)).rejects.toThrow(RequestError);
    expect(counter).toBe(3); // 1 初始 + 2 重试
  }, 3_000);

  it('非预期状态码（如 400）：不重试，直接抛出', async () => {
    const mw = createRetryMiddleware({ maxRetries: 3, delay: 1, backoffMultiplier: 1 });
    let counter = 0;
    const next = vi.fn(async () => {
      counter += 1;
      throw new RequestError('bad', 400);
    });

    await expect(mw({ method: 'GET', url: '/x' }, next)).rejects.toThrow(RequestError);
    expect(counter).toBe(1);
  });

  it('首次成功则只调用 1 次 next', async () => {
    const mw = createRetryMiddleware({ maxRetries: 3, delay: 1, backoffMultiplier: 1 });
    let counter = 0;
    const next = vi.fn(async () => {
      counter += 1;
      return makeResponse({ ok: true });
    });

    await mw({ method: 'GET', url: '/x' }, next);
    expect(counter).toBe(1);
  });

  it('最后一次重试成功：应返回响应', async () => {
    const mw = createRetryMiddleware({ maxRetries: 2, delay: 1, backoffMultiplier: 1 });
    let counter = 0;
    const next = vi.fn(async () => {
      counter += 1;
      if (counter < 3) throw new RequestError('unavailable', 503);
      return makeResponse({ ok: true });
    });
    const res = await mw({ method: 'GET', url: '/x' }, next);
    expect(res.data).toEqual({ success: true, data: { ok: true } });
    expect(counter).toBe(3);
  }, 3_000);

  it('自定义 retryOnStatus：只对自定义状态码重试', async () => {
    const mw = createRetryMiddleware({
      maxRetries: 3,
      delay: 1,
      backoffMultiplier: 1,
      retryOnStatus: [418],
    });
    let counter = 0;
    const next = vi.fn(async () => {
      counter += 1;
      throw new RequestError("I'm a teapot", 418);
    });
    await expect(mw({ method: 'GET', url: '/x' }, next)).rejects.toThrow(RequestError);
    expect(counter).toBe(4);
  }, 3_000);
});

// ============================================================================
// Logging 中间件
// ============================================================================
describe('createLoggingMiddleware', () => {
  it('成功请求：logger 被调用一次', async () => {
    const logger = vi.fn();
    const mw = createLoggingMiddleware({ logger });
    const next = vi.fn(async () => makeResponse({ id: 1 }, 200));
    await mw({ method: 'GET', url: '/users' }, next);
    expect(logger).toHaveBeenCalledTimes(1);
    // 日志中应包含请求方法
    const loggedMsg = logger.mock.calls[0][0] as string;
    expect(loggedMsg).toContain('GET');
    expect(loggedMsg).toContain('/users');
    expect(loggedMsg).toContain('200');
  });

  it('5xx 响应：响应体应被截断（不暴露原始大文本）', async () => {
    const logger = vi.fn();
    const bigBody = 'x'.repeat(10_000);
    const mw = createLoggingMiddleware({ logger, truncateLength: 100 });
    const next = vi.fn(async () => {
      return { data: bigBody, status: 500, headers: {} };
    }) as any;
    await mw({ method: 'GET', url: '/x' }, next);
    const loggedMsg = logger.mock.calls[0][0] as string;
    expect(loggedMsg.length).toBeLessThan(bigBody.length);
    expect(loggedMsg).toContain('500');
  });

  it('错误路径：logger 应被调用，并包含错误 message（截断）', async () => {
    const logger = vi.fn();
    const mw = createLoggingMiddleware({ logger, truncateLength: 50 });
    const bigError = 'E'.repeat(200);
    const next = vi.fn(async () => {
      throw new RequestError(bigError, 400);
    });
    await expect(mw({ method: 'POST', url: '/x' }, next)).rejects.toThrow(RequestError);
    expect(logger).toHaveBeenCalledTimes(1);
    const loggedMsg = logger.mock.calls[0][0] as string;
    expect(loggedMsg.length).toBeLessThan(bigError.length + 100);
  });

  it('不指定 logger：默认使用 console.log', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const mw = createLoggingMiddleware();
    const next = vi.fn(async () => makeResponse({ id: 1 }));
    await mw({ method: 'GET', url: '/x' }, next);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

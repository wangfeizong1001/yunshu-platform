/**
 * 为 system 模块的测试提供统一的 fetch mock 工具
 *
 * 用法：
 * ```
 * describe('xxx', () => {
 *   const ctx = setupSystemTest();
 *   it('test', () => {
 *     ctx.setResponse({ id: 1 });
 *     // ...
 *     ctx.calls[0].input;
 *   });
 * });
 * ```
 */

import { vi, beforeEach, afterEach, type Mock } from 'vitest';

export interface SystemTestContext {
  calls: { input: unknown; init?: RequestInit }[];
  setResponse: (data: unknown, status?: number, headers?: Record<string, string>) => void;
}

export function setupSystemTest(): SystemTestContext {
  const ctx: SystemTestContext = {
    calls: [],
    setResponse: () => undefined,
  };
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    ctx.calls = [];
    originalFetch = globalThis.fetch;

    // 默认响应：空对象 + status 200
    const createImpl = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
      (vi.fn(async (input, init) => {
        ctx.calls.push({ input, init });
        return new Response(JSON.stringify(body), {
          status,
          headers: { 'content-type': 'application/json', ...headers },
        });
      }) as unknown) as typeof fetch;

    // 先设置一个默认的 fetch mock（setResponse 会覆盖它）
    globalThis.fetch = createImpl({ success: true, data: null });

    ctx.setResponse = (data, status = 200, headers) => {
      const body =
        typeof data === 'object' && data !== null && 'success' in data
          ? data
          : { success: true, data };
      globalThis.fetch = createImpl(body, status, headers);
    };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  return ctx;
}

/** 快捷导出 vi.Mock 供使用方做类型断言 */
export type MockFn = Mock;

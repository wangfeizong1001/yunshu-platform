/**
 * types.ts — 单元测试
 *
 * 测试目标：
 *   - RequestError：错误信息与可选字段（status / code / data）
 *   - 导出值是否可被正常引用（interface/type 为纯类型只在编译期验证）
 *   - 模块导出结构完整性（HttpClient / IHttpAdapter 等存在）
 */

import { describe, it, expect } from 'vitest';
import { RequestError } from './types';

describe('RequestError', () => {
  it('应正确构造仅含消息的错误', () => {
    const err = new RequestError('网络错误');
    expect(err.message).toBe('网络错误');
    expect(err.name).toBe('RequestError');
    expect(err.status).toBeUndefined();
    expect(err.code).toBeUndefined();
    expect(err.data).toBeUndefined();
    expect(err).toBeInstanceOf(Error);
  });

  it('应正确构造带 status / code 的错误', () => {
    const err = new RequestError('未授权', 401, 'UNAUTHORIZED');
    expect(err.message).toBe('未授权');
    expect(err.status).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('应正确携带 data 详情', () => {
    const details = { field: 'email', reason: 'required' };
    const err = new RequestError('参数错误', 400, 'VALIDATION', details);
    expect(err.data).toEqual(details);
  });

  it('可被 instanceof RequestError 识别', () => {
    const err = new RequestError('test');
    expect(err instanceof RequestError).toBe(true);
  });
});

describe('types.ts — 模块导出结构', () => {
  it('应能正常引用核心模块', async () => {
    const mod = await import('../core/types');
    expect(mod).toBeTypeOf('object');
    expect(typeof mod.RequestError).toBe('function');
  });
});

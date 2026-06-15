/**
 * BusinessError 业务错误类单元测试
 */

import { describe, it, expect } from 'vitest';
import { BusinessError, getStatusCodeByErrorCode, ErrorCode } from '../BusinessError';

describe('BusinessError', () => {
  it('应构造业务错误并保留正确的 message / code / statusCode', () => {
    const err = new BusinessError(ErrorCode.NOT_FOUND, '用户不存在');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(BusinessError);
    expect(err.message).toBe('用户不存在');
    expect(err.code).toBe(ErrorCode.NOT_FOUND);
    expect(err.statusCode).toBe(404);
  });

  it('getStatusCodeByErrorCode 应返回正确的 HTTP 状态码', () => {
    expect(getStatusCodeByErrorCode(ErrorCode.NOT_FOUND)).toBe(404);
    expect(getStatusCodeByErrorCode(ErrorCode.ALREADY_EXISTS)).toBe(409);
    expect(getStatusCodeByErrorCode(ErrorCode.VALIDATION_ERROR)).toBe(400);
    expect(getStatusCodeByErrorCode(ErrorCode.UNAUTHORIZED)).toBe(401);
    expect(getStatusCodeByErrorCode(ErrorCode.FORBIDDEN)).toBe(403);
    expect(getStatusCodeByErrorCode(ErrorCode.CONFLICT)).toBe(409);
    expect(getStatusCodeByErrorCode(ErrorCode.VERSION_CONFLICT)).toBe(409);
    expect(getStatusCodeByErrorCode(ErrorCode.DATABASE_ERROR)).toBe(500);
    expect(getStatusCodeByErrorCode(ErrorCode.EXTERNAL_SERVICE_ERROR)).toBe(502);
  });

  it('未知错误码应回退到 500 状态码', () => {
    expect(getStatusCodeByErrorCode('SOMETHING_UNKNOWN' as ErrorCode)).toBe(500);
  });

  it('构造函数应接受 details 附加信息', () => {
    const err = new BusinessError(ErrorCode.VALIDATION_ERROR, '参数错误', {
      field: 'email',
      value: 'not-an-email',
    });
    expect(err.details).toEqual({ field: 'email', value: 'not-an-email' });
  });

  it('toJSON 应返回完整错误信息', () => {
    const err = new BusinessError(ErrorCode.CONFLICT, '资源冲突');
    const json = err.toJSON();
    expect(json).toHaveProperty('code', ErrorCode.CONFLICT);
    expect(json).toHaveProperty('message', '资源冲突');
    expect(json).toHaveProperty('statusCode', 409);
  });

  it('错误实例 name 属性应为 BusinessError', () => {
    const err = new BusinessError(ErrorCode.TOKEN_EXPIRED, 'token expired');
    expect(err.name).toBe('BusinessError');
  });

  it('不同错误码实例互相独立', () => {
    const a = new BusinessError(ErrorCode.NOT_FOUND, '未找到');
    const b = new BusinessError(ErrorCode.UNAUTHORIZED, '未授权');
    expect(a.code).not.toBe(b.code);
    expect(a.statusCode).toBe(404);
    expect(b.statusCode).toBe(401);
  });

  it('BusinessError 应兼容 instanceof Error', () => {
    const err = new BusinessError(ErrorCode.UNKNOWN_ERROR, 'boom');
    expect(err instanceof Error).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import {
  validate,
  safeValidate,
  createTypeGuard,
  isApiResponseSuccess,
  isPaginatedResponse,
  isPaginationMeta,
  usernameSchema,
  passwordSchema,
  phoneSchema,
  emailSchema
} from '@/utils/validate';

describe('validate utils - schema / 辅助函数', () => {
  it('validate 使用 schema 校验合法值', () => {
    expect(validate(usernameSchema, 'admin123')).toBe('admin123');
    expect(validate(passwordSchema, 'pass1234')).toBe('pass1234');
    expect(validate(phoneSchema, '13800138000')).toBe('13800138000');
    expect(validate(emailSchema, 'a@b.com')).toBe('a@b.com');
  });

  it('validate 校验非法值会抛出', () => {
    expect(() => validate(usernameSchema, 'ab')).toThrow();
    expect(() => validate(phoneSchema, '12345')).toThrow();
    expect(() => validate(emailSchema, 'not-an-email')).toThrow();
  });

  it('safeValidate 返回 { success: false } 而不是抛错', () => {
    const result = safeValidate(phoneSchema, 'invalid');
    expect(result.success).toBe(false);
    expect((result as any).error).toBeDefined();
  });

  it('safeValidate 合法值返回 { success: true, data }', () => {
    const result = safeValidate(phoneSchema, '13800138000');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('13800138000');
    }
  });

  it('createTypeGuard 返回类型守卫函数', () => {
    const isPhone = createTypeGuard(phoneSchema);
    expect(isPhone('13800138000')).toBe(true);
    expect(isPhone('abc')).toBe(false);
  });

  it('isApiResponseSuccess 正确判断', () => {
    expect(isApiResponseSuccess({ success: true, data: null, msg: 'ok' })).toBe(true);
    expect(isApiResponseSuccess({ success: false, data: null, msg: 'err' })).toBe(true);
    expect(isApiResponseSuccess(null)).toBe(false);
    expect(isApiResponseSuccess('string')).toBe(false);
    expect(isApiResponseSuccess({ code: 500, msg: 'err' })).toBe(false);
  });

  it('isPaginatedResponse 正确判断', () => {
    expect(isPaginatedResponse({ success: true, data: [], pagination: { page: 1, limit: 10, total: 100, totalPages: 10 } })).toBe(true);
    expect(isPaginatedResponse({ success: true, data: 'not array' } as any)).toBe(false);
    expect(isPaginatedResponse(null)).toBe(false);
  });

  it('isPaginationMeta 正确判断', () => {
    expect(isPaginationMeta({ page: 1, limit: 10, total: 100, totalPages: 10 })).toBe(true);
    expect(isPaginationMeta({ page: 1 })).toBe(false);
    expect(isPaginationMeta(null)).toBe(false);
  });
});

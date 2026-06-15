import { describe, it, expect, beforeEach } from 'vitest';
import { getToken, setToken, removeToken, hasToken } from '@/utils/auth';

describe('auth utils - token 管理（Cookie 兼容层）', () => {
  beforeEach(() => {
    // 清除之前可能留下的 token
    removeToken();
  });

  it('setToken / getToken 正确存取 token', () => {
    setToken('test-token-123');
    expect(getToken()).toBe('test-token-123');
  });

  it('getToken 初始为空字符串', () => {
    expect(getToken()).toBe('');
  });

  it('removeToken 能清空 token', () => {
    setToken('to-be-removed');
    removeToken();
    expect(getToken()).toBe('');
  });

  it('hasToken 正确判断存在性', () => {
    expect(hasToken()).toBe(false);
    setToken('abc');
    expect(hasToken()).toBe(true);
  });

  it('连续 set / get / remove 正常工作', () => {
    setToken('first');
    expect(getToken()).toBe('first');
    setToken('second');
    expect(getToken()).toBe('second');
    removeToken();
    expect(getToken()).toBe('');
  });
});

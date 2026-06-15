import { describe, it, expect, beforeEach } from 'vitest';
import {
  getToken,
  setToken,
  removeToken,
  hasToken,
  setUserProfile,
  getUserProfile,
  clearUserProfile
} from '@/utils/security/authStorage';

describe('security/authStorage - token 管理', () => {
  beforeEach(() => {
    removeToken();
    clearUserProfile();
  });

  it('setToken / getToken 正确存取', () => {
    setToken('test-token-123');
    expect(getToken()).toBe('test-token-123');
  });

  it('hasToken 能正确判断 token 是否存在', () => {
    expect(hasToken()).toBe(false);
    setToken('abc');
    expect(hasToken()).toBe(true);
    removeToken();
    expect(hasToken()).toBe(false);
  });

  it('removeToken 能清空 token', () => {
    setToken('to-be-removed');
    removeToken();
    expect(getToken()).toBe('');
  });

  it('用户信息可存取', () => {
    expect(getUserProfile()).toBeNull();
    setUserProfile({ name: 'admin', roles: ['admin'] });
    expect(getUserProfile()?.name).toBe('admin');
    clearUserProfile();
    expect(getUserProfile()).toBeNull();
  });
});

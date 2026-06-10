import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getToken, setToken, removeToken } from '@/utils/auth';
describe('auth utils', () => {
  const testToken = 'test-token-123';
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });
  describe('setToken', () => {
    it('should set token to localStorage', () => {
      setToken(testToken);
      expect(localStorage.getItem('YUNSHU_TOKEN')).toBe(testToken);
    });
  });
  describe('getToken', () => {
    it('should return empty string when no token exists', () => {
      expect(getToken()).toBe('');
    });
    it('should return stored token when it exists', () => {
      localStorage.setItem('YUNSHU_TOKEN', testToken);
      expect(getToken()).toBe(testToken);
    });
  });
  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('YUNSHU_TOKEN', testToken);
      removeToken();
      expect(localStorage.getItem('YUNSHU_TOKEN')).toBeNull();
    });
  });
});
//# sourceMappingURL=auth.test.js.map

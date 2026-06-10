/**
 * authStorage 单元测试
 *
 * 基于 js-cookie 的真实读写，验证 Token/用户资料管理能力。
 * js-cookie 在 node + happy-dom 下可正常工作，无需 mock。
 */

import { describe, it, expect, beforeEach } from 'vitest';
import Cookies from 'js-cookie';
import {
  getToken,
  setToken,
  removeToken,
  hasToken,
  setUserProfile,
  getUserProfile,
  clearUserProfile,
  clearAuth,
} from '@/utils/security/authStorage';

describe('utils/security/authStorage', () => {
  // 每个用例前清空 cookie
  beforeEach(() => {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach((key) => Cookies.remove(key));
  });

  describe('Token 管理', () => {
    it('默认无 token', () => {
      expect(getToken()).toBeUndefined();
      expect(hasToken()).toBe(false);
    });

    it('setToken 后可读取（会话级）', () => {
      setToken('abc-123');
      expect(getToken()).toBe('abc-123');
      expect(hasToken()).toBe(true);
    });

    it('setToken remember=true 时携带 expires 属性写入（7 天）', () => {
      // js-cookie expires 在 happy-dom 中不会被精确回读，但可确保 cookie 被写入
      setToken('remember-token', true);
      expect(getToken()).toBe('remember-token');
    });

    it('removeToken 后 token 消失', () => {
      setToken('to-be-removed');
      removeToken();
      expect(getToken()).toBeUndefined();
      expect(hasToken()).toBe(false);
    });

    it('setToken 重复调用会覆盖', () => {
      setToken('v1');
      setToken('v2');
      expect(getToken()).toBe('v2');
    });
  });

  describe('用户资料管理', () => {
    it('默认无用户资料', () => {
      expect(getUserProfile()).toBeNull();
    });

    it('setUserProfile 后可按泛型回读', () => {
      const profile = { id: 'u-1', nickname: '张三' };
      setUserProfile(profile);
      const read = getUserProfile<{ id: string; nickname: string }>();
      expect(read).toEqual(profile);
    });

    it('clearUserProfile 后资料消失', () => {
      setUserProfile({ id: 'u-1', nickname: '张三' });
      clearUserProfile();
      expect(getUserProfile()).toBeNull();
    });

    it('损坏的 JSON 资料读取返回 null', () => {
      // 直接绕过 setUserProfile 注入脏数据
      (Cookies as unknown as { set: (k: string, v: string) => void }).set('yunshu_profile', '{bad-json');
      expect(getUserProfile()).toBeNull();
    });
  });

  describe('一键登出', () => {
    it('clearAuth 同时清理 token 与 profile', () => {
      setToken('t');
      setUserProfile({ id: 'u-1' });
      clearAuth();
      expect(getToken()).toBeUndefined();
      expect(getUserProfile()).toBeNull();
    });
  });
});

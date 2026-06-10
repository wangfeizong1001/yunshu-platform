import { describe, it, expect, beforeEach } from 'vitest'
import Cookies from 'js-cookie'
import {
  getToken,
  setToken,
  removeToken,
  hasToken,
  setUserProfile,
  getUserProfile,
  clearUserProfile,
} from '@/utils/security/authStorage'

describe('security/authStorage.ts', () => {
  beforeEach(() => {
    const allCookies = Cookies.get()
    Object.keys(allCookies).forEach((key) => Cookies.remove(key))
  })

  describe('Token 管理', () => {
    it('应该能够设置和读取 Token', () => {
      expect(hasToken()).toBe(false)
      setToken('test-jwt-token-12345')
      expect(hasToken()).toBe(true)
      expect(getToken()).toBe('test-jwt-token-12345')
    })

    it('Token 应该存储为混淆格式（不可直接读取明文）', () => {
      setToken('my-secret-token')
      const rawCookies = Cookies.get()
      const anyCookieValue = Object.values(rawCookies)[0]
      expect(anyCookieValue).not.toBe('my-secret-token')
      expect(getToken()).toBe('my-secret-token')
    })

    it('removeToken 应该清除 Token', () => {
      setToken('token-to-remove')
      expect(hasToken()).toBe(true)
      removeToken()
      expect(hasToken()).toBe(false)
      expect(getToken()).toBe('')
    })

    it('无 Token 时 getToken 返回空字符串', () => {
      expect(getToken()).toBe('')
    })
  })

  describe('用户信息管理', () => {
    it('应该能够设置和读取用户信息', () => {
      const profile = { username: 'testuser', role: 'admin', avatar: '/img.png' }
      setUserProfile(profile)
      const result = getUserProfile<typeof profile>()
      expect(result).toEqual(profile)
    })

    it('用户信息 Cookie 中不应包含明文', () => {
      const profile = { username: 'admin', passwordHint: 'should-not-appear' }
      setUserProfile(profile)
      const rawCookies = Cookies.get()
      Object.values(rawCookies).forEach((value) => {
        expect(value).not.toContain('should-not-appear')
      })
    })

    it('clearUserProfile 应该移除用户信息', () => {
      setUserProfile({ username: 'user' })
      expect(getUserProfile()).not.toBeNull()
      clearUserProfile()
      expect(getUserProfile()).toBeNull()
    })

    it('无用户信息时 getUserProfile 返回 null', () => {
      expect(getUserProfile()).toBeNull()
    })
  })

  describe('安全边界', () => {
    it('对已篡改的 Cookie 值应安全处理', () => {
      document.cookie = 'YUNSHU_AUTH_TOKEN=!!!invalid!!!;path=/'
      expect(() => getToken()).not.toThrow()
    })
  })
})

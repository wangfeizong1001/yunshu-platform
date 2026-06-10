import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  storageGet,
  storageSet,
  storageRemove,
  storageHas,
  storageClear,
  storageUpdate,
  pkey,
} from '@/utils/security/storage'

describe('security/storage.ts', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('storageGet / storageSet (localStorage)', () => {
    it('应该能够写入和读取字符串值', () => {
      storageSet<string>('test-key', 'hello')
      expect(storageGet<string>('test-key')).toBe('hello')
    })

    it('应该能够写入和读取对象值', () => {
      const obj = { name: 'test', value: 123 }
      storageSet<typeof obj>('test-obj', obj)
      const result = storageGet<typeof obj>('test-obj')
      expect(result).toEqual(obj)
    })

    it('读取不存在的键应该返回 null', () => {
      expect(storageGet('non-existent')).toBeNull()
    })

    it('应该支持 TTL 过期机制', () => {
      vi.useFakeTimers()
      storageSet<string>('ttl-key', 'value', 100)
      expect(storageGet<string>('ttl-key')).toBe('value')
      vi.advanceTimersByTime(200)
      expect(storageGet<string>('ttl-key')).toBeNull()
      vi.useRealTimers()
    })
  })

  describe('storageRemove', () => {
    it('应该能够移除已存在的键', () => {
      storageSet('key-to-remove', 'value')
      expect(storageGet('key-to-remove')).toBe('value')
      storageRemove('key-to-remove')
      expect(storageGet('key-to-remove')).toBeNull()
    })

    it('移除不存在的键不应抛出错误', () => {
      expect(() => storageRemove('non-existent')).not.toThrow()
    })
  })

  describe('storageHas', () => {
    it('应该正确检查键是否存在', () => {
      storageSet('exists', 'value')
      expect(storageHas('exists')).toBe(true)
      expect(storageHas('not-exists')).toBe(false)
    })
  })

  describe('storageClear', () => {
    it('应该清空所有存储项', () => {
      storageSet('a', '1')
      storageSet('b', '2')
      storageClear()
      expect(storageGet('a')).toBeNull()
      expect(storageGet('b')).toBeNull()
    })
  })

  describe('storageUpdate', () => {
    it('应该原子更新一个值', () => {
      storageSet<number>('count', 0)
      storageUpdate<number>('count', (prev) => (prev ?? 0) + 1)
      expect(storageGet<number>('count')).toBe(1)
    })

    it('对不存在的键更新时 prev 为 null', () => {
      let receivedPrev: number | null = -1
      storageUpdate<number>('new-key', (prev) => {
        receivedPrev = prev
        return 42
      })
      expect(receivedPrev).toBeNull()
      expect(storageGet<number>('new-key')).toBe(42)
    })
  })

  describe('sessionStorage 驱动', () => {
    it('应该支持写入 sessionStorage', () => {
      storageSet<string>('session-key', 'session-value', undefined, 'session')
      expect(storageGet<string>('session-key', 'session')).toBe('session-value')
      expect(storageGet<string>('session-key', 'local')).toBeNull()
    })
  })

  describe('pkey 前缀工具', () => {
    it('应该添加 yunshu: 前缀', () => {
      expect(pkey('my-key')).toBe('yunshu:my-key')
    })
  })
})

/**
 * 本地存储工具（兼容层 + 泛型封装）
 *
 * ⚠️  本模块为兼容层，内部实际转发至 @/utils/security/storage
 * 新增代码请直接导入 security/storage，便于后续统一替换策略。
 *
 * 泛型说明：
 *   LocalStorage.set<User>('user', user)      // 写入，类型推断为 User
 *   LocalStorage.get<User>('user')            // 读取，返回 User | null
 *   LocalStorage.get<User>('user', defaultUser) // 返回 User
 *
 * 敏感信息（Token、密码、身份证号）请走 @/utils/security/authStorage。
 *
 * @module utils/storage
 */

import {
  storageGet,
  storageSet,
  storageRemove,
  storageClear
} from './security/storage'

/**
 * 基于 localStorage 的泛型存储封装
 */
export const LocalStorage = {
  /**
   * 写入一个值
   * @template T 值类型
   * @param key 存储键
   * @param value 值
   */
  set<T>(key: string, value: T): void {
    storageSet<T>(key, value, undefined, 'local')
  },

  /**
   * 读取一个值
   * @template T 期望返回类型
   * @param key 存储键
   * @param defaultValue 可选：默认值，当键不存在或已过期时返回
   */
  get<T>(key: string, defaultValue?: T): T | null {
    const value = storageGet<T>(key, 'local')
    if (value === null && defaultValue !== undefined) {
      return defaultValue
    }
    return value
  },

  /**
   * 删除一个键
   */
  remove(key: string): void {
    storageRemove(key, 'local')
  },

  /**
   * 清空 localStorage（慎用！）
   */
  clear(): void {
    storageClear('local')
  }
}

/**
 * 基于 sessionStorage 的泛型存储封装（会话结束即失效）
 */
export const SessionStorage = {
  /**
   * 写入一个值（会话级别）
   * @template T 值类型
   * @param key 存储键
   * @param value 值
   */
  set<T>(key: string, value: T): void {
    storageSet<T>(key, value, undefined, 'session')
  },

  /**
   * 读取一个值（会话级别）
   * @template T 期望返回类型
   * @param key 存储键
   * @param defaultValue 可选：默认值
   */
  get<T>(key: string, defaultValue?: T): T | null {
    const value = storageGet<T>(key, 'session')
    if (value === null && defaultValue !== undefined) {
      return defaultValue
    }
    return value
  },

  /**
   * 删除一个键（会话级别）
   */
  remove(key: string): void {
    storageRemove(key, 'session')
  },

  /**
   * 清空 sessionStorage（慎用！）
   */
  clear(): void {
    storageClear('session')
  }
}

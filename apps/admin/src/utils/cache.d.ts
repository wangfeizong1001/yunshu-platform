/**
 * 统一缓存工具
 *
 * 支持 localStorage、sessionStorage 和 Redis 三种缓存方式
 * 前端优先实现 localStorage 版本
 */
import defaultCacheConfig, { CacheType, CACHE_KEYS } from '@/config/cache.config';
export interface CacheItem<T = any> {
  /** 缓存数据 */
  data: T;
  /** 创建时间戳 */
  createdAt: number;
  /** 过期时间戳 */
  expiredAt: number;
}
export interface CacheOptions {
  /** 过期时间（毫秒） */
  ttl?: number;
  /** 缓存类型，默认使用配置中的类型 */
  type?: CacheType;
}
declare class Cache {
  private config;
  /**
   * 获取完整的缓存键名（包含命名空间）
   */
  private getKey;
  /**
   * 获取存储适配器
   */
  private getStorage;
  /**
   * 设置缓存
   * @param key 缓存键名
   * @param data 缓存数据
   * @param options 缓存选项
   */
  set<T>(key: string, data: T, options?: CacheOptions): void;
  /**
   * 获取缓存
   * @param key 缓存键名
   * @param defaultValue 默认值
   * @param options 缓存选项
   */
  get<T>(key: string, defaultValue?: T, options?: CacheOptions): T | undefined;
  /**
   * 移除缓存
   * @param key 缓存键名
   * @param options 缓存选项
   */
  remove(key: string, options?: CacheOptions): void;
  /**
   * 清空所有缓存
   * @param options 缓存选项
   */
  clear(options?: CacheOptions): void;
  /**
   * 检查缓存是否过期
   */
  private isExpired;
  /**
   * 清理所有过期的缓存
   */
  clearExpired(options?: CacheOptions): void;
  /**
   * 检查缓存是否存在且未过期
   */
  has(key: string, options?: CacheOptions): boolean;
  /**
   * 更新缓存配置
   */
  updateConfig(config: Partial<typeof defaultCacheConfig>): void;
}
export declare const cache: Cache;
export { CACHE_KEYS, CacheType };
export default cache;
//# sourceMappingURL=cache.d.ts.map

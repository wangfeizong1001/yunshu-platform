/**
 * 统一缓存工具
 *
 * 支持 localStorage、sessionStorage 和 Redis 三种缓存方式
 * 前端优先实现 localStorage 版本
 */
import defaultCacheConfig, { CacheType, CACHE_KEYS } from '@/config/cache.config';
class Cache {
    config = defaultCacheConfig;
    /**
     * 获取完整的缓存键名（包含命名空间）
     */
    getKey(key) {
        return `${this.config.namespace}:${key}`;
    }
    /**
     * 获取存储适配器
     */
    getStorage(type) {
        const cacheType = type || this.config.type;
        switch (cacheType) {
            case CacheType.LOCAL:
                return window.localStorage;
            case CacheType.SESSION:
                return window.sessionStorage;
            case CacheType.REDIS:
                console.warn('Redis 缓存暂未实现，使用 localStorage 替代');
                return window.localStorage;
            default:
                return window.localStorage;
        }
    }
    /**
     * 设置缓存
     * @param key 缓存键名
     * @param data 缓存数据
     * @param options 缓存选项
     */
    set(key, data, options) {
        if (!this.config.enabled)
            return;
        const storage = this.getStorage(options?.type);
        const ttl = options?.ttl || this.config.defaultTTL;
        const now = Date.now();
        const cacheItem = {
            data,
            createdAt: now,
            expiredAt: now + ttl
        };
        try {
            storage.setItem(this.getKey(key), JSON.stringify(cacheItem));
        }
        catch (error) {
            console.error('设置缓存失败:', error);
            this.clearExpired();
        }
    }
    /**
     * 获取缓存
     * @param key 缓存键名
     * @param defaultValue 默认值
     * @param options 缓存选项
     */
    get(key, defaultValue, options) {
        if (!this.config.enabled)
            return defaultValue;
        const storage = this.getStorage(options?.type);
        const cacheString = storage.getItem(this.getKey(key));
        if (!cacheString) {
            return defaultValue;
        }
        try {
            const cacheItem = JSON.parse(cacheString);
            if (this.isExpired(cacheItem)) {
                this.remove(key, options);
                return defaultValue;
            }
            return cacheItem.data;
        }
        catch (error) {
            console.error('读取缓存失败:', error);
            this.remove(key, options);
            return defaultValue;
        }
    }
    /**
     * 移除缓存
     * @param key 缓存键名
     * @param options 缓存选项
     */
    remove(key, options) {
        const storage = this.getStorage(options?.type);
        storage.removeItem(this.getKey(key));
    }
    /**
     * 清空所有缓存
     * @param options 缓存选项
     */
    clear(options) {
        const storage = this.getStorage(options?.type);
        const prefix = `${this.config.namespace}:`;
        const toRemove = [];
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key?.startsWith(prefix)) {
                toRemove.push(key);
            }
        }
        for (const key of toRemove) {
            storage.removeItem(key);
        }
    }
    /**
     * 检查缓存是否过期
     */
    isExpired(cacheItem) {
        return Date.now() > cacheItem.expiredAt;
    }
    /**
     * 清理所有过期的缓存
     */
    clearExpired(options) {
        const storage = this.getStorage(options?.type);
        const prefix = `${this.config.namespace}:`;
        const toRemove = [];
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key?.startsWith(prefix)) {
                try {
                    const cacheString = storage.getItem(key);
                    if (cacheString) {
                        const cacheItem = JSON.parse(cacheString);
                        if (this.isExpired(cacheItem)) {
                            toRemove.push(key);
                        }
                    }
                }
                catch {
                    toRemove.push(key);
                }
            }
        }
        for (const key of toRemove) {
            storage.removeItem(key);
        }
    }
    /**
     * 检查缓存是否存在且未过期
     */
    has(key, options) {
        const storage = this.getStorage(options?.type);
        const cacheString = storage.getItem(this.getKey(key));
        if (!cacheString) {
            return false;
        }
        try {
            const cacheItem = JSON.parse(cacheString);
            return !this.isExpired(cacheItem);
        }
        catch {
            return false;
        }
    }
    /**
     * 更新缓存配置
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
}
export const cache = new Cache();
export { CACHE_KEYS, CacheType };
export default cache;
//# sourceMappingURL=cache.js.map
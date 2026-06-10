/**
 * 缓存配置
 *
 * 定义了应用级别的缓存配置，包括缓存类型、过期时间、命名空间等
 */
export declare enum CacheType {
    LOCAL = "local",
    SESSION = "session",
    REDIS = "redis"
}
export interface CacheConfig {
    /** 缓存类型 */
    type: CacheType;
    /** 缓存命名空间 */
    namespace: string;
    /** 默认过期时间（毫秒），默认 30 分钟 */
    defaultTTL: number;
    /** 是否启用缓存 */
    enabled: boolean;
    /** 是否在页面刷新后保留缓存 */
    persist: boolean;
}
/** 默认缓存配置 */
export declare const defaultCacheConfig: CacheConfig;
/** 缓存键名前缀 */
export declare const CACHE_KEYS: {
    USER_INFO: string;
    TOKEN: string;
    TENANT_ID: string;
    MENU_LIST: string;
    PERMISSIONS: string;
    DICT: string;
    REQUEST: string;
};
export default defaultCacheConfig;
//# sourceMappingURL=cache.config.d.ts.map
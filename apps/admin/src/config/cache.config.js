/**
 * 缓存配置
 *
 * 定义了应用级别的缓存配置，包括缓存类型、过期时间、命名空间等
 */
export var CacheType;
(function (CacheType) {
  CacheType['LOCAL'] = 'local';
  CacheType['SESSION'] = 'session';
  CacheType['REDIS'] = 'redis';
})(CacheType || (CacheType = {}));
/** 默认缓存配置 */
export const defaultCacheConfig = {
  type: CacheType.LOCAL,
  namespace: 'yunshu_cache',
  defaultTTL: 30 * 60 * 1000,
  enabled: true,
  persist: true,
};
/** 缓存键名前缀 */
export const CACHE_KEYS = {
  USER_INFO: 'user_info',
  TOKEN: 'token',
  TENANT_ID: 'tenant_id',
  MENU_LIST: 'menu_list',
  PERMISSIONS: 'permissions',
  DICT: 'dict',
  REQUEST: 'request',
};
export default defaultCacheConfig;
//# sourceMappingURL=cache.config.js.map

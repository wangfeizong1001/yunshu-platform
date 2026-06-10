/**
 * 缓存 Hooks
 *
 * 提供响应式的缓存管理能力
 */
import { type Ref, type ComputedRef } from 'vue';
import { CacheOptions } from '@/utils/cache';
export interface UseCacheOptions extends CacheOptions {
    /** 是否在初始化时自动从缓存读取 */
    autoLoad?: boolean;
    /** 是否在值变化时自动保存到缓存 */
    autoSave?: boolean;
}
export interface UseCacheReturn<T> {
    data: Ref<any>;
    hasCache: ComputedRef<any>;
    set: (value: T, newOptions?: CacheOptions) => void;
    get: () => T | undefined;
    remove: () => void;
    refresh: () => void;
}
export declare function useCache<T = any>(key: string, defaultValue?: T, options?: UseCacheOptions): UseCacheReturn<T>;
export default useCache;
//# sourceMappingURL=useCache.d.ts.map
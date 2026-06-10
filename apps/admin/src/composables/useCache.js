/**
 * 缓存 Hooks
 *
 * 提供响应式的缓存管理能力
 */
import { ref, computed, watch } from 'vue';
import cache from '@/utils/cache';
export function useCache(key, defaultValue, options = {}) {
    const { autoLoad = true, autoSave = true, ...cacheOptions } = options;
    const data = ref(autoLoad ? cache.get(key, defaultValue, cacheOptions) : defaultValue);
    const hasCache = computed(() => cache.has(key, cacheOptions));
    const set = (value, newOptions) => {
        data.value = value;
        cache.set(key, value, { ...cacheOptions, ...newOptions });
    };
    const get = () => {
        const value = cache.get(key, defaultValue, cacheOptions);
        data.value = value;
        return value;
    };
    const remove = () => {
        data.value = undefined;
        cache.remove(key, cacheOptions);
    };
    const refresh = () => {
        get();
    };
    if (autoSave) {
        watch(data, (newValue) => {
            if (newValue !== undefined) {
                cache.set(key, newValue, cacheOptions);
            }
        }, { deep: true });
    }
    return {
        data,
        hasCache,
        set,
        get,
        remove,
        refresh
    };
}
export default useCache;
//# sourceMappingURL=useCache.js.map
/**
 * 缓存 Hooks
 *
 * 提供响应式的缓存管理能力
 */

import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import cache, { CacheOptions } from '@/utils/cache'

export interface UseCacheOptions extends CacheOptions {
  /** 是否在初始化时自动从缓存读取 */
  autoLoad?: boolean
  /** 是否在值变化时自动保存到缓存 */
  autoSave?: boolean
}

export interface UseCacheReturn<T> {
  data: Ref<T | undefined>
  hasCache: ComputedRef<boolean>
  set: (value: T, newOptions?: CacheOptions) => void
  get: () => T | undefined
  remove: () => void
  refresh: () => void
}

export function useCache<T = unknown>(
  key: string,
  defaultValue?: T,
  options: UseCacheOptions = {}
): UseCacheReturn<T> {
  const { autoLoad = true, autoSave = true, ...cacheOptions } = options

  const data = ref<T | undefined>(autoLoad ? cache.get<T>(key, defaultValue, cacheOptions) : defaultValue)

  const hasCache = computed(() => cache.has(key, cacheOptions))

  const set = (value: T, newOptions?: CacheOptions) => {
    data.value = value
    cache.set(key, value, { ...cacheOptions, ...newOptions })
  }

  const get = () => {
    const value = cache.get<T>(key, defaultValue, cacheOptions)
    data.value = value
    return value
  }

  const remove = () => {
    data.value = undefined
    cache.remove(key, cacheOptions)
  }

  const refresh = () => {
    get()
  }

  if (autoSave) {
    watch(
      data,
      (newValue) => {
        if (newValue !== undefined) {
          cache.set(key, newValue, cacheOptions)
        }
      },
      { deep: true }
    )
  }

  return {
    data,
    hasCache,
    set,
    get,
    remove,
    refresh
  }
}

export default useCache

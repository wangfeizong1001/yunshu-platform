import { defineStore } from 'pinia'

interface TagView {
  path: string
  name: string
  title?: string
  query?: Record<string, unknown>
  params?: Record<string, unknown>
  meta?: Record<string, unknown>
}

interface TagsViewState {
  visitedViews: { value: TagView[] }
  cachedViews: { value: string[] }
}

function useLocalStorage<T>(key: string, defaultValue: T): { value: T } {
  const storedValue = localStorage.getItem(key)
  let value: T
  try {
    value = storedValue ? JSON.parse(storedValue) as T : defaultValue
  } catch {
    value = defaultValue
  }

  return {
    get value() {
      return value
    },
    set value(newValue: T) {
      value = newValue
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }
}

export const useTagsViewStore = defineStore('tagsView', () => {
  const visitedViews = useLocalStorage<TagView[]>('visited-views', [])
  const cachedViews = useLocalStorage<string[]>('cached-views', [])

  const addVisitedView = (view: TagView) => {
    if (visitedViews.value.some((v) => v.path === view.path)) {
      return
    }

    visitedViews.value.push({
      ...view,
      title: (view.meta?.title as string) || view.name || '未命名'
    })

    if (view.name && !cachedViews.value.includes(view.name)) {
      cachedViews.value.push(view.name)
    }
  }

  const delVisitedView = (view: TagView) => {
    const index = visitedViews.value.findIndex((v) => v.path === view.path)
    if (index !== -1) {
      visitedViews.value.splice(index, 1)
    }

    const cacheIndex = cachedViews.value.findIndex((name) => name === view.name)
    if (cacheIndex !== -1) {
      cachedViews.value.splice(cacheIndex, 1)
    }
  }

  const delOtherViews = (view: TagView) => {
    visitedViews.value = visitedViews.value.filter((v) => {
      return v.path === view.path || ((v.meta?.affix as boolean) && v.path !== view.path)
    })

    cachedViews.value = cachedViews.value.filter((name) => {
      return name === view.name || visitedViews.value.some((v) => v.name === name)
    })
  }

  const delAllViews = () => {
    const affixViews = visitedViews.value.filter((v) => v.meta?.affix as boolean)
    visitedViews.value = affixViews
    cachedViews.value = []
  }

  const delCachedView = (view: TagView) => {
    const index = cachedViews.value.findIndex((name) => name === view.name)
    if (index !== -1) {
      cachedViews.value.splice(index, 1)
    }
  }

  const updateVisitedView = (view: TagView) => {
    const index = visitedViews.value.findIndex((v) => v.path === view.path)
    if (index !== -1) {
      visitedViews.value[index] = { ...visitedViews.value[index], ...view }
    }
  }

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    delVisitedView,
    delOtherViews,
    delAllViews,
    delCachedView,
    updateVisitedView
  }
})

export type { TagsViewState }

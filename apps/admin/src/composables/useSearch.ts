/**
 * 搜索组合式函数
 *
 * 提供搜索功能的 Vue 组合式 API
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  createSearchIndex,
  LocalSearchIndex,
  SearchDocument,
  SearchIndexConfig
} from '@/utils/search'

/** 搜索状态 */
export interface SearchState<T extends SearchDocument = SearchDocument> {
  /** 搜索关键词 */
  query: string
  /** 搜索结果 */
  results: Array<{
    document: T
    score: number
    matchedFields: string[]
    highlights: Map<string, string>
  }>
  /** 是否正在搜索 */
  loading: boolean
  /** 是否有搜索结果 */
  hasResults: boolean
  /** 搜索历史 */
  history: string[]
  /** 搜索建议 */
  suggestions: string[]
  /** 错误信息 */
  error: string | null
}

/** 搜索 Hook 配置 */
export interface UseSearchConfig<T extends SearchDocument = SearchDocument> {
  /** 搜索索引配置 */
  indexConfig: SearchIndexConfig
  /** 初始文档数据 */
  initialDocuments?: T[]
  /** 防抖延迟（毫秒） */
  debounceDelay?: number
  /** 最大搜索历史数量 */
  maxHistorySize?: number
  /** 是否自动保存搜索历史 */
  autoSaveHistory?: boolean
  /** 历史存储 key */
  historyStorageKey?: string
  /** 是否启用搜索建议 */
  enableSuggestions?: boolean
  /** 最大结果数量 */
  maxResults?: number
}

/**
 * 搜索组合式函数
 */
export function useSearch<T extends SearchDocument = SearchDocument>(
  config: UseSearchConfig<T>
) {
  const {
    indexConfig,
    initialDocuments = [],
    debounceDelay = 300,
    maxHistorySize = 10,
    autoSaveHistory = true,
    historyStorageKey = 'search_history',
    enableSuggestions = true,
    maxResults = 50
  } = config

  // 搜索索引实例
  let searchIndex: LocalSearchIndex<T> | null = null

  // 搜索状态
  const state = ref<SearchState<T>>({
    query: '',
    results: [],
    loading: false,
    hasResults: false,
    history: [],
    suggestions: [],
    error: null
  })

  // 防抖定时器
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * 初始化搜索索引
   */
  const initIndex = () => {
    searchIndex = createSearchIndex<T>(indexConfig)
    if (initialDocuments.length > 0) {
      searchIndex.addDocuments(initialDocuments)
    }
  }

  /**
   * 加载搜索历史
   */
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(historyStorageKey)
      if (stored) {
        state.value.history = JSON.parse(stored)
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error)
    }
  }

  /**
   * 保存搜索历史
   */
  const saveHistory = () => {
    try {
      localStorage.setItem(historyStorageKey, JSON.stringify(state.value.history))
    } catch (error) {
      console.error('保存搜索历史失败:', error)
    }
  }

  /**
   * 添加搜索历史
   */
  const addToHistory = (query: string) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    // 移除已存在的相同查询
    state.value.history = state.value.history.filter(q => q !== trimmedQuery)
    // 添加到开头
    state.value.history.unshift(trimmedQuery)
    // 限制数量
    if (state.value.history.length > maxHistorySize) {
      state.value.history.pop()
    }

    if (autoSaveHistory) {
      saveHistory()
    }
  }

  /**
   * 清空搜索历史
   */
  const clearHistory = () => {
    state.value.history = []
    if (autoSaveHistory) {
      saveHistory()
    }
  }

  /**
   * 执行搜索
   */
  const performSearch = () => {
    if (!searchIndex) return

    state.value.loading = true
    state.value.error = null

    try {
      const query = state.value.query.trim()

      if (!query) {
        state.value.results = []
        state.value.hasResults = false
        state.value.suggestions = []
        return
      }

      const results = searchIndex.search(query, maxResults)
      state.value.results = results
      state.value.hasResults = results.length > 0

      // 生成搜索建议
      if (enableSuggestions) {
        generateSuggestions(query)
      }

      // 添加到历史
      addToHistory(query)
    } catch (error) {
      state.value.error = error instanceof Error ? error.message : '搜索失败'
      console.error('搜索错误:', error)
    } finally {
      state.value.loading = false
    }
  }

  /**
   * 生成搜索建议
   */
  const generateSuggestions = (query: string) => {
    const trimmedQuery = query.trim().toLowerCase()
    if (!trimmedQuery || !searchIndex) {
      state.value.suggestions = []
      return
    }

    const suggestions = new Set<string>()

    // 从历史记录中匹配
    state.value.history.forEach((h) => {
      if (h.toLowerCase().includes(trimmedQuery) && h !== trimmedQuery) {
        suggestions.add(h)
      }
    })

    // 从搜索结果中提取关键词
    state.value.results.forEach((result) => {
      result.matchedFields.forEach((field) => {
        const value = String(result.document[field] || '')
        const words = value.split(/\s+/)
        words.forEach((word) => {
          if (word.toLowerCase().includes(trimmedQuery) && word.length > 2) {
            suggestions.add(word)
          }
        })
      })
    })

    state.value.suggestions = Array.from(suggestions).slice(0, 10)
  }

  /**
   * 设置搜索查询
   */
  const setQuery = (query: string) => {
    state.value.query = query
  }

  /**
   * 防抖搜索
   */
  const debouncedSearch = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      performSearch()
    }, debounceDelay)
  }

  /**
   * 立即搜索
   */
  const search = (query?: string) => {
    if (query !== undefined) {
      state.value.query = query
    }
    performSearch()
  }

  /**
   * 重置搜索
   */
  const reset = () => {
    state.value.query = ''
    state.value.results = []
    state.value.hasResults = false
    state.value.suggestions = []
    state.value.error = null
  }

  /**
   * 添加文档到索引
   */
  const addDocument = (document: T) => {
    if (searchIndex) {
      searchIndex.addDocument(document)
    }
  }

  /**
   * 批量添加文档
   */
  const addDocuments = (documents: T[]) => {
    if (searchIndex) {
      searchIndex.addDocuments(documents)
    }
  }

  /**
   * 更新文档
   */
  const updateDocument = (document: T) => {
    if (searchIndex) {
      searchIndex.updateDocument(document)
    }
  }

  /**
   * 移除文档
   */
  const removeDocument = (docId: string | number) => {
    if (searchIndex) {
      searchIndex.removeDocument(docId)
      // 重新搜索以更新结果
      if (state.value.query) {
        performSearch()
      }
    }
  }

  /**
   * 清空索引
   */
  const clearIndex = () => {
    if (searchIndex) {
      searchIndex.clear()
    }
    reset()
  }

  /**
   * 获取索引统计信息
   */
  const getIndexStats = () => {
    if (!searchIndex) {
      return { documentCount: 0, tokenCount: 0 }
    }
    return {
      documentCount: searchIndex.getDocumentCount(),
      tokenCount: searchIndex.getTokenCount()
    }
  }

  // 监听查询变化，自动搜索
  watch(
    () => state.value.query,
    () => {
      debouncedSearch()
    }
  )

  // 生命周期
  onMounted(() => {
    initIndex()
    loadHistory()
  })

  onUnmounted(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  })

  return {
    // 状态
    state,
    query: computed(() => state.value.query),
    results: computed(() => state.value.results),
    loading: computed(() => state.value.loading),
    hasResults: computed(() => state.value.hasResults),
    history: computed(() => state.value.history),
    suggestions: computed(() => state.value.suggestions),
    error: computed(() => state.value.error),

    // 方法
    setQuery,
    search,
    reset,
    addDocument,
    addDocuments,
    updateDocument,
    removeDocument,
    clearIndex,
    clearHistory,
    getIndexStats,

    // 索引实例（高级用法）
    getSearchIndex: () => searchIndex
  }
}

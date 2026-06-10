/**
 * 搜索组合式函数
 *
 * 提供搜索功能的 Vue 组合式 API
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { createSearchIndex } from '@/utils/search';
/**
 * 搜索组合式函数
 */
export function useSearch(config) {
  const {
    indexConfig,
    initialDocuments = [],
    debounceDelay = 300,
    maxHistorySize = 10,
    autoSaveHistory = true,
    historyStorageKey = 'search_history',
    enableSuggestions = true,
    maxResults = 50,
  } = config;
  // 搜索索引实例
  let searchIndex = null;
  // 搜索状态
  const state = ref({
    query: '',
    results: [],
    loading: false,
    hasResults: false,
    history: [],
    suggestions: [],
    error: null,
  });
  // 防抖定时器
  let debounceTimer = null;
  /**
   * 初始化搜索索引
   */
  const initIndex = () => {
    searchIndex = createSearchIndex(indexConfig);
    if (initialDocuments.length > 0) {
      searchIndex.addDocuments(initialDocuments);
    }
  };
  /**
   * 加载搜索历史
   */
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(historyStorageKey);
      if (stored) {
        state.value.history = JSON.parse(stored);
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error);
    }
  };
  /**
   * 保存搜索历史
   */
  const saveHistory = () => {
    try {
      localStorage.setItem(historyStorageKey, JSON.stringify(state.value.history));
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  };
  /**
   * 添加搜索历史
   */
  const addToHistory = (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    // 移除已存在的相同查询
    state.value.history = state.value.history.filter((q) => q !== trimmedQuery);
    // 添加到开头
    state.value.history.unshift(trimmedQuery);
    // 限制数量
    if (state.value.history.length > maxHistorySize) {
      state.value.history.pop();
    }
    if (autoSaveHistory) {
      saveHistory();
    }
  };
  /**
   * 清空搜索历史
   */
  const clearHistory = () => {
    state.value.history = [];
    if (autoSaveHistory) {
      saveHistory();
    }
  };
  /**
   * 执行搜索
   */
  const performSearch = () => {
    if (!searchIndex) return;
    state.value.loading = true;
    state.value.error = null;
    try {
      const query = state.value.query.trim();
      if (!query) {
        state.value.results = [];
        state.value.hasResults = false;
        state.value.suggestions = [];
        return;
      }
      const results = searchIndex.search(query, maxResults);
      state.value.results = results;
      state.value.hasResults = results.length > 0;
      // 生成搜索建议
      if (enableSuggestions) {
        generateSuggestions(query);
      }
      // 添加到历史
      addToHistory(query);
    } catch (error) {
      state.value.error = error instanceof Error ? error.message : '搜索失败';
      console.error('搜索错误:', error);
    } finally {
      state.value.loading = false;
    }
  };
  /**
   * 生成搜索建议
   */
  const generateSuggestions = (query) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery || !searchIndex) {
      state.value.suggestions = [];
      return;
    }
    const suggestions = new Set();
    // 从历史记录中匹配
    state.value.history.forEach((h) => {
      if (h.toLowerCase().includes(trimmedQuery) && h !== trimmedQuery) {
        suggestions.add(h);
      }
    });
    // 从搜索结果中提取关键词
    state.value.results.forEach((result) => {
      result.matchedFields.forEach((field) => {
        const value = String(result.document[field] || '');
        const words = value.split(/\s+/);
        words.forEach((word) => {
          if (word.toLowerCase().includes(trimmedQuery) && word.length > 2) {
            suggestions.add(word);
          }
        });
      });
    });
    state.value.suggestions = Array.from(suggestions).slice(0, 10);
  };
  /**
   * 设置搜索查询
   */
  const setQuery = (query) => {
    state.value.query = query;
  };
  /**
   * 防抖搜索
   */
  const debouncedSearch = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      performSearch();
    }, debounceDelay);
  };
  /**
   * 立即搜索
   */
  const search = (query) => {
    if (query !== undefined) {
      state.value.query = query;
    }
    performSearch();
  };
  /**
   * 重置搜索
   */
  const reset = () => {
    state.value.query = '';
    state.value.results = [];
    state.value.hasResults = false;
    state.value.suggestions = [];
    state.value.error = null;
  };
  /**
   * 添加文档到索引
   */
  const addDocument = (document) => {
    if (searchIndex) {
      searchIndex.addDocument(document);
    }
  };
  /**
   * 批量添加文档
   */
  const addDocuments = (documents) => {
    if (searchIndex) {
      searchIndex.addDocuments(documents);
    }
  };
  /**
   * 更新文档
   */
  const updateDocument = (document) => {
    if (searchIndex) {
      searchIndex.updateDocument(document);
    }
  };
  /**
   * 移除文档
   */
  const removeDocument = (docId) => {
    if (searchIndex) {
      searchIndex.removeDocument(docId);
      // 重新搜索以更新结果
      if (state.value.query) {
        performSearch();
      }
    }
  };
  /**
   * 清空索引
   */
  const clearIndex = () => {
    if (searchIndex) {
      searchIndex.clear();
    }
    reset();
  };
  /**
   * 获取索引统计信息
   */
  const getIndexStats = () => {
    if (!searchIndex) {
      return { documentCount: 0, tokenCount: 0 };
    }
    return {
      documentCount: searchIndex.getDocumentCount(),
      tokenCount: searchIndex.getTokenCount(),
    };
  };
  // 监听查询变化，自动搜索
  watch(
    () => state.value.query,
    () => {
      debouncedSearch();
    },
  );
  // 生命周期
  onMounted(() => {
    initIndex();
    loadHistory();
  });
  onUnmounted(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });
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
    getSearchIndex: () => searchIndex,
  };
}
//# sourceMappingURL=useSearch.js.map

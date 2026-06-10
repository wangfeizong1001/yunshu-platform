/**
 * 搜索组合式函数
 *
 * 提供搜索功能的 Vue 组合式 API
 */
import { LocalSearchIndex, SearchDocument, SearchIndexConfig } from '@/utils/search';
/** 搜索状态 */
export interface SearchState<T extends SearchDocument = SearchDocument> {
    /** 搜索关键词 */
    query: string;
    /** 搜索结果 */
    results: Array<{
        document: T;
        score: number;
        matchedFields: string[];
        highlights: Map<string, string>;
    }>;
    /** 是否正在搜索 */
    loading: boolean;
    /** 是否有搜索结果 */
    hasResults: boolean;
    /** 搜索历史 */
    history: string[];
    /** 搜索建议 */
    suggestions: string[];
    /** 错误信息 */
    error: string | null;
}
/** 搜索 Hook 配置 */
export interface UseSearchConfig<T extends SearchDocument = SearchDocument> {
    /** 搜索索引配置 */
    indexConfig: SearchIndexConfig;
    /** 初始文档数据 */
    initialDocuments?: T[];
    /** 防抖延迟（毫秒） */
    debounceDelay?: number;
    /** 最大搜索历史数量 */
    maxHistorySize?: number;
    /** 是否自动保存搜索历史 */
    autoSaveHistory?: boolean;
    /** 历史存储 key */
    historyStorageKey?: string;
    /** 是否启用搜索建议 */
    enableSuggestions?: boolean;
    /** 最大结果数量 */
    maxResults?: number;
}
/**
 * 搜索组合式函数
 */
export declare function useSearch<T extends SearchDocument = SearchDocument>(config: UseSearchConfig<T>): {
    state: import("vue").Ref<{
        query: string;
        results: {
            document: import("vue").UnwrapRef<T>;
            score: number;
            matchedFields: string[];
            highlights: Map<string, string> & Omit<Map<string, string>, keyof Map<any, any>>;
        }[];
        loading: boolean;
        hasResults: boolean;
        history: string[];
        suggestions: string[];
        error: string | null;
    }, SearchState<T> | {
        query: string;
        results: {
            document: import("vue").UnwrapRef<T>;
            score: number;
            matchedFields: string[];
            highlights: Map<string, string> & Omit<Map<string, string>, keyof Map<any, any>>;
        }[];
        loading: boolean;
        hasResults: boolean;
        history: string[];
        suggestions: string[];
        error: string | null;
    }>;
    query: import("vue").ComputedRef<string>;
    results: import("vue").ComputedRef<{
        document: import("vue").UnwrapRef<T>;
        score: number;
        matchedFields: string[];
        highlights: Map<string, string> & Omit<Map<string, string>, keyof Map<any, any>>;
    }[]>;
    loading: import("vue").ComputedRef<boolean>;
    hasResults: import("vue").ComputedRef<boolean>;
    history: import("vue").ComputedRef<string[]>;
    suggestions: import("vue").ComputedRef<string[]>;
    error: import("vue").ComputedRef<string | null>;
    setQuery: (query: string) => void;
    search: (query?: string) => void;
    reset: () => void;
    addDocument: (document: T) => void;
    addDocuments: (documents: T[]) => void;
    updateDocument: (document: T) => void;
    removeDocument: (docId: string | number) => void;
    clearIndex: () => void;
    clearHistory: () => void;
    getIndexStats: () => {
        documentCount: number;
        tokenCount: number;
    };
    getSearchIndex: () => LocalSearchIndex<T> | null;
};
//# sourceMappingURL=useSearch.d.ts.map
/**
 * 搜索 Mock 数据
 */
import type { SearchResponse, HotSearchResponse, SearchHistoryItem, SearchType } from '@/api/search.api';
/**
 * 获取搜索结果
 */
export declare function getMockSearchResults(params: {
    keyword: string;
    type?: SearchType;
    pageNum?: number;
    pageSize?: number;
}): SearchResponse;
/**
 * 获取热门搜索
 */
export declare function getMockHotSearches(limit?: number): HotSearchResponse;
/**
 * 获取搜索历史
 */
export declare function getMockSearchHistory(limit?: number): SearchHistoryItem[];
/**
 * 保存搜索历史
 */
export declare function saveMockSearchHistory(data: {
    keyword: string;
    type?: SearchType;
}): void;
/**
 * 删除搜索历史
 */
export declare function deleteMockSearchHistory(id: string | number): void;
/**
 * 清空搜索历史
 */
export declare function clearMockSearchHistory(): void;
/**
 * 获取搜索统计
 */
export declare function getMockSearchStats(): {
    totalSearches: number;
    todaySearches: number;
    activeUsers: number;
    indexedDocs: number;
};
//# sourceMappingURL=search.mock.d.ts.map
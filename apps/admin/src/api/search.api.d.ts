/**
 * 搜索 API
 *
 * 提供搜索相关的后端接口
 */
/** 搜索类型 */
export type SearchType = 'all' | 'user' | 'dept' | 'menu' | 'role' | 'notice' | 'knowledge';
/** 搜索请求参数 */
export interface SearchQueryParams {
    /** 搜索关键词 */
    keyword: string;
    /** 搜索类型 */
    type?: SearchType;
    /** 页码 */
    pageNum?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 筛选条件 */
    filters?: Record<string, unknown>;
}
/** 搜索结果项 */
export interface SearchResultItem {
    /** 结果ID */
    id: string | number;
    /** 结果类型 */
    type: SearchType;
    /** 标题 */
    title: string;
    /** 描述/摘要 */
    description?: string;
    /** 内容 */
    content?: string;
    /** 高亮字段 */
    highlights?: Record<string, string>;
    /** 匹配分数 */
    score?: number;
    /** 链接地址 */
    url?: string;
    /** 额外数据 */
    extra?: Record<string, unknown>;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
}
/** 搜索响应 */
export interface SearchResponse {
    /** 搜索结果列表 */
    list: SearchResultItem[];
    /** 总数 */
    total: number;
    /** 页码 */
    pageNum: number;
    /** 每页数量 */
    pageSize: number;
    /** 搜索用时（毫秒） */
    took?: number;
    /** 建议关键词 */
    suggestions?: string[];
}
/** 热门搜索响应 */
export interface HotSearchResponse {
    /** 热门搜索词列表 */
    keywords: {
        keyword: string;
        count: number;
    }[];
}
/** 搜索历史记录 */
export interface SearchHistoryItem {
    /** 记录ID */
    id: string | number;
    /** 搜索关键词 */
    keyword: string;
    /** 搜索时间 */
    searchTime: string;
    /** 搜索类型 */
    type?: SearchType;
}
/**
 * 执行搜索
 */
export declare function search(params: SearchQueryParams): Promise<SearchResponse>;
/**
 * 搜索用户
 */
export declare function searchUsers(params: Omit<SearchQueryParams, 'type'>): Promise<SearchResponse>;
/**
 * 搜索部门
 */
export declare function searchDepts(params: Omit<SearchQueryParams, 'type'>): Promise<SearchResponse>;
/**
 * 搜索菜单
 */
export declare function searchMenus(params: Omit<SearchQueryParams, 'type'>): Promise<SearchResponse>;
/**
 * 搜索角色
 */
export declare function searchRoles(params: Omit<SearchQueryParams, 'type'>): Promise<SearchResponse>;
/**
 * 搜索公告
 */
export declare function searchNotices(params: Omit<SearchQueryParams, 'type'>): Promise<SearchResponse>;
/**
 * 搜索知识
 */
export declare function searchKnowledge(params: Omit<SearchQueryParams, 'type'>): Promise<SearchResponse>;
/**
 * 获取热门搜索
 */
export declare function getHotSearches(limit?: number): Promise<HotSearchResponse>;
/**
 * 获取搜索建议
 */
export declare function getSearchSuggestions(keyword: string, limit?: number): Promise<string[]>;
/**
 * 获取搜索历史
 */
export declare function getSearchHistory(limit?: number): Promise<SearchHistoryItem[]>;
/**
 * 保存搜索历史
 */
export declare function saveSearchHistory(data: {
    keyword: string;
    type?: SearchType;
}): Promise<unknown>;
/**
 * 清空搜索历史
 */
export declare function clearSearchHistory(): Promise<unknown>;
/**
 * 删除单条搜索历史
 */
export declare function deleteSearchHistory(id: string | number): Promise<unknown>;
/**
 * 重建搜索索引
 */
export declare function rebuildSearchIndex(type?: SearchType): Promise<unknown>;
/**
 * 获取搜索统计
 */
export declare function getSearchStats(): Promise<{
    /** 总搜索次数 */
    totalSearches: number;
    /** 今日搜索次数 */
    todaySearches: number;
    /** 活跃用户数 */
    activeUsers: number;
    /** 索引文档数 */
    indexedDocs: number;
}>;
//# sourceMappingURL=search.api.d.ts.map
/**
 * 搜索 API
 *
 * 提供搜索相关的后端接口
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

/** 搜索类型 */
export type SearchType =
  | 'all'
  | 'user'
  | 'dept'
  | 'menu'
  | 'role'
  | 'notice'
  | 'knowledge'

/** 搜索请求参数 */
export interface SearchQueryParams {
  /** 搜索关键词 */
  keyword: string
  /** 搜索类型 */
  type?: SearchType
  /** 页码 */
  pageNum?: number
  /** 每页数量 */
  pageSize?: number
  /** 筛选条件 */
  filters?: Record<string, unknown>
}

/** 搜索结果项 */
export interface SearchResultItem {
  /** 结果ID */
  id: string | number
  /** 结果类型 */
  type: SearchType
  /** 标题 */
  title: string
  /** 描述/摘要 */
  description?: string
  /** 内容 */
  content?: string
  /** 高亮字段 */
  highlights?: Record<string, string>
  /** 匹配分数 */
  score?: number
  /** 链接地址 */
  url?: string
  /** 额外数据 */
  extra?: Record<string, unknown>
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/** 搜索响应 */
export interface SearchResponse {
  /** 搜索结果列表 */
  list: SearchResultItem[]
  /** 总数 */
  total: number
  /** 页码 */
  pageNum: number
  /** 每页数量 */
  pageSize: number
  /** 搜索用时（毫秒） */
  took?: number
  /** 建议关键词 */
  suggestions?: string[]
}

/** 热门搜索响应 */
export interface HotSearchResponse {
  /** 热门搜索词列表 */
  keywords: {
    keyword: string
    count: number
  }[]
}

/** 搜索历史记录 */
export interface SearchHistoryItem {
  /** 记录ID */
  id: string | number
  /** 搜索关键词 */
  keyword: string
  /** 搜索时间 */
  searchTime: string
  /** 搜索类型 */
  type?: SearchType
}

/**
 * 执行搜索
 */
export function search(params: SearchQueryParams) {
  return request<SearchResponse>({
    url: '/search',
    method: 'GET',
    params
  })
}

/**
 * 搜索用户
 */
export function searchUsers(params: Omit<SearchQueryParams, 'type'>) {
  return request<SearchResponse>({
    url: '/search/users',
    method: 'GET',
    params
  })
}

/**
 * 搜索部门
 */
export function searchDepts(params: Omit<SearchQueryParams, 'type'>) {
  return request<SearchResponse>({
    url: '/search/depts',
    method: 'GET',
    params
  })
}

/**
 * 搜索菜单
 */
export function searchMenus(params: Omit<SearchQueryParams, 'type'>) {
  return request<SearchResponse>({
    url: '/search/menus',
    method: 'GET',
    params
  })
}

/**
 * 搜索角色
 */
export function searchRoles(params: Omit<SearchQueryParams, 'type'>) {
  return request<SearchResponse>({
    url: '/search/roles',
    method: 'GET',
    params
  })
}

/**
 * 搜索公告
 */
export function searchNotices(params: Omit<SearchQueryParams, 'type'>) {
  return request<SearchResponse>({
    url: '/search/notices',
    method: 'GET',
    params
  })
}

/**
 * 搜索知识
 */
export function searchKnowledge(params: Omit<SearchQueryParams, 'type'>) {
  return request<SearchResponse>({
    url: '/search/knowledge',
    method: 'GET',
    params
  })
}

/**
 * 获取热门搜索
 */
export function getHotSearches(limit = 10) {
  return request<HotSearchResponse>({
    url: '/search/hot',
    method: 'GET',
    params: { limit }
  })
}

/**
 * 获取搜索建议
 */
export function getSearchSuggestions(keyword: string, limit = 10) {
  return request<string[]>({
    url: '/search/suggestions',
    method: 'GET',
    params: { keyword, limit }
  })
}

/**
 * 获取搜索历史
 */
export function getSearchHistory(limit = 20) {
  return request<SearchHistoryItem[]>({
    url: '/search/history',
    method: 'GET',
    params: { limit }
  })
}

/**
 * 保存搜索历史
 */
export function saveSearchHistory(data: { keyword: string; type?: SearchType }) {
  return request<void>({
    url: '/search/history',
    method: 'POST',
    data
  })
}

/**
 * 清空搜索历史
 */
export function clearSearchHistory() {
  return request<void>({
    url: '/search/history',
    method: 'DELETE'
  })
}

/**
 * 删除单条搜索历史
 */
export function deleteSearchHistory(id: string | number) {
  return request<void>({
    url: `/search/history/${id}`,
    method: 'DELETE'
  })
}

/**
 * 重建搜索索引
 */
export function rebuildSearchIndex(type?: SearchType) {
  return request<void>({
    url: '/search/rebuild',
    method: 'POST',
    data: type ? { type } : undefined
  })
}

/**
 * 获取搜索统计
 */
export function getSearchStats() {
  return request<{
    /** 总搜索次数 */
    totalSearches: number
    /** 今日搜索次数 */
    todaySearches: number
    /** 活跃用户数 */
    activeUsers: number
    /** 索引文档数 */
    indexedDocs: number
  }>({
    url: '/search/stats',
    method: 'GET'
  })
}

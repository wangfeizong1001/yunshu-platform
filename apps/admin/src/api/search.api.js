/**
 * 搜索 API
 *
 * 提供搜索相关的后端接口
 */
import { request } from '@/utils/httpClient';
/**
 * 执行搜索
 */
export function search(params) {
    return request({
        url: '/search',
        method: 'GET',
        params
    });
}
/**
 * 搜索用户
 */
export function searchUsers(params) {
    return request({
        url: '/search/users',
        method: 'GET',
        params
    });
}
/**
 * 搜索部门
 */
export function searchDepts(params) {
    return request({
        url: '/search/depts',
        method: 'GET',
        params
    });
}
/**
 * 搜索菜单
 */
export function searchMenus(params) {
    return request({
        url: '/search/menus',
        method: 'GET',
        params
    });
}
/**
 * 搜索角色
 */
export function searchRoles(params) {
    return request({
        url: '/search/roles',
        method: 'GET',
        params
    });
}
/**
 * 搜索公告
 */
export function searchNotices(params) {
    return request({
        url: '/search/notices',
        method: 'GET',
        params
    });
}
/**
 * 搜索知识
 */
export function searchKnowledge(params) {
    return request({
        url: '/search/knowledge',
        method: 'GET',
        params
    });
}
/**
 * 获取热门搜索
 */
export function getHotSearches(limit = 10) {
    return request({
        url: '/search/hot',
        method: 'GET',
        params: { limit }
    });
}
/**
 * 获取搜索建议
 */
export function getSearchSuggestions(keyword, limit = 10) {
    return request({
        url: '/search/suggestions',
        method: 'GET',
        params: { keyword, limit }
    });
}
/**
 * 获取搜索历史
 */
export function getSearchHistory(limit = 20) {
    return request({
        url: '/search/history',
        method: 'GET',
        params: { limit }
    });
}
/**
 * 保存搜索历史
 */
export function saveSearchHistory(data) {
    return request({
        url: '/search/history',
        method: 'POST',
        data
    });
}
/**
 * 清空搜索历史
 */
export function clearSearchHistory() {
    return request({
        url: '/search/history',
        method: 'DELETE'
    });
}
/**
 * 删除单条搜索历史
 */
export function deleteSearchHistory(id) {
    return request({
        url: `/search/history/${id}`,
        method: 'DELETE'
    });
}
/**
 * 重建搜索索引
 */
export function rebuildSearchIndex(type) {
    return request({
        url: '/search/rebuild',
        method: 'POST',
        data: type ? { type } : undefined
    });
}
/**
 * 获取搜索统计
 */
export function getSearchStats() {
    return request({
        url: '/search/stats',
        method: 'GET'
    });
}
//# sourceMappingURL=search.api.js.map
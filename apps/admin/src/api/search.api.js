/**
 * 搜索 API
 *
 * 提供搜索相关的后端接口
 */
import { request } from '@/utils/request';
/**
 * 执行搜索
 */
export function search(params) {
    return request({
        url: '/search',
        method: 'get',
        params
    });
}
/**
 * 搜索用户
 */
export function searchUsers(params) {
    return request({
        url: '/search/users',
        method: 'get',
        params
    });
}
/**
 * 搜索部门
 */
export function searchDepts(params) {
    return request({
        url: '/search/depts',
        method: 'get',
        params
    });
}
/**
 * 搜索菜单
 */
export function searchMenus(params) {
    return request({
        url: '/search/menus',
        method: 'get',
        params
    });
}
/**
 * 搜索角色
 */
export function searchRoles(params) {
    return request({
        url: '/search/roles',
        method: 'get',
        params
    });
}
/**
 * 搜索公告
 */
export function searchNotices(params) {
    return request({
        url: '/search/notices',
        method: 'get',
        params
    });
}
/**
 * 搜索知识
 */
export function searchKnowledge(params) {
    return request({
        url: '/search/knowledge',
        method: 'get',
        params
    });
}
/**
 * 获取热门搜索
 */
export function getHotSearches(limit = 10) {
    return request({
        url: '/search/hot',
        method: 'get',
        params: { limit }
    });
}
/**
 * 获取搜索建议
 */
export function getSearchSuggestions(keyword, limit = 10) {
    return request({
        url: '/search/suggestions',
        method: 'get',
        params: { keyword, limit }
    });
}
/**
 * 获取搜索历史
 */
export function getSearchHistory(limit = 20) {
    return request({
        url: '/search/history',
        method: 'get',
        params: { limit }
    });
}
/**
 * 保存搜索历史
 */
export function saveSearchHistory(data) {
    return request({
        url: '/search/history',
        method: 'post',
        data
    });
}
/**
 * 清空搜索历史
 */
export function clearSearchHistory() {
    return request({
        url: '/search/history',
        method: 'delete'
    });
}
/**
 * 删除单条搜索历史
 */
export function deleteSearchHistory(id) {
    return request({
        url: `/search/history/${id}`,
        method: 'delete'
    });
}
/**
 * 重建搜索索引
 */
export function rebuildSearchIndex(type) {
    return request({
        url: '/search/rebuild',
        method: 'post',
        data: type ? { type } : undefined
    });
}
/**
 * 获取搜索统计
 */
export function getSearchStats() {
    return request({
        url: '/search/stats',
        method: 'get'
    });
}
//# sourceMappingURL=search.api.js.map
/**
 * 权限管理 API
 */
import { request } from '@/utils/httpClient';
/**
 * 获取当前用户权限信息
 */
export function getCurrentPermission() {
    return request({
        url: '/system/permission/current',
        method: 'GET',
    });
}
/**
 * 获取路由菜单
 */
export function getRouters() {
    return request({
        url: '/system/permission/routers',
        method: 'GET',
    });
}
/**
 * 刷新权限信息
 */
export function refreshPermission() {
    return request({
        url: '/system/permission/refresh',
        method: 'POST',
    });
}
//# sourceMappingURL=permission.api.js.map
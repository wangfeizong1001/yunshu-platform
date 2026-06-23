/**
 * 菜单管理 API
 */
import { request } from '@/utils/httpClient';
export const getMenuList = (params) => {
    return request({
        url: '/system/menu/list',
        method: 'GET',
        params
    });
};
export const getMenuTree = (params) => {
    return request({
        url: '/system/menu/tree',
        method: 'GET',
        params
    });
};
export const getMenuListApi = (params) => {
    return request({
        url: '/system/menu/list',
        method: 'GET',
        params
    });
};
export const getMenu = (menuId) => {
    return request({
        url: `/system/menu/${menuId}`,
        method: 'GET'
    });
};
export const getMenuTreeSelect = () => {
    return request({
        url: '/system/menu/treeSelect',
        method: 'GET'
    });
};
export const getMenuTreeByRoleId = (roleId) => {
    return request({
        url: `/system/menu/roleMenuTreeSelect/${roleId}`,
        method: 'GET'
    });
};
export const addMenu = (data) => {
    return request({
        url: '/system/menu',
        method: 'POST',
        data
    });
};
export const updateMenu = (data) => {
    return request({
        url: '/system/menu',
        method: 'PUT',
        data
    });
};
export const deleteMenu = (menuId) => {
    return request({
        url: `/system/menu/${menuId}`,
        method: 'DELETE'
    });
};
//# sourceMappingURL=menu.api.js.map
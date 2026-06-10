/**
 * 菜单管理 API
 */
import request from '@/utils/request';
export const getMenuList = (params) => {
    return request({
        url: '/system/menu/list',
        method: 'get',
        params
    });
};
export const getMenuTree = (params) => {
    return request({
        url: '/system/menu/tree',
        method: 'get',
        params
    });
};
export const getMenuListApi = (params) => {
    return request({
        url: '/system/menu/list',
        method: 'get',
        params
    });
};
export const getMenu = (menuId) => {
    return request({
        url: `/system/menu/${menuId}`,
        method: 'get'
    });
};
export const getMenuTreeSelect = () => {
    return request({
        url: '/system/menu/treeSelect',
        method: 'get'
    });
};
export const getMenuTreeByRoleId = (roleId) => {
    return request({
        url: `/system/menu/roleMenuTreeSelect/${roleId}`,
        method: 'get'
    });
};
export const addMenu = (data) => {
    return request({
        url: '/system/menu',
        method: 'post',
        data
    });
};
export const updateMenu = (data) => {
    return request({
        url: '/system/menu',
        method: 'put',
        data
    });
};
export const deleteMenu = (menuId) => {
    return request({
        url: `/system/menu/${menuId}`,
        method: 'delete'
    });
};
//# sourceMappingURL=menu.api.js.map
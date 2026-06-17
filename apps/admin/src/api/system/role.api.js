/**
 * 角色管理 API
 */
import { request } from '@/utils/httpClient';
export const getRoleList = (params) => {
    return request({
        url: '/system/role/list',
        method: 'GET',
        params
    });
};
export const getRolePage = (params) => {
    return request({
        url: '/system/role/page',
        method: 'GET',
        params
    });
};
export const getRole = (roleId) => {
    return request({
        url: `/system/role/${roleId}`,
        method: 'GET'
    });
};
export const addRole = (data) => {
    return request({
        url: '/system/role',
        method: 'POST',
        data
    });
};
export const updateRole = (data) => {
    return request({
        url: '/system/role',
        method: 'PUT',
        data
    });
};
export const deleteRole = (roleId) => {
    return request({
        url: `/system/role/${roleId}`,
        method: 'DELETE'
    });
};
export const batchDeleteRole = (roleIds) => {
    return request({
        url: '/system/role/batch',
        method: 'DELETE',
        data: roleIds
    });
};
export const changeRoleStatus = (roleId, status) => {
    return request({
        url: '/system/role/changeStatus',
        method: 'PUT',
        params: { roleId, status }
    });
};
export const dataScope = (data) => {
    return request({
        url: '/system/role/dataScope',
        method: 'PUT',
        data
    });
};
export const authRoleAll = (roleId, menuIds) => {
    return request({
        url: '/system/role/authRoleAll',
        method: 'PUT',
        data: { roleId, menuIds }
    });
};
//# sourceMappingURL=role.api.js.map
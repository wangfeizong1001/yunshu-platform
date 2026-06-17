/**
 * 部门管理 API
 */
import { request } from '@/utils/httpClient';
export const getDeptList = (params) => {
    return request({
        url: '/system/dept/list',
        method: 'GET',
        params
    });
};
export const getDept = (deptId) => {
    return request({
        url: `/system/dept/${deptId}`,
        method: 'GET'
    });
};
export const getDeptTreeSelect = () => {
    return request({
        url: '/system/dept/treeSelect',
        method: 'GET'
    });
};
export const getDeptTree = (params) => {
    return request({
        url: '/system/dept/tree',
        method: 'GET',
        params
    });
};
export const getDeptExcludeChild = (deptId) => {
    return request({
        url: `/system/dept/list/excludeChild/${deptId}`,
        method: 'GET'
    });
};
export const addDept = (data) => {
    return request({
        url: '/system/dept',
        method: 'POST',
        data
    });
};
export const updateDept = (data) => {
    return request({
        url: '/system/dept',
        method: 'PUT',
        data
    });
};
export const deleteDept = (deptId) => {
    return request({
        url: `/system/dept/${deptId}`,
        method: 'DELETE'
    });
};
//# sourceMappingURL=dept.api.js.map
/**
 * 部门管理 API
 */
import request from '@/utils/request';
export const getDeptList = (params) => {
    return request({
        url: '/system/dept/list',
        method: 'get',
        params
    });
};
export const getDept = (deptId) => {
    return request({
        url: `/system/dept/${deptId}`,
        method: 'get'
    });
};
export const getDeptTreeSelect = () => {
    return request({
        url: '/system/dept/treeSelect',
        method: 'get'
    });
};
export const getDeptTree = (params) => {
    return request({
        url: '/system/dept/tree',
        method: 'get',
        params
    });
};
export const getDeptExcludeChild = (deptId) => {
    return request({
        url: `/system/dept/list/excludeChild/${deptId}`,
        method: 'get'
    });
};
export const addDept = (data) => {
    return request({
        url: '/system/dept',
        method: 'post',
        data
    });
};
export const updateDept = (data) => {
    return request({
        url: '/system/dept',
        method: 'put',
        data
    });
};
export const deleteDept = (deptId) => {
    return request({
        url: `/system/dept/${deptId}`,
        method: 'delete'
    });
};
//# sourceMappingURL=dept.api.js.map
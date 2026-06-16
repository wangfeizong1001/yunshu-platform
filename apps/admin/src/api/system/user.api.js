/**
 * 用户管理相关 API
 */
import { request } from '@/utils/httpClient';
// 获取用户列表
export function getUserList(params) {
    return request({
        url: '/system/user/list',
        method: 'GET',
        params
    });
}
// 获取用户分页列表
export function getUserPage(params) {
    return request({
        url: '/system/user/page',
        method: 'GET',
        params
    });
}
// 获取用户详情
export function getUser(userId) {
    return request({
        url: `/system/user/${userId}`,
        method: 'GET'
    });
}
// 新增用户
export function addUser(data) {
    return request({
        url: '/system/user',
        method: 'POST',
        data
    });
}
// 修改用户
export function updateUser(data) {
    return request({
        url: '/system/user',
        method: 'PUT',
        data
    });
}
// 删除用户
export function deleteUser(userId) {
    return request({
        url: `/system/user/${userId}`,
        method: 'DELETE'
    });
}
// 批量删除用户
export function batchDeleteUser(userIds) {
    return request({
        url: '/system/user/batch',
        method: 'DELETE',
        data: userIds
    });
}
// 修改用户状态
export function changeUserStatus(userId, status) {
    return request({
        url: '/system/user/changeStatus',
        method: 'PUT',
        params: { userId, status }
    });
}
// 重置用户密码
export function resetUserPwd(userId, password) {
    return request({
        url: '/system/user/resetPwd',
        method: 'PUT',
        data: { userId, password }
    });
}
// 导出用户
export function exportUser(params) {
    return request({
        url: '/system/user/export',
        method: 'GET',
        params,
        responseType: 'blob'
    });
}
// 导入用户模板下载
export function importTemplate() {
    return request({
        url: '/system/user/importTemplate',
        method: 'GET',
        responseType: 'blob'
    });
}
// 导入用户
export function importUser(data) {
    return request({
        url: '/system/user/import',
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
// 获取所有角色列表
export function getAllRoles() {
    return request({
        url: '/system/role/list',
        method: 'GET'
    });
}
// 分配用户角色
export function assignUserRole(userId, roleIds) {
    return request({
        url: '/system/user/assignRole',
        method: 'PUT',
        data: { userId, roleIds }
    });
}
// 分配用户角色（别名）
export function assignRoles(userId, roleIds) {
    return assignUserRole(userId, roleIds);
}
// 获取用户角色列表
export function getUserRoles(userId) {
    return request({
        url: `/system/user/${userId}/roles`,
        method: 'GET'
    });
}
//# sourceMappingURL=user.api.js.map
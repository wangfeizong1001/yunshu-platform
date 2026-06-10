/**
 * 用户管理相关 API
 */
import request from '@/utils/request';
// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params,
  });
}
// 获取用户分页列表
export function getUserPage(params) {
  return request({
    url: '/system/user/page',
    method: 'get',
    params,
  });
}
// 获取用户详情
export function getUser(userId) {
  return request({
    url: `/system/user/${userId}`,
    method: 'get',
  });
}
// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data,
  });
}
// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data,
  });
}
// 删除用户
export function deleteUser(userId) {
  return request({
    url: `/system/user/${userId}`,
    method: 'delete',
  });
}
// 批量删除用户
export function batchDeleteUser(userIds) {
  return request({
    url: '/system/user/batch',
    method: 'delete',
    data: userIds,
  });
}
// 修改用户状态
export function changeUserStatus(userId, status) {
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    params: { userId, status },
  });
}
// 重置用户密码
export function resetUserPwd(userId, password) {
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: { userId, password },
  });
}
// 导出用户
export function exportUser(params) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params,
    responseType: 'blob',
  });
}
// 导入用户模板下载
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get',
    responseType: 'blob',
  });
}
// 导入用户
export function importUser(data) {
  return request({
    url: '/system/user/import',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
// 获取所有角色列表
export function getAllRoles() {
  return request({
    url: '/system/role/list',
    method: 'get',
  });
}
// 分配用户角色
export function assignUserRole(userId, roleIds) {
  return request({
    url: '/system/user/assignRole',
    method: 'put',
    data: { userId, roleIds },
  });
}
// 获取用户角色列表
export function getUserRoles(userId) {
  return request({
    url: `/system/user/${userId}/roles`,
    method: 'get',
  });
}
//# sourceMappingURL=user.api.js.map

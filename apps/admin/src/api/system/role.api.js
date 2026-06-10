/**
 * 角色管理 API
 */
import request from '@/utils/request';
export const getRoleList = (params) => {
  return request({
    url: '/system/role/list',
    method: 'get',
    params,
  });
};
export const getRolePage = (params) => {
  return request({
    url: '/system/role/page',
    method: 'get',
    params,
  });
};
export const getRole = (roleId) => {
  return request({
    url: `/system/role/${roleId}`,
    method: 'get',
  });
};
export const addRole = (data) => {
  return request({
    url: '/system/role',
    method: 'post',
    data,
  });
};
export const updateRole = (data) => {
  return request({
    url: '/system/role',
    method: 'put',
    data,
  });
};
export const deleteRole = (roleId) => {
  return request({
    url: `/system/role/${roleId}`,
    method: 'delete',
  });
};
export const batchDeleteRole = (roleIds) => {
  return request({
    url: '/system/role/batch',
    method: 'delete',
    data: roleIds,
  });
};
export const changeRoleStatus = (roleId, status) => {
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    params: { roleId, status },
  });
};
export const dataScope = (data) => {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data,
  });
};
export const authRoleAll = (roleId, menuIds) => {
  return request({
    url: '/system/role/authRoleAll',
    method: 'put',
    data: { roleId, menuIds },
  });
};
//# sourceMappingURL=role.api.js.map

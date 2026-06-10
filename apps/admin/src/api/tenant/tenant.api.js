/**
 * 租户管理 API
 */
import { request } from '@/utils/request';
/**
 * 获取租户分页列表
 * @param params 查询参数
 */
export function getTenantPage(params) {
  return request({
    url: '/tenant/list',
    method: 'get',
    params,
  });
}
/**
 * 获取租户列表
 * @param params 查询参数
 */
export function getTenantList(params) {
  return request({
    url: '/tenant/list',
    method: 'get',
    params,
  });
}
/**
 * 获取租户详情
 * @param tenantId 租户ID
 */
export function getTenantDetail(tenantId) {
  return request({
    url: `/tenant/${tenantId}`,
    method: 'get',
  });
}
/**
 * 新增租户
 * @param data 租户表单数据
 */
export function addTenant(data) {
  return request({
    url: '/tenant',
    method: 'post',
    data,
  });
}
/**
 * 修改租户
 * @param tenantId 租户ID
 * @param data 租户表单数据
 */
export function updateTenant(tenantId, data) {
  return request({
    url: `/tenant/${tenantId}`,
    method: 'put',
    data,
  });
}
/**
 * 删除租户
 * @param tenantId 租户ID
 */
export function deleteTenant(tenantId) {
  return request({
    url: `/tenant/${tenantId}`,
    method: 'delete',
  });
}
/**
 * 修改租户状态
 * @param tenantId 租户ID
 * @param status 状态
 */
export function changeTenantStatus(tenantId, status) {
  return request({
    url: '/tenant/status',
    method: 'put',
    data: { tenantId, status },
  });
}
/**
 * 获取套餐分页列表
 * @param params 查询参数
 */
export function getPackagePage(params) {
  return request({
    url: '/tenant/package/list',
    method: 'get',
    params,
  });
}
/**
 * 获取套餐列表
 * @param params 查询参数
 */
export function getPackageList(params) {
  return request({
    url: '/tenant/package/list',
    method: 'get',
    params,
  });
}
/**
 * 获取套餐详情
 * @param packageId 套餐ID
 */
export function getPackageDetail(packageId) {
  return request({
    url: `/tenant/package/${packageId}`,
    method: 'get',
  });
}
/**
 * 新增套餐
 * @param data 套餐表单数据
 */
export function addPackage(data) {
  return request({
    url: '/tenant/package',
    method: 'post',
    data,
  });
}
/**
 * 修改套餐
 * @param packageId 套餐ID
 * @param data 套餐表单数据
 */
export function updatePackage(packageId, data) {
  return request({
    url: `/tenant/package/${packageId}`,
    method: 'put',
    data,
  });
}
/**
 * 删除套餐
 * @param packageId 套餐ID
 */
export function deletePackage(packageId) {
  return request({
    url: `/tenant/package/${packageId}`,
    method: 'delete',
  });
}
/**
 * 分配租户套餐
 * @param tenantId 租户ID
 * @param packageId 套餐ID
 */
export function assignTenantPackage(tenantId, packageId) {
  return request({
    url: '/tenant/package/assign',
    method: 'put',
    data: { tenantId, packageId },
  });
}
/**
 * 获取租户可用的套餐列表
 * @param tenantId 租户ID
 */
export function getTenantAvailablePackages(tenantId) {
  return request({
    url: `/tenant/${tenantId}/packages`,
    method: 'get',
  });
}
//# sourceMappingURL=tenant.api.js.map

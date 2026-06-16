/**
 * 租户管理 API
 */
import { request } from '@/utils/httpClient';
/**
 * 获取租户分页列表
 */
export function getTenantPage(params) {
    return request({
        url: '/tenant/list',
        method: 'GET',
        params
    });
}
/**
 * 获取租户列表
 */
export function getTenantList(params) {
    return request({
        url: '/tenant/list',
        method: 'GET',
        params
    });
}
/**
 * 获取租户详情
 */
export function getTenantDetail(tenantId) {
    return request({
        url: `/tenant/${tenantId}`,
        method: 'GET'
    });
}
/**
 * 新增租户
 */
export function addTenant(data) {
    return request({
        url: '/tenant',
        method: 'POST',
        data
    });
}
/**
 * 修改租户
 */
export function updateTenant(tenantId, data) {
    return request({
        url: `/tenant/${tenantId}`,
        method: 'PUT',
        data
    });
}
/**
 * 删除租户
 */
export function deleteTenant(tenantId) {
    return request({
        url: `/tenant/${tenantId}`,
        method: 'DELETE'
    });
}
/**
 * 修改租户状态
 */
export function changeTenantStatus(tenantId, status) {
    return request({
        url: '/tenant/status',
        method: 'PUT',
        data: { tenantId, status }
    });
}
/**
 * 获取套餐分页列表
 */
export function getPackagePage(params) {
    return request({
        url: '/tenant/package/list',
        method: 'GET',
        params
    });
}
/**
 * 获取套餐列表
 */
export function getPackageList(params) {
    return request({
        url: '/tenant/package/list',
        method: 'GET',
        params
    });
}
/**
 * 获取套餐详情
 */
export function getPackageDetail(packageId) {
    return request({
        url: `/tenant/package/${packageId}`,
        method: 'GET'
    });
}
/**
 * 新增套餐
 */
export function addPackage(data) {
    return request({
        url: '/tenant/package',
        method: 'POST',
        data
    });
}
/**
 * 修改套餐
 */
export function updatePackage(packageId, data) {
    return request({
        url: `/tenant/package/${packageId}`,
        method: 'PUT',
        data
    });
}
/**
 * 删除套餐
 */
export function deletePackage(packageId) {
    return request({
        url: `/tenant/package/${packageId}`,
        method: 'DELETE'
    });
}
/**
 * 分配租户套餐
 */
export function assignTenantPackage(tenantId, packageId) {
    return request({
        url: '/tenant/package/assign',
        method: 'PUT',
        data: { tenantId, packageId }
    });
}
/**
 * 获取租户可用的套餐列表
 */
export function getTenantAvailablePackages(tenantId) {
    return request({
        url: `/tenant/${tenantId}/packages`,
        method: 'GET'
    });
}
//# sourceMappingURL=tenant.api.js.map
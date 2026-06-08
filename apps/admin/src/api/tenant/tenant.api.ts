/**
 * 租户管理 API
 */

import { request } from '@/utils/request'
import type {
  Tenant,
  TenantQuery,
  TenantForm,
  TenantPageResp,
  TenantPackage,
  TenantPackageQuery,
  TenantPackageForm,
  TenantPackagePageResp,
} from '@yunshu/shared/types/tenant'

/**
 * 获取租户分页列表
 * @param params 查询参数
 */
export function getTenantPage(params: TenantQuery) {
  return request<TenantPageResp>({
    url: '/tenant/list',
    method: 'get',
    params,
  })
}

/**
 * 获取租户列表
 * @param params 查询参数
 */
export function getTenantList(params?: TenantQuery) {
  return request<Tenant[]>({
    url: '/tenant/list',
    method: 'get',
    params,
  })
}

/**
 * 获取租户详情
 * @param tenantId 租户ID
 */
export function getTenantDetail(tenantId: number) {
  return request<Tenant>({
    url: `/tenant/${tenantId}`,
    method: 'get',
  })
}

/**
 * 新增租户
 * @param data 租户表单数据
 */
export function addTenant(data: TenantForm) {
  return request<Tenant>({
    url: '/tenant',
    method: 'post',
    data,
  })
}

/**
 * 修改租户
 * @param tenantId 租户ID
 * @param data 租户表单数据
 */
export function updateTenant(tenantId: number, data: TenantForm) {
  return request<Tenant>({
    url: `/tenant/${tenantId}`,
    method: 'put',
    data,
  })
}

/**
 * 删除租户
 * @param tenantId 租户ID
 */
export function deleteTenant(tenantId: number) {
  return request<void>({
    url: `/tenant/${tenantId}`,
    method: 'delete',
  })
}

/**
 * 修改租户状态
 * @param tenantId 租户ID
 * @param status 状态
 */
export function changeTenantStatus(tenantId: number, status: '0' | '1' | '2') {
  return request<void>({
    url: '/tenant/status',
    method: 'put',
    data: { tenantId, status },
  })
}

/**
 * 获取套餐分页列表
 * @param params 查询参数
 */
export function getPackagePage(params: TenantPackageQuery) {
  return request<TenantPackagePageResp>({
    url: '/tenant/package/list',
    method: 'get',
    params,
  })
}

/**
 * 获取套餐列表
 * @param params 查询参数
 */
export function getPackageList(params?: TenantPackageQuery) {
  return request<TenantPackage[]>({
    url: '/tenant/package/list',
    method: 'get',
    params,
  })
}

/**
 * 获取套餐详情
 * @param packageId 套餐ID
 */
export function getPackageDetail(packageId: number) {
  return request<TenantPackage>({
    url: `/tenant/package/${packageId}`,
    method: 'get',
  })
}

/**
 * 新增套餐
 * @param data 套餐表单数据
 */
export function addPackage(data: TenantPackageForm) {
  return request<TenantPackage>({
    url: '/tenant/package',
    method: 'post',
    data,
  })
}

/**
 * 修改套餐
 * @param packageId 套餐ID
 * @param data 套餐表单数据
 */
export function updatePackage(packageId: number, data: TenantPackageForm) {
  return request<TenantPackage>({
    url: `/tenant/package/${packageId}`,
    method: 'put',
    data,
  })
}

/**
 * 删除套餐
 * @param packageId 套餐ID
 */
export function deletePackage(packageId: number) {
  return request<void>({
    url: `/tenant/package/${packageId}`,
    method: 'delete',
  })
}

/**
 * 分配租户套餐
 * @param tenantId 租户ID
 * @param packageId 套餐ID
 */
export function assignTenantPackage(tenantId: number, packageId: number) {
  return request<void>({
    url: '/tenant/package/assign',
    method: 'put',
    data: { tenantId, packageId },
  })
}

/**
 * 获取租户可用的套餐列表
 * @param tenantId 租户ID
 */
export function getTenantAvailablePackages(tenantId: number) {
  return request<TenantPackage[]>({
    url: `/tenant/${tenantId}/packages`,
    method: 'get',
  })
}

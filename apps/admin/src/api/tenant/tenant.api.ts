/**
 * 租户管理 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface TenantQuery {
  pageNum?: number
  pageSize?: number
  tenantName?: string
  status?: string
}

export interface TenantForm {
  tenantId?: number
  tenantName?: string
  tenantCode?: string
  status?: string
  packageId?: number
  expireTime?: string
  accountCount?: number
  remark?: string
}

export interface TenantInfo {
  tenantId: number
  tenantName: string
  tenantCode: string
  status: string
  packageId: number
  packageName: string
  expireTime: string
  accountCount: number
  createTime: string
  remark: string
}

export interface TenantPackageQuery {
  pageNum?: number
  pageSize?: number
  packageName?: string
  status?: string
}

export interface TenantPackageForm {
  packageId?: number
  packageName?: string
  status?: string
  menuIds?: number[]
  remark?: string
}

export interface TenantPackageInfo {
  packageId: number
  packageName: string
  status: string
  menuIds: number[]
  remark: string
  createTime: string
}

/**
 * 获取租户分页列表
 */
export function getTenantPage(params: TenantQuery) {
  return request<{ rows: TenantInfo[]; total: number }>({
    url: '/tenant/list',
    method: 'GET',
    params
  })
}

/**
 * 获取租户列表
 */
export function getTenantList(params?: TenantQuery) {
  return request<TenantInfo[]>({
    url: '/tenant/list',
    method: 'GET',
    params
  })
}

/**
 * 获取租户详情
 */
export function getTenantDetail(tenantId: number) {
  return request<TenantInfo>({
    url: `/tenant/${tenantId}`,
    method: 'GET'
  })
}

/**
 * 新增租户
 */
export function addTenant(data: TenantForm) {
  return request<void>({
    url: '/tenant',
    method: 'POST',
    data
  })
}

/**
 * 修改租户
 */
export function updateTenant(tenantId: number, data: TenantForm) {
  return request<void>({
    url: `/tenant/${tenantId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除租户
 */
export function deleteTenant(tenantId: number) {
  return request<void>({
    url: `/tenant/${tenantId}`,
    method: 'DELETE'
  })
}

/**
 * 修改租户状态
 */
export function changeTenantStatus(tenantId: number, status: '0' | '1' | '2') {
  return request<void>({
    url: '/tenant/status',
    method: 'PUT',
    data: { tenantId, status }
  })
}

/**
 * 获取套餐分页列表
 */
export function getPackagePage(params: TenantPackageQuery) {
  return request<{ rows: TenantPackageInfo[]; total: number }>({
    url: '/tenant/package/list',
    method: 'GET',
    params
  })
}

/**
 * 获取套餐列表
 */
export function getPackageList(params?: TenantPackageQuery) {
  return request<TenantPackageInfo[]>({
    url: '/tenant/package/list',
    method: 'GET',
    params
  })
}

/**
 * 获取套餐详情
 */
export function getPackageDetail(packageId: number) {
  return request<TenantPackageInfo>({
    url: `/tenant/package/${packageId}`,
    method: 'GET'
  })
}

/**
 * 新增套餐
 */
export function addPackage(data: TenantPackageForm) {
  return request<void>({
    url: '/tenant/package',
    method: 'POST',
    data
  })
}

/**
 * 修改套餐
 */
export function updatePackage(packageId: number, data: TenantPackageForm) {
  return request<void>({
    url: `/tenant/package/${packageId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除套餐
 */
export function deletePackage(packageId: number) {
  return request<void>({
    url: `/tenant/package/${packageId}`,
    method: 'DELETE'
  })
}

/**
 * 分配租户套餐
 */
export function assignTenantPackage(tenantId: number, packageId: number) {
  return request<void>({
    url: '/tenant/package/assign',
    method: 'PUT',
    data: { tenantId, packageId }
  })
}

/**
 * 获取租户可用的套餐列表
 */
export function getTenantAvailablePackages(tenantId: number) {
  return request<TenantPackageInfo[]>({
    url: `/tenant/${tenantId}/packages`,
    method: 'GET'
  })
}

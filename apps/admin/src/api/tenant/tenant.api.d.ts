/**
 * 租户管理 API
 */
import type { Tenant, TenantQuery, TenantForm, TenantPageResp, TenantPackage, TenantPackageQuery, TenantPackageForm, TenantPackagePageResp } from '@yunshu/shared';
/**
 * 获取租户分页列表
 * @param params 查询参数
 */
export declare function getTenantPage(params: TenantQuery): Promise<TenantPageResp>;
/**
 * 获取租户列表
 * @param params 查询参数
 */
export declare function getTenantList(params?: TenantQuery): Promise<Tenant[]>;
/**
 * 获取租户详情
 * @param tenantId 租户ID
 */
export declare function getTenantDetail(tenantId: number): Promise<Tenant>;
/**
 * 新增租户
 * @param data 租户表单数据
 */
export declare function addTenant(data: TenantForm): Promise<Tenant>;
/**
 * 修改租户
 * @param tenantId 租户ID
 * @param data 租户表单数据
 */
export declare function updateTenant(tenantId: number, data: TenantForm): Promise<Tenant>;
/**
 * 删除租户
 * @param tenantId 租户ID
 */
export declare function deleteTenant(tenantId: number): Promise<void>;
/**
 * 修改租户状态
 * @param tenantId 租户ID
 * @param status 状态
 */
export declare function changeTenantStatus(tenantId: number, status: '0' | '1' | '2'): Promise<void>;
/**
 * 获取套餐分页列表
 * @param params 查询参数
 */
export declare function getPackagePage(params: TenantPackageQuery): Promise<TenantPackagePageResp>;
/**
 * 获取套餐列表
 * @param params 查询参数
 */
export declare function getPackageList(params?: TenantPackageQuery): Promise<TenantPackage[]>;
/**
 * 获取套餐详情
 * @param packageId 套餐ID
 */
export declare function getPackageDetail(packageId: number): Promise<TenantPackage>;
/**
 * 新增套餐
 * @param data 套餐表单数据
 */
export declare function addPackage(data: TenantPackageForm): Promise<TenantPackage>;
/**
 * 修改套餐
 * @param packageId 套餐ID
 * @param data 套餐表单数据
 */
export declare function updatePackage(packageId: number, data: TenantPackageForm): Promise<TenantPackage>;
/**
 * 删除套餐
 * @param packageId 套餐ID
 */
export declare function deletePackage(packageId: number): Promise<void>;
/**
 * 分配租户套餐
 * @param tenantId 租户ID
 * @param packageId 套餐ID
 */
export declare function assignTenantPackage(tenantId: number, packageId: number): Promise<void>;
/**
 * 获取租户可用的套餐列表
 * @param tenantId 租户ID
 */
export declare function getTenantAvailablePackages(tenantId: number): Promise<TenantPackage[]>;
//# sourceMappingURL=tenant.api.d.ts.map
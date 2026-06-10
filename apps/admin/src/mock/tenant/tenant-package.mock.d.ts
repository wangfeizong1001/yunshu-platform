/**
 * 租户套餐 Mock 数据
 */
import type { TenantPackage, TenantPackageQuery, TenantPackagePageResp } from '@yunshu/shared';
/** 分页查询套餐 */
export declare function getPackagePage(params: TenantPackageQuery): TenantPackagePageResp;
/** 获取套餐列表 */
export declare function getPackageList(params?: TenantPackageQuery): TenantPackage[];
/** 获取套餐详情 */
export declare function getPackageById(packageId: number): TenantPackage | undefined;
/** 新增套餐 */
export declare function createPackage(data: Omit<TenantPackage, 'packageId' | 'createTime' | 'updateTime'>): TenantPackage;
/** 更新套餐 */
export declare function updatePackageById(packageId: number, data: Partial<Omit<TenantPackage, 'packageId' | 'createTime'>>): TenantPackage | undefined;
/** 删除套餐 */
export declare function deletePackageById(packageId: number): boolean;
//# sourceMappingURL=tenant-package.mock.d.ts.map
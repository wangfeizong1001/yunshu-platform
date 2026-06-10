/**
 * 租户管理 Mock 数据
 */
import type { Tenant, TenantQuery, TenantPageResp } from '@yunshu/shared';
/** 分页查询租户 */
export declare function getTenantPage(params: TenantQuery): TenantPageResp;
/** 获取租户列表 */
export declare function getTenantList(params?: TenantQuery): Tenant[];
/** 获取租户详情 */
export declare function getTenantById(tenantId: number): Tenant | undefined;
/** 新增租户 */
export declare function createTenant(
  data: Omit<Tenant, 'tenantId' | 'createTime' | 'updateTime'>,
): Tenant;
/** 更新租户 */
export declare function updateTenantById(
  tenantId: number,
  data: Partial<Omit<Tenant, 'tenantId' | 'createTime'>>,
): Tenant | undefined;
/** 删除租户 */
export declare function deleteTenantById(tenantId: number): boolean;
/** 修改租户状态 */
export declare function changeTenantStatusById(
  tenantId: number,
  status: '0' | '1' | '2',
): Tenant | undefined;
//# sourceMappingURL=tenant.mock.d.ts.map

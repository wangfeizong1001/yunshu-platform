/**
 * 租户工具函数
 * 处理租户ID的获取、存储和请求注入
 */
import type { AxiosRequestConfig } from 'axios';
/**
 * 获取当前租户ID
 */
export declare function getTenantId(): string | null;
/**
 * 设置当前租户ID
 */
export declare function setTenantId(tenantId: string): void;
/**
 * 删除当前租户ID
 */
export declare function removeTenantId(): void;
/**
 * 是否为超级管理员（租户ID为0或空）
 */
export declare function isSuperAdmin(): boolean;
/**
 * 添加租户ID到请求头
 * @param config 请求配置
 */
export declare function addTenantIdToRequest(config: AxiosRequestConfig): AxiosRequestConfig;
/**
 * 清除租户上下文
 */
export declare function clearTenantContext(): void;
//# sourceMappingURL=tenant.d.ts.map

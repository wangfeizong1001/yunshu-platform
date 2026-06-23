/**
 * 租户工具函数
 * 处理租户ID的获取、存储和请求注入
 */
const TenantIdKey = 'Tenant-Id';
/**
 * 获取当前租户ID
 */
export function getTenantId() {
    return localStorage.getItem(TenantIdKey);
}
/**
 * 设置当前租户ID
 */
export function setTenantId(tenantId) {
    localStorage.setItem(TenantIdKey, tenantId);
}
/**
 * 删除当前租户ID
 */
export function removeTenantId() {
    localStorage.removeItem(TenantIdKey);
}
/**
 * 是否为超级管理员（租户ID为0或空）
 */
export function isSuperAdmin() {
    const tenantId = getTenantId();
    return !tenantId || tenantId === '0' || tenantId === '1';
}
/**
 * 添加租户ID到请求头
 * @param config 请求配置
 */
export function addTenantIdToRequest(config) {
    const tenantId = getTenantId();
    if (tenantId && tenantId !== '0') {
        config.headers = config.headers || {};
        config.headers['tenant-id'] = tenantId;
    }
    return config;
}
/**
 * 清除租户上下文
 */
export function clearTenantContext() {
    removeTenantId();
}
//# sourceMappingURL=tenant.js.map
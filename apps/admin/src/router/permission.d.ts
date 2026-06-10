/**
 * 路由权限工具函数
 * 提供权限校验的辅助函数
 */
/**
 * 检查是否有指定权限
 * @param value 需要检查的权限列表
 * @param hasPermissions 用户拥有的权限列表
 * @returns 是否有权限
 */
export declare function checkPermission(value: string[], hasPermissions: string[]): boolean;
/**
 * 检查是否有任意一个指定权限
 * @param permissions 需要检查的权限列表
 * @param hasPermissions 用户拥有的权限列表
 * @returns 是否有权限
 */
export declare function hasPermiOr(permissions: string[], hasPermissions: string[]): boolean;
/**
 * 检查是否拥有所有指定权限
 * @param permissions 需要检查的权限列表
 * @param hasPermissions 用户拥有的权限列表
 * @returns 是否拥有所有权限
 */
export declare function hasPermiAnd(permissions: string[], hasPermissions: string[]): boolean;
/**
 * 检查是否有指定角色
 * @param value 需要检查的角色列表
 * @param hasRoles 用户拥有的角色列表
 * @returns 是否有角色
 */
export declare function hasRole(value: string[], hasRoles: string[]): boolean;
/**
 * 检查是否有任意一个指定角色
 * @param roles 需要检查的角色列表
 * @param hasRoles 用户拥有的角色列表
 * @returns 是否有角色
 */
export declare function hasRoleOr(roles: string[], hasRoles: string[]): boolean;
/**
 * 检查是否拥有所有指定角色
 * @param roles 需要检查的角色列表
 * @param hasRoles 用户拥有的角色列表
 * @returns 是否拥有所有角色
 */
export declare function hasRoleAll(roles: string[], hasRoles: string[]): boolean;
/**
 * 判断是否为超级管理员
 * @param roles 用户角色列表
 * @returns 是否为超级管理员
 */
export declare function isSuperAdmin(roles: string[]): boolean;
//# sourceMappingURL=permission.d.ts.map
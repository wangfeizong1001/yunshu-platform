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
export function checkPermission(value, hasPermissions) {
  if (!value || value.length === 0) {
    return true;
  }
  if (!hasPermissions || hasPermissions.length === 0) {
    return false;
  }
  return value.some((permission) => hasPermissions.includes(permission));
}
/**
 * 检查是否有任意一个指定权限
 * @param permissions 需要检查的权限列表
 * @param hasPermissions 用户拥有的权限列表
 * @returns 是否有权限
 */
export function hasPermiOr(permissions, hasPermissions) {
  return checkPermission(permissions, hasPermissions);
}
/**
 * 检查是否拥有所有指定权限
 * @param permissions 需要检查的权限列表
 * @param hasPermissions 用户拥有的权限列表
 * @returns 是否拥有所有权限
 */
export function hasPermiAnd(permissions, hasPermissions) {
  if (!permissions || permissions.length === 0) {
    return true;
  }
  if (!hasPermissions || hasPermissions.length === 0) {
    return false;
  }
  return permissions.every((permission) => hasPermissions.includes(permission));
}
/**
 * 检查是否有指定角色
 * @param value 需要检查的角色列表
 * @param hasRoles 用户拥有的角色列表
 * @returns 是否有角色
 */
export function hasRole(value, hasRoles) {
  if (!value || value.length === 0) {
    return true;
  }
  if (!hasRoles || hasRoles.length === 0) {
    return false;
  }
  return value.some((role) => hasRoles.includes(role));
}
/**
 * 检查是否有任意一个指定角色
 * @param roles 需要检查的角色列表
 * @param hasRoles 用户拥有的角色列表
 * @returns 是否有角色
 */
export function hasRoleOr(roles, hasRoles) {
  return hasRole(roles, hasRoles);
}
/**
 * 检查是否拥有所有指定角色
 * @param roles 需要检查的角色列表
 * @param hasRoles 用户拥有的角色列表
 * @returns 是否拥有所有角色
 */
export function hasRoleAll(roles, hasRoles) {
  if (!roles || roles.length === 0) {
    return true;
  }
  if (!hasRoles || hasRoles.length === 0) {
    return false;
  }
  return roles.every((role) => hasRoles.includes(role));
}
/**
 * 判断是否为超级管理员
 * @param roles 用户角色列表
 * @returns 是否为超级管理员
 */
export function isSuperAdmin(roles) {
  return roles.includes('admin');
}
//# sourceMappingURL=permission.js.map

/**
 * 权限判断工具
 */
import { useUserStore } from '@/store/modules/user';

export const hasPermi = (permission: string) => {
  const userStore = useUserStore();
  const permissions = userStore.permissions;

  if (permissions.includes('*:*:*')) {
    return true;
  }
  return permissions.some((item) => item === permission);
};

export const hasPermiOr = (permissions: string[]) => {
  const userStore = useUserStore();
  const currentPermissions = userStore.permissions;

  if (currentPermissions.includes('*:*:*')) {
    return true;
  }
  return currentPermissions.some((item) => permissions.includes(item));
};

export const hasPermiAnd = (permissions: string[]) => {
  const userStore = useUserStore();
  const currentPermissions = userStore.permissions;

  if (currentPermissions.includes('*:*:*')) {
    return true;
  }
  return permissions.every((item) => currentPermissions.includes(item));
};

export const hasRole = (role: string) => {
  const userStore = useUserStore();
  const roles = userStore.roles;

  if (roles.includes('admin')) {
    return true;
  }
  return roles.some((item) => item === role);
};

export const hasRoleOr = (roles: string[]) => {
  const userStore = useUserStore();
  const currentRoles = userStore.roles;

  if (currentRoles.includes('admin')) {
    return true;
  }
  return currentRoles.some((item) => roles.includes(item));
};

export const hasRoleAnd = (roles: string[]) => {
  const userStore = useUserStore();
  const currentRoles = userStore.roles;

  if (currentRoles.includes('admin')) {
    return true;
  }
  return roles.every((item) => currentRoles.includes(item));
};

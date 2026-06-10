/**
 * 权限判断 Hook
 *
 * 提供权限和角色的判断逻辑
 */

import { ref, Ref, computed } from 'vue';
import type { ComputedRef } from 'vue';

/** 权限信息 */
export interface PermissionInfo {
  /** 权限标识列表 */
  permissions: string[];
  /** 角色列表 */
  roles: string[];
  /** 用户ID */
  userId: number;
  /** 用户名 */
  username: string;
}

/** 使用权限判断 Hook 返回 */
export interface UsePermissionReturn {
  /** 权限信息 */
  permissionInfo: Ref<PermissionInfo | null>;
  /** 是否有指定权限 */
  hasPermi: (permission: string | string[]) => boolean;
  /** 是否有所有指定权限 */
  hasAllPermi: (permissions: string | string[]) => boolean;
  /** 是否有任一指定权限 */
  hasAnyPermi: (permissions: string | string[]) => boolean;
  /** 是否有指定角色 */
  hasRole: (role: string | string[]) => boolean;
  /** 是否有所有指定角色 */
  hasAllRole: (roles: string | string[]) => boolean;
  /** 是否有任一指定角色 */
  hasAnyRole: (roles: string | string[]) => boolean;
  /** 是否已登录 */
  isLoggedIn: ComputedRef<boolean>;
}

/** 当前用户权限 Hook 返回 */
export interface UseCurrentPermissionReturn {
  /** 权限信息 */
  permissionInfo: Ref<PermissionInfo | null>;
  /** 加载状态 */
  loading: Ref<boolean>;
  /** 设置权限信息 */
  setPermissionInfo: (info: PermissionInfo) => void;
  /** 清除权限信息 */
  clearPermissionInfo: () => void;
  /** 检查权限 */
  checkPermission: (permission: string) => boolean;
  /** 检查角色 */
  checkRole: (role: string) => boolean;
}

// 全局权限信息
const globalPermissionInfo = ref<PermissionInfo | null>(null);

/**
 * 权限判断 Hook
 */
export function usePermission(): UsePermissionReturn {
  const permissionInfo = globalPermissionInfo;

  /**
   * 检查是否有指定权限
   * @param permission 权限标识或标识数组
   */
  function hasPermi(permission: string | string[]): boolean {
    if (!permissionInfo.value) return false;

    const permissions = Array.isArray(permission) ? permission : [permission];
    const userPermissions = permissionInfo.value.permissions;

    return permissions.some((p) => userPermissions.includes(p));
  }

  /**
   * 检查是否有所有指定权限
   * @param permissions 权限标识或标识数组
   */
  function hasAllPermi(permissions: string | string[]): boolean {
    if (!permissionInfo.value) return false;

    const permList = Array.isArray(permissions) ? permissions : [permissions];
    const userPermissions = permissionInfo.value.permissions;

    return permList.every((p) => userPermissions.includes(p));
  }

  /**
   * 检查是否有任一指定权限
   * @param permissions 权限标识或标识数组
   */
  function hasAnyPermi(permissions: string | string[]): boolean {
    return hasPermi(permissions);
  }

  /**
   * 检查是否有指定角色
   * @param role 角色标识或标识数组
   */
  function hasRole(role: string | string[]): boolean {
    if (!permissionInfo.value) return false;

    const roles = Array.isArray(role) ? role : [role];
    const userRoles = permissionInfo.value.roles;

    return roles.some((r) => userRoles.includes(r));
  }

  /**
   * 检查是否有所有指定角色
   * @param roles 角色标识或标识数组
   */
  function hasAllRole(roles: string | string[]): boolean {
    if (!permissionInfo.value) return false;

    const roleList = Array.isArray(roles) ? roles : [roles];
    const userRoles = permissionInfo.value.roles;

    return roleList.every((r) => userRoles.includes(r));
  }

  /**
   * 检查是否有任一指定角色
   * @param roles 角色标识或标识数组
   */
  function hasAnyRole(roles: string | string[]): boolean {
    return hasRole(roles);
  }

  const isLoggedIn = computed(() => !!permissionInfo.value?.userId);

  return {
    permissionInfo,
    hasPermi,
    hasAllPermi,
    hasAnyPermi,
    hasRole,
    hasAllRole,
    hasAnyRole,
    isLoggedIn,
  };
}

/**
 * 当前用户权限 Hook
 */
export function useCurrentPermission(): UseCurrentPermissionReturn {
  const permissionInfo = globalPermissionInfo;
  const loading = ref(false);

  function setPermissionInfo(info: PermissionInfo): void {
    globalPermissionInfo.value = info;
  }

  function clearPermissionInfo(): void {
    globalPermissionInfo.value = null;
  }

  function checkPermission(permission: string): boolean {
    if (!permissionInfo.value) return false;
    return permissionInfo.value.permissions.includes(permission);
  }

  function checkRole(role: string): boolean {
    if (!permissionInfo.value) return false;
    return permissionInfo.value.roles.includes(role);
  }

  return {
    permissionInfo,
    loading,
    setPermissionInfo,
    clearPermissionInfo,
    checkPermission,
    checkRole,
  };
}

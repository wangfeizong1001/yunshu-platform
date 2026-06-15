/**
 * usePermission.test.ts — 单元测试
 *
 * 测试目标：
 *   - usePermission：hasPermi / hasAllPermi / hasAnyPermi
 *     hasRole / hasAllRole / hasAnyRole / isLoggedIn
 *   - useCurrentPermission：setPermissionInfo / clearPermissionInfo /
 *     checkPermission / checkRole
 */

import { describe, it, expect } from 'vitest';
import { usePermission, useCurrentPermission } from './usePermission';

describe('usePermission', () => {
  it('无权限信息：所有判断均为 false', () => {
    const { setPermissionInfo } = useCurrentPermission();
    setPermissionInfo(null as unknown as Parameters<typeof setPermissionInfo>[0]);

    const {
      hasPermi,
      hasAllPermi,
      hasAnyPermi,
      hasRole,
      hasAllRole,
      hasAnyRole,
      isLoggedIn,
    } = usePermission();

    expect(hasPermi('user:list')).toBe(false);
    expect(hasAllPermi(['user:list', 'user:create'])).toBe(false);
    expect(hasAnyPermi(['user:list'])).toBe(false);
    expect(hasRole('admin')).toBe(false);
    expect(hasAllRole(['admin', 'ops'])).toBe(false);
    expect(hasAnyRole(['admin'])).toBe(false);
    expect(isLoggedIn.value).toBe(false);
  });

  it('设置权限信息：hasPermi 可识别单个权限', () => {
    const { setPermissionInfo } = useCurrentPermission();
    setPermissionInfo({
      permissions: ['user:list', 'user:create'],
      roles: ['admin'],
      userId: 1,
      username: 'alice',
    });
    const { hasPermi, isLoggedIn } = usePermission();
    expect(hasPermi('user:list')).toBe(true);
    expect(hasPermi('user:delete')).toBe(false);
    expect(isLoggedIn.value).toBe(true);
  });

  it('权限数组：有任一命中返回 true', () => {
    const { setPermissionInfo } = useCurrentPermission();
    setPermissionInfo({
      permissions: ['user:list'],
      roles: ['admin'],
      userId: 1,
      username: 'a',
    });
    const { hasPermi, hasAnyPermi } = usePermission();
    expect(hasPermi(['user:list', 'user:create'])).toBe(true);
    expect(hasAnyPermi(['user:list', 'user:create'])).toBe(true);
  });

  it('hasAllPermi 需要全部命中', () => {
    const { setPermissionInfo } = useCurrentPermission();
    setPermissionInfo({
      permissions: ['a', 'b'],
      roles: [],
      userId: 1,
      username: 'x',
    });
    const { hasAllPermi } = usePermission();
    expect(hasAllPermi(['a', 'b'])).toBe(true);
    expect(hasAllPermi(['a', 'c'])).toBe(false);
  });

  it('hasRole / hasAllRole / hasAnyRole 按 roles 字段判断', () => {
    const { setPermissionInfo } = useCurrentPermission();
    setPermissionInfo({
      permissions: [],
      roles: ['admin', 'editor'],
      userId: 1,
      username: 'y',
    });
    const { hasRole, hasAllRole, hasAnyRole } = usePermission();
    expect(hasRole('admin')).toBe(true);
    expect(hasRole('guest')).toBe(false);
    expect(hasRole(['admin'])).toBe(true);
    expect(hasAllRole(['admin', 'editor'])).toBe(true);
    expect(hasAllRole(['admin', 'guest'])).toBe(false);
    expect(hasAnyRole(['admin', 'ops'])).toBe(true);
    expect(hasAnyRole(['ops', 'dev'])).toBe(false);
  });
});

describe('useCurrentPermission', () => {
  it('setPermissionInfo 覆盖全局状态', () => {
    const { setPermissionInfo, permissionInfo } = useCurrentPermission();
    setPermissionInfo({
      permissions: ['x'],
      roles: ['r1'],
      userId: 123,
      username: 'n',
    });
    expect(permissionInfo.value).toEqual({
      permissions: ['x'],
      roles: ['r1'],
      userId: 123,
      username: 'n',
    });
  });

  it('clearPermissionInfo 清空', () => {
    const { setPermissionInfo, clearPermissionInfo, permissionInfo } = useCurrentPermission();
    setPermissionInfo({ permissions: ['a'], roles: ['r'], userId: 1, username: 'x' });
    clearPermissionInfo();
    expect(permissionInfo.value).toBeNull();
  });

  it('checkPermission 按权限 key 判断', () => {
    const { setPermissionInfo, checkPermission } = useCurrentPermission();
    setPermissionInfo({
      permissions: ['p1', 'p2'],
      roles: [],
      userId: 1,
      username: 'x',
    });
    expect(checkPermission('p1')).toBe(true);
    expect(checkPermission('p3')).toBe(false);
  });

  it('checkRole 按角色 key 判断', () => {
    const { setPermissionInfo, checkRole } = useCurrentPermission();
    setPermissionInfo({
      permissions: [],
      roles: ['admin'],
      userId: 1,
      username: 'x',
    });
    expect(checkRole('admin')).toBe(true);
    expect(checkRole('guest')).toBe(false);
  });
});

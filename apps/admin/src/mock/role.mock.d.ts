/**
 * 角色 Mock 数据
 */
import type { SysRole, SysRolePageResp } from '@yunshu/shared';
export declare const mockRoleList: SysRole[];
export declare function getMockRolePage(params: any): SysRolePageResp;
export declare function getMockRoleDetail(roleId: number): SysRole | undefined;
export declare function addMockRole(role: Partial<SysRole>): SysRole;
export declare function updateMockRole(roleId: number, role: Partial<SysRole>): SysRole | undefined;
export declare function deleteMockRole(roleId: number): boolean;
//# sourceMappingURL=role.mock.d.ts.map

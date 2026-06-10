/**
 * 用户 Mock 数据
 */
import type { SysUser, SysUserPageResp } from '@yunshu/shared';
export declare const mockUserList: SysUser[];
export declare function getMockUserPage(params: any): SysUserPageResp;
export declare function getMockUserDetail(userId: number): SysUser | undefined;
export declare function addMockUser(user: Partial<SysUser>): SysUser;
export declare function updateMockUser(userId: number, user: Partial<SysUser>): SysUser | undefined;
export declare function deleteMockUser(userId: number): boolean;
//# sourceMappingURL=user.mock.d.ts.map

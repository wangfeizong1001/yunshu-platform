/**
 * 用户管理相关 API
 */
export interface UserQuery {
  pageNum?: number;
  pageSize?: number;
  username?: string;
  nickname?: string;
  phone?: string;
  status?: string;
  deptId?: number;
}
export interface UserForm {
  userId?: number;
  username?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  sex?: string;
  avatar?: string;
  deptId?: number;
  postIds?: number[];
  roleIds?: number[];
  status?: string;
  remark?: string;
}
export interface UserInfo {
  userId: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  sex: string;
  avatar: string;
  deptId: number;
  deptName: string;
  posts: string[];
  roles: string[];
  roleId: number[];
  status: string;
  loginIp: string;
  loginDate: string;
  createTime: string;
  remark: string;
}
export declare function getUserList(params: UserQuery): Promise<unknown>;
export declare function getUserPage(params: UserQuery): Promise<unknown>;
export declare function getUser(userId: number): Promise<unknown>;
export declare function addUser(data: UserForm): Promise<unknown>;
export declare function updateUser(data: UserForm): Promise<unknown>;
export declare function deleteUser(userId: number): Promise<unknown>;
export declare function batchDeleteUser(userIds: number[]): Promise<unknown>;
export declare function changeUserStatus(userId: number, status: string): Promise<unknown>;
export declare function resetUserPwd(userId: number, password: string): Promise<unknown>;
export declare function exportUser(params: UserQuery): Promise<unknown>;
export declare function importTemplate(): Promise<unknown>;
export declare function importUser(data: FormData): Promise<unknown>;
export declare function getAllRoles(): Promise<unknown>;
export declare function assignUserRole(userId: number, roleIds: number[]): Promise<unknown>;
export declare function getUserRoles(userId: number): Promise<unknown>;
//# sourceMappingURL=user.api.d.ts.map

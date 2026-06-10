/**
 * 角色管理 API
 */
export interface RoleQuery {
  pageNum?: number;
  pageSize?: number;
  roleName?: string;
  roleKey?: string;
  status?: string;
}
export interface RoleForm {
  roleId?: number;
  roleName?: string;
  roleKey?: string;
  roleSort?: number;
  dataScope?: string;
  status?: string;
  remark?: string;
  menuIds?: number[];
}
export interface RoleInfo {
  roleId: number;
  roleName: string;
  roleKey: string;
  roleSort: number;
  dataScope: string;
  status: string;
  remark: string;
  createTime: string;
}
export declare const getRoleList: (params?: RoleQuery) => Promise<unknown>;
export declare const getRolePage: (params?: RoleQuery) => Promise<unknown>;
export declare const getRole: (roleId: number) => Promise<unknown>;
export declare const addRole: (data: RoleForm) => Promise<unknown>;
export declare const updateRole: (data: RoleForm) => Promise<unknown>;
export declare const deleteRole: (roleId: number) => Promise<unknown>;
export declare const batchDeleteRole: (roleIds: number[]) => Promise<unknown>;
export declare const changeRoleStatus: (roleId: number, status: string) => Promise<unknown>;
export declare const dataScope: (data: RoleForm) => Promise<unknown>;
export declare const authRoleAll: (roleId: number, menuIds: number[]) => Promise<unknown>;
//# sourceMappingURL=role.api.d.ts.map

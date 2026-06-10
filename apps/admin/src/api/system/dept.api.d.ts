/**
 * 部门管理 API
 */
export interface DeptQuery {
  deptName?: string;
  status?: string;
}
export interface DeptForm {
  deptId?: number;
  parentId?: number;
  deptName?: string;
  orderNum?: number;
  leader?: string;
  phone?: string;
  email?: string;
  status?: string;
  remark?: string;
}
export interface DeptInfo {
  deptId: number;
  parentId: number;
  deptName: string;
  orderNum: number;
  leader: string;
  phone: string;
  email: string;
  status: string;
  remark: string;
  createTime: string;
}
export declare const getDeptList: (params?: DeptQuery) => Promise<unknown>;
export declare const getDept: (deptId: number) => Promise<unknown>;
export declare const getDeptTreeSelect: () => Promise<unknown>;
export declare const getDeptTree: (params?: DeptQuery) => Promise<unknown>;
export declare const getDeptExcludeChild: (deptId: number) => Promise<unknown>;
export declare const addDept: (data: DeptForm) => Promise<unknown>;
export declare const updateDept: (data: DeptForm) => Promise<unknown>;
export declare const deleteDept: (deptId: number) => Promise<unknown>;
//# sourceMappingURL=dept.api.d.ts.map

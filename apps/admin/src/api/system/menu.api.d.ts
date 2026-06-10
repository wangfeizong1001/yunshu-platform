/**
 * 菜单管理 API
 */
export interface MenuQuery {
  menuName?: string;
  status?: string;
}
export interface MenuForm {
  menuId?: number;
  parentId?: number;
  menuName?: string;
  menuType?: string;
  icon?: string;
  path?: string;
  component?: string;
  query?: string;
  isCache?: string;
  isFrame?: string;
  isExternal?: string;
  visible?: string;
  status?: string;
  perms?: string;
  sort?: number;
  remark?: string;
}
export interface MenuInfo {
  menuId: number;
  parentId: number;
  menuName: string;
  menuType: string;
  icon: string;
  path: string;
  component: string;
  query: string;
  isCache: string;
  isFrame: string;
  isExternal: string;
  visible: string;
  status: string;
  perms: string;
  sort: number;
  remark: string;
  createTime: string;
}
export declare const getMenuList: (params?: MenuQuery) => Promise<unknown>;
export declare const getMenuTree: (params?: MenuQuery) => Promise<unknown>;
export declare const getMenuListApi: (params?: MenuQuery) => Promise<unknown>;
export declare const getMenu: (menuId: number) => Promise<unknown>;
export declare const getMenuTreeSelect: () => Promise<unknown>;
export declare const getMenuTreeByRoleId: (roleId: number) => Promise<unknown>;
export declare const addMenu: (data: MenuForm) => Promise<unknown>;
export declare const updateMenu: (data: MenuForm) => Promise<unknown>;
export declare const deleteMenu: (menuId: number) => Promise<unknown>;
//# sourceMappingURL=menu.api.d.ts.map

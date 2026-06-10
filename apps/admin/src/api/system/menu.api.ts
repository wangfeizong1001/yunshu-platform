/**
 * 菜单管理 API
 */

import request from '@/utils/request';

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

export const getMenuList = (params?: MenuQuery) => {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params,
  });
};

export const getMenuTree = (params?: MenuQuery) => {
  return request({
    url: '/system/menu/tree',
    method: 'get',
    params,
  });
};

export const getMenuListApi = (params?: MenuQuery) => {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params,
  });
};

export const getMenu = (menuId: number) => {
  return request({
    url: `/system/menu/${menuId}`,
    method: 'get',
  });
};

export const getMenuTreeSelect = () => {
  return request({
    url: '/system/menu/treeSelect',
    method: 'get',
  });
};

export const getMenuTreeByRoleId = (roleId: number) => {
  return request({
    url: `/system/menu/roleMenuTreeSelect/${roleId}`,
    method: 'get',
  });
};

export const addMenu = (data: MenuForm) => {
  return request({
    url: '/system/menu',
    method: 'post',
    data,
  });
};

export const updateMenu = (data: MenuForm) => {
  return request({
    url: '/system/menu',
    method: 'put',
    data,
  });
};

export const deleteMenu = (menuId: number) => {
  return request({
    url: `/system/menu/${menuId}`,
    method: 'delete',
  });
};

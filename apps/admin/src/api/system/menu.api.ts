/**
 * 菜单管理 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface MenuQuery {
  menuName?: string
  status?: string
}

export interface MenuForm {
  menuId?: number
  parentId?: number
  menuName?: string
  menuType?: string
  icon?: string
  path?: string
  component?: string
  query?: string
  isCache?: string
  isFrame?: string
  isExternal?: string
  visible?: string
  status?: string
  perms?: string
  sort?: number
  remark?: string
}

export interface MenuInfo {
  menuId: number
  parentId: number
  menuName: string
  menuType: string
  icon: string
  path: string
  component: string
  query: string
  isCache: string
  isFrame: string
  isExternal: string
  visible: string
  status: string
  perms: string
  sort: number
  remark: string
  createTime: string
}

export const getMenuList = (params?: MenuQuery) => {
  return request<unknown>({
    url: '/system/menu/list',
    method: 'GET',
    params
  })
}

export const getMenuTree = (params?: MenuQuery) => {
  return request<unknown>({
    url: '/system/menu/tree',
    method: 'GET',
    params
  })
}

export const getMenuListApi = (params?: MenuQuery) => {
  return request<unknown>({
    url: '/system/menu/list',
    method: 'GET',
    params
  })
}

export const getMenu = (menuId: number) => {
  return request<unknown>({
    url: `/system/menu/${menuId}`,
    method: 'GET'
  })
}

export const getMenuTreeSelect = () => {
  return request<unknown>({
    url: '/system/menu/treeSelect',
    method: 'GET'
  })
}

export const getMenuTreeByRoleId = (roleId: number) => {
  return request<unknown>({
    url: `/system/menu/roleMenuTreeSelect/${roleId}`,
    method: 'GET'
  })
}

export const addMenu = (data: MenuForm) => {
  return request<unknown>({
    url: '/system/menu',
    method: 'POST',
    data
  })
}

export const updateMenu = (data: MenuForm) => {
  return request<unknown>({
    url: '/system/menu',
    method: 'PUT',
    data
  })
}

export const deleteMenu = (menuId: number) => {
  return request<unknown>({
    url: `/system/menu/${menuId}`,
    method: 'DELETE'
  })
}

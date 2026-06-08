/**
 * 菜单管理 API
 */

import { request } from '@/utils/request'
import type { SysMenu, SysMenuQuery, SysMenuForm } from '@yunshu/shared/types/system'

/**
 * 获取菜单树
 * @param params 查询参数
 */
export function getMenuTree(params?: SysMenuQuery) {
  return request<SysMenu[]>({
    url: '/system/menu/tree',
    method: 'get',
    params,
  })
}

/**
 * 获取菜单详情
 * @param menuId 菜单ID
 */
export function getMenuDetail(menuId: number) {
  return request<SysMenu>({
    url: `/system/menu/${menuId}`,
    method: 'get',
  })
}

/**
 * 新增菜单
 * @param data 菜单表单数据
 */
export function addMenu(data: SysMenuForm) {
  return request<SysMenu>({
    url: '/system/menu',
    method: 'post',
    data,
  })
}

/**
 * 修改菜单
 * @param menuId 菜单ID
 * @param data 菜单表单数据
 */
export function updateMenu(menuId: number, data: SysMenuForm) {
  return request<SysMenu>({
    url: `/system/menu/${menuId}`,
    method: 'put',
    data,
  })
}

/**
 * 删除菜单
 * @param menuId 菜单ID
 */
export function deleteMenu(menuId: number) {
  return request<void>({
    url: `/system/menu/${menuId}`,
    method: 'delete',
  })
}

/**
 * 获取菜单下拉树
 */
export function getMenuTreeSelect() {
  return request<SysMenu[]>({
    url: '/system/menu/treeSelect',
    method: 'get',
  })
}

/**
 * 获取角色菜单权限树
 * @param roleId 角色ID
 */
export function getRoleMenuTree(roleId: number) {
  return request<SysMenu[]>({
    url: `/system/menu/role/${roleId}/tree`,
    method: 'get',
  })
}

/**
 * 获取角色菜单ID列表
 * @param roleId 角色ID
 */
export function getRoleMenuIds(roleId: number) {
  return request<number[]>({
    url: `/system/menu/role/${roleId}/ids`,
    method: 'get',
  })
}

/**
 * 获取用户路由（用于动态路由生成）
 */
export function getMenuList() {
  return request<{ data: SysMenu[] }>({
    url: '/system/menu/getRouters',
    method: 'get',
  })
}

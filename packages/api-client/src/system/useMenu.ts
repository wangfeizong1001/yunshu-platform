/**
 * 菜单管理 Hook
 *
 * 提供菜单树、详情、新增、编辑、删除等操作
 */

import { ref, Ref } from 'vue'
import { HttpClient } from '../core/HttpClient'
import type { SysMenu, SysMenuQuery, SysMenuForm } from '@yunshu/shared/types/system'

/** 菜单列表 Hook 选项 */
export interface UseMenuListOptions {
  /** 初始查询参数 */
  initialParams?: Partial<SysMenuQuery>
  /** 是否立即加载 */
  immediate?: boolean
}

/** 菜单列表 Hook 返回 */
export interface UseMenuListReturn {
  /** 菜单树 */
  tree: Ref<SysMenu[]>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 查询参数 */
  queryParams: Ref<SysMenuQuery>
  /** 获取菜单列表 */
  fetchTree: () => Promise<void>
  /** 获取菜单详情 */
  fetchDetail: (menuId: number) => Promise<SysMenu>
  /** 创建菜单 */
  create: (data: SysMenuForm) => Promise<SysMenu>
  /** 更新菜单 */
  update: (menuId: number, data: SysMenuForm) => Promise<SysMenu>
  /** 删除菜单 */
  delete: (menuId: number) => Promise<void>
  /** 获取菜单下拉树 */
  getMenuTreeSelect: () => Promise<SysMenu[]>
  /** 获取角色菜单权限 */
  getRoleMenuTree: (roleId: number) => Promise<SysMenu[]>
}

// 创建菜单 API 实例
const menuAPI = new HttpClient({ baseURL: '/api/system/menu' })

/**
 * 菜单列表 Hook
 */
export function useMenuList(options: UseMenuListOptions = {}): UseMenuListReturn {
  const { initialParams = {}, immediate = true } = options

  const loading = ref(false)
  const tree = ref<SysMenu[]>([]) as Ref<SysMenu[]>
  const queryParams = ref<SysMenuQuery>({
    ...initialParams,
  })

  async function fetchTree() {
    loading.value = true
    try {
      const resp = await menuAPI.get<SysMenu[]>('/tree', {
        params: queryParams.value,
      })
      tree.value = resp.data
    } finally {
      loading.value = false
    }
  }

  async function fetchDetail(menuId: number): Promise<SysMenu> {
    const resp = await menuAPI.get<SysMenu>(`/${menuId}`)
    return resp.data
  }

  async function create(formData: SysMenuForm): Promise<SysMenu> {
    const resp = await menuAPI.post<SysMenu>('/', formData)
    return resp.data
  }

  async function update(menuId: number, formData: SysMenuForm): Promise<SysMenu> {
    const resp = await menuAPI.put<SysMenu>(`/${menuId}`, formData)
    return resp.data
  }

  async function deleteMenu(menuId: number): Promise<void> {
    await menuAPI.delete(`/${menuId}`)
  }

  async function getMenuTreeSelect(): Promise<SysMenu[]> {
    const resp = await menuAPI.get<SysMenu[]>('/treeSelect')
    return resp.data
  }

  async function getRoleMenuTree(roleId: number): Promise<SysMenu[]> {
    const resp = await menuAPI.get<SysMenu[]>(`/role/${roleId}/menus`)
    return resp.data
  }

  if (immediate) {
    fetchTree()
  }

  return {
    tree,
    loading,
    queryParams,
    fetchTree,
    fetchDetail,
    create,
    update,
    delete: deleteMenu,
    getMenuTreeSelect,
    getRoleMenuTree,
  }
}

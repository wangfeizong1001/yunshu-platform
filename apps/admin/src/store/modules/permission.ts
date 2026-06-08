/**
 * 权限管理 Store
 * 负责动态路由的生成和管理
 */

import { defineStore } from 'pinia'
import { type RouteRecordRaw } from 'vue-router'
import { constantRoutes, asyncRoutes } from '@/router'
import { getMenuList } from '@/api/system/menu'
import Layout from '@/layouts/index.vue'

interface PermissionState {
  routes: RouteRecordRaw[]      // 完整路由列表
  addRoutes: RouteRecordRaw[]  // 动态添加的路由
  defaultRoutes: RouteRecordRaw[]
  topbarRouters: RouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: []
  }),

  actions: {
    /**
     * 生成动态路由
     * 从后端获取菜单数据，转换为路由配置
     */
    async generateRoutes() {
      try {
        // 从后端获取菜单
        const res = await getMenuList()
        const menuData = res.data || []

        // 将菜单转换为路由
        const accessedRoutes = await generateRoutesFromMenu(menuData)

        // 合并静态asyncRoutes和动态路由
        const allRoutes = [...asyncRoutes, ...accessedRoutes]

        this.addRoutes = allRoutes
        this.routes = [...constantRoutes, ...allRoutes]

        return allRoutes
      } catch (error) {
        console.error('生成路由失败:', error)
        // 即使失败也返回静态asyncRoutes
        this.addRoutes = asyncRoutes
        this.routes = [...constantRoutes, ...asyncRoutes]
        return asyncRoutes
      }
    },

    /**
     * 设置默认路由
     */
    setDefaultRoutes(routes: RouteRecordRaw[]) {
      this.defaultRoutes = routes
    },

    /**
     * 设置顶部导航路由
     */
    setTopbarRoutes(routes: RouteRecordRaw[]) {
      this.topbarRouters = routes
    },

    /**
     * 重置路由状态
     */
    resetRoutes() {
      this.routes = []
      this.addRoutes = []
      this.defaultRoutes = []
      this.topbarRouters = []
    }
  }
})

/**
 * 将菜单数据转换为路由配置
 */
async function generateRoutesFromMenu(menus: any[]): Promise<RouteRecordRaw[]> {
  const routes: RouteRecordRaw[] = []

  for (const menu of menus) {
    // 目录（M）
    if (menu.menuType === 'M') {
      const route: RouteRecordRaw = {
        path: menu.path,
        name: menu.path,
        component: Layout,
        redirect: menu.children?.length ? menu.children[0].path : undefined,
        meta: {
          title: menu.menuName,
          icon: menu.icon,
          noCache: !menu.isCache,
        },
        children: []
      }

      if (menu.children?.length) {
        route.children = await generateRoutesFromMenu(menu.children)
      }

      routes.push(route)
    }
    // 菜单（C）
    else if (menu.menuType === 'C') {
      const route: RouteRecordRaw = {
        path: menu.path,
        name: menu.path,
        component: loadView(menu.component),
        meta: {
          title: menu.menuName,
          icon: menu.icon,
          noCache: !menu.isCache,
          permission: menu.perms ? [menu.perms] : undefined,
          query: menu.query ? JSON.parse(menu.query) : undefined,
        }
      }

      routes.push(route)
    }
    // 按钮（F）不生成路由
  }

  return routes
}

/**
 * 懒加载视图组件
 */
export function loadView(view: string) {
  if (!view) {
    // 如果没有组件路径，返回 404 页面
    return () => import('@/views/error/404.vue')
  }

  // 尝试懒加载组件
  return () => import(`@/views/${view}.vue`)
}

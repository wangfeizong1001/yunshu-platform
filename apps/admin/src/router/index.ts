/**
 * 路由配置
 * 支持基于后端返回菜单的动态路由系统
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { getToken } from '@/utils/auth'

// 静态路由 - 公共路由，不需要权限
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

// 动态路由（需要权限）- 初始化为空，后续从后端加载
export const asyncRoutes: RouteRecordRaw[] = [
  // 租户管理模块
  {
    path: '/tenant',
    name: 'Tenant',
    component: () => import('@/layouts/index.vue'),
    redirect: '/tenant/tenant',
    meta: { title: '租户管理', icon: 'user' },
    children: [
      // 租户管理
      {
        path: '/tenant/tenant',
        name: 'TenantList',
        component: () => import('@/views/tenant/TenantList.vue'),
        meta: { title: '租户管理', icon: 'user' },
      },
      // 套餐管理
      {
        path: '/tenant/package',
        name: 'PackageList',
        component: () => import('@/views/tenant/package/PackageList.vue'),
        meta: { title: '套餐管理', icon: 'document' },
      },
    ],
  },
  // 系统管理模块
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layouts/index.vue'),
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'setting' },
    children: [
      // 数据字典
      {
        path: '/system/dict/type',
        name: 'DictType',
        component: () => import('@/views/system/dict/DictTypeList.vue'),
        meta: { title: '字典类型', icon: 'dictionary' },
      },
      // 参数配置
      {
        path: '/system/config',
        name: 'Config',
        component: () => import('@/views/system/config/ConfigList.vue'),
        meta: { title: '参数配置', icon: 'config' },
      },
      // 通知公告
      {
        path: '/system/notice',
        name: 'Notice',
        component: () => import('@/views/system/notice/NoticeList.vue'),
        meta: { title: '通知公告', icon: 'message' },
      },
      // 文件管理
      {
        path: '/system/file',
        name: 'File',
        component: () => import('@/views/system/file/FileList.vue'),
        meta: { title: '文件管理', icon: 'file' },
      },
      // OSS 存储管理
      {
        path: '/system/oss',
        name: 'Oss',
        component: () => import('@/views/system/oss/OssList.vue'),
        meta: { title: '文件存储', icon: 'cloud' },
      },
      // 短信服务
      {
        path: '/system/sms',
        name: 'Sms',
        component: () => import('@/views/system/sms/SmsConfig.vue'),
        meta: { title: '短信服务', icon: 'message' },
      },
      // SSO 单点登录
      {
        path: '/system/sso',
        name: 'Sso',
        component: () => import('@/views/system/sso/SsoConfig.vue'),
        meta: { title: 'SSO 配置', icon: 'lock' },
      },
      // 第三方登录
      {
        path: '/system/third',
        name: 'Third',
        component: () => import('@/views/system/third/ThirdConfig.vue'),
        meta: { title: '第三方登录', icon: 'third-party' },
      },
    ],
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 路由白名单
const whiteList = ['/login', '/404']

// 标记是否已添加动态路由
let isDynamicRouteAdded = false

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录，跳转到首页
      next({ path: '/' })
    } else {
      const userStore = useUserStore()
      const permissionStore = usePermissionStore()

      // 检查是否有用户信息
      if (!userStore.userId) {
        try {
          // 获取用户信息
          await userStore.getUserInfo()

          // 生成动态路由
          const accessedRoutes = await permissionStore.generateRoutes()

          // 动态添加路由
          accessedRoutes.forEach((route) => {
            router.addRoute(route)
          })

          // 标记已添加动态路由
          isDynamicRouteAdded = true

          // 确保导航到目标路由
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败，跳转到登录页
          await userStore.logout()
          next(`/login?redirect=${to.path}`)
        }
      } else {
        // 已有用户信息，检查是否需要添加动态路由
        if (!isDynamicRouteAdded && permissionStore.addRoutes.length > 0) {
          permissionStore.addRoutes.forEach((route) => {
            router.addRoute(route)
          })
          isDynamicRouteAdded = true
          next({ ...to, replace: true })
        } else {
          next()
        }
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

/**
 * 重置路由
 * 用于退出登录时清除动态路由
 */
export function resetRouter() {
  isDynamicRouteAdded = false
}

export default router

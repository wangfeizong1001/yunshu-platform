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
    path: '/',
    name: 'Layout',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/dashboard',
    meta: { title: '首页', hidden: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
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

// 动态路由（需要权限）
export const asyncRoutes: RouteRecordRaw[] = [
  // 租户管理模块
  {
    path: '/tenant',
    name: 'Tenant',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/tenant/tenant',
    meta: { title: '租户管理', icon: 'user' },
    children: [
      {
        path: 'tenant',
        name: 'TenantList',
        component: () => import('@/views/tenant/TenantList.vue'),
        meta: { title: '租户管理', icon: 'user' }
      },
      {
        path: 'package',
        name: 'PackageList',
        component: () => import('@/views/tenant/package/PackageList.vue'),
        meta: { title: '套餐管理', icon: 'document' }
      }
    ]
  },

  // 系统管理模块
  {
    path: '/system',
    name: 'System',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'setting' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理', icon: 'menu' }
      },
      {
        path: 'dept',
        name: 'Dept',
        component: () => import('@/views/system/dept/DeptTree.vue'),
        meta: { title: '部门管理', icon: 'tree' }
      },
      {
        path: 'post',
        name: 'Post',
        component: () => import('@/views/system/post/PostList.vue'),
        meta: { title: '岗位管理', icon: 'post' }
      },
      {
        path: 'dict/type',
        name: 'DictType',
        component: () => import('@/views/system/dict/DictTypeList.vue'),
        meta: { title: '字典类型', icon: 'dictionary' }
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/system/config/ConfigList.vue'),
        meta: { title: '参数配置', icon: 'config' }
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/views/system/notice/NoticeList.vue'),
        meta: { title: '通知公告', icon: 'message' }
      },
      {
        path: 'file',
        name: 'File',
        component: () => import('@/views/system/file/FileList.vue'),
        meta: { title: '文件管理', icon: 'file' }
      },
      {
        path: 'oss',
        name: 'Oss',
        component: () => import('@/views/system/oss/OssList.vue'),
        meta: { title: '文件存储', icon: 'cloud' }
      },
      {
        path: 'sms',
        name: 'Sms',
        component: () => import('@/views/system/sms/SmsConfig.vue'),
        meta: { title: '短信服务', icon: 'message' }
      },
      {
        path: 'sso',
        name: 'Sso',
        component: () => import('@/views/system/sso/SsoConfig.vue'),
        meta: { title: 'SSO 配置', icon: 'lock' }
      },
      {
        path: 'third',
        name: 'Third',
        component: () => import('@/views/system/third/ThirdConfig.vue'),
        meta: { title: '第三方登录', icon: 'third-party' }
      }
    ]
  },

  // 系统监控模块
  {
    path: '/monitor',
    name: 'Monitor',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/monitor/operlog',
    meta: { title: '系统监控', icon: 'monitor' },
    children: [
      {
        path: 'operlog',
        name: 'Operlog',
        component: () => import('@/views/monitor/operlog/OperlogList.vue'),
        meta: { title: '操作日志', icon: 'log' }
      },
      {
        path: 'logininfor',
        name: 'Logininfor',
        component: () => import('@/views/monitor/logininfor/LogininforList.vue'),
        meta: { title: '登录日志', icon: 'login' }
      },
      {
        path: 'online',
        name: 'Online',
        component: () => import('@/views/monitor/online/OnlineList.vue'),
        meta: { title: '在线用户', icon: 'online' }
      },
      {
        path: 'server',
        name: 'Server',
        component: () => import('@/views/monitor/server/ServerMonitor.vue'),
        meta: { title: '服务监控', icon: 'server' }
      },
      {
        path: 'job',
        name: 'Job',
        component: () => import('@/views/monitor/job/JobList.vue'),
        meta: { title: '定时任务', icon: 'job' }
      }
    ]
  },

  // 系统工具模块
  {
    path: '/tool',
    name: 'Tool',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/tool/gen',
    meta: { title: '系统工具', icon: 'tool' },
    children: [
      {
        path: 'gen',
        name: 'Gen',
        component: () => import('@/views/tool/gen/GenList.vue'),
        meta: { title: '代码生成', icon: 'code' }
      }
    ]
  },

  // 个人中心
  {
    path: '/user/profile',
    name: 'Profile',
    component: () => import('@/views/layout/index.vue'),
    meta: { title: '个人中心', hidden: true },
    children: [
      {
        path: 'index',
        name: 'ProfileIndex',
        component: () => import('@/views/user/profile/index.vue'),
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
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
  // 设置页面标题
  document.title = (to.meta.title as string) || '云枢中台'

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
          console.error('获取用户信息失败:', error)
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

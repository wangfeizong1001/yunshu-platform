/**
 * 用户管理 Store
 * 负责用户登录、登出和用户信息管理
 */

import { defineStore } from 'pinia'
import { loginApi, logoutApi, getUserInfoApi } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import cache, { CACHE_KEYS } from '@/utils/cache'

interface UserState {
  token: string
  userId: string
  username: string
  nickname: string
  avatar: string
  email: string
  phone: string
  deptId: string
  deptName: string
  roles: string[]
  roleId: number[]
  permissions: string[]
}

export interface UserInfo {
  userId: string
  username: string
  nickname?: string
  avatar?: string
  email?: string
  phone?: string
  deptId?: string
  deptName?: string
  roleId?: number[]
}

/**
 * 登录接口响应结构
 */
interface LoginResponse {
  data?: {
    token?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

/**
 * 用户信息接口响应结构
 */
interface UserInfoResponse {
  data?: {
    user?: {
      userId?: string | number
      username?: string
      nickname?: string
      avatar?: string
      email?: string
      phone?: string
      deptId?: string | number
      deptName?: string
      roleId?: number[]
      [key: string]: unknown
    }
    roles?: string[]
    permissions?: string[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    const cachedUserInfo = cache.get<UserState>(CACHE_KEYS.USER_INFO)
    return {
      token: getToken() || '',
      userId: cachedUserInfo?.userId || '',
      username: cachedUserInfo?.username || '',
      nickname: cachedUserInfo?.nickname || '',
      avatar: cachedUserInfo?.avatar || '',
      email: cachedUserInfo?.email || '',
      phone: cachedUserInfo?.phone || '',
      deptId: cachedUserInfo?.deptId || '',
      deptName: cachedUserInfo?.deptName || '',
      roles: cachedUserInfo?.roles || [],
      roleId: cachedUserInfo?.roleId || [],
      permissions: cachedUserInfo?.permissions || []
    }
  },

  actions: {
    /**
     * 保存用户信息到缓存
     */
    saveToCache() {
      cache.set(CACHE_KEYS.USER_INFO, this.$state, {
        ttl: 24 * 60 * 60 * 1000 // 24小时过期
      })
    },

    /**
     * 用户登录
     */
    async login(userInfo: { username: string; password: string; code?: string; uuid?: string }) {
      try {
        const res = (await loginApi(userInfo)) as LoginResponse
        const data = res?.data || {}

        this.token = String(data.token || '')
        setToken(String(data.token || ''))

        return data
      } catch (error) {
        throw error
      }
    },

    /**
     * 获取用户信息
     */
    async getUserInfo() {
      try {
        const res = (await getUserInfoApi()) as UserInfoResponse
        const data = res?.data || {}
        const user = data.user || {}

        this.userId = String(user?.userId || '')
        this.username = String(user?.username || '')
        this.nickname = String(user?.nickname || user?.username || '')
        this.avatar = String(user?.avatar || '')
        this.email = String(user?.email || '')
        this.phone = String(user?.phone || '')
        this.deptId = String(user?.deptId || '')
        this.deptName = String(user?.deptName || '')
        this.roles = (data.roles as string[]) || []
        this.roleId = ((user?.roleId as number[]) || []).map(Number)
        this.permissions = (data.permissions as string[]) || []

        this.saveToCache()

        // 生成动态路由
        await usePermissionStore().generateRoutes()

        return data
      } catch (error) {
        throw error
      }
    },

    /**
     * 用户登出
     */
    async logout() {
      try {
        await logoutApi()
      } finally {
        this.resetState()
        removeToken()
        cache.remove(CACHE_KEYS.USER_INFO)
      }
    },

    /**
     * 重置用户状态
     */
    resetState() {
      this.token = ''
      this.userId = ''
      this.username = ''
      this.nickname = ''
      this.avatar = ''
      this.email = ''
      this.phone = ''
      this.deptId = ''
      this.deptName = ''
      this.roles = []
      this.roleId = []
      this.permissions = []
    }
  }
})

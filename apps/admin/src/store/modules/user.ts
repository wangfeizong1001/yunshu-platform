/**
 * 用户管理 Store
 * 负责用户登录、登出和用户信息管理
 */

import { defineStore } from 'pinia'
import { loginApi, logoutApi, getUserInfoApi } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
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

interface UserInfo {
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
        const res = await loginApi(userInfo)
        const data = res.data

        this.token = data.token
        setToken(data.token)

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
        const res = await getUserInfoApi()
        const data = res.data

        this.userId = data.user.userId
        this.username = data.user.username
        this.nickname = data.user.nickname || data.user.username
        this.avatar = data.user.avatar || ''
        this.email = data.user.email || ''
        this.phone = data.user.phone || ''
        this.deptId = data.user.deptId || ''
        this.deptName = data.user.deptName || ''
        this.roles = data.roles || []
        this.roleId = data.user.roleId || []
        this.permissions = data.permissions || []

        this.saveToCache()

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

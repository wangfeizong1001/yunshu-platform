/**
 * 用户管理 Store
 * 负责用户登录、登出和用户信息管理
 */

import { defineStore } from 'pinia'
import { loginApi, logoutApi, getUserInfoApi } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

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

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userId: '',
    username: '',
    nickname: '',
    avatar: '',
    email: '',
    phone: '',
    deptId: '',
    deptName: '',
    roles: [],
    roleId: [],
    permissions: []
  }),

  actions: {
    /**
     * 用户登录
     */
    async login(userInfo: { username: string; password: string }) {
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

/**
 * 用户管理 Store
 * 负责用户登录、登出和用户信息管理
 */
import { defineStore } from 'pinia';
import { loginApi, logoutApi, getUserInfoApi } from '@/api/auth';
import { getToken, setToken, removeToken } from '@/utils/auth';
import cache, { CACHE_KEYS } from '@/utils/cache';
export const useUserStore = defineStore('user', {
  state: () => {
    const cachedUserInfo = cache.get(CACHE_KEYS.USER_INFO);
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
      permissions: cachedUserInfo?.permissions || [],
    };
  },
  actions: {
    /**
     * 保存用户信息到缓存
     */
    saveToCache() {
      cache.set(CACHE_KEYS.USER_INFO, this.$state, {
        ttl: 24 * 60 * 60 * 1000, // 24小时过期
      });
    },
    /**
     * 用户登录
     */
    async login(userInfo) {
      try {
        const res = await loginApi(userInfo);
        const data = res.data;
        this.token = String(data.token || '');
        setToken(String(data.token || ''));
        return data;
      } catch (error) {
        throw error;
      }
    },
    /**
     * 获取用户信息
     */
    async getUserInfo() {
      try {
        const res = await getUserInfoApi();
        const data = res.data;
        const user = data.user || {};
        this.userId = String(user.userId || '');
        this.username = String(user.username || '');
        this.nickname = String(user.nickname || user.username || '');
        this.avatar = String(user.avatar || '');
        this.email = String(user.email || '');
        this.phone = String(user.phone || '');
        this.deptId = String(user.deptId || '');
        this.deptName = String(user.deptName || '');
        this.roles = data.roles || [];
        this.roleId = (user.roleId || []).map(Number);
        this.permissions = data.permissions || [];
        this.saveToCache();
        return data;
      } catch (error) {
        throw error;
      }
    },
    /**
     * 用户登出
     */
    async logout() {
      try {
        await logoutApi();
      } finally {
        this.resetState();
        removeToken();
        cache.remove(CACHE_KEYS.USER_INFO);
      }
    },
    /**
     * 重置用户状态
     */
    resetState() {
      this.token = '';
      this.userId = '';
      this.username = '';
      this.nickname = '';
      this.avatar = '';
      this.email = '';
      this.phone = '';
      this.deptId = '';
      this.deptName = '';
      this.roles = [];
      this.roleId = [];
      this.permissions = [];
    },
  },
});
//# sourceMappingURL=user.js.map

/**
 * SSO 单点登录 Mock API
 * @module mock/routes/system/sso
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'

// ========== SSO 配置数据 ==========
interface SsoConfig {
  id: number
  type: string
  name: string
  clientId: string
  clientSecret: string
  authorizeUrl: string
  tokenUrl: string
  userInfoUrl: string
  logoutUrl: string
  scopes: string[]
  status: string
  remark: string
  createTime: string
  updateTime: string
}

let ssoConfig: SsoConfig = {
  id: 1,
  type: 'oauth2',
  name: 'OAuth2 单点登录',
  clientId: 'yunshu-client',
  clientSecret: 'yunshu-secret-2024',
  authorizeUrl: 'https://sso.example.com/oauth2/authorize',
  tokenUrl: 'https://sso.example.com/oauth2/token',
  userInfoUrl: 'https://sso.example.com/oauth2/userinfo',
  logoutUrl: 'https://sso.example.com/oauth2/logout',
  scopes: ['openid', 'profile', 'email'],
  status: '0',
  remark: '统一身份认证平台',
  createTime: '2024-01-01 10:00:00',
  updateTime: '2024-01-15 14:30:00'
}

// ========== SSO 应用数据 ==========
interface SsoApp {
  id: number
  appName: string
  appCode: string
  clientId: string
  clientSecret: string
  redirectUri: string
  userInfoUrl: string
  scopes: string[]
  logo: string
  status: string
  remark: string
  createTime: string
  updateTime: string
}

let ssoApps: SsoApp[] = [
  {
    id: 1,
    appName: '云枢管理系统',
    appCode: 'YUNSHU_ADMIN',
    clientId: 'admin-client-id',
    clientSecret: 'admin-secret-key',
    redirectUri: 'https://admin.yunshu.com/sso/callback',
    userInfoUrl: 'https://sso.yunshu.com/api/user/info',
    scopes: ['user:info', 'user:roles'],
    logo: '',
    status: '1',
    remark: '主管理系统',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-10 09:30:00'
  },
  {
    id: 2,
    appName: '云枢门户',
    appCode: 'YUNSHU_PORTAL',
    clientId: 'portal-client-id',
    clientSecret: 'portal-secret-key',
    redirectUri: 'https://portal.yunshu.com/sso/callback',
    userInfoUrl: 'https://sso.yunshu.com/api/user/info',
    scopes: ['user:info'],
    logo: '',
    status: '1',
    remark: '用户门户',
    createTime: '2024-01-05 11:00:00',
    updateTime: '2024-01-12 15:20:00'
  },
  {
    id: 3,
    appName: '云枢报表系统',
    appCode: 'YUNSHU_REPORT',
    clientId: 'report-client-id',
    clientSecret: 'report-secret-key',
    redirectUri: 'https://report.yunshu.com/sso/callback',
    userInfoUrl: 'https://sso.yunshu.com/api/user/info',
    scopes: ['user:info', 'report:view'],
    logo: '',
    status: '0',
    remark: '数据报表系统',
    createTime: '2024-01-08 14:00:00',
    updateTime: '2024-01-15 10:00:00'
  }
]

export default [
  // ========== SSO 全局配置 ==========
  /**
   * 获取 SSO 全局配置
   */
  {
    url: '/api/system/sso/config',
    method: 'get',
    response: async () => {
      await delay()
      return success(ssoConfig)
    }
  },

  /**
   * 保存 SSO 全局配置
   */
  {
    url: '/api/system/sso/config',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      ssoConfig = {
        ...ssoConfig,
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '保存成功')
    }
  },

  /**
   * 测试 SSO 连接
   */
  {
    url: '/api/system/sso/config/test',
    method: 'post',
    response: async () => {
      await delay()

      // 模拟测试连接
      return success({
        success: true,
        message: '连接成功'
      }, '测试成功')
    }
  },

  // ========== SSO 应用管理 ==========
  /**
   * 获取 SSO 应用分页列表
   */
  {
    url: '/api/system/sso/app/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; appName?: string; status?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { appName, status } = query

      let list = [...ssoApps]

      if (appName) {
        list = list.filter(a => a.appName.includes(appName))
      }
      if (status) {
        list = list.filter(a => a.status === status)
      }

      list.sort((a, b) => b.id - a.id)

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize

      return pageResult(list.slice(start, end), list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取 SSO 应用列表
   */
  {
    url: '/api/system/sso/app/list',
    method: 'get',
    response: async () => {
      await delay()
      return success(ssoApps)
    }
  },

  /**
   * 获取 SSO 应用详情
   */
  {
    url: '/api/system/sso/app/:id',
    method: 'get',
    response: async ({ params }: { params: { id: string } }) => {
      await delay()

      const app = ssoApps.find(a => a.id === parseInt(params.id))
      if (!app) {
        return fail('应用不存在', 404)
      }

      return success(app)
    }
  },

  /**
   * 新增 SSO 应用
   */
  {
    url: '/api/system/sso/app',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      if (ssoApps.some(a => a.appCode === body.appCode)) {
        return fail('应用编码已存在')
      }

      const maxId = Math.max(...ssoApps.map(a => a.id), 0)
      const newApp: SsoApp = {
        id: maxId + 1,
        appName: body.appName,
        appCode: body.appCode,
        clientId: body.clientId || `client-${Date.now()}`,
        clientSecret: body.clientSecret || `secret-${Date.now()}`,
        redirectUri: body.redirectUri,
        userInfoUrl: body.userInfoUrl,
        scopes: body.scopes || [],
        logo: body.logo || '',
        status: body.status || '1',
        remark: body.remark || '',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      ssoApps.push(newApp)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改 SSO 应用
   */
  {
    url: '/api/system/sso/app',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const index = ssoApps.findIndex(a => a.id === body.id)
      if (index === -1) {
        return fail('应用不存在', 404)
      }

      ssoApps[index] = {
        ...ssoApps[index],
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除 SSO 应用
   */
  {
    url: '/api/system/sso/app/:id',
    method: 'delete',
    response: async ({ params }: { params: { id: string } }) => {
      await delay()

      const index = ssoApps.findIndex(a => a.id === parseInt(params.id))
      if (index === -1) {
        return fail('应用不存在', 404)
      }

      ssoApps.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 重置应用密钥
   */
  {
    url: '/api/system/sso/app/:id/reset-secret',
    method: 'put',
    response: async ({ params }: { params: { id: string } }) => {
      await delay()

      const app = ssoApps.find(a => a.id === parseInt(params.id))
      if (!app) {
        return fail('应用不存在', 404)
      }

      app.clientSecret = `secret-${Date.now()}`
      app.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

      return success({ clientSecret: app.clientSecret }, '重置成功')
    }
  }
] as MockMethod[]

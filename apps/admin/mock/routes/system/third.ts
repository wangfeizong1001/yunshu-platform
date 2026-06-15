/**
 * 第三方登录 Mock API
 * @module mock/routes/system/third
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'

// ========== 第三方登录配置 ==========
interface ThirdConfig {
  id: number
  configId: string
  configName: string
  clientId: string
  clientSecret: string
  grantType: string
  callbackUrl: string
  scopes: string[]
  status: string
  remark: string
  createTime: string
  updateTime: string
}

let thirdConfigs: ThirdConfig[] = [
  {
    id: 1,
    configId: 'wx-miniapp',
    configName: '微信小程序',
    clientId: 'wx1234567890',
    clientSecret: 'a1b2c3d4e5f6g7h8i9j0',
    grantType: 'authorization_code',
    callbackUrl: 'https://admin.yunshu.com/third/callback/wx',
    scopes: ['snsapi_userinfo'],
    status: '1',
    remark: '微信小程序登录',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-10 14:30:00'
  },
  {
    id: 2,
    configId: 'dingtalk',
    configName: '钉钉',
    clientId: 'ding1234567890',
    clientSecret: 'dingSecret123456',
    grantType: 'authorization_code',
    callbackUrl: 'https://admin.yunshu.com/third/callback/dingtalk',
    scopes: ['snsapi_userinfo', 'snsapi_contact'],
    status: '1',
    remark: '钉钉企业登录',
    createTime: '2024-01-02 11:00:00',
    updateTime: '2024-01-12 09:00:00'
  },
  {
    id: 3,
    configId: 'feishu',
    configName: '飞书',
    clientId: 'feishu123456',
    clientSecret: 'feishuSecret789',
    grantType: 'authorization_code',
    callbackUrl: 'https://admin.yunshu.com/third/callback/feishu',
    scopes: ['contact:user.employee_id:readonly'],
    status: '1',
    remark: '飞书登录',
    createTime: '2024-01-03 14:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 4,
    configId: 'github',
    configName: 'GitHub',
    clientId: 'github123456789',
    clientSecret: 'githubSecret456',
    grantType: 'authorization_code',
    callbackUrl: 'https://admin.yunshu.com/third/callback/github',
    scopes: ['user:email'],
    status: '0',
    remark: 'GitHub 开发者登录',
    createTime: '2024-01-05 09:00:00',
    updateTime: '2024-01-08 16:00:00'
  }
]

// ========== 第三方登录日志 ==========
interface ThirdLoginLog {
  logId: number
  configId: string
  configName: string
  userId: number
  nickname: string
  openId: string
  unionId: string
  status: string
  loginTime: string
  ip: string
  ua: string
  errorMsg: string
}

let thirdLoginLogs: ThirdLoginLog[] = []

// 生成模拟登录日志
const nicknames = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
const ips = ['192.168.1.100', '192.168.1.101', '10.0.0.50', '172.16.0.20']

for (let i = 1; i <= 100; i++) {
  const config = thirdConfigs[Math.floor(Math.random() * thirdConfigs.length)]
  const status = Math.random() > 0.05 ? '1' : '0'
  thirdLoginLogs.push({
    logId: i,
    configId: config.configId,
    configName: config.configName,
    userId: Math.floor(Math.random() * 1000),
    nickname: nicknames[Math.floor(Math.random() * nicknames.length)],
    openId: `openid_${Math.random().toString(36).substring(2, 10)}`,
    unionId: `unionid_${Math.random().toString(36).substring(2, 12)}`,
    status,
    loginTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
    ip: ips[Math.floor(Math.random() * ips.length)],
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    errorMsg: status === '1' ? '' : ['授权超时', '用户取消', '授权码无效', '网络异常'][Math.floor(Math.random() * 4)]
  })
}

export default [
  // ========== 第三方配置管理 ==========
  /**
   * 获取第三方配置分页列表
   */
  {
    url: '/api/system/third/config/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; configName?: string; status?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { configName, status } = query

      let list = [...thirdConfigs]

      if (configName) {
        list = list.filter(c => c.configName.includes(configName) || c.configId.includes(configName))
      }
      if (status) {
        list = list.filter(c => c.status === status)
      }

      list.sort((a, b) => b.id - a.id)

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize

      return pageResult(list.slice(start, end), list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取第三方配置列表
   */
  {
    url: '/api/system/third/config/list',
    method: 'get',
    response: async () => {
      await delay()
      return success(thirdConfigs.filter(c => c.status === '1'))
    }
  },

  /**
   * 获取第三方配置详情
   */
  {
    url: '/api/system/third/config/:id',
    method: 'get',
    response: async ({ params }: { params: { id: string } }) => {
      await delay()

      const config = thirdConfigs.find(c => c.id === parseInt(params.id))
      if (!config) {
        return fail('配置不存在', 404)
      }

      return success(config)
    }
  },

  /**
   * 新增第三方配置
   */
  {
    url: '/api/system/third/config',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      if (thirdConfigs.some(c => c.configId === body.configId)) {
        return fail('配置标识已存在')
      }

      const maxId = Math.max(...thirdConfigs.map(c => c.id), 0)
      const newConfig: ThirdConfig = {
        id: maxId + 1,
        configId: body.configId,
        configName: body.configName,
        clientId: body.clientId,
        clientSecret: body.clientSecret,
        grantType: body.grantType || 'authorization_code',
        callbackUrl: body.callbackUrl,
        scopes: body.scopes || [],
        status: body.status || '1',
        remark: body.remark || '',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      thirdConfigs.push(newConfig)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改第三方配置
   */
  {
    url: '/api/system/third/config',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const index = thirdConfigs.findIndex(c => c.id === body.id)
      if (index === -1) {
        return fail('配置不存在', 404)
      }

      thirdConfigs[index] = {
        ...thirdConfigs[index],
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除第三方配置
   */
  {
    url: '/api/system/third/config/:id',
    method: 'delete',
    response: async ({ params }: { params: { id: string } }) => {
      await delay()

      const index = thirdConfigs.findIndex(c => c.id === parseInt(params.id))
      if (index === -1) {
        return fail('配置不存在', 404)
      }

      thirdConfigs.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 修改第三方配置状态
   */
  {
    url: '/api/system/third/config/:id/status',
    method: 'put',
    response: async ({ params, body }: { params: { id: string }; body: { status: string } }) => {
      await delay()

      const config = thirdConfigs.find(c => c.id === parseInt(params.id))
      if (!config) {
        return fail('配置不存在', 404)
      }

      config.status = body.status
      config.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

      return success(null, '状态修改成功')
    }
  },

  // ========== 第三方登录日志 ==========
  /**
   * 获取登录日志分页列表
   */
  {
    url: '/api/system/third/log/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; configId?: string; status?: string; nickname?: string; startTime?: string; endTime?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { configId, status, nickname, startTime, endTime } = query

      let list = [...thirdLoginLogs]

      if (configId) {
        list = list.filter(l => l.configId === configId)
      }
      if (status) {
        list = list.filter(l => l.status === status)
      }
      if (nickname) {
        list = list.filter(l => l.nickname.includes(nickname))
      }

      list.sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime())

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize

      return pageResult(list.slice(start, end), list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取登录日志详情
   */
  {
    url: '/api/system/third/log/:logId',
    method: 'get',
    response: async ({ params }: { params: { logId: string } }) => {
      await delay()

      const log = thirdLoginLogs.find(l => l.logId === parseInt(params.logId))
      if (!log) {
        return fail('日志不存在', 404)
      }

      return success(log)
    }
  },

  /**
   * 清空登录日志
   */
  {
    url: '/api/system/third/log/clean',
    method: 'delete',
    response: async () => {
      await delay()
      thirdLoginLogs = []
      return success(null, '清空成功')
    }
  },

  /**
   * 导出登录日志
   */
  {
    url: '/api/system/third/log/export',
    method: 'get',
    response: async () => {
      await delay()
      return success({ downloadUrl: '/downloads/third_login_log_export.xlsx' })
    }
  }
] as MockMethod[]

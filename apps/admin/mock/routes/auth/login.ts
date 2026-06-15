/**
 * 认证相关 Mock API
 * @module mock/routes/auth
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'
import { db } from '../utils/database'

// ========== 验证码存储（内存中） ==========
const captchaStore = new Map<string, { code: string; expires: number }>()

/** 生成随机 4 位验证码 */
function generateCaptchaCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/** 生成 SVG 验证码图片 */
function generateCaptchaSvg(code: string): string {
  // 随机扭曲和颜色
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
  const bgColor = '#f5f7fa'
  const color = colors[Math.floor(Math.random() * colors.length)]

  // 简单的 SVG 验证码
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50">
    <rect width="150" height="50" fill="${bgColor}" rx="8"/>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
          font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${color}"
          transform="rotate(${-5 + Math.random() * 10}, 75, 25)">${code}</text>
    <line x1="0" y1="${10 + Math.random() * 30}" x2="150" y2="${10 + Math.random() * 30}"
          stroke="${color}" stroke-width="1" opacity="0.3"/>
    <line x1="0" y1="${10 + Math.random() * 30}" x2="150" y2="${10 + Math.random() * 30}"
          stroke="${color}" stroke-width="1" opacity="0.3"/>
  </svg>`

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/** 清理过期验证码 */
function cleanExpiredCaptcha() {
  const now = Date.now()
  for (const [key, value] of captchaStore.entries()) {
    if (value.expires < now) {
      captchaStore.delete(key)
    }
  }
}

// 每分钟清理一次过期验证码
setInterval(cleanExpiredCaptcha, 60000)

export default [
  /**
   * 用户登录
   */
  {
    url: '/api/auth/login',
    method: 'post',
    response: async ({ body }: { body: { username: string; password: string; code?: string; uuid?: string } }) => {
      await randomDelay(200, 500)

      const { username, password, code, uuid } = body

      if (!username || !password) {
        return fail('用户名或密码不能为空', 400)
      }

      // 验证码验证（如果启用了验证码）
      if (code && uuid) {
        const captcha = captchaStore.get(uuid)
        if (!captcha) {
          return fail('验证码已过期，请刷新重试', 400)
        }
        if (captcha.expires < Date.now()) {
          captchaStore.delete(uuid)
          return fail('验证码已过期，请刷新重试', 400)
        }
        if (captcha.code.toUpperCase() !== code.toUpperCase()) {
          return fail('验证码错误', 400)
        }
        // 验证成功后删除验证码，防止重复使用
        captchaStore.delete(uuid)
      }

      const user = db.users.find(u => u.username === username)

      if (!user) {
        return fail('用户名或密码错误', 401)
      }

      if (user.password !== password) {
        return fail('用户名或密码错误', 401)
      }

      if (user.status === '1') {
        return fail('账号已被停用', 401)
      }

      // 更新登录信息
      user.loginIp = '127.0.0.1'
      user.loginDate = new Date().toISOString().replace('T', ' ').slice(0, 19)

      // 获取用户角色
      const roles = db.roles
        .filter(r => user.roleId.includes(r.roleId))
        .map(r => r.roleKey)

      // 获取用户权限
      const permissions = roles.includes('admin')
        ? ['*:*:*']
        : db.roles
            .filter(r => user.roleId.includes(r.roleId))
            .flatMap(r => r.permissions)

      return success({
        token: `mock-token-${Date.now()}-${user.userId}`,
        expires: 720,
        userId: user.userId,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        roles,
        permissions
      }, '登录成功')
    }
  },

  /**
   * 用户登出
   */
  {
    url: '/api/auth/logout',
    method: 'post',
    response: async () => {
      await delay(100)
      return success(null, '退出成功')
    }
  },

  /**
   * 获取用户信息
   */
  {
    url: '/api/auth/userinfo',
    method: 'get',
    response: async (options: { headers?: { authorization?: string } }) => {
      await delay()

      const token = options.headers?.authorization
      if (!token) {
        return fail('未授权', 401)
      }

      // 从 token 中提取用户 ID（mock 实现）
      const tokenMatch = token.match(/mock-token-.*-(\d+)/)
      const userId = tokenMatch ? parseInt(tokenMatch[1]) : 1

      const user = db.users.find(u => u.userId === userId)
      if (!user) {
        return fail('用户不存在', 404)
      }

      // 获取用户角色
      const roles = db.roles
        .filter(r => user.roleId.includes(r.roleId))
        .map(r => ({ roleId: r.roleId, roleName: r.roleName, roleKey: r.roleKey }))

      // 获取用户权限
      const permissions = roles.some(r => r.roleKey === 'admin')
        ? ['*:*:*']
        : db.roles
            .filter(r => user.roleId.includes(r.roleId))
            .flatMap(r => r.permissions)

      // 获取部门名称
      const dept = db.depts.find(d => d.deptId === user.deptId)

      return success({
        userId: user.userId,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        sex: user.sex,
        deptId: user.deptId,
        deptName: dept?.deptName || '',
        postId: user.postId,
        posts: db.posts.filter(p => user.postId.includes(p.postId)).map(p => p.postName),
        roles,
        roleId: user.roleId,
        permissions,
        status: user.status,
        loginIp: user.loginIp,
        loginDate: user.loginDate
      })
    }
  },

  /**
   * 获取验证码
   */
  {
    url: '/api/auth/captcha',
    method: 'get',
    response: async () => {
      await delay()

      // 生成新的验证码
      const code = generateCaptchaCode()
      const uuid = `captcha-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const img = generateCaptchaSvg(code)

      // 存储验证码（5分钟过期）
      captchaStore.set(uuid, {
        code,
        expires: Date.now() + 5 * 60 * 1000
      })

      return success({
        captchaOnOff: true,
        uuid,
        img,
        // 开发模式下返回验证码，方便测试
        code: import.meta.env.DEV ? code : undefined
      })
    }
  },

  /**
   * 刷新令牌
   */
  {
    url: '/api/auth/refresh',
    method: 'post',
    response: async (options: { headers?: { authorization?: string } }) => {
      await delay()
      const token = options.headers?.authorization
      if (!token) {
        return fail('未授权', 401)
      }
      return success({
        token: `mock-token-refresh-${Date.now()}`,
        expires: 720
      })
    }
  }
] as MockMethod[]

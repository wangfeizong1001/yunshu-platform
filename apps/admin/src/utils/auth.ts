/**
 * 认证工具函数
 * 处理 Token 的存储、获取和删除
 */

const TokenKey = 'Admin-Token'

/**
 * 获取 Token
 */
export function getToken(): string | null {
  return localStorage.getItem(TokenKey)
}

/**
 * 设置 Token
 */
export function setToken(token: string): void {
  localStorage.setItem(TokenKey, token)
}

/**
 * 删除 Token
 */
export function removeToken(): void {
  localStorage.removeItem(TokenKey)
}

/**
 * 是否已登录（是否有有效 Token）
 */
export function hasToken(): boolean {
  return !!getToken()
}

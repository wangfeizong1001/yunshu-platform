/**
 * 参数验证工具
 * @module mock/validator
 */

/** 验证结果 */
export interface ValidationResult {
  valid: boolean
  message?: string
}

/**
 * 非空验证
 * @param value 值
 * @param fieldName 字段名称
 */
export function required(value: any, fieldName: string): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: `${fieldName}不能为空` }
  }
  return { valid: true }
}

/**
 * 手机号验证
 * @param phone 手机号
 */
export function phone(phone: string): ValidationResult {
  if (!phone) {
    return { valid: true } // 可选字段
  }
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
    ? { valid: true }
    : { valid: false, message: '手机号格式不正确' }
}

/**
 * 邮箱验证
 * @param email 邮箱
 */
export function email(email: string): ValidationResult {
  if (!email) {
    return { valid: true } // 可选字段
  }
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return reg.test(email)
    ? { valid: true }
    : { valid: false, message: '邮箱格式不正确' }
}

/**
 * 长度验证
 * @param value 值
 * @param min 最小长度
 * @param max 最大长度
 * @param fieldName 字段名称
 */
export function length(value: string, min: number, max: number, fieldName: string): ValidationResult {
  if (!value) {
    return { valid: true } // 可选字段
  }
  if (value.length < min || value.length > max) {
    return { valid: false, message: `${fieldName}长度应在${min}-${max}个字符之间` }
  }
  return { valid: true }
}

/**
 * 数字范围验证
 * @param value 值
 * @param min 最小值
 * @param max 最大值
 * @param fieldName 字段名称
 */
export function range(value: number, min: number, max: number, fieldName: string): ValidationResult {
  if (value < min || value > max) {
    return { valid: false, message: `${fieldName}应在${min}-${max}之间` }
  }
  return { valid: true }
}

/**
 * 验证用户名（字母、数字、下划线，4-20位）
 * @param username 用户名
 */
export function username(username: string): ValidationResult {
  if (!username) {
    return { valid: false, message: '用户名不能为空' }
  }
  const reg = /^[a-zA-Z0-9_]{4,20}$/
  return reg.test(username)
    ? { valid: true }
    : { valid: false, message: '用户名只能包含字母、数字和下划线，长度4-20位' }
}

/**
 * 验证密码（至少6位）
 * @param password 密码
 */
export function password(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: '密码不能为空' }
  }
  if (password.length < 6) {
    return { valid: false, message: '密码长度至少6位' }
  }
  return { valid: true }
}

/**
 * 验证Cron表达式（简单验证）
 * @param cron Cron表达式
 */
export function cron(cron: string): ValidationResult {
  if (!cron) {
    return { valid: false, message: 'Cron表达式不能为空' }
  }
  // 简单验证：6或7位，以空格分隔
  const parts = cron.trim().split(/\s+/)
  if (parts.length < 6 || parts.length > 7) {
    return { valid: false, message: 'Cron表达式格式不正确' }
  }
  return { valid: true }
}

/**
 * 组合验证器
 * @param value 值
 * @param validators 验证器数组
 */
export function validate(value: any, validators: Array<(v: any) => ValidationResult>): ValidationResult {
  for (const validator of validators) {
    const result = validator(value)
    if (!result.valid) {
      return result
    }
  }
  return { valid: true }
}

/**
 * 表单验证规则
 */

export const validateUsername = (rule: any, value: string, callback: any) => {
  const reg = /^[a-zA-Z0-9]{4,16}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('用户名必须是4-16位字母数字'))
  }
}

export const validatePassword = (rule: any, value: string, callback: any) => {
  if (value.length < 6) {
    callback(new Error('密码长度不能小于6位'))
  } else {
    callback()
  }
}

export const validatePhone = (rule: any, value: string, callback: any) => {
  const reg = /^1[3-9]\d{9}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}

export const validateEmail = (rule: any, value: string, callback: any) => {
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的邮箱地址'))
  }
}


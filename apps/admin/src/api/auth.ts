import http from './request'

export interface ILoginParams {
  username: string
  password: string
}

/** 登录响应 - 外层包装 */
export interface ILoginResult {
  data: {
    token: string
    username: string
    roles: string[]
    permissions: string[]
  }
}

/** 用户信息响应 */
export interface IUserInfoResult {
  data: {
    user: {
      userId: string
      username: string
      nickname: string
      avatar: string
      email: string
      phone: string
      deptId: string
      deptName: string
      roleId: number[]
    }
    roles: string[]
    permissions: string[]
  }
}

export const loginApi = (data: ILoginParams) => {
  return http.post<ILoginResult>('/auth/login', data)
}

export const logoutApi = () => {
  return http.post('/auth/logout')
}

export const getUserInfoApi = () => {
  return http.get<IUserInfoResult>('/auth/userinfo')
}

export const getCaptchaApi = () => {
  return http.get('/auth/captcha')
}

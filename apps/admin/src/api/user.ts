import http from './request'

export interface IUser {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  status: number
  roles: string[]
  createTime: string
}

export interface IUserListParams {
  page: number
  pageSize: number
  username?: string
  status?: number
}

export const getUserListApi = (params: IUserListParams) => {
  return http.get<{ list: IUser[]; total: number }>('/system/user/list', { params })
}

export const getUserDetailApi = (id: string) => {
  return http.get<IUser>(`/system/user/${id}`)
}

export const createUserApi = (data: Partial<IUser>) => {
  return http.post('/system/user', data)
}

export const updateUserApi = (id: string, data: Partial<IUser>) => {
  return http.put(`/system/user/${id}`, data)
}

export const deleteUserApi = (id: string) => {
  return http.delete(`/system/user/${id}`)
}

export const resetPasswordApi = (id: string) => {
  return http.post(`/system/user/${id}/reset-password`)
}

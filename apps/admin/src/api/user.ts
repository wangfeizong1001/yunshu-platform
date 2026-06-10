import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

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

export interface IUserListParams extends Record<string, unknown> {
  page: number
  pageSize: number
  username?: string
  status?: number
}

export const getUserListApi = (params: IUserListParams) => {
  return httpGet<{ list: IUser[]; total: number }>('/system/user/list', params)
}

export const getUserDetailApi = (id: string) => {
  return httpGet<IUser>(`/system/user/${id}`)
}

export const createUserApi = (data: Partial<IUser>) => {
  return httpPost('/system/user', data)
}

export const updateUserApi = (id: string, data: Partial<IUser>) => {
  return httpPut(`/system/user/${id}`, data)
}

export const deleteUserApi = (id: string) => {
  return httpDelete(`/system/user/${id}`)
}

export const resetPasswordApi = (id: string) => {
  return httpPost(`/system/user/${id}/reset-password`)
}

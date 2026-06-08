/**
 * HTTP 请求工具
 *
 * 基于 axios 的请求封装
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

/** 请求配置扩展 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否忽略错误提示 */
  ignoreError?: boolean
  /** 是否忽略登录验证 */
  ignoreAuth?: boolean
}

/** 响应数据结构 */
export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

/** 扩展的 AxiosResponse */
export interface HttpResponse<T = unknown> extends AxiosResponse {
  data: ApiResponse<T>
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/** 创建 axios 实例 */
const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** 请求拦截器 */
instance.interceptors.request.use(
  config => {
    // 添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加租户ID
    const tenantId = localStorage.getItem('Tenant-Id')
    if (tenantId && tenantId !== '0') {
      config.headers['tenant-id'] = tenantId
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/** 响应拦截器 */
instance.interceptors.response.use(
  (response: HttpResponse) => {
    const { code, msg, data } = response.data

    // 成功响应
    if (code === 200 || code === 0) {
      return response
    }

    // 错误提示
    ElMessage.error(msg || '请求失败')
    return Promise.reject(new Error(msg || '请求失败'))
  },
  error => {
    const { response } = error

    if (response) {
      const { status, data } = response

      switch (status) {
        case 401:
          // 未授权，跳转登录
          ElMessage.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(data?.msg || '请求失败')
      }
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }

    return Promise.reject(error)
  }
)

/**
 * 发送请求
 * @param config 请求配置
 */
export function request<T = unknown>(config: RequestConfig): Promise<T> {
  return instance.request<ApiResponse<T>>(config).then(res => res.data.data)
}

/**
 * GET 请求
 * @param url 请求地址
 * @param params 请求参数
 */
export function get<T = unknown>(url: string, params?: Record<string, unknown>) {
  return request<T>({ url, method: 'get', params })
}

/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求数据
 */
export function post<T = unknown>(url: string, data?: unknown) {
  return request<T>({ url, method: 'post', data })
}

/**
 * PUT 请求
 * @param url 请求地址
 * @param data 请求数据
 */
export function put<T = unknown>(url: string, data?: unknown) {
  return request<T>({ url, method: 'put', data })
}

/**
 * DELETE 请求
 * @param url 请求地址
 * @param data 请求数据
 */
export function del<T = unknown>(url: string, data?: unknown) {
  return request<T>({ url, method: 'delete', data })
}

/** 下载文件方法扩展 */
request.download = function (url: string, params?: Record<string, unknown>, filename?: string) {
  return instance
    .get(url, {
      params,
      responseType: 'blob',
    })
    .then((response: AxiosResponse) => {
      const blob = new Blob([response.data])
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = filename || '下载文件.xlsx'
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
      window.URL.revokeObjectURL(href)
    })
}

export { instance as axiosInstance }

/**
 * 第三方登录 API
 */

import { request } from '@/utils/request'
import type {
  ThirdLoginConfig,
  ThirdLoginLog,
  ThirdConfigQuery,
  ThirdLoginLogQuery,
  ThirdLoginLogPageResp,
  ThirdAuthorizeResp,
  ThirdBindReq,
} from '@yunshu/shared/types/third'

/**
 * 获取第三方登录配置列表
 * @param params 查询参数
 */
export function getThirdConfigList(params: ThirdConfigQuery) {
  return request<ThirdLoginConfig[]>({
    url: '/system/third/config/list',
    method: 'get',
    params,
  })
}

/**
 * 获取第三方登录配置
 * @param platform 平台
 */
export function getThirdConfig(platform: string) {
  return request<ThirdLoginConfig>({
    url: `/system/third/config/${platform}`,
    method: 'get',
  })
}

/**
 * 修改第三方登录配置
 * @param data 配置数据
 */
export function updateThirdConfig(data: Partial<ThirdLoginConfig>) {
  return request<void>({
    url: '/system/third/config',
    method: 'put',
    data,
  })
}

/**
 * 获取第三方登录日志列表
 * @param params 查询参数
 */
export function getThirdLoginLogList(params: ThirdLoginLogQuery) {
  return request<ThirdLoginLogPageResp>({
    url: '/system/third/log/list',
    method: 'get',
    params,
  })
}

/**
 * 获取第三方登录日志详情
 * @param id 日志ID
 */
export function getThirdLoginLogDetail(id: number) {
  return request<ThirdLoginLog>({
    url: `/system/third/log/${id}`,
    method: 'get',
  })
}

/**
 * 获取授权链接
 * @param platform 平台
 */
export function getThirdAuthorizeUrl(platform: string) {
  return request<ThirdAuthorizeResp>({
    url: `/system/third/authorize/${platform}`,
    method: 'get',
  })
}

/**
 * 处理第三方登录回调
 * @param platform 平台
 * @param code 授权码
 * @param state 状态参数
 */
export function handleThirdCallback(platform: string, code: string, state?: string) {
  return request<{ token: string; isBind: boolean }>({
    url: `/system/third/callback/${platform}`,
    method: 'post',
    data: { code, state },
  })
}

/**
 * 绑定第三方账号
 * @param data 绑定参数
 */
export function bindThirdAccount(data: ThirdBindReq) {
  return request<{ token: string }>({
    url: '/system/third/bind',
    method: 'post',
    data,
  })
}

/**
 * 解绑第三方账号
 * @param platform 平台
 */
export function unbindThirdAccount(platform: string) {
  return request<void>({
    url: `/system/third/unbind/${platform}`,
    method: 'delete',
  })
}

/**
 * 获取已绑定的第三方账号列表
 */
export function getThirdBindList() {
  return request<ThirdLoginConfig[]>({
    url: '/system/third/bind/list',
    method: 'get',
  })
}

/**
 * 测试第三方登录连接
 * @param data 配置数据
 */
export function testThirdConnection(data: Partial<ThirdLoginConfig>) {
  return request<boolean>({
    url: '/system/third/test',
    method: 'post',
    data,
  })
}

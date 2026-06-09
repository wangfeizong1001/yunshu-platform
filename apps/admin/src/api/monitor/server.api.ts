/**
 * 服务器监控 API
 */

import request from '@/utils/request'

export interface ServerInfo {
  cpu: {
    cpuNum: number
    used: number
    free: number
    total: number
    sys: number
    user: number
    wait: number
  }
  mem: {
    total: number
    used: number
    free: number
    usage: number
  }
  jvm: {
    total: number
    max: number
    free: number
    used: number
    usage: number
    version: string
    home: string
  }
  sys: {
    computerName: string
    computerIp: string
    osName: string
    osArch: string
    userDir: string
  }
  sysFiles: Array<{
    dirName: string
    sysTypeName: string
    typeName: string
    total: string
    free: string
    used: string
    usage: number
  }>
}

export const getServerInfo = () => {
  return request({
    url: '/monitor/server',
    method: 'get'
  })
}


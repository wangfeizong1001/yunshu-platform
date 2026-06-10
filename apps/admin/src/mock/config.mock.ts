/**
 * 参数配置 Mock 数据
 */


// 参数配置 Mock 数据
export const mockConfigList: any[] = [
  {
    configId: 1,
    configName: '用户管理-初始密码',
    configKey: 'sys.user.initPassword',
    configValue: '123456',
    configType: 'Y',
    remark: '用户初始化密码',
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00',
    createBy: 'admin',
  },
  {
    configId: 2,
    configName: '登录验证码开关',
    configKey: 'sys.login.captchaEnabled',
    configValue: 'true',
    configType: 'Y',
    remark: '是否开启登录验证码',
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00',
    createBy: 'admin',
  },
  {
    configId: 3,
    configName: '登录失败锁定次数',
    configKey: 'sys.login.maxRetryCount',
    configValue: '5',
    configType: 'Y',
    remark: '密码错误锁定次数',
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00',
    createBy: 'admin',
  },
  {
    configId: 4,
    configName: '文件上传大小限制',
    configKey: 'sys.file.maxSize',
    configValue: '10485760',
    configType: 'Y',
    remark: '文件上传大小限制(字节)',
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00',
    createBy: 'admin',
  },
  {
    configId: 5,
    configName: '文件上传类型限制',
    configKey: 'sys.file.allowedTypes',
    configValue: 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx',
    configType: 'Y',
    remark: '允许上传的文件类型',
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00',
    createBy: 'admin',
  },
  {
    configId: 6,
    configName: '数据备份开关',
    configKey: 'sys.backup.enabled',
    configValue: 'false',
    configType: 'N',
    remark: '是否开启自动数据备份',
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00',
    createBy: 'admin',
  },
  {
    configId: 7,
    configName: '缓存开关',
    configKey: 'sys.cache.enabled',
    configValue: 'true',
    configType: 'N',
    remark: '是否开启缓存',
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00',
    createBy: 'admin',
  },
  {
    configId: 8,
    configName: '系统名称',
    configKey: 'sys.system.name',
    configValue: '云枢中台系统',
    configType: 'Y',
    remark: '系统名称',
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00',
    createBy: 'admin',
  },
]

// 获取参数配置分页列表 Mock
export function getMockConfigPage(params: any): any {
  const { pageNum = 1, pageSize = 10, keyword = '', configType = '' } = params

  let filteredList = mockConfigList

  if (keyword) {
    filteredList = filteredList.filter(
      (item) =>
        item.configName.includes(keyword) ||
        item.configKey.includes(keyword) ||
        item.configValue.includes(keyword)
    )
  }

  if (configType) {
    filteredList = filteredList.filter((item) => item.configType === configType)
  }

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 获取参数配置详情 Mock
export function getMockConfigDetail(configId: number): any | undefined {
  return mockConfigList.find((item) => item.configId === configId)
}

// 根据键名获取参数 Mock
export function getMockConfigByKey(configKey: string): any | undefined {
  return mockConfigList.find((item) => item.configKey === configKey)
}

// 新增参数配置 Mock
export function addMockConfig(data: Partial<any>): any {
  const newItem: any = {
    configId: Math.max(...mockConfigList.map((u) => u.configId)) + 1,
    configName: data.configName || '',
    configKey: data.configKey || '',
    configValue: data.configValue || '',
    configType: data.configType || 'N',
    remark: data.remark || '',
    createTime: new Date().toLocaleString(),
    updateTime: new Date().toLocaleString(),
    createBy: 'admin',
  }
  mockConfigList.push(newItem)
  return newItem
}

// 更新参数配置 Mock
export function updateMockConfig(configId: number, data: Partial<any>): any | undefined {
  const index = mockConfigList.findIndex((u) => u.configId === configId)
  if (index !== -1) {
    mockConfigList[index] = { ...mockConfigList[index], ...data, updateTime: new Date().toLocaleString() }
    return mockConfigList[index]
  }
  return undefined
}

// 删除参数配置 Mock
export function deleteMockConfig(configId: number): boolean {
  const index = mockConfigList.findIndex((u) => u.configId === configId)
  if (index !== -1) {
    mockConfigList.splice(index, 1)
    return true
  }
  return false
}

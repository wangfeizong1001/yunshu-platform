/**
 * 租户管理 Mock 数据
 */


/** 模拟租户数据 */
const mockTenants: any[] = [
  {
    tenantId: 1,
    tenantName: '云枢科技',
    tenantCode: 'yunshu',
    contact: '张三',
    contactPhone: '13800138000',
    email: 'contact@yunshu.com',
    domain: 'yunshu.com',
    packageId: 1,
    packageName: '高级版',
    expireTime: '2027-12-31 23:59:59',
    userCount: 50,
    userLimit: 100,
    status: '0',
    remark: '云枢中台旗舰客户',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    tenantId: 2,
    tenantName: '星辰企业',
    tenantCode: 'xingchen',
    contact: '李四',
    contactPhone: '13900139000',
    email: 'admin@xingchen.com',
    domain: 'xingchen.com',
    packageId: 2,
    packageName: '基础版',
    expireTime: '2025-06-30 23:59:59',
    userCount: 25,
    userLimit: 50,
    status: '0',
    remark: '星辰企业解决方案提供商',
    createTime: '2024-03-20 14:20:00',
    updateTime: '2024-05-15 16:45:00',
  },
  {
    tenantId: 3,
    tenantName: '蓝海集团',
    tenantCode: 'lanhai',
    contact: '王五',
    contactPhone: '13700137000',
    email: 'wangwu@lanhai.com',
    domain: 'lanhai.cn',
    packageId: 1,
    packageName: '高级版',
    expireTime: '2024-12-31 23:59:59',
    userCount: 80,
    userLimit: 100,
    status: '2',
    remark: '蓝海集团，多子公司运营',
    createTime: '2023-06-10 09:15:00',
    updateTime: '2024-11-20 11:00:00',
  },
  {
    tenantId: 4,
    tenantName: '明日科技',
    tenantCode: 'mingri',
    contact: '赵六',
    contactPhone: '13600136000',
    email: 'tech@mingri.com',
    domain: 'mingri-tech.com',
    packageId: 3,
    packageName: '免费版',
    expireTime: '2025-01-01 00:00:00',
    userCount: 10,
    userLimit: 20,
    status: '1',
    remark: '初创企业客户',
    createTime: '2024-05-01 10:00:00',
    updateTime: '2024-05-01 10:00:00',
  },
  {
    tenantId: 5,
    tenantName: '智联云服',
    tenantCode: 'zhilian',
    contact: '孙七',
    contactPhone: '13500135000',
    email: 'service@zhilian.com',
    domain: 'zhilianyun.com',
    packageId: 2,
    packageName: '基础版',
    expireTime: '2026-03-15 23:59:59',
    userCount: 35,
    userLimit: 50,
    status: '0',
    remark: '智联云服 SaaS 服务商',
    createTime: '2024-02-28 13:30:00',
    updateTime: '2024-06-05 09:20:00',
  },
]

/** 分页查询租户 */
export function getTenantPage(params: any): any {
  const { keyword, status, pageNum = 1, pageSize = 10 } = params || {}

  let filtered = [...mockTenants]

  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(
      t =>
        t.tenantName.toLowerCase().includes(kw) ||
        t.tenantCode.toLowerCase().includes(kw) ||
        t.contact.includes(kw) ||
        t.contactPhone.includes(kw)
    )
  }

  if (status) {
    filtered = filtered.filter(t => t.status === status)
  }

  const total = filtered.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filtered.slice(start, end)

  return { total, rows }
}

/** 获取租户列表 */
export function getTenantList(params?: any): any[] {
  const { keyword, status } = params || {}

  let filtered = [...mockTenants]

  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(
      t =>
        t.tenantName.toLowerCase().includes(kw) ||
        t.tenantCode.toLowerCase().includes(kw)
    )
  }

  if (status) {
    filtered = filtered.filter(t => t.status === status)
  }

  return filtered
}

/** 获取租户详情 */
export function getTenantById(tenantId: number): any | undefined {
  return mockTenants.find(t => t.tenantId === tenantId)
}

/** 新增租户 */
export function createTenant(data: Omit<Tenant, 'tenantId' | 'createTime' | 'updateTime'>): any {
  const newTenant: any = {
    ...data,
    tenantId: Math.max(...mockTenants.map(t => t.tenantId)) + 1,
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN'),
  }
  mockTenants.push(newTenant)
  return newTenant
}

/** 更新租户 */
export function updateTenantById(
  tenantId: number,
  data: Partial<Omit<Tenant, 'tenantId' | 'createTime'>>
): any | undefined {
  const index = mockTenants.findIndex(t => t.tenantId === tenantId)
  if (index === -1) return undefined

  mockTenants[index] = {
    ...mockTenants[index],
    ...data,
    updateTime: new Date().toLocaleString('zh-CN'),
  }
  return mockTenants[index]
}

/** 删除租户 */
export function deleteTenantById(tenantId: number): boolean {
  const index = mockTenants.findIndex(t => t.tenantId === tenantId)
  if (index === -1) return false

  mockTenants.splice(index, 1)
  return true
}

/** 修改租户状态 */
export function changeTenantStatusById(
  tenantId: number,
  status: '0' | '1' | '2'
): any | undefined {
  const tenant = mockTenants.find(t => t.tenantId === tenantId)
  if (!tenant) return undefined

  tenant.status = status
  tenant.updateTime = new Date().toLocaleString('zh-CN')
  return tenant
}

/**
 * 租户管理控制器
 */

import { BaseController } from '../controller/BaseController'
import { tenantContext, getCurrentTenantId } from '../middlewares/tenant'

/** 租户数据 */
interface Tenant {
  tenantId: number
  tenantName: string
  tenantCode: string
  contact: string
  contactPhone: string
  email: string
  domain: string
  packageId: number
  packageName: string
  expireTime: string
  userCount: number
  userLimit: number
  status: '0' | '1' | '2'
  remark: string
  createTime: string
  updateTime: string
}

/** 模拟租户数据 */
const mockTenants: Tenant[] = [
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
]

export class TenantController extends BaseController {
  /**
   * 获取租户分页列表
   */
  async getTenantPage() {
    const { keyword, status, pageNum = 1, pageSize = 10 } = this.query

    let filtered = [...mockTenants]

    if (keyword) {
      const kw = (keyword as string).toLowerCase()
      filtered = filtered.filter(
        t =>
          t.tenantName.toLowerCase().includes(kw) ||
          t.tenantCode.toLowerCase().includes(kw)
      )
    }

    if (status) {
      filtered = filtered.filter(t => t.status === status)
    }

    const total = filtered.length
    const start = ((pageNum as number) - 1) * (pageSize as number)
    const end = start + (pageSize as number)
    const rows = filtered.slice(start, end)

    this.success({ total, rows })
  }

  /**
   * 获取租户列表
   */
  async getTenantList() {
    const tenantId = getCurrentTenantId()

    // 如果有租户上下文，只返回当前租户的数据
    if (tenantId) {
      const tenant = mockTenants.find(t => t.tenantId === Number(tenantId))
      this.success(tenant ? [tenant] : [])
      return
    }

    this.success(mockTenants)
  }

  /**
   * 获取租户详情
   */
  async getTenantById() {
    const { tenantId } = this.params
    const tenant = mockTenants.find(t => t.tenantId === Number(tenantId))

    if (!tenant) {
      this.fail('租户不存在', 404)
      return
    }

    this.success(tenant)
  }

  /**
   * 新增租户
   */
  async createTenant() {
    const data = this.body

    const newTenant: Tenant = {
      ...data,
      tenantId: Math.max(...mockTenants.map(t => t.tenantId)) + 1,
      userCount: 0,
      status: '0',
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN'),
    }

    mockTenants.push(newTenant)
    this.success(newTenant)
  }

  /**
   * 更新租户
   */
  async updateTenant() {
    const { tenantId } = this.params
    const data = this.body
    const index = mockTenants.findIndex(t => t.tenantId === Number(tenantId))

    if (index === -1) {
      this.fail('租户不存在', 404)
      return
    }

    mockTenants[index] = {
      ...mockTenants[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN'),
    }

    this.success(mockTenants[index])
  }

  /**
   * 删除租户
   */
  async deleteTenant() {
    const { tenantId } = this.params
    const index = mockTenants.findIndex(t => t.tenantId === Number(tenantId))

    if (index === -1) {
      this.fail('租户不存在', 404)
      return
    }

    mockTenants.splice(index, 1)
    this.success(null)
  }

  /**
   * 修改租户状态
   */
  async changeTenantStatus() {
    const { tenantId, status } = this.body
    const tenant = mockTenants.find(t => t.tenantId === Number(tenantId))

    if (!tenant) {
      this.fail('租户不存在', 404)
      return
    }

    tenant.status = status
    tenant.updateTime = new Date().toLocaleString('zh-CN')
    this.success(null)
  }
}

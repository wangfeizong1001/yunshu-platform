/**
 * 租户管理 Mock API
 * @module mock/routes/tenant/tenant
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'

// ========== 租户套餐数据 ==========
interface TenantPackage {
  packageId: number
  packageName: string
  packageType: string
  expireType: string
  expireTime: string
  userCount: number
  storage: number
  menuIds: number[]
  remark: string
  status: string
  createTime: string
  updateTime: string
}

let tenantPackages: TenantPackage[] = [
  {
    packageId: 1,
    packageName: '基础版',
    packageType: 'base',
    expireType: '0',
    expireTime: '',
    userCount: 10,
    storage: 10,
    menuIds: [1, 2, 3, 100, 101],
    remark: '基础功能，限制10用户',
    status: '0',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-10 14:00:00'
  },
  {
    packageId: 2,
    packageName: '标准版',
    packageType: 'normal',
    expireType: '0',
    expireTime: '',
    userCount: 50,
    storage: 100,
    menuIds: [1, 2, 3, 4, 5, 100, 101, 102, 103],
    remark: '标准功能，限制50用户',
    status: '0',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-12 09:00:00'
  },
  {
    packageId: 3,
    packageName: '高级版',
    packageType: 'vip',
    expireType: '0',
    expireTime: '',
    userCount: 200,
    storage: 500,
    menuIds: [1, 2, 3, 4, 5, 6, 7, 100, 101, 102, 103, 104, 105],
    remark: '高级功能，限制200用户',
    status: '0',
    createTime: '2024-01-02 11:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    packageId: 4,
    packageName: '企业版',
    packageType: 'enterprise',
    expireType: '1',
    expireTime: '2025-12-31 23:59:59',
    userCount: -1,
    storage: -1,
    menuIds: [],
    remark: '不限用户数，不限存储空间',
    status: '0',
    createTime: '2024-01-03 14:00:00',
    updateTime: '2024-01-10 16:00:00'
  }
]

// ========== 租户数据 ==========
interface Tenant {
  tenantId: number
  tenantName: string
  tenantCode: string
  packageId: number
  packageName: string
  contactName: string
  contactPhone: string
  contactEmail: string
  companyName: string
  companyAddress: string
  licenseNumber: string
  domain: string
  status: string
  expireTime: string
  userCount: number
  usedCount: number
  remark: string
  createTime: string
  updateTime: string
}

let tenants: Tenant[] = [
  {
    tenantId: 1,
    tenantName: '演示租户',
    tenantCode: 'demo',
    packageId: 1,
    packageName: '基础版',
    contactName: '张三',
    contactPhone: '13800138000',
    contactEmail: 'zhangsan@example.com',
    companyName: '演示科技有限公司',
    companyAddress: '北京市朝阳区演示大厦A座1001',
    licenseNumber: '91110000123456789A',
    domain: 'demo.yunshu.com',
    status: '0',
    expireTime: '2025-12-31 23:59:59',
    userCount: 10,
    usedCount: 5,
    remark: '演示租户',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-15 14:30:00'
  },
  {
    tenantId: 2,
    tenantName: '测试租户',
    tenantCode: 'test',
    packageId: 2,
    packageName: '标准版',
    contactName: '李四',
    contactPhone: '13900139000',
    contactEmail: 'lisi@example.com',
    companyName: '测试科技有限公司',
    companyAddress: '上海市浦东新区测试路100号',
    licenseNumber: '91310000987654321B',
    domain: 'test.yunshu.com',
    status: '0',
    expireTime: '2025-06-30 23:59:59',
    userCount: 50,
    usedCount: 23,
    remark: '测试租户',
    createTime: '2024-01-05 09:00:00',
    updateTime: '2024-01-20 11:00:00'
  },
  {
    tenantId: 3,
    tenantName: '正式租户A',
    tenantCode: 'company_a',
    packageId: 3,
    packageName: '高级版',
    contactName: '王五',
    contactPhone: '13700137000',
    contactEmail: 'wangwu@example.com',
    companyName: '甲科技有限公司',
    companyAddress: '广州市天河区科技路200号',
    licenseNumber: '91440101ABCDEF123',
    domain: 'companya.yunshu.com',
    status: '0',
    expireTime: '2025-12-31 23:59:59',
    userCount: 200,
    usedCount: 156,
    remark: '正式客户',
    createTime: '2024-01-10 10:00:00',
    updateTime: '2024-01-25 15:00:00'
  },
  {
    tenantId: 4,
    tenantName: '企业租户B',
    tenantCode: 'company_b',
    packageId: 4,
    packageName: '企业版',
    contactName: '赵六',
    contactPhone: '13600136000',
    contactEmail: 'zhaoliu@example.com',
    companyName: '乙企业集团有限公司',
    companyAddress: '深圳市南山区高新科技园',
    licenseNumber: '91440300K12345678C',
    domain: 'companyb.yunshu.com',
    status: '1',
    expireTime: '2025-12-31 23:59:59',
    userCount: -1,
    usedCount: 423,
    remark: '企业客户',
    createTime: '2024-01-15 11:00:00',
    updateTime: '2024-01-30 09:00:00'
  },
  {
    tenantId: 5,
    tenantName: '试用租户',
    tenantCode: 'trial',
    packageId: 1,
    packageName: '基础版',
    contactName: '孙七',
    contactPhone: '13500135000',
    contactEmail: 'sunqi@example.com',
    companyName: '试用科技有限公司',
    companyAddress: '成都市高新区试用路50号',
    licenseNumber: '91510107TRI_AL123',
    domain: 'trial.yunshu.com',
    status: '2',
    expireTime: '2024-03-01 23:59:59',
    userCount: 10,
    usedCount: 3,
    remark: '试用租户，15天试用期',
    createTime: '2024-02-15 10:00:00',
    updateTime: '2024-02-15 10:00:00'
  }
]

export default [
  // ========== 租户套餐 ==========
  /**
   * 获取租户套餐分页列表
   */
  {
    url: '/api/tenant/package/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; packageName?: string; status?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { packageName, status } = query

      let list = [...tenantPackages]

      if (packageName) {
        list = list.filter(p => p.packageName.includes(packageName))
      }
      if (status) {
        list = list.filter(p => p.status === status)
      }

      list.sort((a, b) => b.packageId - a.packageId)

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize

      return pageResult(list.slice(start, end), list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取租户套餐列表
   */
  {
    url: '/api/tenant/package/list',
    method: 'get',
    response: async () => {
      await delay()
      return success(tenantPackages.filter(p => p.status === '0'))
    }
  },

  /**
   * 获取租户套餐详情
   */
  {
    url: '/api/tenant/package/:packageId',
    method: 'get',
    response: async ({ params }: { params: { packageId: string } }) => {
      await delay()

      const pkg = tenantPackages.find(p => p.packageId === parseInt(params.packageId))
      if (!pkg) {
        return fail('套餐不存在', 404)
      }

      return success(pkg)
    }
  },

  /**
   * 新增租户套餐
   */
  {
    url: '/api/tenant/package',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      if (tenantPackages.some(p => p.packageName === body.packageName)) {
        return fail('套餐名称已存在')
      }

      const maxId = Math.max(...tenantPackages.map(p => p.packageId), 0)
      const newPkg: TenantPackage = {
        packageId: maxId + 1,
        packageName: body.packageName,
        packageType: body.packageType || 'base',
        expireType: body.expireType || '0',
        expireTime: body.expireTime || '',
        userCount: body.userCount || 0,
        storage: body.storage || 0,
        menuIds: body.menuIds || [],
        remark: body.remark || '',
        status: body.status || '0',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      tenantPackages.push(newPkg)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改租户套餐
   */
  {
    url: '/api/tenant/package',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const index = tenantPackages.findIndex(p => p.packageId === body.packageId)
      if (index === -1) {
        return fail('套餐不存在', 404)
      }

      tenantPackages[index] = {
        ...tenantPackages[index],
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除租户套餐
   */
  {
    url: '/api/tenant/package/:packageId',
    method: 'delete',
    response: async ({ params }: { params: { packageId: string } }) => {
      await delay()

      const index = tenantPackages.findIndex(p => p.packageId === parseInt(params.packageId))
      if (index === -1) {
        return fail('套餐不存在', 404)
      }

      // 检查是否有租户正在使用
      const usedCount = tenants.filter(t => t.packageId === parseInt(params.packageId)).length
      if (usedCount > 0) {
        return fail(`已有 ${usedCount} 个租户使用此套餐，无法删除`)
      }

      tenantPackages.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  // ========== 租户管理 ==========
  /**
   * 获取租户分页列表
   */
  {
    url: '/api/tenant/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; tenantName?: string; status?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { tenantName, status } = query

      let list = [...tenants]

      if (tenantName) {
        list = list.filter(t => t.tenantName.includes(tenantName) || t.tenantCode.includes(tenantName))
      }
      if (status) {
        list = list.filter(t => t.status === status)
      }

      list.sort((a, b) => b.tenantId - a.tenantId)

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize

      return pageResult(list.slice(start, end), list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取租户列表
   */
  {
    url: '/api/tenant/list',
    method: 'get',
    response: async () => {
      await delay()
      return success(tenants.filter(t => t.status === '0'))
    }
  },

  /**
   * 获取租户详情
   */
  {
    url: '/api/tenant/:tenantId',
    method: 'get',
    response: async ({ params }: { params: { tenantId: string } }) => {
      await delay()

      const tenant = tenants.find(t => t.tenantId === parseInt(params.tenantId))
      if (!tenant) {
        return fail('租户不存在', 404)
      }

      return success(tenant)
    }
  },

  /**
   * 新增租户
   */
  {
    url: '/api/tenant',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      if (tenants.some(t => t.tenantCode === body.tenantCode)) {
        return fail('租户编码已存在')
      }

      const maxId = Math.max(...tenants.map(t => t.tenantId), 0)
      const pkg = tenantPackages.find(p => p.packageId === body.packageId)

      const newTenant: Tenant = {
        tenantId: maxId + 1,
        tenantName: body.tenantName,
        tenantCode: body.tenantCode,
        packageId: body.packageId,
        packageName: pkg?.packageName || '',
        contactName: body.contactName,
        contactPhone: body.contactPhone,
        contactEmail: body.contactEmail || '',
        companyName: body.companyName || '',
        companyAddress: body.companyAddress || '',
        licenseNumber: body.licenseNumber || '',
        domain: body.domain || '',
        status: body.status || '0',
        expireTime: body.expireTime || '',
        userCount: pkg?.userCount || 0,
        usedCount: 0,
        remark: body.remark || '',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      tenants.push(newTenant)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改租户
   */
  {
    url: '/api/tenant',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const index = tenants.findIndex(t => t.tenantId === body.tenantId)
      if (index === -1) {
        return fail('租户不存在', 404)
      }

      const pkg = body.packageId ? tenantPackages.find(p => p.packageId === body.packageId) : null

      tenants[index] = {
        ...tenants[index],
        ...body,
        packageName: pkg?.packageName || tenants[index].packageName,
        userCount: pkg?.userCount || tenants[index].userCount,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除租户
   */
  {
    url: '/api/tenant/:tenantId',
    method: 'delete',
    response: async ({ params }: { params: { tenantId: string } }) => {
      await delay()

      const index = tenants.findIndex(t => t.tenantId === parseInt(params.tenantId))
      if (index === -1) {
        return fail('租户不存在', 404)
      }

      tenants.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 修改租户状态
   */
  {
    url: '/api/tenant/:tenantId/status',
    method: 'put',
    response: async ({ params, body }: { params: { tenantId: string }; body: { status: string } }) => {
      await delay()

      const tenant = tenants.find(t => t.tenantId === parseInt(params.tenantId))
      if (!tenant) {
        return fail('租户不存在', 404)
      }

      tenant.status = body.status
      tenant.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

      return success(null, '状态修改成功')
    }
  },

  /**
   * 导出租户
   */
  {
    url: '/api/tenant/export',
    method: 'get',
    response: async () => {
      await delay()
      return success({ downloadUrl: '/downloads/tenant_export.xlsx' })
    }
  }
] as MockMethod[]

/**
 * 租户管理控制器
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import { getCurrentTenantId } from '../../middlewares/tenant';

/** 租户数据 */
interface Tenant {
  tenantId: number;
  tenantName: string;
  tenantCode: string;
  contact: string;
  contactPhone: string;
  email: string;
  domain: string;
  packageId: number;
  packageName: string;
  expireTime: string;
  userCount: number;
  userLimit: number;
  status: '0' | '1' | '2';
  remark: string;
  createTime: string;
  updateTime: string;
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
];

export class TenantController extends BaseController {
  /**
   * 获取租户分页列表
   */
  async getTenantPage(req: Request, res: Response): Promise<Response> {
    const keyword = req.query.keyword as string;
    const status = req.query.status as string;
    const pageNum = Number(req.query.pageNum) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    let filtered = [...mockTenants];

    if (keyword) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter(
        (t) => t.tenantName.toLowerCase().includes(kw) || t.tenantCode.toLowerCase().includes(kw),
      );
    }

    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }

    const total = filtered.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取租户列表
   */
  async getTenantList(_req: Request, res: Response): Promise<Response> {
    const tenantId = getCurrentTenantId();

    // 如果有租户上下文，只返回当前租户的数据
    if (tenantId) {
      const tenant = mockTenants.find((t) => t.tenantId === Number(tenantId));
      return this.success(res, tenant ? [tenant] : []);
    }

    return this.success(res, mockTenants);
  }

  /**
   * 获取租户详情
   */
  async getTenantById(req: Request, res: Response): Promise<Response> {
    const { tenantId } = req.params;
    const tenant = mockTenants.find((t) => t.tenantId === Number(tenantId));

    if (!tenant) {
      return this.notFound(res, '租户不存在');
    }

    return this.success(res, tenant);
  }

  /**
   * 新增租户
   */
  async createTenant(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    const newTenant: Tenant = {
      ...data,
      tenantId: Math.max(...mockTenants.map((t) => t.tenantId)) + 1,
      userCount: 0,
      status: '0',
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockTenants.push(newTenant);
    return this.created(res, newTenant);
  }

  /**
   * 更新租户
   */
  async updateTenant(req: Request, res: Response): Promise<Response> {
    const { tenantId } = req.params;
    const data = req.body;
    const index = mockTenants.findIndex((t) => t.tenantId === Number(tenantId));

    if (index === -1) {
      return this.notFound(res, '租户不存在');
    }

    mockTenants[index] = {
      ...mockTenants[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    return this.success(res, mockTenants[index]);
  }

  /**
   * 删除租户
   */
  async deleteTenant(req: Request, res: Response): Promise<Response> {
    const { tenantId } = req.params;
    const index = mockTenants.findIndex((t) => t.tenantId === Number(tenantId));

    if (index === -1) {
      return this.notFound(res, '租户不存在');
    }

    mockTenants.splice(index, 1);
    return this.success(res, null);
  }

  /**
   * 修改租户状态
   */
  async changeTenantStatus(req: Request, res: Response): Promise<Response> {
    const { tenantId, status } = req.body;
    const tenant = mockTenants.find((t) => t.tenantId === Number(tenantId));

    if (!tenant) {
      return this.notFound(res, '租户不存在');
    }

    tenant.status = status;
    tenant.updateTime = new Date().toLocaleString('zh-CN');
    return this.success(res, null);
  }
}

export const tenantController = new TenantController();

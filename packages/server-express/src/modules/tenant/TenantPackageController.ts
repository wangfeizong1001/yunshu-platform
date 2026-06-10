/**
 * 租户套餐控制器
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';

/** 套餐数据 */
interface TenantPackage {
  packageId: number;
  packageName: string;
  packageType: '0' | '1' | '2';
  menuIds: number[];
  expireType: '0' | '1' | '2';
  expireTime: string;
  userLimit: number;
  storageLimit: number;
  flowLimit: number;
  price: number;
  status: '0' | '1';
  remark: string;
  createTime: string;
  updateTime: string;
}

/** 模拟套餐数据 */
const mockPackages: TenantPackage[] = [
  {
    packageId: 1,
    packageName: '免费版',
    packageType: '0',
    menuIds: [1, 2, 3],
    expireType: '0',
    expireTime: '',
    userLimit: 20,
    storageLimit: 1024,
    flowLimit: 10,
    price: 0,
    status: '0',
    remark: '适合个人或小团队使用',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00',
  },
  {
    packageId: 2,
    packageName: '基础版',
    packageType: '1',
    menuIds: [1, 2, 3, 4, 5],
    expireType: '1',
    expireTime: '',
    userLimit: 50,
    storageLimit: 5120,
    flowLimit: 100,
    price: 2999,
    status: '0',
    remark: '适合中小企业使用',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00',
  },
  {
    packageId: 3,
    packageName: '高级版',
    packageType: '2',
    menuIds: [1, 2, 3, 4, 5, 6, 7, 8],
    expireType: '1',
    expireTime: '',
    userLimit: 200,
    storageLimit: 20480,
    flowLimit: 500,
    price: 9999,
    status: '0',
    remark: '适合大型企业使用',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00',
  },
  {
    packageId: 4,
    packageName: '旗舰版',
    packageType: '2',
    menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    expireType: '1',
    expireTime: '',
    userLimit: 500,
    storageLimit: 102400,
    flowLimit: 2000,
    price: 29999,
    status: '0',
    remark: '适合集团型企业，支持私有部署',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00',
  },
];

export class TenantPackageController extends BaseController {
  /**
   * 获取套餐分页列表
   */
  async getPackagePage(req: Request, res: Response): Promise<Response> {
    const keyword = req.query.keyword as string;
    const status = req.query.status as string;
    const packageType = req.query.packageType as string;
    const pageNum = Number(req.query.pageNum) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    let filtered = [...mockPackages];

    if (keyword) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter(
        (p) => p.packageName.toLowerCase().includes(kw) || p.remark.toLowerCase().includes(kw),
      );
    }

    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (packageType) {
      filtered = filtered.filter((p) => p.packageType === packageType);
    }

    const total = filtered.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取套餐列表
   */
  async getPackageList(req: Request, res: Response): Promise<Response> {
    const status = req.query.status as string;
    let filtered = [...mockPackages];

    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    } else {
      filtered = filtered.filter((p) => p.status === '0');
    }

    return this.success(res, filtered);
  }

  /**
   * 获取套餐详情
   */
  async getPackageById(req: Request, res: Response): Promise<Response> {
    const { packageId } = req.params;
    const pkg = mockPackages.find((p) => p.packageId === Number(packageId));

    if (!pkg) {
      return this.notFound(res, '套餐不存在');
    }

    return this.success(res, pkg);
  }

  /**
   * 新增套餐
   */
  async createPackage(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    const newPackage: TenantPackage = {
      ...data,
      packageId: Math.max(...mockPackages.map((p) => p.packageId)) + 1,
      status: '0',
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockPackages.push(newPackage);
    return this.created(res, newPackage);
  }

  /**
   * 更新套餐
   */
  async updatePackage(req: Request, res: Response): Promise<Response> {
    const { packageId } = req.params;
    const data = req.body;
    const index = mockPackages.findIndex((p) => p.packageId === Number(packageId));

    if (index === -1) {
      return this.notFound(res, '套餐不存在');
    }

    mockPackages[index] = {
      ...mockPackages[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    return this.success(res, mockPackages[index]);
  }

  /**
   * 删除套餐
   */
  async deletePackage(req: Request, res: Response): Promise<Response> {
    const { packageId } = req.params;
    const index = mockPackages.findIndex((p) => p.packageId === Number(packageId));

    if (index === -1) {
      return this.notFound(res, '套餐不存在');
    }

    mockPackages.splice(index, 1);
    return this.success(res, null);
  }
}

export const tenantPackageController = new TenantPackageController();

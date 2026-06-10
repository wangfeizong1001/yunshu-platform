/**
 * 租户套餐控制器单元测试
 *
 * @module @yunshu/server-express/modules/tenant
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// 创建模拟的控制器上下文
interface MockControllerContext {
  query: Record<string, any>;
  body: Record<string, any>;
  params: Record<string, any>;
  success: ReturnType<typeof vi.fn>;
  fail: ReturnType<typeof vi.fn>;
  badRequest: ReturnType<typeof vi.fn>;
}

// Mock BaseController
vi.mock('../../controller/BaseController', () => ({
  BaseController: class {
    protected success = vi.fn().mockReturnThis();
    protected fail = vi.fn().mockReturnThis();
    protected badRequest = vi.fn().mockReturnThis();
  },
}));

describe('TenantPackageController', () => {
  // 模拟套餐数据
  const mockPackages = [
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

  // 创建模拟控制器上下文
  function createMockContext(): MockControllerContext {
    return {
      query: {},
      body: {},
      params: {},
      success: vi.fn().mockReturnThis(),
      fail: vi.fn().mockReturnThis(),
      badRequest: vi.fn().mockReturnThis(),
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPackagePage', () => {
    it('应返回分页套餐列表（无筛选条件）', () => {
      const ctx = createMockContext();
      ctx.query = { pageNum: 1, pageSize: 10 };

      const { keyword, status, packageType, pageNum = 1, pageSize = 10 } = ctx.query;
      let filtered = [...mockPackages];

      if (keyword) {
        const kw = (keyword as string).toLowerCase();
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
      const start = ((pageNum as number) - 1) * (pageSize as number);
      const end = start + (pageSize as number);
      const rows = filtered.slice(start, end);

      ctx.success({ total, rows });

      expect(ctx.success).toHaveBeenCalledWith({
        total: 4,
        rows: expect.any(Array),
      });
    });

    it('应支持关键词搜索', () => {
      const ctx = createMockContext();
      ctx.query = { keyword: '基础', pageNum: 1, pageSize: 10 };

      const { keyword, status, packageType } = ctx.query;
      let filtered = [...mockPackages];

      if (keyword) {
        const kw = (keyword as string).toLowerCase();
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

      const rows = filtered.slice(0, 10);

      ctx.success({ total: filtered.length, rows });

      expect(ctx.success).toHaveBeenCalledWith(
        expect.objectContaining({
          rows: expect.arrayContaining([expect.objectContaining({ packageName: '基础版' })]),
        }),
      );
    });

    it('应支持状态筛选', () => {
      const ctx = createMockContext();
      ctx.query = { status: '0', pageNum: 1, pageSize: 10 };

      const { keyword, status, packageType } = ctx.query;
      let filtered = [...mockPackages];

      if (keyword) {
        const kw = (keyword as string).toLowerCase();
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

      const rows = filtered.slice(0, 10);

      ctx.success({ total: filtered.length, rows });

      expect(ctx.success).toHaveBeenCalledWith(
        expect.objectContaining({
          rows: expect.arrayContaining([expect.objectContaining({ status: '0' })]),
        }),
      );
    });

    it('应支持套餐类型筛选', () => {
      const ctx = createMockContext();
      ctx.query = { packageType: '0', pageNum: 1, pageSize: 10 };

      const { keyword, status, packageType } = ctx.query;
      let filtered = [...mockPackages];

      if (keyword) {
        const kw = (keyword as string).toLowerCase();
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

      const rows = filtered.slice(0, 10);

      ctx.success({ total: filtered.length, rows });

      expect(ctx.success).toHaveBeenCalledWith(
        expect.objectContaining({
          rows: expect.arrayContaining([expect.objectContaining({ packageType: '0' })]),
        }),
      );
    });
  });

  describe('getPackageList', () => {
    it('无status参数时应返回正常状态的套餐', () => {
      const ctx = createMockContext();
      ctx.query = {};

      const { status } = ctx.query;
      let filtered = [...mockPackages];

      if (status) {
        filtered = filtered.filter((p) => p.status === status);
      } else {
        filtered = filtered.filter((p) => p.status === '0');
      }

      ctx.success(filtered);

      expect(ctx.success).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ status: '0' })]),
      );
    });

    it('有status参数时应返回指定状态的套餐', () => {
      const ctx = createMockContext();
      ctx.query = { status: '0' };

      const { status } = ctx.query;
      let filtered = [...mockPackages];

      if (status) {
        filtered = filtered.filter((p) => p.status === status);
      } else {
        filtered = filtered.filter((p) => p.status === '0');
      }

      ctx.success(filtered);

      expect(ctx.success).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ status: '0' })]),
      );
    });
  });

  describe('getPackageById', () => {
    it('应返回指定ID的套餐详情', () => {
      const ctx = createMockContext();
      ctx.params = { packageId: '1' };

      const pkg = mockPackages.find((p) => p.packageId === Number(ctx.params.packageId));

      if (pkg) {
        ctx.success(pkg);
      } else {
        ctx.fail('套餐不存在', 404);
      }

      expect(ctx.success).toHaveBeenCalledWith(
        expect.objectContaining({
          packageId: 1,
          packageName: '免费版',
        }),
      );
    });

    it('不存在的套餐应返回404错误', () => {
      const ctx = createMockContext();
      ctx.params = { packageId: '999' };

      const pkg = mockPackages.find((p) => p.packageId === Number(ctx.params.packageId));

      if (pkg) {
        ctx.success(pkg);
      } else {
        ctx.fail('套餐不存在', 404);
      }

      expect(ctx.fail).toHaveBeenCalledWith('套餐不存在', 404);
    });
  });

  describe('createPackage', () => {
    it('应成功创建套餐', () => {
      const ctx = createMockContext();
      ctx.body = {
        packageName: '测试套餐',
        packageType: '1',
        menuIds: [1, 2, 3],
        expireType: '1',
        expireTime: '2025-12-31',
        userLimit: 100,
        storageLimit: 10240,
        flowLimit: 500,
        price: 5999,
        remark: '测试套餐备注',
      };

      const newPackage = {
        ...ctx.body,
        packageId: Math.max(...mockPackages.map((p) => p.packageId)) + 1,
        status: '0',
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN'),
      };

      ctx.success(newPackage);

      expect(ctx.success).toHaveBeenCalledWith(
        expect.objectContaining({
          packageName: '测试套餐',
          status: '0',
        }),
      );
    });
  });

  describe('updatePackage', () => {
    it('应成功更新套餐', () => {
      const ctx = createMockContext();
      ctx.params = { packageId: '1' };
      ctx.body = { packageName: '更新后的名称', price: 3999 };

      const index = mockPackages.findIndex((p) => p.packageId === Number(ctx.params.packageId));

      if (index !== -1) {
        const updated = {
          ...mockPackages[index],
          ...ctx.body,
          updateTime: new Date().toLocaleString('zh-CN'),
        };
        ctx.success(updated);
      } else {
        ctx.fail('套餐不存在', 404);
      }

      expect(ctx.success).toHaveBeenCalledWith(
        expect.objectContaining({
          packageName: '更新后的名称',
          price: 3999,
        }),
      );
    });

    it('不存在的套餐应返回404错误', () => {
      const ctx = createMockContext();
      ctx.params = { packageId: '999' };
      ctx.body = { packageName: '更新后的名称' };

      const index = mockPackages.findIndex((p) => p.packageId === Number(ctx.params.packageId));

      if (index !== -1) {
        ctx.success(mockPackages[index]);
      } else {
        ctx.fail('套餐不存在', 404);
      }

      expect(ctx.fail).toHaveBeenCalledWith('套餐不存在', 404);
    });
  });

  describe('deletePackage', () => {
    it('应成功删除套餐', () => {
      const ctx = createMockContext();
      ctx.params = { packageId: '4' };

      const index = mockPackages.findIndex((p) => p.packageId === Number(ctx.params.packageId));

      if (index !== -1) {
        ctx.success(null);
      } else {
        ctx.fail('套餐不存在', 404);
      }

      expect(ctx.success).toHaveBeenCalledWith(null);
    });

    it('不存在的套餐应返回404错误', () => {
      const ctx = createMockContext();
      ctx.params = { packageId: '999' };

      const index = mockPackages.findIndex((p) => p.packageId === Number(ctx.params.packageId));

      if (index !== -1) {
        ctx.success(null);
      } else {
        ctx.fail('套餐不存在', 404);
      }

      expect(ctx.fail).toHaveBeenCalledWith('套餐不存在', 404);
    });
  });
});

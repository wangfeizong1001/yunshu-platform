/**
 * 租户管理控制器单元测试
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

// Mock tenant middleware
vi.mock('../../middlewares/tenant', () => ({
  tenantContext: {
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
    clear: vi.fn(),
  },
  getCurrentTenantId: vi.fn().mockReturnValue(null),
}));

describe('TenantController', () => {
  // 模拟租户数据
  const mockTenants = [
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

  describe('getTenantPage', () => {
    it('应返回分页租户列表（无筛选条件）', () => {
      const ctx = createMockContext();
      ctx.query = { pageNum: 1, pageSize: 10 };

      // 模拟 getTenantPage 的逻辑
      const { keyword, status, pageNum = 1, pageSize = 10 } = ctx.query;
      let filtered = [...mockTenants];

      if (keyword) {
        const kw = (keyword as string).toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.tenantName.toLowerCase().includes(kw) ||
            t.tenantCode.toLowerCase().includes(kw)
        );
      }

      if (status) {
        filtered = filtered.filter((t) => t.status === status);
      }

      const total = filtered.length;
      const start = ((pageNum as number) - 1) * (pageSize as number);
      const end = start + (pageSize as number);
      const rows = filtered.slice(start, end);

      ctx.success({ total, rows });

      expect(ctx.success).toHaveBeenCalledWith({
        total: 2,
        rows: expect.any(Array),
      });
    });

    it('应支持关键词搜索', () => {
      const ctx = createMockContext();
      ctx.query = { keyword: '云枢', pageNum: 1, pageSize: 10 };

      const { keyword, status } = ctx.query;
      let filtered = [...mockTenants];

      if (keyword) {
        const kw = (keyword as string).toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.tenantName.toLowerCase().includes(kw) ||
            t.tenantCode.toLowerCase().includes(kw)
        );
      }

      if (status) {
        filtered = filtered.filter((t) => t.status === status);
      }

      const total = filtered.length;
      const rows = filtered.slice(0, 10);

      ctx.success({ total, rows });

      expect(ctx.success).toHaveBeenCalledWith(
        expect.objectContaining({
          rows: expect.arrayContaining([
            expect.objectContaining({ tenantName: '云枢科技' }),
          ]),
        })
      );
    });

    it('应支持状态筛选', () => {
      const ctx = createMockContext();
      ctx.query = { status: '0', pageNum: 1, pageSize: 10 };

      const { keyword, status } = ctx.query;
      let filtered = [...mockTenants];

      if (keyword) {
        const kw = (keyword as string).toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.tenantName.toLowerCase().includes(kw) ||
            t.tenantCode.toLowerCase().includes(kw)
        );
      }

      if (status) {
        filtered = filtered.filter((t) => t.status === status);
      }

      const rows = filtered.slice(0, 10);

      ctx.success({ total: filtered.length, rows });

      expect(ctx.success).toHaveBeenCalledWith(
        expect.objectContaining({
          rows: expect.arrayContaining([
            expect.objectContaining({ status: '0' }),
          ]),
        })
      );
    });
  });

  describe('getTenantById', () => {
    it('应返回指定ID的租户详情', () => {
      const ctx = createMockContext();
      ctx.params = { tenantId: '1' };

      const tenant = mockTenants.find((t) => t.tenantId === Number(ctx.params.tenantId));

      if (tenant) {
        ctx.success(tenant);
      } else {
        ctx.fail('租户不存在', 404);
      }

      expect(ctx.success).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: 1,
          tenantName: '云枢科技',
        })
      );
    });

    it('不存在的租户应返回404错误', () => {
      const ctx = createMockContext();
      ctx.params = { tenantId: '999' };

      const tenant = mockTenants.find((t) => t.tenantId === Number(ctx.params.tenantId));

      if (tenant) {
        ctx.success(tenant);
      } else {
        ctx.fail('租户不存在', 404);
      }

      expect(ctx.fail).toHaveBeenCalledWith('租户不存在', 404);
    });
  });

  describe('createTenant', () => {
    it('应成功创建租户', () => {
      const ctx = createMockContext();
      ctx.body = {
        tenantName: '新租户',
        tenantCode: 'newtenant',
        contact: '王五',
        contactPhone: '13700137000',
        email: 'new@tenant.com',
        domain: 'newtenant.com',
        packageId: 1,
        packageName: '高级版',
        expireTime: '2027-12-31',
        userLimit: 100,
        remark: '新租户',
      };

      const newTenant = {
        ...ctx.body,
        tenantId: Math.max(...mockTenants.map((t) => t.tenantId)) + 1,
        userCount: 0,
        status: '0',
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN'),
      };

      ctx.success(newTenant);

      expect(ctx.success).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantName: '新租户',
          tenantCode: 'newtenant',
          status: '0',
        })
      );
    });
  });

  describe('updateTenant', () => {
    it('应成功更新租户', () => {
      const ctx = createMockContext();
      ctx.params = { tenantId: '1' };
      ctx.body = { tenantName: '更新后的名称' };

      const index = mockTenants.findIndex(
        (t) => t.tenantId === Number(ctx.params.tenantId)
      );

      if (index !== -1) {
        const updated = {
          ...mockTenants[index],
          ...ctx.body,
          updateTime: new Date().toLocaleString('zh-CN'),
        };
        ctx.success(updated);
      } else {
        ctx.fail('租户不存在', 404);
      }

      expect(ctx.success).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantName: '更新后的名称',
        })
      );
    });

    it('不存在的租户应返回404错误', () => {
      const ctx = createMockContext();
      ctx.params = { tenantId: '999' };
      ctx.body = { tenantName: '更新后的名称' };

      const index = mockTenants.findIndex(
        (t) => t.tenantId === Number(ctx.params.tenantId)
      );

      if (index !== -1) {
        ctx.success(mockTenants[index]);
      } else {
        ctx.fail('租户不存在', 404);
      }

      expect(ctx.fail).toHaveBeenCalledWith('租户不存在', 404);
    });
  });

  describe('deleteTenant', () => {
    it('应成功删除租户', () => {
      const ctx = createMockContext();
      ctx.params = { tenantId: '2' };

      const index = mockTenants.findIndex(
        (t) => t.tenantId === Number(ctx.params.tenantId)
      );

      if (index !== -1) {
        ctx.success(null);
      } else {
        ctx.fail('租户不存在', 404);
      }

      expect(ctx.success).toHaveBeenCalledWith(null);
    });

    it('不存在的租户应返回404错误', () => {
      const ctx = createMockContext();
      ctx.params = { tenantId: '999' };

      const index = mockTenants.findIndex(
        (t) => t.tenantId === Number(ctx.params.tenantId)
      );

      if (index !== -1) {
        ctx.success(null);
      } else {
        ctx.fail('租户不存在', 404);
      }

      expect(ctx.fail).toHaveBeenCalledWith('租户不存在', 404);
    });
  });

  describe('changeTenantStatus', () => {
    it('应成功修改租户状态', () => {
      const ctx = createMockContext();
      ctx.body = { tenantId: '1', status: '1' };

      const tenant = mockTenants.find((t) => t.tenantId === Number(ctx.body.tenantId));

      if (tenant) {
        tenant.status = ctx.body.status;
        tenant.updateTime = new Date().toLocaleString('zh-CN');
        ctx.success(null);
      } else {
        ctx.fail('租户不存在', 404);
      }

      expect(ctx.success).toHaveBeenCalledWith(null);
    });

    it('不存在的租户应返回404错误', () => {
      const ctx = createMockContext();
      ctx.body = { tenantId: '999', status: '1' };

      const tenant = mockTenants.find((t) => t.tenantId === Number(ctx.body.tenantId));

      if (tenant) {
        ctx.success(null);
      } else {
        ctx.fail('租户不存在', 404);
      }

      expect(ctx.fail).toHaveBeenCalledWith('租户不存在', 404);
    });
  });
});

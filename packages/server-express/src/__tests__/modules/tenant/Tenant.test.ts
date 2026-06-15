import { describe, it, expect } from 'vitest';
import { tenantController } from '../../../modules/tenant/TenantController';
import { tenantPackageController } from '../../../modules/tenant/TenantPackageController';
import type { Request, Response } from 'express';

interface MockResponse extends Response {
  _statusCode: number;
  _jsonData: unknown;
}

function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    query: {},
    params: {},
    body: {},
    headers: {},
    ...overrides,
  } as Request;
}

function createMockResponse(): MockResponse {
  const res = {
    _statusCode: 200,
    _jsonData: null,
  } as unknown as MockResponse;
  res.status = (code: number) => {
    res._statusCode = code;
    return res;
  };
  res.json = (data: unknown) => {
    res._jsonData = data;
    return res;
  };
  return res;
}

describe('TenantController 租户控制器', () => {
  it('应能实例化', () => {
    expect(tenantController).toBeDefined();
  });

  it('getTenantPage 应返回分页列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await tenantController.getTenantPage(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(res._jsonData.data).toHaveProperty('total');
    expect(res._jsonData.data).toHaveProperty('rows');
  });

  it('getTenantPage 支持 keyword 搜索', async () => {
    const req = createMockRequest({ query: { keyword: '云枢' } });
    const res = createMockResponse();
    await tenantController.getTenantPage(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getTenantList 应返回所有租户', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await tenantController.getTenantList(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(Array.isArray(res._jsonData.data)).toBe(true);
  });

  it('getTenantById 应能获取单个租户', async () => {
    const req = createMockRequest({ params: { tenantId: '1' } });
    const res = createMockResponse();
    await tenantController.getTenantById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getTenantById 不存在应返回 notFound', async () => {
    const req = createMockRequest({ params: { tenantId: '99999' } });
    const res = createMockResponse();
    await tenantController.getTenantById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', false);
  });

  it('createTenant 应能创建租户', async () => {
    const req = createMockRequest({
      body: {
        tenantName: '测试公司',
        tenantCode: 'test_' + Date.now(),
        contact: '测试',
        contactPhone: '13000000000',
      },
    });
    const res = createMockResponse();
    await tenantController.createTenant(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('updateTenant 应能更新租户', async () => {
    const req = createMockRequest({ params: { tenantId: '1' }, body: { contact: '新联系人' } });
    const res = createMockResponse();
    await tenantController.updateTenant(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('deleteTenant 应能删除租户', async () => {
    const req = createMockRequest({ params: { tenantId: '2' } });
    const res = createMockResponse();
    await tenantController.deleteTenant(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('changeTenantStatus 应能修改状态', async () => {
    const req = createMockRequest({ body: { tenantId: 1, status: '1' } });
    const res = createMockResponse();
    await tenantController.changeTenantStatus(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

describe('TenantPackageController 套餐控制器', () => {
  it('应能实例化', () => {
    expect(tenantPackageController).toBeDefined();
  });

  it('getPackagePage 应返回分页列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await tenantPackageController.getPackagePage(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(res._jsonData.data).toHaveProperty('total');
    expect(res._jsonData.data).toHaveProperty('rows');
  });

  it('getPackagePage 支持 keyword 搜索', async () => {
    const req = createMockRequest({ query: { keyword: '高级' } });
    const res = createMockResponse();
    await tenantPackageController.getPackagePage(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getPackageList 应返回所有套餐', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await tenantPackageController.getPackageList(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(Array.isArray(res._jsonData.data)).toBe(true);
  });

  it('getPackageById 应能获取单个套餐', async () => {
    const req = createMockRequest({ params: { packageId: '1' } });
    const res = createMockResponse();
    await tenantPackageController.getPackageById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getPackageById 不存在应返回 notFound', async () => {
    const req = createMockRequest({ params: { packageId: '99999' } });
    const res = createMockResponse();
    await tenantPackageController.getPackageById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', false);
  });

  it('createPackage 应能创建套餐', async () => {
    const req = createMockRequest({
      body: { packageName: '企业版', description: '企业套餐', userLimit: 500, price: 9999 },
    });
    const res = createMockResponse();
    await tenantPackageController.createPackage(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('updatePackage 应能更新套餐', async () => {
    const req = createMockRequest({ params: { packageId: '1' }, body: { packageName: '新名称' } });
    const res = createMockResponse();
    await tenantPackageController.updatePackage(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('deletePackage 应能删除套餐', async () => {
    const req = createMockRequest({ params: { packageId: '2' } });
    const res = createMockResponse();
    await tenantPackageController.deletePackage(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

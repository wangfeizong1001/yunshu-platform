import { describe, it, expect } from 'vitest';
import { genController } from '../../../modules/gen/GenController';
import type { Request, Response } from 'express';

interface MockResponse extends Response {
  _statusCode: number;
  _jsonData: Record<string, unknown>;
}

function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    query: {},
    params: {},
    body: {},
    headers: {},
    user: { role: "admin", userId: "1", userName: "admin" },
    ...overrides,
  } as Request;
}

function createMockResponse(): MockResponse {
  const res = {
    _statusCode: 200,
    _jsonData: null as unknown as Record<string, unknown>,
  } as unknown as MockResponse;
  res.status = (code: number) => {
    res._statusCode = code;
    return res;
  };
  res.json = (data: unknown) => {
    res._jsonData = data as Record<string, unknown>;
    return res;
  };
  return res;
}

describe('GenController 代码生成控制器', () => {
  it('应能实例化', () => {
    expect(genController).toBeDefined();
  });

  it('getTablePage 应返回表分页列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await genController.getTablePage(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getTablePage 支持 name 搜索', async () => {
    const req = createMockRequest({ query: { name: 'user' } });
    const res = createMockResponse();
    await genController.getTablePage(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getTableList 应返回所有表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await genController.getTableList(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(Array.isArray(res._jsonData.data)).toBe(true);
  });

  it('getTableDetail 应能获取单个表', async () => {
    const req = createMockRequest({ params: { tableName: 'sys_user' } });
    const res = createMockResponse();
    await genController.getTableDetail(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getConfig 应能获取表配置', async () => {
    const req = createMockRequest({ params: { tableName: 'sys_user' } });
    const res = createMockResponse();
    await genController.getConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('saveConfig 应能保存配置', async () => {
    const req = createMockRequest({
      body: {
        tableName: 'sys_user',
        tableComment: '用户表',
        className: 'SysUser',
        moduleName: 'system',
        businessName: 'user',
        functionName: '用户管理',
        functionAuthor: 'admin',
      },
    });
    const res = createMockResponse();
    await genController.saveConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getConfigList 应能返回配置列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await genController.getConfigList(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(Array.isArray(res._jsonData.data)).toBe(true);
  });

  it('deleteConfig 应能删除配置', async () => {
    const req = createMockRequest({ params: { genId: '1' } });
    const res = createMockResponse();
    await genController.deleteConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('previewCode 应能生成预览代码', async () => {
    const req = createMockRequest({ body: { tableName: 'sys_user' } });
    const res = createMockResponse();
    await genController.previewCode(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('generateCode 应能生成下载链接', async () => {
    const req = createMockRequest({ body: { tableName: 'sys_user' } });
    const res = createMockResponse();
    await genController.generateCode(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('downloadCode 应能生成代码文件', async () => {
    const res = createMockResponse();
    res.setHeader = () => res;
    res.send = (data: unknown) => {
      res._jsonData = { success: true, data };
      return res;
    };
    const req = createMockRequest({ params: { tableName: 'sys_user' } });
    await genController.downloadCode(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('syncTable 应能同步数据库', async () => {
    const req = createMockRequest({ params: { tableName: 'sys_user' } });
    const res = createMockResponse();
    await genController.syncTable(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

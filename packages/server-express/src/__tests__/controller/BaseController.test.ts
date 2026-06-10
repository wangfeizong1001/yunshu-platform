import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express, { type Request, type Response } from 'express';
import supertest from 'supertest';
import { BaseController } from '../../controller/BaseController';
import { BusinessError, ErrorCode } from '@yunshu/server-core';
import { createPaginatedResult } from '@yunshu/shared';

class TestController extends BaseController {
  public testSuccess(req: Request, res: Response) {
    return this.success(res, { name: 'test', value: 123 }, '操作成功');
  }

  public testSuccessWithStatusCode(req: Request, res: Response) {
    return this.success(res, { custom: 'data' }, '自定义状态码', 202);
  }

  public testCreated(req: Request, res: Response) {
    return this.created(res, { id: 'abc-123', name: 'new-item' }, '创建成功');
  }

  public testNoContent(req: Request, res: Response) {
    return this.noContent(res);
  }

  public testPaginate(req: Request, res: Response) {
    const items = [
      { id: 1, name: 'item-1' },
      { id: 2, name: 'item-2' },
      { id: 3, name: 'item-3' },
    ];
    return this.paginate(res, createPaginatedResult(items, 1, 10, 3), '分页查询成功');
  }

  public testError(req: Request, res: Response) {
    return this.error(res, new Error('普通错误'), 400);
  }

  public testBusinessError(req: Request, res: Response) {
    return this.error(res, new BusinessError(ErrorCode.VALIDATION_ERROR, '业务校验失败', { field: 'email' }));
  }

  public testErrorString(req: Request, res: Response) {
    return this.error(res, '字符串形式的错误', 418);
  }

  public testBadRequest(req: Request, res: Response) {
    return this.badRequest(res, '请求参数错误', { field: 'username' });
  }

  public testUnauthorized(req: Request, res: Response) {
    return this.unauthorized(res, '请先登录');
  }

  public testForbidden(req: Request, res: Response) {
    return this.forbidden(res, '没有权限执行此操作');
  }

  public testNotFound(req: Request, res: Response) {
    return this.notFound(res, '请求的资源不存在');
  }

  public testConflict(req: Request, res: Response) {
    return this.conflict(res, '资源冲突');
  }

  public testServerError(req: Request, res: Response) {
    return this.serverError(res, '服务器内部错误');
  }
}

function createTestAppWithController() {
  const app = express();
  const ctrl = new TestController();

  app.get('/success', (req, res) => ctrl.testSuccess(req, res));
  app.get('/success-status', (req, res) => ctrl.testSuccessWithStatusCode(req, res));
  app.post('/created', (req, res) => ctrl.testCreated(req, res));
  app.delete('/no-content', (req, res) => ctrl.testNoContent(req, res));
  app.get('/paginate', (req, res) => ctrl.testPaginate(req, res));
  app.get('/error', (req, res) => ctrl.testError(req, res));
  app.get('/business-error', (req, res) => ctrl.testBusinessError(req, res));
  app.get('/error-string', (req, res) => ctrl.testErrorString(req, res));
  app.get('/bad-request', (req, res) => ctrl.testBadRequest(req, res));
  app.get('/unauthorized', (req, res) => ctrl.testUnauthorized(req, res));
  app.get('/forbidden', (req, res) => ctrl.testForbidden(req, res));
  app.get('/not-found-ctrl', (req, res) => ctrl.testNotFound(req, res));
  app.get('/conflict', (req, res) => ctrl.testConflict(req, res));
  app.get('/server-error', (req, res) => ctrl.testServerError(req, res));

  return app;
}

describe('BaseController.success 成功响应', () => {
  const app = createTestAppWithController();

  it('应返回 success=true 的响应', async () => {
    const res = await supertest(app).get('/success');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('应包含正确的 data 字段', async () => {
    const res = await supertest(app).get('/success');
    expect(res.body.data).toEqual({ name: 'test', value: 123 });
  });

  it('应包含 message 字段', async () => {
    const res = await supertest(app).get('/success');
    expect(res.body.message).toBe('操作成功');
  });

  it('应包含 timestamp 字段', async () => {
    const res = await supertest(app).get('/success');
    expect(res.body).toHaveProperty('timestamp');
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('应支持自定义 HTTP 状态码', async () => {
    const res = await supertest(app).get('/success-status');
    expect(res.status).toBe(202);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('自定义状态码');
    expect(res.body.data).toEqual({ custom: 'data' });
  });

  it('应返回 JSON 格式', async () => {
    const res = await supertest(app).get('/success');
    expect(res.headers['content-type']).toContain('application/json');
  });
});

describe('BaseController.created 创建响应', () => {
  const app = createTestAppWithController();

  it('应返回 201 状态码', async () => {
    const res = await supertest(app).post('/created');
    expect(res.status).toBe(201);
  });

  it('应返回 success=true', async () => {
    const res = await supertest(app).post('/created');
    expect(res.body.success).toBe(true);
  });

  it('应包含创建的 data 数据', async () => {
    const res = await supertest(app).post('/created');
    expect(res.body.data).toEqual({ id: 'abc-123', name: 'new-item' });
  });

  it('应包含创建成功消息', async () => {
    const res = await supertest(app).post('/created');
    expect(res.body.message).toBe('创建成功');
  });
});

describe('BaseController.noContent 无内容响应', () => {
  const app = createTestAppWithController();

  it('应返回 204 状态码', async () => {
    const res = await supertest(app).delete('/no-content');
    expect(res.status).toBe(204);
  });

  it('响应体应无内容', async () => {
    const res = await supertest(app).delete('/no-content');
    expect(res.text).toBe('');
  });
});

describe('BaseController.paginate 分页响应', () => {
  const app = createTestAppWithController();

  it('应返回 200 状态码且 success=true', async () => {
    const res = await supertest(app).get('/paginate');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('应包含 data 数组字段', async () => {
    const res = await supertest(app).get('/paginate');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('应包含 pagination 字段', async () => {
    const res = await supertest(app).get('/paginate');
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(10);
    expect(res.body.pagination.total).toBe(3);
    expect(res.body.pagination.totalPages).toBe(1);
    expect(res.body.pagination.hasPrev).toBe(false);
    expect(res.body.pagination.hasNext).toBe(false);
  });

  it('应包含 message 字段', async () => {
    const res = await supertest(app).get('/paginate');
    expect(res.body.message).toBe('分页查询成功');
  });

  it('应包含 timestamp 字段', async () => {
    const res = await supertest(app).get('/paginate');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('BaseController.error 错误响应', () => {
  const app = createTestAppWithController();

  it('应返回 success=false', async () => {
    const res = await supertest(app).get('/error');
    expect(res.body.success).toBe(false);
  });

  it('应返回指定的 HTTP 状态码', async () => {
    const res = await supertest(app).get('/error');
    expect(res.status).toBe(400);
  });

  it('应包含错误消息', async () => {
    const res = await supertest(app).get('/error');
    expect(res.body.message).toBe('普通错误');
  });

  it('字符串错误应被正确处理', async () => {
    const res = await supertest(app).get('/error-string');
    expect(res.status).toBe(418);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('字符串形式的错误');
  });

  it('BusinessError 应包含错误码', async () => {
    const res = await supertest(app).get('/business-error');
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('业务校验失败');
    expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    expect(res.body.details).toEqual({ field: 'email' });
  });

  it('BusinessError 应正确返回 HTTP 状态码', async () => {
    const res = await supertest(app).get('/business-error');
    expect(res.status).toBe(400);
  });

  it('错误响应应包含 timestamp', async () => {
    const res = await supertest(app).get('/error');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('BaseController 便捷错误方法', () => {
  const app = createTestAppWithController();

  it('badRequest 应返回 400 状态码', async () => {
    const res = await supertest(app).get('/bad-request');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('请求参数错误');
    expect(res.body.details).toEqual({ field: 'username' });
  });

  it('unauthorized 应返回 401 状态码', async () => {
    const res = await supertest(app).get('/unauthorized');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('请先登录');
  });

  it('forbidden 应返回 403 状态码', async () => {
    const res = await supertest(app).get('/forbidden');
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('没有权限执行此操作');
  });

  it('notFound 应返回 404 状态码', async () => {
    const res = await supertest(app).get('/not-found-ctrl');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('请求的资源不存在');
  });

  it('conflict 应返回 409 状态码', async () => {
    const res = await supertest(app).get('/conflict');
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('资源冲突');
  });

  it('serverError 应返回 500 状态码', async () => {
    const res = await supertest(app).get('/server-error');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('服务器内部错误');
  });

  it('所有便捷错误方法应包含 timestamp', async () => {
    const paths = ['/bad-request', '/unauthorized', '/forbidden', '/not-found-ctrl', '/conflict', '/server-error'];
    for (const path of paths) {
      const res = await supertest(app).get(path);
      expect(res.body).toHaveProperty('timestamp');
      expect(typeof res.body.timestamp).toBe('string');
    }
  });

  it('所有便捷错误方法应返回 JSON 格式', async () => {
    const paths = ['/bad-request', '/unauthorized', '/forbidden', '/not-found-ctrl', '/conflict', '/server-error'];
    for (const path of paths) {
      const res = await supertest(app).get(path);
      expect(res.headers['content-type']).toContain('application/json');
    }
  });
});

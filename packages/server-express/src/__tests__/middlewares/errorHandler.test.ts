import { describe, it, expect } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import supertest from 'supertest';
import { asyncHandler, globalErrorHandler, notFoundHandler } from '../../middlewares/errorHandler';
import { BusinessError, ErrorCode } from '@yunshu/server-core';

describe('asyncHandler 异步错误包装器', () => {
  it('应捕获异步路由中抛出的 Error 并传递给错误处理中间件', async () => {
    const app = express();
    app.get('/error', asyncHandler(async (_req: Request, _res: Response) => {
      throw new Error('模拟异步错误');
    }));
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/error');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });

  it('应捕获被 reject 的 Promise', async () => {
    const app = express();
    app.get('/reject', asyncHandler(async (_req: Request, _res: Response) => {
      return Promise.reject(new Error('Promise rejected'));
    }));
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/reject');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });

  it('正常的异步处理应成功返回响应', async () => {
    const app = express();
    app.get('/ok', asyncHandler(async (_req: Request, res: Response) => {
      res.status(200).json({ success: true, data: 'ok' });
    }));
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/ok');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBe('ok');
  });

  it('应正确传递 req 和 res 参数', async () => {
    const app = express();
    app.use(express.json());
    app.post('/echo', asyncHandler(async (req: Request, res: Response) => {
      const { message } = req.body;
      res.status(200).json({ success: true, message });
    }));
    app.use(globalErrorHandler());

    const res = await supertest(app).post('/echo').send({ message: 'hello' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('hello');
  });

  it('未捕获异常应被传递到错误中间件', async () => {
    const app = express();
    app.get('/fail', asyncHandler(async (_req: Request, _res: Response) => {
      const obj: any = null;
      obj.nested.value = 1;
    }));
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/fail');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe('notFoundHandler 404 处理中间件', () => {
  it('未匹配的路由应返回 404 状态码', async () => {
    const app = express();
    app.get('/api/exists', (_req: Request, res: Response) => {
      res.json({ success: true });
    });
    app.use(notFoundHandler());
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/api/not-exist');
    expect(res.status).toBe(404);
  });

  it('404 响应应包含 success=false', async () => {
    const app = express();
    app.use(notFoundHandler());
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/any-path');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('404 响应应包含错误消息字段', async () => {
    const app = express();
    app.use(notFoundHandler());
    app.use(globalErrorHandler());

    const res = await supertest(app).post('/some-post');
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message.length).toBeGreaterThan(0);
  });

  it('404 响应应返回 JSON 格式', async () => {
    const app = express();
    app.use(notFoundHandler());
    app.use(globalErrorHandler());

    const res = await supertest(app).delete('/unknown');
    expect(res.headers['content-type']).toContain('application/json');
  });

  it('应标记错误为 operational', async () => {
    const app = express();
    app.use(notFoundHandler());
    app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
      const appErr = err as { statusCode: number; isOperational: boolean };
      expect(appErr.statusCode).toBe(404);
      expect(appErr.isOperational).toBe(true);
      res.status(404).json({ ok: true });
    });

    const res = await supertest(app).get('/x');
    expect(res.status).toBe(404);
  });
});

describe('globalErrorHandler 全局错误处理中间件', () => {
  it('应捕获 BusinessError 并返回对应 HTTP 状态码和错误码', async () => {
    const app = express();
    app.get('/business-error', asyncHandler(async (_req: Request, _res: Response) => {
      throw new BusinessError(ErrorCode.VALIDATION_ERROR, '业务逻辑失败', { detail: 'extra' });
    }));
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/business-error');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('业务逻辑失败');
    expect(res.body.errorCode).toBe('VALIDATION_ERROR');
  });

  it('应返回 BusinessError 的 details 字段', async () => {
    const app = express();
    app.get('/business-detail', asyncHandler(async (_req: Request, _res: Response) => {
      throw new BusinessError(ErrorCode.VALIDATION_ERROR, '参数错误', { field: 'email' });
    }));
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/business-detail');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.details).toBeDefined();
    expect(res.body.details.field).toBe('email');
  });

  it('普通 Error 应返回 500 状态码', async () => {
    const app = express();
    app.get('/plain-error', asyncHandler(async (_req: Request, _res: Response) => {
      throw new Error('服务器内部错误');
    }));
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/plain-error');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });

  it('应返回 JSON 格式的错误响应', async () => {
    const app = express();
    app.get('/error', asyncHandler(async (_req: Request, _res: Response) => {
      throw new Error('error');
    }));
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/error');
    expect(res.headers['content-type']).toContain('application/json');
  });

  it('BusinessError 不同状态码应正确返回', async () => {
    const app = express();
    app.get('/not-found', asyncHandler(async (_req: Request, _res: Response) => {
      throw new BusinessError(ErrorCode.NOT_FOUND, '资源不存在');
    }));
    app.get('/conflict', asyncHandler(async (_req: Request, _res: Response) => {
      throw new BusinessError(ErrorCode.ALREADY_EXISTS, '资源冲突');
    }));
    app.use(globalErrorHandler());

    const res1 = await supertest(app).get('/not-found');
    expect(res1.status).toBe(404);
    expect(res1.body.success).toBe(false);

    const res2 = await supertest(app).get('/conflict');
    expect(res2.status).toBe(409);
    expect(res2.body.success).toBe(false);
  });

  it('生产环境应隐藏普通错误详情', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const app = express();
    app.get('/hidden-error', asyncHandler(async (_req: Request, _res: Response) => {
      throw new Error('sensitive internal details');
    }));
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/hidden-error');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('服务器内部错误');

    process.env.NODE_ENV = originalEnv;
  });

  it('错误响应应包含 timestamp 字段', async () => {
    const app = express();
    app.get('/error-ts', asyncHandler(async (_req: Request, _res: Response) => {
      throw new BusinessError(ErrorCode.VALIDATION_ERROR, '测试错误');
    }));
    app.use(globalErrorHandler());

    const res = await supertest(app).get('/error-ts');
    expect(res.body).toHaveProperty('timestamp');
    expect(typeof res.body.timestamp).toBe('string');
  });
});

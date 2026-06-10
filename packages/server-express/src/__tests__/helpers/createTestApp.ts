import type { Express } from 'express';
import supertest from 'supertest';
import { createApp } from '../../app';
import { authSession } from '../../middlewares/auth';

export interface TestAppContext {
  app: Express;
  request: ReturnType<typeof supertest>;
}

export function createTestApp(): TestAppContext {
  // 测试环境：每次创建时先清理之前的会话，再重新注册 admin token
  authSession.clear();
  authSession.register('test-token', {
    userId: '1',
    userName: 'test-admin',
    role: 'admin',
  });

  const app = createApp();
  const rawRequest = supertest(app);

  // 代理对象：为每个 HTTP 方法自动注入 Authorization header
  const withAuth = (method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options') => {
    return (url: string) =>
      (rawRequest as any)[method](url).set('Authorization', 'Bearer test-token');
  };

  const request = new Proxy(rawRequest as any, {
    get(target: any, prop: string) {
      if (
        prop === 'get' ||
        prop === 'post' ||
        prop === 'put' ||
        prop === 'delete' ||
        prop === 'patch' ||
        prop === 'head' ||
        prop === 'options'
      ) {
        return withAuth(prop as any);
      }
      return target[prop];
    },
  });

  return { app, request };
}

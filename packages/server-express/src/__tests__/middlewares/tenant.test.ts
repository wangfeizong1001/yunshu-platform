import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import supertest from 'supertest';
import {
  tenantContext,
  tenantMiddleware,
  getCurrentTenantId,
  clearTenantContext,
} from '../../middlewares/tenant';

describe('tenantContext 租户上下文单例', () => {
  beforeEach(() => {
    tenantContext.clear();
  });

  it('应能够设置并获取当前租户 ID', () => {
    tenantContext.set('T001');
    expect(tenantContext.get()).toBe('T001');
  });

  it('has 应返回是否有有效的租户上下文', () => {
    expect(tenantContext.has()).toBe(false);
    tenantContext.set('T001');
    expect(tenantContext.has()).toBe(true);
  });

  it('clear 应清空当前租户', () => {
    tenantContext.set('A');
    tenantContext.clear();
    expect(tenantContext.get()).toBeNull();
    expect(tenantContext.has()).toBe(false);
  });
});

describe('getCurrentTenantId / clearTenantContext 导出函数', () => {
  beforeEach(() => {
    tenantContext.clear();
  });

  it('getCurrentTenantId 应返回当前租户 ID', () => {
    tenantContext.set('T999');
    expect(getCurrentTenantId()).toBe('T999');
  });

  it('clearTenantContext 应清空上下文', () => {
    tenantContext.set('X');
    clearTenantContext();
    expect(getCurrentTenantId()).toBeNull();
  });
});

describe('tenantMiddleware 租户中间件', () => {
  beforeEach(() => {
    tenantContext.clear();
  });

  it('通过 tenant-id header 设置请求租户', async () => {
    const app = express();
    app.use(tenantMiddleware);
    app.get('/t', (req, res) => {
      res.json({ tenantId: req.tenantId, currentTenantId: getCurrentTenantId() });
    });
    const res = await supertest(app).get('/t').set('tenant-id', 'T001');
    expect(res.status).toBe(200);
    expect(res.body.tenantId).toBe('T001');
    expect(res.body.currentTenantId).toBe('T001');
  });

  it('未提供 tenant header 时请求也能继续处理（不设置 tenantId）', async () => {
    const app = express();
    app.use(tenantMiddleware);
    app.get('/t', (req, res) => {
      res.json({ hasTenantId: !!req.tenantId });
    });
    const res = await supertest(app).get('/t');
    expect(res.status).toBe(200);
    expect(res.body.hasTenantId).toBe(false);
  });

  it('不同请求应设置不同租户 ID', async () => {
    const app = express();
    app.use(tenantMiddleware);
    app.get('/t', (req, res) => {
      res.json({ tenantId: req.tenantId });
    });
    const res1 = await supertest(app).get('/t').set('tenant-id', 'A');
    const res2 = await supertest(app).get('/t').set('tenant-id', 'B');
    expect(res1.body.tenantId).toBe('A');
    expect(res2.body.tenantId).toBe('B');
  });
});

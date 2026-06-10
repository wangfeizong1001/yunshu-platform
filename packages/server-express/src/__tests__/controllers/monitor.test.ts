import { describe, it, expect } from 'vitest';
import { createTestApp } from '../helpers/createTestApp';

describe('服务器监控 /api/monitor/server', () => {
  const { request } = createTestApp();

  it('GET /api/monitor/server 应返回 200 且 success=true', async () => {
    const res = await request.get('/api/monitor/server');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/monitor/server 响应应包含 cpu 字段', async () => {
    const res = await request.get('/api/monitor/server');
    expect(res.body.data).toHaveProperty('cpu');
    expect(res.body.data.cpu).toHaveProperty('coreCount');
    expect(res.body.data.cpu).toHaveProperty('model');
    expect(res.body.data.cpu).toHaveProperty('usagePercent');
    expect(typeof res.body.data.cpu.coreCount).toBe('number');
  });

  it('GET /api/monitor/server 响应应包含 memory 字段', async () => {
    const res = await request.get('/api/monitor/server');
    expect(res.body.data).toHaveProperty('memory');
    expect(res.body.data.memory).toHaveProperty('total');
    expect(res.body.data.memory).toHaveProperty('used');
    expect(res.body.data.memory).toHaveProperty('free');
    expect(res.body.data.memory).toHaveProperty('usagePercent');
  });

  it('GET /api/monitor/server 响应应包含 disk 字段', async () => {
    const res = await request.get('/api/monitor/server');
    expect(res.body.data).toHaveProperty('disk');
    expect(res.body.data.disk).toHaveProperty('drives');
    expect(Array.isArray(res.body.data.disk.drives)).toBe(true);
    if (res.body.data.disk.drives.length > 0) {
      expect(res.body.data.disk.drives[0]).toHaveProperty('name');
      expect(res.body.data.disk.drives[0]).toHaveProperty('totalGB');
      expect(res.body.data.disk.drives[0]).toHaveProperty('usedGB');
      expect(res.body.data.disk.drives[0]).toHaveProperty('freeGB');
    }
  });

  it('GET /api/monitor/server 响应应包含 jvm 字段', async () => {
    const res = await request.get('/api/monitor/server');
    expect(res.body.data).toHaveProperty('jvm');
    expect(res.body.data.jvm).toHaveProperty('runtimeName');
    expect(res.body.data.jvm).toHaveProperty('runtimeVersion');
    expect(res.body.data.jvm).toHaveProperty('uptimeSeconds');
    expect(res.body.data.jvm).toHaveProperty('heapUsedMB');
  });

  it('GET /api/monitor/server/cpu 应单独获取 CPU 信息', async () => {
    const res = await request.get('/api/monitor/server/cpu');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('coreCount');
  });

  it('GET /api/monitor/server/memory 应单独获取内存信息', async () => {
    const res = await request.get('/api/monitor/server/memory');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('total');
  });

  it('GET /api/monitor/server/disk 应单独获取磁盘信息', async () => {
    const res = await request.get('/api/monitor/server/disk');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('drives');
  });

  it('GET /api/monitor/server/jvm 应单独获取 JVM 信息', async () => {
    const res = await request.get('/api/monitor/server/jvm');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('runtimeName');
  });

  it('监控接口应始终返回 JSON 格式', async () => {
    const res = await request.get('/api/monitor/server');
    expect(res.headers['content-type']).toContain('application/json');
  });
});

describe('操作日志 /api/monitor/operlog', () => {
  const { request } = createTestApp();

  it('GET /api/monitor/operlog/list 应返回 200 且 success=true', async () => {
    const res = await request.get('/api/monitor/operlog/list');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/monitor/operlog/list 应包含 data 和 pagination 字段', async () => {
    const res = await request.get('/api/monitor/operlog/list');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('pagination');
  });

  it('GET /api/monitor/operlog/list 支持分页参数', async () => {
    const res = await request.get('/api/monitor/operlog/list?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(5);
  });
});

describe('登录日志 /api/monitor/logininfor', () => {
  const { request } = createTestApp();

  it('GET /api/monitor/logininfor/list 应返回 200 且 success=true', async () => {
    const res = await request.get('/api/monitor/logininfor/list');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/monitor/logininfor/list 应包含 data 数组', async () => {
    const res = await request.get('/api/monitor/logininfor/list');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/monitor/logininfor/list 支持分页参数', async () => {
    const res = await request.get('/api/monitor/logininfor/list?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pagination.page).toBe(1);
  });
});

describe('定时任务 /api/monitor/job', () => {
  const { request } = createTestApp();

  it('GET /api/monitor/job/list 应返回 200 且 success=true', async () => {
    const res = await request.get('/api/monitor/job/list');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/monitor/job/list 应包含 data 和 pagination', async () => {
    const res = await request.get('/api/monitor/job/list');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('pagination');
  });

  it('GET /api/monitor/job/list?page=2&limit=3 支持分页参数', async () => {
    const res = await request.get('/api/monitor/job/list?page=2&limit=3');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pagination.page).toBe(2);
    expect(res.body.pagination.limit).toBe(3);
  });
});

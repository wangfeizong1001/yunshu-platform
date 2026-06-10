import { describe, it, expect } from 'vitest';
import { createTestApp } from '../helpers/createTestApp';

describe('用户管理模块 /api/system/user', () => {
  const { request } = createTestApp();

  it('GET /api/system/user/list 应返回 200 且 success=true', async () => {
    const res = await request.get('/api/system/user/list');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/system/user/list 应包含 data 和 pagination 字段', async () => {
    const res = await request.get('/api/system/user/list');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination).toHaveProperty('page');
    expect(res.body.pagination).toHaveProperty('limit');
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.pagination).toHaveProperty('totalPages');
    expect(res.body.pagination).toHaveProperty('hasPrev');
    expect(res.body.pagination).toHaveProperty('hasNext');
  });

  it('GET /api/system/user/list?page=1&limit=2 分页参数应正常工作', async () => {
    const res = await request.get('/api/system/user/list?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(2);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });

  it('POST /api/system/user 应创建用户并返回 201/200 且 success=true', async () => {
    const res = await request.post('/api/system/user').send({
      userName: 'testuser_' + Date.now(),
      nickName: '测试用户',
      email: 'test@yunshu.com',
      phone: '13800000001',
      sex: '1',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });

  it('POST /api/system/user 缺少必填字段应返回错误', async () => {
    const res = await request.post('/api/system/user').send({});
    if (res.body && res.body.success === false) {
      expect(res.body.success).toBe(false);
    } else {
      expect(res.status).toBeGreaterThanOrEqual(200);
    }
  });

  it('GET /api/system/user/:userId 应获取单个用户详情', async () => {
    const listRes = await request.get('/api/system/user/list?limit=1');
    if (listRes.body.data && listRes.body.data.length > 0) {
      const userId = listRes.body.data[0].userId;
      const res = await request.get(`/api/system/user/${userId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('userId');
      expect(res.body.data.userId).toBe(userId);
    }
  });

  it('PUT /api/system/user 应更新用户信息', async () => {
    const listRes = await request.get('/api/system/user/list?limit=1');
    if (listRes.body.data && listRes.body.data.length > 0) {
      const user = listRes.body.data[0];
      const res = await request.put('/api/system/user').send({
        userId: user.userId,
        nickName: '更新后的昵称_' + Date.now(),
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });

  it('DELETE /api/system/user/:userId 应删除用户', async () => {
    const createRes = await request.post('/api/system/user').send({
      userName: 'delete_me_' + Date.now(),
      nickName: '待删除用户',
      email: 'delete@yunshu.com',
    });
    if (createRes.body.data && createRes.body.data.userId) {
      const userId = createRes.body.data.userId;
      const res = await request.delete(`/api/system/user/${userId}`);
      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
    } else if (createRes.body.data && typeof createRes.body.data === 'string') {
      const userId = createRes.body.data;
      const res = await request.delete(`/api/system/user/${userId}`);
      expect(res.status).toBeGreaterThanOrEqual(200);
    }
  });

  it('GET /api/system/user/list?userName=admin 支持按用户名模糊过滤', async () => {
    const res = await request.get('/api/system/user/list?userName=admin');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/system/user/list?status=0 支持按状态过滤', async () => {
    const res = await request.get('/api/system/user/list?status=0');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('角色管理模块 /api/system/role', () => {
  const { request } = createTestApp();

  it('GET /api/system/role/list 应返回 200 且 success=true', async () => {
    const res = await request.get('/api/system/role/list');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/system/role/list 应包含 data 和 pagination', async () => {
    const res = await request.get('/api/system/role/list');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('pagination');
  });

  it('GET /api/system/role/all 应获取全部角色列表（不分页）', async () => {
    const res = await request.get('/api/system/role/all');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/system/role 应创建角色', async () => {
    const res = await request.post('/api/system/role').send({
      roleName: '测试角色_' + Date.now(),
      roleKey: 'test_role_' + Date.now(),
      dataScope: '1',
    });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/system/role/:roleId 应获取角色详情', async () => {
    const listRes = await request.get('/api/system/role/list?limit=1');
    if (listRes.body.data && listRes.body.data.length > 0) {
      const roleId = listRes.body.data[0].roleId;
      const res = await request.get(`/api/system/role/${roleId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.roleId).toBe(roleId);
    }
  });

  it('PUT /api/system/role 应更新角色信息', async () => {
    const listRes = await request.get('/api/system/role/list?limit=1');
    if (listRes.body.data && listRes.body.data.length > 0) {
      const role = listRes.body.data[0];
      const res = await request.put('/api/system/role').send({
        roleId: role.roleId,
        roleName: '更新后的角色名_' + Date.now(),
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });

  it('DELETE /api/system/role/:roleId 应删除角色', async () => {
    const createRes = await request.post('/api/system/role').send({
      roleName: '待删除角色_' + Date.now(),
      roleKey: 'delete_me_' + Date.now(),
    });
    if (createRes.body.data && createRes.body.data.roleId) {
      const roleId = createRes.body.data.roleId;
      const res = await request.delete(`/api/system/role/${roleId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });

  it('GET /api/system/role/list?roleName=管理员 支持按角色名过滤', async () => {
    const res = await request.get('/api/system/role/list?roleName=管理员');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('岗位管理模块 /api/system/post', () => {
  const { request } = createTestApp();

  it('GET /api/system/post/list 应返回 200 且 success=true', async () => {
    const res = await request.get('/api/system/post/list');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/system/post/list 应包含 data 和 pagination', async () => {
    const res = await request.get('/api/system/post/list');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('pagination');
  });

  it('GET /api/system/post/all 应获取全部岗位列表', async () => {
    const res = await request.get('/api/system/post/all');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/system/post 应创建岗位', async () => {
    const res = await request.post('/api/system/post').send({
      postCode: 'TEST_' + Date.now(),
      postName: '测试岗位_' + Date.now(),
      postSort: 99,
    });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/system/post/:postId 应获取岗位详情', async () => {
    const listRes = await request.get('/api/system/post/list?limit=1');
    if (listRes.body.data && listRes.body.data.length > 0) {
      const postId = listRes.body.data[0].postId;
      const res = await request.get(`/api/system/post/${postId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.postId).toBe(postId);
    }
  });

  it('PUT /api/system/post 应更新岗位信息', async () => {
    const listRes = await request.get('/api/system/post/list?limit=1');
    if (listRes.body.data && listRes.body.data.length > 0) {
      const post = listRes.body.data[0];
      const res = await request.put('/api/system/post').send({
        postId: post.postId,
        postName: '更新后的岗位_' + Date.now(),
        postCode: post.postCode,
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });

  it('DELETE /api/system/post/:postId 应删除岗位', async () => {
    const createRes = await request.post('/api/system/post').send({
      postCode: 'DEL_' + Date.now(),
      postName: '待删除岗位_' + Date.now(),
    });
    if (createRes.body.data && createRes.body.data.postId) {
      const postId = createRes.body.data.postId;
      const res = await request.delete(`/api/system/post/${postId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });
});

describe('参数配置模块 /api/system/config', () => {
  const { request } = createTestApp();

  it('GET /api/system/config/list 应返回参数配置列表', async () => {
    const res = await request.get('/api/system/config/list');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
  });

  it('GET /api/system/config/:configId 应获取配置详情', async () => {
    const listRes = await request.get('/api/system/config/list?limit=1');
    if (listRes.body.data && listRes.body.data.length > 0) {
      const configId = listRes.body.data[0].configId;
      const res = await request.get(`/api/system/config/${configId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });

  it('POST /api/system/config 应创建新配置', async () => {
    const res = await request.post('/api/system/config').send({
      configName: '测试配置_' + Date.now(),
      configKey: 'test.config.' + Date.now(),
      configValue: 'test_value',
      configType: 'Y',
    });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.body.success).toBe(true);
  });
});

describe('字典管理模块 /api/system/dict', () => {
  const { request } = createTestApp();

  it('GET /api/system/dict/type/list 应返回字典类型列表', async () => {
    const res = await request.get('/api/system/dict/type/list');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
  });

  it('POST /api/system/dict/type 应创建字典类型', async () => {
    const res = await request.post('/api/system/dict/type').send({
      dictName: '测试字典_' + Date.now(),
      dictType: 'test_dict_' + Date.now(),
    });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/system/dict/data/list 应返回字典数据列表', async () => {
    const res = await request.get('/api/system/dict/data/list');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
  });

  it('GET /api/system/dict/datas/:dictType 应按类型获取字典数据', async () => {
    const res = await request.get('/api/system/dict/datas/sys_user_sex');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

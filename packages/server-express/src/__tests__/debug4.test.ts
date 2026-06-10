import { describe, it, expect } from 'vitest';
import { createTestApp } from './helpers/createTestApp';

describe('simulate user tests sequence', () => {
  const { request } = createTestApp();

  it('full sequence', async () => {
    const r1 = await request.get('/api/system/user/list');
    console.log('1. list:', r1.status, r1.body.success);

    const r2 = await request.get('/api/system/user/list?page=1&limit=2');
    console.log('2. list page/limit:', r2.status, r2.body.success);

    const r3 = await request.post('/api/system/user').send({
      userName: 'test_' + Date.now(),
      nickName: '测试用户',
      email: 'test@yunshu.com',
      phone: '13800000001',
      sex: '1',
    });
    console.log('3. create:', r3.status, r3.body.success);

    const r4 = await request.post('/api/system/user').send({
      userName: 'test2_' + Date.now(),
      nickName: '测试',
    });
    console.log('4. create minimal:', r4.status, r4.body.success);

    const listRes = await request.get('/api/system/user/list?limit=1');
    console.log('5. list for userId:', listRes.status, listRes.body.success);
    if (listRes.body.data && listRes.body.data.length > 0) {
      const userId = listRes.body.data[0].userId;
      const r5 = await request.get(`/api/system/user/${userId}`);
      console.log('6. getById:', r5.status, r5.body.success);

      const r6 = await request.put('/api/system/user').send({
        userId,
        nickName: 'u_' + Date.now(),
      });
      console.log('7. update:', r6.status, r6.body.success);
    }

    const createRes = await request.post('/api/system/user').send({
      userName: 'del_' + Date.now(),
      nickName: '待删除',
      email: 'del@yunshu.com',
    });
    console.log('8. create for delete:', createRes.status, createRes.body.success);

    if (createRes.body.data && createRes.body.data.userId) {
      const r7 = await request.delete(`/api/system/user/${createRes.body.data.userId}`);
      console.log('9. delete:', r7.status, r7.body.success);
    }

    const r8 = await request.get('/api/system/user/list?userName=admin');
    console.log('10. userName=admin:', r8.status, r8.body.success, r8.body.message, r8.body.error);
  });
});

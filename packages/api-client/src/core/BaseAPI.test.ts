/**
 * BaseAPI.test.ts — 单元测试
 *
 * 测试目标：
 *   - 继承 BaseAPI 的业务子类可被正常实例化
 *   - getList / getById / create / update / patch / delete 转发到正确的 http 方法
 *   - batchDelete / batchCreate 的请求 url / body
 *   - count / exists 辅助方法
 *   - 构建 URL：endpoint 相对/绝对两种形式
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { BaseAPI } from './BaseAPI';
import type { HttpClient } from './HttpClient';

interface TestEntity {
  id: number;
  name: string;
}

// 构造一个 mock 的 HttpClient：只依赖 get / post / put / patch / delete 等方法签名
function createMockHttpClient() {
  const http: Mock<HttpClient> = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    request: vi.fn(),
    upload: vi.fn(),
    clearCache: vi.fn(),
    clearCacheByPrefix: vi.fn(),
    removeCache: vi.fn(),
    cancelRequest: vi.fn(),
    cancelAllRequests: vi.fn(),
  } as unknown as Mock<HttpClient>;
  return http;
}

describe('BaseAPI', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // --------------------------------------------------------------------------
  // 正常子类构造
  // --------------------------------------------------------------------------
  it('可构造继承 BaseAPI 的子类', () => {
    class UserAPI extends BaseAPI<TestEntity> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    expect(api).toBeInstanceOf(BaseAPI);
  });

  // --------------------------------------------------------------------------
  // URL 构建
  // --------------------------------------------------------------------------
  it('endpoint 不以 / 开头 → buildUrl 自动补全', async () => {
    class UserAPI extends BaseAPI<TestEntity> {
      protected endpoint = 'users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);

    (http.get as Mock).mockResolvedValueOnce({ success: true, data: { id: 1, name: 'a' } });
    const res = await api.getById(1);
    expect(http.get).toHaveBeenCalled();
    const firstArg = (http.get as Mock).mock.calls[0][0];
    // 不以 / 开头时应得到 '/users/1'
    expect(firstArg).toBe('/users/1');
    expect(res).toEqual({ success: true, data: { id: 1, name: 'a' } });
  });

  it('endpoint 以 / 开头 → buildUrl 保持以 / 开头', async () => {
    class UserAPI extends BaseAPI<TestEntity> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.get as Mock).mockResolvedValueOnce({ success: true, data: { id: 1, name: 'a' } });
    await api.getById(1);
    const firstArg = (http.get as Mock).mock.calls[0][0];
    expect(firstArg).toBe('/users/1');
  });

  // --------------------------------------------------------------------------
  // 标准 CRUD
  // --------------------------------------------------------------------------
  it('getList 应使用 GET /endpoint 并转发 params', async () => {
    class UserAPI extends BaseAPI<TestEntity> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.get as Mock).mockResolvedValueOnce({ success: true, data: { list: [], total: 0 } });

    await api.getList({ page: 1, pageSize: 10, search: 'a' });

    expect(http.get).toHaveBeenCalledWith('/users', {
      page: 1,
      pageSize: 10,
      search: 'a',
    });
  });

  it('getById 应使用 GET /endpoint/:id', async () => {
    class UserAPI extends BaseAPI<TestEntity> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.get as Mock).mockResolvedValueOnce({ success: true, data: { id: 1, name: 'a' } });

    await api.getById(1);
    expect(http.get).toHaveBeenCalledWith('/users/1');
  });

  it('create 应使用 POST /endpoint 并传递 body', async () => {
    class UserAPI extends BaseAPI<TestEntity, Partial<TestEntity>> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.post as Mock).mockResolvedValueOnce({ success: true, data: { id: 1, name: 'a' } });

    await api.create({ name: 'a' });
    expect(http.post).toHaveBeenCalledWith('/users', { name: 'a' });
  });

  it('update 应使用 PUT /endpoint/:id 并传递 body', async () => {
    class UserAPI extends BaseAPI<TestEntity, Partial<TestEntity>> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.put as Mock).mockResolvedValueOnce({ success: true, data: { id: 1, name: 'b' } });

    await api.update(1, { name: 'b' });
    expect(http.put).toHaveBeenCalledWith('/users/1', { name: 'b' });
  });

  it('patch 应使用 PATCH /endpoint/:id 并传递 body', async () => {
    class UserAPI extends BaseAPI<TestEntity, Partial<TestEntity>> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.patch as Mock).mockResolvedValueOnce({ success: true, data: { id: 1, name: 'c' } });

    await api.patch(1, { name: 'c' });
    expect(http.patch).toHaveBeenCalledWith('/users/1', { name: 'c' });
  });

  it('delete 应使用 DELETE /endpoint/:id', async () => {
    class UserAPI extends BaseAPI<TestEntity> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.delete as Mock).mockResolvedValueOnce({ success: true, data: undefined });

    await api.delete(1);
    expect(http.delete).toHaveBeenCalledWith('/users/1');
  });

  // --------------------------------------------------------------------------
  // 批量操作
  // --------------------------------------------------------------------------
  it('batchDelete 应使用 POST /endpoint/batch-delete 并携带 ids', async () => {
    class UserAPI extends BaseAPI<TestEntity> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.post as Mock).mockResolvedValueOnce({ success: true, data: undefined });

    await api.batchDelete([1, 2, 3]);
    expect(http.post).toHaveBeenCalledWith('/users/batch-delete', { ids: [1, 2, 3] });
  });

  it('batchCreate 应使用 POST /endpoint/batch 并携带数组 body', async () => {
    class UserAPI extends BaseAPI<TestEntity, Partial<TestEntity>> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.post as Mock).mockResolvedValueOnce({ success: true, data: [] });

    await api.batchCreate([{ name: 'a' }, { name: 'b' }]);
    expect(http.post).toHaveBeenCalledWith('/users/batch', [{ name: 'a' }, { name: 'b' }]);
  });

  // --------------------------------------------------------------------------
  // count / exists
  // --------------------------------------------------------------------------
  it('count 应使用 GET /endpoint/count', async () => {
    class UserAPI extends BaseAPI<TestEntity> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.get as Mock).mockResolvedValueOnce({ success: true, data: 42 });

    const result = await api.count({ search: 'a' });
    expect(http.get).toHaveBeenCalledWith('/users/count', { search: 'a' });
    expect(result).toEqual({ success: true, data: 42 });
  });

  it('exists 应使用 GET /endpoint/:id/exists', async () => {
    class UserAPI extends BaseAPI<TestEntity> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.get as Mock).mockResolvedValueOnce({ success: true, data: true });

    const result = await api.exists(1);
    expect(http.get).toHaveBeenCalledWith('/users/1/exists');
    expect(result).toEqual({ success: true, data: true });
  });

  // --------------------------------------------------------------------------
  // 错误转发
  // --------------------------------------------------------------------------
  it('底层 http 抛错时应向上抛出', async () => {
    class UserAPI extends BaseAPI<TestEntity> {
      protected endpoint = '/users';
    }
    const http = createMockHttpClient();
    const api = new UserAPI(http);
    (http.get as Mock).mockRejectedValueOnce(new Error('network'));
    await expect(api.getList({ page: 1 })).rejects.toThrow('network');
  });
});

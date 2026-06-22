import { describe, it, expect } from 'vitest';
import { configController } from '../../../modules/system/ConfigController';
import { deptController } from '../../../modules/system/DeptController';
import { dictController } from '../../../modules/system/DictController';
import { fileController } from '../../../modules/system/FileController';
import { menuController } from '../../../modules/system/MenuController';
import { messageController } from '../../../modules/system/MessageController';
import { noticeController } from '../../../modules/system/NoticeController';
import { ossController } from '../../../modules/system/OssController';
import { postController } from '../../../modules/system/PostController';
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
    user: { role: 'admin', userId: '1', userName: 'admin' },
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
  res.setHeader = () => res;
  return res;
}

describe('ConfigController 参数配置', () => {
  it('list 应返回列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await configController.list(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getById 应能获取单个配置', async () => {
    const req = createMockRequest({ params: { configId: '1' } });
    const res = createMockResponse();
    await configController.getById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getByKey 应能按键获取', async () => {
    const req = createMockRequest({ params: { configKey: 'sys.index.skinName' } });
    const res = createMockResponse();
    await configController.getByKey(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('create 应能创建配置', async () => {
    const req = createMockRequest({
      body: { configName: '新建配置', configKey: 'test.newkey', configValue: 'value', configType: 'N' },
    });
    const res = createMockResponse();
    await configController.create(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('create 缺少参数应返回 badRequest', async () => {
    const req = createMockRequest({ body: {} });
    const res = createMockResponse();
    await configController.create(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', false);
  });

  it('update 应能更新配置', async () => {
    const req = createMockRequest({
      params: { configId: '1' },
      body: { configName: '更新名称', configKey: 'sys.index.skinName', configValue: 'dark', configType: 'N' },
    });
    const res = createMockResponse();
    await configController.update(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('remove 应能删除配置', async () => {
    const req = createMockRequest({ params: { configId: '1' } });
    const res = createMockResponse();
    await configController.remove(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('batchRemove 应能批量删除', async () => {
    const req = createMockRequest({ body: { configIds: '2,3' } });
    const res = createMockResponse();
    await configController.batchRemove(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('refreshCache 应能刷新缓存', async () => {
    const req = createMockRequest({});
    const res = createMockResponse();
    await configController.refreshCache(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

describe('DeptController 部门', () => {
  it('list 应返回列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await deptController.list(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getTree 应能获取树形结构', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await deptController.getTree(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getById 应能获取单个部门', async () => {
    const req = createMockRequest({ params: { deptId: '1' } });
    const res = createMockResponse();
    await deptController.getById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('create 应能创建部门', async () => {
    const req = createMockRequest({
      body: { parentId: 1, deptName: '测试部门', orderNum: 1, leader: '张三', phone: '13800138000', email: 'test@test.com', status: '0' },
    });
    const res = createMockResponse();
    await deptController.create(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('update 应能更新部门', async () => {
    const req = createMockRequest({
      params: { deptId: '1' },
      body: { parentId: 1, deptName: '更新后的部门', orderNum: 1, leader: '李四', phone: '13800138001', email: 'update@test.com', status: '0' },
    });
    const res = createMockResponse();
    await deptController.update(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('remove 应能删除部门', async () => {
    // 先创建一个部门用于删除
    const createReq = createMockRequest({
      body: { parentId: 1, deptName: '待删除', orderNum: 99, leader: '王五', status: '0' },
    });
    const createRes = createMockResponse();
    await deptController.create(createReq, createRes as unknown as Response);

    // 找到刚创建的部门 ID，直接删除 ID 2
    const req = createMockRequest({ params: { deptId: '2' } });
    const res = createMockResponse();
    await deptController.remove(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

describe('DictController 字典', () => {
  it('getTypeList 应返回字典类型列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await dictController.getTypeList(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getTypeDetail 应能获取字典类型详情', async () => {
    const req = createMockRequest({ params: { dictId: '1' } });
    const res = createMockResponse();
    await dictController.getTypeDetail(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('createType 应能创建字典类型', async () => {
    const req = createMockRequest({
      body: { dictName: '测试字典', dictType: 'test_type_' + Date.now(), status: '0', remark: '测试' },
    });
    const res = createMockResponse();
    await dictController.createType(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('updateType 应能更新字典类型', async () => {
    const req = createMockRequest({
      params: { dictId: '1' },
      body: { dictName: '更新字典', dictType: 'sys_user_sex', status: '0' },
    });
    const res = createMockResponse();
    await dictController.updateType(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('removeType 应能删除字典类型', async () => {
    // 先创建一个
    const createReq = createMockRequest({
      body: { dictName: '待删除', dictType: 'test_to_delete_' + Date.now(), status: '0' },
    });
    const createRes = createMockResponse();
    await dictController.createType(createReq, createRes as unknown as Response);

    // 删除 ID 3
    const req = createMockRequest({ params: { dictId: '3' } });
    const res = createMockResponse();
    await dictController.removeType(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getDataList 应返回字典数据列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await dictController.getDataList(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getDataDetail 应能获取字典数据详情', async () => {
    const req = createMockRequest({ params: { dictCode: '1' } });
    const res = createMockResponse();
    await dictController.getDataDetail(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('createData 应能创建字典数据', async () => {
    const req = createMockRequest({
      body: { dictSort: 1, dictLabel: '测试', dictValue: 'test', dictType: 'sys_user_sex', status: '0' },
    });
    const res = createMockResponse();
    await dictController.createData(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('updateData 应能更新字典数据', async () => {
    const req = createMockRequest({
      params: { dictCode: '1' },
      body: { dictSort: 1, dictLabel: '男', dictValue: '0', dictType: 'sys_user_sex', status: '0' },
    });
    const res = createMockResponse();
    await dictController.updateData(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('removeData 应能删除字典数据', async () => {
    const req = createMockRequest({ params: { dictCode: '2' } });
    const res = createMockResponse();
    await dictController.removeData(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getDatasByType 应能按类型获取字典数据', async () => {
    const req = createMockRequest({ params: { dictType: 'sys_user_sex' } });
    const res = createMockResponse();
    await dictController.getDatasByType(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

describe('FileController 文件', () => {
  it('list 应返回分页列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await fileController.list(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getById 应能获取文件', async () => {
    const req = createMockRequest({ params: { id: '1' } });
    const res = createMockResponse();
    await fileController.getById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('delete 应能删除文件', async () => {
    const req = createMockRequest({ params: { id: '2' } });
    const res = createMockResponse();
    await fileController.delete(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('batchDelete 应能批量删除文件', async () => {
    const req = createMockRequest({ body: { ids: '3,4' } });
    const res = createMockResponse();
    await fileController.batchDelete(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('update 应能更新文件信息', async () => {
    const req = createMockRequest({ params: { id: '1' }, body: { fileName: '新名称.pdf' } });
    const res = createMockResponse();
    await fileController.update(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getStorageStats 应能获取存储统计', async () => {
    const req = createMockRequest({});
    const res = createMockResponse();
    await fileController.getStorageStats(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

describe('MenuController 菜单', () => {
  it('list 应返回列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await menuController.list(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getTree 应能获取树形菜单', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await menuController.getTree(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getById 应能获取单个菜单', async () => {
    const req = createMockRequest({ params: { menuId: '1' } });
    const res = createMockResponse();
    await menuController.getById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('create 应能创建菜单', async () => {
    const req = createMockRequest({
      body: { parentId: 1, menuName: '测试菜单', orderNum: 99, path: '/test-menu', component: 'TestMenu', query: '', isFrame: 1, isCache: '0', menuType: 'C', visible: '0', status: '0', perms: 'system:menu:test', icon: '#', remark: '' },
    });
    const res = createMockResponse();
    await menuController.create(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('update 应能更新菜单', async () => {
    const req = createMockRequest({
      params: { menuId: '1' },
      body: { menuName: '更新后', parentId: 0, orderNum: 1, path: '/update', component: 'Update', menuType: 'M', visible: '0', status: '0', icon: '#' },
    });
    const res = createMockResponse();
    await menuController.update(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('remove 应能删除菜单', async () => {
    // 删除 ID 2
    const req = createMockRequest({ params: { menuId: '2' } });
    const res = createMockResponse();
    await menuController.remove(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getTreeByUserId 应能根据用户获取菜单树', async () => {
    const req = createMockRequest({ params: { userId: '1' } });
    const res = createMockResponse();
    await menuController.getTreeByUserId(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

describe('MessageController 消息', () => {
  it('list 应返回分页列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await messageController.list(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getById 应能获取消息', async () => {
    const req = createMockRequest({ params: { messageId: '1' } });
    const res = createMockResponse();
    await messageController.getById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('create 应能创建消息', async () => {
    const req = createMockRequest({ body: { messageTitle: '测试消息', messageContent: '内容', messageType: '1' } });
    const res = createMockResponse();
    await messageController.create(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('read 应能标记已读', async () => {
    const req = createMockRequest({ params: { messageId: '1' } });
    const res = createMockResponse();
    await messageController.read(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('remove 应能删除消息', async () => {
    const req = createMockRequest({ params: { messageId: '2' } });
    const res = createMockResponse();
    await messageController.remove(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

describe('NoticeController 通知', () => {
  it('list 应返回分页列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await noticeController.list(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getById 应能获取通知', async () => {
    const req = createMockRequest({ params: { noticeId: '1' } });
    const res = createMockResponse();
    await noticeController.getById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('create 应能创建通知', async () => {
    const req = createMockRequest({ body: { noticeTitle: '测试', noticeType: '1', noticeContent: '内容' } });
    const res = createMockResponse();
    await noticeController.create(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('update 应能更新通知', async () => {
    const req = createMockRequest({ params: { noticeId: '1' }, body: { noticeTitle: '更新', noticeType: '1', noticeContent: '新内容' } });
    const res = createMockResponse();
    await noticeController.update(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('remove 应能删除通知', async () => {
    const req = createMockRequest({ params: { noticeId: '2' } });
    const res = createMockResponse();
    await noticeController.remove(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

describe('OssController OSS对象存储', () => {
  it('listConfigs 应返回配置列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await ossController.listConfigs(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getConfigById 应能获取单个配置', async () => {
    const req = createMockRequest({ params: { configId: '1' } });
    const res = createMockResponse();
    await ossController.getConfigById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getCurrentConfig 应能获取当前配置', async () => {
    const req = createMockRequest({});
    const res = createMockResponse();
    await ossController.getCurrentConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('createConfig 应能创建配置', async () => {
    const req = createMockRequest({
      body: { configKey: 'local_' + Date.now(), configName: '测试本地', accessKey: 'ak', secretKey: 'sk', bucketName: 'uploads', endpoint: 'http://localhost', status: '0' },
    });
    const res = createMockResponse();
    await ossController.createConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('updateConfig 应能更新配置', async () => {
    const req = createMockRequest({ params: { configId: '1' }, body: { configName: '更新名称', status: '0' } });
    const res = createMockResponse();
    await ossController.updateConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('deleteConfig 应能删除配置', async () => {
    const req = createMockRequest({ params: { configId: '2' } });
    const res = createMockResponse();
    await ossController.deleteConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('setDefaultConfig 应能设置默认配置', async () => {
    const req = createMockRequest({ body: { configId: 1 } });
    const res = createMockResponse();
    await ossController.setDefaultConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('testConnection 应能测试连接', async () => {
    const req = createMockRequest({ body: { configId: 1 } });
    const res = createMockResponse();
    await ossController.testConnection(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('listFiles 应返回文件分页列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await ossController.listFiles(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getFileById 应能获取单个文件', async () => {
    const req = createMockRequest({ params: { fileId: '1' } });
    const res = createMockResponse();
    await ossController.getFileById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('deleteFile 应能删除文件', async () => {
    const req = createMockRequest({ params: { fileId: '2' } });
    const res = createMockResponse();
    await ossController.deleteFile(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('batchDeleteFiles 应能批量删除文件', async () => {
    const req = createMockRequest({ body: { fileIds: '3,4' } });
    const res = createMockResponse();
    await ossController.batchDeleteFiles(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getStorageStats 应能获取存储统计', async () => {
    const req = createMockRequest({});
    const res = createMockResponse();
    await ossController.getStorageStats(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

describe('PostController 岗位', () => {
  it('list 应返回分页列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await postController.list(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getById 应能获取岗位', async () => {
    const req = createMockRequest({ params: { postId: '1' } });
    const res = createMockResponse();
    await postController.getById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('create 应能创建岗位', async () => {
    const req = createMockRequest({ body: { postCode: 'test_' + Date.now(), postName: '测试岗', postSort: 99, status: '0' } });
    const res = createMockResponse();
    await postController.create(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('update 应能更新岗位', async () => {
    const req = createMockRequest({ params: { postId: '1' }, body: { postCode: 'CEO', postName: '首席执行官', postSort: 1, status: '0' } });
    const res = createMockResponse();
    await postController.update(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('remove 应能删除岗位', async () => {
    const req = createMockRequest({ params: { postId: '2' } });
    const res = createMockResponse();
    await postController.remove(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('batchRemove 应能批量删除岗位', async () => {
    const req = createMockRequest({ body: { postIds: '3,4' } });
    const res = createMockResponse();
    await postController.batchRemove(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getAll 应能获取全部岗位', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await postController.getAll(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});

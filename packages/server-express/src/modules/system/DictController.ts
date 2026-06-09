/**
 * 字典管理控制器
 *
 * @module @yunshu/server-express/modules/system
 */

import type { Request, Response } from 'express';
import type {
  SysDictType,
  SysDictTypeQuery,
  SysDictTypeForm,
  SysDictData,
  SysDictDataQuery,
  SysDictDataForm,
} from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';

/** 模拟字典类型数据 */
const mockDictTypes: SysDictType[] = [
  {
    dictId: 1,
    dictName: '用户性别',
    dictType: 'sys_user_sex',
    status: '0',
    remark: '用户性别列表',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    dictId: 2,
    dictName: '菜单状态',
    dictType: 'sys_menu_status',
    status: '0',
    remark: '菜单状态列表',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    dictId: 3,
    dictName: '岗位状态',
    dictType: 'sys_post_status',
    status: '0',
    remark: '岗位状态列表',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-06-01 10:30:00',
  },
];

/** 模拟字典数据 */
const mockDictData: SysDictData[] = [
  {
    dictCode: 1,
    dictSort: 1,
    dictLabel: '男',
    dictValue: '0',
    dictType: 'sys_user_sex',
    isDefault: '1',
    status: '0',
    remark: '男性',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    dictCode: 2,
    dictSort: 2,
    dictLabel: '女',
    dictValue: '1',
    dictType: 'sys_user_sex',
    isDefault: '0',
    status: '0',
    remark: '女性',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    dictCode: 3,
    dictSort: 1,
    dictLabel: '正常',
    dictValue: '0',
    dictType: 'sys_menu_status',
    isDefault: '1',
    status: '0',
    remark: '正常状态',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    dictCode: 4,
    dictSort: 2,
    dictLabel: '停用',
    dictValue: '1',
    dictType: 'sys_menu_status',
    isDefault: '0',
    status: '0',
    remark: '停用状态',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-06-01 10:30:00',
  },
];

export class DictController extends BaseController {
  // ==================== 字典类型管理 ====================

  /**
   * 获取字典类型分页列表
   */
  async listTypes(req: Request, res: Response): Promise<Response> {
    const params: SysDictTypeQuery = {
      keyword: req.query.keyword as string,
      status: req.query.status as SysDictTypeQuery['status'],
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    };

    let filtered = [...mockDictTypes];

    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(
        d => d.dictName.toLowerCase().includes(kw) || d.dictType.toLowerCase().includes(kw),
      );
    }

    if (params.status) {
      filtered = filtered.filter(d => d.status === params.status);
    }

    const total = filtered.length;
    const start = (params.pageNum - 1) * params.pageSize;
    const end = start + params.pageSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取字典类型详情
   */
  async getTypeById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const dictType = mockDictTypes.find(d => d.dictId === Number(id));

    if (!dictType) {
      return this.notFound(res, '字典类型不存在');
    }

    return this.success(res, dictType);
  }

  /**
   * 获取所有字典类型
   */
  async getAllTypes(req: Request, res: Response): Promise<Response> {
    return this.success(res, mockDictTypes);
  }

  /**
   * 创建字典类型
   */
  async createType(req: Request, res: Response): Promise<Response> {
    const data: SysDictTypeForm = req.body;

    if (!data.dictName || !data.dictType) {
      return this.badRequest(res, '请填写完整的字典类型信息');
    }

    const newDictType: SysDictType = {
      dictId: Math.max(...mockDictTypes.map(d => d.dictId)) + 1,
      dictName: data.dictName,
      dictType: data.dictType,
      status: data.status || '0',
      remark: data.remark || '',
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockDictTypes.push(newDictType);
    return this.created(res, newDictType, '创建成功');
  }

  /**
   * 更新字典类型
   */
  async updateType(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: SysDictTypeForm = req.body;
    const index = mockDictTypes.findIndex(d => d.dictId === Number(id));

    if (index === -1) {
      return this.notFound(res, '字典类型不存在');
    }

    mockDictTypes[index] = {
      ...mockDictTypes[index],
      dictName: data.dictName ?? mockDictTypes[index].dictName,
      dictType: data.dictType ?? mockDictTypes[index].dictType,
      status: data.status ?? mockDictTypes[index].status,
      remark: data.remark ?? mockDictTypes[index].remark,
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    return this.success(res, mockDictTypes[index], '更新成功');
  }

  /**
   * 删除字典类型
   */
  async deleteType(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockDictTypes.findIndex(d => d.dictId === Number(id));

    if (index === -1) {
      return this.notFound(res, '字典类型不存在');
    }

    mockDictTypes.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  // ==================== 字典数据管理 ====================

  /**
   * 获取字典数据分页列表
   */
  async listData(req: Request, res: Response): Promise<Response> {
    const params: SysDictDataQuery = {
      keyword: req.query.keyword as string,
      dictType: req.query.dictType as string,
      status: req.query.status as SysDictDataQuery['status'],
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    };

    let filtered = [...mockDictData];

    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(
        d =>
          d.dictLabel.toLowerCase().includes(kw) ||
          d.dictValue.toLowerCase().includes(kw),
      );
    }

    if (params.dictType) {
      filtered = filtered.filter(d => d.dictType === params.dictType);
    }

    if (params.status) {
      filtered = filtered.filter(d => d.status === params.status);
    }

    const total = filtered.length;
    const start = (params.pageNum - 1) * params.pageSize;
    const end = start + params.pageSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取字典数据详情
   */
  async getDataById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const dictData = mockDictData.find(d => d.dictCode === Number(id));

    if (!dictData) {
      return this.notFound(res, '字典数据不存在');
    }

    return this.success(res, dictData);
  }

  /**
   * 根据字典类型获取字典数据
   */
  async getDataByType(req: Request, res: Response): Promise<Response> {
    const { dictType } = req.params;
    const dataList = mockDictData.filter(d => d.dictType === dictType);

    return this.success(res, dataList);
  }

  /**
   * 创建字典数据
   */
  async createData(req: Request, res: Response): Promise<Response> {
    const data: SysDictDataForm = req.body;

    if (!data.dictLabel || !data.dictValue || !data.dictType) {
      return this.badRequest(res, '请填写完整的字典数据信息');
    }

    const newDictData: SysDictData = {
      dictCode: Math.max(...mockDictData.map(d => d.dictCode)) + 1,
      dictSort: data.dictSort ?? 0,
      dictLabel: data.dictLabel,
      dictValue: data.dictValue,
      dictType: data.dictType,
      cssClass: data.cssClass,
      listClass: data.listClass,
      isDefault: data.isDefault || '0',
      status: data.status || '0',
      remark: data.remark || '',
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockDictData.push(newDictData);
    return this.created(res, newDictData, '创建成功');
  }

  /**
   * 更新字典数据
   */
  async updateData(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: SysDictDataForm = req.body;
    const index = mockDictData.findIndex(d => d.dictCode === Number(id));

    if (index === -1) {
      return this.notFound(res, '字典数据不存在');
    }

    mockDictData[index] = {
      ...mockDictData[index],
      dictSort: data.dictSort ?? mockDictData[index].dictSort,
      dictLabel: data.dictLabel ?? mockDictData[index].dictLabel,
      dictValue: data.dictValue ?? mockDictData[index].dictValue,
      dictType: data.dictType ?? mockDictData[index].dictType,
      cssClass: data.cssClass ?? mockDictData[index].cssClass,
      listClass: data.listClass ?? mockDictData[index].listClass,
      isDefault: data.isDefault ?? mockDictData[index].isDefault,
      status: data.status ?? mockDictData[index].status,
      remark: data.remark ?? mockDictData[index].remark,
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    return this.success(res, mockDictData[index], '更新成功');
  }

  /**
   * 删除字典数据
   */
  async deleteData(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockDictData.findIndex(d => d.dictCode === Number(id));

    if (index === -1) {
      return this.notFound(res, '字典数据不存在');
    }

    mockDictData.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  /**
   * 刷新字典缓存
   */
  async refreshCache(req: Request, res: Response): Promise<Response> {
    return this.success(res, null, '字典缓存刷新成功');
  }

  /**
   * 导出字典数据
   */
  async export(req: Request, res: Response): Promise<Response> {
    return this.success(res, { types: mockDictTypes, data: mockDictData });
  }
}

export const dictController = new DictController();

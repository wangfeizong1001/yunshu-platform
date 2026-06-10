/**
 * 字典管理控制器
 *
 * 提供字典类型（sys_dict_type）和字典数据（sys_dict_data）的完整 CRUD 接口，
 * 以及根据字典类型获取字典数据列表的接口（供前端下拉框使用）。
 *
 * - 字典类型：维护字典的分类，如用户性别、订单状态等
 * - 字典数据：每个字典类型下的具体选项，如男/女、待支付/已支付等
 *
 * @module @yunshu/server-express/modules/system
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import {
  createPaginatedResult,
  normalizePagination,
} from '@yunshu/shared';

// ============================================================================
// 类型定义
// ============================================================================

/** 字典类型 */
interface SysDictType {
  dictId: number;
  dictName: string;
  dictType: string;
  status: '0' | '1';
  remark: string;
  createdAt: string;
  updatedAt: string;
}

/** 字典数据 */
interface SysDictData {
  dictCode: number;
  dictSort: number;
  dictLabel: string;
  dictValue: string;
  dictType: string;
  cssClass: string;
  listClass: string;
  isDefault: 'Y' | 'N';
  status: '0' | '1';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Mock 数据
// ============================================================================

let dictTypeIdSeed = 3;
let dictDataCodeSeed = 6;

const dictTypes: SysDictType[] = [
  {
    dictId: 1,
    dictName: '用户性别',
    dictType: 'sys_user_sex',
    status: '0',
    remark: '用户性别列表',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    dictId: 2,
    dictName: '菜单状态',
    dictType: 'sys_show_hide',
    status: '0',
    remark: '菜单状态列表',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    dictId: 3,
    dictName: '系统开关',
    dictType: 'sys_normal_disable',
    status: '0',
    remark: '系统开关列表',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
];

const dictDatas: SysDictData[] = [
  { dictCode: 1, dictSort: 1, dictLabel: '男', dictValue: '0', dictType: 'sys_user_sex', cssClass: '', listClass: 'primary', isDefault: 'Y', status: '0', createdAt: '2024-01-01 10:00:00', updatedAt: '2024-01-01 10:00:00' },
  { dictCode: 2, dictSort: 2, dictLabel: '女', dictValue: '1', dictType: 'sys_user_sex', cssClass: '', listClass: 'success', isDefault: 'N', status: '0', createdAt: '2024-01-01 10:00:00', updatedAt: '2024-01-01 10:00:00' },
  { dictCode: 3, dictSort: 1, dictLabel: '显示', dictValue: '0', dictType: 'sys_show_hide', cssClass: '', listClass: 'primary', isDefault: 'Y', status: '0', createdAt: '2024-01-01 10:00:00', updatedAt: '2024-01-01 10:00:00' },
  { dictCode: 4, dictSort: 2, dictLabel: '隐藏', dictValue: '1', dictType: 'sys_show_hide', cssClass: '', listClass: 'danger', isDefault: 'N', status: '0', createdAt: '2024-01-01 10:00:00', updatedAt: '2024-01-01 10:00:00' },
  { dictCode: 5, dictSort: 1, dictLabel: '正常', dictValue: '0', dictType: 'sys_normal_disable', cssClass: '', listClass: 'primary', isDefault: 'Y', status: '0', createdAt: '2024-01-01 10:00:00', updatedAt: '2024-01-01 10:00:00' },
  { dictCode: 6, dictSort: 2, dictLabel: '停用', dictValue: '1', dictType: 'sys_normal_disable', cssClass: '', listClass: 'danger', isDefault: 'N', status: '0', createdAt: '2024-01-01 10:00:00', updatedAt: '2024-01-01 10:00:00' },
];

// ============================================================================
// DictController
// ============================================================================

/**
 * 字典管理控制器
 */
export class DictController extends BaseController {
  // ========================================================================
  // 字典类型接口
  // ========================================================================

  /**
   * 字典类型分页查询
   *
   * @param req - 请求对象，query 支持 dictName、dictType、status 过滤
   * @param res - 响应对象
   */
  async getTypeList(req: Request, res: Response) {
    try {
      const { page, limit } = normalizePagination(req.query);
      const { dictName, dictType, status } = req.query;

      let filtered = [...dictTypes];
      if (dictName) filtered = filtered.filter(i => i.dictName.includes(String(dictName)));
      if (dictType) filtered = filtered.filter(i => i.dictType.includes(String(dictType)));
      if (status) filtered = filtered.filter(i => i.status === status);

      const total = filtered.length;
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 字典类型详情
   */
  async getTypeDetail(req: Request, res: Response) {
    try {
      const dictId = Number(req.params.dictId);
      const item = dictTypes.find(i => i.dictId === dictId);
      if (!item) return this.notFound(res, '字典类型不存在');
      return this.success(res, item, '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 创建字典类型
   */
  async createType(req: Request, res: Response) {
    try {
      const { dictName, dictType, status = '0', remark = '' } = req.body;
      if (!dictName || !dictType) return this.badRequest(res, '字典名称和字典类型不能为空');
      if (dictTypes.some(i => i.dictType === dictType)) return this.conflict(res, '字典类型已存在');

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const item: SysDictType = {
        dictId: ++dictTypeIdSeed,
        dictName,
        dictType,
        status,
        remark,
        createdAt: now,
        updatedAt: now,
      };
      dictTypes.push(item);
      return this.success(res, item, '创建成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 更新字典类型
   */
  async updateType(req: Request, res: Response) {
    try {
      const dictId = Number(req.params.dictId);
      const idx = dictTypes.findIndex(i => i.dictId === dictId);
      if (idx === -1) return this.notFound(res, '字典类型不存在');

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      dictTypes[idx] = { ...dictTypes[idx], ...req.body, dictId, updatedAt: now };
      return this.success(res, dictTypes[idx], '更新成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 删除字典类型
   */
  async removeType(req: Request, res: Response) {
    try {
      const dictId = Number(req.params.dictId);
      const idx = dictTypes.findIndex(i => i.dictId === dictId);
      if (idx === -1) return this.notFound(res, '字典类型不存在');
      const removed = dictTypes.splice(idx, 1)[0];
      return this.success(res, removed, '删除成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  // ========================================================================
  // 字典数据接口
  // ========================================================================

  /**
   * 字典数据分页查询（支持 dictType 过滤）
   */
  async getDataList(req: Request, res: Response) {
    try {
      const { page, limit } = normalizePagination(req.query);
      const { dictType, dictLabel, status } = req.query;

      let filtered = [...dictDatas];
      if (dictType) filtered = filtered.filter(i => i.dictType === dictType);
      if (dictLabel) filtered = filtered.filter(i => i.dictLabel.includes(String(dictLabel)));
      if (status) filtered = filtered.filter(i => i.status === status);

      filtered.sort((a, b) => a.dictSort - b.dictSort);
      const total = filtered.length;
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 字典数据详情
   */
  async getDataDetail(req: Request, res: Response) {
    try {
      const dictCode = Number(req.params.dictCode);
      const item = dictDatas.find(i => i.dictCode === dictCode);
      if (!item) return this.notFound(res, '字典数据不存在');
      return this.success(res, item, '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 创建字典数据
   */
  async createData(req: Request, res: Response) {
    try {
      const {
        dictSort = 0,
        dictLabel,
        dictValue,
        dictType,
        cssClass = '',
        listClass = '',
        isDefault = 'N',
        status = '0',
      } = req.body;

      if (!dictLabel || !dictValue || !dictType) {
        return this.badRequest(res, '字典标签、字典键值和字典类型不能为空');
      }

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const item: SysDictData = {
        dictCode: ++dictDataCodeSeed,
        dictSort,
        dictLabel,
        dictValue,
        dictType,
        cssClass,
        listClass,
        isDefault,
        status,
        createdAt: now,
        updatedAt: now,
      };
      dictDatas.push(item);
      return this.success(res, item, '创建成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 更新字典数据
   */
  async updateData(req: Request, res: Response) {
    try {
      const dictCode = Number(req.params.dictCode);
      const idx = dictDatas.findIndex(i => i.dictCode === dictCode);
      if (idx === -1) return this.notFound(res, '字典数据不存在');

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      dictDatas[idx] = { ...dictDatas[idx], ...req.body, dictCode, updatedAt: now };
      return this.success(res, dictDatas[idx], '更新成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 删除字典数据
   */
  async removeData(req: Request, res: Response) {
    try {
      const dictCode = Number(req.params.dictCode);
      const idx = dictDatas.findIndex(i => i.dictCode === dictCode);
      if (idx === -1) return this.notFound(res, '字典数据不存在');
      const removed = dictDatas.splice(idx, 1)[0];
      return this.success(res, removed, '删除成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 根据 dictType 获取字典数据列表（不分页，前端下拉使用）
   */
  async getDatasByType(req: Request, res: Response) {
    try {
      const { dictType } = req.params;
      const data = dictDatas
        .filter(i => i.dictType === dictType && i.status === '0')
        .sort((a, b) => a.dictSort - b.dictSort);
      return this.success(res, data, '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }
}

export const dictController = new DictController();

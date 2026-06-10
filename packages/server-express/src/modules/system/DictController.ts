/**
 * 字典管理控制器
 *
 * 提供字典类型（sys_dict_type）和字典数据（sys_dict_data）的完整 CRUD 接口，
 * 以及根据字典类型获取字典数据列表的接口（供前端下拉框使用）。
 *
 * @module @yunshu/server-express/modules/system
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import { createPaginatedResult, normalizePagination, isValidStringLength } from '@yunshu/shared';

const MAX_BATCH_SIZE = 100;
const MAX_QUERY_PARAM_LENGTH = 100;
const DICT_TYPE_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{1,99}$/;

// ============================================================================
// 类型定义
// ============================================================================

interface SysDictType {
  dictId: number;
  dictName: string;
  dictType: string;
  status: '0' | '1';
  remark: string;
  createdAt: string;
  updatedAt: string;
}

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
  {
    dictCode: 1,
    dictSort: 1,
    dictLabel: '男',
    dictValue: '0',
    dictType: 'sys_user_sex',
    cssClass: '',
    listClass: 'primary',
    isDefault: 'Y',
    status: '0',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    dictCode: 2,
    dictSort: 2,
    dictLabel: '女',
    dictValue: '1',
    dictType: 'sys_user_sex',
    cssClass: '',
    listClass: 'success',
    isDefault: 'N',
    status: '0',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    dictCode: 3,
    dictSort: 1,
    dictLabel: '显示',
    dictValue: '0',
    dictType: 'sys_show_hide',
    cssClass: '',
    listClass: 'primary',
    isDefault: 'Y',
    status: '0',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    dictCode: 4,
    dictSort: 2,
    dictLabel: '隐藏',
    dictValue: '1',
    dictType: 'sys_show_hide',
    cssClass: '',
    listClass: 'danger',
    isDefault: 'N',
    status: '0',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    dictCode: 5,
    dictSort: 1,
    dictLabel: '正常',
    dictValue: '0',
    dictType: 'sys_normal_disable',
    cssClass: '',
    listClass: 'primary',
    isDefault: 'Y',
    status: '0',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    dictCode: 6,
    dictSort: 2,
    dictLabel: '停用',
    dictValue: '1',
    dictType: 'sys_normal_disable',
    cssClass: '',
    listClass: 'danger',
    isDefault: 'N',
    status: '0',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
];

// ============================================================================
// DictController
// ============================================================================

export class DictController extends BaseController {
  private extractQueryParam(value: unknown, max = MAX_QUERY_PARAM_LENGTH): string | undefined {
    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' && first.length > 0 && first.length <= max
        ? first
        : undefined;
    }
    return typeof value === 'string' && value.length > 0 && value.length <= max ? value : undefined;
  }

  // ========================================================================
  // 字典类型接口
  // ========================================================================

  async getTypeList(req: Request, res: Response) {
    const { page, limit } = normalizePagination(req.query);
    const dictName = this.extractQueryParam(req.query.dictName);
    const dictType = this.extractQueryParam(req.query.dictType);
    const statusRaw = this.extractQueryParam(req.query.status, 1);
    const status = statusRaw === '0' || statusRaw === '1' ? statusRaw : undefined;

    let filtered = [...dictTypes];
    if (dictName) filtered = filtered.filter((i) => i.dictName.includes(dictName));
    if (dictType) filtered = filtered.filter((i) => i.dictType.includes(dictType));
    if (status) filtered = filtered.filter((i) => i.status === status);

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
  }

  async getTypeDetail(req: Request, res: Response) {
    const dictId = Number(req.params.dictId);
    if (!Number.isFinite(dictId)) {
      return this.badRequest(res, 'dictId 格式错误');
    }
    const item = dictTypes.find((i) => i.dictId === dictId);
    if (!item) return this.notFound(res, '字典类型不存在');
    return this.success(res, item, '查询成功');
  }

  async createType(req: Request, res: Response) {
    const bodyErr = this.validateRequestBody(req.body, ['dictName', 'dictType'], {
      dictName: 100,
      dictType: 100,
      remark: 500,
    });
    if (bodyErr) return this.badRequest(res, bodyErr);

    const body = req.body as Record<string, unknown>;
    const dictName = String(body.dictName).trim();
    const dictType = String(body.dictType).trim();

    if (!isValidStringLength(dictName, 2, 100)) {
      return this.badRequest(res, 'dictName 长度需在 2-100 字符之间');
    }
    if (!DICT_TYPE_REGEX.test(dictType)) {
      return this.badRequest(res, 'dictType 必须以字母开头，包含字母数字下划线，长度 2-100');
    }

    const statusRaw = body.status !== undefined ? String(body.status) : '0';
    const status: '0' | '1' = statusRaw === '0' || statusRaw === '1' ? statusRaw : '0';

    if (dictTypes.some((i) => i.dictType === dictType)) {
      return this.conflict(res, '字典类型已存在');
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const item: SysDictType = {
      dictId: ++dictTypeIdSeed,
      dictName,
      dictType,
      status,
      remark: body.remark !== undefined ? String(body.remark) : '',
      createdAt: now,
      updatedAt: now,
    };
    dictTypes.push(item);
    return this.success(res, item, '创建成功');
  }

  async updateType(req: Request, res: Response) {
    const dictId = Number(req.params.dictId);
    if (!Number.isFinite(dictId)) {
      return this.badRequest(res, 'dictId 格式错误');
    }
    const idx = dictTypes.findIndex((i) => i.dictId === dictId);
    if (idx === -1) return this.notFound(res, '字典类型不存在');

    const exist = dictTypes[idx]!;
    const body = req.body as Record<string, unknown>;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const updated: SysDictType = {
      dictId: exist.dictId,
      dictName: exist.dictName,
      dictType: exist.dictType,
      status: exist.status,
      remark: exist.remark,
      createdAt: exist.createdAt,
      updatedAt: now,
    };

    if (body.dictName !== undefined) {
      const v = String(body.dictName).trim();
      if (!isValidStringLength(v, 2, 100)) {
        return this.badRequest(res, 'dictName 长度需在 2-100 字符之间');
      }
      updated.dictName = v;
    }
    if (body.dictType !== undefined) {
      const v = String(body.dictType).trim();
      if (!DICT_TYPE_REGEX.test(v)) {
        return this.badRequest(res, 'dictType 必须以字母开头，包含字母数字下划线，长度 2-100');
      }
      if (dictTypes.some((d, i) => i !== idx && d.dictType === v)) {
        return this.conflict(res, '字典类型已存在');
      }
      // 同步更新 dictDatas 中引用此类型的数据
      const oldType = exist.dictType;
      if (oldType !== v) {
        for (const d of dictDatas) {
          if (d.dictType === oldType) d.dictType = v;
        }
      }
      updated.dictType = v;
    }
    if (body.status !== undefined) {
      const v = String(body.status);
      if (v === '0' || v === '1') updated.status = v;
    }
    if (body.remark !== undefined) updated.remark = String(body.remark);

    dictTypes[idx] = updated;
    return this.success(res, updated, '更新成功');
  }

  async removeType(req: Request, res: Response) {
    const dictId = Number(req.params.dictId);
    if (!Number.isFinite(dictId)) {
      return this.badRequest(res, 'dictId 格式错误');
    }
    const idx = dictTypes.findIndex((i) => i.dictId === dictId);
    if (idx === -1) return this.notFound(res, '字典类型不存在');

    const target = dictTypes[idx]!;
    if (target.dictType.startsWith('sys_')) {
      return this.forbidden(res, '不能删除系统级字典类型');
    }

    const removed = dictTypes.splice(idx, 1)[0]!;
    // 清理关联字典数据
    for (let i = dictDatas.length - 1; i >= 0; i--) {
      if (dictDatas[i]!.dictType === removed.dictType) {
        dictDatas.splice(i, 1);
      }
    }
    return this.success(res, removed, '删除成功');
  }

  // ========================================================================
  // 字典数据接口
  // ========================================================================

  async getDataList(req: Request, res: Response) {
    const { page, limit } = normalizePagination(req.query);
    const dictType = this.extractQueryParam(req.query.dictType);
    const dictLabel = this.extractQueryParam(req.query.dictLabel);
    const statusRaw = this.extractQueryParam(req.query.status, 1);
    const status = statusRaw === '0' || statusRaw === '1' ? statusRaw : undefined;

    let filtered = [...dictDatas];
    if (dictType) filtered = filtered.filter((i) => i.dictType === dictType);
    if (dictLabel) filtered = filtered.filter((i) => i.dictLabel.includes(dictLabel));
    if (status) filtered = filtered.filter((i) => i.status === status);

    filtered.sort((a, b) => a.dictSort - b.dictSort);
    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
  }

  async getDataDetail(req: Request, res: Response) {
    const dictCode = Number(req.params.dictCode);
    if (!Number.isFinite(dictCode)) {
      return this.badRequest(res, 'dictCode 格式错误');
    }
    const item = dictDatas.find((i) => i.dictCode === dictCode);
    if (!item) return this.notFound(res, '字典数据不存在');
    return this.success(res, item, '查询成功');
  }

  async createData(req: Request, res: Response) {
    const bodyErr = this.validateRequestBody(req.body, ['dictLabel', 'dictValue', 'dictType'], {
      dictLabel: 100,
      dictValue: 100,
      dictType: 100,
      cssClass: 100,
      listClass: 100,
      remark: 500,
    });
    if (bodyErr) return this.badRequest(res, bodyErr);

    const body = req.body as Record<string, unknown>;
    const dictLabel = String(body.dictLabel).trim();
    const dictValue = String(body.dictValue).trim();
    const dictType = String(body.dictType).trim();

    if (!isValidStringLength(dictLabel, 1, 100)) {
      return this.badRequest(res, 'dictLabel 长度需在 1-100 字符之间');
    }
    if (!isValidStringLength(dictValue, 1, 100)) {
      return this.badRequest(res, 'dictValue 长度需在 1-100 字符之间');
    }
    if (!DICT_TYPE_REGEX.test(dictType)) {
      return this.badRequest(res, 'dictType 必须以字母开头，包含字母数字下划线，长度 2-100');
    }

    const statusRaw = body.status !== undefined ? String(body.status) : '0';
    const status: '0' | '1' = statusRaw === '0' || statusRaw === '1' ? statusRaw : '0';
    const isDefaultRaw = body.isDefault !== undefined ? String(body.isDefault) : 'N';
    const isDefault: 'Y' | 'N' = isDefaultRaw === 'Y' || isDefaultRaw === 'N' ? isDefaultRaw : 'N';

    let dictSort = 0;
    if (body.dictSort !== undefined) {
      const n = Number(body.dictSort);
      if (Number.isFinite(n)) dictSort = n;
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const item: SysDictData = {
      dictCode: ++dictDataCodeSeed,
      dictSort,
      dictLabel,
      dictValue,
      dictType,
      cssClass: body.cssClass !== undefined ? String(body.cssClass) : '',
      listClass: body.listClass !== undefined ? String(body.listClass) : '',
      isDefault,
      status,
      createdAt: now,
      updatedAt: now,
    };
    dictDatas.push(item);
    return this.success(res, item, '创建成功');
  }

  async updateData(req: Request, res: Response) {
    const dictCode = Number(req.params.dictCode);
    if (!Number.isFinite(dictCode)) {
      return this.badRequest(res, 'dictCode 格式错误');
    }
    const idx = dictDatas.findIndex((i) => i.dictCode === dictCode);
    if (idx === -1) return this.notFound(res, '字典数据不存在');

    const exist = dictDatas[idx]!;
    const body = req.body as Record<string, unknown>;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const updated: SysDictData = {
      dictCode: exist.dictCode,
      dictSort: exist.dictSort,
      dictLabel: exist.dictLabel,
      dictValue: exist.dictValue,
      dictType: exist.dictType,
      cssClass: exist.cssClass,
      listClass: exist.listClass,
      isDefault: exist.isDefault,
      status: exist.status,
      createdAt: exist.createdAt,
      updatedAt: now,
    };

    if (body.dictSort !== undefined) {
      const n = Number(body.dictSort);
      if (Number.isFinite(n)) updated.dictSort = n;
    }
    if (body.dictLabel !== undefined) {
      const v = String(body.dictLabel).trim();
      if (!isValidStringLength(v, 1, 100)) {
        return this.badRequest(res, 'dictLabel 长度需在 1-100 字符之间');
      }
      updated.dictLabel = v;
    }
    if (body.dictValue !== undefined) {
      const v = String(body.dictValue).trim();
      if (!isValidStringLength(v, 1, 100)) {
        return this.badRequest(res, 'dictValue 长度需在 1-100 字符之间');
      }
      updated.dictValue = v;
    }
    if (body.dictType !== undefined) {
      const v = String(body.dictType).trim();
      if (!DICT_TYPE_REGEX.test(v)) {
        return this.badRequest(res, 'dictType 必须以字母开头，包含字母数字下划线，长度 2-100');
      }
      updated.dictType = v;
    }
    if (body.cssClass !== undefined) updated.cssClass = String(body.cssClass);
    if (body.listClass !== undefined) updated.listClass = String(body.listClass);
    if (body.isDefault !== undefined) {
      const v = String(body.isDefault);
      if (v === 'Y' || v === 'N') updated.isDefault = v;
    }
    if (body.status !== undefined) {
      const v = String(body.status);
      if (v === '0' || v === '1') updated.status = v;
    }

    dictDatas[idx] = updated;
    return this.success(res, updated, '更新成功');
  }

  async removeData(req: Request, res: Response) {
    const dictCode = Number(req.params.dictCode);
    if (!Number.isFinite(dictCode)) {
      return this.badRequest(res, 'dictCode 格式错误');
    }
    const idx = dictDatas.findIndex((i) => i.dictCode === dictCode);
    if (idx === -1) return this.notFound(res, '字典数据不存在');
    const removed = dictDatas.splice(idx, 1)[0];
    return this.success(res, removed, '删除成功');
  }

  async getDatasByType(req: Request, res: Response) {
    const dictType = this.safeParam(req.params.dictType, 100);
    if (!dictType) return this.badRequest(res, 'dictType 格式错误');
    const data = dictDatas
      .filter((i) => i.dictType === dictType && i.status === '0')
      .sort((a, b) => a.dictSort - b.dictSort);
    return this.success(res, data, '查询成功');
  }
}

export const dictController = new DictController();

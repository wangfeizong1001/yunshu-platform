/**
 * 参数配置控制器
 *
 * 提供系统参数配置的完整 CRUD 接口，包括分页查询、根据键值查询、批量删除和缓存刷新。
 *
 * @module @yunshu/server-express/modules/system
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import {
  createPaginatedResult,
  normalizePagination,
  isValidStringLength,
} from '@yunshu/shared';

const MAX_BATCH_SIZE = 100;
const MAX_QUERY_PARAM_LENGTH = 100;
const CONFIG_KEY_REGEX = /^[a-zA-Z][a-zA-Z0-9_.]{1,99}$/;

// ============================================================================
// 类型定义
// ============================================================================

interface SysConfig {
  configId: number;
  configName: string;
  configKey: string;
  configValue: string;
  configType: 'Y' | 'N';
  remark: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Mock 数据
// ============================================================================

let configIdSeed = 4;

const configs: SysConfig[] = [
  {
    configId: 1,
    configName: '主框架页-默认皮肤样式',
    configKey: 'sys.index.skinName',
    configValue: 'skin-blue',
    configType: 'Y',
    remark: '默认皮肤样式',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    configId: 2,
    configName: '账号初始密码',
    configKey: 'sys.user.initPassword',
    configValue: '123456',
    configType: 'Y',
    remark: '新用户初始密码',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    configId: 3,
    configName: '用户管理-账号初始状态',
    configKey: 'sys.user.status',
    configValue: '0',
    configType: 'Y',
    remark: '0正常 1停用',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    configId: 4,
    configName: '系统名称',
    configKey: 'sys.system.name',
    configValue: '云枢中台',
    configType: 'N',
    remark: '系统显示名称',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
];

// ============================================================================
// ConfigController
// ============================================================================

export class ConfigController extends BaseController {
  private extractQueryParam(value: unknown, max = MAX_QUERY_PARAM_LENGTH): string | undefined {
    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' && first.length > 0 && first.length <= max
        ? first
        : undefined;
    }
    return typeof value === 'string' && value.length > 0 && value.length <= max
      ? value
      : undefined;
  }

  async list(req: Request, res: Response) {
    const { page, limit } = normalizePagination(req.query);
    const configName = this.extractQueryParam(req.query.configName);
    const configKey = this.extractQueryParam(req.query.configKey);
    const configTypeRaw = this.extractQueryParam(req.query.configType, 1);
    const configType = (configTypeRaw === 'Y' || configTypeRaw === 'N') ? configTypeRaw : undefined;

    let filtered = [...configs];
    if (configName) filtered = filtered.filter(i => i.configName.includes(configName));
    if (configKey) filtered = filtered.filter(i => i.configKey.includes(configKey));
    if (configType) filtered = filtered.filter(i => i.configType === configType);

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
  }

  async getById(req: Request, res: Response) {
    const configId = Number(req.params.configId);
    if (!Number.isFinite(configId)) {
      return this.badRequest(res, 'configId 格式错误');
    }
    const item = configs.find(i => i.configId === configId);
    if (!item) return this.notFound(res, '参数配置不存在');
    return this.success(res, item, '查询成功');
  }

  async getByKey(req: Request, res: Response) {
    const configKey = this.safeParam(req.params.configKey, 100);
    if (!configKey) return this.badRequest(res, 'configKey 格式错误');
    const item = configs.find(i => i.configKey === configKey);
    if (!item) return this.notFound(res, '参数配置不存在');
    return this.success(res, item, '查询成功');
  }

  async create(req: Request, res: Response) {
    const bodyErr = this.validateRequestBody(req.body, ['configName', 'configKey', 'configValue'], {
      configName: 100,
      configKey: 100,
      configValue: 500,
      remark: 500,
    });
    if (bodyErr) return this.badRequest(res, bodyErr);

    const body = req.body as Record<string, unknown>;
    const configName = String(body.configName).trim();
    const configKey = String(body.configKey).trim();
    const configValue = String(body.configValue);

    if (!isValidStringLength(configName, 2, 100)) {
      return this.badRequest(res, 'configName 长度需在 2-100 字符之间');
    }
    if (!CONFIG_KEY_REGEX.test(configKey)) {
      return this.badRequest(res, 'configKey 必须以字母开头，包含字母数字下划线点，长度 2-100');
    }
    if (!isValidStringLength(configValue, 1, 500)) {
      return this.badRequest(res, 'configValue 长度需在 1-500 字符之间');
    }

    const configTypeRaw = body.configType !== undefined ? String(body.configType) : 'N';
    const configType: 'Y' | 'N' = (configTypeRaw === 'Y' || configTypeRaw === 'N') ? configTypeRaw : 'N';

    // 系统关键配置的弱密码校验
    if (configKey.startsWith('sys.') && configKey.toLowerCase().includes('password')) {
      if (configValue.length < 8) {
        return this.badRequest(res, '系统密码类配置值长度不能小于 8 位');
      }
    }

    if (configs.some(i => i.configKey === configKey)) {
      return this.conflict(res, '参数键名已存在');
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const item: SysConfig = {
      configId: ++configIdSeed,
      configName,
      configKey,
      configValue,
      configType,
      remark: body.remark !== undefined ? String(body.remark) : '',
      createdAt: now,
      updatedAt: now,
    };
    configs.push(item);
    return this.success(res, item, '创建成功');
  }

  async update(req: Request, res: Response) {
    const configId = Number(req.params.configId);
    if (!Number.isFinite(configId)) {
      return this.badRequest(res, 'configId 格式错误');
    }

    const idx = configs.findIndex(i => i.configId === configId);
    if (idx === -1) return this.notFound(res, '参数配置不存在');

    const exist = configs[idx]!;
    const body = req.body as Record<string, unknown>;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const updated: SysConfig = {
      configId: exist.configId,
      configName: exist.configName,
      configKey: exist.configKey,
      configValue: exist.configValue,
      configType: exist.configType,
      remark: exist.remark,
      createdAt: exist.createdAt,
      updatedAt: now,
    };

    if (body.configName !== undefined) {
      const v = String(body.configName).trim();
      if (!isValidStringLength(v, 2, 100)) {
        return this.badRequest(res, 'configName 长度需在 2-100 字符之间');
      }
      updated.configName = v;
    }
    if (body.configKey !== undefined) {
      const v = String(body.configKey).trim();
      if (!CONFIG_KEY_REGEX.test(v)) {
        return this.badRequest(res, 'configKey 必须以字母开头，包含字母数字下划线点，长度 2-100');
      }
      // 唯一性检查（排除自身）
      if (configs.some((c, i) => i !== idx && c.configKey === v)) {
        return this.conflict(res, '参数键名已存在');
      }
      updated.configKey = v;
    }
    if (body.configValue !== undefined) {
      const v = String(body.configValue);
      if (!isValidStringLength(v, 1, 500)) {
        return this.badRequest(res, 'configValue 长度需在 1-500 字符之间');
      }
      // 系统关键配置的弱密码校验
      const checkKey = updated.configKey;
      if (checkKey.startsWith('sys.') && checkKey.toLowerCase().includes('password')) {
        if (v.length < 8) {
          return this.badRequest(res, '系统密码类配置值长度不能小于 8 位');
        }
      }
      updated.configValue = v;
    }
    if (body.configType !== undefined) {
      const v = String(body.configType);
      if (v === 'Y' || v === 'N') updated.configType = v;
    }
    if (body.remark !== undefined) updated.remark = String(body.remark);

    configs[idx] = updated;
    return this.success(res, updated, '更新成功');
  }

  async remove(req: Request, res: Response) {
    const configId = Number(req.params.configId);
    if (!Number.isFinite(configId)) {
      return this.badRequest(res, 'configId 格式错误');
    }
    const idx = configs.findIndex(i => i.configId === configId);
    if (idx === -1) return this.notFound(res, '参数配置不存在');
    const removed = configs.splice(idx, 1)[0];
    return this.success(res, removed, '删除成功');
  }

  async batchRemove(req: Request, res: Response) {
    const body = req.body as Record<string, unknown>;
    const configIdsRaw = body.configIds;
    if (!Array.isArray(configIdsRaw)) {
      return this.badRequest(res, 'configIds 必须为数组');
    }

    const batchErr = this.validateBatchSize(configIdsRaw, MAX_BATCH_SIZE);
    if (batchErr) return this.badRequest(res, batchErr);

    const validIds: number[] = [];
    for (const id of configIdsRaw) {
      const n = Number(id);
      if (Number.isFinite(n)) validIds.push(n);
    }
    if (validIds.length === 0) return this.badRequest(res, 'configIds 中无有效 ID');

    const removed: SysConfig[] = [];
    for (const id of validIds) {
      const idx = configs.findIndex(i => i.configId === id);
      if (idx !== -1) {
        const item = configs.splice(idx, 1)[0];
        if (item) removed.push(item);
      }
    }

    return this.success(res, { removed, count: removed.length }, `批量删除成功，共删除 ${removed.length} 条`);
  }

  async refreshCache(req: Request, res: Response) {
    return this.success(res, { refreshed: true }, '缓存刷新成功');
  }
}

export const configController = new ConfigController();

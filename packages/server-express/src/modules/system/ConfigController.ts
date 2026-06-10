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
} from '@yunshu/shared';

// ============================================================================
// 类型定义
// ============================================================================

/** 参数配置 */
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

/**
 * 参数配置控制器
 */
export class ConfigController extends BaseController {
  /**
   * 参数配置分页查询
   *
   * @param req - 请求对象，query 支持 configName、configKey、configType 过滤
   */
  async list(req: Request, res: Response) {
    try {
      const { page, limit } = normalizePagination(req.query);
      const { configName, configKey, configType } = req.query;

      let filtered = [...configs];
      if (configName) filtered = filtered.filter(i => i.configName.includes(String(configName)));
      if (configKey) filtered = filtered.filter(i => i.configKey.includes(String(configKey)));
      if (configType) filtered = filtered.filter(i => i.configType === configType);

      const total = filtered.length;
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 根据 configId 查询详情
   */
  async getById(req: Request, res: Response) {
    try {
      const configId = Number(req.params.configId);
      const item = configs.find(i => i.configId === configId);
      if (!item) return this.notFound(res, '参数配置不存在');
      return this.success(res, item, '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 根据 configKey 查询详情
   */
  async getByKey(req: Request, res: Response) {
    try {
      const { configKey } = req.params;
      const item = configs.find(i => i.configKey === configKey);
      if (!item) return this.notFound(res, '参数配置不存在');
      return this.success(res, item, '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 创建参数配置
   */
  async create(req: Request, res: Response) {
    try {
      const { configName, configKey, configValue, configType = 'N', remark = '' } = req.body;
      if (!configName || !configKey || !configValue) {
        return this.badRequest(res, '参数名称、参数键名和参数键值不能为空');
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
        remark,
        createdAt: now,
        updatedAt: now,
      };
      configs.push(item);
      return this.success(res, item, '创建成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 更新参数配置
   */
  async update(req: Request, res: Response) {
    try {
      const configId = Number(req.params.configId);
      const idx = configs.findIndex(i => i.configId === configId);
      if (idx === -1) return this.notFound(res, '参数配置不存在');

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      configs[idx] = { ...configs[idx], ...req.body, configId, updatedAt: now };
      return this.success(res, configs[idx], '更新成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 删除参数配置
   */
  async remove(req: Request, res: Response) {
    try {
      const configId = Number(req.params.configId);
      const idx = configs.findIndex(i => i.configId === configId);
      if (idx === -1) return this.notFound(res, '参数配置不存在');
      const removed = configs.splice(idx, 1)[0];
      return this.success(res, removed, '删除成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 批量删除参数配置
   *
   * @param req - body: { configIds: number[] }
   */
  async batchRemove(req: Request, res: Response) {
    try {
      const { configIds } = req.body;
      if (!Array.isArray(configIds) || configIds.length === 0) {
        return this.badRequest(res, '请选择要删除的参数');
      }

      const removed: SysConfig[] = [];
      configIds.forEach((id: number) => {
        const idx = configs.findIndex(i => i.configId === id);
        if (idx !== -1) {
          const item = configs.splice(idx, 1)[0];
          if (item) removed.push(item);
        }
      });

      return this.success(res, { removed, count: removed.length }, `批量删除成功，共删除 ${removed.length} 条`);
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 刷新缓存
   *
   * @remarks
   * 简化实现，仅返回成功提示。实际生产环境应调用缓存清除逻辑。
   */
  async refreshCache(req: Request, res: Response) {
    try {
      return this.success(res, { refreshed: true }, '缓存刷新成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }
}

export const configController = new ConfigController();

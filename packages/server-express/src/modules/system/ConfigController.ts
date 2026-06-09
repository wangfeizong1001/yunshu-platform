/**
 * 参数配置控制器
 *
 * @module @yunshu/server-express/modules/system
 */

import type { Request, Response } from 'express';
import type { SysConfigQuery, SysConfigForm, SysConfig } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';

/** 模拟参数配置数据 */
const mockConfigs: SysConfig[] = [
  {
    configId: 1,
    configName: '系统名称',
    configKey: 'sys.index.sitename',
    configValue: '云枢中台',
    configType: 'Y',
    remark: '系统显示名称',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    configId: 2,
    configName: '系统Logo',
    configKey: 'sys.index.logo',
    configValue: '/logo.png',
    configType: 'Y',
    remark: '系统Logo路径',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    configId: 3,
    configName: '用户注册',
    configKey: 'sys.user.register',
    configValue: 'true',
    configType: 'N',
    remark: '是否允许用户注册',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-06-01 10:30:00',
  },
];

export class ConfigController extends BaseController {
  /**
   * 获取参数配置分页列表
   */
  async list(req: Request, res: Response): Promise<Response> {
    const params: SysConfigQuery = {
      keyword: req.query.keyword as string,
      configType: req.query.configType as SysConfigQuery['configType'],
      status: req.query.status as SysConfigQuery['status'],
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    };

    let filtered = [...mockConfigs];

    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.configName.toLowerCase().includes(kw) ||
          c.configKey.toLowerCase().includes(kw),
      );
    }

    if (params.configType) {
      filtered = filtered.filter(c => c.configType === params.configType);
    }

    if (params.status) {
      filtered = filtered.filter(c => c.configType === params.status);
    }

    const total = filtered.length;
    const start = (params.pageNum - 1) * params.pageSize;
    const end = start + params.pageSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取参数配置详情
   */
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const config = mockConfigs.find(c => c.configId === Number(id));

    if (!config) {
      return this.notFound(res, '参数配置不存在');
    }

    return this.success(res, config);
  }

  /**
   * 根据参数键名获取参数值
   */
  async getByKey(req: Request, res: Response): Promise<Response> {
    const { configKey } = req.params;
    const config = mockConfigs.find(c => c.configKey === configKey);

    if (!config) {
      return this.notFound(res, '参数配置不存在');
    }

    return this.success(res, config);
  }

  /**
   * 创建参数配置
   */
  async create(req: Request, res: Response): Promise<Response> {
    const data: SysConfigForm = req.body;

    if (!data.configName || !data.configKey || !data.configValue) {
      return this.badRequest(res, '请填写完整的参数信息');
    }

    const newConfig: SysConfig = {
      configId: Math.max(...mockConfigs.map(c => c.configId)) + 1,
      configName: data.configName,
      configKey: data.configKey,
      configValue: data.configValue,
      configType: data.configType || 'N',
      remark: data.remark || '',
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockConfigs.push(newConfig);
    return this.created(res, newConfig, '创建成功');
  }

  /**
   * 更新参数配置
   */
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: SysConfigForm = req.body;
    const index = mockConfigs.findIndex(c => c.configId === Number(id));

    if (index === -1) {
      return this.notFound(res, '参数配置不存在');
    }

    mockConfigs[index] = {
      ...mockConfigs[index],
      configName: data.configName ?? mockConfigs[index].configName,
      configKey: data.configKey ?? mockConfigs[index].configKey,
      configValue: data.configValue ?? mockConfigs[index].configValue,
      configType: data.configType ?? mockConfigs[index].configType,
      remark: data.remark ?? mockConfigs[index].remark,
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    return this.success(res, mockConfigs[index], '更新成功');
  }

  /**
   * 删除参数配置
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockConfigs.findIndex(c => c.configId === Number(id));

    if (index === -1) {
      return this.notFound(res, '参数配置不存在');
    }

    mockConfigs.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  /**
   * 刷新缓存
   */
  async refreshCache(req: Request, res: Response): Promise<Response> {
    return this.success(res, null, '缓存刷新成功');
  }

  /**
   * 导出参数配置
   */
  async export(req: Request, res: Response): Promise<Response> {
    return this.success(res, mockConfigs);
  }
}

export const configController = new ConfigController();

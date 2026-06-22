/**
 * 代码生成控制器
 *
 * 提供数据库表管理、代码生成、预览和下载功能。
 *
 * @module @yunshu/server-express/modules/gen
 */

import type { Request, Response } from 'express';
import type { IGenQuery, IGenConfig, GenerateType } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';
import { genService } from './GenService';

export class GenController extends BaseController {
  /**
   * 获取数据库表分页列表
   */
  async getTablePage(req: Request, res: Response): Promise<Response> {
    const params: IGenQuery = {
      search: req.query.search as string,
      tableName: req.query.tableName as string,
      tableComment: req.query.tableComment as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: req.query.sort as string || 'createTime',
      order: req.query.order as 'asc' | 'desc' || 'desc',
    };

    const result = await genService.getTablePage(params);
    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 获取所有数据库表列表
   */
  async getTableList(_req: Request, res: Response): Promise<Response> {
    const result = await genService.getTableList();
    return this.success(res, result);
  }

  /**
   * 获取表详情（包含字段信息）
   */
  async getTableDetail(req: Request, res: Response): Promise<Response> {
    const { tableName } = req.params;
    if (!tableName) {
      return this.badRequest(res, '表名不能为空');
    }

    const columns = await genService.getTableDetail(tableName);
    return this.success(res, columns);
  }

  /**
   * 获取生成配置
   */
  async getConfig(req: Request, res: Response): Promise<Response> {
    const { tableName } = req.params;
    if (!tableName) {
      return this.badRequest(res, '表名不能为空');
    }

    const columns = await genService.getTableDetail(tableName);
    const config: Partial<IGenConfig> = {
      tableName,
      tableComment: '',
      className: '',
      moduleName: '',
      packageName: 'com.yunshu.generator',
      author: '云枢',
      generateType: 'single',
      generateMenu: true,
      generateApi: true,
      generateView: true,
      generateTypeScript: true,
    };

    return this.success(res, { config, columns });
  }

  /**
   * 保存生成配置
   */
  async saveConfig(req: Request, res: Response): Promise<Response> {
    const config: IGenConfig = req.body;

    if (!config.tableName) {
      return this.badRequest(res, '表名不能为空');
    }
    if (!config.className) {
      return this.badRequest(res, '类名不能为空');
    }

    const result = await genService.saveConfig(config);
    return this.created(res, result, '配置保存成功');
  }

  /**
   * 获取生成配置列表
   */
  async getConfigList(_req: Request, res: Response): Promise<Response> {
    const result = await genService.getConfigList();
    return this.success(res, result);
  }

  /**
   * 删除生成配置
   */
  async deleteConfig(req: Request, res: Response): Promise<Response> {
    const { genId } = req.params;
    if (!genId) {
      return this.badRequest(res, '配置ID不能为空');
    }

    await genService.deleteConfig(genId);
    return this.success(res, true, '删除成功');
  }

  /**
   * 预览生成的代码
   */
  async previewCode(req: Request, res: Response): Promise<Response> {
    const config: IGenConfig = req.body;

    if (!config.tableName) {
      return this.badRequest(res, '表名不能为空');
    }

    // 如果没有传入列信息，自动获取
    if (!config.columns || config.columns.length === 0) {
      config.columns = await genService.getTableDetail(config.tableName);
    }

    const result = await genService.previewCode(config);
    return this.success(res, result);
  }

  /**
   * 生成代码
   */
  async generateCode(req: Request, res: Response): Promise<Response> {
    const config: IGenConfig = req.body;

    if (!config.tableName) {
      return this.badRequest(res, '表名不能为空');
    }

    // 如果没有传入列信息，自动获取
    if (!config.columns || config.columns.length === 0) {
      config.columns = await genService.getTableDetail(config.tableName);
    }

    const result = await genService.generateCode(config);
    return this.success(res, result);
  }

  /**
   * 下载代码ZIP包
   */
  async downloadCode(req: Request, res: Response): Promise<Response> {
    const { tableName } = req.params;

    if (!tableName) {
      return this.badRequest(res, '表名不能为空');
    }

    // 从查询参数构建配置
    const config: IGenConfig = {
      tableName,
      tableComment: req.query.tableComment as string || '',
      className: req.query.className as string || '',
      moduleName: req.query.moduleName as string || '',
      packageName: req.query.packageName as string || 'com.yunshu.generator',
      author: req.query.author as string || '云枢',
      email: req.query.email as string,
      generateType: (req.query.generateType as GenerateType) || 'single',
      generateMenu: req.query.generateMenu !== 'false',
      generateApi: req.query.generateApi !== 'false',
      generateView: req.query.generateView !== 'false',
      generateTypeScript: req.query.generateTypeScript !== 'false',
    };

    // 获取字段信息
    config.columns = await genService.getTableDetail(tableName);

    try {
      const zipBuffer = await genService.generateCodeZip(config);

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${config.tableName}_code.zip"`);
      res.setHeader('Content-Length', zipBuffer.length);

      return res.status(200).send(zipBuffer);
    } catch (error) {
      console.error('生成代码包失败:', error);
      return this.serverError(res, '代码生成失败');
    }
  }

  /**
   * 同步表结构（从数据库读取）
   */
  async syncTable(req: Request, res: Response): Promise<Response> {
    const { tableName } = req.params;

    if (!tableName) {
      return this.badRequest(res, '表名不能为空');
    }

    const columns = await genService.getTableDetail(tableName);
    return this.success(res, columns, '同步成功');
  }
}

export const genController = new GenController();

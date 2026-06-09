/**
 * 在线用户控制器
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import type { IOnlineQuery } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';
import { onlineService } from '@yunshu/server-core/modules/monitor';

export class OnlineController extends BaseController {
  /**
   * 获取在线用户分页列表
   */
  async list(req: Request, res: Response): Promise<Response> {
    const params: IOnlineQuery = {
      search: req.query.search as string,
      userName: req.query.userName as string,
      loginAccount: req.query.loginAccount as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: req.query.sort as string,
      order: req.query.order as 'asc' | 'desc',
    };

    const result = await onlineService.findWithPagination(params);
    return this.handleResult(res, result);
  }

  /**
   * 获取在线用户统计
   */
  async stats(req: Request, res: Response): Promise<Response> {
    const result = await onlineService.getStats();
    return this.handleResult(res, result);
  }

  /**
   * 强制用户下线
   */
  async forceLogout(req: Request, res: Response): Promise<Response> {
    const { sessionId } = req.body as { sessionId: string };
    if (!sessionId) {
      return this.badRequest(res, '请提供会话编号');
    }
    const result = await onlineService.forceLogout(sessionId);
    return this.handleResult(res, result);
  }

  /**
   * 批量强制用户下线
   */
  async forceLogoutBatch(req: Request, res: Response): Promise<Response> {
    const { sessionIds } = req.body as { sessionIds: string[] };
    if (!sessionIds || !Array.isArray(sessionIds) || sessionIds.length === 0) {
      return this.badRequest(res, '请选择要下线的用户');
    }
    const result = await onlineService.forceLogoutBatch(sessionIds);
    return this.handleResult(res, result);
  }
}

export const onlineController = new OnlineController();

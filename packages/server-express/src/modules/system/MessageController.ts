/**
 * 消息控制器
 *
 * 提供系统消息的完整 CRUD 接口，包括消息列表、创建、已读标记和删除功能。
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

/** 消息 */
interface SysMessage {
  messageId: number;
  title: string;
  content: string;
  type: 'system' | 'notice' | 'warn';
  receiver: string;
  sender: string;
  status: '0' | '1';
  created_at: string;
}

// ============================================================================
// Mock 数据
// ============================================================================

let messageIdSeed = 5;

const messages: SysMessage[] = [
  { messageId: 1, title: '系统升级通知', content: '系统将于今晚进行版本升级，请合理安排工作时间。', type: 'system', receiver: 'admin', sender: 'system', status: '0', created_at: '2024-01-15 09:00:00' },
  { messageId: 2, title: '新工单提醒', content: '您有一条新的工单待处理，工单编号 WO-2024-00123。', type: 'notice', receiver: 'admin', sender: 'workflow', status: '0', created_at: '2024-01-15 10:30:00' },
  { messageId: 3, title: '密码即将过期', content: '您的登录密码将于 7 天后过期，请及时更换。', type: 'warn', receiver: 'admin', sender: 'system', status: '1', created_at: '2024-01-14 14:00:00' },
  { messageId: 4, title: '数据备份完成', content: '每日数据备份任务已成功执行，备份文件大小 1.2GB。', type: 'system', receiver: 'operator', sender: 'backup', status: '1', created_at: '2024-01-15 02:00:00' },
  { messageId: 5, title: '权限变更通知', content: '您的账号已被授予新的角色权限，请重新登录后生效。', type: 'notice', receiver: 'admin', sender: 'security', status: '0', created_at: '2024-01-15 16:00:00' },
];

// ============================================================================
// MessageController
// ============================================================================

/**
 * 消息控制器
 */
export class MessageController extends BaseController {
  /**
   * 消息分页查询
   *
   * @param req - 请求对象，query 支持 status、type、receiver 过滤
   */
  async list(req: Request, res: Response) {
    try {
      const { page, limit } = normalizePagination(req.query);
      const { status, type, receiver } = req.query;

      let filtered = [...messages];
      if (status) filtered = filtered.filter(i => i.status === status);
      if (type) filtered = filtered.filter(i => i.type === type);
      if (receiver) filtered = filtered.filter(i => i.receiver.includes(String(receiver)));

      filtered.sort((a, b) => b.created_at.localeCompare(a.created_at));
      const total = filtered.length;
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      const unreadCount = messages.filter(i => i.status === '0').length;

      return this.paginate(
        res,
        createPaginatedResult(data, page, limit, total),
        `查询成功（未读 ${unreadCount} 条）`,
      );
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 消息详情
   */
  async getById(req: Request, res: Response) {
    try {
      const messageId = Number(req.params.messageId);
      const item = messages.find(i => i.messageId === messageId);
      if (!item) return this.notFound(res, '消息不存在');
      return this.success(res, item, '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 创建消息
   */
  async create(req: Request, res: Response) {
    try {
      const {
        title,
        content = '',
        type = 'notice',
        receiver,
        sender = 'system',
      } = req.body;

      if (!title || !receiver) {
        return this.badRequest(res, '消息标题和接收人不能为空');
      }

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const item: SysMessage = {
        messageId: ++messageIdSeed,
        title,
        content,
        type,
        receiver,
        sender,
        status: '0',
        created_at: now,
      };
      messages.push(item);
      return this.success(res, item, '创建成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 标记消息为已读
   *
   * @param req - body: { messageId }
   */
  async read(req: Request, res: Response) {
    try {
      const { messageId } = req.body;
      const item = messages.find(i => i.messageId === Number(messageId));
      if (!item) return this.notFound(res, '消息不存在');

      item.status = '1';
      return this.success(res, item, '标记已读成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 删除消息
   */
  async remove(req: Request, res: Response) {
    try {
      const messageId = Number(req.params.messageId);
      const idx = messages.findIndex(i => i.messageId === messageId);
      if (idx === -1) return this.notFound(res, '消息不存在');
      const removed = messages.splice(idx, 1)[0];
      return this.success(res, removed, '删除成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }
}

export const messageController = new MessageController();

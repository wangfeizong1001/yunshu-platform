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

const MAX_BATCH_SIZE = 100;
const MAX_QUERY_PARAM_LENGTH = 100;
const MAX_FIELD_LENGTH = 500;
const MAX_CONTENT_LENGTH = 5000;

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
// 校验工具
// ============================================================================

function isValidTitle(title: unknown): title is string {
  return typeof title === 'string' && title.trim().length >= 1 && title.length <= 100;
}

function isValidMessageType(t: unknown): t is 'system' | 'notice' | 'warn' {
  return t === 'system' || t === 'notice' || t === 'warn';
}

// ============================================================================
// MessageController
// ============================================================================

/**
 * 消息控制器
 */
export class MessageController extends BaseController {
  /**
   * 消息分页查询
   */
  async list(req: Request, res: Response) {
    const { page, limit } = normalizePagination(req.query);
    const statusParam = this.safeParam(req.query.status, 1);
    const typeParam = this.safeParam(req.query.type, MAX_QUERY_PARAM_LENGTH);
    const receiverParam = this.safeParam(req.query.receiver, MAX_QUERY_PARAM_LENGTH);

    let filtered = [...messages];
    if (statusParam) filtered = filtered.filter(i => i.status === statusParam);
    if (typeParam) filtered = filtered.filter(i => i.type === typeParam);
    if (receiverParam) filtered = filtered.filter(i => i.receiver.includes(receiverParam));

    filtered.sort((a, b) => b.created_at.localeCompare(a.created_at));
    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return this.paginate(
      res,
      createPaginatedResult(data, page, limit, total),
      '查询成功',
    );
  }

  /**
   * 消息详情
   */
  async getById(req: Request, res: Response) {
    const messageId = Number(req.params.messageId);
    if (!Number.isFinite(messageId)) return this.badRequest(res, 'messageId 参数非法');
    const item = messages.find(i => i.messageId === messageId);
    if (!item) return this.notFound(res, '消息不存在');
    return this.success(res, item, '查询成功');
  }

  /**
   * 创建消息
   */
  async create(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const body = req.body as Partial<SysMessage>;
    if (!isValidTitle(body.title)) return this.badRequest(res, 'title 长度 1-100');

    const type = body.type ?? 'notice';
    if (!isValidMessageType(type)) return this.badRequest(res, 'type 必须是 system/notice/warn');

    const receiver = typeof body.receiver === 'string'
      ? body.receiver.slice(0, 64)
      : '';
    if (receiver.trim().length === 0) return this.badRequest(res, 'receiver 必填');

    const sender = typeof body.sender === 'string'
      ? body.sender.slice(0, 64)
      : 'system';

    const content = typeof body.content === 'string'
      ? body.content.slice(0, MAX_CONTENT_LENGTH)
      : '';

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const item: SysMessage = {
      messageId: ++messageIdSeed,
      title: body.title,
      content,
      type,
      receiver,
      sender,
      status: '0',
      created_at: now,
    };
    messages.push(item);
    return this.success(res, item, '创建成功');
  }

  /**
   * 标记消息为已读
   */
  async read(req: Request, res: Response) {
    const body = req.body as { messageId?: unknown };
    const messageId = Number(body.messageId);
    if (!Number.isFinite(messageId)) return this.badRequest(res, 'messageId 参数非法');

    const item = messages.find(i => i.messageId === messageId);
    if (!item) return this.notFound(res, '消息不存在');

    item.status = '1';
    return this.success(res, item, '标记已读成功');
  }

  /**
   * 删除消息
   */
  async remove(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const messageId = Number(req.params.messageId);
    if (!Number.isFinite(messageId)) return this.badRequest(res, 'messageId 参数非法');

    const idx = messages.findIndex(i => i.messageId === messageId);
    if (idx === -1) return this.notFound(res, '消息不存在');
    const removed = messages.splice(idx, 1)[0];
    return this.success(res, removed, '删除成功');
  }
}

export const messageController = new MessageController();

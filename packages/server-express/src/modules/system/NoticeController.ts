/**
 * 通知公告控制器
 *
 * 提供通知公告的完整 CRUD 接口。
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

/** 通知公告 */
interface SysNotice {
  noticeId: number;
  noticeTitle: string;
  noticeType: '1' | '2';
  noticeContent: string;
  status: '0' | '1';
  remark: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Mock 数据
// ============================================================================

let noticeIdSeed = 3;

const notices: SysNotice[] = [
  {
    noticeId: 1,
    noticeTitle: '系统维护通知',
    noticeType: '2',
    noticeContent: '系统将于本周六凌晨 02:00-04:00 进行例行维护，请提前保存工作。',
    status: '0',
    remark: '',
    createdAt: '2024-01-15 09:00:00',
    updatedAt: '2024-01-15 09:00:00',
  },
  {
    noticeId: 2,
    noticeTitle: '新版本发布公告',
    noticeType: '2',
    noticeContent: '云枢中台 v2.0 版本正式发布，包含多项新功能和性能优化。',
    status: '0',
    remark: '',
    createdAt: '2024-01-20 14:30:00',
    updatedAt: '2024-01-20 14:30:00',
  },
  {
    noticeId: 3,
    noticeTitle: '欢迎使用云枢中台',
    noticeType: '1',
    noticeContent: '欢迎使用云枢中台系统，祝您使用愉快！',
    status: '0',
    remark: '',
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-01-01 00:00:00',
  },
];

// ============================================================================
// NoticeController
// ============================================================================

/**
 * 通知公告控制器
 */
export class NoticeController extends BaseController {
  /**
   * 通知公告分页查询
   *
   * @param req - 请求对象，query 支持 noticeTitle、noticeType 过滤
   */
  async list(req: Request, res: Response) {
    try {
      const { page, limit } = normalizePagination(req.query);
      const { noticeTitle, noticeType } = req.query;

      let filtered = [...notices];
      if (noticeTitle) filtered = filtered.filter(i => i.noticeTitle.includes(String(noticeTitle)));
      if (noticeType) filtered = filtered.filter(i => i.noticeType === noticeType);

      const total = filtered.length;
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 通知公告详情
   */
  async getById(req: Request, res: Response) {
    try {
      const noticeId = Number(req.params.noticeId);
      const item = notices.find(i => i.noticeId === noticeId);
      if (!item) return this.notFound(res, '通知公告不存在');
      return this.success(res, item, '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 创建通知公告
   */
  async create(req: Request, res: Response) {
    try {
      const { noticeTitle, noticeType = '1', noticeContent = '', status = '0', remark = '' } = req.body;
      if (!noticeTitle) return this.badRequest(res, '公告标题不能为空');

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const item: SysNotice = {
        noticeId: ++noticeIdSeed,
        noticeTitle,
        noticeType,
        noticeContent,
        status,
        remark,
        createdAt: now,
        updatedAt: now,
      };
      notices.push(item);
      return this.success(res, item, '创建成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 更新通知公告
   */
  async update(req: Request, res: Response) {
    try {
      const noticeId = Number(req.params.noticeId);
      const idx = notices.findIndex(i => i.noticeId === noticeId);
      if (idx === -1) return this.notFound(res, '通知公告不存在');

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      notices[idx] = { ...notices[idx], ...req.body, noticeId, updatedAt: now };
      return this.success(res, notices[idx], '更新成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 删除通知公告
   */
  async remove(req: Request, res: Response) {
    try {
      const noticeId = Number(req.params.noticeId);
      const idx = notices.findIndex(i => i.noticeId === noticeId);
      if (idx === -1) return this.notFound(res, '通知公告不存在');
      const removed = notices.splice(idx, 1)[0];
      return this.success(res, removed, '删除成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }
}

export const noticeController = new NoticeController();

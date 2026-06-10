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

const MAX_BATCH_SIZE = 100;
const MAX_QUERY_PARAM_LENGTH = 100;
const MAX_FIELD_LENGTH = 500;
const MAX_CONTENT_LENGTH = 5000;

// ============================================================================
// 类型定义
// ============================================================================

/** 通知公告 */
interface SysNotice {
  noticeId: number;
  noticeTitle: string;
  noticeType: '1' | '2' | '3';
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
// 校验工具
// ============================================================================

function isValidNoticeTitle(title: unknown): title is string {
  return typeof title === 'string' && title.trim().length >= 1 && title.length <= 100;
}

function isValidNoticeType(type: unknown): type is '1' | '2' | '3' {
  return type === '1' || type === '2' || type === '3';
}

function isValidNoticeStatus(status: unknown): status is '0' | '1' {
  return status === '0' || status === '1';
}

// ============================================================================
// NoticeController
// ============================================================================

/**
 * 通知公告控制器
 */
export class NoticeController extends BaseController {
  /**
   * 通知公告分页查询
   */
  async list(req: Request, res: Response) {
    const { page, limit } = normalizePagination(req.query);
    const noticeTitleParam = this.safeParam(req.query.noticeTitle, MAX_QUERY_PARAM_LENGTH);
    const noticeTypeParam = this.safeParam(req.query.noticeType, 1);

    let filtered = [...notices];
    if (noticeTitleParam) filtered = filtered.filter(i => i.noticeTitle.includes(noticeTitleParam));
    if (noticeTypeParam) filtered = filtered.filter(i => i.noticeType === noticeTypeParam);

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
  }

  /**
   * 通知公告详情
   */
  async getById(req: Request, res: Response) {
    const noticeId = Number(req.params.noticeId);
    if (!Number.isFinite(noticeId)) return this.badRequest(res, 'noticeId 参数非法');

    const item = notices.find(i => i.noticeId === noticeId);
    if (!item) return this.notFound(res, '通知公告不存在');
    return this.success(res, item, '查询成功');
  }

  /**
   * 创建通知公告
   */
  async create(req: Request, res: Response) {
    const role = (req as any).user?.role;
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const body = req.body as Partial<SysNotice>;
    if (!isValidNoticeTitle(body.noticeTitle)) return this.badRequest(res, 'noticeTitle 长度 1-100');

    const noticeType = body.noticeType ?? '1';
    if (!isValidNoticeType(noticeType)) return this.badRequest(res, 'noticeType 必须是 1/2/3');

    const status = body.status ?? '0';
    if (!isValidNoticeStatus(status)) return this.badRequest(res, 'status 必须是 0 或 1');

    const noticeContent = typeof body.noticeContent === 'string'
      ? body.noticeContent.slice(0, MAX_CONTENT_LENGTH)
      : '';
    const remark = typeof body.remark === 'string'
      ? body.remark.slice(0, MAX_FIELD_LENGTH)
      : '';

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const item: SysNotice = {
      noticeId: ++noticeIdSeed,
      noticeTitle: body.noticeTitle,
      noticeType,
      noticeContent,
      status,
      remark,
      createdAt: now,
      updatedAt: now,
    };
    notices.push(item);
    return this.success(res, item, '创建成功');
  }

  /**
   * 更新通知公告
   */
  async update(req: Request, res: Response) {
    const role = (req as any).user?.role;
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const noticeId = Number(req.params.noticeId);
    if (!Number.isFinite(noticeId)) return this.badRequest(res, 'noticeId 参数非法');

    const exist = notices.find(i => i.noticeId === noticeId);
    if (!exist) return this.notFound(res, '通知公告不存在');
    const idx = notices.indexOf(exist);

    const body = req.body as Partial<SysNotice>;

    if (body.noticeTitle !== undefined && !isValidNoticeTitle(body.noticeTitle)) {
      return this.badRequest(res, 'noticeTitle 长度 1-100');
    }
    if (body.noticeType !== undefined && !isValidNoticeType(body.noticeType)) {
      return this.badRequest(res, 'noticeType 必须是 1/2/3');
    }
    if (body.status !== undefined && !isValidNoticeStatus(body.status)) {
      return this.badRequest(res, 'status 必须是 0 或 1');
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    notices[idx] = {
      noticeId,
      noticeTitle: body.noticeTitle ?? exist.noticeTitle,
      noticeType: body.noticeType ?? exist.noticeType,
      noticeContent: typeof body.noticeContent === 'string'
        ? body.noticeContent.slice(0, MAX_CONTENT_LENGTH)
        : exist.noticeContent,
      status: body.status ?? exist.status,
      remark: typeof body.remark === 'string'
        ? body.remark.slice(0, MAX_FIELD_LENGTH)
        : exist.remark,
      createdAt: exist.createdAt,
      updatedAt: now,
    };
    return this.success(res, notices[idx], '更新成功');
  }

  /**
   * 删除通知公告
   */
  async remove(req: Request, res: Response) {
    const role = (req as any).user?.role;
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const noticeId = Number(req.params.noticeId);
    if (!Number.isFinite(noticeId)) return this.badRequest(res, 'noticeId 参数非法');

    const idx = notices.findIndex(i => i.noticeId === noticeId);
    if (idx === -1) return this.notFound(res, '通知公告不存在');
    const removed = notices.splice(idx, 1)[0];
    return this.success(res, removed, '删除成功');
  }
}

export const noticeController = new NoticeController();

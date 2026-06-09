/**
 * 通知公告控制器
 *
 * @module @yunshu/server-express/modules/system
 */

import type { Request, Response } from 'express';
import type { SysNotice, SysNoticeQuery, SysNoticeForm } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';

/** 模拟通知公告数据 */
const mockNotices: SysNotice[] = [
  {
    noticeId: 1,
    noticeTitle: '系统升级通知',
    noticeType: '1',
    noticeContent: '系统将于2024-06-15 02:00进行升级维护，预计耗时2小时。',
    status: '0',
    createBy: 'admin',
    createTime: '2024-06-10 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-10 10:00:00',
    remark: '',
  },
  {
    noticeId: 2,
    noticeTitle: '端午节放假通知',
    noticeType: '2',
    noticeContent: '根据国家规定，端午节放假3天，请各部门做好工作安排。',
    status: '0',
    createBy: 'admin',
    createTime: '2024-06-05 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-05 09:00:00',
    remark: '',
  },
  {
    noticeId: 3,
    noticeTitle: '新功能上线公告',
    noticeType: '2',
    noticeContent: '新版工作流功能已上线，欢迎使用并提出宝贵意见。',
    status: '1',
    createBy: 'admin',
    createTime: '2024-06-01 14:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 14:00:00',
    remark: '',
  },
];

export class NoticeController extends BaseController {
  /**
   * 获取通知公告分页列表
   */
  async list(req: Request, res: Response): Promise<Response> {
    const params: SysNoticeQuery = {
      keyword: req.query.keyword as string,
      noticeType: req.query.noticeType as SysNoticeQuery['noticeType'],
      status: req.query.status as SysNoticeQuery['status'],
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    };

    let filtered = [...mockNotices];

    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(
        n =>
          n.noticeTitle.toLowerCase().includes(kw) ||
          n.noticeContent.toLowerCase().includes(kw),
      );
    }

    if (params.noticeType) {
      filtered = filtered.filter(n => n.noticeType === params.noticeType);
    }

    if (params.status) {
      filtered = filtered.filter(n => n.status === params.status);
    }

    const total = filtered.length;
    const noticePage = params.pageNum ?? 1;
    const noticeSize = params.pageSize ?? 10;
    const start = (noticePage - 1) * noticeSize;
    const end = start + noticeSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取通知公告详情
   */
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const notice = mockNotices.find(n => n.noticeId === Number(id));

    if (!notice) {
      return this.notFound(res, '通知公告不存在');
    }

    return this.success(res, notice);
  }

  /**
   * 获取最新通知公告列表
   */
  async getLatest(req: Request, res: Response): Promise<Response> {
    const { limit } = req.query;
    const size = Number(limit) || 5;

    const latest = mockNotices
      .filter(n => n.status === '0')
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
      .slice(0, size);

    return this.success(res, latest);
  }

  /**
   * 创建通知公告
   */
  async create(req: Request, res: Response): Promise<Response> {
    const data: SysNoticeForm = req.body;

    if (!data.noticeTitle || !data.noticeType || !data.noticeContent) {
      return this.badRequest(res, '请填写完整的通知公告信息');
    }

    const newNotice: SysNotice = {
      noticeId: Math.max(...mockNotices.map(n => n.noticeId)) + 1,
      noticeTitle: data.noticeTitle,
      noticeType: data.noticeType,
      noticeContent: data.noticeContent,
      status: data.status || '0',
      createBy: 'admin',
      createTime: new Date().toLocaleString('zh-CN'),
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
      remark: data.remark || '',
    };

    mockNotices.push(newNotice);
    return this.created(res, newNotice, '创建成功');
  }

  /**
   * 更新通知公告
   */
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: SysNoticeForm = req.body;
    const index = mockNotices.findIndex(n => n.noticeId === Number(id));

    if (index === -1) {
      return this.notFound(res, '通知公告不存在');
    }

    mockNotices[index] = {
      ...mockNotices[index],
      noticeTitle: data.noticeTitle ?? mockNotices[index].noticeTitle,
      noticeType: data.noticeType ?? mockNotices[index].noticeType,
      noticeContent: data.noticeContent ?? mockNotices[index].noticeContent,
      status: data.status ?? mockNotices[index].status,
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
      remark: data.remark ?? mockNotices[index].remark,
    };

    return this.success(res, mockNotices[index], '更新成功');
  }

  /**
   * 删除通知公告
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockNotices.findIndex(n => n.noticeId === Number(id));

    if (index === -1) {
      return this.notFound(res, '通知公告不存在');
    }

    mockNotices.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  /**
   * 修改通知公告状态
   */
  async changeStatus(req: Request, res: Response): Promise<Response> {
    const { id, status } = req.body;
    const notice = mockNotices.find(n => n.noticeId === Number(id));

    if (!notice) {
      return this.notFound(res, '通知公告不存在');
    }

    notice.status = status;
    notice.updateTime = new Date().toLocaleString('zh-CN');
    return this.success(res, null, '状态修改成功');
  }

  /**
   * 导出通知公告
   */
  async export(_req: Request, res: Response): Promise<Response> {
    return this.success(res, mockNotices);
  }
}

export const noticeController = new NoticeController();

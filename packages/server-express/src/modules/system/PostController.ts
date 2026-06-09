/**
 * 岗位管理控制器
 *
 * @module @yunshu/server-express/modules/system
 */

import type { Request, Response } from 'express';
import type { SysPost, SysPostQuery, SysPostForm } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';

/** 模拟岗位数据 */
const mockPosts: SysPost[] = [
  {
    postId: 1,
    postCode: 'CEO',
    postName: '首席执行官',
    postSort: 1,
    status: '0',
    remark: '公司最高管理者',
    createTime: '2024-01-15 08:00:00',
  },
  {
    postId: 2,
    postCode: 'CTO',
    postName: '首席技术官',
    postSort: 2,
    status: '0',
    remark: '技术负责人',
    createTime: '2024-01-15 08:00:00',
  },
  {
    postId: 3,
    postCode: 'DEV',
    postName: '开发工程师',
    postSort: 3,
    status: '0',
    remark: '研发部',
    createTime: '2024-01-15 08:00:00',
  },
  {
    postId: 4,
    postCode: 'TEST',
    postName: '测试工程师',
    postSort: 4,
    status: '1',
    remark: '质量部',
    createTime: '2024-01-15 08:00:00',
  },
];

export class PostController extends BaseController {
  /**
   * 获取岗位分页列表
   */
  async list(req: Request, res: Response): Promise<Response> {
    const params: SysPostQuery = {
      keyword: req.query.keyword as string,
      status: req.query.status as SysPostQuery['status'],
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    };

    let filtered = [...mockPosts];

    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(
        p => p.postName.toLowerCase().includes(kw) || p.postCode.toLowerCase().includes(kw),
      );
    }

    if (params.status) {
      filtered = filtered.filter(p => p.status === params.status);
    }

    const total = filtered.length;
    const start = (params.pageNum - 1) * params.pageSize;
    const end = start + params.pageSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取岗位详情
   */
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const post = mockPosts.find(p => p.postId === Number(id));

    if (!post) {
      return this.notFound(res, '岗位不存在');
    }

    return this.success(res, post);
  }

  /**
   * 获取所有岗位
   */
  async getAll(req: Request, res: Response): Promise<Response> {
    return this.success(res, mockPosts.filter(p => p.status === '0'));
  }

  /**
   * 创建岗位
   */
  async create(req: Request, res: Response): Promise<Response> {
    const data: SysPostForm = req.body;

    if (!data.postCode || !data.postName) {
      return this.badRequest(res, '请填写完整的岗位信息');
    }

    const exists = mockPosts.find(p => p.postCode === data.postCode);
    if (exists) {
      return this.conflict(res, '岗位编码已存在');
    }

    const newPost: SysPost = {
      postId: Math.max(...mockPosts.map(p => p.postId)) + 1,
      postCode: data.postCode,
      postName: data.postName,
      postSort: data.postSort ?? 0,
      status: data.status || '0',
      remark: data.remark || '',
      createTime: new Date().toLocaleString('zh-CN'),
    };

    mockPosts.push(newPost);
    return this.created(res, newPost, '创建成功');
  }

  /**
   * 更新岗位
   */
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: SysPostForm = req.body;
    const index = mockPosts.findIndex(p => p.postId === Number(id));

    if (index === -1) {
      return this.notFound(res, '岗位不存在');
    }

    if (data.postCode && data.postCode !== mockPosts[index].postCode) {
      const exists = mockPosts.find(p => p.postCode === data.postCode && p.postId !== Number(id));
      if (exists) {
        return this.conflict(res, '岗位编码已存在');
      }
    }

    mockPosts[index] = {
      ...mockPosts[index],
      postCode: data.postCode ?? mockPosts[index].postCode,
      postName: data.postName ?? mockPosts[index].postName,
      postSort: data.postSort ?? mockPosts[index].postSort,
      status: data.status ?? mockPosts[index].status,
      remark: data.remark ?? mockPosts[index].remark,
    };

    return this.success(res, mockPosts[index], '更新成功');
  }

  /**
   * 删除岗位
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockPosts.findIndex(p => p.postId === Number(id));

    if (index === -1) {
      return this.notFound(res, '岗位不存在');
    }

    mockPosts.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  /**
   * 修改岗位状态
   */
  async changeStatus(req: Request, res: Response): Promise<Response> {
    const { id, status } = req.body;
    const post = mockPosts.find(p => p.postId === Number(id));

    if (!post) {
      return this.notFound(res, '岗位不存在');
    }

    post.status = status;
    return this.success(res, null, '状态修改成功');
  }

  /**
   * 导出岗位
   */
  async export(req: Request, res: Response): Promise<Response> {
    return this.success(res, mockPosts);
  }
}

export const postController = new PostController();

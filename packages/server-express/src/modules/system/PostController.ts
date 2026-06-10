/**
 * 岗位管理控制器
 *
 * 提供系统岗位相关的 CRUD 操作接口，包括岗位列表查询、岗位详情、新增、修改、删除、
 * 批量删除以及全部岗位查询等功能。
 *
 * @module system/PostController
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import {
  createPaginatedResult,
  normalizePagination,
  type PaginationParams,
} from '@yunshu/shared';

// ============================================================================
// 类型定义
// ============================================================================

/** 岗位状态 */
type PostStatus = '0' | '1';

/** 岗位数据结构 */
interface Post {
  /** 岗位ID */
  postId: string;
  /** 岗位编码 */
  postCode: string;
  /** 岗位名称 */
  postName: string;
  /** 显示顺序 */
  postSort: number;
  /** 状态 0正常 1停用 */
  status: PostStatus;
  /** 备注 */
  remark: string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/** 岗位查询参数 */
interface PostQueryParams extends PaginationParams {
  /** 岗位编码（模糊匹配） */
  postCode?: string;
  /** 岗位名称（模糊匹配） */
  postName?: string;
  /** 状态 */
  status?: PostStatus;
}

/** 创建岗位请求体 */
interface PostCreateBody {
  postCode: string;
  postName: string;
  postSort?: number;
  status?: PostStatus;
  remark?: string;
}

/** 更新岗位请求体 */
interface PostUpdateBody extends PostCreateBody {
  postId: string;
}

/** 批量删除请求体 */
interface BatchRemoveBody {
  postIds: string[];
}

// ============================================================================
// Mock 数据（内存存储）
// ============================================================================

let mockPosts: Post[] = [
  {
    postId: 'p-00000000-0000-0000-0000-000000000001',
    postCode: 'CEO',
    postName: '首席执行官',
    postSort: 1,
    status: '0',
    remark: '公司最高管理者',
    created_at: '2026-01-01 00:00:00',
    updated_at: '2026-01-01 00:00:00',
  },
  {
    postId: 'p-00000000-0000-0000-0000-000000000002',
    postCode: 'CTO',
    postName: '首席技术官',
    postSort: 2,
    status: '0',
    remark: '技术负责人',
    created_at: '2026-01-01 00:00:00',
    updated_at: '2026-01-01 00:00:00',
  },
  {
    postId: 'p-00000000-0000-0000-0000-000000000003',
    postCode: 'FE',
    postName: '前端工程师',
    postSort: 3,
    status: '0',
    remark: '前端开发工程师',
    created_at: '2026-02-15 10:00:00',
    updated_at: '2026-02-15 10:00:00',
  },
  {
    postId: 'p-00000000-0000-0000-0000-000000000004',
    postCode: 'BE',
    postName: '后端工程师',
    postSort: 4,
    status: '0',
    remark: '后端开发工程师',
    created_at: '2026-03-01 10:00:00',
    updated_at: '2026-03-01 10:00:00',
  },
  {
    postId: 'p-00000000-0000-0000-0000-000000000005',
    postCode: 'TEST',
    postName: '测试工程师',
    postSort: 5,
    status: '1',
    remark: '软件测试工程师（已停用）',
    created_at: '2026-04-01 10:00:00',
    updated_at: '2026-05-20 10:00:00',
  },
];

// ============================================================================
// 控制器实现
// ============================================================================

/**
 * 岗位管理控制器类
 *
 * 继承 BaseController，封装了系统岗位的全部 CRUD 操作。
 */
export class PostController extends BaseController {
  /**
   * 岗位分页列表查询
   *
   * 支持按 postCode、postName（模糊匹配）、status 过滤
   */
  async list(req: Request, res: Response) {
    try {
      const query = req.query as unknown as PostQueryParams;
      const { page, limit } = normalizePagination(query);

      const filtered = mockPosts.filter((p) => {
        if (query.postCode && !p.postCode.includes(query.postCode)) {
          return false;
        }
        if (query.postName && !p.postName.includes(query.postName)) {
          return false;
        }
        if (query.status && p.status !== query.status) {
          return false;
        }
        return true;
      });

      filtered.sort((a, b) => a.postSort - b.postSort);

      const total = filtered.length;
      const start = (page - 1) * limit;
      const list = filtered.slice(start, start + limit);

      return this.paginate(
        res,
        createPaginatedResult(list, page, limit, total),
        '查询成功',
      );
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 根据 postId 获取岗位详情
   */
  async getById(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const post = mockPosts.find((p) => p.postId === postId);
      if (!post) {
        return this.notFound(res, '岗位不存在');
      }
      return this.success(res, post, '获取成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 创建岗位
   */
  async create(req: Request, res: Response) {
    try {
      const body = req.body as PostCreateBody;
      if (!body.postCode || !body.postName) {
        return this.badRequest(res, 'postCode 和 postName 必填');
      }

      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const postId = `p-${Date.now().toString().padStart(32, '0')}`;

      const newPost: Post = {
        postId,
        postCode: body.postCode,
        postName: body.postName,
        postSort: body.postSort ?? 0,
        status: body.status ?? '0',
        remark: body.remark ?? '',
        created_at: now,
        updated_at: now,
      };

      mockPosts.push(newPost);
      return this.created(res, newPost, '创建成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 更新岗位
   */
  async update(req: Request, res: Response) {
    try {
      const body = req.body as PostUpdateBody;
      if (!body.postId) {
        return this.badRequest(res, 'postId 必填');
      }

      const idx = mockPosts.findIndex((p) => p.postId === body.postId);
      if (idx === -1) {
        return this.notFound(res, '岗位不存在');
      }

      const exist = mockPosts[idx];
      if (!exist) return this.notFound(res, '岗位不存在');
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      mockPosts[idx] = {
        postId: exist.postId,
        postCode: body.postCode,
        postName: body.postName,
        postSort: body.postSort ?? exist.postSort,
        status: body.status ?? exist.status,
        remark: body.remark ?? exist.remark,
        created_at: exist.created_at,
        updated_at: now,
      };

      return this.success(res, mockPosts[idx], '更新成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 删除单个岗位
   */
  async remove(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const idx = mockPosts.findIndex((p) => p.postId === postId);
      if (idx === -1) {
        return this.notFound(res, '岗位不存在');
      }

      mockPosts.splice(idx, 1);
      return this.success(res, { postId }, '删除成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 批量删除岗位
   *
   * body: { postIds: string[] }
   */
  async batchRemove(req: Request, res: Response) {
    try {
      const body = req.body as BatchRemoveBody;
      if (!body.postIds || !Array.isArray(body.postIds) || body.postIds.length === 0) {
        return this.badRequest(res, 'postIds 必须为非空数组');
      }

      const before = mockPosts.length;
      mockPosts = mockPosts.filter((p) => !body.postIds.includes(p.postId));
      const deleted = before - mockPosts.length;

      return this.success(res, { deleted, postIds: body.postIds }, `批量删除成功，共删除 ${deleted} 条`);
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 获取全部岗位列表（不分页，用于下拉选择）
   */
  async getAll(req: Request, res: Response) {
    try {
      const list = [...mockPosts].sort((a, b) => a.postSort - b.postSort);
      return this.success(res, list, '查询成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }
}

/** 岗位控制器单例实例 */
export const postController = new PostController();

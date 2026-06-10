/**
 * 系统岗位类型定义
 */

/** 岗位状态 */
export type PostStatus = '0' | '1';

/** 岗位信息 */
export interface SysPost {
  /** 岗位ID */
  postId: number;
  /** 岗位编码 */
  postCode: string;
  /** 岗位名称 */
  postName: string;
  /** 岗位排序 */
  postSort: number;
  /** 状态: 0=正常, 1=停用 */
  status: PostStatus;
  /** 备注 */
  remark?: string;
  /** 创建时间 */
  createTime?: string;
}

/** 岗位查询参数 */
export interface SysPostQuery {
  /** 关键词 */
  keyword?: string;
  /** 岗位状态 */
  status?: PostStatus;
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 岗位表单数据 */
export interface SysPostForm {
  /** 岗位ID */
  postId?: number;
  /** 岗位编码 */
  postCode: string;
  /** 岗位名称 */
  postName: string;
  /** 岗位排序 */
  postSort: number;
  /** 状态 */
  status?: PostStatus;
  /** 备注 */
  remark?: string;
}

/** 岗位分页响应 */
export interface SysPostPageResp {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  rows: SysPost[];
}

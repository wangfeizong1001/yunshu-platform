/**
 * 通知公告类型定义
 */

/** 公告类型 */
export type NoticeType = '1' | '2'

/** 公告状态 */
export type NoticeStatus = '0' | '1'

/** 通知公告 */
export interface SysNotice {
  /** 公告ID */
  noticeId: number
  /** 公告标题 */
  noticeTitle: string
  /** 公告类型: 1=通知, 2=公告 */
  noticeType: NoticeType
  /** 公告内容 */
  noticeContent: string
  /** 状态: 0=发布, 1=撤回 */
  status: NoticeStatus
  /** 创建者 */
  createBy?: string
  /** 创建时间 */
  createTime: string
  /** 更新者 */
  updateBy?: string
  /** 更新时间 */
  updateTime: string
  /** 备注 */
  remark?: string
}

/** 通知公告查询参数 */
export interface SysNoticeQuery {
  /** 关键词 */
  keyword?: string
  /** 公告类型 */
  noticeType?: NoticeType
  /** 状态 */
  status?: NoticeStatus
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 页码 */
  pageNum?: number
  /** 每页数量 */
  pageSize?: number
}

/** 通知公告表单数据 */
export interface SysNoticeForm {
  /** 公告ID */
  noticeId?: number
  /** 公告标题 */
  noticeTitle: string
  /** 公告类型 */
  noticeType: NoticeType
  /** 公告内容 */
  noticeContent: string
  /** 状态 */
  status?: NoticeStatus
  /** 备注 */
  remark?: string
}

/** 通知公告分页响应 */
export interface SysNoticePageResp {
  /** 总记录数 */
  total: number
  /** 列表数据 */
  rows: SysNotice[]
}

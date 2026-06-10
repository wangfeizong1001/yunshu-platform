/**
 * 通知公告 API
 */
export interface NoticeQuery {
  pageNum?: number;
  pageSize?: number;
  noticeTitle?: string;
  noticeType?: string;
  status?: string;
}
export interface NoticeForm {
  noticeId?: number;
  noticeTitle?: string;
  noticeType?: string;
  noticeContent?: string;
  status?: string;
  remark?: string;
}
export interface NoticeInfo {
  noticeId: number;
  noticeTitle: string;
  noticeType: string;
  noticeContent: string;
  status: string;
  remark: string;
  createTime: string;
}
export declare const getNoticeList: (params?: NoticeQuery) => Promise<unknown>;
export declare const getNoticePage: (params?: NoticeQuery) => Promise<unknown>;
export declare const getNotice: (noticeId: number) => Promise<unknown>;
export declare const addNotice: (data: NoticeForm) => Promise<unknown>;
export declare const updateNotice: (data: NoticeForm) => Promise<unknown>;
export declare const deleteNotice: (noticeId: number) => Promise<unknown>;
export declare const batchDeleteNotice: (noticeIds: number[]) => Promise<unknown>;
export declare const publishNotice: (noticeId: number) => Promise<unknown>;
export declare const withdrawNotice: (noticeId: number) => Promise<unknown>;
export declare const getNoticeDetail: (noticeId: number) => Promise<unknown>;
//# sourceMappingURL=notice.api.d.ts.map

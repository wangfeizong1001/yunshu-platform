/**
 * 通知公告 Mock 数据
 */
import type { SysNotice, SysNoticePageResp } from '@yunshu/shared';
export declare const mockNoticeList: SysNotice[];
export declare function getMockNoticePage(params: any): SysNoticePageResp;
export declare function getMockNoticeDetail(noticeId: number): SysNotice | undefined;
export declare function addMockNotice(data: Partial<SysNotice>): SysNotice;
export declare function updateMockNotice(
  noticeId: number,
  data: Partial<SysNotice>,
): SysNotice | undefined;
export declare function deleteMockNotice(noticeId: number): boolean;
//# sourceMappingURL=notice.mock.d.ts.map

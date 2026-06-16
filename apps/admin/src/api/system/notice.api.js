/**
 * 通知公告 API
 */
import { request } from '@/utils/httpClient';
export const getNoticeList = (params) => {
    return request({
        url: '/system/notice/list',
        method: 'GET',
        params
    });
};
export const getNoticePage = (params) => {
    return request({
        url: '/system/notice/page',
        method: 'GET',
        params
    });
};
export const getNotice = (noticeId) => {
    return request({
        url: `/system/notice/${noticeId}`,
        method: 'GET'
    });
};
export const addNotice = (data) => {
    return request({
        url: '/system/notice',
        method: 'POST',
        data
    });
};
export const updateNotice = (data) => {
    return request({
        url: '/system/notice',
        method: 'PUT',
        data
    });
};
export const deleteNotice = (noticeId) => {
    return request({
        url: `/system/notice/${noticeId}`,
        method: 'DELETE'
    });
};
export const batchDeleteNotice = (noticeIds) => {
    return request({
        url: '/system/notice/batch',
        method: 'DELETE',
        data: noticeIds
    });
};
export const publishNotice = (noticeId) => {
    return request({
        url: `/system/notice/publish/${noticeId}`,
        method: 'PUT'
    });
};
export const withdrawNotice = (noticeId) => {
    return request({
        url: `/system/notice/withdraw/${noticeId}`,
        method: 'PUT'
    });
};
export const getNoticeDetail = (noticeId) => {
    return request({
        url: `/system/notice/${noticeId}`,
        method: 'GET'
    });
};
//# sourceMappingURL=notice.api.js.map
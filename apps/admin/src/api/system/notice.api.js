/**
 * 通知公告 API
 */
import request from '@/utils/request';
export const getNoticeList = (params) => {
    return request({
        url: '/system/notice/list',
        method: 'get',
        params
    });
};
export const getNoticePage = (params) => {
    return request({
        url: '/system/notice/page',
        method: 'get',
        params
    });
};
export const getNotice = (noticeId) => {
    return request({
        url: `/system/notice/${noticeId}`,
        method: 'get'
    });
};
export const addNotice = (data) => {
    return request({
        url: '/system/notice',
        method: 'post',
        data
    });
};
export const updateNotice = (data) => {
    return request({
        url: '/system/notice',
        method: 'put',
        data
    });
};
export const deleteNotice = (noticeId) => {
    return request({
        url: `/system/notice/${noticeId}`,
        method: 'delete'
    });
};
export const batchDeleteNotice = (noticeIds) => {
    return request({
        url: '/system/notice/batch',
        method: 'delete',
        data: noticeIds
    });
};
export const publishNotice = (noticeId) => {
    return request({
        url: `/system/notice/publish/${noticeId}`,
        method: 'put'
    });
};
export const withdrawNotice = (noticeId) => {
    return request({
        url: `/system/notice/withdraw/${noticeId}`,
        method: 'put'
    });
};
export const getNoticeDetail = (noticeId) => {
    return request({
        url: `/system/notice/${noticeId}`,
        method: 'get'
    });
};
//# sourceMappingURL=notice.api.js.map
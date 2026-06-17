/**
 * 通知 API
 */
import { request } from '@/utils/httpClient';
export const getNotificationList = (params) => {
    return request({
        url: '/system/notification/list',
        method: 'GET',
        params
    });
};
export const getNotificationPage = (params) => {
    return request({
        url: '/system/notification/page',
        method: 'GET',
        params
    });
};
export const getNotification = (notificationId) => {
    return request({
        url: `/system/notification/${notificationId}`,
        method: 'GET'
    });
};
export const createNotification = (data) => {
    return request({
        url: '/system/notification',
        method: 'POST',
        data
    });
};
export const updateNotification = (data) => {
    return request({
        url: '/system/notification',
        method: 'PUT',
        data
    });
};
export const deleteNotification = (notificationId) => {
    return request({
        url: `/system/notification/${notificationId}`,
        method: 'DELETE'
    });
};
export const batchDeleteNotification = (notificationIds) => {
    return request({
        url: '/system/notification/batch',
        method: 'DELETE',
        data: notificationIds
    });
};
export const pushNotification = (notificationId) => {
    return request({
        url: `/system/notification/${notificationId}/push`,
        method: 'POST'
    });
};
export const recallNotification = (notificationId) => {
    return request({
        url: `/system/notification/${notificationId}/recall`,
        method: 'POST'
    });
};
export const getNotificationStats = () => {
    return request({
        url: '/system/notification/stats',
        method: 'GET'
    });
};
//# sourceMappingURL=notification.api.js.map
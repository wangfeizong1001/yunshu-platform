/**
 * 通知 API
 */
import request from '@/utils/request';
export const getNotificationList = (params) => {
  return request({
    url: '/system/notification/list',
    method: 'get',
    params,
  });
};
export const getNotificationPage = (params) => {
  return request({
    url: '/system/notification/page',
    method: 'get',
    params,
  });
};
export const getNotification = (notificationId) => {
  return request({
    url: `/system/notification/${notificationId}`,
    method: 'get',
  });
};
export const createNotification = (data) => {
  return request({
    url: '/system/notification',
    method: 'post',
    data,
  });
};
export const updateNotification = (data) => {
  return request({
    url: '/system/notification',
    method: 'put',
    data,
  });
};
export const deleteNotification = (notificationId) => {
  return request({
    url: `/system/notification/${notificationId}`,
    method: 'delete',
  });
};
export const batchDeleteNotification = (notificationIds) => {
  return request({
    url: '/system/notification/batch',
    method: 'delete',
    data: notificationIds,
  });
};
export const pushNotification = (notificationId) => {
  return request({
    url: `/system/notification/${notificationId}/push`,
    method: 'post',
  });
};
export const recallNotification = (notificationId) => {
  return request({
    url: `/system/notification/${notificationId}/recall`,
    method: 'post',
  });
};
export const getNotificationStats = () => {
  return request({
    url: '/system/notification/stats',
    method: 'get',
  });
};
//# sourceMappingURL=notification.api.js.map

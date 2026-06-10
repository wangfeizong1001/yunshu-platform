/**
 * 通知 API
 */

import request from '@/utils/request';

export interface NotificationQuery {
  pageNum?: number;
  pageSize?: number;
  title?: string;
  type?: string;
  status?: string;
  level?: string;
}

export interface NotificationForm {
  notificationId?: number;
  title?: string;
  content?: string;
  type?: string;
  level?: string;
  targetType?: string;
  targetIds?: number[];
  isPushed?: boolean;
  pushTime?: string;
  expireTime?: string;
}

export interface NotificationInfo {
  notificationId: number;
  title: string;
  content: string;
  type: string;
  level: string;
  status: string;
  targetType: string;
  targetIds?: number[];
  isPushed: boolean;
  pushTime?: string;
  expireTime?: string;
  createBy: string;
  createTime: string;
  updateTime?: string;
}

export const getNotificationList = (params?: NotificationQuery) => {
  return request({
    url: '/system/notification/list',
    method: 'get',
    params,
  });
};

export const getNotificationPage = (params?: NotificationQuery) => {
  return request({
    url: '/system/notification/page',
    method: 'get',
    params,
  });
};

export const getNotification = (notificationId: number) => {
  return request({
    url: `/system/notification/${notificationId}`,
    method: 'get',
  });
};

export const createNotification = (data: NotificationForm) => {
  return request({
    url: '/system/notification',
    method: 'post',
    data,
  });
};

export const updateNotification = (data: NotificationForm) => {
  return request({
    url: '/system/notification',
    method: 'put',
    data,
  });
};

export const deleteNotification = (notificationId: number) => {
  return request({
    url: `/system/notification/${notificationId}`,
    method: 'delete',
  });
};

export const batchDeleteNotification = (notificationIds: number[]) => {
  return request({
    url: '/system/notification/batch',
    method: 'delete',
    data: notificationIds,
  });
};

export const pushNotification = (notificationId: number) => {
  return request({
    url: `/system/notification/${notificationId}/push`,
    method: 'post',
  });
};

export const recallNotification = (notificationId: number) => {
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

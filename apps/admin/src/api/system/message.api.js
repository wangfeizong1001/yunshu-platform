/**
 * 站内消息 API
 */
import request from '@/utils/request';
export const getMessageList = (params) => {
  return request({
    url: '/system/message/list',
    method: 'get',
    params,
  });
};
export const getMessagePage = (params) => {
  return request({
    url: '/system/message/page',
    method: 'get',
    params,
  });
};
export const getUnreadMessageCount = () => {
  return request({
    url: '/system/message/unread/count',
    method: 'get',
  });
};
export const getMessage = (messageId) => {
  return request({
    url: `/system/message/${messageId}`,
    method: 'get',
  });
};
export const sendMessage = (data) => {
  return request({
    url: '/system/message',
    method: 'post',
    data,
  });
};
export const deleteMessage = (messageId) => {
  return request({
    url: `/system/message/${messageId}`,
    method: 'delete',
  });
};
export const batchDeleteMessage = (messageIds) => {
  return request({
    url: '/system/message/batch',
    method: 'delete',
    data: messageIds,
  });
};
export const markAsRead = (messageId) => {
  return request({
    url: `/system/message/${messageId}/read`,
    method: 'put',
  });
};
export const markAllAsRead = () => {
  return request({
    url: '/system/message/read-all',
    method: 'put',
  });
};
export const getSentMessages = (params) => {
  return request({
    url: '/system/message/sent',
    method: 'get',
    params,
  });
};
//# sourceMappingURL=message.api.js.map

/**
 * 站内消息 API
 */
import { request } from '@/utils/httpClient';
export const getMessageList = (params) => {
    return request({
        url: '/system/message/list',
        method: 'GET',
        params
    });
};
export const getMessagePage = (params) => {
    return request({
        url: '/system/message/page',
        method: 'GET',
        params
    });
};
export const getUnreadMessageCount = () => {
    return request({
        url: '/system/message/unread/count',
        method: 'GET'
    });
};
export const getMessage = (messageId) => {
    return request({
        url: `/system/message/${messageId}`,
        method: 'GET'
    });
};
export const sendMessage = (data) => {
    return request({
        url: '/system/message',
        method: 'POST',
        data
    });
};
export const deleteMessage = (messageId) => {
    return request({
        url: `/system/message/${messageId}`,
        method: 'DELETE'
    });
};
export const batchDeleteMessage = (messageIds) => {
    return request({
        url: '/system/message/batch',
        method: 'DELETE',
        data: messageIds
    });
};
export const markAsRead = (messageId) => {
    return request({
        url: `/system/message/${messageId}/read`,
        method: 'PUT'
    });
};
export const markAllAsRead = () => {
    return request({
        url: '/system/message/read-all',
        method: 'PUT'
    });
};
export const getSentMessages = (params) => {
    return request({
        url: '/system/message/sent',
        method: 'GET',
        params
    });
};
//# sourceMappingURL=message.api.js.map
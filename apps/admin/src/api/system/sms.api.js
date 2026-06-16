/**
 * 短信服务 API
 */
import { request } from '@/utils/httpClient';
export const getSmsList = (params) => {
    return request({
        url: '/system/sms/list',
        method: 'GET',
        params
    });
};
export const getSmsPage = (params) => {
    return request({
        url: '/system/sms/page',
        method: 'GET',
        params
    });
};
export const getSms = (smsId) => {
    return request({
        url: `/system/sms/${smsId}`,
        method: 'GET'
    });
};
export const getSmsConfig = () => {
    return request({
        url: '/system/sms/config',
        method: 'GET'
    });
};
export const saveSmsConfig = (data) => {
    return request({
        url: '/system/sms/config',
        method: 'POST',
        data
    });
};
export const sendSms = (phone, content) => {
    return request({
        url: '/system/sms/send',
        method: 'POST',
        data: { phone, content }
    });
};
export const getSmsLogList = (params) => {
    return request({
        url: '/system/sms/log/page',
        method: 'GET',
        params
    });
};
//# sourceMappingURL=sms.api.js.map
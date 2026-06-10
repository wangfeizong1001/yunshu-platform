/**
 * 短信服务 API
 */
import request from '@/utils/request';
export const getSmsList = (params) => {
  return request({
    url: '/system/sms/list',
    method: 'get',
    params,
  });
};
export const getSmsPage = (params) => {
  return request({
    url: '/system/sms/page',
    method: 'get',
    params,
  });
};
export const getSms = (smsId) => {
  return request({
    url: `/system/sms/${smsId}`,
    method: 'get',
  });
};
export const getSmsConfig = () => {
  return request({
    url: '/system/sms/config',
    method: 'get',
  });
};
export const saveSmsConfig = (data) => {
  return request({
    url: '/system/sms/config',
    method: 'post',
    data,
  });
};
export const sendSms = (phone, content) => {
  return request({
    url: '/system/sms/send',
    method: 'post',
    data: { phone, content },
  });
};
// 获取短信日志列表
export const getSmsLogList = (params) => {
  return request({
    url: '/system/sms/log/page',
    method: 'get',
    params,
  });
};
//# sourceMappingURL=sms.api.js.map

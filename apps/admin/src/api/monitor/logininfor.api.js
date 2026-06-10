/**
 * 登录日志 API
 */
import request from '@/utils/request';
export const getLogininforList = (params) => {
  return request({
    url: '/monitor/logininfor/list',
    method: 'get',
    params,
  });
};
export const getLogininforPage = (params) => {
  return request({
    url: '/monitor/logininfor/page',
    method: 'get',
    params,
  });
};
export const getLogininfor = (infoId) => {
  return request({
    url: `/monitor/logininfor/${infoId}`,
    method: 'get',
  });
};
export const deleteLogininfor = (infoId) => {
  return request({
    url: `/monitor/logininfor/${infoId}`,
    method: 'delete',
  });
};
export const batchDeleteLogininfor = (infoIds) => {
  return request({
    url: '/monitor/logininfor/batch',
    method: 'delete',
    data: infoIds,
  });
};
export const cleanLogininfor = () => {
  return request({
    url: '/monitor/logininfor/clean',
    method: 'delete',
  });
};
export const unlockUser = (userName) => {
  return request({
    url: '/monitor/logininfor/unlock',
    method: 'post',
    params: { userName },
  });
};
export const exportLogininfor = (params) => {
  return request({
    url: '/monitor/logininfor/export',
    method: 'get',
    params,
    responseType: 'blob',
  });
};
//# sourceMappingURL=logininfor.api.js.map

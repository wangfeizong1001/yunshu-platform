/**
 * 在线用户 API
 */
import request from '@/utils/request';
export const getOnlineList = (params) => {
  return request({
    url: '/monitor/online/list',
    method: 'get',
    params,
  });
};
export const getOnlinePage = (params) => {
  return request({
    url: '/monitor/online/page',
    method: 'get',
    params,
  });
};
export const forceLogout = (tokenId) => {
  return request({
    url: `/monitor/online/${tokenId}`,
    method: 'delete',
  });
};
export const batchForceLogout = (tokenIds) => {
  return request({
    url: '/monitor/online/batch',
    method: 'delete',
    data: tokenIds,
  });
};
//# sourceMappingURL=online.api.js.map

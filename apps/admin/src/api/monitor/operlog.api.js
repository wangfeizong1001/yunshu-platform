/**
 * 操作日志 API
 */
import request from '@/utils/request';
export const getOperlogList = (params) => {
  return request({
    url: '/monitor/operlog/list',
    method: 'get',
    params,
  });
};
export const getOperlogPage = (params) => {
  return request({
    url: '/monitor/operlog/page',
    method: 'get',
    params,
  });
};
export const getOperlog = (operId) => {
  return request({
    url: `/monitor/operlog/${operId}`,
    method: 'get',
  });
};
export const deleteOperlog = (operId) => {
  return request({
    url: `/monitor/operlog/${operId}`,
    method: 'delete',
  });
};
export const batchDeleteOperlog = (operIds) => {
  return request({
    url: '/monitor/operlog/batch',
    method: 'delete',
    data: operIds,
  });
};
export const cleanOperlog = () => {
  return request({
    url: '/monitor/operlog/clean',
    method: 'delete',
  });
};
//# sourceMappingURL=operlog.api.js.map

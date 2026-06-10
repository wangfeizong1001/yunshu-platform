/**
 * 参数配置 API
 */
import request from '@/utils/request';
export const getConfigList = (params) => {
  return request({
    url: '/system/config/list',
    method: 'get',
    params,
  });
};
export const getConfigPage = (params) => {
  return request({
    url: '/system/config/page',
    method: 'get',
    params,
  });
};
export const getConfig = (configId) => {
  return request({
    url: `/system/config/${configId}`,
    method: 'get',
  });
};
export const getConfigValue = (configKey) => {
  return request({
    url: `/system/config/configKey/${configKey}`,
    method: 'get',
  });
};
export const addConfig = (data) => {
  return request({
    url: '/system/config',
    method: 'post',
    data,
  });
};
export const updateConfig = (data) => {
  return request({
    url: '/system/config',
    method: 'put',
    data,
  });
};
export const deleteConfig = (configId) => {
  return request({
    url: `/system/config/${configId}`,
    method: 'delete',
  });
};
export const batchDeleteConfig = (configIds) => {
  return request({
    url: '/system/config/batch',
    method: 'delete',
    data: configIds,
  });
};
export const refreshConfigCache = () => {
  return request({
    url: '/system/config/refreshCache',
    method: 'delete',
  });
};
export const exportConfig = (params) => {
  return request({
    url: '/system/config/export',
    method: 'get',
    params,
    responseType: 'blob',
  });
};
//# sourceMappingURL=config.api.js.map

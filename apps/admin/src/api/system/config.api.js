/**
 * 参数配置 API
 */
import { request } from '@/utils/httpClient';
export const getConfigList = (params) => {
    return request({
        url: '/system/config/list',
        method: 'GET',
        params
    });
};
export const getConfigPage = (params) => {
    return request({
        url: '/system/config/page',
        method: 'GET',
        params
    });
};
export const getConfig = (configId) => {
    return request({
        url: `/system/config/${configId}`,
        method: 'GET'
    });
};
export const getConfigValue = (configKey) => {
    return request({
        url: `/system/config/configKey/${configKey}`,
        method: 'GET'
    });
};
export const addConfig = (data) => {
    return request({
        url: '/system/config',
        method: 'POST',
        data
    });
};
export const updateConfig = (data) => {
    return request({
        url: '/system/config',
        method: 'PUT',
        data
    });
};
export const deleteConfig = (configId) => {
    return request({
        url: `/system/config/${configId}`,
        method: 'DELETE'
    });
};
export const batchDeleteConfig = (configIds) => {
    return request({
        url: '/system/config/batch',
        method: 'DELETE',
        data: configIds
    });
};
export const refreshConfigCache = () => {
    return request({
        url: '/system/config/refreshCache',
        method: 'DELETE'
    });
};
export const exportConfig = (params) => {
    return request({
        url: '/system/config/export',
        method: 'GET',
        params,
        responseType: 'blob'
    });
};
//# sourceMappingURL=config.api.js.map
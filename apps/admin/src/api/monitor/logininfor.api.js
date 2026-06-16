/**
 * 登录日志 API
 */
import { request } from '@/utils/httpClient';
export const getLogininforList = (params) => {
    return request({
        url: '/monitor/logininfor/list',
        method: 'GET',
        params
    });
};
export const getLogininforPage = (params) => {
    return request({
        url: '/monitor/logininfor/page',
        method: 'GET',
        params
    });
};
export const getLogininfor = (infoId) => {
    return request({
        url: `/monitor/logininfor/${infoId}`,
        method: 'GET'
    });
};
export const deleteLogininfor = (infoId) => {
    return request({
        url: `/monitor/logininfor/${infoId}`,
        method: 'DELETE'
    });
};
export const batchDeleteLogininfor = (infoIds) => {
    return request({
        url: '/monitor/logininfor/batch',
        method: 'DELETE',
        data: infoIds
    });
};
export const cleanLogininfor = () => {
    return request({
        url: '/monitor/logininfor/clean',
        method: 'DELETE'
    });
};
export const unlockUser = (userName) => {
    return request({
        url: '/monitor/logininfor/unlock',
        method: 'POST',
        params: { userName }
    });
};
export const exportLogininfor = (params) => {
    return request({
        url: '/monitor/logininfor/export',
        method: 'GET',
        params,
        responseType: 'blob'
    });
};
//# sourceMappingURL=logininfor.api.js.map
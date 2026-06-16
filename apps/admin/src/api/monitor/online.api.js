/**
 * 在线用户 API
 */
import { request } from '@/utils/httpClient';
export const getOnlineList = (params) => {
    return request({
        url: '/monitor/online/list',
        method: 'GET',
        params
    });
};
export const getOnlinePage = (params) => {
    return request({
        url: '/monitor/online/page',
        method: 'GET',
        params
    });
};
export const forceLogout = (tokenId) => {
    return request({
        url: `/monitor/online/${tokenId}`,
        method: 'DELETE'
    });
};
export const batchForceLogout = (tokenIds) => {
    return request({
        url: '/monitor/online/batch',
        method: 'DELETE',
        data: tokenIds
    });
};
//# sourceMappingURL=online.api.js.map
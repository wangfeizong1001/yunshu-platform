/**
 * 操作日志 API
 */
import { request } from '@/utils/httpClient';
export const getOperlogList = (params) => {
    return request({
        url: '/monitor/operlog/list',
        method: 'GET',
        params
    });
};
export const getOperlogPage = (params) => {
    return request({
        url: '/monitor/operlog/page',
        method: 'GET',
        params
    });
};
export const getOperlog = (operId) => {
    return request({
        url: `/monitor/operlog/${operId}`,
        method: 'GET'
    });
};
export const deleteOperlog = (operId) => {
    return request({
        url: `/monitor/operlog/${operId}`,
        method: 'DELETE'
    });
};
export const batchDeleteOperlog = (operIds) => {
    return request({
        url: '/monitor/operlog/batch',
        method: 'DELETE',
        data: operIds
    });
};
export const cleanOperlog = () => {
    return request({
        url: '/monitor/operlog/clean',
        method: 'DELETE'
    });
};
//# sourceMappingURL=operlog.api.js.map
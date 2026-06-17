/**
 * 字典管理 API
 */
import { request } from '@/utils/httpClient';
export const getDictTypeList = (params) => {
    return request({
        url: '/system/dict/type/list',
        method: 'GET',
        params
    });
};
export const getDictTypePage = (params) => {
    return request({
        url: '/system/dict/type/page',
        method: 'GET',
        params
    });
};
export const getDictType = (dictId) => {
    return request({
        url: `/system/dict/type/${dictId}`,
        method: 'GET'
    });
};
export const getDictTypeAll = () => {
    return request({
        url: '/system/dict/type/all',
        method: 'GET'
    });
};
export const getDictTypeOptions = (dictType) => {
    return request({
        url: `/system/dict/type/options/${dictType}`,
        method: 'GET'
    });
};
export const addDictType = (data) => {
    return request({
        url: '/system/dict/type',
        method: 'POST',
        data
    });
};
export const updateDictType = (data) => {
    return request({
        url: '/system/dict/type',
        method: 'PUT',
        data
    });
};
export const deleteDictType = (dictId) => {
    return request({
        url: `/system/dict/type/${dictId}`,
        method: 'DELETE'
    });
};
export const batchDeleteDictType = (dictIds) => {
    return request({
        url: '/system/dict/type/batch',
        method: 'DELETE',
        data: dictIds
    });
};
export const refreshDictCache = () => {
    return request({
        url: '/system/dict/type/refreshCache',
        method: 'DELETE'
    });
};
export const getDictDataList = (params) => {
    return request({
        url: '/system/dict/data/list',
        method: 'GET',
        params
    });
};
export const getDictDataPage = (params) => {
    return request({
        url: '/system/dict/data/page',
        method: 'GET',
        params
    });
};
export const getDictData = (dictCode) => {
    return request({
        url: `/system/dict/data/${dictCode}`,
        method: 'GET'
    });
};
export const addDictData = (data) => {
    return request({
        url: '/system/dict/data',
        method: 'POST',
        data
    });
};
export const updateDictData = (data) => {
    return request({
        url: '/system/dict/data',
        method: 'PUT',
        data
    });
};
export const deleteDictData = (dictCode) => {
    return request({
        url: `/system/dict/data/${dictCode}`,
        method: 'DELETE'
    });
};
export const getDictDataByType = (dictType) => {
    return request({
        url: `/system/dict/data/type/${dictType}`,
        method: 'GET'
    });
};
export const exportDictType = (params) => {
    return request({
        url: '/system/dict/type/export',
        method: 'GET',
        params,
        responseType: 'blob'
    });
};
export const exportDictData = (dictType) => {
    return request({
        url: '/system/dict/data/export',
        method: 'GET',
        params: { dictType },
        responseType: 'blob'
    });
};
//# sourceMappingURL=dict.api.js.map
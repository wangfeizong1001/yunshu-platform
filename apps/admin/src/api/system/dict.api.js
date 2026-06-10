/**
 * 字典管理 API
 */
import request from '@/utils/request';
export const getDictTypeList = (params) => {
  return request({
    url: '/system/dict/type/list',
    method: 'get',
    params,
  });
};
export const getDictTypePage = (params) => {
  return request({
    url: '/system/dict/type/page',
    method: 'get',
    params,
  });
};
export const getDictType = (dictId) => {
  return request({
    url: `/system/dict/type/${dictId}`,
    method: 'get',
  });
};
export const getDictTypeAll = () => {
  return request({
    url: '/system/dict/type/all',
    method: 'get',
  });
};
export const getDictTypeOptions = (dictType) => {
  return request({
    url: `/system/dict/type/options/${dictType}`,
    method: 'get',
  });
};
export const addDictType = (data) => {
  return request({
    url: '/system/dict/type',
    method: 'post',
    data,
  });
};
export const updateDictType = (data) => {
  return request({
    url: '/system/dict/type',
    method: 'put',
    data,
  });
};
export const deleteDictType = (dictId) => {
  return request({
    url: `/system/dict/type/${dictId}`,
    method: 'delete',
  });
};
export const batchDeleteDictType = (dictIds) => {
  return request({
    url: '/system/dict/type/batch',
    method: 'delete',
    data: dictIds,
  });
};
export const refreshDictCache = () => {
  return request({
    url: '/system/dict/type/refreshCache',
    method: 'delete',
  });
};
export const getDictDataList = (params) => {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params,
  });
};
export const getDictDataPage = (params) => {
  return request({
    url: '/system/dict/data/page',
    method: 'get',
    params,
  });
};
export const getDictData = (dictCode) => {
  return request({
    url: `/system/dict/data/${dictCode}`,
    method: 'get',
  });
};
export const addDictData = (data) => {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data,
  });
};
export const updateDictData = (data) => {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data,
  });
};
export const deleteDictData = (dictCode) => {
  return request({
    url: `/system/dict/data/${dictCode}`,
    method: 'delete',
  });
};
export const getDictDataByType = (dictType) => {
  return request({
    url: `/system/dict/data/type/${dictType}`,
    method: 'get',
  });
};
export const exportDictType = (params) => {
  return request({
    url: '/system/dict/type/export',
    method: 'get',
    params,
    responseType: 'blob',
  });
};
export const exportDictData = (dictType) => {
  return request({
    url: '/system/dict/data/export',
    method: 'get',
    params: { dictType },
    responseType: 'blob',
  });
};
//# sourceMappingURL=dict.api.js.map

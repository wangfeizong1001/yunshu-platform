/**
 * OSS文件存储 API
 */
import request from '@/utils/request';
export const getOssList = (params) => {
  return request({
    url: '/system/oss/list',
    method: 'get',
    params,
  });
};
export const getOssPage = (params) => {
  return request({
    url: '/system/oss/page',
    method: 'get',
    params,
  });
};
export const getOss = (ossId) => {
  return request({
    url: `/system/oss/${ossId}`,
    method: 'get',
  });
};
export const getOssConfig = () => {
  return request({
    url: '/system/oss/config',
    method: 'get',
  });
};
export const uploadOss = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/system/oss/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteOss = (ossId) => {
  return request({
    url: `/system/oss/${ossId}`,
    method: 'delete',
  });
};
export const batchDeleteOss = (ossIds) => {
  return request({
    url: '/system/oss/batch',
    method: 'delete',
    data: ossIds,
  });
};
export const downloadOss = (ossId) => {
  return request({
    url: `/system/oss/download/${ossId}`,
    method: 'get',
    responseType: 'blob',
  });
};
//# sourceMappingURL=oss.api.js.map

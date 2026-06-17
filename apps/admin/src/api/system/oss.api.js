/**
 * OSS文件存储 API
 */
import { request } from '@/utils/httpClient';
export const getOssList = (params) => {
    return request({
        url: '/system/oss/list',
        method: 'GET',
        params
    });
};
export const getOssPage = (params) => {
    return request({
        url: '/system/oss/page',
        method: 'GET',
        params
    });
};
export const getOss = (ossId) => {
    return request({
        url: `/system/oss/${ossId}`,
        method: 'GET'
    });
};
export const getOssConfig = () => {
    return request({
        url: '/system/oss/config',
        method: 'GET'
    });
};
export const uploadOss = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request({
        url: '/system/oss/upload',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const deleteOss = (ossId) => {
    return request({
        url: `/system/oss/${ossId}`,
        method: 'DELETE'
    });
};
export const batchDeleteOss = (ossIds) => {
    return request({
        url: '/system/oss/batch',
        method: 'DELETE',
        data: ossIds
    });
};
export const downloadOss = (ossId) => {
    return request({
        url: `/system/oss/download/${ossId}`,
        method: 'GET',
        responseType: 'blob'
    });
};
//# sourceMappingURL=oss.api.js.map
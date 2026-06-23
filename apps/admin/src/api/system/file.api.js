/**
 * 文件管理 API
 */
import { request } from '@/utils/httpClient';
export const getFileList = (params) => {
    return request({
        url: '/system/file/list',
        method: 'GET',
        params
    });
};
export const getFilePage = (params) => {
    return request({
        url: '/system/file/page',
        method: 'GET',
        params
    });
};
export const getFile = (fileId) => {
    return request({
        url: `/system/file/${fileId}`,
        method: 'GET'
    });
};
export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request({
        url: '/system/file/upload',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const deleteFile = (fileId) => {
    return request({
        url: `/system/file/${fileId}`,
        method: 'DELETE'
    });
};
export const batchDeleteFile = (fileIds) => {
    return request({
        url: '/system/file/batch',
        method: 'DELETE',
        data: fileIds
    });
};
export const downloadFile = (fileId) => {
    return request({
        url: `/system/file/download/${fileId}`,
        method: 'GET',
        responseType: 'blob'
    });
};
export const previewFile = (fileId) => {
    return request({
        url: `/system/file/preview/${fileId}`,
        method: 'GET'
    });
};
//# sourceMappingURL=file.api.js.map
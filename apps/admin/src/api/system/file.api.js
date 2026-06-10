/**
 * 文件管理 API
 */
import request from '@/utils/request';
export const getFileList = (params) => {
    return request({
        url: '/system/file/list',
        method: 'get',
        params
    });
};
export const getFilePage = (params) => {
    return request({
        url: '/system/file/page',
        method: 'get',
        params
    });
};
export const getFile = (fileId) => {
    return request({
        url: `/system/file/${fileId}`,
        method: 'get'
    });
};
export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request({
        url: '/system/file/upload',
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const deleteFile = (fileId) => {
    return request({
        url: `/system/file/${fileId}`,
        method: 'delete'
    });
};
export const batchDeleteFile = (fileIds) => {
    return request({
        url: '/system/file/batch',
        method: 'delete',
        data: fileIds
    });
};
export const downloadFile = (fileId) => {
    return request({
        url: `/system/file/download/${fileId}`,
        method: 'get',
        responseType: 'blob'
    });
};
export const previewFile = (fileId) => {
    return request({
        url: `/system/file/preview/${fileId}`,
        method: 'get'
    });
};
//# sourceMappingURL=file.api.js.map
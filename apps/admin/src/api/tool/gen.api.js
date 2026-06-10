/**
 * 代码生成器 API
 */
import request from '@/utils/request';
/**
 * 获取表列表（分页）
 */
export const getGenTablePage = (params) => {
    return request({
        url: '/tool/gen/page',
        method: 'get',
        params
    });
};
/**
 * 获取数据库表列表（未导入）
 */
export const getGenDbList = (params) => {
    return request({
        url: '/tool/gen/db/list',
        method: 'get',
        params
    });
};
/**
 * 获取表详细配置
 */
export const getGenConfig = (tableName) => {
    return request({
        url: `/tool/gen/config/${tableName}`,
        method: 'get'
    });
};
/**
 * 保存表配置
 */
export const saveGenConfig = (data) => {
    return request({
        url: '/tool/gen/config',
        method: 'post',
        data
    });
};
/**
 * 导入表
 */
export const importGenTable = (tableNames) => {
    return request({
        url: '/tool/gen/import',
        method: 'post',
        data: { tableNames }
    });
};
/**
 * 同步表结构
 */
export const syncTable = (tableName) => {
    return request({
        url: `/tool/gen/sync/${tableName}`,
        method: 'post'
    });
};
/**
 * 预览代码
 */
export const previewCode = (config) => {
    return request({
        url: '/tool/gen/preview',
        method: 'post',
        data: config
    });
};
/**
 * 下载代码
 */
export const downloadCode = (tableName, config) => {
    return request({
        url: '/tool/gen/download',
        method: 'post',
        data: config || { tableName },
        responseType: 'blob'
    });
};
/**
 * 删除表配置
 */
export const deleteGenTable = (tableNames) => {
    return request({
        url: '/tool/gen/delete',
        method: 'delete',
        data: { tableNames }
    });
};
/**
 * 批量生成代码
 */
export const batchGenerate = (tableNames) => {
    return request({
        url: '/tool/gen/batch',
        method: 'post',
        data: { tableNames }
    });
};
/**
 * 获取模板列表
 */
export const getTemplateList = () => {
    return request({
        url: '/tool/gen/templates',
        method: 'get'
    });
};
/**
 * 保存自定义模板
 */
export const saveTemplate = (templateName, content) => {
    return request({
        url: '/tool/gen/template',
        method: 'post',
        data: { templateName, content }
    });
};
/**
 * 重置模板为默认
 */
export const resetTemplate = (templateName) => {
    return request({
        url: `/tool/gen/template/reset/${templateName}`,
        method: 'post'
    });
};
//# sourceMappingURL=gen.api.js.map
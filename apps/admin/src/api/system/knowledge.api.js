/**
 * 知识库 API
 */
import { request } from '@/utils/httpClient';
export const getKnowledgePage = (params) => {
    return request({
        url: '/system/knowledge/page',
        method: 'GET',
        params
    });
};
export const getKnowledgeList = (params) => {
    return request({
        url: '/system/knowledge/list',
        method: 'GET',
        params
    });
};
export const getKnowledge = (knowledgeId) => {
    return request({
        url: `/system/knowledge/${knowledgeId}`,
        method: 'GET'
    });
};
export const addKnowledge = (data) => {
    return request({
        url: '/system/knowledge',
        method: 'POST',
        data
    });
};
export const updateKnowledge = (data) => {
    return request({
        url: '/system/knowledge',
        method: 'PUT',
        data
    });
};
export const deleteKnowledge = (knowledgeId) => {
    return request({
        url: `/system/knowledge/${knowledgeId}`,
        method: 'DELETE'
    });
};
export const batchDeleteKnowledge = (knowledgeIds) => {
    return request({
        url: '/system/knowledge/batch',
        method: 'DELETE',
        data: knowledgeIds
    });
};
export const publishKnowledge = (knowledgeId) => {
    return request({
        url: `/system/knowledge/publish/${knowledgeId}`,
        method: 'PUT'
    });
};
export const withdrawKnowledge = (knowledgeId) => {
    return request({
        url: `/system/knowledge/withdraw/${knowledgeId}`,
        method: 'PUT'
    });
};
export const getCategoryList = () => {
    return request({
        url: '/system/knowledge/category/list',
        method: 'GET'
    });
};
export const getCategoryTree = () => {
    return request({
        url: '/system/knowledge/category/tree',
        method: 'GET'
    });
};
export const addCategory = (data) => {
    return request({
        url: '/system/knowledge/category',
        method: 'POST',
        data
    });
};
export const updateCategory = (data) => {
    return request({
        url: '/system/knowledge/category',
        method: 'PUT',
        data
    });
};
export const deleteCategory = (categoryId) => {
    return request({
        url: `/system/knowledge/category/${categoryId}`,
        method: 'DELETE'
    });
};
//# sourceMappingURL=knowledge.api.js.map
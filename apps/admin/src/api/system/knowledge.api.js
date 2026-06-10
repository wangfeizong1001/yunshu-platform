/**
 * 知识库 API
 */
import request from '@/utils/request';
export const getKnowledgePage = (params) => {
  return request({
    url: '/system/knowledge/page',
    method: 'get',
    params,
  });
};
export const getKnowledgeList = (params) => {
  return request({
    url: '/system/knowledge/list',
    method: 'get',
    params,
  });
};
export const getKnowledge = (knowledgeId) => {
  return request({
    url: `/system/knowledge/${knowledgeId}`,
    method: 'get',
  });
};
export const addKnowledge = (data) => {
  return request({
    url: '/system/knowledge',
    method: 'post',
    data,
  });
};
export const updateKnowledge = (data) => {
  return request({
    url: '/system/knowledge',
    method: 'put',
    data,
  });
};
export const deleteKnowledge = (knowledgeId) => {
  return request({
    url: `/system/knowledge/${knowledgeId}`,
    method: 'delete',
  });
};
export const batchDeleteKnowledge = (knowledgeIds) => {
  return request({
    url: '/system/knowledge/batch',
    method: 'delete',
    data: knowledgeIds,
  });
};
export const publishKnowledge = (knowledgeId) => {
  return request({
    url: `/system/knowledge/publish/${knowledgeId}`,
    method: 'put',
  });
};
export const withdrawKnowledge = (knowledgeId) => {
  return request({
    url: `/system/knowledge/withdraw/${knowledgeId}`,
    method: 'put',
  });
};
export const getCategoryList = () => {
  return request({
    url: '/system/knowledge/category/list',
    method: 'get',
  });
};
export const getCategoryTree = () => {
  return request({
    url: '/system/knowledge/category/tree',
    method: 'get',
  });
};
export const addCategory = (data) => {
  return request({
    url: '/system/knowledge/category',
    method: 'post',
    data,
  });
};
export const updateCategory = (data) => {
  return request({
    url: '/system/knowledge/category',
    method: 'put',
    data,
  });
};
export const deleteCategory = (categoryId) => {
  return request({
    url: `/system/knowledge/category/${categoryId}`,
    method: 'delete',
  });
};
//# sourceMappingURL=knowledge.api.js.map

/**
 * 知识库 API
 */

import request from '@/utils/request';

export interface KnowledgeQuery {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
  status?: string;
  visible?: string;
}

export interface KnowledgeForm {
  knowledgeId?: number;
  title?: string;
  categoryId?: number;
  categoryName?: string;
  content?: string;
  summary?: string;
  coverUrl?: string;
  tags?: string;
  status?: string;
  visible?: string;
  sort?: number;
  remark?: string;
}

export interface KnowledgeInfo {
  knowledgeId: number;
  title: string;
  categoryId: number;
  categoryName: string;
  content: string;
  summary: string;
  coverUrl: string;
  tags: string;
  status: string;
  visible: string;
  sort: number;
  viewCount: number;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  remark: string;
}

export interface KnowledgeCategory {
  categoryId: number;
  categoryName: string;
  parentId: number;
  sort: number;
  status: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  remark: string;
}

export const getKnowledgePage = (params?: KnowledgeQuery) => {
  return request({
    url: '/system/knowledge/page',
    method: 'get',
    params,
  });
};

export const getKnowledgeList = (params?: KnowledgeQuery) => {
  return request({
    url: '/system/knowledge/list',
    method: 'get',
    params,
  });
};

export const getKnowledge = (knowledgeId: number) => {
  return request({
    url: `/system/knowledge/${knowledgeId}`,
    method: 'get',
  });
};

export const addKnowledge = (data: KnowledgeForm) => {
  return request({
    url: '/system/knowledge',
    method: 'post',
    data,
  });
};

export const updateKnowledge = (data: KnowledgeForm) => {
  return request({
    url: '/system/knowledge',
    method: 'put',
    data,
  });
};

export const deleteKnowledge = (knowledgeId: number) => {
  return request({
    url: `/system/knowledge/${knowledgeId}`,
    method: 'delete',
  });
};

export const batchDeleteKnowledge = (knowledgeIds: number[]) => {
  return request({
    url: '/system/knowledge/batch',
    method: 'delete',
    data: knowledgeIds,
  });
};

export const publishKnowledge = (knowledgeId: number) => {
  return request({
    url: `/system/knowledge/publish/${knowledgeId}`,
    method: 'put',
  });
};

export const withdrawKnowledge = (knowledgeId: number) => {
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

export const addCategory = (data: Partial<KnowledgeCategory>) => {
  return request({
    url: '/system/knowledge/category',
    method: 'post',
    data,
  });
};

export const updateCategory = (data: Partial<KnowledgeCategory>) => {
  return request({
    url: '/system/knowledge/category',
    method: 'put',
    data,
  });
};

export const deleteCategory = (categoryId: number) => {
  return request({
    url: `/system/knowledge/category/${categoryId}`,
    method: 'delete',
  });
};

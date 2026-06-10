/**
 * 知识库 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface KnowledgeQuery {
  pageNum?: number
  pageSize?: number
  keyword?: string
  categoryId?: number
  status?: string
  visible?: string
}

export interface KnowledgeForm {
  knowledgeId?: number
  title?: string
  categoryId?: number
  categoryName?: string
  content?: string
  summary?: string
  coverUrl?: string
  tags?: string
  status?: string
  visible?: string
  sort?: number
  remark?: string
}

export interface KnowledgeInfo {
  knowledgeId: number
  title: string
  categoryId: number
  categoryName: string
  content: string
  summary: string
  coverUrl: string
  tags: string
  status: string
  visible: string
  sort: number
  viewCount: number
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  remark: string
}

export interface KnowledgeCategory {
  categoryId: number
  categoryName: string
  parentId: number
  sort: number
  status: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  remark: string
}

export const getKnowledgePage = (params?: KnowledgeQuery) => {
  return request<{ rows: KnowledgeInfo[]; total: number }>({
    url: '/system/knowledge/page',
    method: 'GET',
    params
  })
}

export const getKnowledgeList = (params?: KnowledgeQuery) => {
  return request<{ rows: KnowledgeInfo[]; total: number }>({
    url: '/system/knowledge/list',
    method: 'GET',
    params
  })
}

export const getKnowledge = (knowledgeId: number) => {
  return request<KnowledgeInfo>({
    url: `/system/knowledge/${knowledgeId}`,
    method: 'GET'
  })
}

export const addKnowledge = (data: KnowledgeForm) => {
  return request<void>({
    url: '/system/knowledge',
    method: 'POST',
    data
  })
}

export const updateKnowledge = (data: KnowledgeForm) => {
  return request<void>({
    url: '/system/knowledge',
    method: 'PUT',
    data
  })
}

export const deleteKnowledge = (knowledgeId: number) => {
  return request<void>({
    url: `/system/knowledge/${knowledgeId}`,
    method: 'DELETE'
  })
}

export const batchDeleteKnowledge = (knowledgeIds: number[]) => {
  return request<void>({
    url: '/system/knowledge/batch',
    method: 'DELETE',
    data: knowledgeIds
  })
}

export const publishKnowledge = (knowledgeId: number) => {
  return request<void>({
    url: `/system/knowledge/publish/${knowledgeId}`,
    method: 'PUT'
  })
}

export const withdrawKnowledge = (knowledgeId: number) => {
  return request<void>({
    url: `/system/knowledge/withdraw/${knowledgeId}`,
    method: 'PUT'
  })
}

export const getCategoryList = () => {
  return request<KnowledgeCategory[]>({
    url: '/system/knowledge/category/list',
    method: 'GET'
  })
}

export const getCategoryTree = () => {
  return request<KnowledgeCategory[]>({
    url: '/system/knowledge/category/tree',
    method: 'GET'
  })
}

export const addCategory = (data: Partial<KnowledgeCategory>) => {
  return request<void>({
    url: '/system/knowledge/category',
    method: 'POST',
    data
  })
}

export const updateCategory = (data: Partial<KnowledgeCategory>) => {
  return request<void>({
    url: '/system/knowledge/category',
    method: 'PUT',
    data
  })
}

export const deleteCategory = (categoryId: number) => {
  return request<void>({
    url: `/system/knowledge/category/${categoryId}`,
    method: 'DELETE'
  })
}

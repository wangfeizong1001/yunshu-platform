/**
 * 岗位管理 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface PostQuery {
  pageNum?: number
  pageSize?: number
  postName?: string
  postCode?: string
  status?: string
}

export interface PostForm {
  postId?: number
  postName?: string
  postCode?: string
  postSort?: number
  status?: string
  remark?: string
}

export interface PostInfo {
  postId: number
  postName: string
  postCode: string
  postSort: number
  status: string
  remark: string
  createTime: string
}

export const getPostList = (params?: PostQuery) => {
  return request<unknown>({
    url: '/system/post/list',
    method: 'GET',
    params
  })
}

export const getPostPage = (params?: PostQuery) => {
  return request<unknown>({
    url: '/system/post/page',
    method: 'GET',
    params
  })
}

export const getPost = (postId: number) => {
  return request<unknown>({
    url: `/system/post/${postId}`,
    method: 'GET'
  })
}

export const addPost = (data: PostForm) => {
  return request<unknown>({
    url: '/system/post',
    method: 'POST',
    data
  })
}

export const updatePost = (data: PostForm) => {
  return request<unknown>({
    url: '/system/post',
    method: 'PUT',
    data
  })
}

export const deletePost = (postId: number) => {
  return request<unknown>({
    url: `/system/post/${postId}`,
    method: 'DELETE'
  })
}

export const batchDeletePost = (postIds: number[]) => {
  return request<unknown>({
    url: '/system/post/batch',
    method: 'DELETE',
    data: postIds
  })
}

export const changePostStatus = (postId: number, status: string) => {
  return request<unknown>({
    url: '/system/post/changeStatus',
    method: 'PUT',
    params: { postId, status }
  })
}

export const getPostSelect = () => {
  return request<unknown>({
    url: '/system/post/select',
    method: 'GET'
  })
}

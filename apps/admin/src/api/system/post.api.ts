/**
 * 岗位管理 API
 */

import request from '@/utils/request'

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
  return request({
    url: '/system/post/list',
    method: 'get',
    params
  })
}

export const getPostPage = (params?: PostQuery) => {
  return request({
    url: '/system/post/page',
    method: 'get',
    params
  })
}

export const getPost = (postId: number) => {
  return request({
    url: `/system/post/${postId}`,
    method: 'get'
  })
}

export const addPost = (data: PostForm) => {
  return request({
    url: '/system/post',
    method: 'post',
    data
  })
}

export const updatePost = (data: PostForm) => {
  return request({
    url: '/system/post',
    method: 'put',
    data
  })
}

export const deletePost = (postId: number) => {
  return request({
    url: `/system/post/${postId}`,
    method: 'delete'
  })
}

export const batchDeletePost = (postIds: number[]) => {
  return request({
    url: '/system/post/batch',
    method: 'delete',
    data: postIds
  })
}

export const changePostStatus = (postId: number, status: string) => {
  return request({
    url: '/system/post/changeStatus',
    method: 'put',
    params: { postId, status }
  })
}

export const getPostSelect = () => {
  return request({
    url: '/system/post/select',
    method: 'get'
  })
}

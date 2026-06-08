/**
 * 岗位管理 API
 */

import { request } from '@/utils/request'
import type {
  SysPost,
  SysPostQuery,
  SysPostForm,
  SysPostPageResp,
} from '@yunshu/shared/types/system'

/**
 * 获取岗位分页列表
 * @param params 查询参数
 */
export function getPostPage(params: SysPostQuery) {
  return request<SysPostPageResp>({
    url: '/system/post/page',
    method: 'get',
    params,
  })
}

/**
 * 获取岗位列表
 * @param params 查询参数
 */
export function getPostList(params?: SysPostQuery) {
  return request<SysPost[]>({
    url: '/system/post/list',
    method: 'get',
    params,
  })
}

/**
 * 获取岗位详情
 * @param postId 岗位ID
 */
export function getPostDetail(postId: number) {
  return request<SysPost>({
    url: `/system/post/${postId}`,
    method: 'get',
  })
}

/**
 * 新增岗位
 * @param data 岗位表单数据
 */
export function addPost(data: SysPostForm) {
  return request<SysPost>({
    url: '/system/post',
    method: 'post',
    data,
  })
}

/**
 * 修改岗位
 * @param postId 岗位ID
 * @param data 岗位表单数据
 */
export function updatePost(postId: number, data: SysPostForm) {
  return request<SysPost>({
    url: `/system/post/${postId}`,
    method: 'put',
    data,
  })
}

/**
 * 删除岗位
 * @param postId 岗位ID
 */
export function deletePost(postId: number) {
  return request<void>({
    url: `/system/post/${postId}`,
    method: 'delete',
  })
}

/**
 * 批量删除岗位
 * @param postIds 岗位ID数组
 */
export function batchDeletePost(postIds: number[]) {
  return request<void>({
    url: '/system/post/batch',
    method: 'delete',
    data: { postIds },
  })
}

/**
 * 修改岗位状态
 * @param postId 岗位ID
 * @param status 状态
 */
export function changePostStatus(postId: number, status: '0' | '1') {
  return request<void>({
    url: `/system/post/${postId}/status`,
    method: 'put',
    data: { status },
  })
}

/**
 * 获取岗位下拉列表
 */
export function getPostSelect() {
  return request<SysPost[]>({
    url: '/system/post/select',
    method: 'get',
  })
}

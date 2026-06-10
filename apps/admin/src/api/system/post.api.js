/**
 * 岗位管理 API
 */
import request from '@/utils/request';
export const getPostList = (params) => {
  return request({
    url: '/system/post/list',
    method: 'get',
    params,
  });
};
export const getPostPage = (params) => {
  return request({
    url: '/system/post/page',
    method: 'get',
    params,
  });
};
export const getPost = (postId) => {
  return request({
    url: `/system/post/${postId}`,
    method: 'get',
  });
};
export const addPost = (data) => {
  return request({
    url: '/system/post',
    method: 'post',
    data,
  });
};
export const updatePost = (data) => {
  return request({
    url: '/system/post',
    method: 'put',
    data,
  });
};
export const deletePost = (postId) => {
  return request({
    url: `/system/post/${postId}`,
    method: 'delete',
  });
};
export const batchDeletePost = (postIds) => {
  return request({
    url: '/system/post/batch',
    method: 'delete',
    data: postIds,
  });
};
export const changePostStatus = (postId, status) => {
  return request({
    url: '/system/post/changeStatus',
    method: 'put',
    params: { postId, status },
  });
};
export const getPostSelect = () => {
  return request({
    url: '/system/post/select',
    method: 'get',
  });
};
//# sourceMappingURL=post.api.js.map

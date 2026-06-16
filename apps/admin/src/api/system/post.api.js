/**
 * 岗位管理 API
 */
import { request } from '@/utils/httpClient';
export const getPostList = (params) => {
    return request({
        url: '/system/post/list',
        method: 'GET',
        params
    });
};
export const getPostPage = (params) => {
    return request({
        url: '/system/post/page',
        method: 'GET',
        params
    });
};
export const getPost = (postId) => {
    return request({
        url: `/system/post/${postId}`,
        method: 'GET'
    });
};
export const addPost = (data) => {
    return request({
        url: '/system/post',
        method: 'POST',
        data
    });
};
export const updatePost = (data) => {
    return request({
        url: '/system/post',
        method: 'PUT',
        data
    });
};
export const deletePost = (postId) => {
    return request({
        url: `/system/post/${postId}`,
        method: 'DELETE'
    });
};
export const batchDeletePost = (postIds) => {
    return request({
        url: '/system/post/batch',
        method: 'DELETE',
        data: postIds
    });
};
export const changePostStatus = (postId, status) => {
    return request({
        url: '/system/post/changeStatus',
        method: 'PUT',
        params: { postId, status }
    });
};
export const getPostSelect = () => {
    return request({
        url: '/system/post/select',
        method: 'GET'
    });
};
//# sourceMappingURL=post.api.js.map
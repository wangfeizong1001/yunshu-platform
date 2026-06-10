/**
 * 岗位管理 API
 */
export interface PostQuery {
  pageNum?: number;
  pageSize?: number;
  postName?: string;
  postCode?: string;
  status?: string;
}
export interface PostForm {
  postId?: number;
  postName?: string;
  postCode?: string;
  postSort?: number;
  status?: string;
  remark?: string;
}
export interface PostInfo {
  postId: number;
  postName: string;
  postCode: string;
  postSort: number;
  status: string;
  remark: string;
  createTime: string;
}
export declare const getPostList: (params?: PostQuery) => Promise<unknown>;
export declare const getPostPage: (params?: PostQuery) => Promise<unknown>;
export declare const getPost: (postId: number) => Promise<unknown>;
export declare const addPost: (data: PostForm) => Promise<unknown>;
export declare const updatePost: (data: PostForm) => Promise<unknown>;
export declare const deletePost: (postId: number) => Promise<unknown>;
export declare const batchDeletePost: (postIds: number[]) => Promise<unknown>;
export declare const changePostStatus: (postId: number, status: string) => Promise<unknown>;
export declare const getPostSelect: () => Promise<unknown>;
//# sourceMappingURL=post.api.d.ts.map

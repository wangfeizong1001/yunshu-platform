/**
 * 岗位管理 Hook
 *
 * 提供岗位列表、详情、新增、编辑、删除等操作
 */

import { ref, Ref } from 'vue'
import { HttpClient } from '../core/HttpClient'
import type { SysPost, SysPostQuery, SysPostForm, SysPostPageResp } from '@yunshu/shared/types/system'

/** 岗位列表 Hook 选项 */
export interface UsePostListOptions {
  /** 初始查询参数 */
  initialParams?: Partial<SysPostQuery>
  /** 是否立即加载 */
  immediate?: boolean
}

/** 岗位列表 Hook 返回 */
export interface UsePostListReturn {
  /** 岗位列表 */
  list: Ref<SysPost[]>
  /** 总数 */
  total: Ref<number>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 查询参数 */
  queryParams: Ref<SysPostQuery>
  /** 获取岗位列表 */
  fetchList: () => Promise<void>
  /** 重置查询参数 */
  resetParams: () => void
  /** 获取岗位详情 */
  fetchDetail: (postId: number) => Promise<SysPost>
  /** 创建岗位 */
  create: (data: SysPostForm) => Promise<SysPost>
  /** 更新岗位 */
  update: (postId: number, data: SysPostForm) => Promise<SysPost>
  /** 删除岗位 */
  delete: (postId: number) => Promise<void>
  /** 批量删除岗位 */
  batchDelete: (postIds: number[]) => Promise<void>
  /** 修改岗位状态 */
  changeStatus: (postId: number, status: '0' | '1') => Promise<void>
  /** 获取岗位下拉列表 */
  getPostSelect: () => Promise<SysPost[]>
}

// 创建岗位 API 实例
const postAPI = new HttpClient({ baseURL: '/api/system/post' })

/**
 * 岗位列表 Hook
 */
export function usePostList(options: UsePostListOptions = {}): UsePostListReturn {
  const { initialParams = {}, immediate = true } = options

  const loading = ref(false)
  const list = ref<SysPost[]>([]) as Ref<SysPost[]>
  const total = ref(0)
  const queryParams = ref<SysPostQuery>({
    pageNum: 1,
    pageSize: 10,
    ...initialParams,
  })

  async function fetchList() {
    loading.value = true
    try {
      const resp = await postAPI.get<SysPostPageResp>('/list', {
        params: queryParams.value,
      })
      list.value = resp.data.rows
      total.value = resp.data.total
    } finally {
      loading.value = false
    }
  }

  function resetParams() {
    queryParams.value = {
      pageNum: 1,
      pageSize: 10,
      ...initialParams,
    }
  }

  async function fetchDetail(postId: number): Promise<SysPost> {
    const resp = await postAPI.get<SysPost>(`/${postId}`)
    return resp.data
  }

  async function create(formData: SysPostForm): Promise<SysPost> {
    const resp = await postAPI.post<SysPost>('/', formData)
    return resp.data
  }

  async function update(postId: number, formData: SysPostForm): Promise<SysPost> {
    const resp = await postAPI.put<SysPost>(`/${postId}`, formData)
    return resp.data
  }

  async function deletePost(postId: number): Promise<void> {
    await postAPI.delete(`/${postId}`)
  }

  async function batchDelete(postIds: number[]): Promise<void> {
    await postAPI.delete('/batch', { data: { postIds } })
  }

  async function changeStatus(postId: number, status: '0' | '1'): Promise<void> {
    await postAPI.put(`/${postId}/status`, { status })
  }

  async function getPostSelect(): Promise<SysPost[]> {
    const resp = await postAPI.get<SysPost[]>('/select')
    return resp.data
  }

  if (immediate) {
    fetchList()
  }

  return {
    list,
    total,
    loading,
    queryParams,
    fetchList,
    resetParams,
    fetchDetail,
    create,
    update,
    delete: deletePost,
    batchDelete,
    changeStatus,
    getPostSelect,
  }
}

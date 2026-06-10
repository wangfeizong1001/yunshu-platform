/**
 * 部门管理 Hook
 *
 * 提供部门树、详情、新增、编辑、删除等操作
 */

import { ref } from 'vue';
import type { Ref } from 'vue';
import { HttpClient } from '../core/HttpClient';
import type { SysDept, SysDeptQuery, SysDeptForm } from '@yunshu/shared';

/** 部门列表 Hook 选项 */
export interface UseDeptListOptions {
  /** 初始查询参数 */
  initialParams?: Partial<SysDeptQuery>;
  /** 是否立即加载 */
  immediate?: boolean;
}

/** 部门列表 Hook 返回 */
export interface UseDeptListReturn {
  /** 部门树 */
  tree: Ref<SysDept[]>;
  /** 加载状态 */
  loading: Ref<boolean>;
  /** 查询参数 */
  queryParams: Ref<SysDeptQuery>;
  /** 获取部门列表 */
  fetchTree: () => Promise<void>;
  /** 获取部门详情 */
  fetchDetail: (deptId: number) => Promise<SysDept>;
  /** 创建部门 */
  create: (data: SysDeptForm) => Promise<SysDept>;
  /** 更新部门 */
  update: (deptId: number, data: SysDeptForm) => Promise<SysDept>;
  /** 删除部门 */
  delete: (deptId: number) => Promise<void>;
  /** 获取部门下拉树 */
  getDeptTreeSelect: () => Promise<SysDept[]>;
  /** 获取部门选择器（包含禁用的部门） */
  getDeptTreeSelectIncludeDisabled: () => Promise<SysDept[]>;
}

// 创建部门 API 实例
const deptAPI = new HttpClient({ baseURL: '/api/system/dept' });

/**
 * 部门列表 Hook
 */
export function useDeptList(options: UseDeptListOptions = {}): UseDeptListReturn {
  const { initialParams = {}, immediate = true } = options;

  const loading = ref(false);
  const tree = ref<SysDept[]>([]) as Ref<SysDept[]>;
  const queryParams = ref<SysDeptQuery>({
    ...initialParams,
  });

  async function fetchTree() {
    loading.value = true;
    try {
      const resp = await deptAPI.get<SysDept[]>('/tree', queryParams.value);
      tree.value = resp.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchDetail(deptId: number): Promise<SysDept> {
    const resp = await deptAPI.get<SysDept>(`/${deptId}`);
    return resp.data;
  }

  async function create(formData: SysDeptForm): Promise<SysDept> {
    const resp = await deptAPI.post<SysDept>('/', formData);
    return resp.data;
  }

  async function update(deptId: number, formData: SysDeptForm): Promise<SysDept> {
    const resp = await deptAPI.put<SysDept>(`/${deptId}`, formData);
    return resp.data;
  }

  async function deleteDept(deptId: number): Promise<void> {
    await deptAPI.delete(`/${deptId}`);
  }

  async function getDeptTreeSelect(): Promise<SysDept[]> {
    const resp = await deptAPI.get<SysDept[]>('/treeSelect');
    return resp.data;
  }

  async function getDeptTreeSelectIncludeDisabled(): Promise<SysDept[]> {
    const resp = await deptAPI.get<SysDept[]>('/treeSelect', { includeDisabled: true });
    return resp.data;
  }

  if (immediate) {
    fetchTree();
  }

  return {
    tree,
    loading,
    queryParams,
    fetchTree,
    fetchDetail,
    create,
    update,
    delete: deleteDept,
    getDeptTreeSelect,
    getDeptTreeSelectIncludeDisabled,
  };
}

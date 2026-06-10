/**
 * 角色管理 Hook
 *
 * 提供角色列表、详情、新增、编辑、删除、权限分配等操作
 */

import { ref } from 'vue';
import type { Ref } from 'vue';
import { HttpClient } from '../core/HttpClient';
import type { SysRole, SysRoleQuery, SysRoleForm, PageResp } from '@yunshu/shared';

type SysRolePageResp = PageResp<SysRole>;

/** 角色列表 Hook 选项 */
export interface UseRoleListOptions {
  initialParams?: Partial<SysRoleQuery>;
  immediate?: boolean;
}

/** 角色列表 Hook 返回 */
export interface UseRoleListReturn {
  list: Ref<SysRole[]>;
  total: Ref<number>;
  loading: Ref<boolean>;
  queryParams: Ref<SysRoleQuery>;
  fetchList: () => Promise<void>;
  resetParams: () => void;
}

/** 角色详情 Hook 返回 */
export interface UseRoleDetailReturn {
  data: Ref<SysRole | null>;
  loading: Ref<boolean>;
  fetchDetail: (roleId: number) => Promise<void>;
}

/** 角色表单 Hook 返回 */
export interface UseRoleFormReturn {
  submitting: Ref<boolean>;
  create: (data: SysRoleForm) => Promise<SysRole>;
  update: (roleId: number, data: SysRoleForm) => Promise<SysRole>;
  delete: (roleId: number) => Promise<void>;
  batchDelete: (roleIds: number[]) => Promise<void>;
  changeStatus: (roleId: number, status: '0' | '1') => Promise<void>;
}

/** 角色权限 Hook 返回 */
export interface UseRolePermissionReturn {
  loading: Ref<boolean>;
  submitting: Ref<boolean>;
  /** 分配菜单权限 */
  assignMenus: (roleId: number, menuIds: number[]) => Promise<void>;
  /** 分配数据权限 */
  assignDataScope: (roleId: number, dataScope: string, deptIds?: number[]) => Promise<void>;
  /** 获取角色菜单权限 */
  getRoleMenus: (roleId: number) => Promise<number[]>;
  /** 获取角色数据权限 */
  getRoleDataScope: (roleId: number) => Promise<{ dataScope: string; deptIds: number[] }>;
}

// 创建角色 API 实例
const roleAPI = new HttpClient({ baseURL: '/api/system/role' });

/**
 * 角色列表 Hook
 */
export function useRoleList(options: UseRoleListOptions = {}): UseRoleListReturn {
  const { initialParams = {}, immediate = true } = options;

  const loading = ref(false);
  const list = ref<SysRole[]>([]) as Ref<SysRole[]>;
  const total = ref(0);
  const queryParams = ref<SysRoleQuery>({
    pageNum: 1,
    pageSize: 10,
    ...initialParams,
  });

  async function fetchList() {
    loading.value = true;
    try {
      const resp = await roleAPI.get<SysRolePageResp>('/list', queryParams.value);
      list.value = resp.data.rows;
      total.value = resp.data.total;
    } finally {
      loading.value = false;
    }
  }

  function resetParams() {
    queryParams.value = {
      pageNum: 1,
      pageSize: 10,
      ...initialParams,
    };
  }

  if (immediate) {
    fetchList();
  }

  return {
    list,
    total,
    loading,
    queryParams,
    fetchList,
    resetParams,
  };
}

/**
 * 角色详情 Hook
 */
export function useRoleDetail(): UseRoleDetailReturn {
  const loading = ref(false);
  const data = ref<SysRole | null>(null) as Ref<SysRole | null>;

  async function fetchDetail(roleId: number) {
    loading.value = true;
    try {
      const resp = await roleAPI.get<SysRole>(`/${roleId}`);
      data.value = resp.data;
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    loading,
    fetchDetail,
  };
}

/**
 * 角色表单 Hook
 */
export function useRoleForm(): UseRoleFormReturn {
  const submitting = ref(false);

  async function create(formData: SysRoleForm): Promise<SysRole> {
    submitting.value = true;
    try {
      const resp = await roleAPI.post<SysRole>('/', formData);
      return resp.data;
    } finally {
      submitting.value = false;
    }
  }

  async function update(roleId: number, formData: SysRoleForm): Promise<SysRole> {
    submitting.value = true;
    try {
      const resp = await roleAPI.put<SysRole>(`/${roleId}`, formData);
      return resp.data;
    } finally {
      submitting.value = false;
    }
  }

  async function deleteRole(roleId: number): Promise<void> {
    submitting.value = true;
    try {
      await roleAPI.delete(`/${roleId}`);
    } finally {
      submitting.value = false;
    }
  }

  async function batchDelete(roleIds: number[]): Promise<void> {
    submitting.value = true;
    try {
      await roleAPI.delete('/batch', { data: { roleIds } });
    } finally {
      submitting.value = false;
    }
  }

  async function changeStatus(roleId: number, status: '0' | '1'): Promise<void> {
    await roleAPI.put(`/${roleId}/status`, { status });
  }

  return {
    submitting,
    create,
    update,
    delete: deleteRole,
    batchDelete,
    changeStatus,
  };
}

/**
 * 角色权限 Hook
 */
export function useRolePermission(): UseRolePermissionReturn {
  const loading = ref(false);
  const submitting = ref(false);

  async function assignMenus(roleId: number, menuIds: number[]): Promise<void> {
    submitting.value = true;
    try {
      await roleAPI.put(`/role/${roleId}/menus`, { menuIds });
    } finally {
      submitting.value = false;
    }
  }

  async function assignDataScope(
    roleId: number,
    dataScope: string,
    deptIds?: number[],
  ): Promise<void> {
    submitting.value = true;
    try {
      await roleAPI.put(`/role/${roleId}/dataScope`, { dataScope, deptIds });
    } finally {
      submitting.value = false;
    }
  }

  async function getRoleMenus(roleId: number): Promise<number[]> {
    loading.value = true;
    try {
      const resp = await roleAPI.get<number[]>(`/${roleId}/menus`);
      return resp.data;
    } finally {
      loading.value = false;
    }
  }

  async function getRoleDataScope(
    roleId: number,
  ): Promise<{ dataScope: string; deptIds: number[] }> {
    loading.value = true;
    try {
      const resp = await roleAPI.get<{ dataScope: string; deptIds: number[] }>(
        `/${roleId}/dataScope`,
      );
      return resp.data;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    submitting,
    assignMenus,
    assignDataScope,
    getRoleMenus,
    getRoleDataScope,
  };
}

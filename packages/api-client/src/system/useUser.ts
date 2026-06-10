/**
 * 用户管理 Hook
 *
 * 提供用户列表、详情、新增、编辑、删除等操作
 */

import { ref } from 'vue';
import type { Ref } from 'vue';
import { HttpClient } from '../core/HttpClient';
import type { SysUser, SysUserQuery, SysUserForm, PageResp } from '@yunshu/shared';

type SysUserPageResp = PageResp<SysUser>;

/** 用户列表 Hook 选项 */
export interface UseUserListOptions {
  /** 初始查询参数 */
  initialParams?: Partial<SysUserQuery>;
  /** 是否立即加载 */
  immediate?: boolean;
}

/** 用户列表 Hook 返回 */
export interface UseUserListReturn {
  /** 用户列表 */
  list: Ref<SysUser[]>;
  /** 总数 */
  total: Ref<number>;
  /** 加载状态 */
  loading: Ref<boolean>;
  /** 查询参数 */
  queryParams: Ref<SysUserQuery>;
  /** 查询用户列表 */
  fetchList: () => Promise<void>;
  /** 重置查询参数 */
  resetParams: () => void;
}

/** 用户详情 Hook 返回 */
export interface UseUserDetailReturn {
  /** 用户信息 */
  data: Ref<SysUser | null>;
  /** 加载状态 */
  loading: Ref<boolean>;
  /** 获取用户详情 */
  fetchDetail: (userId: number) => Promise<void>;
}

/** 用户表单 Hook 返回 */
export interface UseUserFormReturn {
  /** 表单数据 */
  data: Ref<SysUserForm | null>;
  /** 提交状态 */
  submitting: Ref<boolean>;
  /** 创建用户 */
  create: (data: SysUserForm) => Promise<SysUser>;
  /** 更新用户 */
  update: (userId: number, data: SysUserForm) => Promise<SysUser>;
  /** 删除用户 */
  delete: (userId: number) => Promise<void>;
  /** 批量删除用户 */
  batchDelete: (userIds: number[]) => Promise<void>;
  /** 修改用户状态 */
  changeStatus: (userId: number, status: '0' | '1') => Promise<void>;
  /** 重置用户密码 */
  resetPassword: (userId: number, password: string) => Promise<void>;
}

/** 用户导入导出 Hook 返回 */
export interface UseUserImportExportReturn {
  /** 导入状态 */
  importing: Ref<boolean>;
  /** 导出状态 */
  exporting: Ref<boolean>;
  /** 导入用户 */
  importUsers: (file: File) => Promise<void>;
  /** 导出用户 */
  exportUsers: (params?: SysUserQuery) => Promise<void>;
}

// 创建用户 API 实例
const userAPI = new HttpClient({ baseURL: '/api/system/user' });

/**
 * 用户列表 Hook
 */
export function useUserList(options: UseUserListOptions = {}): UseUserListReturn {
  const { initialParams = {}, immediate = true } = options;

  const loading = ref(false);
  const list = ref<SysUser[]>([]) as Ref<SysUser[]>;
  const total = ref(0);
  const queryParams = ref<SysUserQuery>({
    pageNum: 1,
    pageSize: 10,
    ...initialParams,
  });

  async function fetchList() {
    loading.value = true;
    try {
      const resp = await userAPI.get<SysUserPageResp>('/list', queryParams.value);
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
 * 用户详情 Hook
 */
export function useUserDetail(): UseUserDetailReturn {
  const loading = ref(false);
  const data = ref<SysUser | null>(null) as Ref<SysUser | null>;

  async function fetchDetail(userId: number) {
    loading.value = true;
    try {
      const resp = await userAPI.get<SysUser>(`/${userId}`);
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
 * 用户表单 Hook
 */
export function useUserForm(): UseUserFormReturn {
  const submitting = ref(false);
  const data = ref<SysUserForm | null>(null) as Ref<SysUserForm | null>;

  async function create(formData: SysUserForm): Promise<SysUser> {
    submitting.value = true;
    try {
      const resp = await userAPI.post<SysUser>('/', formData);
      return resp.data;
    } finally {
      submitting.value = false;
    }
  }

  async function update(userId: number, formData: SysUserForm): Promise<SysUser> {
    submitting.value = true;
    try {
      const resp = await userAPI.put<SysUser>(`/${userId}`, formData);
      return resp.data;
    } finally {
      submitting.value = false;
    }
  }

  async function deleteUser(userId: number): Promise<void> {
    submitting.value = true;
    try {
      await userAPI.delete(`/${userId}`);
    } finally {
      submitting.value = false;
    }
  }

  async function batchDelete(userIds: number[]): Promise<void> {
    submitting.value = true;
    try {
      await userAPI.delete('/batch', { data: { userIds } });
    } finally {
      submitting.value = false;
    }
  }

  async function changeStatus(userId: number, status: '0' | '1'): Promise<void> {
    await userAPI.put(`/${userId}/status`, { status });
  }

  async function resetPassword(userId: number, password: string): Promise<void> {
    await userAPI.put(`/${userId}/password`, { password });
  }

  return {
    data,
    submitting,
    create,
    update,
    delete: deleteUser,
    batchDelete,
    changeStatus,
    resetPassword,
  };
}

/**
 * 用户导入导出 Hook
 */
export function useUserImportExport(): UseUserImportExportReturn {
  const importing = ref(false);
  const exporting = ref(false);

  async function importUsers(file: File): Promise<void> {
    importing.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file);
      await userAPI.post('/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } finally {
      importing.value = false;
    }
  }

  async function exportUsers(params?: SysUserQuery): Promise<void> {
    exporting.value = true;
    try {
      await userAPI.download('/export', params || {}, '用户列表.xlsx');
    } finally {
      exporting.value = false;
    }
  }

  return {
    importing,
    exporting,
    importUsers,
    exportUsers,
  };
}

/**
 * 表单管理相关 API
 */

import request from '@/utils/request';

// 表单组件类型
export type FormComponentType =
  | 'input'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'date'
  | 'datetime'
  | 'time'
  | 'upload'
  | 'number'
  | 'switch'
  | 'rate'
  | 'slider';

// 表单选项
export interface FormOption {
  label: string;
  value: string | number | boolean;
}

// 表单组件配置
export interface FormComponent {
  id: string;
  type: FormComponentType;
  label: string;
  field: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
  options?: FormOption[];
  rules?: string[];
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  accept?: string;
  maxCount?: number;
}

// 表单查询参数
export interface FormQuery {
  pageNum?: number;
  pageSize?: number;
  formName?: string;
  status?: string;
}

// 表单表单
export interface FormForm {
  formId?: number;
  formName?: string;
  formCode?: string;
  description?: string;
  components?: FormComponent[];
  status?: string;
  remark?: string;
}

// 表单信息
export interface FormInfo {
  formId: number;
  formName: string;
  formCode: string;
  description: string;
  components: FormComponent[];
  status: string;
  createTime: string;
  updateTime: string;
  remark: string;
}

// 表单分页响应
export interface FormPageResp {
  total: number;
  rows: FormInfo[];
}

// 获取表单列表
export function getFormList(params: FormQuery) {
  return request<FormPageResp>({
    url: '/system/form/list',
    method: 'get',
    params,
  });
}

// 获取表单分页列表
export function getFormPage(params: FormQuery) {
  return request<FormPageResp>({
    url: '/system/form/page',
    method: 'get',
    params,
  });
}

// 获取表单详情
export function getForm(formId: number) {
  return request<FormInfo>({
    url: `/system/form/${formId}`,
    method: 'get',
  });
}

// 新增表单
export function addForm(data: FormForm) {
  return request({
    url: '/system/form',
    method: 'post',
    data,
  });
}

// 修改表单
export function updateForm(data: FormForm) {
  return request({
    url: '/system/form',
    method: 'put',
    data,
  });
}

// 删除表单
export function deleteForm(formId: number) {
  return request({
    url: `/system/form/${formId}`,
    method: 'delete',
  });
}

// 批量删除表单
export function batchDeleteForm(formIds: number[]) {
  return request({
    url: '/system/form/batch',
    method: 'delete',
    data: formIds,
  });
}

// 复制表单
export function copyForm(formId: number) {
  return request({
    url: `/system/form/copy/${formId}`,
    method: 'post',
  });
}

// 发布表单
export function publishForm(formId: number) {
  return request({
    url: `/system/form/publish/${formId}`,
    method: 'put',
  });
}

// 停用表单
export function stopForm(formId: number) {
  return request({
    url: `/system/form/stop/${formId}`,
    method: 'put',
  });
}

// 表单数据提交
export function submitFormData(formId: number, data: Record<string, any>) {
  return request({
    url: `/system/form/data/${formId}`,
    method: 'post',
    data,
  });
}

// 获取表单数据列表
export function getFormDataList(formId: number, params: any) {
  return request({
    url: `/system/form/data/${formId}/list`,
    method: 'get',
    params,
  });
}

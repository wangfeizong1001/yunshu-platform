/**
 * 表单管理相关 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

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
  | 'slider'

// 表单选项
export interface FormOption {
  label: string
  value: string | number | boolean
}

// 表单组件配置
export interface FormComponent {
  id: string
  type: FormComponentType
  label: string
  field: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  defaultValue?: unknown
  options?: FormOption[]
  rules?: string[]
  min?: number
  max?: number
  step?: number
  multiple?: boolean
  accept?: string
  maxCount?: number
}

// 表单查询参数
export interface FormQuery {
  pageNum?: number
  pageSize?: number
  formName?: string
  status?: string
}

// 表单表单
export interface FormForm {
  formId?: number
  formName?: string
  formCode?: string
  description?: string
  components?: FormComponent[]
  status?: string
  remark?: string
}

// 表单信息
export interface FormInfo {
  formId: number
  formName: string
  formCode: string
  description: string
  components: FormComponent[]
  status: string
  createTime: string
  updateTime: string
  remark: string
}

// 表单分页响应
export interface FormPageResp {
  total: number
  rows: FormInfo[]
}

// 获取表单列表
export function getFormList(params: FormQuery) {
  return request<FormPageResp>({
    url: '/system/form/list',
    method: 'GET',
    params
  })
}

// 获取表单分页列表
export function getFormPage(params: FormQuery) {
  return request<FormPageResp>({
    url: '/system/form/page',
    method: 'GET',
    params
  })
}

// 获取表单详情
export function getForm(formId: number) {
  return request<FormInfo>({
    url: `/system/form/${formId}`,
    method: 'GET'
  })
}

// 新增表单
export function addForm(data: FormForm) {
  return request<void>({
    url: '/system/form',
    method: 'POST',
    data
  })
}

// 修改表单
export function updateForm(data: FormForm) {
  return request<void>({
    url: '/system/form',
    method: 'PUT',
    data
  })
}

// 删除表单
export function deleteForm(formId: number) {
  return request<void>({
    url: `/system/form/${formId}`,
    method: 'DELETE'
  })
}

// 批量删除表单
export function batchDeleteForm(formIds: number[]) {
  return request<void>({
    url: '/system/form/batch',
    method: 'DELETE',
    data: formIds
  })
}

// 复制表单
export function copyForm(formId: number) {
  return request<void>({
    url: `/system/form/copy/${formId}`,
    method: 'POST'
  })
}

// 发布表单
export function publishForm(formId: number) {
  return request<void>({
    url: `/system/form/publish/${formId}`,
    method: 'PUT'
  })
}

// 停用表单
export function stopForm(formId: number) {
  return request<void>({
    url: `/system/form/stop/${formId}`,
    method: 'PUT'
  })
}

// 表单数据提交
export function submitFormData(formId: number, data: Record<string, unknown>) {
  return request<void>({
    url: `/system/form/data/${formId}`,
    method: 'POST',
    data
  })
}

// 获取表单数据列表
export function getFormDataList(formId: number, params: Record<string, unknown>) {
  return request<{ rows: Record<string, unknown>[]; total: number }>({
    url: `/system/form/data/${formId}/list`,
    method: 'GET',
    params
  })
}

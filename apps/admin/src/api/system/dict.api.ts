/**
 * 字典管理 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface DictTypeQuery {
  pageNum?: number
  pageSize?: number
  dictName?: string
  dictType?: string
  status?: string
}

export interface DictTypeForm {
  dictId?: number
  dictName?: string
  dictType?: string
  status?: string
  remark?: string
}

export interface DictTypeInfo {
  dictId: number
  dictName: string
  dictType: string
  status: string
  remark: string
  createTime: string
}

export interface DictDataQuery {
  pageNum?: number
  pageSize?: number
  dictType?: string
  dictLabel?: string
  status?: string
}

export interface DictDataForm {
  dictCode?: number
  dictType?: string
  dictLabel?: string
  dictValue?: string
  dictSort?: number
  isDefault?: string
  status?: string
  remark?: string
}

export interface DictDataInfo {
  dictCode: number
  dictType: string
  dictLabel: string
  dictValue: string
  dictSort: number
  isDefault: string
  status: string
  remark: string
  createTime: string
}

export const getDictTypeList = (params?: DictTypeQuery) => {
  return request<unknown>({
    url: '/system/dict/type/list',
    method: 'GET',
    params
  })
}

export const getDictTypePage = (params?: DictTypeQuery) => {
  return request<unknown>({
    url: '/system/dict/type/page',
    method: 'GET',
    params
  })
}

export const getDictType = (dictId: number) => {
  return request<unknown>({
    url: `/system/dict/type/${dictId}`,
    method: 'GET'
  })
}

export const getDictTypeAll = () => {
  return request<unknown>({
    url: '/system/dict/type/all',
    method: 'GET'
  })
}

export const getDictTypeOptions = (dictType: string) => {
  return request<unknown>({
    url: `/system/dict/type/options/${dictType}`,
    method: 'GET'
  })
}

export const addDictType = (data: DictTypeForm) => {
  return request<unknown>({
    url: '/system/dict/type',
    method: 'POST',
    data
  })
}

export const updateDictType = (data: DictTypeForm) => {
  return request<unknown>({
    url: '/system/dict/type',
    method: 'PUT',
    data
  })
}

export const deleteDictType = (dictId: number) => {
  return request<unknown>({
    url: `/system/dict/type/${dictId}`,
    method: 'DELETE'
  })
}

export const batchDeleteDictType = (dictIds: number[]) => {
  return request<unknown>({
    url: '/system/dict/type/batch',
    method: 'DELETE',
    data: dictIds
  })
}

export const refreshDictCache = () => {
  return request<unknown>({
    url: '/system/dict/type/refreshCache',
    method: 'DELETE'
  })
}

export const getDictDataList = (params?: DictDataQuery) => {
  return request<unknown>({
    url: '/system/dict/data/list',
    method: 'GET',
    params
  })
}

export const getDictDataPage = (params?: DictDataQuery) => {
  return request<unknown>({
    url: '/system/dict/data/page',
    method: 'GET',
    params
  })
}

export const getDictData = (dictCode: number) => {
  return request<unknown>({
    url: `/system/dict/data/${dictCode}`,
    method: 'GET'
  })
}

export const addDictData = (data: DictDataForm) => {
  return request<unknown>({
    url: '/system/dict/data',
    method: 'POST',
    data
  })
}

export const updateDictData = (data: DictDataForm) => {
  return request<unknown>({
    url: '/system/dict/data',
    method: 'PUT',
    data
  })
}

export const deleteDictData = (dictCode: number) => {
  return request<unknown>({
    url: `/system/dict/data/${dictCode}`,
    method: 'DELETE'
  })
}

export const getDictDataByType = (dictType: string) => {
  return request<unknown>({
    url: `/system/dict/data/type/${dictType}`,
    method: 'GET'
  })
}

export const exportDictType = (params?: DictTypeQuery) => {
  return request<unknown>({
    url: '/system/dict/type/export',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

export const exportDictData = (dictType: string) => {
  return request<unknown>({
    url: '/system/dict/data/export',
    method: 'GET',
    params: { dictType },
    responseType: 'blob'
  })
}

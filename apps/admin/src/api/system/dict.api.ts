/**
 * 字典管理 API
 */

import request from '@/utils/request'

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
  return request({
    url: '/system/dict/type/list',
    method: 'get',
    params
  })
}

export const getDictTypePage = (params?: DictTypeQuery) => {
  return request({
    url: '/system/dict/type/page',
    method: 'get',
    params
  })
}

export const getDictType = (dictId: number) => {
  return request({
    url: `/system/dict/type/${dictId}`,
    method: 'get'
  })
}

export const getDictTypeAll = () => {
  return request({
    url: '/system/dict/type/all',
    method: 'get'
  })
}

export const getDictTypeOptions = (dictType: string) => {
  return request({
    url: `/system/dict/type/options/${dictType}`,
    method: 'get'
  })
}

export const addDictType = (data: DictTypeForm) => {
  return request({
    url: '/system/dict/type',
    method: 'post',
    data
  })
}

export const updateDictType = (data: DictTypeForm) => {
  return request({
    url: '/system/dict/type',
    method: 'put',
    data
  })
}

export const deleteDictType = (dictId: number) => {
  return request({
    url: `/system/dict/type/${dictId}`,
    method: 'delete'
  })
}

export const batchDeleteDictType = (dictIds: number[]) => {
  return request({
    url: '/system/dict/type/batch',
    method: 'delete',
    data: dictIds
  })
}

export const refreshDictCache = () => {
  return request({
    url: '/system/dict/type/refreshCache',
    method: 'delete'
  })
}

export const getDictDataList = (params?: DictDataQuery) => {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params
  })
}

export const getDictDataPage = (params?: DictDataQuery) => {
  return request({
    url: '/system/dict/data/page',
    method: 'get',
    params
  })
}

export const getDictData = (dictCode: number) => {
  return request({
    url: `/system/dict/data/${dictCode}`,
    method: 'get'
  })
}

export const addDictData = (data: DictDataForm) => {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data
  })
}

export const updateDictData = (data: DictDataForm) => {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data
  })
}

export const deleteDictData = (dictCode: number) => {
  return request({
    url: `/system/dict/data/${dictCode}`,
    method: 'delete'
  })
}

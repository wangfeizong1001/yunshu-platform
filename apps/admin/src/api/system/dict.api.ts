/**
 * 数据字典管理 API
 */

import { request } from '@/utils/request'
import type {
  SysDictType,
  SysDictTypeQuery,
  SysDictTypeForm,
  SysDictTypePageResp,
  SysDictData,
  SysDictDataQuery,
  SysDictDataForm,
  SysDictDataPageResp,
} from '@yunshu/shared/types/system'

// ==================== 字典类型 API ====================

/**
 * 获取字典类型分页列表
 * @param params 查询参数
 */
export function getDictTypePage(params: SysDictTypeQuery) {
  return request<SysDictTypePageResp>({
    url: '/system/dict/type/page',
    method: 'get',
    params,
  })
}

/**
 * 获取字典类型列表
 * @param params 查询参数
 */
export function getDictTypeList(params?: SysDictTypeQuery) {
  return request<SysDictType[]>({
    url: '/system/dict/type/list',
    method: 'get',
    params,
  })
}

/**
 * 获取字典类型详情
 * @param dictId 字典ID
 */
export function getDictTypeDetail(dictId: number) {
  return request<SysDictType>({
    url: `/system/dict/type/${dictId}`,
    method: 'get',
  })
}

/**
 * 新增字典类型
 * @param data 字典类型表单数据
 */
export function addDictType(data: SysDictTypeForm) {
  return request<SysDictType>({
    url: '/system/dict/type',
    method: 'post',
    data,
  })
}

/**
 * 修改字典类型
 * @param dictId 字典ID
 * @param data 字典类型表单数据
 */
export function updateDictType(dictId: number, data: SysDictTypeForm) {
  return request<SysDictType>({
    url: `/system/dict/type/${dictId}`,
    method: 'put',
    data,
  })
}

/**
 * 删除字典类型
 * @param dictId 字典ID
 */
export function deleteDictType(dictId: number) {
  return request<void>({
    url: `/system/dict/type/${dictId}`,
    method: 'delete',
  })
}

/**
 * 批量删除字典类型
 * @param dictIds 字典ID数组
 */
export function batchDeleteDictType(dictIds: number[]) {
  return request<void>({
    url: '/system/dict/type/batch',
    method: 'delete',
    data: { dictIds },
  })
}

/**
 * 修改字典类型状态
 * @param dictId 字典ID
 * @param status 状态
 */
export function changeDictTypeStatus(dictId: number, status: '0' | '1') {
  return request<void>({
    url: `/system/dict/type/${dictId}/status`,
    method: 'put',
    data: { status },
  })
}

/**
 * 导出字典类型
 * @param params 查询参数
 */
export function exportDictType(params?: SysDictTypeQuery) {
  return request.download('/system/dict/type/export', params, '字典类型.xlsx')
}

// ==================== 字典数据 API ====================

/**
 * 获取字典数据分页列表
 * @param params 查询参数
 */
export function getDictDataPage(params: SysDictDataQuery) {
  return request<SysDictDataPageResp>({
    url: '/system/dict/data/page',
    method: 'get',
    params,
  })
}

/**
 * 获取字典数据列表
 * @param params 查询参数
 */
export function getDictDataList(params?: SysDictDataQuery) {
  return request<SysDictData[]>({
    url: '/system/dict/data/list',
    method: 'get',
    params,
  })
}

/**
 * 获取字典数据详情
 * @param dictCode 字典编码
 */
export function getDictDataDetail(dictCode: number) {
  return request<SysDictData>({
    url: `/system/dict/data/${dictCode}`,
    method: 'get',
  })
}

/**
 * 根据类型获取字典数据
 * @param dictType 字典类型
 */
export function getDictDataByType(dictType: string) {
  return request<SysDictData[]>({
    url: `/system/dict/data/type/${dictType}`,
    method: 'get',
  })
}

/**
 * 新增字典数据
 * @param data 字典数据表单数据
 */
export function addDictData(data: SysDictDataForm) {
  return request<SysDictData>({
    url: '/system/dict/data',
    method: 'post',
    data,
  })
}

/**
 * 修改字典数据
 * @param dictCode 字典编码
 * @param data 字典数据表单数据
 */
export function updateDictData(dictCode: number, data: SysDictDataForm) {
  return request<SysDictData>({
    url: `/system/dict/data/${dictCode}`,
    method: 'put',
    data,
  })
}

/**
 * 删除字典数据
 * @param dictCode 字典编码
 */
export function deleteDictData(dictCode: number) {
  return request<void>({
    url: `/system/dict/data/${dictCode}`,
    method: 'delete',
  })
}

/**
 * 批量删除字典数据
 * @param dictCodes 字典编码数组
 */
export function batchDeleteDictData(dictCodes: number[]) {
  return request<void>({
    url: '/system/dict/data/batch',
    method: 'delete',
    data: { dictCodes },
  })
}

/**
 * 修改字典数据状态
 * @param dictCode 字典编码
 * @param status 状态
 */
export function changeDictDataStatus(dictCode: number, status: '0' | '1') {
  return request<void>({
    url: `/system/dict/data/${dictCode}/status`,
    method: 'put',
    data: { status },
  })
}

/**
 * 导出字典数据
 * @param dictType 字典类型
 */
export function exportDictData(dictType: string) {
  return request.download('/system/dict/data/export', { dictType }, '字典数据.xlsx')
}

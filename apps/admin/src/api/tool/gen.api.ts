/**
 * 代码生成器 API
 */

import request from '@/utils/request'

export interface GenTableQuery {
  pageNum?: number
  pageSize?: number
  tableName?: string
  tableComment?: string
}

export interface GenTableInfo {
  tableId: number
  tableName: string
  tableComment: string
  subTableName?: string
  subTableFkName?: string
  className: string
  tplCategory?: string
  packageName: string
  moduleName: string
  businessName: string
  functionName: string
  functionAuthor: string
  genType: string
  genPath: string
  options: string
  createTime: string
}

export interface GenColumnInfo {
  tableInfo: GenTableInfo
  tables: Array<{
    name: string
    comment: string
    columns: Array<{
      name: string
      comment: string
      type: string
    }>
  }>
}

export const getGenTableList = (params?: GenTableQuery) => {
  return request({
    url: '/tool/gen/list',
    method: 'get',
    params
  })
}

export const getGenTablePage = (params?: GenTableQuery) => {
  return request({
    url: '/tool/gen/page',
    method: 'get',
    params
  })
}

export const getGenDbList = (params?: GenTableQuery) => {
  return request({
    url: '/tool/gen/db/list',
    method: 'get',
    params
  })
}

export const getGenTable = (tableId: number) => {
  return request({
    url: `/tool/gen/${tableId}`,
    method: 'get'
  })
}

export const importGenTable = (tableNames: string[]) => {
  return request({
    url: '/tool/gen/importTable',
    method: 'post',
    data: tableNames
  })
}

export const updateGenTable = (data: GenTableInfo) => {
  return request({
    url: '/tool/gen',
    method: 'put',
    data
  })
}

export const deleteGenTable = (tableIds: number[]) => {
  return request({
    url: '/tool/gen',
    method: 'delete',
    data: tableIds
  })
}

export const previewGen = (tableName: string) => {
  return request({
    url: `/tool/gen/preview/${tableName}`,
    method: 'get'
  })
}

export const downloadGen = (tableNames: string[]) => {
  return request({
    url: '/tool/gen/download',
    method: 'post',
    data: tableNames,
    responseType: 'blob'
  })
}

export const genCode = (tableNames: string[]) => {
  return request({
    url: '/tool/gen/genCode',
    method: 'post',
    data: tableNames
  })
}

export const syncGenDb = (tableName: string) => {
  return request({
    url: `/tool/gen/sync/${tableName}`,
    method: 'post'
  })
}


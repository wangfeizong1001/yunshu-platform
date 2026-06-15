/**
 * 字典管理 Mock API
 * @module mock/routes/system/dict
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'

// ========== 字典类型数据 ==========
interface DictType {
  dictId: number
  dictName: string
  dictType: string
  status: string
  createTime: string
  updateTime: string
  remark: string
}

let dictTypes: DictType[] = [
  {
    dictId: 1,
    dictName: '用户性别',
    dictType: 'sys_user_sex',
    status: '0',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
    remark: '用户性别列表'
  },
  {
    dictId: 2,
    dictName: '菜单状态',
    dictType: 'sys_show_hide',
    status: '0',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
    remark: '菜单是否显示'
  },
  {
    dictId: 3,
    dictName: '系统状态',
    dictType: 'sys_normal_disable',
    status: '0',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
    remark: '系统正常状态'
  },
  {
    dictId: 4,
    dictName: '任务状态',
    dictType: 'sys_job_status',
    status: '0',
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00',
    remark: '定时任务状态'
  },
  {
    dictId: 5,
    dictName: '任务分组',
    dictType: 'sys_job_group',
    status: '0',
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00',
    remark: '定时任务分组'
  },
  {
    dictId: 6,
    dictName: '通知类型',
    dictType: 'sys_notice_type',
    status: '0',
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00',
    remark: '通知公告类型'
  },
  {
    dictId: 7,
    dictName: '操作类型',
    dictType: 'sys_oper_type',
    status: '0',
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00',
    remark: '操作日志类型'
  },
  {
    dictId: 8,
    dictName: '登录状态',
    dictType: 'sys_login_status',
    status: '0',
    createTime: '2024-01-04 10:00:00',
    updateTime: '2024-01-04 10:00:00',
    remark: '登录状态'
  },
  {
    dictId: 9,
    dictName: '是否默认',
    dictType: 'sys_yes_no',
    status: '0',
    createTime: '2024-01-04 10:00:00',
    updateTime: '2024-01-04 10:00:00',
    remark: '是否默认'
  },
  {
    dictId: 10,
    dictName: '数据范围',
    dictType: 'sys_data_scope',
    status: '0',
    createTime: '2024-01-05 10:00:00',
    updateTime: '2024-01-05 10:00:00',
    remark: '数据权限范围'
  }
]

// ========== 字典数据 ==========
interface DictData {
  dictCode: number
  dictSort: number
  dictLabel: string
  dictValue: string
  dictType: string
  cssClass: string
  listClass: string
  isDefault: string
  status: string
  createTime: string
  updateTime: string
  remark: string
}

let dictDataList: DictData[] = [
  // sys_user_sex
  { dictCode: 1, dictSort: 1, dictLabel: '男', dictValue: '0', dictType: 'sys_user_sex', cssClass: '', listClass: 'primary', isDefault: 'Y', status: '0', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00', remark: '男性' },
  { dictCode: 2, dictSort: 2, dictLabel: '女', dictValue: '1', dictType: 'sys_user_sex', cssClass: '', listClass: 'danger', isDefault: 'N', status: '0', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00', remark: '女性' },
  { dictCode: 3, dictSort: 3, dictLabel: '未知', dictValue: '2', dictType: 'sys_user_sex', cssClass: '', listClass: 'info', isDefault: 'N', status: '0', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00', remark: '未知性别' },
  // sys_show_hide
  { dictCode: 10, dictSort: 1, dictLabel: '显示', dictValue: '0', dictType: 'sys_show_hide', cssClass: '', listClass: 'primary', isDefault: 'Y', status: '0', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00', remark: '显示菜单' },
  { dictCode: 11, dictSort: 2, dictLabel: '隐藏', dictValue: '1', dictType: 'sys_show_hide', cssClass: '', listClass: 'danger', isDefault: 'N', status: '0', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00', remark: '隐藏菜单' },
  // sys_normal_disable
  { dictCode: 20, dictSort: 1, dictLabel: '正常', dictValue: '0', dictType: 'sys_normal_disable', cssClass: '', listClass: 'success', isDefault: 'Y', status: '0', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00', remark: '正常状态' },
  { dictCode: 21, dictSort: 2, dictLabel: '停用', dictValue: '1', dictType: 'sys_normal_disable', cssClass: '', listClass: 'danger', isDefault: 'N', status: '0', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00', remark: '停用状态' },
  // sys_job_status
  { dictCode: 30, dictSort: 1, dictLabel: '正常', dictValue: '0', dictType: 'sys_job_status', cssClass: '', listClass: 'success', isDefault: 'Y', status: '0', createTime: '2024-01-02 10:00:00', updateTime: '2024-01-02 10:00:00', remark: '正常状态' },
  { dictCode: 31, dictSort: 2, dictLabel: '暂停', dictValue: '1', dictType: 'sys_job_status', cssClass: '', listClass: 'warning', isDefault: 'N', status: '0', createTime: '2024-01-02 10:00:00', updateTime: '2024-01-02 10:00:00', remark: '暂停状态' },
  // sys_job_group
  { dictCode: 40, dictSort: 1, dictLabel: '默认', dictValue: 'default', dictType: 'sys_job_group', cssClass: '', listClass: 'default', isDefault: 'Y', status: '0', createTime: '2024-01-02 10:00:00', updateTime: '2024-01-02 10:00:00', remark: '默认分组' },
  { dictCode: 41, dictSort: 2, dictLabel: '系统', dictValue: 'system', dictType: 'sys_job_group', cssClass: '', listClass: 'primary', isDefault: 'N', status: '0', createTime: '2024-01-02 10:00:00', updateTime: '2024-01-02 10:00:00', remark: '系统分组' },
  // sys_notice_type
  { dictCode: 50, dictSort: 1, dictLabel: '通知', dictValue: '1', dictType: 'sys_notice_type', cssClass: '', listClass: 'primary', isDefault: 'Y', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '通知' },
  { dictCode: 51, dictSort: 2, dictLabel: '公告', dictValue: '2', dictType: 'sys_notice_type', cssClass: '', listClass: 'info', isDefault: 'N', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '公告' },
  // sys_oper_type
  { dictCode: 60, dictSort: 1, dictLabel: '其他', dictValue: '0', dictType: 'sys_oper_type', cssClass: '', listClass: 'info', isDefault: 'N', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '其他操作' },
  { dictCode: 61, dictSort: 2, dictLabel: '新增', dictValue: '1', dictType: 'sys_oper_type', cssClass: '', listClass: 'primary', isDefault: 'N', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '新增操作' },
  { dictCode: 62, dictSort: 3, dictLabel: '修改', dictValue: '2', dictType: 'sys_oper_type', cssClass: '', listClass: 'warning', isDefault: 'N', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '修改操作' },
  { dictCode: 63, dictSort: 4, dictLabel: '删除', dictValue: '3', dictType: 'sys_oper_type', cssClass: '', listClass: 'danger', isDefault: 'N', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '删除操作' },
  { dictCode: 64, dictSort: 5, dictLabel: '授权', dictValue: '4', dictType: 'sys_oper_type', cssClass: '', listClass: 'success', isDefault: 'N', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '授权操作' },
  { dictCode: 65, dictSort: 6, dictLabel: '导出', dictValue: '5', dictType: 'sys_oper_type', cssClass: '', listClass: 'warning', isDefault: 'N', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '导出操作' },
  { dictCode: 66, dictSort: 7, dictLabel: '导入', dictValue: '6', dictType: 'sys_oper_type', cssClass: '', listClass: 'primary', isDefault: 'N', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '导入操作' },
  { dictCode: 67, dictSort: 8, dictLabel: '强退', dictValue: '7', dictType: 'sys_oper_type', cssClass: '', listClass: 'danger', isDefault: 'N', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '强退操作' },
  { dictCode: 68, dictSort: 9, dictLabel: '生成代码', dictValue: '8', dictType: 'sys_oper_type', cssClass: '', listClass: 'success', isDefault: 'N', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '生成代码' },
  { dictCode: 69, dictSort: 10, dictLabel: '清空数据', dictValue: '9', dictType: 'sys_oper_type', cssClass: '', listClass: 'danger', isDefault: 'N', status: '0', createTime: '2024-01-03 10:00:00', updateTime: '2024-01-03 10:00:00', remark: '清空数据' }
]

export default [
  // ========== 字典类型 ==========
  /**
   * 获取字典类型分页列表
   */
  {
    url: '/api/system/dict/type/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; dictName?: string; dictType?: string; status?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { dictName, dictType, status } = query

      let list = [...dictTypes]

      if (dictName) {
        list = list.filter(d => d.dictName.includes(dictName))
      }
      if (dictType) {
        list = list.filter(d => d.dictType.includes(dictType))
      }
      if (status) {
        list = list.filter(d => d.status === status)
      }

      list.sort((a, b) => b.dictId - a.dictId)

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize

      return pageResult(list.slice(start, end), list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取字典类型列表
   */
  {
    url: '/api/system/dict/type/list',
    method: 'get',
    response: async () => {
      await delay()
      return success(dictTypes)
    }
  },

  /**
   * 获取字典类型详情
   */
  {
    url: '/api/system/dict/type/:dictId',
    method: 'get',
    response: async ({ params }: { params: { dictId: string } }) => {
      await delay()

      const dictType = dictTypes.find(d => d.dictId === parseInt(params.dictId))
      if (!dictType) {
        return fail('字典类型不存在', 404)
      }

      return success(dictType)
    }
  },

  /**
   * 新增字典类型
   */
  {
    url: '/api/system/dict/type',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      if (dictTypes.some(d => d.dictType === body.dictType)) {
        return fail('字典类型已存在')
      }

      const maxId = Math.max(...dictTypes.map(d => d.dictId), 0)
      const newDictType: DictType = {
        dictId: maxId + 1,
        dictName: body.dictName,
        dictType: body.dictType,
        status: body.status || '0',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        remark: body.remark || ''
      }

      dictTypes.push(newDictType)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改字典类型
   */
  {
    url: '/api/system/dict/type',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const index = dictTypes.findIndex(d => d.dictId === body.dictId)
      if (index === -1) {
        return fail('字典类型不存在', 404)
      }

      if (body.dictType && dictTypes.some(d => d.dictType === body.dictType && d.dictId !== body.dictId)) {
        return fail('字典类型已存在')
      }

      dictTypes[index] = {
        ...dictTypes[index],
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除字典类型
   */
  {
    url: '/api/system/dict/type/:dictId',
    method: 'delete',
    response: async ({ params }: { params: { dictId: string } }) => {
      await delay()

      const index = dictTypes.findIndex(d => d.dictId === parseInt(params.dictId))
      if (index === -1) {
        return fail('字典类型不存在', 404)
      }

      dictTypes.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 刷新字典缓存
   */
  {
    url: '/api/system/dict/type/cache/refresh',
    method: 'put',
    response: async () => {
      await delay()
      return success(null, '刷新成功')
    }
  },

  /**
   * 导出字典类型
   */
  {
    url: '/api/system/dict/type/export',
    method: 'get',
    response: async () => {
      await delay()
      return success({ downloadUrl: '/downloads/dict_type_export.xlsx' })
    }
  },

  // ========== 字典数据 ==========
  /**
   * 获取字典数据分页列表
   */
  {
    url: '/api/system/dict/data/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; dictLabel?: string; dictType?: string; status?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { dictLabel, dictType, status } = query

      let list = [...dictDataList]

      if (dictLabel) {
        list = list.filter(d => d.dictLabel.includes(dictLabel))
      }
      if (dictType) {
        list = list.filter(d => d.dictType === dictType)
      }
      if (status) {
        list = list.filter(d => d.status === status)
      }

      list.sort((a, b) => a.dictSort - b.dictSort)

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize

      return pageResult(list.slice(start, end), list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取字典数据列表
   */
  {
    url: '/api/system/dict/data/list',
    method: 'get',
    response: async ({ query }: { query: { dictType: string } }) => {
      await delay()

      const { dictType } = query
      let list = [...dictDataList]

      if (dictType) {
        list = list.filter(d => d.dictType === dictType && d.status === '0')
      }

      list.sort((a, b) => a.dictSort - b.dictSort)
      return success(list)
    }
  },

  /**
   * 获取字典数据详情
   */
  {
    url: '/api/system/dict/data/:dictCode',
    method: 'get',
    response: async ({ params }: { params: { dictCode: string } }) => {
      await delay()

      const dictData = dictDataList.find(d => d.dictCode === parseInt(params.dictCode))
      if (!dictData) {
        return fail('字典数据不存在', 404)
      }

      return success(dictData)
    }
  },

  /**
   * 新增字典数据
   */
  {
    url: '/api/system/dict/data',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      const maxId = Math.max(...dictDataList.map(d => d.dictCode), 0)
      const newDictData: DictData = {
        dictCode: maxId + 1,
        dictSort: body.dictSort || 0,
        dictLabel: body.dictLabel,
        dictValue: body.dictValue,
        dictType: body.dictType,
        cssClass: body.cssClass || '',
        listClass: body.listClass || 'default',
        isDefault: body.isDefault || 'N',
        status: body.status || '0',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        remark: body.remark || ''
      }

      dictDataList.push(newDictData)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改字典数据
   */
  {
    url: '/api/system/dict/data',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const index = dictDataList.findIndex(d => d.dictCode === body.dictCode)
      if (index === -1) {
        return fail('字典数据不存在', 404)
      }

      dictDataList[index] = {
        ...dictDataList[index],
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除字典数据
   */
  {
    url: '/api/system/dict/data/:dictCode',
    method: 'delete',
    response: async ({ params }: { params: { dictCode: string } }) => {
      await delay()

      const index = dictDataList.findIndex(d => d.dictCode === parseInt(params.dictCode))
      if (index === -1) {
        return fail('字典数据不存在', 404)
      }

      dictDataList.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 导出字典数据
   */
  {
    url: '/api/system/dict/data/export',
    method: 'get',
    response: async () => {
      await delay()
      return success({ downloadUrl: '/downloads/dict_data_export.xlsx' })
    }
  }
] as MockMethod[]

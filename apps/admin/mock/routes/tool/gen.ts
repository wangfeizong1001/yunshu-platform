/**
 * 代码生成 Mock API
 * @module mock/routes/tool/gen
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'
import { db } from '../utils/database'

/** 模拟字段数据 */
function generateColumns(tableName: string) {
  const columnTemplates: Record<string, Array<{ columnName: string; dataType: string; columnComment: string; isNullable: 'YES' | 'NO'; columnLength: number; isPK: boolean }>> = {
    sys_user: [
      { columnName: 'user_id', dataType: 'bigint', columnComment: '用户ID', isNullable: 'NO', columnLength: 20, isPK: true },
      { columnName: 'username', dataType: 'varchar', columnComment: '用户名', isNullable: 'NO', columnLength: 30, isPK: false },
      { columnName: 'nickname', dataType: 'varchar', columnComment: '昵称', isNullable: 'YES', columnLength: 30, isPK: false },
      { columnName: 'email', dataType: 'varchar', columnComment: '邮箱', isNullable: 'YES', columnLength: 50, isPK: false },
      { columnName: 'phone', dataType: 'varchar', columnComment: '手机号', isNullable: 'YES', columnLength: 11, isPK: false },
      { columnName: 'sex', dataType: 'char', columnComment: '性别', isNullable: 'YES', columnLength: 1, isPK: false },
      { columnName: 'avatar', dataType: 'varchar', columnComment: '头像', isNullable: 'YES', columnLength: 255, isPK: false },
      { columnName: 'status', dataType: 'char', columnComment: '状态', isNullable: 'YES', columnLength: 1, isPK: false },
      { columnName: 'dept_id', dataType: 'bigint', columnComment: '部门ID', isNullable: 'YES', columnLength: 20, isPK: false },
      { columnName: 'create_time', dataType: 'datetime', columnComment: '创建时间', isNullable: 'YES', columnLength: 0, isPK: false }
    ],
    sys_role: [
      { columnName: 'role_id', dataType: 'bigint', columnComment: '角色ID', isNullable: 'NO', columnLength: 20, isPK: true },
      { columnName: 'role_name', dataType: 'varchar', columnComment: '角色名称', isNullable: 'NO', columnLength: 30, isPK: false },
      { columnName: 'role_key', dataType: 'varchar', columnComment: '角色标识', isNullable: 'NO', columnLength: 100, isPK: false },
      { columnName: 'role_sort', dataType: 'int', columnComment: '显示顺序', isNullable: 'YES', columnLength: 10, isPK: false },
      { columnName: 'status', dataType: 'char', columnComment: '状态', isNullable: 'YES', columnLength: 1, isPK: false },
      { columnName: 'create_time', dataType: 'datetime', columnComment: '创建时间', isNullable: 'YES', columnLength: 0, isPK: false }
    ]
  }

  return columnTemplates[tableName] || [
    { columnName: 'id', dataType: 'bigint', columnComment: 'ID', isNullable: 'NO', columnLength: 20, isPK: true },
    { columnName: 'name', dataType: 'varchar', columnComment: '名称', isNullable: 'YES', columnLength: 100, isPK: false },
    { columnName: 'status', dataType: 'char', columnComment: '状态', isNullable: 'YES', columnLength: 1, isPK: false },
    { columnName: 'create_time', dataType: 'datetime', columnComment: '创建时间', isNullable: 'YES', columnLength: 0, isPK: false }
  ]
}

export default [
  /**
   * 获取代码生成表分页列表
   */
  {
    url: '/api/tool/gen/table/page',
    method: 'get',
    response: async ({ query }: { query: { page?: string; limit?: string; tableName?: string; tableComment?: string } }) => {
      await randomDelay()

      const page = parseInt(query.page || '1')
      const limit = parseInt(query.limit || '10')
      const { tableName, tableComment } = query

      let list = [...db.genTables]

      if (tableName) {
        list = list.filter(t => t.tableName.includes(tableName))
      }
      if (tableComment) {
        list = list.filter(t => t.tableComment.includes(tableComment))
      }

      list.sort((a, b) => b.createTime.localeCompare(a.createTime))

      const start = (page - 1) * limit
      const end = start + limit
      const paginatedList = list.slice(start, end)

      return pageResult(paginatedList, list.length, page, limit)
    }
  },

  /**
   * 获取代码生成表列表
   */
  {
    url: '/api/tool/gen/table/list',
    method: 'get',
    response: async () => {
      await delay()
      return success(db.genTables)
    }
  },

  /**
   * 获取代码生成表详情
   */
  {
    url: '/api/tool/gen/table/:tableName',
    method: 'get',
    response: async ({ params }: { params: { tableName: string } }) => {
      await delay()

      const table = db.genTables.find(t => t.tableName === params.tableName)
      if (!table) {
        return fail('表不存在', 404)
      }

      const columns = generateColumns(params.tableName)

      return success({
        ...table,
        columns
      })
    }
  },

  /**
   * 获取代码生成配置
   */
  {
    url: '/api/tool/gen/config/:tableName',
    method: 'get',
    response: async ({ params }: { params: { tableName: string } }) => {
      await delay()

      const tableName = params.tableName
      const className = tableName
        .replace(/^sys_/, '')
        .replace(/_([a-z])/g, (_, c) => c.toUpperCase())
        .replace(/^[a-z]/, c => c.toUpperCase())

      return success({
        tableName,
        tableComment: db.genTables.find(t => t.tableName === tableName)?.tableComment || '',
        className,
        moduleName: 'system',
        packageName: 'com.yunshu.system',
        author: 'yunshu',
        email: 'yunshu@example.com',
        generateType: 'single',
        generateMenu: true,
        generateApi: true,
        generateView: true,
        generateTypeScript: true,
        businessName: className,
        functionName: className
      })
    }
  },

  /**
   * 更新代码生成配置
   */
  {
    url: '/api/tool/gen/config/:tableName',
    method: 'put',
    response: async ({ params, body }: { params: { tableName: string }; body: any }) => {
      await delay()
      // mock: 保存配置
      return success(null, '保存成功')
    }
  },

  /**
   * 代码预览
   */
  {
    url: '/api/tool/gen/preview/:tableName',
    method: 'get',
    response: async ({ params }: { params: { tableName: string } }) => {
      await delay(800)

      const files = [
        {
          fileName: `${params.tableName}.java`,
          filePath: `main/java/com/yunshu/system/${params.tableName}/${params.tableName}.java`,
          content: `package com.yunshu.system.${params.tableName};\n\npublic class ${params.tableName} {\n    // TODO: 实现实体类\n}`
        },
        {
          fileName: `${params.tableName}Controller.java`,
          filePath: `main/java/com/yunshu/system/${params.tableName}/${params.tableName}Controller.java`,
          content: `package com.yunshu.system.${params.tableName};\n\n@RestController\n@RequestMapping("/system/${params.tableName}")\npublic class ${params.tableName}Controller {\n    // TODO: 实现控制器\n}`
        },
        {
          fileName: `index.vue`,
          filePath: `views/system/${params.tableName}/index.vue`,
          content: `<template>\n  <div>\n    <!-- TODO: 实现页面 -->\n  </div>\n</template>`
        },
        {
          fileName: `types.ts`,
          filePath: `types/system/${params.tableName}.ts`,
          content: `export interface ${params.tableName} {\n  // TODO: 定义类型\n}`
        }
      ]

      return success({
        tableName: params.tableName,
        files
      })
    }
  },

  /**
   * 生成代码（下载）
   */
  {
    url: '/api/tool/gen/code/:tableName',
    method: 'post',
    response: async ({ params }: { params: { tableName: string } }) => {
      await delay(2000) // 生成代码需要较长时间

      return success({
        tableName: params.tableName,
        fileCount: 8,
        files: [
          'entity/Task.java',
          'mapper/TaskMapper.java',
          'service/ITaskService.java',
          'service/impl/TaskServiceImpl.java',
          'controller/TaskController.java',
          'views/Task/index.vue',
          'api/Task.ts',
          'types/Task.ts'
        ],
        downloadUrl: `/downloads/${params.tableName}_code.zip`
      })
    }
  },

  /**
   * 同步数据库表
   */
  {
    url: '/api/tool/gen/sync/:tableName',
    method: 'post',
    response: async ({ params }: { params: { tableName: string } }) => {
      await delay(1500)

      const table = db.genTables.find(t => t.tableName === params.tableName)
      if (!table) {
        return fail('表不存在', 404)
      }

      return success(null, '同步成功')
    }
  },

  /**
   * 删除代码生成表
   */
  {
    url: '/api/tool/gen/table/:tableName',
    method: 'delete',
    response: async ({ params }: { params: { tableName: string } }) => {
      await delay()

      const index = db.genTables.findIndex(t => t.tableName === params.tableName)
      if (index === -1) {
        return fail('表不存在', 404)
      }

      db.genTables.splice(index, 1)
      return success(null, '删除成功')
    }
  }
] as MockMethod[]

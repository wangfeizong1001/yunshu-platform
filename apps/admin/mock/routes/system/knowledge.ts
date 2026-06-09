/**
 * 知识库 Mock API
 * @module mock/routes/system/knowledge
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../../utils/response'
import { delay, randomDelay } from '../../utils/delay'

// 知识库分类数据
let mockCategories = [
  {
    categoryId: 1,
    categoryName: '技术文档',
    parentId: 0,
    sort: 1,
    status: '0',
    createBy: 'admin',
    createTime: '2024-01-01 00:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-01 00:00:00',
    remark: '技术相关文档'
  },
  {
    categoryId: 2,
    categoryName: '操作手册',
    parentId: 0,
    sort: 2,
    status: '0',
    createBy: 'admin',
    createTime: '2024-01-01 00:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-01 00:00:00',
    remark: '系统操作手册'
  },
  {
    categoryId: 3,
    categoryName: '常见问题',
    parentId: 0,
    sort: 3,
    status: '0',
    createBy: 'admin',
    createTime: '2024-01-01 00:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-01 00:00:00',
    remark: 'FAQ'
  },
  {
    categoryId: 4,
    categoryName: '前端开发',
    parentId: 1,
    sort: 1,
    status: '0',
    createBy: 'admin',
    createTime: '2024-01-01 00:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-01 00:00:00',
    remark: ''
  },
  {
    categoryId: 5,
    categoryName: '后端开发',
    parentId: 1,
    sort: 2,
    status: '0',
    createBy: 'admin',
    createTime: '2024-01-01 00:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-01 00:00:00',
    remark: ''
  }
]

// 知识库文档数据
let mockKnowledgeList = [
  {
    knowledgeId: 1,
    title: 'Vue 3 开发指南',
    categoryId: 4,
    categoryName: '前端开发',
    content: '<h2>Vue 3 简介</h2><p>Vue 3 是 Vue.js 的最新版本，带来了许多新特性和改进。</p><h3>Composition API</h3><p>Composition API 是 Vue 3 最重要的新特性之一，它提供了更灵活的代码组织方式。</p><h3>Teleport</h3><p>Teleport 允许将组件内容渲染到 DOM 树中的任意位置。</p>',
    summary: 'Vue 3 开发入门指南，介绍 Composition API 和新特性',
    coverUrl: '',
    tags: 'Vue3,前端,JavaScript',
    status: '0',
    visible: '0',
    sort: 1,
    viewCount: 1256,
    createBy: 'admin',
    createTime: '2024-01-15 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-15 10:00:00',
    remark: ''
  },
  {
    knowledgeId: 2,
    title: '系统用户管理操作手册',
    categoryId: 2,
    categoryName: '操作手册',
    content: '<h2>用户管理功能说明</h2><p>本系统用户管理模块支持用户增删改查、角色分配等功能。</p><h3>新增用户</h3><p>点击"新增"按钮，填写用户信息并提交即可。</p><h3>编辑用户</h3><p>点击用户列表中的"编辑"按钮进行修改。</p>',
    summary: '详细介绍系统用户管理功能的使用方法',
    coverUrl: '',
    tags: '用户管理,操作手册',
    status: '0',
    visible: '0',
    sort: 1,
    viewCount: 892,
    createBy: 'admin',
    createTime: '2024-01-12 14:30:00',
    updateBy: 'admin',
    updateTime: '2024-01-12 14:30:00',
    remark: ''
  },
  {
    knowledgeId: 3,
    title: '如何重置密码',
    categoryId: 3,
    categoryName: '常见问题',
    content: '<h2>密码重置步骤</h2><p>如果忘记密码，请按以下步骤操作：</p><ol><li>点击登录页面的"忘记密码"</li><li>输入注册邮箱</li><li>查收重置邮件</li><li>点击邮件中的链接重置密码</li></ol>',
    summary: '忘记密码时的处理方法',
    coverUrl: '',
    tags: '密码,常见问题,FAQ',
    status: '0',
    visible: '0',
    sort: 1,
    viewCount: 2341,
    createBy: 'admin',
    createTime: '2024-01-10 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-10 09:00:00',
    remark: ''
  },
  {
    knowledgeId: 4,
    title: 'Spring Boot 最佳实践',
    categoryId: 5,
    categoryName: '后端开发',
    content: '<h2>Spring Boot 简介</h2><p>Spring Boot 简化了 Spring 应用的配置和部署。</p><h3>自动配置</h3><p>Spring Boot 的自动配置特性可以根据依赖自动配置应用。</p><h3>起步依赖</h3><p>通过起步依赖可以快速引入所需的依赖库。</p>',
    summary: 'Spring Boot 开发最佳实践指南',
    coverUrl: '',
    tags: 'Spring Boot,Java,后端',
    status: '0',
    visible: '0',
    sort: 2,
    viewCount: 756,
    createBy: 'admin',
    createTime: '2024-01-08 16:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-08 16:00:00',
    remark: ''
  },
  {
    knowledgeId: 5,
    title: '系统架构设计文档',
    categoryId: 1,
    categoryName: '技术文档',
    content: '<h2>系统架构概览</h2><p>本系统采用前后端分离架构设计。</p><h3>技术栈</h3><p>前端：Vue 3 + Element Plus</p><p>后端：Node.js + Express + @yunshu/server-core</p><p>数据库：PostgreSQL 16</p><p>缓存：Redis 7</p>',
    summary: '系统整体架构设计说明',
    coverUrl: '',
    tags: '架构,技术文档,系统设计',
    status: '1',
    visible: '0',
    sort: 1,
    viewCount: 432,
    createBy: 'admin',
    createTime: '2024-01-05 11:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-05 11:00:00',
    remark: '草稿'
  }
]

/** 根据分类 ID 获取分类名称 */
function getCategoryName(categoryId: number): string {
  const category = mockCategories.find(c => c.categoryId === categoryId)
  return category?.categoryName || ''
}

/** 构建分类树 */
function buildCategoryTree(categories: any[], parentId: number = 0): any[] {
  return categories
    .filter(c => c.parentId === parentId)
    .map(c => ({
      ...c,
      children: buildCategoryTree(categories, c.categoryId)
    }))
}

export default [
  /**
   * 获取知识库文档分页列表
   */
  {
    url: '/api/system/knowledge/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; keyword?: string; categoryId?: string; status?: string; visible?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { keyword, categoryId, status, visible } = query

      let list = [...mockKnowledgeList]

      // 筛选
      if (keyword) {
        list = list.filter(item =>
          item.title.includes(keyword) ||
          item.content.includes(keyword) ||
          item.summary.includes(keyword) ||
          item.tags.includes(keyword)
        )
      }
      if (categoryId) {
        list = list.filter(item => item.categoryId === parseInt(categoryId))
      }
      if (status) {
        list = list.filter(item => item.status === status)
      }
      if (visible) {
        list = list.filter(item => item.visible === visible)
      }

      // 排序
      list.sort((a, b) => b.knowledgeId - a.knowledgeId)

      // 分页
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      const paginatedList = list.slice(start, end)

      return pageResult(paginatedList, list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取知识库文档列表
   */
  {
    url: '/api/system/knowledge/list',
    method: 'get',
    response: async ({ query }: { query: { keyword?: string; categoryId?: string; status?: string; visible?: string } }) => {
      await delay()

      const { keyword, categoryId, status, visible } = query

      let list = [...mockKnowledgeList]

      if (keyword) {
        list = list.filter(item =>
          item.title.includes(keyword) ||
          item.content.includes(keyword)
        )
      }
      if (categoryId) {
        list = list.filter(item => item.categoryId === parseInt(categoryId))
      }
      if (status) {
        list = list.filter(item => item.status === status)
      }
      if (visible) {
        list = list.filter(item => item.visible === visible)
      }

      return success(list)
    }
  },

  /**
   * 获取知识库文档详情
   */
  {
    url: '/api/system/knowledge/:knowledgeId',
    method: 'get',
    response: async ({ params }: { params: { knowledgeId: string } }) => {
      await delay()

      const knowledge = mockKnowledgeList.find(k => k.knowledgeId === parseInt(params.knowledgeId))
      if (!knowledge) {
        return fail('文档不存在', 404)
      }

      // 增加浏览次数
      knowledge.viewCount++

      return success(knowledge)
    }
  },

  /**
   * 新增知识库文档
   */
  {
    url: '/api/system/knowledge',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      const maxId = Math.max(...mockKnowledgeList.map(k => k.knowledgeId), 0)
      const newKnowledge = {
        knowledgeId: maxId + 1,
        title: body.title,
        categoryId: body.categoryId,
        categoryName: getCategoryName(body.categoryId),
        content: body.content || '',
        summary: body.summary || '',
        coverUrl: body.coverUrl || '',
        tags: body.tags || '',
        status: body.status || '0',
        visible: body.visible || '0',
        sort: body.sort || 0,
        viewCount: 0,
        createBy: 'admin',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateBy: 'admin',
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        remark: body.remark || ''
      }

      mockKnowledgeList.push(newKnowledge)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改知识库文档
   */
  {
    url: '/api/system/knowledge',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const index = mockKnowledgeList.findIndex(k => k.knowledgeId === body.knowledgeId)
      if (index === -1) {
        return fail('文档不存在', 404)
      }

      mockKnowledgeList[index] = {
        ...mockKnowledgeList[index],
        ...body,
        categoryName: getCategoryName(body.categoryId || mockKnowledgeList[index].categoryId),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除知识库文档
   */
  {
    url: '/api/system/knowledge/:knowledgeId',
    method: 'delete',
    response: async ({ params }: { params: { knowledgeId: string } }) => {
      await delay()

      const index = mockKnowledgeList.findIndex(k => k.knowledgeId === parseInt(params.knowledgeId))
      if (index === -1) {
        return fail('文档不存在', 404)
      }

      mockKnowledgeList.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 批量删除知识库文档
   */
  {
    url: '/api/system/knowledge/batch',
    method: 'delete',
    response: async ({ body }: { body: { knowledgeIds: number[] } }) => {
      await delay()

      const { knowledgeIds } = body
      if (!knowledgeIds || knowledgeIds.length === 0) {
        return fail('请选择要删除的文档')
      }

      const initialLength = mockKnowledgeList.length
      mockKnowledgeList = mockKnowledgeList.filter(k => !knowledgeIds.includes(k.knowledgeId))
      const deletedCount = initialLength - mockKnowledgeList.length

      return success(null, `删除成功${deletedCount}条`)
    }
  },

  /**
   * 发布知识库文档
   */
  {
    url: '/api/system/knowledge/publish/:knowledgeId',
    method: 'put',
    response: async ({ params }: { params: { knowledgeId: string } }) => {
      await delay()

      const knowledge = mockKnowledgeList.find(k => k.knowledgeId === parseInt(params.knowledgeId))
      if (!knowledge) {
        return fail('文档不存在', 404)
      }

      knowledge.status = '0'
      knowledge.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
      return success(null, '发布成功')
    }
  },

  /**
   * 撤回知识库文档
   */
  {
    url: '/api/system/knowledge/withdraw/:knowledgeId',
    method: 'put',
    response: async ({ params }: { params: { knowledgeId: string } }) => {
      await delay()

      const knowledge = mockKnowledgeList.find(k => k.knowledgeId === parseInt(params.knowledgeId))
      if (!knowledge) {
        return fail('文档不存在', 404)
      }

      knowledge.status = '1'
      knowledge.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
      return success(null, '撤回成功')
    }
  },

  /**
   * 获取知识库分类列表
   */
  {
    url: '/api/system/knowledge/category/list',
    method: 'get',
    response: async () => {
      await delay()
      return success(mockCategories)
    }
  },

  /**
   * 获取知识库分类树
   */
  {
    url: '/api/system/knowledge/category/tree',
    method: 'get',
    response: async () => {
      await delay()
      const tree = buildCategoryTree(mockCategories)
      return success(tree)
    }
  },

  /**
   * 新增知识库分类
   */
  {
    url: '/api/system/knowledge/category',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      const maxId = Math.max(...mockCategories.map(c => c.categoryId), 0)
      const newCategory = {
        categoryId: maxId + 1,
        categoryName: body.categoryName,
        parentId: body.parentId || 0,
        sort: body.sort || 0,
        status: body.status || '0',
        createBy: 'admin',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateBy: 'admin',
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        remark: body.remark || ''
      }

      mockCategories.push(newCategory)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改知识库分类
   */
  {
    url: '/api/system/knowledge/category',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const index = mockCategories.findIndex(c => c.categoryId === body.categoryId)
      if (index === -1) {
        return fail('分类不存在', 404)
      }

      mockCategories[index] = {
        ...mockCategories[index],
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除知识库分类
   */
  {
    url: '/api/system/knowledge/category/:categoryId',
    method: 'delete',
    response: async ({ params }: { params: { categoryId: string } }) => {
      await delay()

      const categoryId = parseInt(params.categoryId)

      // 检查是否有子分类
      if (mockCategories.some(c => c.parentId === categoryId)) {
        return fail('该分类下有子分类，无法删除')
      }

      // 检查是否有文档
      if (mockKnowledgeList.some(k => k.categoryId === categoryId)) {
        return fail('该分类下有文档，无法删除')
      }

      const index = mockCategories.findIndex(c => c.categoryId === categoryId)
      if (index === -1) {
        return fail('分类不存在', 404)
      }

      mockCategories.splice(index, 1)
      return success(null, '删除成功')
    }
  }
] as MockMethod[]

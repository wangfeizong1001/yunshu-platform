/**
 * 知识库 Mock 数据
 */

import type { KnowledgeInfo, KnowledgeCategory } from '@/api/system/knowledge.api';

// 知识库分类 Mock 数据
export const mockCategoryList: KnowledgeCategory[] = [
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
    remark: '技术相关文档',
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
    remark: '系统操作手册',
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
    remark: 'FAQ',
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
    remark: '',
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
    remark: '',
  },
];

// 知识库文档 Mock 数据
export const mockKnowledgeList: KnowledgeInfo[] = [
  {
    knowledgeId: 1,
    title: 'Vue 3 开发指南',
    categoryId: 4,
    categoryName: '前端开发',
    content:
      '<h2>Vue 3 简介</h2><p>Vue 3 是 Vue.js 的最新版本，带来了许多新特性和改进。</p><h3>Composition API</h3><p>Composition API 是 Vue 3 最重要的新特性之一，它提供了更灵活的代码组织方式。</p><h3>Teleport</h3><p>Teleport 允许将组件内容渲染到 DOM 树中的任意位置。</p>',
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
    remark: '',
  },
  {
    knowledgeId: 2,
    title: '系统用户管理操作手册',
    categoryId: 2,
    categoryName: '操作手册',
    content:
      '<h2>用户管理功能说明</h2><p>本系统用户管理模块支持用户增删改查、角色分配等功能。</p><h3>新增用户</h3><p>点击"新增"按钮，填写用户信息并提交即可。</p><h3>编辑用户</h3><p>点击用户列表中的"编辑"按钮进行修改。</p>',
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
    remark: '',
  },
  {
    knowledgeId: 3,
    title: '如何重置密码',
    categoryId: 3,
    categoryName: '常见问题',
    content:
      '<h2>密码重置步骤</h2><p>如果忘记密码，请按以下步骤操作：</p><ol><li>点击登录页面的"忘记密码"</li><li>输入注册邮箱</li><li>查收重置邮件</li><li>点击邮件中的链接重置密码</li></ol>',
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
    remark: '',
  },
  {
    knowledgeId: 4,
    title: 'Spring Boot 最佳实践',
    categoryId: 5,
    categoryName: '后端开发',
    content:
      '<h2>Spring Boot 简介</h2><p>Spring Boot 简化了 Spring 应用的配置和部署。</p><h3>自动配置</h3><p>Spring Boot 的自动配置特性可以根据依赖自动配置应用。</p><h3>起步依赖</h3><p>通过起步依赖可以快速引入所需的依赖库。</p>',
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
    remark: '',
  },
  {
    knowledgeId: 5,
    title: '系统架构设计文档',
    categoryId: 1,
    categoryName: '技术文档',
    content:
      '<h2>系统架构概览</h2><p>本系统采用前后端分离架构设计。</p><h3>技术栈</h3><p>前端：Vue 3 + Element Plus</p><p>后端：Node.js + Express + @yunshu/server-core</p><p>数据库：PostgreSQL 16</p><p>缓存：Redis 7</p>',
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
    remark: '草稿',
  },
];

// 获取知识库文档分页列表 Mock
export function getMockKnowledgePage(params: any): { total: number; rows: KnowledgeInfo[] } {
  const {
    pageNum = 1,
    pageSize = 10,
    keyword = '',
    categoryId = '',
    status = '',
    visible = '',
  } = params;

  let filteredList = mockKnowledgeList;

  if (keyword) {
    filteredList = filteredList.filter(
      (item) =>
        item.title.includes(keyword) ||
        item.content.includes(keyword) ||
        item.summary.includes(keyword) ||
        item.tags.includes(keyword),
    );
  }

  if (categoryId) {
    filteredList = filteredList.filter((item) => item.categoryId === Number(categoryId));
  }

  if (status) {
    filteredList = filteredList.filter((item) => item.status === status);
  }

  if (visible) {
    filteredList = filteredList.filter((item) => item.visible === visible);
  }

  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const rows = filteredList.slice(start, end);

  return {
    total: filteredList.length,
    rows,
  };
}

// 获取知识库文档列表 Mock
export function getMockKnowledgeList(_params: any): KnowledgeInfo[] {
  return mockKnowledgeList;
}

// 获取知识库文档详情 Mock
export function getMockKnowledgeDetail(knowledgeId: number): KnowledgeInfo | undefined {
  return mockKnowledgeList.find((item) => item.knowledgeId === knowledgeId);
}

// 新增知识库文档 Mock
export function addMockKnowledge(data: Partial<KnowledgeInfo>): KnowledgeInfo {
  const newItem: KnowledgeInfo = {
    knowledgeId: Math.max(...mockKnowledgeList.map((u) => u.knowledgeId)) + 1,
    title: data.title || '',
    categoryId: data.categoryId || 1,
    categoryName: data.categoryName || '技术文档',
    content: data.content || '',
    summary: data.summary || '',
    coverUrl: data.coverUrl || '',
    tags: data.tags || '',
    status: data.status || '0',
    visible: data.visible || '0',
    sort: data.sort || 0,
    viewCount: 0,
    createBy: 'admin',
    createTime: new Date().toLocaleString(),
    updateBy: 'admin',
    updateTime: new Date().toLocaleString(),
    remark: data.remark || '',
  };
  mockKnowledgeList.push(newItem);
  return newItem;
}

// 更新知识库文档 Mock
export function updateMockKnowledge(
  knowledgeId: number,
  data: Partial<KnowledgeInfo>,
): KnowledgeInfo | undefined {
  const index = mockKnowledgeList.findIndex((u) => u.knowledgeId === knowledgeId);
  if (index !== -1) {
    mockKnowledgeList[index] = {
      ...mockKnowledgeList[index],
      ...data,
      updateTime: new Date().toLocaleString(),
    };
    return mockKnowledgeList[index];
  }
  return undefined;
}

// 删除知识库文档 Mock
export function deleteMockKnowledge(knowledgeId: number): boolean {
  const index = mockKnowledgeList.findIndex((u) => u.knowledgeId === knowledgeId);
  if (index !== -1) {
    mockKnowledgeList.splice(index, 1);
    return true;
  }
  return false;
}

// 发布知识库文档 Mock
export function publishMockKnowledge(knowledgeId: number): boolean {
  const index = mockKnowledgeList.findIndex((u) => u.knowledgeId === knowledgeId);
  if (index !== -1) {
    mockKnowledgeList[index].status = '0';
    mockKnowledgeList[index].updateTime = new Date().toLocaleString();
    return true;
  }
  return false;
}

// 撤回知识库文档 Mock
export function withdrawMockKnowledge(knowledgeId: number): boolean {
  const index = mockKnowledgeList.findIndex((u) => u.knowledgeId === knowledgeId);
  if (index !== -1) {
    mockKnowledgeList[index].status = '1';
    mockKnowledgeList[index].updateTime = new Date().toLocaleString();
    return true;
  }
  return false;
}

// 获取知识库分类列表 Mock
export function getMockCategoryList(): KnowledgeCategory[] {
  return mockCategoryList;
}

// 获取知识库分类树 Mock
export function getMockCategoryTree(): KnowledgeCategory[] {
  return buildTree(mockCategoryList, 0);
}

function buildTree(list: KnowledgeCategory[], parentId: number): KnowledgeCategory[] {
  const tree: KnowledgeCategory[] = [];
  list.forEach((item) => {
    if (item.parentId === parentId) {
      const children = buildTree(list, item.categoryId);
      if (children.length > 0) {
        (item as any).children = children;
      }
      tree.push(item);
    }
  });
  return tree;
}

// 新增知识库分类 Mock
export function addMockCategory(data: Partial<KnowledgeCategory>): KnowledgeCategory {
  const newItem: KnowledgeCategory = {
    categoryId: Math.max(...mockCategoryList.map((u) => u.categoryId)) + 1,
    categoryName: data.categoryName || '',
    parentId: data.parentId || 0,
    sort: data.sort || 0,
    status: data.status || '0',
    createBy: 'admin',
    createTime: new Date().toLocaleString(),
    updateBy: 'admin',
    updateTime: new Date().toLocaleString(),
    remark: data.remark || '',
  };
  mockCategoryList.push(newItem);
  return newItem;
}

// 更新知识库分类 Mock
export function updateMockCategory(
  categoryId: number,
  data: Partial<KnowledgeCategory>,
): KnowledgeCategory | undefined {
  const index = mockCategoryList.findIndex((u) => u.categoryId === categoryId);
  if (index !== -1) {
    mockCategoryList[index] = {
      ...mockCategoryList[index],
      ...data,
      updateTime: new Date().toLocaleString(),
    };
    return mockCategoryList[index];
  }
  return undefined;
}

// 删除知识库分类 Mock
export function deleteMockCategory(categoryId: number): boolean {
  const index = mockCategoryList.findIndex((u) => u.categoryId === categoryId);
  if (index !== -1) {
    mockCategoryList.splice(index, 1);
    return true;
  }
  return false;
}

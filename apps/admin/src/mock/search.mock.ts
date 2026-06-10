/**
 * 搜索 Mock 数据
 */

import type {
  SearchResponse,
  SearchResultItem,
  HotSearchResponse,
  SearchHistoryItem,
  SearchType,
} from '@/api/search.api';

// Mock 搜索结果数据
const mockSearchData: SearchResultItem[] = [
  {
    id: 1,
    type: 'user',
    title: '张三',
    description: '系统管理员，负责系统维护和用户管理',
    content: '张三是系统的超级管理员，拥有所有权限，负责系统的日常维护和用户管理工作。',
    url: '/system/user/1',
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-06-01 14:20:00',
    extra: {
      username: 'zhangsan',
      email: 'zhangsan@example.com',
      phone: '13800138001',
      status: '0',
    },
  },
  {
    id: 2,
    type: 'user',
    title: '李四',
    description: '普通用户，使用系统进行日常办公',
    content: '李四是公司的普通员工，使用系统进行日常办公和数据查询。',
    url: '/system/user/2',
    createTime: '2024-02-20 09:15:00',
    updateTime: '2024-05-15 11:30:00',
    extra: {
      username: 'lisi',
      email: 'lisi@example.com',
      phone: '13800138002',
      status: '0',
    },
  },
  {
    id: 1,
    type: 'dept',
    title: '技术部',
    description: '负责系统开发和技术支持',
    content: '技术部负责系统的开发、维护和技术支持工作，确保系统的稳定运行。',
    url: '/system/dept/1',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-06-01 10:00:00',
    extra: {
      leader: '王五',
      phone: '010-12345678',
      status: '0',
    },
  },
  {
    id: 2,
    type: 'dept',
    title: '市场部',
    description: '负责市场推广和客户服务',
    content: '市场部负责公司的市场推广、品牌建设和客户服务工作。',
    url: '/system/dept/2',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-05-20 15:00:00',
    extra: {
      leader: '赵六',
      phone: '010-87654321',
      status: '0',
    },
  },
  {
    id: 1,
    type: 'menu',
    title: '用户管理',
    description: '管理系统用户，包括新增、编辑、删除等操作',
    content: '用户管理模块提供对系统用户的全面管理功能，支持用户的增删改查操作。',
    url: '/system/user',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-06-01 09:00:00',
    extra: {
      icon: 'user',
      path: '/system/user',
      component: 'system/user/index',
    },
  },
  {
    id: 2,
    type: 'menu',
    title: '角色管理',
    description: '管理系统角色和权限分配',
    content: '角色管理模块用于管理系统的角色信息，以及为角色分配相应的权限。',
    url: '/system/role',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-05-25 16:00:00',
    extra: {
      icon: 'role',
      path: '/system/role',
      component: 'system/role/index',
    },
  },
  {
    id: 1,
    type: 'role',
    title: '超级管理员',
    description: '拥有系统所有权限',
    content: '超级管理员角色拥有系统的所有操作权限，用于系统的最高级管理。',
    url: '/system/role/1',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-06-01 08:00:00',
    extra: {
      roleKey: 'admin',
      status: '0',
      dataScope: '1',
    },
  },
  {
    id: 2,
    type: 'role',
    title: '普通用户',
    description: '拥有基本的操作权限',
    content: '普通用户角色拥有系统的基本操作权限，可以进行日常的数据查询和业务处理。',
    url: '/system/role/2',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-05-28 12:00:00',
    extra: {
      roleKey: 'common',
      status: '0',
      dataScope: '3',
    },
  },
  {
    id: 1,
    type: 'notice',
    title: '系统升级通知',
    description: '关于系统进行版本升级的通知',
    content:
      '为了提升系统性能和用户体验，计划于2024年6月10日进行系统版本升级，请各位用户提前做好准备。',
    url: '/system/notice/1',
    createTime: '2024-06-05 09:00:00',
    updateTime: '2024-06-05 09:00:00',
    extra: {
      noticeType: '1',
      status: '0',
    },
  },
  {
    id: 2,
    type: 'notice',
    title: '安全提醒',
    description: '关于账户安全的重要提醒',
    content: '请各位用户妥善保管自己的账户密码，定期更换密码，避免使用弱密码。',
    url: '/system/notice/2',
    createTime: '2024-06-03 14:00:00',
    updateTime: '2024-06-03 14:00:00',
    extra: {
      noticeType: '2',
      status: '0',
    },
  },
  {
    id: 1,
    type: 'knowledge',
    title: '系统使用手册',
    description: '详细的系统使用指南和操作说明',
    content: '本文档详细介绍了系统的各项功能和使用方法，帮助用户快速上手。',
    url: '/system/knowledge/1',
    createTime: '2024-05-01 10:00:00',
    updateTime: '2024-06-01 16:00:00',
    extra: {
      category: '使用指南',
      author: '技术部',
      views: 1520,
      status: '0',
    },
  },
  {
    id: 2,
    type: 'knowledge',
    title: '常见问题解答',
    description: '系统使用过程中的常见问题及解决方案',
    content: '本文档整理了用户在使用系统过程中遇到的常见问题，并提供了相应的解决方案。',
    url: '/system/knowledge/2',
    createTime: '2024-05-15 11:00:00',
    updateTime: '2024-05-30 13:00:00',
    extra: {
      category: 'FAQ',
      author: '客服部',
      views: 890,
      status: '0',
    },
  },
];

// Mock 热门搜索数据
const mockHotSearches = [
  { keyword: '用户管理', count: 256 },
  { keyword: '系统设置', count: 198 },
  { keyword: '权限配置', count: 175 },
  { keyword: '数据统计', count: 145 },
  { keyword: '报表导出', count: 123 },
  { keyword: '通知公告', count: 102 },
  { keyword: '知识文档', count: 89 },
  { keyword: '流程审批', count: 78 },
];

// Mock 搜索历史数据
const mockSearchHistory: SearchHistoryItem[] = [
  {
    id: 1,
    keyword: '用户管理',
    searchTime: '2024-06-08 10:30:00',
    type: 'all',
  },
  {
    id: 2,
    keyword: '系统升级',
    searchTime: '2024-06-07 16:45:00',
    type: 'notice',
  },
  {
    id: 3,
    keyword: '权限配置',
    searchTime: '2024-06-06 09:20:00',
    type: 'menu',
  },
  {
    id: 4,
    keyword: '张三',
    searchTime: '2024-06-05 14:10:00',
    type: 'user',
  },
  {
    id: 5,
    keyword: '使用手册',
    searchTime: '2024-06-04 11:30:00',
    type: 'knowledge',
  },
];

/**
 * 获取搜索结果
 */
export function getMockSearchResults(params: {
  keyword: string;
  type?: SearchType;
  pageNum?: number;
  pageSize?: number;
}): SearchResponse {
  const { keyword, type, pageNum = 1, pageSize = 10 } = params;

  let results = [...mockSearchData];

  // 按类型筛选
  if (type && type !== 'all') {
    results = results.filter((item) => item.type === type);
  }

  // 按关键词搜索
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        (item.description && item.description.toLowerCase().includes(lowerKeyword)) ||
        (item.content && item.content.toLowerCase().includes(lowerKeyword)),
    );

    // 生成高亮
    results = results.map((item) => {
      const highlights: Record<string, string> = {};
      if (item.title.toLowerCase().includes(lowerKeyword)) {
        highlights.title = item.title.replace(new RegExp(`(${keyword})`, 'gi'), '<mark>$1</mark>');
      }
      if (item.description && item.description.toLowerCase().includes(lowerKeyword)) {
        highlights.description = item.description.replace(
          new RegExp(`(${keyword})`, 'gi'),
          '<mark>$1</mark>',
        );
      }
      return { ...item, highlights };
    });
  }

  // 分页
  const total = results.length;
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const list = results.slice(start, end);

  // 生成搜索建议
  const suggestions: string[] = [];
  if (keyword) {
    mockHotSearches.forEach((item) => {
      if (item.keyword.toLowerCase().includes(keyword.toLowerCase())) {
        suggestions.push(item.keyword);
      }
    });
  }

  return {
    list,
    total,
    pageNum,
    pageSize,
    took: Math.floor(Math.random() * 100) + 20,
    suggestions: suggestions.slice(0, 5),
  };
}

/**
 * 获取热门搜索
 */
export function getMockHotSearches(limit = 10): HotSearchResponse {
  return {
    keywords: mockHotSearches.slice(0, limit),
  };
}

/**
 * 获取搜索历史
 */
export function getMockSearchHistory(limit = 20): SearchHistoryItem[] {
  return mockSearchHistory.slice(0, limit);
}

/**
 * 保存搜索历史
 */
export function saveMockSearchHistory(data: { keyword: string; type?: SearchType }): void {
  const newItem: SearchHistoryItem = {
    id: Date.now(),
    keyword: data.keyword,
    searchTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    type: data.type,
  };
  mockSearchHistory.unshift(newItem);
  if (mockSearchHistory.length > 50) {
    mockSearchHistory.pop();
  }
}

/**
 * 删除搜索历史
 */
export function deleteMockSearchHistory(id: string | number): void {
  const index = mockSearchHistory.findIndex((item) => item.id === id);
  if (index !== -1) {
    mockSearchHistory.splice(index, 1);
  }
}

/**
 * 清空搜索历史
 */
export function clearMockSearchHistory(): void {
  mockSearchHistory.length = 0;
}

/**
 * 获取搜索统计
 */
export function getMockSearchStats() {
  return {
    totalSearches: 12580,
    todaySearches: 256,
    activeUsers: 89,
    indexedDocs: mockSearchData.length,
  };
}

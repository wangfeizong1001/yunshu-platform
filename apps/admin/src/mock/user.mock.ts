/**
 * 用户 Mock 数据
 */

import type { SysUser, SysUserPageResp } from '@yunshu/shared'

// 生成 Mock 用户数据
export const mockUserList: SysUser[] = [
  {
    userId: 1,
    username: 'admin',
    nickname: '管理员',
    email: 'admin@yunshu.com',
    phone: '15888888888',
    sex: '0',
    avatar: '',
    status: '0',
    deptId: 1,
    deptName: '技术部',
    postId: [1],
    roleId: [1],
    loginIp: '127.0.0.1',
    loginDate: '2024-01-15 10:30:00',
    createTime: '2023-01-01 00:00:00',
    remark: '系统管理员',
  },
  {
    userId: 2,
    username: 'user01',
    nickname: '张三',
    email: 'zhangsan@yunshu.com',
    phone: '15888888881',
    sex: '0',
    avatar: '',
    status: '0',
    deptId: 2,
    deptName: '产品部',
    postId: [2],
    roleId: [2],
    loginIp: '192.168.1.100',
    loginDate: '2024-01-14 15:20:00',
    createTime: '2023-03-15 08:30:00',
    remark: '产品经理',
  },
  {
    userId: 3,
    username: 'user02',
    nickname: '李四',
    email: 'lisi@yunshu.com',
    phone: '15888888882',
    sex: '1',
    avatar: '',
    status: '0',
    deptId: 3,
    deptName: '设计部',
    postId: [3],
    roleId: [2],
    loginIp: '192.168.1.101',
    loginDate: '2024-01-14 09:15:00',
    createTime: '2023-05-20 14:00:00',
    remark: 'UI设计师',
  },
  {
    userId: 4,
    username: 'user03',
    nickname: '王五',
    email: 'wangwu@yunshu.com',
    phone: '15888888883',
    sex: '0',
    avatar: '',
    status: '0',
    deptId: 4,
    deptName: '市场部',
    postId: [4],
    roleId: [3],
    loginIp: '192.168.1.102',
    loginDate: '2024-01-13 16:45:00',
    createTime: '2023-07-10 10:00:00',
    remark: '市场专员',
  },
  {
    userId: 5,
    username: 'user04',
    nickname: '赵六',
    email: 'zhaoliu@yunshu.com',
    phone: '15888888884',
    sex: '0',
    avatar: '',
    status: '1',
    deptId: 2,
    deptName: '产品部',
    postId: [5],
    roleId: [3],
    loginIp: '',
    loginDate: '',
    createTime: '2023-09-01 09:00:00',
    remark: '实习生',
  },
]

// 获取用户分页列表 Mock
export function getMockUserPage(params: any): SysUserPageResp {
  const { pageNum = 1, pageSize = 10, keyword = '', status = '' } = params

  let filteredList = mockUserList

  // 关键词过滤
  if (keyword) {
    filteredList = filteredList.filter(
      (user) =>
        user.username.includes(keyword) ||
        user.nickname.includes(keyword) ||
        user.phone.includes(keyword)
    )
  }

  // 状态过滤
  if (status) {
    filteredList = filteredList.filter((user) => user.status === status)
  }

  // 分页
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 获取用户详情 Mock
export function getMockUserDetail(userId: number): SysUser | undefined {
  return mockUserList.find((user) => user.userId === userId)
}

// 新增用户 Mock
export function addMockUser(user: Partial<SysUser>): SysUser {
  const newUser: SysUser = {
    userId: Math.max(...mockUserList.map((u) => u.userId)) + 1,
    username: user.username || '',
    nickname: user.nickname || '',
    email: user.email || '',
    phone: user.phone || '',
    sex: user.sex || '2',
    avatar: user.avatar || '',
    status: user.status || '0',
    deptId: user.deptId || 0,
    postId: user.postId || [],
    roleId: user.roleId || [],
    loginIp: '',
    loginDate: '',
    createTime: new Date().toLocaleString(),
    remark: user.remark || '',
  }
  mockUserList.push(newUser)
  return newUser
}

// 更新用户 Mock
export function updateMockUser(userId: number, user: Partial<SysUser>): SysUser | undefined {
  const index = mockUserList.findIndex((u) => u.userId === userId)
  if (index !== -1) {
    mockUserList[index] = { ...mockUserList[index], ...user }
    return mockUserList[index]
  }
  return undefined
}

// 删除用户 Mock
export function deleteMockUser(userId: number): boolean {
  const index = mockUserList.findIndex((u) => u.userId === userId)
  if (index !== -1) {
    mockUserList.splice(index, 1)
    return true
  }
  return false
}

/**
 * 通知公告 Mock 数据
 */


// 通知公告 Mock 数据
export const mockNoticeList: any[] = [
  {
    noticeId: 1,
    noticeTitle: '系统升级通知',
    noticeType: '1',
    noticeContent: '<p>系统将于本周六凌晨2:00-6:00进行升级维护，届时系统将暂停服务，请提前做好准备。</p>',
    status: '0',
    createBy: 'admin',
    createTime: '2024-01-15 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-15 10:00:00',
    remark: '例行维护',
  },
  {
    noticeId: 2,
    noticeTitle: '新增功能上线公告',
    noticeType: '2',
    noticeContent: '<p>平台新增数据可视化功能，支持自定义图表配置，欢迎体验使用。</p>',
    status: '0',
    createBy: 'admin',
    createTime: '2024-01-10 14:30:00',
    updateBy: 'admin',
    updateTime: '2024-01-10 14:30:00',
    remark: '',
  },
  {
    noticeId: 3,
    noticeTitle: '密码安全提醒',
    noticeType: '1',
    noticeContent: '<p>为保障账户安全，建议您定期更换密码，并启用双因素认证。</p>',
    status: '0',
    createBy: 'admin',
    createTime: '2024-01-08 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-08 09:00:00',
    remark: '',
  },
  {
    noticeId: 4,
    noticeTitle: '春节放假安排',
    noticeType: '2',
    noticeContent: '<p>根据公司安排，春节期间放假时间为2月9日至2月17日，2月18日正式上班。</p>',
    status: '1',
    createBy: 'admin',
    createTime: '2024-01-05 16:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-05 16:00:00',
    remark: '已撤回',
  },
  {
    noticeId: 5,
    noticeTitle: '数据迁移通知',
    noticeType: '1',
    noticeContent: '<p>系统将于下周进行数据迁移，届时可能会有短暂的服务中断，敬请谅解。</p>',
    status: '0',
    createBy: 'admin',
    createTime: '2024-01-03 11:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-03 11:00:00',
    remark: '',
  },
]

// 获取通知公告分页列表 Mock
export function getMockNoticePage(params: any): any {
  const { pageNum = 1, pageSize = 10, keyword = '', noticeType = '', status = '' } = params

  let filteredList = mockNoticeList

  if (keyword) {
    filteredList = filteredList.filter(
      (item) =>
        item.noticeTitle.includes(keyword) ||
        item.noticeContent.includes(keyword)
    )
  }

  if (noticeType) {
    filteredList = filteredList.filter((item) => item.noticeType === noticeType)
  }

  if (status) {
    filteredList = filteredList.filter((item) => item.status === status)
  }

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 获取通知公告详情 Mock
export function getMockNoticeDetail(noticeId: number): any | undefined {
  return mockNoticeList.find((item) => item.noticeId === noticeId)
}

// 新增通知公告 Mock
export function addMockNotice(data: Partial<any>): any {
  const newItem: any = {
    noticeId: Math.max(...mockNoticeList.map((u) => u.noticeId)) + 1,
    noticeTitle: data.noticeTitle || '',
    noticeType: data.noticeType || '1',
    noticeContent: data.noticeContent || '',
    status: data.status || '0',
    createBy: 'admin',
    createTime: new Date().toLocaleString(),
    updateBy: 'admin',
    updateTime: new Date().toLocaleString(),
    remark: data.remark || '',
  }
  mockNoticeList.push(newItem)
  return newItem
}

// 更新通知公告 Mock
export function updateMockNotice(noticeId: number, data: Partial<any>): any | undefined {
  const index = mockNoticeList.findIndex((u) => u.noticeId === noticeId)
  if (index !== -1) {
    mockNoticeList[index] = { ...mockNoticeList[index], ...data, updateTime: new Date().toLocaleString() }
    return mockNoticeList[index]
  }
  return undefined
}

// 删除通知公告 Mock
export function deleteMockNotice(noticeId: number): boolean {
  const index = mockNoticeList.findIndex((u) => u.noticeId === noticeId)
  if (index !== -1) {
    mockNoticeList.splice(index, 1)
    return true
  }
  return false
}

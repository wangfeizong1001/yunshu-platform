/**
 * 在线用户服务
 *
 * @module @yunshu/server-core/modules/monitor
 */

import type { IOnline, IOnlineQuery, IOnlineStats } from '@yunshu/shared';
import type { ServiceResult, PaginatedResult } from '@yunshu/shared';
import { createSuccessResult, createErrorResult, createPaginatedResult } from '@yunshu/shared';
import { ErrorCode } from '../../errors/BusinessError';
import { BaseService } from '../../base/BaseService';

interface OnlineModel {
  // Mock model interface
}

const mockData: IOnline[] = [];

// Generate initial mock data
for (let i = 1; i <= 50; i++) {
  const isMobile = i % 5 === 0;
  mockData.push({
    sessionId: `session_${i}_${Date.now()}`,
    userName: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
    loginAccount: `user${i}`,
    deptName: ['技术部', '运营部', '市场部', '财务部', '人事部'][i % 5],
    browser: isMobile ? 'Mobile Browser' : ['Chrome', 'Firefox', 'Edge', 'Safari'][i % 4],
    os: isMobile
      ? ['iOS 17', 'Android 14', 'HarmonyOS'][i % 3]
      : ['Windows 10', 'macOS', 'Linux'][i % 3],
    ip: `192.168.${i % 255}.${(i % 200) + 1}`,
    loginTime: new Date(Date.now() - i * 600000).toISOString(),
    lastAccessTime: new Date(Date.now() - i * 60000).toISOString(),
    expireTime: new Date(Date.now() + 30 * 60000).toISOString(),
    userId: String(1000 + i),
  });
}

export class OnlineService extends BaseService<OnlineModel, IOnline, Partial<IOnline>, Partial<IOnline>> {
  constructor() {
    super({} as OnlineModel, { entityName: '在线用户', softDelete: false });
  }

  async findById(id: string): Promise<ServiceResult<IOnline>> {
    const item = mockData.find((user) => user.sessionId === id);
    if (!item) {
      return createErrorResult(ErrorCode.NOT_FOUND, '在线用户不存在');
    }
    return createSuccessResult(item);
  }

  async findWithPagination(
    params: IOnlineQuery,
  ): Promise<ServiceResult<PaginatedResult<IOnline>>> {
    let filtered = [...mockData];

    // 关键词搜索
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.userName.toLowerCase().includes(search) ||
          user.loginAccount.toLowerCase().includes(search) ||
          user.ip.toLowerCase().includes(search),
      );
    }

    // 筛选用户名称
    if (params.userName) {
      filtered = filtered.filter((user) => user.userName === params.userName);
    }

    // 筛选登录账号
    if (params.loginAccount) {
      filtered = filtered.filter((user) => user.loginAccount === params.loginAccount);
    }

    // 排序
    const sortField = params.sort || 'loginTime';
    const sortOrder = params.order === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortField];
      const bVal = (b as Record<string, unknown>)[sortField];
      if (aVal < bVal) return -sortOrder;
      if (aVal > bVal) return sortOrder;
      return 0;
    });

    // 分页
    const page = params.page || 1;
    const limit = Math.min(params.limit || 10, 100);
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    return createSuccessResult(createPaginatedResult(data, page, limit, total));
  }

  async getStats(): Promise<ServiceResult<IOnlineStats>> {
    const stats: IOnlineStats = {
      totalCount: mockData.length,
      pcCount: mockData.filter((user) => !user.browser?.includes('Mobile')).length,
      mobileCount: mockData.filter((user) => user.browser?.includes('Mobile')).length,
    };
    return createSuccessResult(stats);
  }

  async forceLogout(sessionId: string): Promise<ServiceResult<boolean>> {
    const index = mockData.findIndex((user) => user.sessionId === sessionId);
    if (index === -1) {
      return createErrorResult(ErrorCode.NOT_FOUND, '在线用户不存在');
    }
    mockData.splice(index, 1);
    return createSuccessResult(true, '强制下线成功');
  }

  async forceLogoutBatch(sessionIds: string[]): Promise<ServiceResult<number>> {
    let logoutCount = 0;
    for (const sessionId of sessionIds) {
      const index = mockData.findIndex((user) => user.sessionId === sessionId);
      if (index !== -1) {
        mockData.splice(index, 1);
        logoutCount++;
      }
    }
    return createSuccessResult(logoutCount, `成功下线${logoutCount}名用户`);
  }
}

export const onlineService = new OnlineService();

/**
 * 登录日志服务
 *
 * @module @yunshu/server-core/modules/monitor
 */

import type { ILogininfor, ILogininforQuery, ILogininforCreate } from '@yunshu/shared';
import type { ServiceResult, PaginatedResult } from '@yunshu/shared';
import { createSuccessResult, createErrorResult, createPaginatedResult } from '@yunshu/shared';
import { ErrorCode } from '../../errors/BusinessError';
import { BaseService } from '../../base/BaseService';

interface LogininforModel {
  // Mock model interface
}

const mockData: ILogininfor[] = [];

// Generate initial mock data
for (let i = 1; i <= 100; i++) {
  const status = i % 15 === 0 ? '1' : '0';
  mockData.push({
    infoId: String(i),
    userName: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
    loginAccount: `admin${i % 5 === 0 ? '' : i}`,
    status,
    loginLocation: ['北京市海淀区', '上海市浦东新区', '广州市天河区', '深圳市南山区', '杭州市西湖区'][i % 5],
    operationType: ['登录', '登出', '修改密码', '注册'][i % 4] as ILogininfor['operationType'],
    os: ['Windows 10', 'macOS', 'Linux', 'iOS', 'Android'][i % 5],
    browser: ['Chrome', 'Firefox', 'Edge', 'Safari'][i % 4],
    loginTime: new Date(Date.now() - i * 1800000).toISOString(),
    msg: status === '0' ? '登录成功' : '账号密码错误',
    ip: `192.168.${i % 255}.${(i % 200) + 1}`,
    createTime: new Date(Date.now() - i * 1800000).toISOString(),
  });
}

export class LogininforService extends BaseService<LogininforModel, ILogininfor, ILogininforCreate, Partial<ILogininfor>> {
  constructor() {
    super({} as LogininforModel, { entityName: '登录日志', softDelete: false });
  }

  async findById(id: string): Promise<ServiceResult<ILogininfor>> {
    const item = mockData.find((log) => log.infoId === id);
    if (!item) {
      return createErrorResult(ErrorCode.NOT_FOUND, '登录日志不存在');
    }
    return createSuccessResult(item);
  }

  async findWithPagination(
    params: ILogininforQuery,
  ): Promise<ServiceResult<PaginatedResult<ILogininfor>>> {
    let filtered = [...mockData];

    // 关键词搜索
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(search) ||
          log.loginAccount.toLowerCase().includes(search) ||
          log.ip.toLowerCase().includes(search),
      );
    }

    // 筛选用户名称
    if (params.userName) {
      filtered = filtered.filter((log) => log.userName === params.userName);
    }

    // 筛选登录账号
    if (params.loginAccount) {
      filtered = filtered.filter((log) => log.loginAccount === params.loginAccount);
    }

    // 筛选状态
    if (params.status) {
      filtered = filtered.filter((log) => log.status === params.status);
    }

    // 筛选操作类型
    if (params.operationType) {
      filtered = filtered.filter((log) => log.operationType === params.operationType);
    }

    // 时间范围
    if (params.beginTime) {
      filtered = filtered.filter((log) => log.loginTime >= params.beginTime!);
    }
    if (params.endTime) {
      filtered = filtered.filter((log) => log.loginTime <= params.endTime!);
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

  async create(data: ILogininforCreate): Promise<ServiceResult<ILogininfor>> {
    const newLog: ILogininfor = {
      infoId: String(mockData.length + 1),
      ...data,
      os: data.os || 'Unknown',
      browser: data.browser || 'Unknown',
      msg: data.msg || '',
      createTime: new Date().toISOString(),
    };
    mockData.unshift(newLog);
    return createSuccessResult(newLog, '登录日志创建成功');
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    const index = mockData.findIndex((log) => log.infoId === id);
    if (index === -1) {
      return createErrorResult(ErrorCode.NOT_FOUND, '登录日志不存在');
    }
    mockData.splice(index, 1);
    return createSuccessResult(true, '登录日志删除成功');
  }

  async clean(): Promise<ServiceResult<boolean>> {
    mockData.length = 0;
    return createSuccessResult(true, '日志清理成功');
  }

  async deleteBatch(ids: string[]): Promise<ServiceResult<number>> {
    let deletedCount = 0;
    for (const id of ids) {
      const index = mockData.findIndex((log) => log.infoId === id);
      if (index !== -1) {
        mockData.splice(index, 1);
        deletedCount++;
      }
    }
    return createSuccessResult(deletedCount, `成功删除${deletedCount}条日志`);
  }

  async unlock(loginAccount: string): Promise<ServiceResult<boolean>> {
    const logs = mockData.filter((log) => log.loginAccount === loginAccount && log.status === '1');
    if (logs.length === 0) {
      return createErrorResult(ErrorCode.NOT_FOUND, '未找到该账号的锁定记录');
    }
    logs.forEach((log) => {
      log.status = '0';
      log.msg = '账户已解锁';
    });
    return createSuccessResult(true, '账号解锁成功');
  }
}

export const logininforService = new LogininforService();

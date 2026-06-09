/**
 * 操作日志服务
 *
 * @module @yunshu/server-core/modules/monitor
 */

import type { IOperlog, IOperlogQuery, IOperlogCreate } from '@yunshu/shared';
import type { ServiceResult, PaginatedResult } from '@yunshu/shared';
import { createSuccessResult, createErrorResult, createPaginatedResult } from '@yunshu/shared';
import { ErrorCode } from '../../errors/BusinessError';
import { BaseService } from '../../base/BaseService';

interface OperlogModel {
  // Mock model interface
}

const mockData: IOperlog[] = [];

// Generate initial mock data
for (let i = 1; i <= 100; i++) {
  mockData.push({
    operId: String(i),
    operName: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
    operTime: new Date(Date.now() - i * 3600000).toISOString(),
    operType: ['查询', '新增', '修改', '删除', '导出'][i % 5] as IOperlog['operType'],
    operModule: ['用户管理', '角色管理', '菜单管理', '部门管理', '岗位管理'][i % 5],
    status: i % 10 === 0 ? '1' : '0',
    requestMethod: ['GET', 'POST', 'PUT', 'DELETE'][i % 4],
    operUrl: `/api/system/${['user', 'role', 'menu', 'dept', 'post'][i % 5]}/${i}`,
    operIp: `192.168.${i % 255}.${(i % 200) + 1}`,
    operSystem: 'Windows 10',
    browser: ['Chrome', 'Firefox', 'Edge', 'Safari'][i % 4],
    costTime: Math.floor(Math.random() * 5000) + 100,
    operLocation: ['北京市海淀区', '上海市浦东新区', '广州市天河区', '深圳市南山区', '杭州市西湖区'][i % 5],
    operParam: JSON.stringify({ id: i, name: `name${i}` }),
    jsonResult: JSON.stringify({ code: 200, message: 'success' }),
    createTime: new Date(Date.now() - i * 3600000).toISOString(),
  });
}

export class OperlogService extends BaseService<OperlogModel, IOperlog, IOperlogCreate, Partial<IOperlog>> {
  constructor() {
    super({} as OperlogModel, { entityName: '操作日志', softDelete: false });
  }

  async findById(id: string): Promise<ServiceResult<IOperlog>> {
    const item = mockData.find((log) => log.operId === id);
    if (!item) {
      return createErrorResult(ErrorCode.NOT_FOUND, '操作日志不存在');
    }
    return createSuccessResult(item);
  }

  async findWithPagination(
    params: IOperlogQuery,
  ): Promise<ServiceResult<PaginatedResult<IOperlog>>> {
    let filtered = [...mockData];

    // 关键词搜索
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.operName.toLowerCase().includes(search) ||
          log.operModule.toLowerCase().includes(search) ||
          log.operUrl.toLowerCase().includes(search),
      );
    }

    // 筛选操作人
    if (params.operName) {
      filtered = filtered.filter((log) => log.operName === params.operName);
    }

    // 筛选操作类型
    if (params.operType) {
      filtered = filtered.filter((log) => log.operType === params.operType);
    }

    // 筛选模块
    if (params.operModule) {
      filtered = filtered.filter((log) => log.operModule === params.operModule);
    }

    // 筛选状态
    if (params.status) {
      filtered = filtered.filter((log) => log.status === params.status);
    }

    // 时间范围
    if (params.beginTime) {
      filtered = filtered.filter((log) => log.operTime >= params.beginTime!);
    }
    if (params.endTime) {
      filtered = filtered.filter((log) => log.operTime <= params.endTime!);
    }

    // 排序
    const sortField = params.sort || 'operTime';
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

  async create(data: IOperlogCreate): Promise<ServiceResult<IOperlog>> {
    const newLog: IOperlog = {
      operId: String(mockData.length + 1),
      ...data,
      operSystem: data.operSystem || 'Unknown',
      browser: data.browser || 'Unknown',
      costTime: data.costTime || 0,
      operLocation: data.operLocation || 'Unknown',
      operParam: data.operParam || '',
      jsonResult: data.jsonResult || '',
      createTime: new Date().toISOString(),
    };
    mockData.unshift(newLog);
    return createSuccessResult(newLog, '操作日志创建成功');
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    const index = mockData.findIndex((log) => log.operId === id);
    if (index === -1) {
      return createErrorResult(ErrorCode.NOT_FOUND, '操作日志不存在');
    }
    mockData.splice(index, 1);
    return createSuccessResult(true, '操作日志删除成功');
  }

  async clean(): Promise<ServiceResult<boolean>> {
    mockData.length = 0;
    return createSuccessResult(true, '日志清理成功');
  }

  async deleteBatch(ids: string[]): Promise<ServiceResult<number>> {
    let deletedCount = 0;
    for (const id of ids) {
      const index = mockData.findIndex((log) => log.operId === id);
      if (index !== -1) {
        mockData.splice(index, 1);
        deletedCount++;
      }
    }
    return createSuccessResult(deletedCount, `成功删除${deletedCount}条日志`);
  }
}

export const operlogService = new OperlogService();

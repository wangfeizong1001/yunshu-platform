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
}

function createInitialData(): IOperlog[] {
  const data: IOperlog[] = [];
  for (let i = 1; i <= 100; i++) {
    data.push({
      operId: String(i),
      operName: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
      operTime: new Date(Date.now() - i * 3600000).toISOString(),
      operType: ['查询', '新增', '修改', '删除', '导出'][i % 5] as IOperlog['operType'],
      operModule: ['用户管理', '角色管理', '菜单管理', '部门管理', '岗位管理'][i % 5],
      status: (i % 10 === 0 ? '1' : '0') as IOperlog['status'],
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
  return data;
}

function compareValues(aVal: unknown, bVal: unknown, sortOrder: number): number {
  if (aVal == null && bVal == null) return 0;
  if (aVal == null) return sortOrder;
  if (bVal == null) return -sortOrder;
  if (aVal < bVal) return -sortOrder;
  if (aVal > bVal) return sortOrder;
  return 0;
}

export class OperlogService extends BaseService<OperlogModel, IOperlog, IOperlogCreate, Partial<IOperlog>> {
  private mockData: IOperlog[];

  constructor() {
    super({} as OperlogModel, { entityName: '操作日志', softDelete: false });
    this.mockData = createInitialData();
  }

  async findById(id: string): Promise<ServiceResult<IOperlog>> {
    const item = this.mockData.find((log) => log.operId === id);
    if (!item) {
      return createErrorResult(ErrorCode.NOT_FOUND, '操作日志不存在');
    }
    return createSuccessResult(item);
  }

  async findWithPagination(
    params: IOperlogQuery,
  ): Promise<ServiceResult<PaginatedResult<IOperlog>>> {
    let filtered = [...this.mockData];

    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.operName.toLowerCase().includes(search) ||
          log.operModule.toLowerCase().includes(search) ||
          log.operUrl.toLowerCase().includes(search),
      );
    }

    if (params.operName) {
      filtered = filtered.filter((log) => log.operName === params.operName);
    }

    if (params.operType) {
      filtered = filtered.filter((log) => log.operType === params.operType);
    }

    if (params.operModule) {
      filtered = filtered.filter((log) => log.operModule === params.operModule);
    }

    if (params.status) {
      filtered = filtered.filter((log) => log.status === params.status);
    }

    if (params.beginTime) {
      filtered = filtered.filter((log) => log.operTime >= params.beginTime!);
    }
    if (params.endTime) {
      filtered = filtered.filter((log) => log.operTime <= params.endTime!);
    }

    const sortField = params.sort || 'operTime';
    const sortOrder = params.order === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField];
      const bVal = (b as unknown as Record<string, unknown>)[sortField];
      return compareValues(aVal, bVal, sortOrder);
    });

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
      operId: String(this.mockData.length + 1),
      operName: data.operName,
      operTime: data.operTime || new Date().toISOString(),
      operType: data.operType,
      operModule: data.operModule,
      status: data.status,
      requestMethod: data.requestMethod,
      operUrl: data.operUrl,
      operIp: data.operIp,
      operSystem: data.operSystem || 'Unknown',
      browser: data.browser || 'Unknown',
      costTime: data.costTime || 0,
      operLocation: data.operLocation || 'Unknown',
      operParam: data.operParam || '',
      jsonResult: data.jsonResult || '',
      createTime: new Date().toISOString(),
    };
    this.mockData.unshift(newLog);
    return createSuccessResult(newLog, '操作日志创建成功');
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    const index = this.mockData.findIndex((log) => log.operId === id);
    if (index === -1) {
      return createErrorResult(ErrorCode.NOT_FOUND, '操作日志不存在');
    }
    this.mockData.splice(index, 1);
    return createSuccessResult(true, '操作日志删除成功');
  }

  async clean(): Promise<ServiceResult<boolean>> {
    this.mockData.length = 0;
    return createSuccessResult(true, '日志清理成功');
  }

  async deleteBatch(ids: string[]): Promise<ServiceResult<number>> {
    let deletedCount = 0;
    for (const id of ids) {
      const index = this.mockData.findIndex((log) => log.operId === id);
      if (index !== -1) {
        this.mockData.splice(index, 1);
        deletedCount++;
      }
    }
    return createSuccessResult(deletedCount, `成功删除${deletedCount}条日志`);
  }
}

export const operlogService = new OperlogService();

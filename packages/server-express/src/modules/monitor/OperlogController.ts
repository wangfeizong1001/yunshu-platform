/**
 * 操作日志控制器
 *
 * 提供操作日志的查询、删除和清空接口。操作日志记录系统中所有重要的用户操作，
 * 便于安全审计和问题追踪。
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import {
  createPaginatedResult,
  normalizePagination,
} from '@yunshu/shared';

const MAX_BATCH_SIZE = 100;
const MAX_QUERY_PARAM_LENGTH = 100;
const MAX_FIELD_LENGTH = 500;

// ============================================================================
// 类型定义
// ============================================================================

/** 操作日志 */
interface SysOperLog {
  operId: number;
  title: string;
  businessType: number;
  method: string;
  requestMethod: string;
  operatorType: number;
  operName: string;
  deptName: string;
  operUrl: string;
  operIp: string;
  operLocation: string;
  operParam: string;
  jsonResult: string;
  status: '0' | '1';
  errorMsg: string;
  costTime: number;
  operTime: string;
}

// ============================================================================
// Mock 数据
// ============================================================================

let operIdSeed = 5;

const operLogs: SysOperLog[] = [
  {
    operId: 1,
    title: '用户管理',
    businessType: 1,
    method: 'com.yunshu.controller.SysUserController.add()',
    requestMethod: 'POST',
    operatorType: 1,
    operName: 'admin',
    deptName: '技术部',
    operUrl: '/system/user',
    operIp: '192.168.1.100',
    operLocation: '内网IP',
    operParam: '{"loginName":"test","userName":"测试用户"}',
    jsonResult: '{"success":true}',
    status: '0',
    errorMsg: '',
    costTime: 123,
    operTime: '2024-01-15 10:30:00',
  },
  {
    operId: 2,
    title: '角色管理',
    businessType: 2,
    method: 'com.yunshu.controller.SysRoleController.edit()',
    requestMethod: 'PUT',
    operatorType: 1,
    operName: 'admin',
    deptName: '技术部',
    operUrl: '/system/role',
    operIp: '192.168.1.100',
    operLocation: '内网IP',
    operParam: '{"roleId":1,"roleName":"管理员"}',
    jsonResult: '{"success":true}',
    status: '0',
    errorMsg: '',
    costTime: 89,
    operTime: '2024-01-15 11:00:00',
  },
  {
    operId: 3,
    title: '参数配置',
    businessType: 3,
    method: 'com.yunshu.controller.SysConfigController.remove()',
    requestMethod: 'DELETE',
    operatorType: 1,
    operName: 'operator',
    deptName: '运维部',
    operUrl: '/system/config/5',
    operIp: '10.0.0.5',
    operLocation: '内网IP',
    operParam: '',
    jsonResult: '{"success":false,"message":"参数不存在"}',
    status: '1',
    errorMsg: '参数不存在',
    costTime: 45,
    operTime: '2024-01-15 14:15:00',
  },
  {
    operId: 4,
    title: '登录日志',
    businessType: 0,
    method: 'com.yunshu.controller.SysLoginlogController.list()',
    requestMethod: 'GET',
    operatorType: 1,
    operName: 'admin',
    deptName: '技术部',
    operUrl: '/monitor/loginlog/list',
    operIp: '192.168.1.100',
    operLocation: '内网IP',
    operParam: '',
    jsonResult: '{"success":true}',
    status: '0',
    errorMsg: '',
    costTime: 67,
    operTime: '2024-01-15 15:00:00',
  },
  {
    operId: 5,
    title: '用户管理',
    businessType: 1,
    method: 'com.yunshu.controller.SysUserController.edit()',
    requestMethod: 'PUT',
    operatorType: 1,
    operName: 'admin',
    deptName: '技术部',
    operUrl: '/system/user',
    operIp: '192.168.1.100',
    operLocation: '内网IP',
    operParam: '{"userId":2,"status":"1"}',
    jsonResult: '{"success":true}',
    status: '0',
    errorMsg: '',
    costTime: 156,
    operTime: '2024-01-15 16:20:00',
  },
];

// ============================================================================
// OperlogController
// ============================================================================

/**
 * 操作日志控制器
 */
export class OperlogController extends BaseController {
  /**
   * 操作日志分页查询
   */
  async list(req: Request, res: Response) {
    const { page, limit } = normalizePagination(req.query);
    const operNameParam = this.safeParam(req.query.operName, MAX_QUERY_PARAM_LENGTH);
    const businessTypeParam = this.safeParam(req.query.businessType, MAX_QUERY_PARAM_LENGTH);
    const statusParam = this.safeParam(req.query.status, 1);
    const startTimeParam = this.safeParam(req.query.startTime, MAX_QUERY_PARAM_LENGTH);
    const endTimeParam = this.safeParam(req.query.endTime, MAX_QUERY_PARAM_LENGTH);

    let filtered = [...operLogs];
    if (operNameParam) filtered = filtered.filter(i => i.operName.includes(operNameParam));
    if (businessTypeParam) {
      const bt = Number(businessTypeParam);
      if (Number.isFinite(bt)) filtered = filtered.filter(i => i.businessType === bt);
    }
    if (statusParam) filtered = filtered.filter(i => i.status === statusParam);
    if (startTimeParam) filtered = filtered.filter(i => i.operTime >= startTimeParam);
    if (endTimeParam) filtered = filtered.filter(i => i.operTime <= endTimeParam);

    filtered.sort((a, b) => b.operTime.localeCompare(a.operTime));
    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
  }

  /**
   * 操作日志详情
   */
  async getById(req: Request, res: Response) {
    const operId = Number(req.params.operId);
    if (!Number.isFinite(operId)) return this.badRequest(res, 'operId 参数非法');
    const item = operLogs.find(i => i.operId === operId);
    if (!item) return this.notFound(res, '操作日志不存在');
    return this.success(res, item, '查询成功');
  }

  /**
   * 删除操作日志
   */
  async remove(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const operId = Number(req.params.operId);
    if (!Number.isFinite(operId)) return this.badRequest(res, 'operId 参数非法');

    const idx = operLogs.findIndex(i => i.operId === operId);
    if (idx === -1) return this.notFound(res, '操作日志不存在');
    const removed = operLogs.splice(idx, 1)[0];
    return this.success(res, removed, '删除成功');
  }

  /**
   * 清空操作日志
   */
  async clean(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const count = operLogs.length;
    operLogs.length = 0;
    return this.success(res, { cleaned: count }, `日志清空成功，共清除 ${count} 条`);
  }
}

export const operlogController = new OperlogController();

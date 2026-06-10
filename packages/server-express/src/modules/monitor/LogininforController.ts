/**
 * 登录日志控制器
 *
 * 提供登录日志的查询、删除和清空接口。登录日志记录所有用户的登录行为，
 * 用于安全审计和异常登录监测。
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import {
  createPaginatedResult,
  normalizePagination,
} from '@yunshu/shared';

// ============================================================================
// 类型定义
// ============================================================================

/** 登录日志 */
interface SysLogininfor {
  infoId: number;
  userName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: '0' | '1';
  msg: string;
  loginTime: string;
}

// ============================================================================
// Mock 数据
// ============================================================================

let infoIdSeed = 5;

const logininfors: SysLogininfor[] = [
  { infoId: 1, userName: 'admin', ipaddr: '192.168.1.100', loginLocation: '内网IP', browser: 'Chrome 120', os: 'Windows 10', status: '0', msg: '登录成功', loginTime: '2024-01-15 08:30:00' },
  { infoId: 2, userName: 'operator', ipaddr: '10.0.0.5', loginLocation: '内网IP', browser: 'Firefox 115', os: 'Windows 11', status: '0', msg: '登录成功', loginTime: '2024-01-15 09:15:00' },
  { infoId: 3, userName: 'guest', ipaddr: '203.0.113.45', loginLocation: '北京市 联通', browser: 'Safari 17', os: 'macOS', status: '1', msg: '用户不存在', loginTime: '2024-01-15 10:00:00' },
  { infoId: 4, userName: 'admin', ipaddr: '192.168.1.100', loginLocation: '内网IP', browser: 'Chrome 120', os: 'Windows 10', status: '0', msg: '登录成功', loginTime: '2024-01-15 14:00:00' },
  { infoId: 5, userName: 'test', ipaddr: '198.51.100.23', loginLocation: '上海市 电信', browser: 'Edge 119', os: 'Windows 10', status: '1', msg: '密码错误', loginTime: '2024-01-15 15:30:00' },
];

// ============================================================================
// LogininforController
// ============================================================================

/**
 * 登录日志控制器
 */
export class LogininforController extends BaseController {
  /**
   * 登录日志分页查询
   *
   * @param req - 请求对象，query 支持 userName、ipaddr、status 过滤
   */
  async list(req: Request, res: Response) {
    try {
      const { page, limit } = normalizePagination(req.query);
      const { userName, ipaddr, status } = req.query;

      let filtered = [...logininfors];
      if (userName) filtered = filtered.filter(i => i.userName.includes(String(userName)));
      if (ipaddr) filtered = filtered.filter(i => i.ipaddr.includes(String(ipaddr)));
      if (status) filtered = filtered.filter(i => i.status === status);

      filtered.sort((a, b) => b.loginTime.localeCompare(a.loginTime));
      const total = filtered.length;
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 删除登录日志
   */
  async remove(req: Request, res: Response) {
    try {
      const infoId = Number(req.params.infoId);
      const idx = logininfors.findIndex(i => i.infoId === infoId);
      if (idx === -1) return this.notFound(res, '登录日志不存在');
      const removed = logininfors.splice(idx, 1)[0];
      return this.success(res, removed, '删除成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 清空登录日志
   */
  async clean(req: Request, res: Response) {
    try {
      const count = logininfors.length;
      logininfors.length = 0;
      return this.success(res, { cleaned: count }, `日志清空成功，共清除 ${count} 条`);
    } catch (e) {
      return this.error(res, e as Error);
    }
  }
}

export const logininforController = new LogininforController();

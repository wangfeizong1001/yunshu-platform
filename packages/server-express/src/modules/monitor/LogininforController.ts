/**
 * 登录日志控制器
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';

interface LoginLog {
  infoId: number;
  userName: string;
  status: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  msg: string;
  loginTime: string;
}

const mockLoginLogs: LoginLog[] = [
  {
    infoId: 1,
    userName: 'admin',
    status: '0',
    ipaddr: '192.168.1.100',
    loginLocation: '内网IP',
    browser: 'Chrome 120',
    os: 'Windows 10',
    msg: '登录成功',
    loginTime: '2024-06-10 08:30:00',
  },
  {
    infoId: 2,
    userName: 'user001',
    status: '0',
    ipaddr: '192.168.1.101',
    loginLocation: '内网IP',
    browser: 'Firefox 115',
    os: 'Ubuntu 22.04',
    msg: '登录成功',
    loginTime: '2024-06-10 09:15:00',
  },
  {
    infoId: 3,
    userName: 'unknown',
    status: '1',
    ipaddr: '192.168.1.200',
    loginLocation: '内网IP',
    browser: 'Safari 17',
    os: 'macOS',
    msg: '用户名/密码错误',
    loginTime: '2024-06-10 10:00:00',
  },
];

export class LoginlogController extends BaseController {
  /**
   * 获取登录日志列表
   */
  async list(_req: Request, res: Response): Promise<Response> {
    return this.success(res, { total: mockLoginLogs.length, rows: mockLoginLogs });
  }

  /**
   * 删除登录日志
   */
  async remove(req: Request, res: Response): Promise<Response> {
    const { infoId } = req.params;
    const index = mockLoginLogs.findIndex(l => l.infoId === Number(infoId));
    if (index === -1) {
      return this.notFound(res, '登录日志不存在');
    }
    mockLoginLogs.splice(index, 1);
    return this.success(res, null);
  }

  /**
   * 清空登录日志
   */
  async clean(_req: Request, res: Response): Promise<Response> {
    mockLoginLogs.length = 0;
    return this.success(res, null);
  }
}

export const loginlogController = new LoginlogController();

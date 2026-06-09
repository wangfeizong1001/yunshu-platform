/**
 * 在线用户控制器
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';

interface OnlineUser {
  tokenId: string;
  userName: string;
  deptName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  loginTime: string;
}

const mockOnlineUsers: OnlineUser[] = [
  {
    tokenId: 'abc123',
    userName: 'admin',
    deptName: '研发部门',
    ipaddr: '192.168.1.100',
    loginLocation: '内网IP',
    browser: 'Chrome 120',
    os: 'Windows 10',
    loginTime: '2024-06-10 08:30:00',
  },
  {
    tokenId: 'def456',
    userName: 'user001',
    deptName: '测试部门',
    ipaddr: '192.168.1.101',
    loginLocation: '内网IP',
    browser: 'Firefox 115',
    os: 'Ubuntu 22.04',
    loginTime: '2024-06-10 09:15:00',
  },
];

export class OnlineController extends BaseController {
  /**
   * 获取在线用户列表
   */
  async list(_req: Request, res: Response): Promise<Response> {
    return this.success(res, { total: mockOnlineUsers.length, rows: mockOnlineUsers });
  }

  /**
   * 强制用户退出
   */
  async forceLogout(req: Request, res: Response): Promise<Response> {
    const { tokenId } = req.params;
    const index = mockOnlineUsers.findIndex(u => u.tokenId === tokenId);
    if (index === -1) {
      return this.notFound(res, '用户会话不存在或已过期');
    }
    mockOnlineUsers.splice(index, 1);
    return this.success(res, null);
  }
}

export const onlineController = new OnlineController();

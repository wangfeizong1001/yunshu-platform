/**
 * 操作日志控制器
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';

interface OperLog {
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
  status: number;
  errorMsg: string;
  operTime: string;
  costTime: number;
}

const mockOperLogs: OperLog[] = [
  {
    operId: 1,
    title: '用户管理',
    businessType: 0,
    method: 'com.yunshu.system.controller.SysUserController.list()',
    requestMethod: 'GET',
    operatorType: 1,
    operName: 'admin',
    deptName: '研发部门',
    operUrl: '/system/user/list',
    operIp: '192.168.1.100',
    operLocation: '内网IP',
    operParam: '{"pageNum":1,"pageSize":10}',
    jsonResult: '{"code":200,"message":"操作成功"}',
    status: 0,
    errorMsg: '',
    operTime: '2024-06-10 10:30:00',
    costTime: 45,
  },
  {
    operId: 2,
    title: '角色管理',
    businessType: 1,
    method: 'com.yunshu.system.controller.SysRoleController.add()',
    requestMethod: 'POST',
    operatorType: 1,
    operName: 'admin',
    deptName: '研发部门',
    operUrl: '/system/role',
    operIp: '192.168.1.100',
    operLocation: '内网IP',
    operParam: '{"roleName":"测试角色","roleKey":"TEST"}',
    jsonResult: '{"code":200,"message":"操作成功"}',
    status: 0,
    errorMsg: '',
    operTime: '2024-06-10 11:00:00',
    costTime: 120,
  },
];

export class OperlogController extends BaseController {
  /**
   * 获取操作日志列表
   */
  async list(_req: Request, res: Response): Promise<Response> {
    return this.success(res, { total: mockOperLogs.length, rows: mockOperLogs });
  }

  /**
   * 删除操作日志
   */
  async remove(req: Request, res: Response): Promise<Response> {
    const { operId } = req.params;
    const index = mockOperLogs.findIndex(l => l.operId === Number(operId));
    if (index === -1) {
      return this.notFound(res, '操作日志不存在');
    }
    mockOperLogs.splice(index, 1);
    return this.success(res, null);
  }

  /**
   * 清空操作日志
   */
  async clean(_req: Request, res: Response): Promise<Response> {
    mockOperLogs.length = 0;
    return this.success(res, null);
  }
}

export const operlogController = new OperlogController();

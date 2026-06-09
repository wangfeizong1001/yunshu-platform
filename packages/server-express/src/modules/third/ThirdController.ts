/**
 * 第三方登录控制器
 *
 * @module @yunshu/server-express/modules/third
 */

import type { Request, Response } from 'express';
import type {
  ThirdLoginConfig,
  ThirdLoginLog,
  ThirdConfigQuery,
  ThirdLoginLogQuery,
  ThirdAuthorizeResp,
  ThirdBindReq,
  ThirdPlatform,
} from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';

/** 模拟第三方登录配置数据 */
const mockThirdConfigs: ThirdLoginConfig[] = [
  {
    id: 1,
    platform: 'wechat',
    appId: 'wx***********',
    appSecret: '***********',
    callbackUrl: 'https://app.yunshu.com/auth/wechat/callback',
    scopes: ['snsapi_userinfo'],
    status: '1',
    remark: '微信网页登录',
    createBy: 'admin',
    createTime: '2024-01-15 08:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    id: 2,
    platform: 'github',
    appId: 'Iv1***********',
    appSecret: '***********',
    callbackUrl: 'https://app.yunshu.com/auth/github/callback',
    scopes: ['user:email'],
    status: '1',
    remark: 'GitHub登录',
    createBy: 'admin',
    createTime: '2024-01-20 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    id: 3,
    platform: 'wecom',
    appId: 'ww***********',
    appSecret: '***********',
    callbackUrl: 'https://app.yunshu.com/auth/wecom/callback',
    scopes: ['snsapi_userinfo'],
    status: '0',
    remark: '企业微信登录',
    createBy: 'admin',
    createTime: '2024-02-01 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    id: 4,
    platform: 'dingtalk',
    appId: 'ding***********',
    appSecret: '***********',
    callbackUrl: 'https://app.yunshu.com/auth/dingtalk/callback',
    scopes: ['snsapi_login'],
    status: '0',
    remark: '钉钉登录',
    createBy: 'admin',
    createTime: '2024-02-01 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
];

/** 模拟第三方登录日志数据 */
const mockThirdLogs: ThirdLoginLog[] = [
  {
    id: 1,
    platform: 'wechat',
    openId: 'oABC123456',
    username: 'wechat_user',
    nickname: '微信用户',
    avatar: 'https://thirdparty.com/avatar/1.jpg',
    email: 'user@example.com',
    userId: 1,
    userName: 'admin',
    ip: '192.168.1.100',
    status: '1',
    loginTime: '2024-06-10 10:00:00',
  },
  {
    id: 2,
    platform: 'github',
    openId: '12345678',
    username: 'github_user',
    nickname: 'GitHub用户',
    avatar: 'https://thirdparty.com/avatar/2.jpg',
    email: 'github@example.com',
    userId: 2,
    userName: 'developer',
    ip: '192.168.1.101',
    status: '1',
    loginTime: '2024-06-09 15:30:00',
  },
  {
    id: 3,
    platform: 'wechat',
    openId: 'oABC789012',
    username: 'wechat_new_user',
    nickname: '新微信用户',
    avatar: 'https://thirdparty.com/avatar/3.jpg',
    ip: '192.168.1.102',
    status: '0',
    errorMsg: '用户取消授权',
    loginTime: '2024-06-08 09:00:00',
  },
];

/** 模拟绑定关系数据 */
interface ThirdBind {
  id: number;
  platform: ThirdPlatform;
  openId: string;
  userId: number;
  userName: string;
  bindTime: string;
}

const mockThirdBinds: ThirdBind[] = [
  {
    id: 1,
    platform: 'wechat',
    openId: 'oABC123456',
    userId: 1,
    userName: 'admin',
    bindTime: '2024-01-15 08:00:00',
  },
  {
    id: 2,
    platform: 'github',
    openId: '12345678',
    userId: 2,
    userName: 'developer',
    bindTime: '2024-01-20 09:00:00',
  },
];

export class ThirdController extends BaseController {
  // ==================== 第三方配置管理 ====================

  /**
   * 获取第三方登录配置列表
   */
  async listConfigs(req: Request, res: Response): Promise<Response> {
    const params: ThirdConfigQuery = {
      platform: req.query.platform as ThirdPlatform,
      status: req.query.status as '0' | '1',
    };

    let filtered = [...mockThirdConfigs];

    if (params.platform) {
      filtered = filtered.filter(c => c.platform === params.platform);
    }

    if (params.status) {
      filtered = filtered.filter(c => c.status === params.status);
    }

    return this.success(res, filtered);
  }

  /**
   * 获取第三方登录配置详情
   */
  async getConfigById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const config = mockThirdConfigs.find(c => c.id === Number(id));

    if (!config) {
      return this.notFound(res, '第三方登录配置不存在');
    }

    return this.success(res, config);
  }

  /**
   * 获取所有启用的第三方登录配置
   */
  async getEnabledConfigs(req: Request, res: Response): Promise<Response> {
    const configs = mockThirdConfigs.filter(c => c.status === '1');
    return this.success(res, configs);
  }

  /**
   * 创建第三方登录配置
   */
  async createConfig(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    if (!data.platform || !data.appId || !data.appSecret || !data.callbackUrl) {
      return this.badRequest(res, '请填写完整的第三方登录配置信息');
    }

    const newConfig: ThirdLoginConfig = {
      id: Math.max(...mockThirdConfigs.map(c => c.id)) + 1,
      platform: data.platform as ThirdPlatform,
      appId: data.appId,
      appSecret: data.appSecret,
      callbackUrl: data.callbackUrl,
      scopes: data.scopes || [],
      status: data.status || '0',
      remark: data.remark || '',
      createBy: 'admin',
      createTime: new Date().toLocaleString('zh-CN'),
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockThirdConfigs.push(newConfig);
    return this.created(res, newConfig, '创建成功');
  }

  /**
   * 更新第三方登录配置
   */
  async updateConfig(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body;
    const index = mockThirdConfigs.findIndex(c => c.id === Number(id));

    if (index === -1) {
      return this.notFound(res, '第三方登录配置不存在');
    }

    mockThirdConfigs[index] = {
      ...mockThirdConfigs[index],
      platform: data.platform ?? mockThirdConfigs[index].platform,
      appId: data.appId ?? mockThirdConfigs[index].appId,
      appSecret: data.appSecret ?? mockThirdConfigs[index].appSecret,
      callbackUrl: data.callbackUrl ?? mockThirdConfigs[index].callbackUrl,
      scopes: data.scopes ?? mockThirdConfigs[index].scopes,
      status: data.status ?? mockThirdConfigs[index].status,
      remark: data.remark ?? mockThirdConfigs[index].remark,
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    return this.success(res, mockThirdConfigs[index], '更新成功');
  }

  /**
   * 删除第三方登录配置
   */
  async deleteConfig(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockThirdConfigs.findIndex(c => c.id === Number(id));

    if (index === -1) {
      return this.notFound(res, '第三方登录配置不存在');
    }

    mockThirdConfigs.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  /**
   * 修改第三方登录配置状态
   */
  async changeConfigStatus(req: Request, res: Response): Promise<Response> {
    const { id, status } = req.body;
    const config = mockThirdConfigs.find(c => c.id === Number(id));

    if (!config) {
      return this.notFound(res, '第三方登录配置不存在');
    }

    config.status = status;
    config.updateTime = new Date().toLocaleString('zh-CN');
    return this.success(res, null, '状态修改成功');
  }

  // ==================== 第三方登录 ====================

  /**
   * 获取授权地址
   */
  async getAuthorizeUrl(req: Request, res: Response): Promise<Response> {
    const { platform } = req.query;

    const config = mockThirdConfigs.find(c => c.platform === platform && c.status === '1');
    if (!config) {
      return this.notFound(res, '第三方登录配置不存在或未启用');
    }

    const state = `third_${platform}_${Date.now()}`;
    let authorizeUrl = '';

    switch (config.platform) {
      case 'wechat':
        authorizeUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${config.appId}&redirect_uri=${encodeURIComponent(config.callbackUrl)}&response_type=code&scope=${config.scopes.join(',')}&state=${state}`;
        break;
      case 'github':
        authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${config.appId}&redirect_uri=${encodeURIComponent(config.callbackUrl)}&scope=${config.scopes.join(',')}&state=${state}`;
        break;
      case 'wecom':
        authorizeUrl = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${config.appId}&redirect_uri=${encodeURIComponent(config.callbackUrl)}&state=${state}`;
        break;
      case 'dingtalk':
        authorizeUrl = `https://oapi.dingtalk.com/connect/qrconnect?appid=${config.appId}&redirect_uri=${encodeURIComponent(config.callbackUrl)}&scope=${config.scopes.join(',')}&state=${state}`;
        break;
    }

    const resp: ThirdAuthorizeResp = {
      url: authorizeUrl,
      success: true,
    };

    return this.success(res, resp);
  }

  /**
   * 处理授权回调
   */
  async handleCallback(req: Request, res: Response): Promise<Response> {
    const { code, platform } = req.query;

    const config = mockThirdConfigs.find(c => c.platform === platform);
    if (!config) {
      return this.notFound(res, '第三方登录配置不存在');
    }

    if (!code) {
      return this.badRequest(res, '授权码不能为空');
    }

    const openId = `mock_openid_${Date.now()}`;

    const log: ThirdLoginLog = {
      id: Math.max(...mockThirdLogs.map(l => l.id)) + 1,
      platform: platform as ThirdPlatform,
      openId,
      ip: req.ip || '127.0.0.1',
      status: '1',
      loginTime: new Date().toLocaleString('zh-CN'),
    };
    mockThirdLogs.push(log);

    return this.success(res, {
      openId,
      platform,
      hasBound: mockThirdBinds.some(b => b.platform === platform && b.openId === openId),
    });
  }

  /**
   * 绑定账号
   */
  async bindAccount(req: Request, res: Response): Promise<Response> {
    const data: ThirdBindReq = req.body;

    if (!data.platform || !data.code) {
      return this.badRequest(res, '请提供平台和授权码');
    }

    if (data.action === 'bind' && !data.username) {
      return this.badRequest(res, '绑定现有账号需要提供用户名');
    }

    if (data.action === 'register' && (!data.username || !data.password)) {
      return this.badRequest(res, '注册新账号需要提供用户名和密码');
    }

    const config = mockThirdConfigs.find(c => c.platform === data.platform);
    if (!config) {
      return this.notFound(res, '第三方登录配置不存在');
    }

    const openId = `mock_openid_${Date.now()}`;

    const bind: ThirdBind = {
      id: Math.max(...mockThirdBinds.map(b => b.id)) + 1,
      platform: data.platform,
      openId,
      userId: 1,
      userName: data.username || 'newuser',
      bindTime: new Date().toLocaleString('zh-CN'),
    };

    mockThirdBinds.push(bind);

    return this.success(res, {
      bindId: bind.id,
      userId: bind.userId,
      userName: bind.userName,
    }, '账号绑定成功');
  }

  /**
   * 解绑账号
   */
  async unbindAccount(req: Request, res: Response): Promise<Response> {
    const { platform, userId } = req.body;

    const index = mockThirdBinds.findIndex(b => b.platform === platform && b.userId === Number(userId));

    if (index === -1) {
      return this.notFound(res, '绑定关系不存在');
    }

    mockThirdBinds.splice(index, 1);
    return this.success(res, null, '账号解绑成功');
  }

  /**
   * 获取用户的第三方绑定列表
   */
  async getUserBinds(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;

    const binds = mockThirdBinds.filter(b => b.userId === Number(userId));
    const configs = mockThirdConfigs;

    const result = configs.map(config => {
      const bind = binds.find(b => b.platform === config.platform);
      return {
        platform: config.platform,
        status: config.status,
        bound: !!bind,
        bindTime: bind?.bindTime,
      };
    });

    return this.success(res, result);
  }

  // ==================== 登录日志管理 ====================

  /**
   * 获取第三方登录日志分页列表
   */
  async listLogs(req: Request, res: Response): Promise<Response> {
    const params: ThirdLoginLogQuery = {
      platform: req.query.platform as ThirdPlatform,
      username: req.query.username as string,
      status: req.query.status as '0' | '1',
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    };

    let filtered = [...mockThirdLogs];

    if (params.platform) {
      filtered = filtered.filter(l => l.platform === params.platform);
    }

    if (params.username) {
      filtered = filtered.filter(l => l.username?.toLowerCase().includes(params.username.toLowerCase()));
    }

    if (params.status) {
      filtered = filtered.filter(l => l.status === params.status);
    }

    if (params.startDate) {
      filtered = filtered.filter(l => l.loginTime >= params.startDate);
    }

    if (params.endDate) {
      filtered = filtered.filter(l => l.loginTime <= params.endDate);
    }

    const total = filtered.length;
    const start = (params.pageNum - 1) * params.pageSize;
    const end = start + params.pageSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取第三方登录日志详情
   */
  async getLogById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const log = mockThirdLogs.find(l => l.id === Number(id));

    if (!log) {
      return this.notFound(res, '登录日志不存在');
    }

    return this.success(res, log);
  }

  /**
   * 获取登录统计数据
   */
  async getLoginStats(req: Request, res: Response): Promise<Response> {
    const stats = {
      total: mockThirdLogs.length,
      success: mockThirdLogs.filter(l => l.status === '1').length,
      failed: mockThirdLogs.filter(l => l.status === '0').length,
      byPlatform: {
        wechat: mockThirdLogs.filter(l => l.platform === 'wechat').length,
        github: mockThirdLogs.filter(l => l.platform === 'github').length,
        wecom: mockThirdLogs.filter(l => l.platform === 'wecom').length,
        dingtalk: mockThirdLogs.filter(l => l.platform === 'dingtalk').length,
      },
      recentTrend: [
        { date: '2024-06-10', count: 5 },
        { date: '2024-06-09', count: 3 },
        { date: '2024-06-08', count: 7 },
      ],
    };

    return this.success(res, stats);
  }

  /**
   * 导出登录日志
   */
  async exportLogs(req: Request, res: Response): Promise<Response> {
    return this.success(res, mockThirdLogs);
  }
}

export const thirdController = new ThirdController();

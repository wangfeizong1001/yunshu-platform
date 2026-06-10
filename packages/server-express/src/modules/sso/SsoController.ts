/**
 * SSO单点登录控制器
 *
 * @module @yunshu/server-express/modules/sso
 */

import type { Request, Response } from 'express';
import type {
  SsoApplication,
  SsoAppQuery,
  SsoConfig,
  SsoAuthorizeResp,
  SsoTokenResp,
  SsoUserInfo,
  SsoType,
} from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';

/** 模拟SSO应用数据 */
const mockSsoApps: SsoApplication[] = [
  {
    id: 1,
    appName: '企业微信',
    appCode: 'wecom',
    appType: 'oauth2',
    clientId: 'wx***********',
    clientSecret: '***********',
    authorizationUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize',
    tokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    userInfoUrl: 'https://api.weixin.qq.com/sns/userinfo',
    scopes: ['snsapi_userinfo'],
    logo: '/logos/wecom.png',
    status: '1',
    remark: '企业微信OAuth2登录',
    createBy: 'admin',
    createTime: '2024-01-15 08:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    id: 2,
    appName: 'GitHub',
    appCode: 'github',
    appType: 'oauth2',
    clientId: 'Iv1***********',
    clientSecret: '***********',
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    scopes: ['user:email'],
    logo: '/logos/github.png',
    status: '1',
    remark: 'GitHub OAuth2登录',
    createBy: 'admin',
    createTime: '2024-01-20 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    id: 3,
    appName: '钉钉',
    appCode: 'dingtalk',
    appType: 'oauth2',
    clientId: 'ding***********',
    clientSecret: '***********',
    authorizationUrl: 'https://oapi.dingtalk.com/connect/qrconnect',
    tokenUrl: 'https://oapi.dingtalk.com/gettoken',
    userInfoUrl: 'https://oapi.dingtalk.com/user/getuserinfo',
    scopes: ['snsapi_login'],
    logo: '/logos/dingtalk.png',
    status: '0',
    remark: '钉钉OAuth2登录',
    createBy: 'admin',
    createTime: '2024-02-01 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
];

/** 模拟SSO配置 */
const mockSsoConfig: SsoConfig = {
  type: 'oauth2',
  enabled: true,
  title: '云枢中台统一登录',
  defaultRedirectUrl: '/dashboard',
  logoutUrl: '/logout',
  sessionTimeout: 7200,
};

/** 模拟用户会话数据 */
interface UserSession {
  userId: number;
  username: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

const mockSessions: Map<string, UserSession> = new Map();

export class SsoController extends BaseController {
  // ==================== SSO应用管理 ====================

  /**
   * 获取SSO应用分页列表
   */
  async listApps(req: Request, res: Response): Promise<Response> {
    const params: SsoAppQuery = {
      keyword: req.query.keyword as string,
      appType: req.query.appType as SsoType,
      status: req.query.status as '0' | '1',
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    };

    let filtered = [...mockSsoApps];

    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(
        (app) => app.appName.toLowerCase().includes(kw) || app.appCode.toLowerCase().includes(kw),
      );
    }

    if (params.appType) {
      filtered = filtered.filter((app) => app.appType === params.appType);
    }

    if (params.status) {
      filtered = filtered.filter((app) => app.status === params.status);
    }

    const total = filtered.length;
    const ssoPage = params.pageNum ?? 1;
    const ssoSize = params.pageSize ?? 10;
    const start = (ssoPage - 1) * ssoSize;
    const end = start + ssoSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取SSO应用详情
   */
  async getAppById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const app = mockSsoApps.find((a) => a.id === Number(id));

    if (!app) {
      return this.notFound(res, 'SSO应用不存在');
    }

    return this.success(res, app);
  }

  /**
   * 获取所有启用的SSO应用
   */
  async getEnabledApps(_req: Request, res: Response): Promise<Response> {
    const apps = mockSsoApps.filter((app) => app.status === '1');
    return this.success(res, apps);
  }

  /**
   * 创建SSO应用
   */
  async createApp(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    if (!data.appName || !data.appCode || !data.appType || !data.clientId || !data.clientSecret) {
      return this.badRequest(res, '请填写完整的SSO应用信息');
    }

    const newApp: SsoApplication = {
      id: Math.max(...mockSsoApps.map((a) => a.id)) + 1,
      appName: data.appName,
      appCode: data.appCode,
      appType: data.appType as SsoType,
      clientId: data.clientId,
      clientSecret: data.clientSecret,
      authorizationUrl: data.authorizationUrl || '',
      tokenUrl: data.tokenUrl || '',
      userInfoUrl: data.userInfoUrl || '',
      scopes: data.scopes || [],
      logo: data.logo || '',
      status: data.status || '0',
      remark: data.remark || '',
      createBy: 'admin',
      createTime: new Date().toLocaleString('zh-CN'),
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockSsoApps.push(newApp);
    return this.created(res, newApp, '创建成功');
  }

  /**
   * 更新SSO应用
   */
  async updateApp(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body;
    const index = mockSsoApps.findIndex((a) => a.id === Number(id));

    if (index === -1) {
      return this.notFound(res, 'SSO应用不存在');
    }

    mockSsoApps[index] = {
      ...mockSsoApps[index],
      appName: data.appName ?? mockSsoApps[index].appName,
      appCode: data.appCode ?? mockSsoApps[index].appCode,
      appType: data.appType ?? mockSsoApps[index].appType,
      clientId: data.clientId ?? mockSsoApps[index].clientId,
      clientSecret: data.clientSecret ?? mockSsoApps[index].clientSecret,
      authorizationUrl: data.authorizationUrl ?? mockSsoApps[index].authorizationUrl,
      tokenUrl: data.tokenUrl ?? mockSsoApps[index].tokenUrl,
      userInfoUrl: data.userInfoUrl ?? mockSsoApps[index].userInfoUrl,
      scopes: data.scopes ?? mockSsoApps[index].scopes,
      logo: data.logo ?? mockSsoApps[index].logo,
      status: data.status ?? mockSsoApps[index].status,
      remark: data.remark ?? mockSsoApps[index].remark,
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    return this.success(res, mockSsoApps[index], '更新成功');
  }

  /**
   * 删除SSO应用
   */
  async deleteApp(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockSsoApps.findIndex((a) => a.id === Number(id));

    if (index === -1) {
      return this.notFound(res, 'SSO应用不存在');
    }

    mockSsoApps.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  /**
   * 修改SSO应用状态
   */
  async changeAppStatus(req: Request, res: Response): Promise<Response> {
    const { id, status } = req.body;
    const app = mockSsoApps.find((a) => a.id === Number(id));

    if (!app) {
      return this.notFound(res, 'SSO应用不存在');
    }

    app.status = status;
    app.updateTime = new Date().toLocaleString('zh-CN');
    return this.success(res, null, '状态修改成功');
  }

  // ==================== SSO配置管理 ====================

  /**
   * 获取SSO配置
   */
  async getConfig(_req: Request, res: Response): Promise<Response> {
    return this.success(res, mockSsoConfig);
  }

  /**
   * 更新SSO配置
   */
  async updateConfig(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    Object.assign(mockSsoConfig, {
      type: data.type ?? mockSsoConfig.type,
      enabled: data.enabled ?? mockSsoConfig.enabled,
      title: data.title ?? mockSsoConfig.title,
      defaultRedirectUrl: data.defaultRedirectUrl ?? mockSsoConfig.defaultRedirectUrl,
      logoutUrl: data.logoutUrl ?? mockSsoConfig.logoutUrl,
      sessionTimeout: data.sessionTimeout ?? mockSsoConfig.sessionTimeout,
      casServerUrl: data.casServerUrl ?? mockSsoConfig.casServerUrl,
      ldapServerUrl: data.ldapServerUrl ?? mockSsoConfig.ldapServerUrl,
      ldapBaseDn: data.ldapBaseDn ?? mockSsoConfig.ldapBaseDn,
    });

    return this.success(res, mockSsoConfig, '配置更新成功');
  }

  // ==================== SSO授权登录 ====================

  /**
   * 获取授权地址
   */
  async getAuthorizeUrl(req: Request, res: Response): Promise<Response> {
    const { appCode, redirectUri, state } = req.query;

    const app = mockSsoApps.find((a) => a.appCode === appCode && a.status === '1');
    if (!app) {
      return this.notFound(res, 'SSO应用不存在或未启用');
    }

    const authorizeUrl = `${app.authorizationUrl}?app_id=${app.clientId}&redirect_uri=${encodeURIComponent(redirectUri as string)}&scope=${app.scopes.join(',')}&state=${state || 'random'}`;

    const resp: SsoAuthorizeResp = {
      url: authorizeUrl,
      success: true,
    };

    return this.success(res, resp);
  }

  /**
   * 处理授权回调
   */
  async handleCallback(req: Request, res: Response): Promise<Response> {
    const { code, appCode } = req.query;

    const app = mockSsoApps.find((a) => a.appCode === appCode);
    if (!app) {
      return this.notFound(res, 'SSO应用不存在');
    }

    if (!code) {
      return this.badRequest(res, '授权码不能为空');
    }

    const tokenResp: SsoTokenResp = {
      accessToken: `mock_token_${Date.now()}`,
      tokenType: 'Bearer',
      expiresIn: 7200,
      refreshToken: `mock_refresh_${Date.now()}`,
    };

    return this.success(res, tokenResp);
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(req: Request, res: Response): Promise<Response> {
    const { accessToken } = req.query;

    const session = Array.from(mockSessions.values()).find((s) => s.accessToken === accessToken);
    if (!session) {
      return this.unauthorized(res, '无效的访问令牌');
    }

    const userInfo: SsoUserInfo = {
      userId: String(session.userId),
      username: session.username,
      email: 'user@example.com',
      mobile: '138****8000',
      avatar: '/avatar/default.png',
      realName: '测试用户',
      organization: '技术部',
    };

    return this.success(res, userInfo);
  }

  /**
   * 刷新令牌
   */
  async refreshToken(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return this.badRequest(res, '刷新令牌不能为空');
    }

    const newTokenResp: SsoTokenResp = {
      accessToken: `mock_token_${Date.now()}`,
      tokenType: 'Bearer',
      expiresIn: 7200,
      refreshToken: `mock_refresh_${Date.now()}`,
    };

    return this.success(res, newTokenResp);
  }

  /**
   * 退出登录
   */
  async logout(req: Request, res: Response): Promise<Response> {
    const { accessToken } = req.body;

    if (accessToken) {
      const session = Array.from(mockSessions.entries()).find(
        ([, s]) => s.accessToken === accessToken,
      );
      if (session) {
        mockSessions.delete(session[0]);
      }
    }

    return this.success(res, null, '退出登录成功');
  }

  /**
   * 导出SSO应用
   */
  async exportApps(_req: Request, res: Response): Promise<Response> {
    return this.success(res, mockSsoApps);
  }
}

export const ssoController = new SsoController();

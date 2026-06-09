/**
 * 短信服务控制器
 *
 * @module @yunshu/server-express/modules/sms
 */

import type { Request, Response } from 'express';
import type {
  SmsConfig,
  SmsTemplate,
  SmsTemplateQuery,
  SmsLog,
  SmsLogQuery,
  SmsSendReq,
  SmsPlatform,
} from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';

/** 模拟短信配置数据 */
const mockSmsConfigs: SmsConfig[] = [
  {
    id: 1,
    platform: 'aliyun',
    accessKey: 'LTAI***********',
    secretKey: '***********',
    signName: '云枢科技',
    templateCode: 'SMS_123456789',
    status: '1',
    createBy: 'admin',
    createTime: '2024-01-15 08:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    id: 2,
    platform: 'qcloud',
    accessKey: 'AKID***********',
    secretKey: '***********',
    signName: '云枢中台',
    templateCode: 'TENCENT_123456',
    status: '0',
    createBy: 'admin',
    createTime: '2024-01-20 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
];

/** 模拟短信模板数据 */
const mockSmsTemplates: SmsTemplate[] = [
  {
    id: 1,
    templateCode: 'SMS_123456789',
    templateName: '登录验证码',
    content: '您的登录验证码为：${code}，5分钟内有效。',
    platform: 'aliyun',
    status: '1',
    remark: '用于用户登录验证',
    createBy: 'admin',
    createTime: '2024-01-15 08:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    id: 2,
    templateCode: 'SMS_987654321',
    templateName: '注册验证码',
    content: '您的注册验证码为：${code}，10分钟内有效。',
    platform: 'aliyun',
    status: '1',
    remark: '用于用户注册验证',
    createBy: 'admin',
    createTime: '2024-01-15 08:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    id: 3,
    templateCode: 'TENCENT_123456',
    templateName: '密码重置验证码',
    content: '您的密码重置验证码为：${code}，10分钟内有效。',
    platform: 'qcloud',
    status: '1',
    remark: '用于密码重置验证',
    createBy: 'admin',
    createTime: '2024-01-20 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
];

/** 模拟短信日志数据 */
const mockSmsLogs: SmsLog[] = [
  {
    id: 1,
    mobile: '138****8000',
    templateCode: 'SMS_123456789',
    params: '{"code":"123456"}',
    content: '您的登录验证码为：123456，5分钟内有效。',
    status: '1',
    sendTime: '2024-06-10 10:00:00',
    errorMsg: '',
    createBy: 'admin',
    createTime: '2024-06-10 10:00:00',
  },
  {
    id: 2,
    mobile: '139****9000',
    templateCode: 'SMS_987654321',
    params: '{"code":"654321"}',
    content: '您的注册验证码为：654321，10分钟内有效。',
    status: '1',
    sendTime: '2024-06-09 15:30:00',
    errorMsg: '',
    createBy: 'admin',
    createTime: '2024-06-09 15:30:00',
  },
  {
    id: 3,
    mobile: '137****7000',
    templateCode: 'SMS_123456789',
    params: '{"code":"111111"}',
    content: '您的登录验证码为：111111，5分钟内有效。',
    status: '0',
    sendTime: '2024-06-08 09:00:00',
    errorMsg: '手机号格式错误',
    createBy: 'admin',
    createTime: '2024-06-08 09:00:00',
  },
];

export class SmsController extends BaseController {
  // ==================== 短信配置管理 ====================

  /**
   * 获取短信配置列表
   */
  async listConfigs(req: Request, res: Response): Promise<Response> {
    return this.success(res, mockSmsConfigs);
  }

  /**
   * 获取短信配置详情
   */
  async getConfigById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const config = mockSmsConfigs.find(c => c.id === Number(id));

    if (!config) {
      return this.notFound(res, '短信配置不存在');
    }

    return this.success(res, config);
  }

  /**
   * 获取当前使用的短信配置
   */
  async getCurrentConfig(req: Request, res: Response): Promise<Response> {
    const current = mockSmsConfigs.find(c => c.status === '1');
    return this.success(res, current || null);
  }

  /**
   * 创建短信配置
   */
  async createConfig(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    if (!data.platform || !data.accessKey || !data.secretKey || !data.signName || !data.templateCode) {
      return this.badRequest(res, '请填写完整的短信配置信息');
    }

    const newConfig: SmsConfig = {
      id: Math.max(...mockSmsConfigs.map(c => c.id)) + 1,
      platform: data.platform as SmsPlatform,
      accessKey: data.accessKey,
      secretKey: data.secretKey,
      signName: data.signName,
      templateCode: data.templateCode,
      status: data.status || '0',
      createBy: 'admin',
      createTime: new Date().toLocaleString('zh-CN'),
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockSmsConfigs.push(newConfig);
    return this.created(res, newConfig, '创建成功');
  }

  /**
   * 更新短信配置
   */
  async updateConfig(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body;
    const index = mockSmsConfigs.findIndex(c => c.id === Number(id));

    if (index === -1) {
      return this.notFound(res, '短信配置不存在');
    }

    mockSmsConfigs[index] = {
      ...mockSmsConfigs[index],
      platform: data.platform ?? mockSmsConfigs[index].platform,
      accessKey: data.accessKey ?? mockSmsConfigs[index].accessKey,
      secretKey: data.secretKey ?? mockSmsConfigs[index].secretKey,
      signName: data.signName ?? mockSmsConfigs[index].signName,
      templateCode: data.templateCode ?? mockSmsConfigs[index].templateCode,
      status: data.status ?? mockSmsConfigs[index].status,
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    return this.success(res, mockSmsConfigs[index], '更新成功');
  }

  /**
   * 删除短信配置
   */
  async deleteConfig(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockSmsConfigs.findIndex(c => c.id === Number(id));

    if (index === -1) {
      return this.notFound(res, '短信配置不存在');
    }

    mockSmsConfigs.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  /**
   * 设置默认短信配置
   */
  async setDefaultConfig(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    mockSmsConfigs.forEach(c => {
      c.status = c.id === Number(id) ? '1' : '0';
    });

    return this.success(res, null, '设置默认配置成功');
  }

  /**
   * 测试短信连接
   */
  async testConnection(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const config = mockSmsConfigs.find(c => c.id === Number(id));

    if (!config) {
      return this.notFound(res, '短信配置不存在');
    }

    return this.success(res, { success: true, message: '连接测试成功' });
  }

  // ==================== 短信模板管理 ====================

  /**
   * 获取短信模板分页列表
   */
  async listTemplates(req: Request, res: Response): Promise<Response> {
    const params: SmsTemplateQuery = {
      keyword: req.query.keyword as string,
      platform: req.query.platform as SmsPlatform,
      status: req.query.status as '0' | '1',
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    };

    let filtered = [...mockSmsTemplates];

    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.templateName.toLowerCase().includes(kw) ||
          t.templateCode.toLowerCase().includes(kw),
      );
    }

    if (params.platform) {
      filtered = filtered.filter(t => t.platform === params.platform);
    }

    if (params.status) {
      filtered = filtered.filter(t => t.status === params.status);
    }

    const total = filtered.length;
    const start = (params.pageNum - 1) * params.pageSize;
    const end = start + params.pageSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取短信模板详情
   */
  async getTemplateById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const template = mockSmsTemplates.find(t => t.id === Number(id));

    if (!template) {
      return this.notFound(res, '短信模板不存在');
    }

    return this.success(res, template);
  }

  /**
   * 创建短信模板
   */
  async createTemplate(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    if (!data.templateCode || !data.templateName || !data.content || !data.platform) {
      return this.badRequest(res, '请填写完整的短信模板信息');
    }

    const newTemplate: SmsTemplate = {
      id: Math.max(...mockSmsTemplates.map(t => t.id)) + 1,
      templateCode: data.templateCode,
      templateName: data.templateName,
      content: data.content,
      platform: data.platform as SmsPlatform,
      status: data.status || '0',
      remark: data.remark || '',
      createBy: 'admin',
      createTime: new Date().toLocaleString('zh-CN'),
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockSmsTemplates.push(newTemplate);
    return this.created(res, newTemplate, '创建成功');
  }

  /**
   * 更新短信模板
   */
  async updateTemplate(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body;
    const index = mockSmsTemplates.findIndex(t => t.id === Number(id));

    if (index === -1) {
      return this.notFound(res, '短信模板不存在');
    }

    mockSmsTemplates[index] = {
      ...mockSmsTemplates[index],
      templateCode: data.templateCode ?? mockSmsTemplates[index].templateCode,
      templateName: data.templateName ?? mockSmsTemplates[index].templateName,
      content: data.content ?? mockSmsTemplates[index].content,
      platform: data.platform ?? mockSmsTemplates[index].platform,
      status: data.status ?? mockSmsTemplates[index].status,
      remark: data.remark ?? mockSmsTemplates[index].remark,
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    return this.success(res, mockSmsTemplates[index], '更新成功');
  }

  /**
   * 删除短信模板
   */
  async deleteTemplate(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockSmsTemplates.findIndex(t => t.id === Number(id));

    if (index === -1) {
      return this.notFound(res, '短信模板不存在');
    }

    mockSmsTemplates.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  // ==================== 短信发送 ====================

  /**
   * 发送短信
   */
  async send(req: Request, res: Response): Promise<Response> {
    const data: SmsSendReq = req.body;

    if (!data.mobile || !data.templateCode) {
      return this.badRequest(res, '请提供手机号和模板编码');
    }

    const template = mockSmsTemplates.find(t => t.templateCode === data.templateCode);
    if (!template) {
      return this.notFound(res, '短信模板不存在');
    }

    const log: SmsLog = {
      id: Math.max(...mockSmsLogs.map(l => l.id)) + 1,
      mobile: data.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      templateCode: data.templateCode,
      params: JSON.stringify(data.params || {}),
      content: template.content,
      status: '1',
      sendTime: new Date().toLocaleString('zh-CN'),
      errorMsg: '',
      createBy: 'admin',
      createTime: new Date().toLocaleString('zh-CN'),
    };

    mockSmsLogs.push(log);

    return this.success(res, { success: true, messageId: String(log.id) }, '发送成功');
  }

  /**
   * 批量发送短信
   */
  async batchSend(req: Request, res: Response): Promise<Response> {
    const { mobiles, templateCode, params } = req.body as { mobiles: string[]; templateCode: string; params?: Record<string, string> };

    if (!Array.isArray(mobiles) || mobiles.length === 0 || !templateCode) {
      return this.badRequest(res, '请提供手机号列表和模板编码');
    }

    const template = mockSmsTemplates.find(t => t.templateCode === templateCode);
    if (!template) {
      return this.notFound(res, '短信模板不存在');
    }

    const results = mobiles.map(mobile => {
      const log: SmsLog = {
        id: Math.max(...mockSmsLogs.map(l => l.id)) + 1,
        mobile: mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        templateCode,
        params: JSON.stringify(params || {}),
        content: template.content,
        status: '1',
        sendTime: new Date().toLocaleString('zh-CN'),
        errorMsg: '',
        createBy: 'admin',
        createTime: new Date().toLocaleString('zh-CN'),
      };
      mockSmsLogs.push(log);
      return { mobile, success: true, messageId: String(log.id) };
    });

    return this.success(res, results, '批量发送成功');
  }

  // ==================== 短信日志 ====================

  /**
   * 获取短信日志分页列表
   */
  async listLogs(req: Request, res: Response): Promise<Response> {
    const params: SmsLogQuery = {
      mobile: req.query.mobile as string,
      templateCode: req.query.templateCode as string,
      status: req.query.status as '0' | '1',
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    };

    let filtered = [...mockSmsLogs];

    if (params.mobile) {
      filtered = filtered.filter(l => l.mobile.includes(params.mobile));
    }

    if (params.templateCode) {
      filtered = filtered.filter(l => l.templateCode === params.templateCode);
    }

    if (params.status) {
      filtered = filtered.filter(l => l.status === params.status);
    }

    const total = filtered.length;
    const start = (params.pageNum - 1) * params.pageSize;
    const end = start + params.pageSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取短信日志详情
   */
  async getLogById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const log = mockSmsLogs.find(l => l.id === Number(id));

    if (!log) {
      return this.notFound(res, '短信日志不存在');
    }

    return this.success(res, log);
  }

  /**
   * 导出短信日志
   */
  async exportLogs(req: Request, res: Response): Promise<Response> {
    return this.success(res, mockSmsLogs);
  }
}

export const smsController = new SmsController();

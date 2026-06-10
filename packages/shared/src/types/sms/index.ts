/**
 * 短信服务类型定义
 */

/** 短信平台 */
export type SmsPlatform = 'aliyun' | 'qcloud';

/** 短信配置 */
export interface SmsConfig {
  /** 配置ID */
  id: number;
  /** 短信平台 */
  platform: SmsPlatform;
  /** AccessKey */
  accessKey: string;
  /** SecretKey */
  secretKey: string;
  /** 签名 */
  signName: string;
  /** 模板CODE */
  templateCode: string;
  /** 状态 (0-禁用 1-启用) */
  status: '0' | '1';
  /** 创建者 */
  createBy?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新者 */
  updateBy?: string;
  /** 更新时间 */
  updateTime?: string;
}

/** 短信模板 */
export interface SmsTemplate {
  /** 模板ID */
  id: number;
  /** 模板CODE */
  templateCode: string;
  /** 模板名称 */
  templateName: string;
  /** 模板内容 */
  content: string;
  /** 平台 */
  platform: SmsPlatform;
  /** 状态 (0-禁用 1-启用) */
  status: '0' | '1';
  /** 备注 */
  remark: string;
  /** 创建者 */
  createBy?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新者 */
  updateBy?: string;
  /** 更新时间 */
  updateTime?: string;
}

/** 短信模板查询参数 */
export interface SmsTemplateQuery {
  /** 关键词 */
  keyword?: string;
  /** 平台 */
  platform?: SmsPlatform;
  /** 状态 */
  status?: '0' | '1';
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 短信日志 */
export interface SmsLog {
  /** 日志ID */
  id: number;
  /** 手机号 */
  mobile: string;
  /** 模板CODE */
  templateCode: string;
  /** 模板参数 (JSON字符串) */
  params: string;
  /** 短信内容 */
  content: string;
  /** 状态 (0-失败 1-成功) */
  status: '0' | '1';
  /** 发送时间 */
  sendTime: string;
  /** 错误信息 */
  errorMsg: string;
  /** 创建者 */
  createBy?: string;
  /** 创建时间 */
  createTime?: string;
}

/** 短信日志查询参数 */
export interface SmsLogQuery {
  /** 手机号 */
  mobile?: string;
  /** 模板CODE */
  templateCode?: string;
  /** 状态 */
  status?: '0' | '1';
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 短信发送请求 */
export interface SmsSendReq {
  /** 手机号 */
  mobile: string;
  /** 模板CODE */
  templateCode: string;
  /** 模板参数 */
  params?: Record<string, string>;
}

/** 短信发送响应 */
export interface SmsSendResp {
  /** 发送状态 */
  success: boolean;
  /** 消息ID */
  messageId?: string;
  /** 错误信息 */
  errorMsg?: string;
}

/** 短信模板分页响应 */
export interface SmsTemplatePageResp {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  rows: SmsTemplate[];
}

/** 短信日志分页响应 */
export interface SmsLogPageResp {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  rows: SmsLog[];
}

/**
 * 第三方登录类型定义
 */

/** 第三方平台 */
export type ThirdPlatform = 'wechat' | 'github' | 'wecom' | 'dingtalk';

/** 第三方登录配置 */
export interface ThirdLoginConfig {
  /** 配置ID */
  id: number;
  /** 平台 */
  platform: ThirdPlatform;
  /** AppID */
  appId: string;
  /** AppSecret */
  appSecret: string;
  /** 回调地址 */
  callbackUrl: string;
  /** 权限范围 */
  scopes: string[];
  /** 状态 (0-禁用 1-启用) */
  status: '0' | '1';
  /** 备注 */
  remark?: string;
  /** 创建者 */
  createBy?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新者 */
  updateBy?: string;
  /** 更新时间 */
  updateTime?: string;
}

/** 第三方登录日志 */
export interface ThirdLoginLog {
  /** 日志ID */
  id: number;
  /** 平台 */
  platform: ThirdPlatform;
  /** 用户ID (第三方平台) */
  openId: string;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 头像 */
  avatar?: string;
  /** 邮箱 */
  email?: string;
  /** 关联的本地用户ID */
  userId?: number;
  /** 关联的本地用户名 */
  userName?: string;
  /** IP地址 */
  ip?: string;
  /** 登录状态 (0-失败 1-成功) */
  status: '0' | '1';
  /** 错误信息 */
  errorMsg?: string;
  /** 登录时间 */
  loginTime: string;
}

/** 第三方登录配置查询参数 */
export interface ThirdConfigQuery {
  /** 平台 */
  platform?: ThirdPlatform;
  /** 状态 */
  status?: '0' | '1';
}

/** 第三方登录日志查询参数 */
export interface ThirdLoginLogQuery {
  /** 平台 */
  platform?: ThirdPlatform;
  /** 用户名 */
  username?: string;
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

/** 第三方登录授权响应 */
export interface ThirdAuthorizeResp {
  /** 授权地址 */
  url: string;
  /** 状态 */
  success: boolean;
  /** 错误信息 */
  errorMsg?: string;
}

/** 第三方登录绑定请求 */
export interface ThirdBindReq {
  /** 平台 */
  platform: ThirdPlatform;
  /** 授权码 */
  code: string;
  /** 绑定方式: bind-绑定现有账号, register-注册新账号 */
  action: 'bind' | 'register';
  /** 用户名 (bind时可选, register时必填) */
  username?: string;
  /** 密码 (register时必填) */
  password?: string;
}

/** 第三方登录日志分页响应 */
export interface ThirdLoginLogPageResp {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  rows: ThirdLoginLog[];
}

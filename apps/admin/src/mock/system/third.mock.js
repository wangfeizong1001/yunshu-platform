/**
 * 第三方登录 Mock 数据
 */
// 第三方登录配置 Mock 数据
export const mockThirdConfigList = [
  {
    id: 1,
    platform: 'wechat',
    appId: 'wx_app_id',
    appSecret: 'wx_app_secret',
    callbackUrl: 'https://yunshu.com/api/third/callback/wechat',
    scopes: ['snsapi_login'],
    status: '1',
    remark: '微信开放平台登录',
    createBy: 'admin',
    createTime: '2024-01-01 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-15 14:30:00',
  },
  {
    id: 2,
    platform: 'github',
    appId: 'github_client_id',
    appSecret: 'github_client_secret',
    callbackUrl: 'https://yunshu.com/api/third/callback/github',
    scopes: ['user:email'],
    status: '1',
    remark: 'GitHub OAuth 登录',
    createBy: 'admin',
    createTime: '2024-01-02 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-16 09:00:00',
  },
  {
    id: 3,
    platform: 'wecom',
    appId: 'wecom_app_id',
    appSecret: 'wecom_app_secret',
    callbackUrl: 'https://yunshu.com/api/third/callback/wecom',
    scopes: ['snsapi_base'],
    status: '1',
    remark: '企业微信登录',
    createBy: 'admin',
    createTime: '2024-01-03 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-17 10:00:00',
  },
  {
    id: 4,
    platform: 'dingtalk',
    appId: 'dingtalk_app_id',
    appSecret: 'dingtalk_app_secret',
    callbackUrl: 'https://yunshu.com/api/third/callback/dingtalk',
    scopes: ['snsapi_base'],
    status: '0',
    remark: '钉钉登录',
    createBy: 'admin',
    createTime: '2024-01-04 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-18 11:00:00',
  },
];
// 第三方登录日志 Mock 数据
export const mockThirdLoginLogList = [
  {
    id: 1,
    platform: 'wechat',
    openId: 'oABC123456789',
    username: 'wechat_user1',
    nickname: '微信用户A',
    avatar: 'https://example.com/avatar1.jpg',
    email: 'user1@example.com',
    userId: 1,
    userName: 'admin',
    ip: '192.168.1.100',
    status: '1',
    loginTime: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    platform: 'github',
    openId: 'github_123456',
    username: 'github_user1',
    nickname: 'GitHub User',
    avatar: 'https://example.com/avatar2.jpg',
    email: 'github@example.com',
    userId: 2,
    userName: 'user01',
    ip: '192.168.1.101',
    status: '1',
    loginTime: '2024-01-15 11:00:00',
  },
  {
    id: 3,
    platform: 'wecom',
    openId: 'wecom_456789',
    username: 'wecom_user1',
    nickname: '企业微信用户',
    avatar: 'https://example.com/avatar3.jpg',
    userId: undefined,
    userName: undefined,
    ip: '192.168.1.102',
    status: '0',
    errorMsg: '用户未绑定本地账号',
    loginTime: '2024-01-15 11:30:00',
  },
  {
    id: 4,
    platform: 'wechat',
    openId: 'oABC987654321',
    username: 'wechat_user2',
    nickname: '微信用户B',
    avatar: 'https://example.com/avatar4.jpg',
    email: 'user2@example.com',
    userId: 3,
    userName: 'user02',
    ip: '192.168.1.103',
    status: '1',
    loginTime: '2024-01-15 12:00:00',
  },
  {
    id: 5,
    platform: 'github',
    openId: 'github_789012',
    username: 'github_user2',
    nickname: 'Developer',
    avatar: 'https://example.com/avatar5.jpg',
    email: 'dev@example.com',
    userId: 4,
    userName: 'user03',
    ip: '192.168.1.104',
    status: '1',
    loginTime: '2024-01-15 14:00:00',
  },
  {
    id: 6,
    platform: 'dingtalk',
    openId: 'dingtalk_123456',
    username: 'dingtalk_user1',
    nickname: '钉钉用户',
    avatar: 'https://example.com/avatar6.jpg',
    userId: undefined,
    userName: undefined,
    ip: '192.168.1.105',
    status: '0',
    errorMsg: '应用已禁用',
    loginTime: '2024-01-15 15:00:00',
  },
];
// 获取第三方登录配置列表 Mock
export function getMockThirdConfigList() {
  return mockThirdConfigList;
}
// 获取第三方登录配置 Mock
export function getMockThirdConfig(platform) {
  return mockThirdConfigList.find((item) => item.platform === platform);
}
// 获取第三方登录日志列表 Mock
export function getMockThirdLoginLogPage(params) {
  const {
    pageNum = 1,
    pageSize = 10,
    platform = '',
    username = '',
    status = '',
    startDate = '',
    endDate = '',
  } = params;
  let filteredList = [...mockThirdLoginLogList];
  if (platform) {
    filteredList = filteredList.filter((item) => item.platform === platform);
  }
  if (username) {
    filteredList = filteredList.filter(
      (item) => item.username?.includes(username) || item.nickname?.includes(username),
    );
  }
  if (status) {
    filteredList = filteredList.filter((item) => item.status === status);
  }
  if (startDate) {
    filteredList = filteredList.filter((item) => item.loginTime >= startDate);
  }
  if (endDate) {
    filteredList = filteredList.filter((item) => item.loginTime <= endDate);
  }
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const rows = filteredList.slice(start, end);
  return {
    total: filteredList.length,
    rows,
  };
}
// 获取授权链接 Mock
export function getMockThirdAuthorizeUrl(platform) {
  const config = mockThirdConfigList.find((item) => item.platform === platform);
  if (!config) {
    return {
      success: false,
      url: '',
      errorMsg: '配置不存在',
    };
  }
  if (config.status === '0') {
    return {
      success: false,
      url: '',
      errorMsg: '该登录方式已禁用',
    };
  }
  // 模拟生成授权 URL
  const state = `${platform}_${Date.now()}`;
  let url = '';
  switch (platform) {
    case 'wechat':
      url = `https://open.weixin.qq.com/connect/qrconnect?appid=${config.appId}&redirect_uri=${encodeURIComponent(config.callbackUrl)}&response_type=code&scope=${config.scopes.join(',')}&state=${state}#wechat_redirect`;
      break;
    case 'github':
      url = `https://github.com/login/oauth/authorize?client_id=${config.appId}&redirect_uri=${encodeURIComponent(config.callbackUrl)}&scope=${config.scopes.join(' ')}&state=${state}`;
      break;
    case 'wecom':
      url = `https://open.work.weixin.qq.com/wwopen/sso/9?appid=${config.appId}&redirect_uri=${encodeURIComponent(config.callbackUrl)}&usertype=member&state=${state}`;
      break;
    case 'dingtalk':
      url = `https://oapi.dingtalk.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${encodeURIComponent(config.callbackUrl)}&response_type=code&scope=${config.scopes.join(',')}&state=${state}`;
      break;
  }
  return {
    success: true,
    url,
  };
}
// 处理第三方登录回调 Mock
export function handleMockThirdCallback(platform, code, _state) {
  if (!code) {
    throw new Error('授权码无效');
  }
  // 模拟返回 token
  return {
    token: `mock_third_token_${platform}_${Date.now()}`,
    isBind: true,
  };
}
//# sourceMappingURL=third.mock.js.map

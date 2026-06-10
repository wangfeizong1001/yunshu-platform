/**
 * SSO单点登录 API
 */

import request from '@/utils/request';

export interface SsoConfig {
  ssoType: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
}

export const getSsoConfig = () => {
  return request({
    url: '/system/sso/config',
    method: 'get',
  });
};

export const saveSsoConfig = (data: SsoConfig) => {
  return request({
    url: '/system/sso/config',
    method: 'post',
    data,
  });
};

export const ssoLogin = (code: string, state: string) => {
  return request({
    url: '/system/sso/login',
    method: 'post',
    data: { code, state },
  });
};

export const ssoLogout = () => {
  return request({
    url: '/system/sso/logout',
    method: 'post',
  });
};

/**
 * 第三方登录 API
 */
export interface ThirdConfig {
  thirdType: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  status: string;
}
export interface ThirdLogin {
  thirdType: string;
  code: string;
  state: string;
}
export declare const getThirdConfigList: () => Promise<unknown>;
export declare const getThirdConfig: (thirdType: string) => Promise<unknown>;
export declare const saveThirdConfig: (data: ThirdConfig) => Promise<unknown>;
export declare const updateThirdConfig: (data: ThirdConfig) => Promise<unknown>;
export declare const thirdLogin: (data: ThirdLogin) => Promise<unknown>;
export declare const bindThirdAccount: (data: ThirdLogin) => Promise<unknown>;
export declare const unbindThirdAccount: (thirdType: string) => Promise<unknown>;
export declare const getThirdLoginLogList: (params?: any) => Promise<unknown>;
//# sourceMappingURL=third.api.d.ts.map

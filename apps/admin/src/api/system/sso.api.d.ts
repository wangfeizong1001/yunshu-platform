/**
 * SSO单点登录 API
 */
export interface SsoConfig {
  ssoType: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
}
export declare const getSsoConfig: () => Promise<unknown>;
export declare const saveSsoConfig: (data: SsoConfig) => Promise<unknown>;
export declare const ssoLogin: (code: string, state: string) => Promise<unknown>;
export declare const ssoLogout: () => Promise<unknown>;
//# sourceMappingURL=sso.api.d.ts.map

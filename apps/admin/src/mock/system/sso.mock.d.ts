/**
 * SSO 单点登录 Mock 数据
 */
import type {
  SsoApplication,
  SsoAppPageResp,
  SsoConfig,
  SsoAuthorizeResp,
  SsoTokenResp,
  SsoUserInfo,
} from '@yunshu/shared';
export declare const mockSsoConfig: SsoConfig;
export declare const mockSsoAppList: SsoApplication[];
export declare function getMockSsoConfig(): SsoConfig;
export declare function getMockSsoAppPage(params: any): SsoAppPageResp;
export declare function getMockSsoAppDetail(id: number): SsoApplication | undefined;
export declare function getMockSsoAuthorizeUrl(appCode: string): SsoAuthorizeResp;
export declare function handleMockSsoCallback(code: string, _state?: string): SsoTokenResp;
export declare function getMockSsoUserInfo(_accessToken: string): SsoUserInfo;
export declare function refreshMockSsoToken(_refreshToken: string): SsoTokenResp;
//# sourceMappingURL=sso.mock.d.ts.map

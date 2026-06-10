/**
 * 第三方登录 Mock 数据
 */
import type {
  ThirdLoginConfig,
  ThirdLoginLog,
  ThirdLoginLogPageResp,
  ThirdAuthorizeResp,
} from '@yunshu/shared';
export declare const mockThirdConfigList: ThirdLoginConfig[];
export declare const mockThirdLoginLogList: ThirdLoginLog[];
export declare function getMockThirdConfigList(): ThirdLoginConfig[];
export declare function getMockThirdConfig(platform: string): ThirdLoginConfig | undefined;
export declare function getMockThirdLoginLogPage(params: any): ThirdLoginLogPageResp;
export declare function getMockThirdAuthorizeUrl(platform: string): ThirdAuthorizeResp;
export declare function handleMockThirdCallback(
  platform: string,
  code: string,
  _state?: string,
): {
  token: string;
  isBind: boolean;
};
//# sourceMappingURL=third.mock.d.ts.map

/**
 * 参数配置 Mock 数据
 */
import type { SysConfig, SysConfigPageResp } from '@yunshu/shared';
export declare const mockConfigList: SysConfig[];
export declare function getMockConfigPage(params: any): SysConfigPageResp;
export declare function getMockConfigDetail(configId: number): SysConfig | undefined;
export declare function getMockConfigByKey(configKey: string): SysConfig | undefined;
export declare function addMockConfig(data: Partial<SysConfig>): SysConfig;
export declare function updateMockConfig(
  configId: number,
  data: Partial<SysConfig>,
): SysConfig | undefined;
export declare function deleteMockConfig(configId: number): boolean;
//# sourceMappingURL=config.mock.d.ts.map

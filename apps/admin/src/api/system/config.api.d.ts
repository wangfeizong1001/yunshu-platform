/**
 * 参数配置 API
 */
export interface ConfigQuery {
  pageNum?: number;
  pageSize?: number;
  configName?: string;
  configKey?: string;
  status?: string;
}
export interface ConfigForm {
  configId?: number;
  configName?: string;
  configKey?: string;
  configValue?: string;
  configType?: string;
  remark?: string;
}
export interface ConfigInfo {
  configId: number;
  configName: string;
  configKey: string;
  configValue: string;
  configType: string;
  remark: string;
  createTime: string;
}
export declare const getConfigList: (params?: ConfigQuery) => Promise<unknown>;
export declare const getConfigPage: (params?: ConfigQuery) => Promise<unknown>;
export declare const getConfig: (configId: number) => Promise<unknown>;
export declare const getConfigValue: (configKey: string) => Promise<unknown>;
export declare const addConfig: (data: ConfigForm) => Promise<unknown>;
export declare const updateConfig: (data: ConfigForm) => Promise<unknown>;
export declare const deleteConfig: (configId: number) => Promise<unknown>;
export declare const batchDeleteConfig: (configIds: number[]) => Promise<unknown>;
export declare const refreshConfigCache: () => Promise<unknown>;
export declare const exportConfig: (params?: ConfigQuery) => Promise<unknown>;
//# sourceMappingURL=config.api.d.ts.map

/**
 * 登录日志 API
 */
export interface LogininforQuery {
  pageNum?: number;
  pageSize?: number;
  userName?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}
export interface LogininforInfo {
  infoId: number;
  userName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: string;
  msg: string;
  loginTime: string;
}
export declare const getLogininforList: (params?: LogininforQuery) => Promise<unknown>;
export declare const getLogininforPage: (params?: LogininforQuery) => Promise<unknown>;
export declare const getLogininfor: (infoId: number) => Promise<unknown>;
export declare const deleteLogininfor: (infoId: number) => Promise<unknown>;
export declare const batchDeleteLogininfor: (infoIds: number[]) => Promise<unknown>;
export declare const cleanLogininfor: () => Promise<unknown>;
export declare const unlockUser: (userName: string) => Promise<unknown>;
export declare const exportLogininfor: (params?: LogininforQuery) => Promise<unknown>;
//# sourceMappingURL=logininfor.api.d.ts.map

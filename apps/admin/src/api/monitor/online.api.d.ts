/**
 * 在线用户 API
 */
export interface OnlineQuery {
    pageNum?: number;
    pageSize?: number;
    userName?: string;
    ipaddr?: string;
}
export interface OnlineInfo {
    tokenId: string;
    userName: string;
    deptName: string;
    ipaddr: string;
    loginLocation: string;
    browser: string;
    os: string;
    status: string;
    loginTime: string;
}
export declare const getOnlineList: (params?: OnlineQuery) => Promise<unknown>;
export declare const getOnlinePage: (params?: OnlineQuery) => Promise<unknown>;
export declare const forceLogout: (tokenId: string) => Promise<unknown>;
export declare const batchForceLogout: (tokenIds: string[]) => Promise<unknown>;
//# sourceMappingURL=online.api.d.ts.map
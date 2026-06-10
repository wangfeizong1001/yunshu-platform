/**
 * 用户管理 Store
 * 负责用户登录、登出和用户信息管理
 */
interface UserState {
    token: string;
    userId: string;
    username: string;
    nickname: string;
    avatar: string;
    email: string;
    phone: string;
    deptId: string;
    deptName: string;
    roles: string[];
    roleId: number[];
    permissions: string[];
}
export interface UserInfo {
    userId: string;
    username: string;
    nickname?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    deptId?: string;
    deptName?: string;
    roleId?: number[];
}
export declare const useUserStore: import("pinia").StoreDefinition<"user", UserState, {}, {
    /**
     * 保存用户信息到缓存
     */
    saveToCache(): void;
    /**
     * 用户登录
     */
    login(userInfo: {
        username: string;
        password: string;
        code?: string;
        uuid?: string;
    }): Promise<Record<string, unknown>>;
    /**
     * 获取用户信息
     */
    getUserInfo(): Promise<Record<string, unknown>>;
    /**
     * 用户登出
     */
    logout(): Promise<void>;
    /**
     * 重置用户状态
     */
    resetState(): void;
}>;
export {};
//# sourceMappingURL=user.d.ts.map
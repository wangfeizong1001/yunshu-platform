export interface IUser {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: number;
  roles: string[];
  createTime: string;
}
export interface IUserListParams extends Record<string, unknown> {
  page: number;
  pageSize: number;
  username?: string;
  status?: number;
}
export declare const getUserListApi: (params: IUserListParams) => Promise<{
  list: IUser[];
  total: number;
}>;
export declare const getUserDetailApi: (id: string) => Promise<IUser>;
export declare const createUserApi: (data: Partial<IUser>) => Promise<unknown>;
export declare const updateUserApi: (id: string, data: Partial<IUser>) => Promise<unknown>;
export declare const deleteUserApi: (id: string) => Promise<unknown>;
export declare const resetPasswordApi: (id: string) => Promise<unknown>;
//# sourceMappingURL=user.d.ts.map

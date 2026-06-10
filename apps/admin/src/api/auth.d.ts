/**
 * 认证相关 API
 */
export interface LoginForm {
  username: string;
  password: string;
  code?: string;
  uuid?: string;
}
export interface LoginResponse {
  token: string;
  expires: number;
}
export interface UserInfo {
  userId: number;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  phone: string;
  deptId: number;
  deptName: string;
  roles: string[];
  roleId: number[];
}
export declare function getCaptchaApi(): Promise<unknown>;
export declare function loginApi(data: LoginForm): Promise<unknown>;
export declare function logoutApi(): Promise<unknown>;
export declare function getUserInfoApi(): Promise<unknown>;
export declare function getRoutersApi(): Promise<unknown>;
//# sourceMappingURL=auth.d.ts.map

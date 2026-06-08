export interface User {
  /** 用户ID */
  id?: number;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 邮箱 */
  email?: string;
  /** 手机号 */
  phone?: string;
  /** 性别 */
  gender?: number;
  /** 头像 */
  avatar?: string;
  /** 状态 */
  status?: number;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 状态 */
  status?: number;
}

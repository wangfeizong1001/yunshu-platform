/**
 * 租户套餐类型定义
 */

/** 套餐状态 */
export type PackageStatus = '0' | '1';

/** 过期类型 */
export type ExpireType = '0' | '1' | '2';

/** 套餐类型 */
export type PackageType = '0' | '1' | '2';

/** 套餐信息 */
export interface TenantPackage {
  /** 套餐ID */
  packageId: number;
  /** 套餐名称 */
  packageName: string;
  /** 套餐类型：0=免费版 1=基础版 2=高级版 */
  packageType: PackageType;
  /** 菜单权限ID列表 */
  menuIds: number[];
  /** 过期类型：0=永久 1=年费 2=月费 */
  expireType: ExpireType;
  /** 过期时间（当expireType不为永久时） */
  expireTime: string;
  /** 用户数量限制 */
  userLimit: number;
  /** 存储空间限制（MB） */
  storageLimit: number;
  /** 月流量限制（GB） */
  flowLimit: number;
  /** 价格（元/年或元/月） */
  price: number;
  /** 状态：0=正常 1=停用 */
  status: PackageStatus;
  /** 备注 */
  remark: string;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}

/** 套餐查询参数 */
export interface TenantPackageQuery {
  /** 关键词 */
  keyword?: string;
  /** 套餐状态 */
  status?: PackageStatus;
  /** 套餐类型 */
  packageType?: PackageType;
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 套餐表单数据 */
export interface TenantPackageForm {
  /** 套餐ID */
  packageId?: number;
  /** 套餐名称 */
  packageName: string;
  /** 套餐类型 */
  packageType: PackageType;
  /** 菜单权限ID列表 */
  menuIds: number[];
  /** 过期类型 */
  expireType: ExpireType;
  /** 过期时间 */
  expireTime?: string;
  /** 用户数量限制 */
  userLimit: number;
  /** 存储空间限制（MB） */
  storageLimit: number;
  /** 月流量限制（GB） */
  flowLimit: number;
  /** 价格 */
  price: number;
  /** 状态 */
  status?: PackageStatus;
  /** 备注 */
  remark?: string;
}

/** 套餐分页响应 */
export interface TenantPackagePageResp {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  rows: TenantPackage[];
}

/** 套餐状态枚举 */
export const PackageStatusEnum = {
  NORMAL: { value: '0', label: '正常', color: 'success' },
  DISABLED: { value: '1', label: '停用', color: 'danger' },
} as const;

/** 套餐类型枚举 */
export const PackageTypeEnum = {
  FREE: { value: '0', label: '免费版', color: 'info' },
  BASIC: { value: '1', label: '基础版', color: 'primary' },
  ADVANCED: { value: '2', label: '高级版', color: 'success' },
} as const;

/** 过期类型枚举 */
export const ExpireTypeEnum = {
  PERMANENT: { value: '0', label: '永久', color: 'success' },
  YEARLY: { value: '1', label: '年费', color: 'primary' },
  MONTHLY: { value: '2', label: '月费', color: 'warning' },
} as const;

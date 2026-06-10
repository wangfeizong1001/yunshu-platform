/**
 * 系统菜单类型定义
 */

/** 菜单状态 */
export type MenuStatus = '0' | '1';

/** 菜单类型 */
export type MenuType = 'M' | 'C' | 'F';
/**
 * M=目录
 * C=菜单
 * F=按钮
 */

/** 菜单信息 */
export interface SysMenu {
  /** 菜单ID */
  menuId: number;
  /** 菜单名称 */
  menuName: string;
  /** 父菜单ID */
  parentId: number;
  /** 路由路径 */
  path: string;
  /** 组件路径 */
  component?: string;
  /** 路由参数 */
  query?: string;
  /** 是否为外链 */
  isFrame: boolean;
  /** 是否缓存 */
  isCache: boolean;
  /** 菜单类型 */
  menuType: MenuType;
  /** 显示状态: 0=显示, 1=隐藏 */
  visible: MenuStatus;
  /** 菜单状态: 0=正常, 1=停用 */
  status: MenuStatus;
  /** 权限标识 */
  perms?: string;
  /** 菜单图标 */
  icon: string;
  /** 显示顺序 */
  orderNum: number;
  /** 子菜单 */
  children?: SysMenu[];
  /** 创建时间 */
  createTime?: string;
}

/** 菜单查询参数 */
export interface SysMenuQuery {
  /** 关键词 */
  keyword?: string;
  /** 菜单状态 */
  status?: MenuStatus;
  /** 菜单类型 */
  menuType?: MenuType;
  /** 父菜单ID */
  parentId?: number;
}

/** 菜单表单数据 */
export interface SysMenuForm {
  /** 菜单ID */
  menuId?: number;
  /** 父菜单ID */
  parentId: number;
  /** 菜单名称 */
  menuName: string;
  /** 路由路径 */
  path?: string;
  /** 组件路径 */
  component?: string;
  /** 路由参数 */
  query?: string;
  /** 是否为外链 */
  isFrame?: boolean;
  /** 是否缓存 */
  isCache?: boolean;
  /** 菜单类型 */
  menuType: MenuType;
  /** 显示状态 */
  visible?: MenuStatus;
  /** 菜单状态 */
  status?: MenuStatus;
  /** 权限标识 */
  perms?: string;
  /** 菜单图标 */
  icon?: string;
  /** 显示顺序 */
  orderNum?: number;
  /** 备注 */
  remark?: string;
}

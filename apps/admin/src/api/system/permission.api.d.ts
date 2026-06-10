/**
 * 权限管理 API
 */
/** 权限信息 */
export interface PermissionInfo {
    /** 权限标识列表 */
    permissions: string[];
    /** 角色列表 */
    roles: string[];
    /** 用户信息 */
    user: {
        userId: number;
        username: string;
        nickname: string;
        avatar: string;
    };
}
/**
 * 获取当前用户权限信息
 */
export declare function getCurrentPermission(): Promise<PermissionInfo>;
/**
 * 获取路由菜单
 */
export declare function getRouters(): Promise<MenuRoute[]>;
/** 路由菜单 */
export interface MenuRoute {
    /** 路由名称 */
    name: string;
    /** 路由路径 */
    path: string;
    /** 组件路径 */
    component?: string;
    /** 路由参数 */
    query?: string;
    /** 元信息 */
    meta: {
        /** 菜单名称 */
        title: string;
        /** 菜单图标 */
        icon?: string;
        /** 是否隐藏 */
        hidden?: boolean;
        /** 是否缓存 */
        noCache?: boolean;
        /** 是否总是显示 */
        alwaysShow?: boolean;
        /** 权限标识 */
        permissions?: string[];
        /** 角色标识 */
        roles?: string[];
    };
    /** 子路由 */
    children?: MenuRoute[];
}
/**
 * 刷新权限信息
 */
export declare function refreshPermission(): Promise<PermissionInfo>;
//# sourceMappingURL=permission.api.d.ts.map
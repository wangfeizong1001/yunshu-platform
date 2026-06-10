/**
 * 路由配置
 * 支持基于后端返回菜单的动态路由系统
 */
import { type RouteRecordRaw } from 'vue-router';
export declare const constantRoutes: RouteRecordRaw[];
export declare const asyncRoutes: RouteRecordRaw[];
declare const router: import('vue-router').Router;
/**
 * 重置路由
 * 用于退出登录时清除动态路由
 */
export declare function resetRouter(): void;
export default router;
//# sourceMappingURL=index.d.ts.map

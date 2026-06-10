/**
 * 权限管理 Store
 * 负责动态路由的生成和管理
 */
import type { RouteRecordRaw } from 'vue-router';
interface PermissionState {
  routes: RouteRecordRaw[];
  addRoutes: RouteRecordRaw[];
  defaultRoutes: RouteRecordRaw[];
  topbarRouters: RouteRecordRaw[];
  cachedViews: string[];
}
export declare const usePermissionStore: import('pinia').StoreDefinition<
  'permission',
  PermissionState,
  {},
  {
    /**
     * 生成动态路由
     * 从后端获取菜单数据，转换为路由配置
     */
    generateRoutes(): Promise<RouteRecordRaw[]>;
    /**
     * 设置默认路由
     */
    setDefaultRoutes(routes: RouteRecordRaw[]): void;
    /**
     * 设置顶部导航路由
     */
    setTopbarRoutes(routes: RouteRecordRaw[]): void;
    /**
     * 添加缓存视图
     */
    addCachedView(view: string): void;
    /**
     * 移除缓存视图
     */
    removeCachedView(view: string): void;
    /**
     * 重置路由状态
     */
    resetRoutes(): void;
  }
>;
/**
 * 懒加载视图组件
 */
export declare function loadView(view: string): () => Promise<any>;
export {};
//# sourceMappingURL=permission.d.ts.map

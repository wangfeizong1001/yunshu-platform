/**
 * 权限管理 Store
 * 负责动态路由的生成和管理
 */
import { defineStore } from 'pinia';
import { constantRoutes, asyncRoutes } from '@/router';
import { getRoutersApi } from '@/api/auth';
export const usePermissionStore = defineStore('permission', {
    state: () => ({
        routes: [],
        addRoutes: [],
        defaultRoutes: [],
        topbarRouters: [],
        cachedViews: [],
        dynamicRouteAdded: false
    }),
    actions: {
        /**
         * 生成动态路由
         * 从后端获取菜单数据，转换为路由配置
         */
        async generateRoutes() {
            try {
                // 从后端获取菜单
                const res = (await getRoutersApi());
                const menuData = res?.data || [];
                // 将菜单转换为路由
                const accessedRoutes = await generateRoutesFromMenu(menuData);
                // 合并静态asyncRoutes和动态路由
                const allRoutes = [...asyncRoutes, ...accessedRoutes];
                this.addRoutes = allRoutes;
                this.routes = [...constantRoutes, ...allRoutes];
                return allRoutes;
            }
            catch (error) {
                console.error('生成路由失败:', error);
                // 即使失败也返回静态asyncRoutes
                this.addRoutes = asyncRoutes;
                this.routes = [...constantRoutes, ...asyncRoutes];
                return asyncRoutes;
            }
        },
        /**
         * 设置默认路由
         */
        setDefaultRoutes(routes) {
            this.defaultRoutes = routes;
        },
        /**
         * 设置顶部导航路由
         */
        setTopbarRoutes(routes) {
            this.topbarRouters = routes;
        },
        /**
         * 添加缓存视图
         */
        addCachedView(view) {
            if (this.cachedViews.includes(view))
                return;
            this.cachedViews.push(view);
        },
        /**
         * 移除缓存视图
         */
        removeCachedView(view) {
            const index = this.cachedViews.indexOf(view);
            if (index > -1) {
                this.cachedViews.splice(index, 1);
            }
        },
        /**
         * 重置路由状态
         * 包含新加的 dynamicRouteAdded 标志，用于 HMR 或登出后清理
         */
        resetRoutes() {
            this.routes = [];
            this.addRoutes = [];
            this.defaultRoutes = [];
            this.topbarRouters = [];
            this.cachedViews = [];
            this.dynamicRouteAdded = false;
        }
    }
});
/**
 * 将菜单数据转换为路由配置
 */
async function generateRoutesFromMenu(menus) {
    const routes = [];
    for (const menu of menus) {
        // 目录（M）
        if (menu?.menuType === 'M') {
            const route = {
                path: menu?.path || '',
                name: menu?.path || '',
                component: () => import('@/views/layout/index.vue'),
                redirect: menu?.children?.length ? menu.children[0]?.path : undefined,
                meta: {
                    title: menu?.menuName || '',
                    icon: menu?.icon || '',
                    noCache: !menu?.isCache,
                },
                children: []
            };
            if (menu?.children?.length) {
                route.children = await generateRoutesFromMenu(menu.children);
            }
            routes.push(route);
        }
        // 菜单（C）
        else if (menu?.menuType === 'C') {
            const route = {
                path: menu?.path || '',
                name: menu?.path || '',
                component: loadView(menu?.component || ''),
                meta: {
                    title: menu?.menuName || '',
                    icon: menu?.icon || '',
                    noCache: !menu?.isCache,
                    permission: menu?.perms ? [menu.perms] : undefined,
                    query: menu?.query ? JSON.parse(menu.query) : undefined,
                }
            };
            routes.push(route);
        }
        // 按钮（F）不生成路由
    }
    return routes;
}
/**
 * 懒加载视图组件
 */
export function loadView(view) {
    if (!view) {
        // 如果没有组件路径，返回 404 页面
        return () => import('@/views/error/404.vue');
    }
    // 尝试懒加载组件
    return () => import(`@/views/${view}.vue`);
}
//# sourceMappingURL=permission.js.map
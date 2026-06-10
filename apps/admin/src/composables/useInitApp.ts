import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';
import router from '@/router';

export const initApp = async () => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  // 如果已登录，初始化路由
  if (userStore.token) {
    await permissionStore.generateRoutes();
    permissionStore.routes.forEach((route) => {
      router.addRoute(route);
    });
  }
};

export default {
  initApp,
};

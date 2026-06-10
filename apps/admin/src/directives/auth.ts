import type { Directive } from 'vue';

interface IAuthDirectiveOptions {
  roles?: string[];
  permissions?: string[];
}

const authDirective: Directive = {
  mounted(el, binding) {
    const { roles = [], permissions = [] } = (binding.value as IAuthDirectiveOptions) || {};

    // TODO: 从 store 获取用户权限进行判断
    const userRoles: string[] = [];
    const userPermissions: string[] = [];

    if (roles.length > 0) {
      const hasRole = roles.some((role) => userRoles.includes(role));
      if (!hasRole) {
        el.parentNode?.removeChild(el);
      }
    }

    if (permissions.length > 0) {
      const hasPermission = permissions.some((permission) => userPermissions.includes(permission));
      if (!hasPermission) {
        el.parentNode?.removeChild(el);
      }
    }
  },
};

export default authDirective;

/**
 * 角色指令 v-hasRole
 *
 * 用于判断是否有指定角色
 * 用法: v-hasRole="['admin', 'editor']"
 */
import { useUserStore } from '@/store/modules/user';
/**
 * 角色指令 v-hasRole
 * 检查是否有任意一个指定角色
 */
const hasRole = {
  mounted(el, binding) {
    const { value } = binding;
    if (!value) {
      return;
    }
    const userStore = useUserStore();
    const roles = Array.isArray(value) ? value : [value];
    // 检查是否有角色
    const hasRole = roles.some((role) => userStore.roles.includes(role));
    if (!hasRole) {
      // 移除元素
      el.parentNode?.removeChild(el);
    }
  },
  updated(el, binding) {
    const { value, oldValue } = binding;
    if (JSON.stringify(value) === JSON.stringify(oldValue)) {
      return;
    }
    if (!value) {
      el.parentNode?.removeChild(el);
      return;
    }
    const userStore = useUserStore();
    const roles = Array.isArray(value) ? value : [value];
    const hasRole = roles.some((role) => userStore.roles.includes(role));
    if (!hasRole) {
      el.parentNode?.removeChild(el);
    }
  },
};
/**
 * 角色指令 v-hasRoleAll
 * 检查是否拥有所有指定角色
 * 用法: v-hasRoleAll="['admin', 'editor']"
 */
const hasRoleAll = {
  mounted(el, binding) {
    const { value } = binding;
    if (!value) {
      return;
    }
    const userStore = useUserStore();
    const roles = Array.isArray(value) ? value : [value];
    const hasAllRole = roles.every((role) => userStore.roles.includes(role));
    if (!hasAllRole) {
      el.parentNode?.removeChild(el);
    }
  },
  updated(el, binding) {
    const { value, oldValue } = binding;
    if (JSON.stringify(value) === JSON.stringify(oldValue)) {
      return;
    }
    if (!value) {
      el.parentNode?.removeChild(el);
      return;
    }
    const userStore = useUserStore();
    const roles = Array.isArray(value) ? value : [value];
    const hasAllRole = roles.every((role) => userStore.roles.includes(role));
    if (!hasAllRole) {
      el.parentNode?.removeChild(el);
    }
  },
};
export { hasRole, hasRoleAll };
export default {
  hasRole,
  hasRoleAll,
};
//# sourceMappingURL=role.js.map

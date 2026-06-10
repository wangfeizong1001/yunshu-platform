/**
 * 权限指令 v-hasPermi
 *
 * 用于判断是否有指定权限
 * 用法: v-hasPermi="['system:user:add', 'system:user:edit']"
 */
import { useUserStore } from '@/store/modules/user';
/**
 * 权限指令 v-hasPermi
 * 检查是否有任意一个指定权限
 */
const hasPermi = {
  mounted(el, binding) {
    const { value } = binding;
    if (!value) {
      return;
    }
    const userStore = useUserStore();
    const permissions = Array.isArray(value) ? value : [value];
    // 检查是否有权限
    const hasPermission = permissions.some((permission) =>
      userStore.permissions.includes(permission),
    );
    if (!hasPermission) {
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
    const permissions = Array.isArray(value) ? value : [value];
    const hasPermission = permissions.some((permission) =>
      userStore.permissions.includes(permission),
    );
    if (!hasPermission) {
      el.parentNode?.removeChild(el);
    }
  },
};
/**
 * 权限指令 v-hasPermiAll
 * 检查是否拥有所有指定权限
 * 用法: v-hasPermiAll="['system:user:add', 'system:user:edit']"
 */
const hasPermiAll = {
  mounted(el, binding) {
    const { value } = binding;
    if (!value) {
      return;
    }
    const userStore = useUserStore();
    const permissions = Array.isArray(value) ? value : [value];
    const hasAllPermission = permissions.every((permission) =>
      userStore.permissions.includes(permission),
    );
    if (!hasAllPermission) {
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
    const permissions = Array.isArray(value) ? value : [value];
    const hasAllPermission = permissions.every((permission) =>
      userStore.permissions.includes(permission),
    );
    if (!hasAllPermission) {
      el.parentNode?.removeChild(el);
    }
  },
};
export { hasPermi, hasPermiAll };
export default {
  hasPermi,
  hasPermiAll,
};
//# sourceMappingURL=permission.js.map

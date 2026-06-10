/**
 * 角色指令 v-hasRole
 *
 * 用于判断是否有指定角色
 * 用法: v-hasRole="['admin', 'editor']"
 */

import type { Directive, DirectiveBinding } from 'vue';
import { useUserStore } from '@/store/modules/user';

/** 角色指令绑定值类型 */
type RoleValue = string | string[];

/**
 * 角色指令 v-hasRole
 * 检查是否有任意一个指定角色
 */
const hasRole: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<RoleValue>) {
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

  updated(el: HTMLElement, binding: DirectiveBinding<RoleValue>) {
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
const hasRoleAll: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<RoleValue>) {
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

  updated(el: HTMLElement, binding: DirectiveBinding<RoleValue>) {
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

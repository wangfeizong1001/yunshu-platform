/**
 * 角色指令 v-hasRole
 *
 * 用于判断是否有指定角色
 * 用法: v-hasRole="['admin', 'editor']"
 */
import type { Directive } from 'vue';
/**
 * 角色指令 v-hasRole
 * 检查是否有任意一个指定角色
 */
declare const hasRole: Directive;
/**
 * 角色指令 v-hasRoleAll
 * 检查是否拥有所有指定角色
 * 用法: v-hasRoleAll="['admin', 'editor']"
 */
declare const hasRoleAll: Directive;
export { hasRole, hasRoleAll };
declare const _default: {
    hasRole: import("vue").ObjectDirective<any, any, string, any>;
    hasRoleAll: import("vue").ObjectDirective<any, any, string, any>;
};
export default _default;
//# sourceMappingURL=role.d.ts.map
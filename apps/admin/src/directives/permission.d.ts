/**
 * 权限指令 v-hasPermi
 *
 * 用于判断是否有指定权限
 * 用法: v-hasPermi="['system:user:add', 'system:user:edit']"
 */
import type { Directive } from 'vue';
/**
 * 权限指令 v-hasPermi
 * 检查是否有任意一个指定权限
 */
declare const hasPermi: Directive;
/**
 * 权限指令 v-hasPermiAll
 * 检查是否拥有所有指定权限
 * 用法: v-hasPermiAll="['system:user:add', 'system:user:edit']"
 */
declare const hasPermiAll: Directive;
export { hasPermi, hasPermiAll };
declare const _default: {
  hasPermi: import('vue').ObjectDirective<any, any, string, any>;
  hasPermiAll: import('vue').ObjectDirective<any, any, string, any>;
};
export default _default;
//# sourceMappingURL=permission.d.ts.map

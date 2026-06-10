/**
 * 指令导出
 */
export { default as permissionDirective } from './permission';
export { default as roleDirective } from './role';
// 导出指令对象
import { hasPermi, hasPermiAll } from './permission';
import { hasRole, hasRoleAll } from './role';
/**
 * 注册所有指令
 */
export function registerDirectives(app) {
  // 权限指令
  app.directive('hasPermi', hasPermi);
  app.directive('hasPermiAll', hasPermiAll);
  // 角色指令
  app.directive('hasRole', hasRole);
  app.directive('hasRoleAll', hasRoleAll);
}
//# sourceMappingURL=index.js.map

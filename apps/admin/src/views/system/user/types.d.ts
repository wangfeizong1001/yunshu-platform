/**
 * 用户类型定义
 */
import type { SysUser, SysUserQuery } from '@yunshu/shared';
export { SysUser, SysUserQuery };
export type { SysUserForm } from '@yunshu/shared';
/** 用户状态枚举 */
export declare const UserStatusOptions: {
    label: string;
    value: string;
}[];
/** 用户性别枚举 */
export declare const SexOptions: {
    label: string;
    value: string;
}[];
/** 表格列定义 */
export declare const tableColumns: ({
    prop: string;
    label: string;
    width: string;
    slot?: undefined;
    fixed?: undefined;
} | {
    prop: string;
    label: string;
    width: string;
    slot: string;
    fixed?: undefined;
} | {
    prop: string;
    label: string;
    width: string;
    fixed: string;
    slot?: undefined;
})[];
//# sourceMappingURL=types.d.ts.map
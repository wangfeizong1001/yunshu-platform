/**
 * 表单验证规则与运行时类型校验
 *
 * 提供基于 Zod 的运行时类型校验和传统表单验证规则，
 * 确保前后端数据类型一致性。
 */
import { z } from 'zod';
import type { ApiResponse, PaginatedResponse, PaginationMeta } from '@yunshu/shared';
/**
 * 用户名验证规则：4-16位字母数字组合
 */
export declare const usernameSchema: z.ZodString;
/**
 * 密码验证规则：最少6位
 */
export declare const passwordSchema: z.ZodString;
/**
 * 手机号验证规则：中国大陆手机号
 */
export declare const phoneSchema: z.ZodString;
/**
 * 邮箱验证规则
 */
export declare const emailSchema: z.ZodString;
/**
 * URL 验证规则
 */
export declare const urlSchema: z.ZodString;
/**
 * IP 地址验证规则
 */
export declare const ipSchema: z.ZodString;
/**
 * ID 主键验证规则：正整数
 */
export declare const idSchema: z.ZodNumber;
/**
 * 分页参数验证规则
 */
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodEnum<{
        desc: "desc";
        asc: "asc";
    }>>;
}, z.core.$strip>;
/**
 * 通用 ID 参数验证
 */
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<number, string | number>>;
}, z.core.$strip>;
/**
 * 检查 ApiResponse 是否成功
 */
export declare function isApiResponseSuccess<T>(response: unknown): response is ApiResponse<T>;
/**
 * 检查是否为分页响应
 */
export declare function isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T>;
/**
 * 检查分页元信息是否有效
 */
export declare function isPaginationMeta(meta: unknown): meta is PaginationMeta;
/**
 * 运行时类型校验
 * @param schema Zod schema
 * @param data 待校验数据
 * @returns 校验成功返回数据，失败抛出错误
 */
export declare function validate<T>(schema: z.ZodSchema<T>, data: unknown): T;
/**
 * 安全校验，返回结果而非抛出错误
 * @param schema Zod schema
 * @param data 待校验数据
 * @returns 校验结果
 */
export declare function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    error: z.ZodError;
};
/**
 * 创建针对特定数据结构的类型守卫
 * @param schema Zod schema
 * @returns 类型守卫函数
 */
export declare function createTypeGuard<T>(schema: z.ZodSchema<T>): (data: unknown) => data is T;
export declare const validateUsername: (_rule: unknown, value: string, callback: (error?: Error) => void) => void;
export declare const validatePassword: (_rule: unknown, value: string, callback: (error?: Error) => void) => void;
export declare const validatePhone: (_rule: unknown, value: string, callback: (error?: Error) => void) => void;
export declare const validateEmail: (_rule: unknown, value: string, callback: (error?: Error) => void) => void;
/**
 * 登录表单校验 Schema
 */
export declare const loginFormSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
/**
 * 用户表单校验 Schema
 */
export declare const userFormSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    realName: z.ZodString;
    deptId: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<{
        0: "0";
        1: "1";
    }>>;
}, z.core.$strip>;
/**
 * 角色表单校验 Schema
 */
export declare const roleFormSchema: z.ZodObject<{
    roleName: z.ZodString;
    roleKey: z.ZodString;
    sort: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodEnum<{
        0: "0";
        1: "1";
    }>>;
}, z.core.$strip>;
/**
 * 菜单表单校验 Schema
 */
export declare const menuFormSchema: z.ZodObject<{
    menuName: z.ZodString;
    parentId: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    path: z.ZodString;
    component: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodEnum<{
        0: "0";
        1: "1";
    }>>;
}, z.core.$strip>;
/**
 * 部门表单校验 Schema
 */
export declare const deptFormSchema: z.ZodObject<{
    deptName: z.ZodString;
    parentId: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    leaderUserId: z.ZodOptional<z.ZodNumber>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * 岗位表单校验 Schema
 */
export declare const postFormSchema: z.ZodObject<{
    postCode: z.ZodString;
    postName: z.ZodString;
    sort: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodEnum<{
        0: "0";
        1: "1";
    }>>;
}, z.core.$strip>;
/**
 * 字典类型表单校验 Schema
 */
export declare const dictTypeFormSchema: z.ZodObject<{
    dictName: z.ZodString;
    dictType: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<{
        0: "0";
        1: "1";
    }>>;
}, z.core.$strip>;
/**
 * 字典数据表单校验 Schema
 */
export declare const dictDataFormSchema: z.ZodObject<{
    dictType: z.ZodString;
    dictLabel: z.ZodString;
    dictValue: z.ZodString;
    sort: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodEnum<{
        0: "0";
        1: "1";
    }>>;
}, z.core.$strip>;
/**
 * 配置项表单校验 Schema
 */
export declare const configFormSchema: z.ZodObject<{
    configName: z.ZodString;
    configKey: z.ZodString;
    configValue: z.ZodString;
    configType: z.ZodOptional<z.ZodEnum<{
        N: "N";
        Y: "Y";
    }>>;
}, z.core.$strip>;
/**
 * 通知公告表单校验 Schema
 */
export declare const noticeFormSchema: z.ZodObject<{
    noticeTitle: z.ZodString;
    noticeType: z.ZodEnum<{
        1: "1";
        2: "2";
        3: "3";
        4: "4";
    }>;
    noticeContent: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        0: "0";
        1: "1";
    }>>;
}, z.core.$strip>;
/**
 * OSS 配置表单校验 Schema
 */
export declare const ossConfigFormSchema: z.ZodObject<{
    ossCode: z.ZodString;
    ossName: z.ZodString;
    endpoint: z.ZodString;
    accessKey: z.ZodString;
    secretKey: z.ZodString;
    bucketName: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<{
        0: "0";
        1: "1";
    }>>;
}, z.core.$strip>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type UserFormData = z.infer<typeof userFormSchema>;
export type RoleFormData = z.infer<typeof roleFormSchema>;
export type MenuFormData = z.infer<typeof menuFormSchema>;
export type DeptFormData = z.infer<typeof deptFormSchema>;
export type PostFormData = z.infer<typeof postFormSchema>;
export type DictTypeFormData = z.infer<typeof dictTypeFormSchema>;
export type DictDataFormData = z.infer<typeof dictDataFormSchema>;
export type ConfigFormData = z.infer<typeof configFormSchema>;
export type NoticeFormData = z.infer<typeof noticeFormSchema>;
export type OssConfigFormData = z.infer<typeof ossConfigFormSchema>;
//# sourceMappingURL=validate.d.ts.map
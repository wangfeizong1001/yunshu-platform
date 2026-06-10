/**
 * 表单验证规则与运行时类型校验
 *
 * 提供基于 Zod 的运行时类型校验和传统表单验证规则，
 * 确保前后端数据类型一致性。
 */
import { z } from 'zod';
// ============================================================================
// Zod Schema 定义
// ============================================================================
/**
 * 用户名验证规则：4-16位字母数字组合
 */
export const usernameSchema = z.string().regex(/^[a-zA-Z0-9]{4,16}$/, '用户名必须是4-16位字母数字');
/**
 * 密码验证规则：最少6位
 */
export const passwordSchema = z.string().min(6, '密码长度不能小于6位');
/**
 * 手机号验证规则：中国大陆手机号
 */
export const phoneSchema = z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的手机号');
/**
 * 邮箱验证规则
 */
export const emailSchema = z.string().email('请输入正确的邮箱地址');
/**
 * URL 验证规则
 */
export const urlSchema = z.string().url('请输入正确的URL地址');
/**
 * IP 地址验证规则
 */
export const ipSchema = z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, '请输入正确的IP地址');
/**
 * ID 主键验证规则：正整数
 */
export const idSchema = z.number().int().positive('ID必须是正整数');
/**
 * 分页参数验证规则
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});
/**
 * 通用 ID 参数验证
 */
export const idParamSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
});
// ============================================================================
// API 响应类型守卫
// ============================================================================
/**
 * 检查 ApiResponse 是否成功
 */
export function isApiResponseSuccess(response) {
  if (!response || typeof response !== 'object') return false;
  const resp = response;
  return 'success' in resp && typeof resp.success === 'boolean';
}
/**
 * 检查是否为分页响应
 */
export function isPaginatedResponse(response) {
  if (!response || typeof response !== 'object') return false;
  const resp = response;
  return (
    'success' in resp &&
    'data' in resp &&
    Array.isArray(resp.data) &&
    'pagination' in resp &&
    typeof resp.pagination === 'object'
  );
}
/**
 * 检查分页元信息是否有效
 */
export function isPaginationMeta(meta) {
  if (!meta || typeof meta !== 'object') return false;
  const m = meta;
  return (
    'page' in m &&
    typeof m.page === 'number' &&
    'limit' in m &&
    typeof m.limit === 'number' &&
    'total' in m &&
    typeof m.total === 'number' &&
    'totalPages' in m &&
    typeof m.totalPages === 'number'
  );
}
// ============================================================================
// 通用类型校验函数
// ============================================================================
/**
 * 运行时类型校验
 * @param schema Zod schema
 * @param data 待校验数据
 * @returns 校验成功返回数据，失败抛出错误
 */
export function validate(schema, data) {
  return schema.parse(data);
}
/**
 * 安全校验，返回结果而非抛出错误
 * @param schema Zod schema
 * @param data 待校验数据
 * @returns 校验结果
 */
export function safeValidate(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
/**
 * 创建针对特定数据结构的类型守卫
 * @param schema Zod schema
 * @returns 类型守卫函数
 */
export function createTypeGuard(schema) {
  return (data) => {
    const result = schema.safeParse(data);
    return result.success;
  };
}
// ============================================================================
// 传统表单验证规则（兼容 Element Plus Form）
// ============================================================================
export const validateUsername = (_rule, value, callback) => {
  const reg = /^[a-zA-Z0-9]{4,16}$/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error('用户名必须是4-16位字母数字'));
  }
};
export const validatePassword = (_rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('密码长度不能小于6位'));
  } else {
    callback();
  }
};
export const validatePhone = (_rule, value, callback) => {
  const reg = /^1[3-9]\d{9}$/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的手机号'));
  }
};
export const validateEmail = (_rule, value, callback) => {
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的邮箱地址'));
  }
};
// ============================================================================
// 常用业务表单校验 Schema
// ============================================================================
/**
 * 登录表单校验 Schema
 */
export const loginFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});
/**
 * 用户表单校验 Schema
 */
export const userFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  realName: z.string().min(1, '真实姓名不能为空').max(50, '真实姓名不能超过50字符'),
  deptId: idSchema.optional(),
  status: z.enum(['0', '1']).optional(),
});
/**
 * 角色表单校验 Schema
 */
export const roleFormSchema = z.object({
  roleName: z.string().min(1, '角色名称不能为空').max(50, '角色名称不能超过50字符'),
  roleKey: z.string().min(1, '角色标识不能为空').max(100, '角色标识不能超过100字符'),
  sort: z.number().int().optional().default(0),
  status: z.enum(['0', '1']).optional(),
});
/**
 * 菜单表单校验 Schema
 */
export const menuFormSchema = z.object({
  menuName: z.string().min(1, '菜单名称不能为空').max(50, '菜单名称不能超过50字符'),
  parentId: z.number().int().nonnegative().optional().default(0),
  path: z.string().max(200, '路由路径不能超过200字符'),
  component: z.string().optional(),
  sort: z.number().int().optional().default(0),
  status: z.enum(['0', '1']).optional(),
});
/**
 * 部门表单校验 Schema
 */
export const deptFormSchema = z.object({
  deptName: z.string().min(1, '部门名称不能为空').max(50, '部门名称不能超过50字符'),
  parentId: z.number().int().nonnegative().optional().default(0),
  sort: z.number().int().optional().default(0),
  leaderUserId: idSchema.optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
});
/**
 * 岗位表单校验 Schema
 */
export const postFormSchema = z.object({
  postCode: z.string().min(1, '岗位编码不能为空').max(50, '岗位编码不能超过50字符'),
  postName: z.string().min(1, '岗位名称不能为空').max(50, '岗位名称不能超过50字符'),
  sort: z.number().int().optional().default(0),
  status: z.enum(['0', '1']).optional(),
});
/**
 * 字典类型表单校验 Schema
 */
export const dictTypeFormSchema = z.object({
  dictName: z.string().min(1, '字典名称不能为空').max(50, '字典名称不能超过50字符'),
  dictType: z.string().min(1, '字典类型不能为空').max(100, '字典类型不能超过100字符'),
  status: z.enum(['0', '1']).optional(),
});
/**
 * 字典数据表单校验 Schema
 */
export const dictDataFormSchema = z.object({
  dictType: z.string().min(1, '字典类型不能为空'),
  dictLabel: z.string().min(1, '字典标签不能为空').max(100, '字典标签不能超过100字符'),
  dictValue: z.string().min(1, '字典键值不能为空').max(100, '字典键值不能超过100字符'),
  sort: z.number().int().optional().default(0),
  status: z.enum(['0', '1']).optional(),
});
/**
 * 配置项表单校验 Schema
 */
export const configFormSchema = z.object({
  configName: z.string().min(1, '配置名称不能为空').max(100, '配置名称不能超过100字符'),
  configKey: z.string().min(1, '配置键名不能为空').max(100, '配置键名不能超过100字符'),
  configValue: z.string().min(1, '配置值不能为空'),
  configType: z.enum(['Y', 'N']).optional(),
});
/**
 * 通知公告表单校验 Schema
 */
export const noticeFormSchema = z.object({
  noticeTitle: z.string().min(1, '通知标题不能为空').max(200, '通知标题不能超过200字符'),
  noticeType: z.enum(['1', '2', '3', '4']),
  noticeContent: z.string().optional(),
  status: z.enum(['0', '1']).optional(),
});
/**
 * OSS 配置表单校验 Schema
 */
export const ossConfigFormSchema = z.object({
  ossCode: z.string().min(1, '存储配置编码不能为空').max(50, '存储配置编码不能超过50字符'),
  ossName: z.string().min(1, '存储配置名称不能为空').max(100, '存储配置名称不能超过100字符'),
  endpoint: z.string().min(1, '端点地址不能为空').max(200, '端点地址不能超过200字符'),
  accessKey: z.string().min(1, '访问密钥不能为空'),
  secretKey: z.string().min(1, '密钥不能为空'),
  bucketName: z.string().min(1, '存储桶名称不能为空').max(100, '存储桶名称不能超过100字符'),
  status: z.enum(['0', '1']).optional(),
});
//# sourceMappingURL=validate.js.map

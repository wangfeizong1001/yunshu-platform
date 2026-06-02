/**
 * UI — 表单管理 Composable
 *
 * 提供表单校验、提交状态、错误处理的统一封装。
 *
 * @module @yunshu/ui/composables/useForm
 */

import { ref, reactive, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';

interface UseFormOptions<T extends Record<string, unknown>> {
  /** 初始值 */
  initialValues: T;
  /** 校验规则 */
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  /** 提交函数 */
  onSubmit: (values: T) => Promise<void>;
}

interface UseFormReturn<T extends Record<string, unknown>> {
  values: T;
  errors: Ref<Partial<Record<keyof T, string>>>;
  loading: Ref<boolean>;
  submitted: Ref<boolean>;
  isValid: ComputedRef<boolean>;
  isDirty: ComputedRef<boolean>;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  resetForm: () => void;
  handleSubmit: () => Promise<void>;
}

/**
 * 表单管理 Hook
 *
 * @example
 * ```typescript
 * const { values, errors, loading, handleSubmit } = useForm({
 *   initialValues: { username: '', password: '' },
 *   validate: (v) => ({
 *     username: !v.username ? '请输入用户名' : '',
 *     password: v.password.length < 6 ? '密码至少6位' : '',
 *   }),
 *   onSubmit: async (values) => {
 *     await userApi.login(values);
 *   },
 * });
 * ```
 */
export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>,
): UseFormReturn<T> {
  const { initialValues, validate, onSubmit } = options;

  const values = reactive({ ...initialValues }) as T;
  const errors = ref<Partial<Record<keyof T, string>>>({}) as Ref<Partial<Record<keyof T, string>>>;
  const loading = ref(false);
  const submitted = ref(false);
  const touched = reactive<Partial<Record<keyof T, boolean>>>({});

  /** 是否有效 */
  const isValid = computed(() => {
    const currentErrors = validate ? validate(values) : {};
    return Object.values(currentErrors).every((v) => !v);
  });

  /** 是否已修改 */
  const isDirty = computed(() => {
    return Object.keys(initialValues).some((key) => {
      return values[key as keyof T] !== initialValues[key as keyof T];
    });
  });

  /** 设置单个字段值 */
  function setFieldValue<K extends keyof T>(field: K, value: T[K]): void {
    (values as Record<string, unknown>)[field as string] = value;
    (touched as Record<string, boolean>)[field as string] = true;

    // 实时校验
    if (validate) {
      const allErrors = validate(values);
      (errors.value as Record<string, string>)[field as string] = allErrors[field] || '';
    }
  }

  /** 重置表单 */
  function resetForm(): void {
    Object.assign(values, initialValues);
    errors.value = {};
    loading.value = false;
    submitted.value = false;
    Object.keys(touched).forEach((key) => delete (touched as Record<string, boolean>)[key]);
  }

  /** 提交表单 */
  async function handleSubmit(): Promise<void> {
    // 校验
    if (validate) {
      const validationErrors = validate(values);
      errors.value = validationErrors;
      const hasError = Object.values(validationErrors).some((v) => v);
      if (hasError) return;
    }

    loading.value = true;
    try {
      await onSubmit(values);
      submitted.value = true;
    } catch (error) {
      const err = error as { message?: string; errors?: Record<string, string> };
      if (err.errors) {
        errors.value = err.errors as Partial<Record<keyof T, string>>;
      }
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    values,
    errors,
    loading,
    submitted,
    isValid,
    isDirty,
    setFieldValue,
    resetForm,
    handleSubmit,
  };
}

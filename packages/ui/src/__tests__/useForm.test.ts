import { describe, it, expect, vi } from 'vitest';
import { useForm } from '../composables/useForm';

describe('useForm 表单管理组合式函数', () => {
  it('初始化时 values 基于 initialValues', () => {
    const onSubmit = vi.fn();
    const form = useForm({
      initialValues: { username: '', password: '' },
      onSubmit,
    });
    expect(form.values).toEqual({ username: '', password: '' });
    expect(form.errors.value).toEqual({});
    expect(form.loading.value).toBe(false);
    expect(form.submitted.value).toBe(false);
  });

  it('isDirty 初始为 false，修改后为 true', () => {
    const onSubmit = vi.fn();
    const form = useForm({
      initialValues: { username: '', password: '' },
      onSubmit,
    });

    expect(form.isDirty.value).toBe(false);
    form.setFieldValue('username', 'alice');
    expect(form.isDirty.value).toBe(true);
  });

  it('setFieldValue 触发校验并写入 errors', () => {
    const onSubmit = vi.fn();
    const validate = vi.fn((v: { username?: string; password?: string }) => ({
      username: !v.username ? '必填' : '',
      password: (v.password?.length ?? 0) < 6 ? '至少6位' : '',
    }));
    const form = useForm({
      initialValues: { username: '', password: '' },
      validate,
      onSubmit,
    });

    form.setFieldValue('password', '123');
    expect(form.errors.value.password).toBe('至少6位');
  });

  it('isValid 反映整体校验结果', () => {
    const onSubmit = vi.fn();
    const form = useForm({
      initialValues: { username: '', password: '' },
      validate: (v) => ({
        username: !v.username ? '必填' : '',
      }),
      onSubmit,
    });

    expect(form.isValid.value).toBe(false);
    form.setFieldValue('username', 'alice');
    expect(form.isValid.value).toBe(true);
  });

  it('handleSubmit 失败时不调用 onSubmit', async () => {
    const onSubmit = vi.fn();
    const form = useForm({
      initialValues: { username: '', password: '' },
      validate: (v) => ({
        username: !v.username ? '必填' : '',
      }),
      onSubmit,
    });

    await form.handleSubmit();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.errors.value.username).toBe('必填');
  });

  it('handleSubmit 成功时调用 onSubmit 并标记 submitted', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const form = useForm({
      initialValues: { username: '', password: '' },
      onSubmit,
    });
    form.setFieldValue('username', 'alice');

    await form.handleSubmit();
    expect(onSubmit).toHaveBeenCalled();
    expect(form.submitted.value).toBe(true);
    expect(form.loading.value).toBe(false);
  });

  it('onSubmit 抛出异常时 loading 为 false 并重新抛出', async () => {
    const err = new Error('submit failed');
    const onSubmit = vi.fn().mockRejectedValue(err);
    const form = useForm({
      initialValues: { username: 'alice', password: '' },
      onSubmit,
    });

    await expect(form.handleSubmit()).rejects.toThrow('submit failed');
    expect(form.loading.value).toBe(false);
  });

  it('resetForm 恢复初始值并清空 errors/touched/submitted', () => {
    const onSubmit = vi.fn();
    const form = useForm({
      initialValues: { username: '', password: '' },
      validate: (v) => ({
        username: !v.username ? '必填' : '',
      }),
      onSubmit,
    });

    form.setFieldValue('username', 'alice');
    form.resetForm();

    expect(form.values).toEqual({ username: '', password: '' });
    expect(form.errors.value).toEqual({});
    expect(form.loading.value).toBe(false);
    expect(form.submitted.value).toBe(false);
  });
});

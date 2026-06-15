import { describe, it, expect } from 'vitest';
import { useInput } from '../primitives/useInput';

describe('useInput 无头输入框逻辑', () => {
  it('无 props 时 hasError 为 false', () => {
    const { isFocused, isDirty, hasError, isValid } = useInput();
    expect(isFocused.value).toBe(false);
    expect(isDirty.value).toBe(false);
    expect(hasError.value).toBe(false);
    expect(isValid.value).toBe(false);
  });

  it('error 非空时 hasError 为 true', () => {
    const { hasError, isValid } = useInput({ error: '必填项' });
    expect(hasError.value).toBe(true);
    expect(isValid.value).toBe(false);
  });

  it('blur 后且无 error 时 isValid 为 true', () => {
    const { handlers, isDirty, isValid } = useInput({ error: '' });
    handlers.onFocus();
    handlers.onBlur();
    expect(isDirty.value).toBe(true);
    expect(isValid.value).toBe(true);
  });

  it('focus 时设置 isFocused，blur 时清除', () => {
    const { handlers, isFocused } = useInput();
    handlers.onFocus();
    expect(isFocused.value).toBe(true);
    handlers.onBlur();
    expect(isFocused.value).toBe(false);
  });
});

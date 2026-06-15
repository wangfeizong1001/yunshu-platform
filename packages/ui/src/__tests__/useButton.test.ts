import { describe, it, expect } from 'vitest';
import { useButton } from '../primitives/useButton';

describe('useButton 无头按钮逻辑', () => {
  it('初始化时 isHovered/isFocused/isPressed 为 false', () => {
    const { isHovered, isFocused, isPressed, isDisabled } = useButton();
    expect(isHovered.value).toBe(false);
    expect(isFocused.value).toBe(false);
    expect(isPressed.value).toBe(false);
    expect(isDisabled.value).toBe(false);
  });

  it('传入 disabled/loading 时 isDisabled 为 true', () => {
    expect(useButton({ disabled: true }).isDisabled.value).toBe(true);
    expect(useButton({ loading: true }).isDisabled.value).toBe(true);
    expect(useButton({ disabled: true, loading: true }).isDisabled.value).toBe(true);
  });

  it('handlers 的交互方法能够切换状态', () => {
    const { handlers, isHovered, isFocused, isPressed } = useButton();

    handlers.onPointerenter();
    expect(isHovered.value).toBe(true);
    handlers.onPointerdown();
    expect(isPressed.value).toBe(true);
    handlers.onPointerleave();
    expect(isHovered.value).toBe(false);
    expect(isPressed.value).toBe(false);

    handlers.onFocus();
    expect(isFocused.value).toBe(true);
    handlers.onBlur();
    expect(isFocused.value).toBe(false);
  });
});

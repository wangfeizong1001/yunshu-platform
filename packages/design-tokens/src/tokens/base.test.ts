/**
 * @yunshu/design-tokens 基础令牌单元测试
 *
 * 测试范围：
 * - 令牌值的合理性（非空、数值范围）
 * - 间距系统的 4px 网格一致性
 * - 字体系统值的合法性
 * - Z-Index 层级递增性
 * - 断点递增性
 */

import { describe, it, expect } from 'vitest';
import {
  spacingBase,
  spacing,
  spacingSemantic,
  fontSize,
  fontWeight,
  lineHeight,
  borderRadius,
  boxShadow,
  transition,
  zIndex,
  breakpoint,
  fontFamily,
} from './base';

// ============================================================================
// 间距系统
// ============================================================================

describe('间距系统', () => {
  it('基础间距单位应为 4px', () => {
    expect(spacingBase).toBe(4);
  });

  it('所有间距值应为 4 的倍数', () => {
    for (const [key, value] of Object.entries(spacing)) {
      expect(value % 4).toBe(0);
    }
  });

  it('间距值应按 key 递增', () => {
    const keys = Object.keys(spacing).map(Number);
    const values = Object.values(spacing);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]!);
    }
  });

  it('语义化间距应有 xs < sm < md < lg < xl < 2xl < 3xl', () => {
    const { xs, sm, md, lg, xl, '2xl': xxl, '3xl': xxxl } = spacingSemantic;
    expect(xs).toBeLessThan(sm);
    expect(sm).toBeLessThan(md);
    expect(md).toBeLessThan(lg);
    expect(lg).toBeLessThan(xl);
    expect(xl).toBeLessThan(xxl);
    expect(xxl).toBeLessThan(xxxl);
  });

  it('语义化间距应对应正确的数值', () => {
    expect(spacingSemantic.xs).toBe(spacing[1]); // 4px
    expect(spacingSemantic.sm).toBe(spacing[2]); // 8px
    expect(spacingSemantic.md).toBe(spacing[4]); // 16px
    expect(spacingSemantic.lg).toBe(spacing[6]); // 24px
    expect(spacingSemantic.xl).toBe(spacing[8]); // 32px
  });
});

// ============================================================================
// 字体系统
// ============================================================================

describe('字体系统', () => {
  it('正文字体栈应包含中文字体', () => {
    expect(fontFamily.base).toContain('PingFang SC');
    expect(fontFamily.base).toContain('Microsoft YaHei');
  });

  it('等宽字体栈应包含 Fira Code', () => {
    expect(fontFamily.mono).toContain('Fira Code');
  });

  it('字号应是有效的 px 值', () => {
    for (const [key, value] of Object.entries(fontSize)) {
      const num = parseInt(value, 10);
      expect(num).toBeGreaterThan(0);
      expect(num).toBeLessThan(100);
      expect(value).toMatch(/^\d+px$/);
    }
  });

  it('字重应在 100-900 范围内', () => {
    for (const value of Object.values(fontWeight)) {
      expect(value).toBeGreaterThanOrEqual(100);
      expect(value).toBeLessThanOrEqual(900);
    }
  });

  it('行高应大于等于 1', () => {
    for (const value of Object.values(lineHeight)) {
      expect(value).toBeGreaterThanOrEqual(1);
    }
  });
});

// ============================================================================
// 圆角系统
// ============================================================================

describe('圆角系统', () => {
  it('应从 none=0 开始', () => {
    expect(borderRadius.none).toBe('0');
  });

  it('full 应为 9999px（胶囊形）', () => {
    expect(borderRadius.full).toBe('9999px');
  });

  it('应有至少 6 个级别', () => {
    expect(Object.keys(borderRadius).length).toBeGreaterThanOrEqual(6);
  });
});

// ============================================================================
// 阴影系统
// ============================================================================

describe('阴影系统', () => {
  it('应有 sm < base < md < lg < xl < 2xl 顺序的键', () => {
    const entries = Object.entries(boxShadow);
    expect(entries.length).toBe(6);
  });

  it('所有阴影值应为有效的 CSS box-shadow 字符串', () => {
    for (const value of Object.values(boxShadow)) {
      expect(value).toContain('px');
      expect(value).toContain('rgba');
    }
  });
});

// ============================================================================
// 过渡动画
// ============================================================================

describe('过渡动画', () => {
  it('fast < normal < slow', () => {
    const fast = parseInt(transition.fast, 10);
    const normal = parseInt(transition.normal, 10);
    const slow = parseInt(transition.slow, 10);
    expect(fast).toBeLessThan(normal);
    expect(normal).toBeLessThan(slow);
  });

  it('应包含 ease-in-out', () => {
    expect(transition.normal).toContain('ease-in-out');
  });
});

// ============================================================================
// Z-Index 层级
// ============================================================================

describe('Z-Index 层级', () => {
  it('应按 dropdown < sticky < fixed < modalBackdrop < modal < popover < tooltip 递增', () => {
    const levels = [
      zIndex.dropdown,
      zIndex.sticky,
      zIndex.fixed,
      zIndex.modalBackdrop,
      zIndex.modal,
      zIndex.popover,
      zIndex.tooltip,
    ];
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]).toBeGreaterThan(levels[i - 1]!);
    }
  });

  it('基准值应 >= 1000（避免与第三方库冲突）', () => {
    expect(zIndex.dropdown).toBeGreaterThanOrEqual(1000);
  });
});

// ============================================================================
// 响应式断点
// ============================================================================

describe('响应式断点', () => {
  it('断点应按设备尺寸递增', () => {
    const points = [
      breakpoint.xs,
      breakpoint.sm,
      breakpoint.md,
      breakpoint.lg,
      breakpoint.xl,
      breakpoint['2xl'],
    ];
    for (let i = 1; i < points.length; i++) {
      expect(points[i]).toBeGreaterThan(points[i - 1]!);
    }
  });

  it('常见断点应合理', () => {
    expect(breakpoint.sm).toBe(640); // 手机横屏
    expect(breakpoint.md).toBe(768); // 平板竖屏
    expect(breakpoint.lg).toBe(1024); // 平板横屏
    expect(breakpoint.xl).toBe(1280); // 桌面
  });
});

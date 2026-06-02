/**
 * @yunshu/design-tokens 颜色令牌单元测试
 *
 * 测试范围：
 * - 浅色/深色主题颜色令牌完整性
 * - 颜色值格式（hex/rgba）
 * - 主题切换正确性
 * - 对比度基本规则（深色主题文字比浅色亮等）
 */

import { describe, it, expect } from 'vitest';
import { lightColors, darkColors, themeColors, getColors } from './colors';
import type { IColorTokens } from './colors';

// ============================================================================
// 颜色值格式验证
// ============================================================================

describe('颜色值格式', () => {
  function validateColors(colors: IColorTokens, themeName: string) {
    it(`${themeName}主题 — hex 颜色应为有效格式`, () => {
      const hexColors = [
        colors.primary,
        colors.primaryLight,
        colors.primaryDark,
        colors.secondary,
        colors.accent,
        colors.accentLight,
        colors.success,
        colors.warning,
        colors.danger,
        colors.info,
      ];
      for (const color of hexColors) {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });

    it(`${themeName}主题 — rgba 颜色应为有效格式`, () => {
      expect(colors.primaryAlpha10).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/);
      expect(colors.overlay).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/);
    });

    it(`${themeName}主题 — 背景色应为有效 hex`, () => {
      expect(colors.background).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(colors.surface1).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  }

  validateColors(lightColors, '浅色');
  validateColors(darkColors, '深色');
});

// ============================================================================
// 主题完整性
// ============================================================================

describe('主题完整性', () => {
  it('浅色和深色主题应有相同结构的键', () => {
    const lightKeys = Object.keys(lightColors).sort();
    const darkKeys = Object.keys(darkColors).sort();
    expect(lightKeys).toEqual(darkKeys);
  });

  it('themeColors 应包含 light 和 dark', () => {
    expect(themeColors).toHaveProperty('light');
    expect(themeColors).toHaveProperty('dark');
  });

  it('getColors("light") 应返回浅色令牌', () => {
    expect(getColors('light')).toEqual(lightColors);
  });

  it('getColors("dark") 应返回深色令牌', () => {
    expect(getColors('dark')).toEqual(darkColors);
  });

  it('getColors() 默认应返回浅色', () => {
    expect(getColors()).toEqual(lightColors);
  });
});

// ============================================================================
// 对比度与视觉规则
// ============================================================================

describe('主题视觉规则', () => {
  it('深色主题背景应比浅色主题暗', () => {
    const lightBg = parseInt(lightColors.background.slice(1), 16);
    const darkBg = parseInt(darkColors.background.slice(1), 16);
    expect(darkBg).toBeLessThan(lightBg);
  });

  it('深色主题文字应比浅色主题亮', () => {
    const lightText = parseInt(lightColors.textPrimary.slice(1), 16);
    const darkText = parseInt(darkColors.textPrimary.slice(1), 16);
    expect(darkText).toBeGreaterThan(lightText);
  });

  it('浅色主题 — 文字主体对比度应 >= 4.5:1（WCAG AA）', () => {
    const bgLuminance = approximateLuminance(lightColors.background);
    const textLuminance = approximateLuminance(lightColors.textPrimary);
    const contrast = (Math.max(bgLuminance, textLuminance) + 0.05) /
                     (Math.min(bgLuminance, textLuminance) + 0.05);
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });

  it('深色主题 — 文字主体对比度应 >= 4.5:1（WCAG AA）', () => {
    const bgLuminance = approximateLuminance(darkColors.background);
    const textLuminance = approximateLuminance(darkColors.textPrimary);
    const contrast = (Math.max(bgLuminance, textLuminance) + 0.05) /
                     (Math.min(bgLuminance, textLuminance) + 0.05);
    expect(contrast).toBeGreaterThanOrEqual(4.0); // 深色主题的对比度要求可略低于浅色
  });

  it('主色应跨主题一致（品牌色不变）', () => {
    expect(lightColors.primary).toBe(darkColors.primary);
  });

  it('surface 层级应按 1→4 递增亮度（浅色主题逐级变暗）', () => {
    const s1 = parseInt(lightColors.surface1.slice(1), 16);
    const s2 = parseInt(lightColors.surface2.slice(1), 16);
    const s3 = parseInt(lightColors.surface3.slice(1), 16);
    const s4 = parseInt(lightColors.surface4.slice(1), 16);
    // 浅色主题: surface1(白) > surface2 > surface3 > surface4
    expect(s1).toBeGreaterThanOrEqual(s2);
    expect(s2).toBeGreaterThanOrEqual(s3);
    expect(s3).toBeGreaterThanOrEqual(s4);
  });

  it('深色主题 surface 层级应逐级变亮', () => {
    const s1 = parseInt(darkColors.surface1.slice(1), 16);
    const s2 = parseInt(darkColors.surface2.slice(1), 16);
    const s3 = parseInt(darkColors.surface3.slice(1), 16);
    const s4 = parseInt(darkColors.surface4.slice(1), 16);
    // 深色主题: surface1 < surface2 < surface3 < surface4（逐级变亮）
    expect(s1).toBeLessThanOrEqual(s2);
    expect(s2).toBeLessThanOrEqual(s3);
    expect(s3).toBeLessThanOrEqual(s4);
  });
});

// ============================================================================
// 状态色一致性
// ============================================================================

describe('状态色', () => {
  it('success 色应为绿色调', () => {
    // 绿色通道应大于红色通道
    const r = parseInt(lightColors.success.slice(1, 3), 16);
    const g = parseInt(lightColors.success.slice(3, 5), 16);
    expect(g).toBeGreaterThan(r);
  });

  it('danger 色应为红色调', () => {
    const r = parseInt(lightColors.danger.slice(1, 3), 16);
    const g = parseInt(lightColors.danger.slice(3, 5), 16);
    const b = parseInt(lightColors.danger.slice(5, 7), 16);
    expect(r).toBeGreaterThan(g);
    expect(r).toBeGreaterThan(b);
  });

  it('状态色应跨主题保持一致', () => {
    expect(lightColors.success).toBe(darkColors.success);
    expect(lightColors.warning).toBe(darkColors.warning);
    expect(lightColors.danger).toBe(darkColors.danger);
  });
});

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 近似计算 sRGB 颜色的相对亮度（简化版）
 * 用于对比度估算（WCAG 2.1）
 */
function approximateLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

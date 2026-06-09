import { describe, it, expect } from 'vitest';
import {
  generateCSSTheme,
  generateSCSSTheme,
  generateElementPlusVars,
  lighten,
  darken,
  hexToRgb,
  rgbToHex,
  hexToRgba,
} from '../../commands/theme';

const darkScheme = {
  bg: '#0f172a',
  surface: '#1e293b',
  text: '#e2e8f0',
};

describe('theme', () => {
  describe('generateCSSTheme', () => {
    it('should generate CSS with :root and light theme variables', () => {
      const result = generateCSSTheme('#409EFF', darkScheme, 'light');
      expect(result).toContain(':root');
      expect(result).toContain("--color-primary: #409EFF;");
      expect(result).toContain('--color-success: #67C23A');
      expect(result).toContain('--color-bg: #ffffff');
      expect(result).toContain('color-scheme: light');
    });

    it('should include dark theme variables when mode is dark', () => {
      const result = generateCSSTheme('#409EFF', darkScheme, 'dark');
      expect(result).toContain(":root");
      expect(result).toContain("[data-theme='dark']");
      expect(result).toContain('--color-bg: #0f172a');
      expect(result).toContain('--color-surface: #1e293b');
      expect(result).toContain('--color-text-primary: #e2e8f0');
    });

    it('should include both light and dark themes when mode is both', () => {
      const result = generateCSSTheme('#409EFF', darkScheme, 'both');
      expect(result).toContain(':root');
      expect(result).toContain("[data-theme='dark']");
      expect(result).toContain('color-scheme: light');
      expect(result).toContain('color-scheme: dark');
    });

    it('should include system media query when mode is system', () => {
      const result = generateCSSTheme('#409EFF', darkScheme, 'system');
      expect(result).toContain('@media (prefers-color-scheme: dark)');
    });

    it('should include semantic variables and shadow variables', () => {
      const result = generateCSSTheme('#409EFF', darkScheme, 'light');
      expect(result).toContain('--color-warning');
      expect(result).toContain('--color-danger');
      expect(result).toContain('--color-info');
      expect(result).toContain('--shadow-sm');
      expect(result).toContain('--radius-sm');
      expect(result).toContain('--font-size-xs');
    });

    it('should include file header with main color info', () => {
      const result = generateCSSTheme('#409EFF', darkScheme, 'light');
      expect(result).toContain('#409EFF');
      expect(result).toContain('light');
    });

    it('should process lighten color correctly', () => {
      const result = generateCSSTheme('#409EFF', darkScheme, 'light');
      // lighten 30% should produce a lighter color
      const lightened = lighten('#409EFF', 30);
      expect(result).toContain(lightened);
    });
  });

  describe('generateSCSSTheme', () => {
    it('should generate SCSS variables', () => {
      const result = generateSCSSTheme('#409EFF', darkScheme, 'light');
      expect(result).toContain('$primary: #409EFF;');
      expect(result).toContain('$primary-light:');
      expect(result).toContain('$primary-dark:');
      expect(result).toContain('$success: #67C23A');
      expect(result).toContain('$warning: #E6A23C');
      expect(result).toContain('$danger: #F56C6C');
      expect(result).toContain('$info: #909399');
    });

    it('should include background and text variables', () => {
      const result = generateSCSSTheme('#409EFF', darkScheme, 'light');
      expect(result).toContain('$bg: #ffffff');
      expect(result).toContain('$bg-page: #f5f7fa');
      expect(result).toContain('$text-primary: #303133');
      expect(result).toContain('$border: #dcdfe6');
    });

    it('should include shadow and radius variables', () => {
      const result = generateSCSSTheme('#409EFF', darkScheme, 'light');
      expect(result).toContain('$shadow-sm');
      expect(result).toContain('$radius-sm');
      expect(result).toContain('$font-size-xs');
    });

    it('should include dark theme variables', () => {
      const result = generateSCSSTheme('#409EFF', darkScheme, 'light');
      expect(result).toContain('$dark-bg: #0f172a');
      expect(result).toContain('$dark-surface: #1e293b');
      expect(result).toContain('$dark-text: #e2e8f0');
    });

    it('should include rgba variants for primary color', () => {
      const result = generateSCSSTheme('#409EFF', darkScheme, 'light');
      expect(result).toContain('rgba(');
      expect(result).toContain('$primary-alpha-10');
      expect(result).toContain('$primary-alpha-20');
      expect(result).toContain('$primary-alpha-50');
    });

    it('should include mixin theme-color and dark-theme', () => {
      const result = generateSCSSTheme('#409EFF', darkScheme, 'light');
      expect(result).toContain('@function theme-color');
      expect(result).toContain('@mixin dark-theme');
      expect(result).toContain("[data-theme='dark']");
    });
  });

  describe('generateElementPlusVars', () => {
    it('should generate Element Plus CSS variables', () => {
      const result = generateElementPlusVars('#409EFF', darkScheme);
      expect(result).toContain(':root');
      expect(result).toContain('--el-color-primary: #409EFF');
      expect(result).toContain('--el-color-primary-light-3');
      expect(result).toContain('--el-color-primary-light-5');
      expect(result).toContain('--el-color-primary-light-7');
      expect(result).toContain('--el-color-primary-light-8');
      expect(result).toContain('--el-color-primary-light-9');
      expect(result).toContain('--el-color-primary-dark-2');
    });

    it('should include radius variables', () => {
      const result = generateElementPlusVars('#409EFF', darkScheme);
      expect(result).toContain('--el-border-radius-base');
      expect(result).toContain('--el-border-radius-small');
      expect(result).toContain('--el-border-radius-large');
    });

    it('should include font-size variables', () => {
      const result = generateElementPlusVars('#409EFF', darkScheme);
      expect(result).toContain('--el-font-size-extra-large');
      expect(result).toContain('--el-font-size-large');
      expect(result).toContain('--el-font-size-medium');
      expect(result).toContain('--el-font-size-base');
      expect(result).toContain('--el-font-size-small');
      expect(result).toContain('--el-font-size-extra-small');
    });

    it('should include dark theme overrides', () => {
      const result = generateElementPlusVars('#409EFF', darkScheme);
      expect(result).toContain("[data-theme='dark']");
      expect(result).toContain('--el-bg-color: #0f172a');
      expect(result).toContain('--el-bg-color-page: #0f172a');
      expect(result).toContain('--el-bg-color-overlay: #1e293b');
      expect(result).toContain('--el-text-color-primary: #e2e8f0');
      expect(result).toContain('--el-border-color');
    });

    it('should use lightened primary color for dark theme', () => {
      const result = generateElementPlusVars('#409EFF', darkScheme);
      const lightened = lighten('#409EFF', 15);
      expect(result).toContain(lightened);
    });
  });

  describe('颜色工具函数', () => {
    describe('hexToRgb', () => {
      it('should convert 6-char hex to RGB', () => {
        expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
        expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
        expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
        expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
        expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
        expect(hexToRgb('#409EFF')).toEqual({ r: 64, g: 158, b: 255 });
      });

      it('should work without hash prefix', () => {
        expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      });

      it('should convert 3-char shorthand hex', () => {
        expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
        expect(hexToRgb('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
        expect(hexToRgb('#00f')).toEqual({ r: 0, g: 0, b: 255 });
        expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
        expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
      });
    });

    describe('rgbToHex', () => {
      it('should convert RGB to hex string', () => {
        expect(rgbToHex(0, 0, 0)).toBe('#000000');
        expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
        expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
        expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
        expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
        expect(rgbToHex(64, 158, 255)).toBe('#409eff');
      });

      it('should pad single digit values with zero', () => {
        expect(rgbToHex(10, 10, 10)).toBe('#0a0a0a');
        expect(rgbToHex(5, 15, 25)).toBe('#050f19');
      });
    });

    describe('hexToRgba', () => {
      it('should convert hex to rgba string with alpha', () => {
        expect(hexToRgba('#ff0000', 1)).toBe('rgba(255, 0, 0, 1)');
        expect(hexToRgba('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
        expect(hexToRgba('#409EFF', 0.1)).toBe('rgba(64, 158, 255, 0.1)');
        expect(hexToRgba('#ffffff', 0)).toBe('rgba(255, 255, 255, 0)');
      });
    });

    describe('lighten', () => {
      it('should lighten black to lighter gray', () => {
        const result = lighten('#000000', 50);
        const rgb = hexToRgb(result);
        expect(rgb.r).toBeGreaterThan(0);
        expect(rgb.g).toBeGreaterThan(0);
        expect(rgb.b).toBeGreaterThan(0);
      });

      it('should return white when lightening white', () => {
        expect(lighten('#ffffff', 50)).toBe('#ffffff');
      });

      it('should lighten blue', () => {
        const original = hexToRgb('#409EFF');
        const lightened = lighten('#409EFF', 30);
        const lightenedRgb = hexToRgb(lightened);
        // 注意: 原始蓝色 B=255 已经是最大值，不会再增加
        expect(lightenedRgb.r).toBeGreaterThanOrEqual(original.r);
        expect(lightenedRgb.g).toBeGreaterThanOrEqual(original.g);
        expect(lightenedRgb.b).toBeGreaterThanOrEqual(original.b);
        // 至少 R 或 G 通道应该增加（因为它们不是 255）
        expect(
          lightenedRgb.r > original.r || lightenedRgb.g > original.g,
        ).toBe(true);
      });

      it('should lighten by 0% to return the same color', () => {
        expect(lighten('#409EFF', 0)).toBe('#409eff');
      });

      it('should always return valid hex color', () => {
        const result = lighten('#409EFF', 100);
        expect(result).toMatch(/^#[0-9a-f]{6}$/);
      });

      it('should be idempotent with rgbToHex/hexToRgb', () => {
        const result = lighten('#409EFF', 20);
        expect(hexToRgb(result)).toBeDefined();
      });
    });

    describe('darken', () => {
      it('should darken white to darker gray', () => {
        const result = darken('#ffffff', 50);
        const rgb = hexToRgb(result);
        expect(rgb.r).toBeLessThan(255);
        expect(rgb.g).toBeLessThan(255);
        expect(rgb.b).toBeLessThan(255);
      });

      it('should return black when darkening black', () => {
        expect(darken('#000000', 50)).toBe('#000000');
      });

      it('should darken blue', () => {
        const original = hexToRgb('#409EFF');
        const darkened = darken('#409EFF', 30);
        const darkenedRgb = hexToRgb(darkened);
        expect(darkenedRgb.r).toBeLessThanOrEqual(original.r);
        expect(darkenedRgb.g).toBeLessThanOrEqual(original.g);
        expect(darkenedRgb.b).toBeLessThanOrEqual(original.b);
      });

      it('should darken by 0% to return the same color', () => {
        expect(darken('#409EFF', 0)).toBe('#409eff');
      });

      it('should always return valid hex color', () => {
        const result = darken('#409EFF', 100);
        expect(result).toMatch(/^#[0-9a-f]{6}$/);
        expect(result).toBe('#000000');
      });
    });

    describe('颜色工具函数的互操作', () => {
      it('hexToRgb + rgbToHex 应该能恢复原始颜色', () => {
        const hex = '#409eff';
        const rgb = hexToRgb(hex);
        expect(rgbToHex(rgb.r, rgb.g, rgb.b)).toBe(hex);
      });

      it('lighten 和 darken 应该产生正确的十六进制格式', () => {
        const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#8a2be2'];
        for (const color of colors) {
          const lightened = lighten(color, 30);
          const darkened = darken(color, 20);
          expect(lightened).toMatch(/^#[0-9a-f]{6}$/);
          expect(darkened).toMatch(/^#[0-9a-f]{6}$/);
        }
      });
    });
  });
});

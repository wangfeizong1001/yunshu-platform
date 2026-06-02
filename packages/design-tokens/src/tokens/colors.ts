/**
 * 云枢设计令牌 — 颜色系统
 *
 * 定义浅色/深色双主题的所有颜色令牌。
 * 使用语义化命名（primary, success, danger 等），
 * 而非视觉描述（blue, red 等），以支持主题切换。
 *
 * @module @yunshu/design-tokens/tokens/colors
 */

// ============================================================================
// 颜色令牌类型定义
// ============================================================================

/** 单个主题的颜色映射 */
export interface IColorTokens {
  // 主色调
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryAlpha10: string;
  primaryAlpha20: string;
  primaryAlpha50: string;

  // 辅助色
  secondary: string;
  accent: string;
  accentLight: string;

  // 背景色（4 层递进）
  background: string;
  surface1: string;
  surface2: string;
  surface3: string;
  surface4: string;

  // 文本色（4 级灰度）
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;

  // 状态色
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  error: string;
  errorLight: string;
  info: string;

  // 边框色（3 级）
  border: string;
  borderLight: string;
  borderDark: string;

  // 阴影
  shadowSm: string;
  shadow: string;
  shadowMd: string;
  shadowLg: string;

  // 其他
  divider: string;
  overlay: string;
  cardHover: string;
}

/** 主题类型 */
export type TTheme = 'light' | 'dark';

// ============================================================================
// 浅色主题
// ============================================================================

/**
 * 浅色主题颜色令牌
 *
 * 设计思路：
 * - 主色使用天蓝色（#4a9eff），传达科技感和信任感
 * - 背景从纯白开始逐级加深，形成清晰的视觉层次
 * - 文本从深灰到浅灰，确保 WCAG AA 级对比度（≥4.5:1）
 */
export const lightColors: IColorTokens = {
  // 主色调
  primary: '#4a9eff',
  primaryLight: '#6eb1ff',
  primaryDark: '#2a6fd0',
  primaryAlpha10: 'rgba(74, 158, 255, 0.1)',
  primaryAlpha20: 'rgba(74, 158, 255, 0.2)',
  primaryAlpha50: 'rgba(74, 158, 255, 0.5)',

  // 辅助色
  secondary: '#f5f5f5',
  accent: '#8a2be2',
  accentLight: '#9b4de6',

  // 背景色
  background: '#ffffff',
  surface1: '#ffffff',
  surface2: '#f8f9fa',
  surface3: '#e9ecef',
  surface4: '#dee2e6',

  // 文本色
  textPrimary: '#212529',
  textSecondary: '#6c757d',
  textMuted: '#adb5bd',
  textDisabled: '#c0c0c0',

  // 状态色
  success: '#27ae60',
  successLight: '#2ecc71',
  warning: '#d35400',
  warningLight: '#e67e22',
  danger: '#c0392b',
  error: '#c0392b',
  errorLight: '#e74c3c',
  info: '#3498db',

  // 边框色
  border: '#dee2e6',
  borderLight: '#e9ecef',
  borderDark: '#ced4da',

  // 阴影
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

  // 其他
  divider: '#e9ecef',
  overlay: 'rgba(0, 0, 0, 0.3)',
  cardHover: '#f8f9fa',
};

// ============================================================================
// 深色主题
// ============================================================================

/**
 * 深色主题颜色令牌
 *
 * 设计思路：
 * - 背景采用深蓝灰色调（#0a0e27 → #333852），低亮度减少眼部疲劳
 * - 主色保持不变，保持品牌一致性
 * - 文本色反转：主体文本接近白色，次要文本逐级变暗
 * - 阴影加深：深色背景下需要更强的阴影来产生层次感
 */
export const darkColors: IColorTokens = {
  // 主色调（与浅色保持一致）
  primary: '#4a9eff',
  primaryLight: '#6eb1ff',
  primaryDark: '#2a6fd0',
  primaryAlpha10: 'rgba(74, 158, 255, 0.1)',
  primaryAlpha20: 'rgba(74, 158, 255, 0.2)',
  primaryAlpha50: 'rgba(74, 158, 255, 0.5)',

  // 辅助色
  secondary: '#1a1d23',
  accent: '#8a2be2',
  accentLight: '#9b4de6',

  // 背景色（深蓝灰递进）
  background: '#0a0e27',
  surface1: '#1a1d2e',
  surface2: '#22273a',
  surface3: '#2a2f45',
  surface4: '#333852',

  // 文本色
  textPrimary: '#e0e0e0',
  textSecondary: '#a0a0a0',
  textMuted: '#666666',
  textDisabled: '#4a4a4a',

  // 状态色
  success: '#27ae60',
  successLight: '#2ecc71',
  warning: '#d35400',
  warningLight: '#e67e22',
  danger: '#c0392b',
  error: '#c0392b',
  errorLight: '#e74c3c',
  info: '#3498db',

  // 边框色
  border: '#2a2f45',
  borderLight: '#333852',
  borderDark: '#1a1d2e',

  // 阴影（深色主题阴影更重）
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',

  // 其他
  divider: '#2a2f45',
  overlay: 'rgba(0, 0, 0, 0.6)',
  cardHover: '#22273a',
};

// ============================================================================
// 主题映射
// ============================================================================

/** 按主题名获取颜色令牌 */
export const themeColors: Record<TTheme, IColorTokens> = {
  light: lightColors,
  dark: darkColors,
};

/**
 * 获取指定主题的颜色令牌
 * @param theme - 主题名称，默认 'light'
 */
export function getColors(theme: TTheme = 'light'): IColorTokens {
  return themeColors[theme];
}

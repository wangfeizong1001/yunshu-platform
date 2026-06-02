/**
 * 云枢设计令牌 — 规范层
 *
 * 定义所有设计决策的原始数据。这些值不依赖任何框架或样式系统，
 * 通过生成器输出为目标格式（CSS 变量、SCSS 变量、Tailwind 配置等）。
 *
 * 设计原则：
 * - 单一数据源（Single Source of Truth）
 * - 命名语义化，不描述视觉属性（如 primary 而非 blue）
 * - 支持浅色/深色双主题
 * - 所有值附带中文注释，说明设计意图
 *
 * @module @yunshu/design-tokens
 */

// ============================================================================
// 间距系统
// ============================================================================

/**
 * 基础间距单位（4px 网格系统）
 *
 * 选择 4px 的原因：
 * - 4 的倍数确保像素对齐，避免亚像素渲染
 * - 与主流设计系统一致（Material Design、Ant Design 等）
 */
export const spacingBase = 4;

export const spacing = {
  /** 0px — 无间距 */
  0: 0,
  /** 4px — 极小间距，用于图标与文字之间 */
  1: 4,
  /** 8px — 小间距，用于紧密相关元素 */
  2: 8,
  /** 12px — 中小间距 */
  3: 12,
  /** 16px — 中等间距，常用内边距 */
  4: 16,
  /** 20px — 中大间距 */
  5: 20,
  /** 24px — 大间距，段落/卡片之间 */
  6: 24,
  /** 28px */
  7: 28,
  /** 32px — 超大间距，区块之间 */
  8: 32,
  /** 36px */
  9: 36,
  /** 40px */
  10: 40,
  /** 48px — 特大间距 */
  12: 48,
  /** 64px — 巨大间距，页面级间距 */
  16: 64,
} as const;

/** 语义化间距别名 */
export const spacingSemantic = {
  xs: spacing[1],   // 4px  — 极小
  sm: spacing[2],   // 8px  — 小
  md: spacing[4],   // 16px — 中
  lg: spacing[6],   // 24px — 大
  xl: spacing[8],   // 32px — 超大
  '2xl': spacing[12], // 48px — 特大
  '3xl': spacing[16], // 64px — 巨大
} as const;

// ============================================================================
// 字体系统
// ============================================================================

export const fontFamily = {
  /** 正文字体栈 — 优先使用系统字体，兼顾中英文显示 */
  base: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    '"PingFang SC"',
    '"Hiragino Sans GB"',
    '"Microsoft YaHei"',
    '"Helvetica Neue"',
    'Helvetica',
    'Arial',
    'sans-serif',
  ].join(', '),
  /** 等宽字体栈 — 用于代码和技术数据展示 */
  mono: ['"Fira Code"', '"Consolas"', '"Monaco"', '"Courier New"', 'monospace'].join(', '),
} as const;

export const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
} as const;

export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// ============================================================================
// 圆角系统
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
} as const;

// ============================================================================
// 阴影系统
// ============================================================================

export const boxShadow = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

// ============================================================================
// 过渡动画
// ============================================================================

export const transition = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
} as const;

// ============================================================================
// Z-Index 层级
// ============================================================================

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ============================================================================
// 响应式断点
// ============================================================================

export const breakpoint = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

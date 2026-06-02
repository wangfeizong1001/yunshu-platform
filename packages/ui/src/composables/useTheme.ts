/**
 * UI — 主题管理 Composable
 *
 * 管理浅色/深色主题切换，自动跟随系统偏好。
 *
 * @module @yunshu/ui/composables/useTheme
 */

import { ref, watch, onMounted } from 'vue';
import type { TTheme } from '@yunshu/design-tokens';

/** 主题状态 */
const currentTheme = ref<TTheme>('light');
const isSystemTheme = ref(true);

/**
 * 主题管理 Hook
 *
 * @example
 * ```typescript
 * const { theme, setTheme, toggleTheme, isDark } = useTheme();
 *
 * // 手动切换
 * setTheme('dark');
 *
 * // 切换亮暗
 * toggleTheme();
 * ```
 */
export function useTheme() {
  /** 应用主题到 DOM */
  function applyTheme(theme: TTheme): void {
    currentTheme.value = theme;
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem('yunshu-theme', theme);
  }

  /** 获取系统偏好 */
  function getSystemTheme(): TTheme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /** 设置主题 */
  function setTheme(theme: TTheme): void {
    isSystemTheme.value = false;
    applyTheme(theme);
  }

  /** 切换主题 */
  function toggleTheme(): void {
    setTheme(currentTheme.value === 'light' ? 'dark' : 'light');
  }

  /** 跟随系统偏好 */
  function followSystem(): void {
    isSystemTheme.value = true;
    applyTheme(getSystemTheme());
  }

  /** 是否为深色主题 */
  const isDark = () => currentTheme.value === 'dark';

  // 启动时初始化
  onMounted(() => {
    const saved = localStorage.getItem('yunshu-theme') as TTheme | null;
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    } else {
      followSystem();
    }
  });

  // 监听系统主题变化
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (isSystemTheme.value) {
        applyTheme(getSystemTheme());
      }
    });
  }

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    followSystem,
    isDark,
  };
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { useTheme } from '../composables/useTheme';

const TestComponent = {
  setup() {
    const api = useTheme();
    return { api };
  },
  template: '<div>{{ api.theme }}</div>',
};

describe('useTheme 主题管理组合式函数', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    vi.clearAllMocks();
  });

  it('初始化时主题默认值为 light', () => {
    const wrapper = mount(TestComponent);
    const api = (wrapper.vm as unknown as { api: ReturnType<typeof useTheme> }).api;
    expect(['light', 'dark']).toContain(api.theme.value);
  });

  it('setTheme 切换主题并修改 DOM class', () => {
    const wrapper = mount(TestComponent);
    const api = (wrapper.vm as unknown as { api: ReturnType<typeof useTheme> }).api;

    api.setTheme('dark');
    expect(api.theme.value).toBe('dark');
    expect(document.documentElement.classList.contains('theme-dark')).toBe(true);
    expect(localStorage.getItem('yunshu-theme')).toBe('dark');

    api.setTheme('light');
    expect(api.theme.value).toBe('light');
    expect(document.documentElement.classList.contains('theme-light')).toBe(true);
  });

  it('toggleTheme 在 light 与 dark 之间切换', () => {
    const wrapper = mount(TestComponent);
    const api = (wrapper.vm as unknown as { api: ReturnType<typeof useTheme> }).api;

    api.setTheme('light');
    api.toggleTheme();
    expect(api.theme.value).toBe('dark');

    api.toggleTheme();
    expect(api.theme.value).toBe('light');
  });

  it('followSystem 读取 matchMedia 偏好', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList,
    );

    const wrapper = mount(TestComponent);
    const api = (wrapper.vm as unknown as { api: ReturnType<typeof useTheme> }).api;

    api.followSystem();
    expect(api.theme.value).toBe('dark');
  });

  it('isDark 判断当前主题是否为 dark', () => {
    const wrapper = mount(TestComponent);
    const api = (wrapper.vm as unknown as { api: ReturnType<typeof useTheme> }).api;

    api.setTheme('dark');
    expect(api.isDark()).toBe(true);
    api.setTheme('light');
    expect(api.isDark()).toBe(false);
  });
});

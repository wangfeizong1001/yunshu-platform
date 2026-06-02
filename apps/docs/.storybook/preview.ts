import type { Preview } from '@storybook/vue3';

// 导入设计令牌 CSS
import '@yunshu/design-tokens/css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0e27' },
        { name: 'surface', value: '#f8f9fa' },
      ],
    },
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    theme: {
      name: '主题',
      description: '切换浅色/深色主题',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: '浅色' },
          { value: 'dark', title: '深色' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'light';
      document.documentElement.className = `theme-${theme}`;
      return story();
    },
  ],
};

export default preview;

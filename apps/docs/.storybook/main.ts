import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: [
    '../../../packages/ui/src/**/*.stories.@(ts|js)',
    '../../../packages/ui/src/**/*.mdx',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      docgen: 'vue-component-meta',
    },
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    // 注入设计令牌 CSS 变量
    return {
      ...config,
      css: {
        ...config.css,
        preprocessorOptions: {
          ...config.css?.preprocessorOptions,
        },
      },
    };
  },
};

export default config;

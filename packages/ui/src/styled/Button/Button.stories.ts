import type { Meta, StoryObj } from '@storybook/vue3';
import YunButton from './Button.vue';

const meta: Meta<typeof YunButton> = {
  title: 'Styled/Button',
  component: YunButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'text', 'danger'],
      description: '按钮变体',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '按钮尺寸',
    },
    disabled: { control: 'boolean', description: '是否禁用' },
    loading: { control: 'boolean', description: '是否加载中' },
    block: { control: 'boolean', description: '是否块级' },
    round: { control: 'boolean', description: '是否圆角' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof YunButton>;

/** 主要按钮 — 用于核心操作 */
export const Primary: Story = {
  args: { variant: 'primary' },
  render: (args) => ({
    components: { YunButton },
    setup: () => ({ args }),
    template: '<YunButton v-bind="args">主要按钮</YunButton>',
  }),
};

/** 次要按钮 */
export const Secondary: Story = {
  args: { variant: 'secondary' },
  render: (args) => ({
    components: { YunButton },
    setup: () => ({ args }),
    template: '<YunButton v-bind="args">次要按钮</YunButton>',
  }),
};

/** 边框按钮 */
export const Outline: Story = {
  args: { variant: 'outline' },
  render: (args) => ({
    components: { YunButton },
    setup: () => ({ args }),
    template: '<YunButton v-bind="args">边框按钮</YunButton>',
  }),
};

/** 文本按钮 */
export const Text: Story = {
  args: { variant: 'text' },
  render: (args) => ({
    components: { YunButton },
    setup: () => ({ args }),
    template: '<YunButton v-bind="args">文本按钮</YunButton>',
  }),
};

/** 危险按钮 */
export const Danger: Story = {
  args: { variant: 'danger' },
  render: (args) => ({
    components: { YunButton },
    setup: () => ({ args }),
    template: '<YunButton v-bind="args">删除</YunButton>',
  }),
};

/** 加载状态 */
export const Loading: Story = {
  args: { variant: 'primary', loading: true },
  render: (args) => ({
    components: { YunButton },
    setup: () => ({ args }),
    template: '<YunButton v-bind="args">提交中...</YunButton>',
  }),
};

/** 禁用状态 */
export const Disabled: Story = {
  args: { variant: 'primary', disabled: true },
  render: (args) => ({
    components: { YunButton },
    setup: () => ({ args }),
    template: '<YunButton v-bind="args">已禁用</YunButton>',
  }),
};

/** 块级按钮 */
export const Block: Story = {
  args: { variant: 'primary', block: true },
  render: (args) => ({
    components: { YunButton },
    setup: () => ({ args }),
    template: '<YunButton v-bind="args">块级按钮</YunButton>',
  }),
};

/** 不同尺寸 */
export const Sizes: Story = {
  render: () => ({
    components: { YunButton },
    template: `
      <div style="display:flex;gap:12px;align-items:center">
        <YunButton size="sm">小按钮</YunButton>
        <YunButton size="md">中按钮</YunButton>
        <YunButton size="lg">大按钮</YunButton>
      </div>
    `,
  }),
};

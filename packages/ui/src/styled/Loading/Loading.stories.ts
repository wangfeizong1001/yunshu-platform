import type { Meta, StoryObj } from '@storybook/vue3';
import YunLoading from './Loading.vue';

const meta: Meta<typeof YunLoading> = {
  title: 'Styled/Loading',
  component: YunLoading,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: '尺寸' },
    text: { control: 'text', description: '加载提示文字' },
  },
};

export default meta;
type Story = StoryObj<typeof YunLoading>;

export const Default: Story = {
  render: () => ({
    components: { YunLoading },
    template: '<YunLoading />',
  }),
};

export const Small: Story = {
  args: { size: 'sm', text: '加载中...' },
  render: (args) => ({
    components: { YunLoading },
    setup: () => ({ args }),
    template: '<YunLoading v-bind="args" />',
  }),
};

export const Large: Story = {
  args: { size: 'lg', text: '正在加载数据，请稍候...' },
  render: (args) => ({
    components: { YunLoading },
    setup: () => ({ args }),
    template: '<YunLoading v-bind="args" />',
  }),
};

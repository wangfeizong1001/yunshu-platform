import type { Meta, StoryObj } from '@storybook/vue3';
import YunEmpty from './Empty.vue';

const meta: Meta<typeof YunEmpty> = {
  title: 'Styled/Empty',
  component: YunEmpty,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof YunEmpty>;

export const Default: Story = {
  render: () => ({
    components: { YunEmpty },
    template: '<YunEmpty />',
  }),
};

export const CustomDescription: Story = {
  args: { description: '暂无搜索结果' },
  render: (args) => ({
    components: { YunEmpty },
    setup: () => ({ args }),
    template: '<YunEmpty v-bind="args" />',
  }),
};

export const WithAction: Story = {
  render: () => ({
    components: { YunEmpty },
    template: `
      <YunEmpty description="还没有任何内容">
        <template #action>
          <button style="padding:8px 16px;background:var(--primary);color:#fff;border:none;border-radius:4px;cursor:pointer">
            立即创建
          </button>
        </template>
      </YunEmpty>
    `,
  }),
};

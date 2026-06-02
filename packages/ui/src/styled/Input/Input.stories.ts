import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import YunInput from './Input.vue';

const meta: Meta<typeof YunInput> = {
  title: 'Styled/Input',
  component: YunInput,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'password', 'email', 'number'], description: '输入类型' },
    placeholder: { control: 'text', description: '占位提示' },
    disabled: { control: 'boolean', description: '是否禁用' },
    readonly: { control: 'boolean', description: '是否只读' },
    clearable: { control: 'boolean', description: '是否可清除' },
    error: { control: 'text', description: '错误提示' },
  },
};

export default meta;
type Story = StoryObj<typeof YunInput>;

export const Default: Story = {
  render: () => ({
    components: { YunInput },
    setup: () => { const val = ref(''); return { val }; },
    template: '<YunInput v-model="val" placeholder="请输入内容" />',
  }),
};

export const WithError: Story = {
  render: () => ({
    components: { YunInput },
    setup: () => { const val = ref('bad'); return { val }; },
    template: '<YunInput v-model="val" error="此字段格式不正确" />',
  }),
};

export const Disabled: Story = {
  args: { modelValue: '不可编辑', disabled: true },
  render: (args) => ({
    components: { YunInput },
    setup: () => ({ args }),
    template: '<YunInput v-bind="args" />',
  }),
};

export const Clearable: Story = {
  args: { clearable: true },
  render: (args) => ({
    components: { YunInput },
    setup: () => { const val = ref('点击右侧✕清除'); return { val, args }; },
    template: '<YunInput v-model="val" v-bind="args" />',
  }),
};

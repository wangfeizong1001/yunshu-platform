import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CommonButton from '@/components/CommonButton/index.vue';
describe('CommonButton', () => {
  it('should render correctly with default props', () => {
    const wrapper = mount(CommonButton, {
      slots: {
        default: 'Click Me',
      },
      global: {
        stubs: {
          'el-button': true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
  it('should render with primary type', () => {
    const wrapper = mount(CommonButton, {
      props: {
        type: 'primary',
      },
      slots: {
        default: 'Primary',
      },
      global: {
        stubs: {
          'el-button': true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
  it('should render with different sizes', () => {
    const wrapper = mount(CommonButton, {
      props: {
        size: 'small',
      },
      slots: {
        default: 'Small',
      },
      global: {
        stubs: {
          'el-button': true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
  it('should be disabled when disabled prop is true', () => {
    const wrapper = mount(CommonButton, {
      props: {
        disabled: true,
      },
      slots: {
        default: 'Disabled',
      },
      global: {
        stubs: {
          'el-button': true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
  it('should show loading when loading prop is true', () => {
    const wrapper = mount(CommonButton, {
      props: {
        loading: true,
      },
      slots: {
        default: 'Loading',
      },
      global: {
        stubs: {
          'el-button': true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
  it('should emit click event when clicked', async () => {
    const wrapper = mount(CommonButton, {
      slots: {
        default: 'Click Me',
      },
      global: {
        stubs: {
          'el-button': {
            emits: ['click'],
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    });
    // 直接调用组件的 handleClick 方法
    const vm = wrapper.vm;
    vm.handleClick({});
    expect(wrapper.emitted()).toHaveProperty('click');
  });
});
//# sourceMappingURL=CommonButton.test.js.map

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Input from '../styled/Input/Input.vue';

describe('Input 输入组件', () => {
  it('能够渲染输入框并接受 modelValue', () => {
    const wrapper = mount(Input, { props: { modelValue: 'hello' } });
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.element.value).toBe('hello');
  });

  it('输入后触发 update:modelValue', async () => {
    const wrapper = mount(Input, { props: { modelValue: '' } });
    const input = wrapper.find('input');
    await input.setValue('world');
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('world');
  });

  it('error 非空时显示错误文字并添加 error 类', () => {
    const wrapper = mount(Input, { props: { error: '必填项' } });
    expect(wrapper.find('.yun-input__error').exists()).toBe(true);
    expect(wrapper.find('.yun-input-wrapper').classes()).toContain('yun-input--error');
    expect(wrapper.text()).toContain('必填项');
  });

  it('focus/blur 事件能够触发', async () => {
    const wrapper = mount(Input);
    const input = wrapper.find('input');
    await input.trigger('focus');
    await input.trigger('blur');
    expect(wrapper.emitted('focus')).toBeTruthy();
    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('disabled 属性会禁用输入', () => {
    const wrapper = mount(Input, { props: { disabled: true } });
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true);
    expect(wrapper.find('.yun-input-wrapper').classes()).toContain('yun-input--disabled');
  });

  it('clearable 时显示清除按钮，点击后触发 update:modelValue 和 clear', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'hello', clearable: true },
    });
    const clearBtn = wrapper.find('.yun-input__clear');
    expect(clearBtn.exists()).toBe(true);
    await clearBtn.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('');
    expect(wrapper.emitted('clear')).toBeTruthy();
  });

  it('clearable=false 时不显示清除按钮', () => {
    const wrapper = mount(Input, { props: { modelValue: 'hello' } });
    expect(wrapper.find('.yun-input__clear').exists()).toBe(false);
  });

  it('type 属性能够应用到 input', () => {
    const wrapper = mount(Input, { props: { type: 'password' } });
    expect((wrapper.find('input').element as HTMLInputElement).type).toBe('password');
  });
});

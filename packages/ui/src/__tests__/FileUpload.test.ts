import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import FileUpload from '../business/FileUpload/FileUpload.vue';

describe('FileUpload 文件上传组件', () => {
  it('渲染拖拽区域', () => {
    const wrapper = mount(FileUpload);
    expect(wrapper.find('.yun-upload__area').exists()).toBe(true);
  });

  it('accept 属性会在提示中显示', () => {
    const wrapper = mount(FileUpload, { props: { accept: 'image/*' } });
    expect(wrapper.text()).toContain('image/*');
  });

  it('disabled=true 禁用上传（is-disabled 类）', () => {
    const wrapper = mount(FileUpload, { props: { disabled: true } });
    expect(wrapper.find('.is-disabled').exists()).toBe(true);
  });

  it('文件过大时触发 error 事件', () => {
    const wrapper = mount(FileUpload, {
      props: { maxSize: 0.0001 },
    });

    const file = new File([new ArrayBuffer(1024 * 1024)], 'big.png', { type: 'image/png' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    wrapper.find('.yun-upload__area').trigger('drop', {
      dataTransfer,
      preventDefault: vi.fn(),
    });

    expect(wrapper.emitted('error')).toBeTruthy();
  });
});

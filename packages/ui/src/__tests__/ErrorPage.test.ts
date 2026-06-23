import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ErrorPage from '../business/ErrorPage/ErrorPage.vue';

describe('ErrorPage 错误页面组件', () => {
  it('默认渲染 404', () => {
    const wrapper = mount(ErrorPage);
    expect(wrapper.text()).toContain('404');
    expect(wrapper.text()).toContain('页面未找到');
  });

  it('code=403 显示 403 对应文案', () => {
    const wrapper = mount(ErrorPage, { props: { code: 403 } });
    expect(wrapper.text()).toContain('403');
    expect(wrapper.text()).toContain('访问被拒绝');
  });

  it('code=500 显示 500 对应文案', () => {
    const wrapper = mount(ErrorPage, { props: { code: 500 } });
    expect(wrapper.text()).toContain('500');
    expect(wrapper.text()).toContain('服务器错误');
  });

  it('支持自定义 title 和 description', () => {
    const wrapper = mount(ErrorPage, {
      props: { code: 404, title: '自定义标题', description: '自定义描述' },
    });
    expect(wrapper.text()).toContain('自定义标题');
    expect(wrapper.text()).toContain('自定义描述');
  });

  it('点击返回首页按钮触发 back 事件', async () => {
    const wrapper = mount(ErrorPage, { props: { showHomeBtn: true } });
    const buttons = wrapper.findAll('button');
    await buttons[buttons.length - 1].trigger('click');
    expect(wrapper.emitted('back')).toBeTruthy();
  });

  it('showHomeBtn=false 不渲染返回首页按钮', () => {
    const wrapper = mount(ErrorPage, { props: { showHomeBtn: false } });
    expect(wrapper.findAll('button')).toHaveLength(0);
  });

  it('支持自定义 actions slot', () => {
    const wrapper = mount(ErrorPage, {
      slots: { actions: '<button class="custom-btn">重试</button>' },
    });
    expect(wrapper.find('.custom-btn').exists()).toBe(true);
  });
});

import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '云枢中台',
  description: '开箱即用的中台前端/设计解决方案',
  lang: 'zh-CN',
  lastUpdated: true,
  base: '/docs/',

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/button' },
      { text: 'API 客户端', link: '/api-client/' },
      { text: '后端', link: '/server/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '简介', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '从云枢迁移', link: '/guide/migration' },
          ],
        },
        {
          text: '设计',
          items: [
            { text: '设计令牌', link: '/guide/design-tokens' },
            { text: '颜色系统', link: '/guide/colors' },
            { text: '主题', link: '/guide/themes' },
          ],
        },
        {
          text: '最佳实践',
          items: [
            { text: '项目结构', link: '/guide/structure' },
            { text: '权限设计', link: '/guide/permission' },
            { text: '错误处理', link: '/guide/error-handling' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Input 输入框', link: '/components/input' },
          ],
        },
        {
          text: '反馈组件',
          items: [
            { text: 'Dialog 弹窗', link: '/components/dialog' },
            { text: 'Loading 加载', link: '/components/loading' },
            { text: 'Empty 空状态', link: '/components/empty' },
          ],
        },
        {
          text: '数据组件',
          items: [
            { text: 'Pagination 分页', link: '/components/pagination' },
          ],
        },
      ],
      '/api-client/': [
        { text: '概述', link: '/api-client/' },
        { text: 'HttpClient', link: '/api-client/http-client' },
        { text: 'BaseAPI', link: '/api-client/base-api' },
        { text: '中间件', link: '/api-client/middlewares' },
        { text: 'Vue 集成', link: '/api-client/vue' },
      ],
      '/server/': [
        { text: '概述', link: '/server/' },
        { text: 'BaseController', link: '/server/base-controller' },
        { text: 'BaseService', link: '/server/base-service' },
        { text: '错误体系', link: '/server/errors' },
        { text: '中间件', link: '/server/middlewares' },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/yunshu-platform' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: '沉淀自云枢网站导航系统 ~238,000 行生产级代码',
      copyright: 'MIT Licensed | 云枢团队',
    },
  },
});

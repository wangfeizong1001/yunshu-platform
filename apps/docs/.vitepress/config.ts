import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '云枢中台',
  description: '开箱即用的中台前端/设计解决方案',
  lang: 'zh-CN',
  lastUpdated: true,

  // 站点 URL（用于 sitemap 和绝对链接）
  cleanUrls: true,

  // Markdown 选项
  markdown: {
    lineNumbers: false,
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },

  // 头信息
  head: [
    ['meta', { name: 'theme-color', content: '#4a9eff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '云枢中台' }],
    ['meta', { property: 'og:description', content: '开箱即用的中台前端/设计解决方案' }],
    ['meta', { property: 'og:image', content: '/hero-bg.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/button' },
      { text: 'API 客户端', link: '/api-client/' },
      { text: '后端', link: '/server/' },
      { text: '部署', link: '/deploy/docker' },
      {
        text: '更多',
        items: [
          { text: '工作流', link: '/guide/workflow' },
          { text: '大屏设计器', link: '/guide/dashboard-pro' },
          { text: '品牌色规范', link: '/guide/brand-color' },
          { text: '更新日志', link: '/changelog' },
          { text: '常见问题', link: '/faq' },
          { text: '贡献指南', link: '/contributing' },
        ],
      },
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
            { text: '品牌色规范', link: '/guide/brand-color' },
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
        {
          text: '业务模块',
          items: [
            { text: '工作流', link: '/guide/workflow' },
            { text: '大屏设计器', link: '/guide/dashboard-pro' },
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
      '/deploy/': [
        { text: 'Docker 部署', link: '/deploy/docker' },
        { text: 'Nginx 配置', link: '/deploy/nginx' },
        { text: 'CI/CD 流程', link: '/deploy/cicd' },
        { text: '发布流程', link: '/deploy/release-process' },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wangfeizong1001/yunshu-platform' },
    ],

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
          },
        },
      },
    },

    outline: {
      level: [2, 3],
      label: '页面大纲',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    footer: {
      message: '沉淀自云枢网站导航系统 ~238,000 行生产级代码',
      copyright: `MIT Licensed | 云枢团队 | <a href="/changelog">更新日志</a> | <a href="https://github.com/wangfeizong1001/yunshu-platform" target="_blank">GitHub</a>`,
    },

    editLink: {
      pattern: 'https://github.com/wangfeizong1001/yunshu-platform/edit/main/apps/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    lastUpdatedText: '最后更新于',

    // 暗色模式选项
    appearance: 'auto',
  },
});

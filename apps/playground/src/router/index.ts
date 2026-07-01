import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layouts/Layout.vue';
import Home from '@/pages/Home.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
        meta: { title: '首页' },
      },
      {
        path: 'basic',
        name: 'basic',
        component: () => import('@/pages/Basic.vue'),
        meta: { title: '基础组件' },
      },
      {
        path: 'chart',
        name: 'chart',
        component: () => import('@/pages/Chart.vue'),
        meta: { title: '图表组件' },
      },
      {
        path: 'data',
        name: 'data',
        component: () => import('@/pages/Data.vue'),
        meta: { title: '数据组件' },
      },
      {
        path: 'form',
        name: 'form',
        component: () => import('@/pages/Form.vue'),
        meta: { title: '表单组件' },
      },
      {
        path: 'button',
        name: 'button',
        component: () => import('@/pages/Button.vue'),
        meta: { title: 'Button 按钮' },
      },
      {
        path: 'table',
        name: 'table',
        component: () => import('@/pages/Table.vue'),
        meta: { title: 'Table 表格' },
      },
      {
        path: 'line-chart',
        name: 'line-chart',
        component: () => import('@/pages/LineChart.vue'),
        meta: { title: '折线图' },
      },
      {
        path: 'bar-chart',
        name: 'bar-chart',
        component: () => import('@/pages/BarChart.vue'),
        meta: { title: '柱状图' },
      },
      {
        path: 'pie-chart',
        name: 'pie-chart',
        component: () => import('@/pages/PieChart.vue'),
        meta: { title: '饼图' },
      },
      {
        path: 'ring-chart',
        name: 'ring-chart',
        component: () => import('@/pages/RingChart.vue'),
        meta: { title: '环形图' },
      },
      {
        path: 'area-chart',
        name: 'area-chart',
        component: () => import('@/pages/AreaChart.vue'),
        meta: { title: '面积图' },
      },
      {
        path: 'gauge',
        name: 'gauge',
        component: () => import('@/pages/Gauge.vue'),
        meta: { title: '仪表盘' },
      },
      {
        path: 'upload',
        name: 'upload',
        component: () => import('@/pages/Upload.vue'),
        meta: { title: '文件上传' },
      },
      {
        path: 'language-switch',
        name: 'language-switch',
        component: () => import('@/pages/LanguageSwitch.vue'),
        meta: { title: '语言切换' },
      },
      {
        path: 'tenant-select',
        name: 'tenant-select',
        component: () => import('@/pages/TenantSelect.vue'),
        meta: { title: '租户选择' },
      },
      {
        path: 'table-widget',
        name: 'table-widget',
        component: () => import('@/pages/TableWidget.vue'),
        meta: { title: '数据表格' },
      },
      {
        path: 'text-widget',
        name: 'text-widget',
        component: () => import('@/pages/TextWidget.vue'),
        meta: { title: '文本组件' },
      },
      {
        path: 'image-widget',
        name: 'image-widget',
        component: () => import('@/pages/ImageWidget.vue'),
        meta: { title: '图片组件' },
      },
      {
        path: 'code-preview',
        name: 'code-preview',
        component: () => import('@/pages/CodePreviewDemo.vue'),
        meta: { title: '代码预览' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory('/playground'),
  routes,
});

router.beforeEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 云枢 Playground` : '云枢 Playground';
});

export default router;

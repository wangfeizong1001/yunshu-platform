/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted, computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart, MapChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GeoComponent,
} from 'echarts/components';
import { ElMessage } from 'element-plus';
import { Refresh, FullScreen, ArrowDown } from '@element-plus/icons-vue';
import {
  getDashboardStats,
  getSalesTrendData,
  getRegionSalesData,
  getCategoryData,
  getRealTimeData,
} from '@/api/dashboard.api';
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  MapChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GeoComponent,
]);
const isFullscreen = ref(false);
const currentTime = ref('');
const realtimeData = ref({
  currentOrders: 0,
  currentUsers: 0,
  currentRevenue: 0,
});
const stats = ref(null);
const salesTrendData = ref([]);
const regionSalesData = ref([]);
const categoryData = ref([]);
let timeInterval = null;
let realtimeInterval = null;
const metrics = computed(() => {
  if (!stats.value) return [];
  return [
    {
      label: '总用户数',
      value: stats.value.totalUsers.toLocaleString(),
      trend: stats.value.userGrowthRate,
    },
    { label: '活跃用户', value: stats.value.activeUsers.toLocaleString(), trend: 8.5 },
    {
      label: '总订单数',
      value: stats.value.totalOrders.toLocaleString(),
      trend: stats.value.orderGrowthRate,
    },
    {
      label: '总营收',
      value: `¥${stats.value.totalRevenue.toLocaleString()}`,
      trend: stats.value.revenueGrowthRate,
    },
  ];
});
const salesTrendOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: salesTrendData.value.map((d) => d.date),
      axisLine: { lineStyle: { color: '#00d4ff' } },
      axisLabel: { color: '#fff' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#00d4ff' } },
      axisLabel: { color: '#fff' },
      splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.1)' } },
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        data: salesTrendData.value.map((d) => d.sales),
        itemStyle: { color: '#00d4ff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
              { offset: 1, color: 'rgba(0, 212, 255, 0)' },
            ],
          },
        },
      },
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        data: salesTrendData.value.map((d) => d.orders),
        itemStyle: { color: '#ffd700' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 215, 0, 0.3)' },
              { offset: 1, color: 'rgba(255, 215, 0, 0)' },
            ],
          },
        },
      },
    ],
  };
});
const orderStatsOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: salesTrendData.value.slice(-6).map((d) => d.date),
      axisLine: { lineStyle: { color: '#00d4ff' } },
      axisLabel: { color: '#fff' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#00d4ff' } },
      axisLabel: { color: '#fff' },
      splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.1)' } },
    },
    series: [
      {
        name: '订单数',
        type: 'bar',
        data: salesTrendData.value.slice(-6).map((d) => d.orders),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#00d4ff' },
              { offset: 1, color: '#0066ff' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };
});
const mapOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ¥{c}',
    },
    visualMap: {
      min: 0,
      max: 150000,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true,
      inRange: {
        color: ['#0066ff', '#00d4ff', '#00ff88'],
      },
      textStyle: {
        color: '#fff',
      },
    },
    geo: {
      map: 'china',
      roam: true,
      label: {
        show: true,
        color: '#fff',
      },
      itemStyle: {
        areaColor: 'rgba(0, 102, 255, 0.2)',
        borderColor: '#00d4ff',
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(0, 212, 255, 0.5)',
        },
        label: {
          color: '#fff',
        },
      },
    },
    series: [
      {
        name: '销售额',
        type: 'map',
        map: 'china',
        geoIndex: 0,
        data: regionSalesData.value.map((d) => ({ name: d.name, value: d.value })),
      },
    ],
  };
});
const categoryOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#fff' },
    },
    series: [
      {
        name: '分类占比',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0a0e27',
          borderWidth: 2,
        },
        label: {
          show: true,
          color: '#fff',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        data: categoryData.value.map((d, index) => ({
          name: d.name,
          value: d.value,
          itemStyle: {
            color: ['#00d4ff', '#ffd700', '#00ff88', '#ff6b6b', '#a855f7'][index],
          },
        })),
      },
    ],
  };
});
const userGrowthOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: salesTrendData.value.slice(-6).map((d) => d.date),
      axisLine: { lineStyle: { color: '#00d4ff' } },
      axisLabel: { color: '#fff' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#00d4ff' } },
      axisLabel: { color: '#fff' },
      splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.1)' } },
    },
    series: [
      {
        name: '用户数',
        type: 'line',
        smooth: true,
        data: salesTrendData.value.slice(-6).map((d) => d.visitors),
        itemStyle: { color: '#00ff88' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
              { offset: 1, color: 'rgba(0, 255, 136, 0)' },
            ],
          },
        },
      },
    ],
  };
});
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long',
  });
};
const fetchStats = async () => {
  try {
    const res = await getDashboardStats();
    const responseData = res;
    if (responseData.data) {
      stats.value = responseData.data;
    }
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
};
const fetchSalesTrend = async () => {
  try {
    const res = await getSalesTrendData();
    const responseData = res;
    if (responseData.data) {
      salesTrendData.value = responseData.data;
    }
  } catch (error) {
    console.error('获取销售趋势数据失败:', error);
  }
};
const fetchRegionSales = async () => {
  try {
    const res = await getRegionSalesData();
    const responseData = res;
    if (responseData.data) {
      regionSalesData.value = responseData.data;
    }
  } catch (error) {
    console.error('获取区域销售数据失败:', error);
  }
};
const fetchCategoryData = async () => {
  try {
    const res = await getCategoryData();
    const responseData = res;
    if (responseData.data) {
      categoryData.value = responseData.data;
    }
  } catch (error) {
    console.error('获取分类数据失败:', error);
  }
};
const fetchRealtimeData = async () => {
  try {
    const res = await getRealTimeData();
    const responseData = res;
    const data = responseData.data;
    if (data?.data) {
      realtimeData.value = data.data;
    }
  } catch (error) {
    console.error('获取实时数据失败:', error);
  }
};
const refreshData = () => {
  fetchStats();
  fetchSalesTrend();
  fetchRegionSales();
  fetchCategoryData();
  ElMessage.success('数据已刷新');
};
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};
onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  realtimeInterval = setInterval(fetchRealtimeData, 3000);
  fetchStats();
  fetchSalesTrend();
  fetchRegionSales();
  fetchCategoryData();
  fetchRealtimeData();
});
onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
  if (realtimeInterval) clearInterval(realtimeInterval);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection
// CSS variable injection end
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'dashboard-screen' },
  ...{ class: { fullscreen: __VLS_ctx.isFullscreen } },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'dashboard-header' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'header-left' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h1,
  __VLS_intrinsicElements.h1,
)({
  ...{ class: 'dashboard-title' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'current-time' },
});
__VLS_ctx.currentTime;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'header-right' },
});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ onClick: {} },
    ...{ class: 'refresh-btn' },
    icon: __VLS_ctx.Refresh,
    circle: true,
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ onClick: {} },
    ...{ class: 'refresh-btn' },
    icon: __VLS_ctx.Refresh,
    circle: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
  onClick: __VLS_ctx.refreshData,
};
var __VLS_3;
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(
  __VLS_8,
  new __VLS_8({
    ...{ onClick: {} },
    ...{ class: 'fullscreen-btn' },
    icon: __VLS_ctx.FullScreen,
    circle: true,
  }),
);
const __VLS_10 = __VLS_9(
  {
    ...{ onClick: {} },
    ...{ class: 'fullscreen-btn' },
    icon: __VLS_ctx.FullScreen,
    circle: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
  onClick: __VLS_ctx.toggleFullscreen,
};
var __VLS_11;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'dashboard-body' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'panel left-panel' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'chart-card' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'chart-title' },
});
const __VLS_16 = {}.VChart;
/** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ // @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(
  __VLS_16,
  new __VLS_16({
    ...{ class: 'chart' },
    option: __VLS_ctx.salesTrendOption,
    autoresize: true,
  }),
);
const __VLS_18 = __VLS_17(
  {
    ...{ class: 'chart' },
    option: __VLS_ctx.salesTrendOption,
    autoresize: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_17),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'chart-card' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'chart-title' },
});
const __VLS_20 = {}.VChart;
/** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    ...{ class: 'chart' },
    option: __VLS_ctx.orderStatsOption,
    autoresize: true,
  }),
);
const __VLS_22 = __VLS_21(
  {
    ...{ class: 'chart' },
    option: __VLS_ctx.orderStatsOption,
    autoresize: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'panel center-panel' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'metrics-row' },
});
for (const [metric, index] of __VLS_getVForSourceType(__VLS_ctx.metrics)) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'metric-item' },
    key: index,
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'metric-value' },
  });
  metric.value;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'metric-label' },
  });
  metric.label;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'metric-trend' },
    ...{ class: metric.trend > 0 ? 'up' : 'down' },
  });
  const __VLS_24 = {}.ElIcon;
  /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
  const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
  const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
  __VLS_27.slots.default;
  const __VLS_28 = {}.ArrowDown;
  /** @type {[typeof __VLS_components.ArrowDown, ]} */ // @ts-ignore
  const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
  const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
  var __VLS_27;
  __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
  Math.abs(metric.trend);
}
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'chart-card map-card' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'chart-title' },
});
const __VLS_32 = {}.VChart;
/** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    ...{ class: 'chart' },
    option: __VLS_ctx.mapOption,
    autoresize: true,
  }),
);
const __VLS_34 = __VLS_33(
  {
    ...{ class: 'chart' },
    option: __VLS_ctx.mapOption,
    autoresize: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'realtime-data' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'realtime-title' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'realtime-items' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'realtime-item' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'realtime-label' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'realtime-value' },
});
__VLS_ctx.realtimeData.currentOrders;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'realtime-item' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'realtime-label' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'realtime-value' },
});
__VLS_ctx.realtimeData.currentUsers;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'realtime-item' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'realtime-label' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'realtime-value' },
});
__VLS_ctx.realtimeData.currentRevenue;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'panel right-panel' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'chart-card' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'chart-title' },
});
const __VLS_36 = {}.VChart;
/** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(
  __VLS_36,
  new __VLS_36({
    ...{ class: 'chart' },
    option: __VLS_ctx.categoryOption,
    autoresize: true,
  }),
);
const __VLS_38 = __VLS_37(
  {
    ...{ class: 'chart' },
    option: __VLS_ctx.categoryOption,
    autoresize: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_37),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'chart-card' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'chart-title' },
});
const __VLS_40 = {}.VChart;
/** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ // @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(
  __VLS_40,
  new __VLS_40({
    ...{ class: 'chart' },
    option: __VLS_ctx.userGrowthOption,
    autoresize: true,
  }),
);
const __VLS_42 = __VLS_41(
  {
    ...{ class: 'chart' },
    option: __VLS_ctx.userGrowthOption,
    autoresize: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_41),
);
/** @type {__VLS_StyleScopedClasses['dashboard-screen']} */ /** @type {__VLS_StyleScopedClasses['dashboard-header']} */ /** @type {__VLS_StyleScopedClasses['header-left']} */ /** @type {__VLS_StyleScopedClasses['dashboard-title']} */ /** @type {__VLS_StyleScopedClasses['current-time']} */ /** @type {__VLS_StyleScopedClasses['header-right']} */ /** @type {__VLS_StyleScopedClasses['refresh-btn']} */ /** @type {__VLS_StyleScopedClasses['fullscreen-btn']} */ /** @type {__VLS_StyleScopedClasses['dashboard-body']} */ /** @type {__VLS_StyleScopedClasses['panel']} */ /** @type {__VLS_StyleScopedClasses['left-panel']} */ /** @type {__VLS_StyleScopedClasses['chart-card']} */ /** @type {__VLS_StyleScopedClasses['chart-title']} */ /** @type {__VLS_StyleScopedClasses['chart']} */ /** @type {__VLS_StyleScopedClasses['chart-card']} */ /** @type {__VLS_StyleScopedClasses['chart-title']} */ /** @type {__VLS_StyleScopedClasses['chart']} */ /** @type {__VLS_StyleScopedClasses['panel']} */ /** @type {__VLS_StyleScopedClasses['center-panel']} */ /** @type {__VLS_StyleScopedClasses['metrics-row']} */ /** @type {__VLS_StyleScopedClasses['metric-item']} */ /** @type {__VLS_StyleScopedClasses['metric-value']} */ /** @type {__VLS_StyleScopedClasses['metric-label']} */ /** @type {__VLS_StyleScopedClasses['metric-trend']} */ /** @type {__VLS_StyleScopedClasses['chart-card']} */ /** @type {__VLS_StyleScopedClasses['map-card']} */ /** @type {__VLS_StyleScopedClasses['chart-title']} */ /** @type {__VLS_StyleScopedClasses['chart']} */ /** @type {__VLS_StyleScopedClasses['realtime-data']} */ /** @type {__VLS_StyleScopedClasses['realtime-title']} */ /** @type {__VLS_StyleScopedClasses['realtime-items']} */ /** @type {__VLS_StyleScopedClasses['realtime-item']} */ /** @type {__VLS_StyleScopedClasses['realtime-label']} */ /** @type {__VLS_StyleScopedClasses['realtime-value']} */ /** @type {__VLS_StyleScopedClasses['realtime-item']} */ /** @type {__VLS_StyleScopedClasses['realtime-label']} */ /** @type {__VLS_StyleScopedClasses['realtime-value']} */ /** @type {__VLS_StyleScopedClasses['realtime-item']} */ /** @type {__VLS_StyleScopedClasses['realtime-label']} */ /** @type {__VLS_StyleScopedClasses['realtime-value']} */ /** @type {__VLS_StyleScopedClasses['panel']} */ /** @type {__VLS_StyleScopedClasses['right-panel']} */ /** @type {__VLS_StyleScopedClasses['chart-card']} */ /** @type {__VLS_StyleScopedClasses['chart-title']} */ /** @type {__VLS_StyleScopedClasses['chart']} */ /** @type {__VLS_StyleScopedClasses['chart-card']} */ /** @type {__VLS_StyleScopedClasses['chart-title']} */ /** @type {__VLS_StyleScopedClasses['chart']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      VChart: VChart,
      Refresh: Refresh,
      FullScreen: FullScreen,
      ArrowDown: ArrowDown,
      isFullscreen: isFullscreen,
      currentTime: currentTime,
      realtimeData: realtimeData,
      metrics: metrics,
      salesTrendOption: salesTrendOption,
      orderStatsOption: orderStatsOption,
      mapOption: mapOption,
      categoryOption: categoryOption,
      userGrowthOption: userGrowthOption,
      refreshData: refreshData,
      toggleFullscreen: toggleFullscreen,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DashboardScreen.vue.js.map

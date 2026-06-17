<template>
  <div class="chart-widget pie-chart-widget">
    <v-chart
      ref="chartRef"
      class="chart"
      :option="chartOption"
      autoresize
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 饼图组件
 * 用于大屏设计器中渲染真实的 ECharts 饼图
 */
import { ref, computed, watch, onMounted } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { fetchDataFromSource } from './data-source-utils';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

// 组件属性定义
interface IWidgetProps {
  config?: {
    title?: string;
    dataSource?: {
      type: 'mock' | 'api';
      url?: string;
      method?: 'GET' | 'POST';
      nameField?: string;
      valueField?: string;
    };
    chartConfig?: Record<string, unknown>;
  };
}

const props = withDefaults(defineProps<IWidgetProps>(), {
  config: () => ({
    title: '饼图',
    dataSource: { type: 'mock' },
    chartConfig: {},
  }),
});

const chartRef = ref();
const chartData = ref<{ name: string; value: number }[]>([]);

// Mock 数据
const mockData = [
  { name: '直接访问', value: 335 },
  { name: '邮件营销', value: 310 },
  { name: '联盟广告', value: 234 },
  { name: '视频广告', value: 135 },
  { name: '搜索引擎', value: 1548 },
];

// 获取数据
const fetchChartData = async () => {
  const dataSource = props.config?.dataSource;
  if (dataSource?.type === 'api' && dataSource.url) {
    try {
      const result = await fetchDataFromSource(dataSource);
      if (result && result.pieData) {
        chartData.value = result.pieData;
      }
    } catch (error) {
      console.error('获取饼图数据失败:', error);
      chartData.value = mockData;
    }
  } else {
    chartData.value = mockData;
  }
};

// 图表配置
const chartOption = computed(() => {
  const colors = ['#00d4ff', '#ffd700', '#00ff88', '#ff6b6b', '#a855f7', '#6366f1'];
  
  const baseOption = {
    title: {
      text: props.config?.title || '饼图',
      textStyle: {
        color: '#00d4ff',
        fontSize: 14,
      },
      left: 'center',
      top: 5,
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#fff' },
      top: 30,
    },
    series: [
      {
        name: '数据',
        type: 'pie',
        radius: '60%',
        center: ['50%', '55%'],
        data: chartData.value.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: colors[index % colors.length],
          },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          show: true,
          color: '#fff',
        },
      },
    ],
  };

  // 合合用户自定义配置
  return { ...baseOption, ...props.config?.chartConfig };
});

// 监听数据源变化
watch(
  () => props.config?.dataSource,
  () => {
    fetchChartData();
  },
  { deep: true }
);

onMounted(() => {
  fetchChartData();
});
</script>

<style scoped lang="scss">
.chart-widget {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
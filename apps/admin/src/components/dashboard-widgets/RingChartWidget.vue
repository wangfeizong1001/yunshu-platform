<template>
  <div class="chart-widget ring-chart-widget">
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
 * 环形图组件
 * 用于大屏设计器中渲染真实的 ECharts 环形图（饼图的变体）
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
    title: '环形图',
    dataSource: { type: 'mock' },
    chartConfig: {},
  }),
});

const chartRef = ref();
const chartData = ref<{ name: string; value: number }[]>([]);

// Mock 数据
const mockData = [
  { name: '产品A', value: 40 },
  { name: '产品B', value: 25 },
  { name: '产品C', value: 20 },
  { name: '产品D', value: 15 },
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
      console.error('获取环形图数据失败:', error);
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
      text: props.config?.title || '环形图',
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
        radius: ['40%', '70%'], // 环形图的关键配置：内外半径
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0a0e27',
          borderWidth: 2,
        },
        data: chartData.value.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: colors[index % colors.length],
          },
        })),
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        label: {
          show: true,
          color: '#fff',
          position: 'outside',
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 212, 255, 0.5)',
          },
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
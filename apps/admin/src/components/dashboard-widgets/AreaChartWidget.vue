<template>
  <div class="chart-widget area-chart-widget">
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
 * 面积图组件
 * 用于大屏设计器中渲染真实的 ECharts 面积图（折线图的变体，带填充区域）
 */
import { ref, computed, watch, onMounted } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import { fetchDataFromSource } from './data-source-utils';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

// 组件属性定义
interface IWidgetProps {
  config?: {
    title?: string;
    dataSource?: {
      type: 'mock' | 'api';
      url?: string;
      method?: 'GET' | 'POST';
      xField?: string;
      yField?: string;
      seriesField?: string;
    };
    chartConfig?: Record<string, unknown>;
  };
}

const props = withDefaults(defineProps<IWidgetProps>(), {
  config: () => ({
    title: '面积图',
    dataSource: { type: 'mock' },
    chartConfig: {},
  }),
});

const chartRef = ref();
const chartData = ref<{ xData: string[]; yData: number[]; seriesData?: Record<string, number[]> }>({
  xData: [],
  yData: [],
});

// Mock 数据
const mockData = {
  xData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  yData: [100, 150, 200, 280, 350, 420, 500],
};

// 获取数据
const fetchChartData = async () => {
  const dataSource = props.config?.dataSource;
  if (dataSource?.type === 'api' && dataSource.url) {
    try {
      const result = await fetchDataFromSource(dataSource);
      if (result) {
        chartData.value = {
          xData: result.xData || [],
          yData: result.yData || [],
          seriesData: result.seriesData,
        };
      }
    } catch (error) {
      console.error('获取面积图数据失败:', error);
      chartData.value = mockData;
    }
  } else {
    chartData.value = mockData;
  }
};

// 图表配置
const chartOption = computed(() => {
  const colors = ['#00d4ff', '#ffd700', '#00ff88', '#ff6b6b', '#a855f7'];
  
  const baseOption = {
    title: {
      text: props.config?.title || '面积图',
      textStyle: {
        color: '#00d4ff',
        fontSize: 14,
      },
      left: 'center',
      top: 5,
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: chartData.value.seriesData ? Object.keys(chartData.value.seriesData) : ['数值'],
      textStyle: { color: '#fff' },
      top: 30,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 60,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.xData,
      axisLine: { lineStyle: { color: '#00d4ff' } },
      axisLabel: { color: '#fff' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#00d4ff' } },
      axisLabel: { color: '#fff' },
      splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.1)' } },
    },
    series: [] as Array<Record<string, unknown>>,
  };

  // 如果有多系列数据
  if (chartData.value.seriesData) {
    Object.entries(chartData.value.seriesData).forEach(([name, data], index) => {
      const color = colors[index % colors.length];
      baseOption.series.push({
        name,
        type: 'line',
        smooth: true,
        data,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color },
        lineStyle: {
          width: 2,
          color,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${color}80` }, // 50% 透明度
              { offset: 1, color: `${color}00` }, // 完全透明
            ],
          },
        },
      });
    });
  } else {
    // 单系列数据
    baseOption.series.push({
      name: '数值',
      type: 'line',
      smooth: true,
      data: chartData.value.yData,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: { color: '#00d4ff' },
      lineStyle: {
        width: 2,
        color: '#00d4ff',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 212, 255, 0.5)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0)' },
          ],
        },
      },
    });
  }

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
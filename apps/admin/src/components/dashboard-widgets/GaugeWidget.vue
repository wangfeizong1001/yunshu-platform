<template>
  <div class="gauge-widget">
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
 * 仪表盘组件
 * 用于大屏设计器中渲染真实的 ECharts 仪表盘
 */
import { ref, computed, watch, onMounted } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { fetchDataFromSource } from './data-source-utils';

use([
  CanvasRenderer,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
]);

// 组件属性定义
interface IWidgetProps {
  config?: {
    title?: string;
    dataSource?: {
      type: 'mock' | 'api';
      url?: string;
      method?: 'GET' | 'POST';
      valueField?: string;
    };
    chartConfig?: Record<string, unknown>;
    min?: number;
    max?: number;
  };
}

const props = withDefaults(defineProps<IWidgetProps>(), {
  config: () => ({
    title: '仪表盘',
    dataSource: { type: 'mock' },
    min: 0,
    max: 100,
    chartConfig: {},
  }),
});

const chartRef = ref();
const gaugeValue = ref(75);

// 获取数据
const fetchGaugeData = async () => {
  const dataSource = props.config?.dataSource;
  if (dataSource?.type === 'api' && dataSource.url) {
    try {
      const result = await fetchDataFromSource(dataSource);
      if (result && result.gaugeValue !== undefined) {
        gaugeValue.value = result.gaugeValue;
      }
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
      gaugeValue.value = 75;
    }
  } else {
    gaugeValue.value = 75;
  }
};

// 图表配置
const chartOption = computed(() => {
  const baseOption = {
    title: {
      text: props.config?.title || '仪表盘',
      textStyle: {
        color: '#00d4ff',
        fontSize: 14,
      },
      left: 'center',
      top: 5,
    },
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '80%',
        min: props.config?.min || 0,
        max: props.config?.max || 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.3, '#ff6b6b'],
              [0.7, '#ffd700'],
              [1, '#00ff88'],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: '#00d4ff',
          },
        },
        axisTick: {
          distance: -20,
          length: 8,
          lineStyle: {
            color: '#fff',
            width: 2,
          },
        },
        splitLine: {
          distance: -20,
          length: 30,
          lineStyle: {
            color: '#fff',
            width: 4,
          },
        },
        axisLabel: {
          color: '#fff',
          distance: 40,
          fontSize: 12,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: '#00d4ff',
          fontSize: 20,
          offsetCenter: [0, '70%'],
        },
        data: [
          {
            value: gaugeValue.value,
            name: '完成率',
            itemStyle: {
              color: '#00d4ff',
            },
          },
        ],
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
    fetchGaugeData();
  },
  { deep: true }
);

onMounted(() => {
  fetchGaugeData();
});
</script>

<style scoped lang="scss">
.gauge-widget {
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
<template>
  <div class="dashboard-preview">
    <!-- 顶部标题栏 -->
    <div class="preview-header">
      <h1 class="preview-title">{{ name }}</h1>
      <div class="current-time">{{ currentTime }}</div>
    </div>

    <!-- 主体内容 -->
    <div class="preview-body">
      <div
        v-for="widget in widgets"
        :key="widget.id"
        class="preview-widget"
        :style="getWidgetStyle(widget)"
      >
        <div class="widget-title">{{ widget.name }}</div>
        <div class="widget-content">
          <component :is="getWidgetComponent(widget.type)" :config="widget.config" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 大屏预览组件
 * 用于在设计器中预览配置好的大屏效果
 */
import { ref, onMounted, onUnmounted } from 'vue';
import {
  LineChartWidget,
  BarChartWidget,
  PieChartWidget,
  RingChartWidget,
  AreaChartWidget,
  GaugeWidget,
  TableWidget,
  TextWidget,
  ImageWidget,
} from '@/components/dashboard-widgets';

// 组件属性定义
interface IWidget {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: string;
  borderColor?: string;
  config: Record<string, unknown>;
}

interface IProps {
  widgets: IWidget[];
  name: string;
}

const props = defineProps<IProps>();

const currentTime = ref('');
let timeInterval: ReturnType<typeof setInterval> | null = null;

// 获取组件样式
const getWidgetStyle = (widget: IWidget) => {
  return {
    left: `${widget.x}px`,
    top: `${widget.y}px`,
    width: `${widget.width}px`,
    height: `${widget.height}px`,
    backgroundColor: widget.backgroundColor || 'rgba(0, 102, 255, 0.1)',
    borderColor: widget.borderColor || '#00d4ff',
  };
};

// 获取组件渲染器
const getWidgetComponent = (type: string) => {
  const componentMap: Record<string, unknown> = {
    line: LineChartWidget,
    bar: BarChartWidget,
    pie: PieChartWidget,
    ring: RingChartWidget,
    area: AreaChartWidget,
    gauge: GaugeWidget,
    table: TableWidget,
    text: TextWidget,
    image: ImageWidget,
  };
  return componentMap[type] || 'div';
};

// 更新时间
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

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped lang="scss">
/* 大屏预览深色主题 */
.dashboard-preview {
  --screen-primary: #00d4ff;
  --screen-secondary: #ffd700;
  --screen-success: #00ff88;
  --screen-danger: #ff6b6b;
  --screen-accent: #a855f7;
  --screen-deep: #0a0e27;
  --screen-deep-light: #1a1f3a;

  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--screen-deep) 0%, var(--screen-deep-light) 50%, var(--screen-deep) 100%);
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 25px;
  background: linear-gradient(90deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 50%, rgba(0, 102, 255, 0.1) 100%);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;

  .preview-title {
    margin: 0;
    font-size: 28px;
    font-weight: bold;
    color: var(--screen-primary);
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  }

  .current-time {
    font-size: 16px;
    color: #fff;
    opacity: 0.8;
  }
}

.preview-body {
  position: relative;
  height: calc(100% - 80px);
}

.preview-widget {
  position: absolute;
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;

  .widget-title {
    padding: 10px 15px;
    background: rgba(0, 212, 255, 0.2);
    color: var(--screen-primary);
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  }

  .widget-content {
    height: calc(100% - 40px);
    padding: 5px;
  }
}
</style>
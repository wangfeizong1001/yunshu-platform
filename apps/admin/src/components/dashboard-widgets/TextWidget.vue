<template>
  <div class="text-widget" :style="textStyle">
    <div v-if="config?.content" class="text-content">{{ config.content }}</div>
    <div v-else class="text-placeholder">文本内容</div>
  </div>
</template>

<script setup lang="ts">
/**
 * 文本组件
 * 用于大屏设计器中显示自定义文本内容
 */
import { computed } from 'vue';

// 组件属性定义
interface IWidgetProps {
  config?: {
    content?: string;
    fontSize?: number;
    fontColor?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    backgroundColor?: string;
  };
}

const props = withDefaults(defineProps<IWidgetProps>(), {
  config: () => ({
    content: '文本内容',
    fontSize: 16,
    fontColor: '#00d4ff',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 102, 255, 0.1)',
  }),
});

// 文本样式
const textStyle = computed(() => {
  return {
    fontSize: `${props.config?.fontSize || 16}px`,
    color: props.config?.fontColor || '#00d4ff',
    fontWeight: props.config?.fontWeight || 'normal',
    textAlign: props.config?.textAlign || 'center',
    backgroundColor: props.config?.backgroundColor || 'rgba(0, 102, 255, 0.1)',
  };
});
</script>

<style scoped lang="scss">
.text-widget {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 4px;
}

.text-content {
  width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.text-placeholder {
  color: rgba(0, 212, 255, 0.5);
}
</style>
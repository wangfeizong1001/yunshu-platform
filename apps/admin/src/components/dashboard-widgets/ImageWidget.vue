<template>
  <div class="image-widget">
    <div v-if="config?.imageUrl" class="image-container">
      <img :src="config.imageUrl" :alt="config.alt || '图片'" class="image-content" :style="imageStyle" />
    </div>
    <div v-else class="image-placeholder">
      <el-icon :size="48"><Picture /></el-icon>
      <span>图片占位</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 图片组件
 * 用于大屏设计器中显示图片
 */
import { computed } from 'vue';
import { Picture } from '@element-plus/icons-vue';

// 组件属性定义
interface IWidgetProps {
  config?: {
    imageUrl?: string;
    alt?: string;
    fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    backgroundColor?: string;
  };
}

const props = withDefaults(defineProps<IWidgetProps>(), {
  config: () => ({
    imageUrl: '',
    alt: '图片',
    fit: 'contain',
    backgroundColor: 'rgba(0, 102, 255, 0.1)',
  }),
});

// 图片样式
const imageStyle = computed(() => {
  return {
    objectFit: props.config?.fit || 'contain',
  };
});
</script>

<style scoped lang="scss">
.image-widget {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 102, 255, 0.1);
  border-radius: 4px;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-content {
  max-width: 100%;
  max-height: 100%;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(0, 212, 255, 0.5);
}
</style>
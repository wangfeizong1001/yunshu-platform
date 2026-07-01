<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>图片组件</h1>
      <p>用于大屏展示的图片组件</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>基本图片</h2>
        <p>展示图片内容</p>
      </div>
      <div class="demo-content dark-bg">
        <div class="image-widget">
          <img :src="defaultImage" alt="示例图片" class="preview-image" />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带边框</h2>
        <p>带边框装饰的图片</p>
      </div>
      <div class="demo-content dark-bg">
        <div class="image-widget bordered">
          <div class="image-wrapper">
            <img :src="defaultImage" alt="示例图片" class="preview-image" />
            <div class="image-overlay">
              <span class="image-title">企业 LOGO</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>轮播图</h2>
        <p>多张图片自动轮播</p>
      </div>
      <div class="demo-content dark-bg">
        <div class="image-widget carousel">
          <div class="carousel-wrapper">
            <div class="carousel-slide" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div v-for="(img, index) in carouselImages" :key="index" class="carousel-item">
                <img :src="img" alt="轮播图片" />
              </div>
            </div>
          </div>
          <div class="carousel-indicators">
            <span
              v-for="(_, index) in carouselImages"
              :key="index"
              class="indicator"
              :class="{ active: index === currentSlide }"
              @click="currentSlide = index"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>动态背景</h2>
        <p>带渐变背景的图片展示</p>
      </div>
      <div class="demo-content dark-bg">
        <div class="image-widget gradient">
          <div class="gradient-wrapper">
            <img :src="defaultImage" alt="示例图片" class="preview-image" />
            <div class="gradient-overlay" />
          </div>
          <div class="gradient-content">
            <div class="gradient-title">智能数据中心</div>
            <div class="gradient-desc">实时监控 · 智能分析 · 精准决策</div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>自定义属性</h2>
        <p>实时调整图片样式</p>
      </div>
      <div class="demo-content">
        <div class="props-panel">
          <div class="prop-item">
            <span class="prop-label">圆角</span>
            <el-slider v-model="borderRadius" :min="0" :max="50" />
          </div>
          <div class="prop-item">
            <span class="prop-label">透明度</span>
            <el-slider v-model="opacity" :min="10" :max="100" />
          </div>
          <div class="prop-item">
            <span class="prop-label">适应方式</span>
            <el-select v-model="fit" class="prop-select">
              <el-option label="填充" value="cover" />
              <el-option label="包含" value="contain" />
              <el-option label="拉伸" value="100% 100%" />
            </el-select>
          </div>
        </div>
        <div class="image-preview dark-bg">
          <div class="image-widget custom">
            <img
              :src="defaultImage"
              alt="示例图片"
              class="preview-image"
              :style="{
                borderRadius: borderRadius + 'px',
                opacity: opacity / 100
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const defaultImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800';

const carouselImages = [
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800',
];

const currentSlide = ref(0);
const borderRadius = ref(8);
const opacity = ref(100);
const fit = ref('cover');

let carouselTimer: ReturnType<typeof setInterval>;

onMounted(() => {
  carouselTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselImages.length;
  }, 3000);
});

onUnmounted(() => {
  clearInterval(carouselTimer);
});
</script>

<style lang="scss" scoped>
.demo-page {
  max-width: 1000px;
}

.demo-header {
  margin-bottom: 40px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #303133;
    margin-bottom: 8px;

    .dark & {
      color: #fff;
    }
  }

  p {
    font-size: 14px;
    color: #909399;

    .dark & {
      color: #c0c4cc;
    }
  }
}

.demo-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;

  .dark & {
    background: #2d3748;
    border-color: #4a5568;
  }
}

.section-header {
  margin-bottom: 20px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 4px;

    .dark & {
      color: #fff;
    }
  }

  p {
    font-size: 13px;
    color: #909399;

    .dark & {
      color: #c0c4cc;
    }
  }
}

.demo-content {
  padding: 16px;
  border-radius: 8px;

  &.dark-bg {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }
}

.image-widget {
  &.bordered {
    padding: 16px;
    background: rgba(74, 158, 255, 0.1);
    border-radius: 12px;
    border: 1px solid rgba(74, 158, 255, 0.3);
  }

  &.carousel {
    position: relative;
  }

  &.gradient {
    position: relative;
    overflow: hidden;
  }

  &.custom {
    display: flex;
    justify-content: center;
  }
}

.preview-image {
  width: 100%;
  display: block;
}

.image-wrapper {
  position: relative;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.image-title {
  color: #fff;
  font-size: 14px;
}

.carousel-wrapper {
  overflow: hidden;
  border-radius: 8px;
}

.carousel-slide {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-item {
  flex: 0 0 100%;
  height: 200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: #4a9eff;
    width: 24px;
    border-radius: 4px;
  }
}

.gradient-wrapper {
  position: relative;
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(74, 158, 255, 0.3) 0%, rgba(44, 122, 214, 0.3) 100%);
}

.gradient-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
}

.gradient-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.gradient-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.image-preview {
  padding: 24px;
  border-radius: 8px;
  margin-top: 20px;
}

.props-panel {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.prop-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prop-label {
  font-size: 14px;
  color: #606266;

  .dark & {
    color: #c0c4cc;
  }
}

.prop-select {
  width: 100px;
}
</style>

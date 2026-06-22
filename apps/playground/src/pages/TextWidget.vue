<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>文本组件</h1>
      <p>用于大屏展示的文本组件</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>标题文本</h2>
        <p>大标题展示</p>
      </div>
      <div class="demo-content dark-bg">
        <div class="text-widget">
          <div class="text-title" :style="{ fontSize: titleSize + 'px' }">
            {{ titleText }}
          </div>
          <div class="text-subtitle">
            云枢中台数据看板
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>数字文本</h2>
        <p>突出显示关键数据</p>
      </div>
      <div class="demo-content dark-bg">
        <div class="text-widget">
          <div class="number-display">
            <span class="number-prefix">¥</span>
            <span class="number-value" :style="{ color: numberColor }">
              {{ formattedNumber }}
            </span>
            <span class="number-suffix">万</span>
          </div>
          <div class="number-label">本月销售额</div>
          <div class="number-trend">
            <span class="trend-up">↑ 12.5%</span>
            <span class="trend-text">较上月</span>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>滚动文本</h2>
        <p>滚动展示的跑马灯效果</p>
      </div>
      <div class="demo-content dark-bg">
        <div class="text-widget">
          <div class="marquee-wrapper">
            <div class="marquee-content" :style="{ animationDuration: marqueeDuration + 's' }">
              <span class="marquee-text">{{ marqueeText }}</span>
              <span class="marquee-text">{{ marqueeText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>富文本</h2>
        <p>混合文本样式</p>
      </div>
      <div class="demo-content dark-bg">
        <div class="text-widget">
          <div class="rich-text">
            <div class="rich-item">
              <span class="rich-label">今日访问：</span>
              <span class="rich-value primary">{{ visitCount }}</span>
              <span class="rich-unit">人次</span>
            </div>
            <div class="rich-item">
              <span class="rich-label">在线用户：</span>
              <span class="rich-value success">{{ onlineCount }}</span>
              <span class="rich-unit">人</span>
            </div>
            <div class="rich-item">
              <span class="rich-label">订单总额：</span>
              <span class="rich-value warning">{{ orderAmount }}</span>
              <span class="rich-unit">元</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>自定义属性</h2>
        <p>实时调整文本样式</p>
      </div>
      <div class="demo-content">
        <div class="props-panel">
          <div class="prop-item">
            <span class="prop-label">字体大小</span>
            <el-slider v-model="titleSize" :min="20" :max="60" />
          </div>
          <div class="prop-item">
            <span class="prop-label">文本颜色</span>
            <el-color-picker v-model="textColor" />
          </div>
          <div class="prop-item">
            <span class="prop-label">对齐方式</span>
            <el-select v-model="textAlign" class="prop-select">
              <el-option label="左对齐" value="left" />
              <el-option label="居中" value="center" />
              <el-option label="右对齐" value="right" />
            </el-select>
          </div>
        </div>
        <div class="text-preview dark-bg">
          <div
            class="text-widget"
            :style="{
              fontSize: titleSize + 'px',
              color: textColor,
              textAlign: textAlign as 'left' | 'center' | 'right'
            }"
          >
            {{ titleText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const titleText = ref('销售数据概览');
const titleSize = ref(36);
const textColor = ref('#ffffff');
const textAlign = ref('center');
const numberColor = ref('#4a9eff');
const numberValue = ref(12345678);
const marqueeText = ref('欢迎使用云枢中台系统，祝您工作愉快！  •  •  •  ');
const marqueeDuration = ref(10);

const formattedNumber = computed(() => {
  return (numberValue.value / 10000).toFixed(2);
});

const visitCount = ref('125,680');
const onlineCount = ref('3,542');
const orderAmount = ref('¥2,568,900');
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

.text-widget {
  padding: 24px;
}

.text-title {
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 8px;
}

.text-subtitle {
  font-size: 14px;
  color: #909399;
  text-align: center;
}

.number-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.number-prefix {
  font-size: 24px;
  color: #909399;
}

.number-value {
  font-size: 56px;
  font-weight: 700;
  font-family: 'Monaco', monospace;
}

.number-suffix {
  font-size: 20px;
  color: #909399;
}

.number-label {
  text-align: center;
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}

.number-trend {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.trend-up {
  color: #67c23a;
  font-size: 14px;
  font-weight: 600;
}

.trend-text {
  color: #909399;
  font-size: 12px;
}

.marquee-wrapper {
  overflow: hidden;
  white-space: nowrap;
}

.marquee-content {
  display: inline-flex;
  animation: marquee linear infinite;
}

.marquee-text {
  padding-right: 50px;
  color: #4a9eff;
  font-size: 16px;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.rich-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rich-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.rich-label {
  font-size: 14px;
  color: #909399;
}

.rich-value {
  font-size: 24px;
  font-weight: 700;
  font-family: 'Monaco', monospace;

  &.primary {
    color: #4a9eff;
  }

  &.success {
    color: #67c23a;
  }

  &.warning {
    color: #e6a23c;
  }
}

.rich-unit {
  font-size: 12px;
  color: #909399;
}

.text-preview {
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

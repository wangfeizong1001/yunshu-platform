<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>数据表格</h1>
      <p>用于大屏展示的表格组件</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>基本表格</h2>
        <p>用于展示数据的表格</p>
      </div>
      <div class="demo-content">
        <div class="table-widget">
          <div class="table-header">
            <div class="header-cell">排名</div>
            <div class="header-cell">姓名</div>
            <div class="header-cell">销售额</div>
            <div class="header-cell">订单数</div>
          </div>
          <div class="table-body">
            <div v-for="(row, index) in tableData" :key="index" class="table-row">
              <div class="body-cell">
                <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
              </div>
              <div class="body-cell">{{ row.name }}</div>
              <div class="body-cell">{{ row.sales }}</div>
              <div class="body-cell">{{ row.orders }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带边框表格</h2>
        <p>显示边框的表格</p>
      </div>
      <div class="demo-content">
        <div class="table-widget bordered">
          <div class="table-header">
            <div class="header-cell">日期</div>
            <div class="header-cell">访问量</div>
            <div class="header-cell">下单量</div>
            <div class="header-cell">转化率</div>
          </div>
          <div class="table-body">
            <div v-for="(row, index) in statsData" :key="index" class="table-row">
              <div class="body-cell">{{ row.date }}</div>
              <div class="body-cell highlight">{{ row.visits }}</div>
              <div class="body-cell success">{{ row.orders }}</div>
              <div class="body-cell">{{ row.rate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>滚动表格</h2>
        <p>自动滚动的数据表格</p>
      </div>
      <div class="demo-content">
        <div class="table-widget scrollable">
          <div class="table-header">
            <div class="header-cell">排名</div>
            <div class="header-cell">姓名</div>
            <div class="header-cell">销售额</div>
          </div>
          <div class="table-body-wrapper" ref="tableWrapper">
            <div class="table-body" :style="{ animationDuration: scrollDuration }">
              <div v-for="(row, index) in scrollData" :key="'scroll-' + index" class="table-row">
                <div class="body-cell">
                  <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
                </div>
                <div class="body-cell">{{ row.name }}</div>
                <div class="body-cell highlight">{{ row.sales }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>自定义属性</h2>
        <p>实时调整表格属性</p>
      </div>
      <div class="demo-content">
        <div class="props-panel">
          <div class="prop-item">
            <span class="prop-label">显示边框</span>
            <el-switch v-model="showBorder" />
          </div>
          <div class="prop-item">
            <span class="prop-label">斑马纹</span>
            <el-switch v-model="showStripe" />
          </div>
          <div class="prop-item">
            <span class="prop-label">自动滚动</span>
            <el-switch v-model="autoScroll" />
          </div>
          <div class="prop-item">
            <span class="prop-label">行数</span>
            <el-slider v-model="rowCount" :min="3" :max="10" />
          </div>
        </div>
        <div class="table-widget" :class="{ bordered: showBorder, striped: showStripe }">
          <div class="table-header">
            <div class="header-cell">排名</div>
            <div class="header-cell">姓名</div>
            <div class="header-cell">销售额</div>
          </div>
          <div class="table-body-wrapper" v-if="autoScroll" ref="tableWrapper">
            <div class="table-body" :style="{ animationDuration: scrollDuration }">
              <div v-for="(row, index) in displayData" :key="'scroll-' + index" class="table-row">
                <div class="body-cell">
                  <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
                </div>
                <div class="body-cell">{{ row.name }}</div>
                <div class="body-cell highlight">{{ row.sales }}</div>
              </div>
            </div>
          </div>
          <div class="table-body" v-else>
            <div v-for="(row, index) in displayData" :key="index" class="table-row">
              <div class="body-cell">
                <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
              </div>
              <div class="body-cell">{{ row.name }}</div>
              <div class="body-cell highlight">{{ row.sales }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const tableData = ref([
  { name: '张三', sales: '¥1,250,000', orders: 856 },
  { name: '李四', sales: '¥980,000', orders: 720 },
  { name: '王五', sales: '¥876,000', orders: 650 },
  { name: '赵六', sales: '¥765,000', orders: 580 },
  { name: '钱七', sales: '¥654,000', orders: 490 },
]);

const statsData = ref([
  { date: '2026-06-01', visits: '12,580', orders: '856', rate: '6.8%' },
  { date: '2026-06-02', visits: '15,230', orders: '1,024', rate: '6.7%' },
  { date: '2026-06-03', visits: '18,450', orders: '1,356', rate: '7.3%' },
  { date: '2026-06-04', visits: '16,890', orders: '1,128', rate: '6.7%' },
  { date: '2026-06-05', visits: '14,320', orders: '956', rate: '6.7%' },
]);

const scrollData = ref([
  { name: '张三', sales: '¥1,250,000' },
  { name: '李四', sales: '¥980,000' },
  { name: '王五', sales: '¥876,000' },
  { name: '赵六', sales: '¥765,000' },
  { name: '钱七', sales: '¥654,000' },
  { name: '孙八', sales: '¥543,000' },
  { name: '周九', sales: '¥432,000' },
]);

const showBorder = ref(false);
const showStripe = ref(false);
const autoScroll = ref(true);
const rowCount = ref(5);
const scrollDuration = ref('8s');

const displayData = computed(() => {
  return tableData.value.slice(0, rowCount.value);
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
  background: #1a1a2e;
  border-radius: 8px;
}

.table-widget {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;

  &.bordered {
    .header-cell,
    .body-cell {
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  &.striped {
    .table-row:nth-child(even) {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &.scrollable {
    height: 200px;
    overflow: hidden;
  }
}

.table-header {
  display: flex;
  background: linear-gradient(90deg, rgba(74, 158, 255, 0.3) 0%, rgba(44, 122, 214, 0.3) 100%);
}

.header-cell {
  flex: 1;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-align: center;
}

.table-body-wrapper {
  height: 200px;
  overflow: hidden;
}

.table-body {
  display: flex;
  flex-direction: column;
  animation: scroll-up linear infinite;

  &.scroll {
    animation-duration: v-bind(scrollDuration);
  }
}

@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.table-row {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.body-cell {
  flex: 1;
  padding: 12px 16px;
  font-size: 14px;
  color: #e4e7ed;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  &.highlight {
    color: #4a9eff;
    font-weight: 600;
  }

  &.success {
    color: #67c23a;
  }
}

.rank {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  &.top {
    background: linear-gradient(135deg, #4a9eff 0%, #2c7ad6 100%);
    color: #fff;
  }
}

.props-panel {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.prop-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prop-label {
  font-size: 14px;
  color: #c0c4cc;
}
</style>

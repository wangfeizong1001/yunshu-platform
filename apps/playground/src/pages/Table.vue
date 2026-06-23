<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>Table 表格</h1>
      <p>表格用于展示多条结构类似的数据</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>基本用法</h2>
        <p>简单的表格展示</p>
      </div>
      <div class="demo-content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="address" label="地址" />
        </el-table>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带边框</h2>
        <p>使用 border 属性添加边框</p>
      </div>
      <div class="demo-content">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="address" label="地址" />
        </el-table>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>斑马纹</h2>
        <p>使用 stripe 属性添加斑马纹</p>
      </div>
      <div class="demo-content">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="address" label="地址" />
        </el-table>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带排序</h2>
        <p>使用 sortable 属性开启列排序</p>
      </div>
      <div class="demo-content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" sortable />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="address" label="地址" />
        </el-table>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带筛选</h2>
        <p>使用 filters 属性开启列筛选</p>
      </div>
      <div class="demo-content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" />
          <el-table-column
            prop="name"
            label="姓名"
            :filters="[{ text: '张三', value: '张三' }, { text: '李四', value: '李四' }]"
            filter-placement="bottom-start"
          />
          <el-table-column prop="address" label="地址" />
        </el-table>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带分页</h2>
        <p>配合分页组件使用</p>
      </div>
      <div class="demo-content">
        <el-table :data="pagedData" style="width: 100%">
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="address" label="地址" />
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[5, 10, 20]"
            layout="total, sizes, prev, pager, next, jumper"
          />
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
            <span class="prop-label">边框</span>
            <el-switch v-model="tableBorder" />
          </div>
          <div class="prop-item">
            <span class="prop-label">斑马纹</span>
            <el-switch v-model="tableStripe" />
          </div>
          <div class="prop-item">
            <span class="prop-label">居中</span>
            <el-switch v-model="tableCenter" />
          </div>
        </div>
        <el-table
          :data="tableData"
          :border="tableBorder"
          :stripe="tableStripe"
          :text-center="tableCenter"
          style="width: 100%"
        >
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="address" label="地址" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const tableData = ref([
  { date: '2026-06-01', name: '张三', address: '北京市朝阳区' },
  { date: '2026-06-02', name: '李四', address: '上海市浦东新区' },
  { date: '2026-06-03', name: '王五', address: '广州市天河区' },
  { date: '2026-06-04', name: '赵六', address: '深圳市南山区' },
  { date: '2026-06-05', name: '钱七', address: '杭州市西湖区' },
]);

const currentPage = ref(1);
const pageSize = ref(5);
const total = ref(5);

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

const tableBorder = ref(false);
const tableStripe = ref(false);
const tableCenter = ref(false);
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
  background: #f5f7fa;
  border-radius: 8px;

  .dark & {
    background: #1a202c;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
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
  color: #606266;
  min-width: 60px;

  .dark & {
    color: #c0c4cc;
  }
}

.prop-select {
  width: 120px;
}
</style>

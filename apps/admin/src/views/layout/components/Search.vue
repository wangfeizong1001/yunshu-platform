<template>
  <div class="search-container">
    <el-icon :size="20" @click="handleSearch">
      <Search />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const handleSearch = () => {
  ElMessage.info('搜索功能开发中...')
}
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  color: #5a5e66;
  transition: color 0.3s;

  &:hover {
    color: #409eff;
  }
}
</style>

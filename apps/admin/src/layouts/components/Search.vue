<template>
  <div class="search-container" @click="openSearch">
    <el-icon :size="size">
      <Search />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
const size = 20

const openSearch = () => {
  // TODO: 打开搜索面板
}
</script>

<style lang="scss" scoped>
.search-container {
  cursor: pointer;
  color: #666;
  transition: color $transition-duration $transition-function;

  &:hover {
    color: #409eff;
  }
}
</style>

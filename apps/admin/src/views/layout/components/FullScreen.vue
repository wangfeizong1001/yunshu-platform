<template>
  <div class="fullscreen" @click="toggle">
    <el-icon :size="20">
      <FullScreen />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
  import { FullScreen } from '@element-plus/icons-vue';

  const toggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .fullscreen {
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

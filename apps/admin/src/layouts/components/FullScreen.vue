<template>
  <el-icon :size="size" class="fullscreen-icon" @click="toggle">
    <FullScreen v-if="!isFullscreen" />
    <Rank v-else />
  </el-icon>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';

  const size = 20;
  const isFullscreen = ref(false);

  const toggle = () => {
    if (isFullscreen.value) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleChange = () => {
    isFullscreen.value = !!document.fullscreenElement;
  };

  onMounted(() => {
    document.addEventListener('fullscreenchange', handleChange);
  });

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleChange);
  });
</script>

<style lang="scss" scoped>
  .fullscreen-icon {
    cursor: pointer;
    color: #666;
    transition: color $transition-duration $transition-function;

    &:hover {
      color: #409eff;
    }
  }
</style>

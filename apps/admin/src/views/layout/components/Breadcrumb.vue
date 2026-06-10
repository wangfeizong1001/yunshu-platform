<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
        <span v-if="item.meta?.title">{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const breadcrumbs = computed(() => {
    return route.matched.filter((item) => {
      return item.meta && item.meta.title;
    });
  });
</script>

<style lang="scss" scoped>
  .breadcrumb-container {
    display: flex;
    align-items: center;
  }
</style>

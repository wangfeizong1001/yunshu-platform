<template>
  <div class="job-log-drawer">
    <slot />
  </div>
</template>

<script setup lang="ts">
  defineOptions({
    name: 'JobLogDrawer',
  });
</script>

<style lang="scss" scoped>
  .job-log-drawer {
    height: 100%;
  }
</style>

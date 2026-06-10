<template>
  <div class="hamburger" @click="toggle">
    <el-icon :size="20">
      <Expand v-if="isActive" />
      <Fold v-else />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
  import { Expand, Fold } from '@element-plus/icons-vue';

  defineProps<{
    isActive: boolean;
  }>();

  const emit = defineEmits<{
    toggle: [];
  }>();

  const toggle = () => {
    emit('toggle');
  };
</script>

<style lang="scss" scoped>
  .hamburger {
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

<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(match, index) in matches" :key="match.path">
        <span v-if="index === matches.length - 1" class="breadcrumb-current">
          {{ match.meta?.title || '未命名' }}
        </span>
        <router-link v-else :to="match.path">
          {{ match.meta?.title || '未命名' }}
        </router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const matches = computed(() => {
  return route.matched.filter((item) => item.meta?.title)
})
</script>

<style lang="scss" scoped>
.breadcrumb {
  font-size: 14px;

  :deep(.el-breadcrumb__inner) {
    a {
      color: #606266;
      font-weight: normal;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .breadcrumb-current {
    color: #303133;
    font-weight: 500;
  }
}
</style>

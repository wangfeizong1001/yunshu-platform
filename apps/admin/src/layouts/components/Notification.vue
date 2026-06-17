<template>
  <el-badge :value="count" :hidden="count === 0" :max="99" class="notification-badge">
    <el-icon :size="size" class="notification-icon" @click="openNotification">
      <Bell />
    </el-icon>
  </el-badge>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const size = 20
const count = ref(3)

const openNotification = () => {
  // TODO: 打开通知面板
}
</script>

<style lang="scss" scoped>
.notification-badge {
  cursor: pointer;
}

.notification-icon {
  color: #666;
  transition: color $transition-duration $transition-function;

  &:hover {
    color: #409eff;
  }
}
</style>

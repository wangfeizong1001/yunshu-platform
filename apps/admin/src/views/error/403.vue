<template>
  <div class="error-page">
    <el-result icon="warning" title="403" sub-title="抱歉，您无权访问此页面">
      <template #extra>
        <el-button type="primary" @click="goHome">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() { router.push('/') }
</script>
<style scoped lang="scss">
.error-page {
  display: flex; align-items: center; justify-content: center;
  height: 100vh; background: var(--el-fill-color-light);
}
</style>

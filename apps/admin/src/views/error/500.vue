<template>
  <div class="error-page">
    <el-result icon="error" title="500" sub-title="服务器开小差了，请稍后再试">
      <template #extra>
        <el-button type="primary" @click="reload">重新加载</el-button>
        <el-button @click="goHome">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() { router.push('/') }
function reload() { window.location.reload() }
</script>
<style scoped lang="scss">
.error-page {
  display: flex; align-items: center; justify-content: center;
  height: 100vh; background: var(--el-fill-color-light);
}
</style>

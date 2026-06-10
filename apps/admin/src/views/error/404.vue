<template>
  <div class="error-page">
    <el-result icon="error" title="404" sub-title="抱歉，您访问的页面不存在">
      <template #extra>
        <el-button type="primary" @click="goHome">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const router = useRouter();

  function goHome() {
    router.push('/');
  }
</script>

<style scoped lang="scss">
  .error-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f2f5;
  }
</style>

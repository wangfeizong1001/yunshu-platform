<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePermissionStore } from '@/store/modules/permission'

const permissionStore = usePermissionStore()

// 初始化权限信息
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      await permissionStore.generateRoutes()
    } catch (error) {
      console.error('获取权限信息失败', error)
    }
  }
})
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}
</style>

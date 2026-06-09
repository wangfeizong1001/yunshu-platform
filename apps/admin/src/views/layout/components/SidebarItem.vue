<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="false"
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409EFF"
  >
    <template v-for="item in item.children" :key="item.path">
      <!-- 有子菜单 -->
      <el-sub-menu v-if="hasOneShowingChild(item) && item.children" :index="resolvePath(item.path)">
        <template #title>
          <el-icon v-if="item.meta?.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ item.meta?.title || item.menuName }}</span>
        </template>

        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :base-path="resolvePath(item.path)"
        />
      </el-sub-menu>

      <!-- 没有子菜单 -->
      <el-menu-item
        v-else
        :index="resolvePath(item.path)"
        @click="handleRoute(item)"
      >
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ item.meta?.title || item.menuName }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import path from 'path-browserify'

interface MenuItem {
  path: string
  menuName?: string
  meta?: {
    title?: string
    icon?: string
    hidden?: boolean
  }
  children?: MenuItem[]
}

const props = defineProps<{
  item: MenuItem
  basePath: string
}>()

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => {
  return route.path
})

// 判断是否有且只有一个显示的子菜单
const hasOneShowingChild = (item: MenuItem) => {
  if (!item.children) return false

  const showingChildren = item.children.filter((child: any) => {
    return !child.meta?.hidden
  })

  return showingChildren.length === 1
}

// 解析路由路径
const resolvePath = (routePath: string) => {
  return path.resolve(props.basePath, routePath)
}

// 路由跳转
const handleRoute = (item: MenuItem) => {
  router.push(resolvePath(item.path))
}
</script>

<style lang="scss" scoped>
.el-menu {
  border: none;
}
</style>

<template>
  <div>
    <template v-for="item in item.children" :key="item.path">
      <!-- 有子菜单 -->
      <el-sub-menu v-if="item.children && item.children.length > 0" :index="resolvePath(item.path)">
        <template #title>
          <el-icon v-if="item.meta?.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </template>
        <SidebarItem :item="item" :base-path="resolvePath(item.path)" />
      </el-sub-menu>

      <!-- 无子菜单 -->
      <el-menu-item v-else :index="resolvePath(item.path)">
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ item.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { isExternal } from '@/utils'

interface Props {
  item: any
  basePath: string
}

const props = defineProps<Props>()

const resolvePath = (childPath: string) => {
  if (isExternal(childPath)) {
    return childPath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  const path = `${props.basePath}/${childPath}`.replace(/\/+/g, '/')
  return path
}
</script>

<style lang="scss" scoped></style>

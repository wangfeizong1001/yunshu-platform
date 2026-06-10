<template>
  <div>
    <template v-for="child in itemChildren" :key="child.path">
      <el-sub-menu
        v-if="child.children && child.children.length > 0"
        :index="resolvePath(child.path)"
      >
        <template #title>
          <el-icon v-if="child.meta?.icon">
            <component :is="child.meta.icon" />
          </el-icon>
          <span>{{ child.meta?.title }}</span>
        </template>
        <SidebarItem :item="child" :base-path="resolvePath(child.path)" />
      </el-sub-menu>

      <el-menu-item v-else :index="resolvePath(child.path)">
        <el-icon v-if="child.meta?.icon">
          <component :is="child.meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ child.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { isExternal } from '@/utils'

interface MenuMeta {
  icon?: string
  title?: string
  affix?: boolean
  hidden?: boolean
  [key: string]: unknown
}

interface MenuItem {
  path: string
  name?: string
  meta?: MenuMeta
  children?: MenuItem[]
  [key: string]: unknown
}

interface Props {
  item: MenuItem
  basePath: string
}

const props = defineProps<Props>()

const itemChildren = (props.item?.children || []) as MenuItem[]

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

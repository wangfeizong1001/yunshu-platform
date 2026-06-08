<template>
  <div class="tags-view-container">
    <scroll-pane class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query }"
        tag="span"
        class="tags-view-item"
        :class="{ 'is-active': isActive(tag) }"
        @click.middle="closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.meta?.title }}
        <span v-if="!tag.meta?.affix" class="el-icon-close" @click.prevent.stop="closeTag(tag)">
          <el-icon :size="12"><Close /></el-icon>
        </span>
      </router-link>
    </scroll-pane>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Close } from '@element-plus/icons-vue'

const route = useRoute()

const visitedViews = computed(() => {
  return [
    {
      path: '/',
      meta: { title: '首页', affix: true }
    }
  ]
})

const isActive = (tag: any) => {
  return tag.path === route.path
}

const closeTag = (tag: any) => {
  // 关闭标签
}

const closeSelectedTag = (tag: any) => {
  // 中键关闭
}

const openMenu = (tag: any, event: MouseEvent) => {
  // 右键菜单
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495057;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      border-radius: 4px;

      &.is-active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
}
</style>

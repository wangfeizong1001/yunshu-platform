<template>
  <div class="tags-view">
    <div class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query }"
        class="tags-view-item"
        :class="{ 'is-active': isActive(tag) }"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <el-icon :size="12"><Close /></el-icon>
        </span>
      </router-link>
    </div>

    <!-- 右键菜单 -->
    <ul v-show="visible" class="contextmenu" :style="{ left: left + 'px', top: top + 'px' }">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOtherTags">关闭其它</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, computed, ref, watch } from 'vue';
  import { useTagsViewStore } from '@/store/modules/tagsView';
  import { usePermissionStore } from '@/store/modules/permission';
  import { useRoute, useRouter } from 'vue-router';

  const tagsViewStore = useTagsViewStore();
  const permissionStore = usePermissionStore();
  const route = useRoute();
  const router = useRouter();

  const visible = ref(false);
  const left = ref(0);
  const top = ref(0);
  const selectedTag = ref<any>({});

  const visitedViews = computed(() => tagsViewStore.visitedViews.value);

  const isActive = (tag: any) => {
    return tag.path === route.path;
  };

  const isAffix = (tag: any) => {
    return tag.meta?.affix || false;
  };

  const filterAffixTags = (routes: any[], basePath = '/') => {
    let tags: any[] = [];
    routes.forEach((route) => {
      if (route.meta?.affix) {
        const tagPath = `${basePath}${route.path}`.replace(/\/+/g, '/');
        tags.push({
          path: tagPath,
          name: route.name,
          meta: { ...route.meta },
        });
      }
      if (route.children) {
        const childTags = filterAffixTags(route.children, `${basePath}${route.path}/`);
        tags = [...tags, ...childTags];
      }
    });
    return tags;
  };

  const initTags = () => {
    const affixTagsArr = filterAffixTags(permissionStore.routes);
    affixTagsArr.forEach((tag) => {
      if (tag.name) {
        tagsViewStore.addVisitedView(tag);
      }
    });
  };

  const addTags = () => {
    const { name } = route;
    if (name && typeof name === 'string') {
      tagsViewStore.addVisitedView({
        path: route.path,
        name: name,
        query: route.query,
        meta: { ...route.meta },
      });
    }
  };

  const openMenu = (tag: any, event: MouseEvent) => {
    visible.value = true;
    left.value = event.clientX;
    top.value = event.clientY + 4;
    selectedTag.value = tag;
  };

  const closeSelectedTag = (tag: any) => {
    tagsViewStore.delVisitedView(tag);
    if (isActive(tag)) {
      const latestView = visitedViews.value.slice(-1)[0] as { path: string } | undefined;
      if (latestView) {
        router.push(latestView.path);
      } else {
        router.push('/');
      }
    }
  };

  const refreshSelectedTag = (tag: any) => {
    tagsViewStore.delCachedView(tag);
    router.replace({
      path: '/redirect' + tag.path,
    });
  };

  const closeOtherTags = () => {
    if (selectedTag.value.path !== route.path) {
      router.push(selectedTag.value.path);
    }
    tagsViewStore.delOtherViews(selectedTag.value);
    visible.value = false;
  };

  const closeAllTags = () => {
    tagsViewStore.delAllViews();
    router.push('/');
  };

  watch(
    () => route.path,
    () => {
      addTags();
    },
  );

  watch(visible, (value) => {
    if (value) {
      document.body.addEventListener('click', closeMenu);
    } else {
      document.body.removeEventListener('click', closeMenu);
    }
  });

  const closeMenu = () => {
    visible.value = false;
  };

  onMounted(() => {
    initTags();
  });
</script>

<style lang="scss" scoped>
  .tags-view {
    height: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow:
      0 1px 3px 0 rgba(0, 0, 0, 0.12),
      0 0 3px 0 rgba(0, 0, 0, 0.04);

    .tags-view-wrapper {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 8px;
      overflow-x: auto;

      &::-webkit-scrollbar {
        height: 4px;
      }
    }

    .tags-view-item {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      margin-right: 4px;
      font-size: 12px;
      color: #495060;
      background: #fff;
      border: 1px solid #d8dce5;
      border-radius: 4px;
      cursor: pointer;
      transition: all $transition-duration $transition-function;

      &:hover {
        color: #409eff;
        border-color: #409eff;
      }

      &.is-active {
        color: #fff;
        background: #409eff;
        border-color: #409eff;

        .el-icon-close {
          color: #fff;
        }
      }

      .el-icon-close {
        margin-left: 6px;
        border-radius: 50%;

        &:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      }
    }

    .contextmenu {
      position: absolute;
      margin: 0;
      padding: 4px 0;
      background: #fff;
      border-radius: 4px;
      box-shadow: $shadow-base;
      z-index: $z-index-popover;
      list-style: none;

      li {
        padding: 8px 16px;
        font-size: 13px;
        cursor: pointer;

        &:hover {
          background: #f0f2f5;
          color: #409eff;
        }
      }
    }
  }
</style>

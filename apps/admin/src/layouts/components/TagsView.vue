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
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)">
          <el-icon :size="12"><Close /></el-icon>
        </span>
      </router-link>
    </div>

    <ul v-show="visible" class="contextmenu" :style="{ left: left + 'px', top: top + 'px' }">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOtherTags">关闭其它</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { usePermissionStore } from '@/store/modules/permission'
import { useRoute, useRouter } from 'vue-router'

interface TagMeta {
  title?: string
  affix?: boolean
  [key: string]: unknown
}

interface TagView {
  path: string
  name: string
  title?: string
  query?: Record<string, unknown>
  params?: Record<string, unknown>
  meta?: TagMeta
}

interface RouteLike {
  path?: string
  name?: string | symbol
  meta?: TagMeta
  children?: RouteLike[]
  [key: string]: unknown
}

const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()
const route = useRoute()
const router = useRouter()

const visible = ref(false)
const left = ref(0)
const top = ref(0)
const selectedTag = ref<TagView>({ path: '', name: '' })

const visitedViews = computed(() => tagsViewStore.visitedViews.value)

const isActive = (tag: TagView) => {
  return tag.path === route.path
}

const isAffix = (tag: TagView) => {
  return tag?.meta?.affix || false
}

const filterAffixTags = (routes: unknown[], basePath = '/'): TagView[] => {
  let tags: TagView[] = []
  routes.forEach((r) => {
    const routeItem = r as RouteLike
    if (routeItem.meta?.affix) {
      const tagPath = `${basePath}${routeItem.path || ''}`.replace(/\/+/g, '/')
      tags.push({
        path: tagPath,
        name: String(routeItem.name || ''),
        meta: { ...routeItem.meta }
      })
    }
    if (routeItem.children) {
      const childTags = filterAffixTags(routeItem.children, `${basePath}${routeItem.path || ''}/`)
      tags = [...tags, ...childTags]
    }
  })
  return tags
}

const initTags = () => {
  const affixTagsArr = filterAffixTags(permissionStore.routes as unknown[])
  affixTagsArr.forEach((tag) => {
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  })
}

const addTags = () => {
  const name = route.name
  if (name && typeof name === 'string') {
    tagsViewStore.addVisitedView({
      path: route.path,
      name: name,
      query: route.query as Record<string, unknown>,
      meta: { ...(route.meta as TagMeta) }
    })
  }
}

const openMenu = (tag: TagView, event: MouseEvent) => {
  visible.value = true
  left.value = event.clientX
  top.value = event.clientY + 4
  selectedTag.value = tag
}

const closeSelectedTag = (tag: TagView) => {
  tagsViewStore.delVisitedView(tag)
  if (isActive(tag)) {
    const latestView = visitedViews.value.slice(-1)[0] as TagView | undefined
    if (latestView) {
      router.push(latestView.path)
    } else {
      router.push('/')
    }
  }
}

const refreshSelectedTag = (tag: TagView) => {
  tagsViewStore.delCachedView(tag)
  router.replace({
    path: '/redirect' + tag.path
  })
}

const closeOtherTags = () => {
  if (selectedTag.value.path !== route.path) {
    router.push(selectedTag.value.path)
  }
  tagsViewStore.delOtherViews(selectedTag.value)
  visible.value = false
}

const closeAllTags = () => {
  tagsViewStore.delAllViews()
  router.push('/')
}

watch(
  () => route.path,
  () => {
    addTags()
  }
)

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

const closeMenu = () => {
  visible.value = false
}

onMounted(() => {
  initTags()
})
</script>

<style lang="scss" scoped>
.tags-view {
  height: 100%;
  background: var(--background);
  border-bottom: 1px solid var(--border);

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
    color: var(--text-secondary);
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }

    &.is-active {
      color: white;
      background: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }
  }

  .contextmenu {
    position: absolute;
    margin: 0;
    padding: 4px 0;
    background: var(--background);
    border-radius: 4px;
    z-index: 3000;
    list-style: none;

    li {
      padding: 8px 16px;
      font-size: 13px;
      cursor: pointer;

      &:hover {
        background: var(--surface-2);
        color: var(--el-color-primary);
      }
    }
  }
}
</style>

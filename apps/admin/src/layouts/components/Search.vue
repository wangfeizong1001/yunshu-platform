<template>
  <div class="search-trigger" @click="openDialog">
    <el-icon :size="size">
      <Search />
    </el-icon>
  </div>

  <el-dialog
    v-model="visible"
    title="菜单搜索"
    width="520px"
    :close-on-click-modal="true"
    @closed="onDialogClosed"
  >
    <div class="search-content">
      <el-input
        ref="searchInputRef"
        v-model="keyword"
        placeholder="输入菜单名称或路径搜索..."
        size="large"
        clearable
        @keydown="handleKeydown"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div v-if="keyword" class="search-results">
        <div
          v-for="(item, index) in filteredResults"
          :key="item.path"
          class="search-result-item"
          :class="{ 'is-active': index === activeIndex }"
          @click="handleSelect(item)"
          @mouseenter="activeIndex = index"
        >
          <el-icon class="result-icon"><Menu /></el-icon>
          <div class="result-info">
            <span class="result-title">{{ item.title }}</span>
            <span class="result-path">{{ item.path }}</span>
          </div>
          <el-icon class="result-arrow"><Promotion /></el-icon>
        </div>
        <div v-if="filteredResults.length === 0" class="search-empty">
          <el-icon :size="40"><Search /></el-icon>
          <p>未找到匹配的菜单</p>
        </div>
      </div>

      <div v-else class="search-tips">
        <div class="tips-header">
          <span class="tips-title">热门菜单</span>
          <span class="tips-hint">直接回车可跳转第一个菜单</span>
        </div>
        <div class="hot-results">
          <div
            v-for="(item, index) in hotResults"
            :key="item.path"
            class="search-result-item"
            :class="{ 'is-active': index === activeIndex }"
            @click="handleSelect(item)"
            @mouseenter="activeIndex = index"
          >
            <el-icon class="result-icon"><Menu /></el-icon>
            <div class="result-info">
              <span class="result-title">{{ item.title }}</span>
              <span class="result-path">{{ item.path }}</span>
            </div>
            <el-icon class="result-arrow"><Promotion /></el-icon>
          </div>
        </div>
        <div class="shortcut-keys">
          <div class="shortcut-item">
            <kbd>↑</kbd><kbd>↓</kbd>
            <span>选择</span>
          </div>
          <div class="shortcut-item">
            <kbd>Enter</kbd>
            <span>跳转</span>
          </div>
          <div class="shortcut-item">
            <kbd>Esc</kbd>
            <span>关闭</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Search, Menu, Promotion } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import type { RouteRecordRaw } from 'vue-router'

interface SearchItem {
  title: string
  path: string
}

const props = defineProps({
  size: {
    type: Number,
    default: 20
  }
})

const router = useRouter()
const permissionStore = usePermissionStore()

const visible = ref(false)
const keyword = ref('')
const activeIndex = ref(0)
const searchInputRef = ref<InstanceType<typeof import('element-plus').ElInput> | null>(null)

/**
 * 递归扁平化路由，提取可搜索的菜单项
 * @param routes 路由数组
 * @param result 结果数组
 */
function flattenRoutes(routes: RouteRecordRaw[], result: SearchItem[] = []): SearchItem[] {
  for (const route of routes) {
    if (route.meta?.title) {
      result.push({
        title: route.meta.title as string,
        path: route.path
      })
    }
    if (route.children) {
      flattenRoutes(route.children, result)
    }
  }
  return result
}

const allSearchItems = computed<SearchItem[]>(() => {
  return flattenRoutes(permissionStore.routes)
})

const filteredResults = computed<SearchItem[]>(() => {
  if (!keyword.value) {
    return []
  }
  const lowerKeyword = keyword.value.toLowerCase()
  return allSearchItems.value
    .filter(
      (item) =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.path.toLowerCase().includes(lowerKeyword)
    )
    .slice(0, 10)
})

const hotResults = computed<SearchItem[]>(() => {
  return allSearchItems.value.slice(0, 6)
})

function openDialog() {
  visible.value = true
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

function closeDialog() {
  visible.value = false
}

function onDialogClosed() {
  keyword.value = ''
  activeIndex.value = 0
}

function handleKeydown(event: KeyboardEvent) {
  const results = keyword.value ? filteredResults.value : hotResults.value
  const maxIndex = results.length - 1

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (activeIndex.value < maxIndex) {
        activeIndex.value++
      } else {
        activeIndex.value = 0
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (activeIndex.value > 0) {
        activeIndex.value--
      } else {
        activeIndex.value = maxIndex
      }
      break
    case 'Enter':
      event.preventDefault()
      if (results.length > 0) {
        handleSelect(results[activeIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      closeDialog()
      break
  }
}

function handleSelect(item: SearchItem) {
  closeDialog()
  router.push(item.path)
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key === '/' && !visible.value) {
    const activeElement = document.activeElement
    const isInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA'
    if (!isInput) {
      event.preventDefault()
      openDialog()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style lang="scss" scoped>
.search-trigger {
  cursor: pointer;
  color: var(--el-text-color-regular);
  transition: color var(--transition-duration) var(--transition-function);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--el-color-primary);
  }
}

.search-content {
  padding: 0 8px;
}

.search-results {
  margin-top: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color var(--transition-duration) var(--transition-function);

  &:hover,
  &.is-active {
    background-color: var(--el-fill-color-light);
  }

  .result-icon {
    font-size: 18px;
    color: var(--el-text-color-secondary);
    margin-right: 12px;
  }

  .result-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .result-title {
      font-size: 14px;
      color: var(--el-text-color-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-path {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 4px;
    }
  }

  .result-arrow {
    font-size: 14px;
    color: var(--el-text-color-placeholder);
    opacity: 0;
    transition: opacity var(--transition-duration) var(--transition-function);
  }

  &.is-active .result-arrow {
    opacity: 1;
    color: var(--el-color-primary);
  }
}

.search-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: var(--el-text-color-secondary);

  p {
    margin-top: 12px;
    font-size: 14px;
  }
}

.search-tips {
  margin-top: 16px;

  .tips-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .tips-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }

    .tips-hint {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .hot-results {
    max-height: 280px;
    overflow-y: auto;
  }

  .shortcut-keys {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color-lighter);

    .shortcut-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--el-text-color-secondary);

      kbd {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 22px;
        padding: 0 6px;
        background-color: var(--el-fill-color);
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        font-size: 11px;
        font-family: inherit;
      }
    }
  }
}
</style>

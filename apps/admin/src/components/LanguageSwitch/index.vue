<template>
  <el-dropdown
    :hide-on-click="false"
    trigger="click"
    @command="handleCommand"
  >
    <span class="language-switch">
      <el-icon class="language-icon">
        <component :is="currentIcon" />
      </el-icon>
      <span class="language-label">{{ currentLabel }}</span>
      <el-icon class="arrow-icon">
        <ArrowDown />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in locales"
          :key="item.key"
          :command="item.key"
          :disabled="item.key === locale"
        >
          <span :class="{ 'is-active': item.key === locale }">
            {{ item.label }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import useLocale from '@/locales/useLocale'

const { locale, locales, changeLocale } = useLocale()

const currentLabel = computed(() => {
  const current = locales.value.find(l => l.key === locale.value)
  return current?.label || '中文'
})

const currentIcon = computed(() => {
  // 根据当前语言返回不同图标
  return 'Connection'
})

const handleCommand = async (key: string) => {
  await changeLocale(key)
}
</script>

<style scoped lang="scss">
.language-switch {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: var(--text-color-primary, #303133);

  &:hover {
    background-color: var(--hover-color, #f5f7fa);
  }
}

.language-icon {
  font-size: 16px;
}

.language-label {
  font-size: 14px;
}

.arrow-icon {
  font-size: 12px;
  margin-left: 2px;
}

.is-active {
  color: var(--primary-color, #409eff);
  font-weight: 500;
}
</style>

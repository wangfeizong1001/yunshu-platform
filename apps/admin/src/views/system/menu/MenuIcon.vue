<template>
  <el-dialog
    v-model="visible"
    title="选择图标"
    width="800px"
    append-to-body
  >
    <div class="icon-list">
      <div
        v-for="icon in iconList"
        :key="icon"
        class="icon-item"
        :class="{ active: selectedIcon === icon }"
        @click="handleSelect(icon)"
      >
        <el-icon :size="24">
          <component :is="icon" />
        </el-icon>
        <span class="icon-name">{{ icon }}</span>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', icon: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 常用图标列表
const iconList = [
  // 基础图标
  'Plus',
  'Minus',
  'Search',
  'Refresh',
  'Edit',
  'Delete',
  'View',
  'Hide',
  'Upload',
  'Download',
  'UploadFilled',
  'DownloadFilled',
  // 导航图标
  'HomeFilled',
  'Menu',
  'Guide',
  'Location',
  'LocationInformation',
  // 用户图标
  'User',
  'UserFilled',
  'Avatar',
  'People',
  'UserPlus',
  'Coordinate',
  // 文档图标
  'Document',
  'DocumentChecked',
  'DocumentCopy',
  'Tickets',
  'Memo',
  'Collection',
  'Notebook',
  'Reading',
  // 业务图标
  'Setting',
  'Tools',
  'Gear',
  'Coin',
  'Money',
  'PriceTag',
  'ShoppingCart',
  'ShoppingCartFull',
  'Goods',
  'Shop',
  'Sell',
  'Promotion',
  // 状态图标
  'SuccessFilled',
  'WarningFilled',
  'ErrorFilled',
  'InfoFilled',
  'Check',
  'Close',
  'CircleCheck',
  'CircleClose',
  'WarnTriangle',
  // 通讯图标
  'Message',
  'MessageBox',
  'ChatDotRound',
  'ChatLineRound',
  'Phone',
  'PhoneFilled',
  'Email',
  'Bell',
  'ChatSquare',
  // 文件图标
  'Folder',
  'FolderOpened',
  'FolderAdd',
  'FolderDelete',
  'DocumentAdd',
  'DocumentDelete',
  // 编辑图标
  'EditPen',
  'DeleteFilled',
  'Brush',
  'Pen',
  'Edit',
  // 时间图标
  'Clock',
  'Timer',
  'Calendar',
  'AlarmClock',
  // 其他图标
  'More',
  'MoreFilled',
  'Star',
  'StarFilled',
  'Heart',
  'HeartFilled',
  'Lock',
  'Unlock',
  'Key',
  'Link',
  'Connection',
  'Route',
  'Grid',
  'Grid',
  'Operation',
  'Sort',
  'Filter',
  'List',
  'Management',
  'ZoomIn',
  'ZoomOut',
  'FullScreen',
  'Aim',
]

const selectedIcon = ref('')

function handleSelect(icon: string) {
  selectedIcon.value = icon
}

function handleConfirm() {
  if (selectedIcon.value) {
    emit('select', selectedIcon.value)
    handleClose()
  }
}

function handleClose() {
  selectedIcon.value = ''
  visible.value = false
}
</script>

<style scoped lang="scss">
.icon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #409eff;
      background-color: #ecf5ff;
    }

    &.active {
      border-color: #409eff;
      background-color: #409eff;
      color: #fff;
    }

    .icon-name {
      margin-top: 4px;
      font-size: 12px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
  }
}
</style>

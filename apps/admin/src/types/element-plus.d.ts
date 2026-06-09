/**
 * Element Plus 组件类型扩展
 *
 * 为 Element Plus 组件提供更精确的 TypeScript 类型定义，
 * 解决第三方库类型不完整的问题。
 */

import 'element-plus'

// ==================== ElTable 扩展 ====================

declare module 'element-plus' {
  // ElTable 扩展接口
  export interface ElTableProps<T = Record<string, unknown>> {
    /** 是否显示斑马纹 */
    stripe?: boolean
    /** 是否显示边框 */
    border?: boolean
    /** 是否显示索引列 */
    index?: boolean | ((index: number) => number)
    /** 空状态文本 */
    emptyText?: string
  }

  // ElTableColumn 扩展接口
  export interface ElTableColumnProps {
    /** 列宽 */
    width?: string | number
    /** 最小列宽 */
    minWidth?: string | number
    /** 对齐方式 */
    align?: 'left' | 'center' | 'right'
    /** 表头对齐方式 */
    headerAlign?: 'left' | 'center' | 'right'
    /** 是否可排序 */
    sortable?: boolean | 'custom'
    /** 是否可选择 */
    selectable?: (row: Record<string, unknown>, index: number) => boolean
    /** 是否固定列 */
    fixed?: boolean | 'left' | 'right'
    /** 自定义渲染函数 */
    formatter?: (row: Record<string, unknown>, column: Record<string, unknown>, cellValue: unknown, index: number) => string
  }

  // ElTable 实例扩展
  export interface ElTable {
    /** 滚动到指定位置 */
    scrollTo: (top: number, left?: number) => void
    /** 滚动到指定行 */
    scrollToRow: (row: Record<string, unknown>) => void
    /** 清除选中状态 */
    clearSelection: () => void
    /** 切换选中状态 */
    toggleRowSelection: (row: Record<string, unknown>, selected?: boolean) => void
  }
}

// ==================== ElForm 扩展 ====================

declare module 'element-plus' {
  // ElForm 验证规则扩展
  export interface FormValidateCallback {
    (valid: boolean, fields?: Record<string, unknown>): void
  }

  // ElForm 实例扩展
  export interface ElForm {
    /** 验证整个表单 */
    validate: (callback?: FormValidateCallback) => Promise<boolean>
    /** 清除验证 */
    clearValidate: (props?: string | string[]) => void
    /** 重置表单 */
    resetFields: () => void
  }
}

// ==================== ElDialog 扩展 ====================

declare module 'element-plus' {
  // ElDialog 属性扩展
  export interface ElDialogProps {
    /** 是否显示 */
    modelValue?: boolean
    /** 标题 */
    title?: string
    /** 宽度 */
    width?: string | number
    /** 是否显示关闭按钮 */
    showClose?: boolean
    /** 是否点击遮罩层关闭 */
    closeOnClickModal?: boolean
    /** 是否按 ESC 键关闭 */
    closeOnPressEscape?: boolean
    /** 是否显示确认按钮 */
    showConfirmButton?: boolean
    /** 确认按钮文本 */
    confirmButtonText?: string
    /** 取消按钮文本 */
    cancelButtonText?: string
    /** 是否显示全屏按钮 */
    showFullscreen?: boolean
  }
}

// ==================== ElSelect 扩展 ====================

declare module 'element-plus' {
  // ElOption 属性扩展
  export interface ElOptionProps {
    /** 选项标签 */
    label?: string
    /** 选项值 */
    value?: string | number
    /** 是否禁用 */
    disabled?: boolean
  }
}

// ==================== ElPagination 扩展 ====================

declare module 'element-plus' {
  // ElPagination 属性扩展
  export interface ElPaginationProps {
    /** 当前页码 */
    currentPage?: number
    /** 每页数量 */
    pageSize?: number
    /** 总数 */
    total?: number
    /** 可选的每页数量 */
    pageSizes?: number[]
    /** 布局 */
    layout?: string
    /** 是否显示 jumper */
    showJumper?: boolean
  }
}

// ==================== ElTree 扩展 ====================

declare module 'element-plus' {
  // ElTree 节点数据扩展
  export interface TreeNode {
    /** 节点 ID */
    id?: string | number
    /** 父节点 ID */
    parentId?: string | number
    /** 节点标签 */
    label?: string
    /** 节点数据 */
    data?: Record<string, unknown>
    /** 子节点 */
    children?: TreeNode[]
    /** 是否禁用 */
    disabled?: boolean
    /** 是否叶子节点 */
    isLeaf?: boolean
  }

  // ElTree 实例扩展
  export interface ElTree {
    /** 获取当前选中的节点 */
    getCurrentNode: () => TreeNode | null
    /** 设置当前选中节点 */
    setCurrentNode: (node: TreeNode) => void
    /** 获取选中节点的关键字 */
    getCurrentKey: () => string | number | null
  }
}

// ==================== ElUpload 扩展 ====================

declare module 'element-plus' {
  // ElUpload 文件对象
  export interface UploadFile {
    /** 文件名 */
    name: string
    /** 文件 URL */
    url?: string
    /** 响应数据 */
    response?: unknown
    /** 上传状态 */
    status?: 'ready' | 'uploading' | 'success' | 'fail'
    /** 文件大小 */
    size?: number
    /** 百分比 */
    percentage?: number
  }

  // ElUpload 实例扩展
  export interface ElUpload {
    /** 清除文件列表 */
    clearFiles: () => void
    /** 中止上传 */
    abort: (file?: UploadFile) => void
  }
}

// ==================== 全局属性扩展 ====================

declare module '@vue/runtime-core' {
  // 全局组件实例类型
  interface ComponentCustomProperties {
    /** $message 实例 */
    $message: typeof import('element-plus').ElMessage
    /** $notify 实例 */
    $notify: typeof import('element-plus').ElNotification
    /** $msgbox 实例 */
    $msgbox: typeof import('element-plus').ElMessageBox
    /** $confirm 实例 */
    $confirm: typeof import('element-plus').ElMessageBox.confirm
    /** $prompt 实例 */
    $prompt: typeof import('element-plus').ElMessageBox.prompt
    /** $alert 实例 */
    $alert: typeof import('element-plus').ElMessageBox.alert
  }
}

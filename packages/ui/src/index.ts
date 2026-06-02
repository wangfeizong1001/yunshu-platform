/**
 * 云枢中台 — Vue 3 UI 组件库
 *
 * 三层组件架构：
 * 1. Primitives（无头组件）— 纯逻辑，无样式，可跨框架移植
 * 2. Styled（样式组件）— 基于设计令牌的带样式组件
 * 3. Business（业务组件）— 组合 primitives + styled 解决特定场景
 *
 * @module @yunshu/ui
 */

// ============================================================================
// Primitives — 无头逻辑组件（Composables）
// ============================================================================

export { useButton } from './primitives/useButton';
export { useInput } from './primitives/useInput';
export { useDialog } from './primitives/useDialog';
export { usePagination } from './primitives/usePagination';

// ============================================================================
// Composables — 通用组合式函数
// ============================================================================

export { useTheme } from './composables/useTheme';
export { useForm } from './composables/useForm';
export { useTable } from './composables/useTable';

// ============================================================================
// Styled — 带样式组件
// ============================================================================

export { default as YunButton } from './styled/Button/Button.vue';
export { default as YunInput } from './styled/Input/Input.vue';
export { default as YunDialog } from './styled/Dialog/Dialog.vue';
export { default as YunPagination } from './styled/Pagination/Pagination.vue';
export { default as YunEmpty } from './styled/Empty/Empty.vue';
export { default as YunLoading } from './styled/Loading/Loading.vue';

// ============================================================================
// Business — 业务组件
// ============================================================================

export { default as YunErrorPage } from './business/ErrorPage/ErrorPage.vue';
export { default as YunDataTable } from './business/DataTable/DataTable.vue';
export { default as YunSearchForm } from './business/SearchForm/SearchForm.vue';
export { default as YunFileUpload } from './business/FileUpload/FileUpload.vue';

// ============================================================================
// Styles — 主题系统入口
// ============================================================================

// 用户需手动导入 CSS
// import '@yunshu/ui/styles'

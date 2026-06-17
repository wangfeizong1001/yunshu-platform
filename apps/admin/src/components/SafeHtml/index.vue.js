/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
/**
 * 安全 HTML 组件 —— 防止 XSS 攻击的富文本渲染
 * @module components/SafeHtml
 */
import { computed } from 'vue';
import { sanitizeHtml, truncateHtml } from '@/utils/security/sanitize';
const props = withDefaults(defineProps(), {
    maxLength: undefined,
    customClass: '',
    customStyle: () => ({})
});
/**
 * 经过清洗的安全 HTML（计算属性自动响应式）
 */
const sanitizedContent = computed(() => {
    const safe = sanitizeHtml(props.html);
    if (props.maxLength && props.maxLength > 0) {
        return truncateHtml(safe, props.maxLength);
    }
    return safe;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    maxLength: undefined,
    customClass: '',
    customStyle: () => ({})
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ class: (['safe-html-content', __VLS_ctx.customClass]) },
    ...{ style: (__VLS_ctx.customStyle) },
});
__VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.sanitizedContent) }, null, null);
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            sanitizedContent: sanitizedContent,
        };
    },
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map
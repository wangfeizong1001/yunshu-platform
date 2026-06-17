import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { uploadFile } from '@/api/system/file.api';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
// 状态
const uploadRef = ref();
const fileList = ref([]);
const uploading = ref(false);
// 处理文件超出限制
function handleExceed(files, _uploadFiles) {
    ElMessage.warning(`最多只能上传10个文件，当前已选择${files.length}个文件`);
}
// 处理文件变化
function handleChange(_file, uploadFiles) {
    fileList.value = uploadFiles;
}
// 提交上传
async function handleSubmit() {
    if (fileList.value.length === 0) {
        ElMessage.warning('请选择要上传的文件');
        return;
    }
    uploading.value = true;
    let successCount = 0;
    let failCount = 0;
    try {
        for (const item of fileList.value) {
            if (item.status === 'ready') {
                try {
                    await uploadFile(item.raw);
                    successCount++;
                }
                catch (error) {
                    failCount++;
                    console.error(`文件${item.name}上传失败`, error);
                }
            }
        }
        if (successCount > 0) {
            ElMessage.success(`成功上传${successCount}个文件${failCount > 0 ? `，${failCount}个文件上传失败` : ''}`);
            emit('refresh');
            handleClose();
        }
        else if (failCount > 0) {
            ElMessage.error(`文件上传失败`);
        }
    }
    finally {
        uploading.value = false;
    }
}
// 关闭弹窗
function handleClose() {
    fileList.value = [];
    visible.value = false;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: "上传文件",
    width: "500px",
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: "上传文件",
    width: "500px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClose: (__VLS_ctx.handleClose)
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ref: "uploadRef",
    fileList: (__VLS_ctx.fileList),
    autoUpload: (false),
    limit: (10),
    onExceed: (__VLS_ctx.handleExceed),
    onChange: (__VLS_ctx.handleChange),
    drag: true,
    multiple: true,
    ...{ class: "file-upload" },
}));
const __VLS_11 = __VLS_10({
    ref: "uploadRef",
    fileList: (__VLS_ctx.fileList),
    autoUpload: (false),
    limit: (10),
    onExceed: (__VLS_ctx.handleExceed),
    onChange: (__VLS_ctx.handleChange),
    drag: true,
    multiple: true,
    ...{ class: "file-upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {typeof __VLS_ctx.uploadRef} */ ;
var __VLS_13 = {};
__VLS_12.slots.default;
const __VLS_15 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    ...{ class: "upload-icon" },
}));
const __VLS_17 = __VLS_16({
    ...{ class: "upload-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.UploadFilled;
/** @type {[typeof __VLS_components.UploadFilled, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_18;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "upload-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.em, __VLS_intrinsicElements.em)({});
{
    const { tip: __VLS_thisSlot } = __VLS_12.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "upload-tip" },
    });
}
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_23 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
        ...{ 'onClick': {} },
    }));
    const __VLS_25 = __VLS_24({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    let __VLS_27;
    let __VLS_28;
    let __VLS_29;
    const __VLS_30 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_26.slots.default;
    var __VLS_26;
    const __VLS_31 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.uploading),
    }));
    const __VLS_33 = __VLS_32({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.uploading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_35;
    let __VLS_36;
    let __VLS_37;
    const __VLS_38 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_34.slots.default;
    var __VLS_34;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['file-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-text']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-tip']} */ ;
// @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UploadFilled: UploadFilled,
            visible: visible,
            uploadRef: uploadRef,
            fileList: fileList,
            uploading: uploading,
            handleExceed: handleExceed,
            handleChange: handleChange,
            handleSubmit: handleSubmit,
            handleClose: handleClose,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=FileUpload.vue.js.map
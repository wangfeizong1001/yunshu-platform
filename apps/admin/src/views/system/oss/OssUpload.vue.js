import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { getToken } from '@/utils/auth';
const props = defineProps();
const emit = defineEmits();
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
const formRef = ref();
const uploadRef = ref();
const form = reactive({
    storageType: 'local',
});
const uploadProgress = ref(0);
const uploadUrl = computed(() => {
    const baseUrl = import.meta.env.VITE_APP_BASE_API || '';
    return `${baseUrl}/api/system/oss/upload`;
});
const headers = computed(() => ({
    Authorization: `Bearer ${getToken() || ''}`,
}));
// 上传前验证
function handleBeforeUpload(file) {
    if (file.size > 100 * 1024 * 1024) {
        ElMessage.error('文件大小不能超过 100MB');
        return false;
    }
    return true;
}
// 上传成功
function handleSuccess(res) {
    if (res.code === 200 || res.code === 0 || res.success) {
        ElMessage.success('上传成功');
        emit('refresh');
        handleClose();
    }
    else {
        ElMessage.error(res.msg || res.message || '上传失败');
    }
}
// 上传失败
function handleError(err) {
    ElMessage.error('上传失败');
    console.error('上传失败', err);
}
// 上传进度
function handleProgress(event) {
    uploadProgress.value = Math.round(event.percent || 0);
}
// 关闭弹窗
function handleClose() {
    form.storageType = 'local';
    uploadProgress.value = 0;
    visible.value = false;
}
// 重置表单
function resetForm() {
    formRef.value?.resetFields();
}
// 监听弹窗关闭
watch(visible, (val) => {
    if (!val) {
        resetForm();
    }
});
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
const __VLS_9 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ref: "formRef",
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}));
const __VLS_11 = __VLS_10({
    ref: "formRef",
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_13 = {};
__VLS_12.slots.default;
const __VLS_15 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    label: "存储类型",
    prop: "storageType",
}));
const __VLS_17 = __VLS_16({
    label: "存储类型",
    prop: "storageType",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    modelValue: (__VLS_ctx.form.storageType),
    placeholder: "请选择存储类型",
}));
const __VLS_21 = __VLS_20({
    modelValue: (__VLS_ctx.form.storageType),
    placeholder: "请选择存储类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
const __VLS_23 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "本地存储",
    value: "local",
}));
const __VLS_25 = __VLS_24({
    label: "本地存储",
    value: "local",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const __VLS_27 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    label: "阿里云 OSS",
    value: "aliyun",
}));
const __VLS_29 = __VLS_28({
    label: "阿里云 OSS",
    value: "aliyun",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const __VLS_31 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    label: "腾讯云 COS",
    value: "qcloud",
}));
const __VLS_33 = __VLS_32({
    label: "腾讯云 COS",
    value: "qcloud",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const __VLS_35 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    label: "七牛云",
    value: "qiniu",
}));
const __VLS_37 = __VLS_36({
    label: "七牛云",
    value: "qiniu",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
var __VLS_22;
var __VLS_18;
const __VLS_39 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "文件",
    prop: "file",
}));
const __VLS_41 = __VLS_40({
    label: "文件",
    prop: "file",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
const __VLS_43 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    ref: "uploadRef",
    action: (__VLS_ctx.uploadUrl),
    headers: (__VLS_ctx.headers),
    data: ({ storageType: __VLS_ctx.form.storageType }),
    beforeUpload: (__VLS_ctx.handleBeforeUpload),
    onSuccess: (__VLS_ctx.handleSuccess),
    onError: (__VLS_ctx.handleError),
    onProgress: (__VLS_ctx.handleProgress),
    drag: true,
    showFileList: (false),
    accept: "*",
}));
const __VLS_45 = __VLS_44({
    ref: "uploadRef",
    action: (__VLS_ctx.uploadUrl),
    headers: (__VLS_ctx.headers),
    data: ({ storageType: __VLS_ctx.form.storageType }),
    beforeUpload: (__VLS_ctx.handleBeforeUpload),
    onSuccess: (__VLS_ctx.handleSuccess),
    onError: (__VLS_ctx.handleError),
    onProgress: (__VLS_ctx.handleProgress),
    drag: true,
    showFileList: (false),
    accept: "*",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
/** @type {typeof __VLS_ctx.uploadRef} */ ;
var __VLS_47 = {};
__VLS_46.slots.default;
const __VLS_49 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ class: "el-icon--upload" },
}));
const __VLS_51 = __VLS_50({
    ...{ class: "el-icon--upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
const __VLS_53 = {}.UploadFilled;
/** @type {[typeof __VLS_components.UploadFilled, typeof __VLS_components.uploadFilled, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({}));
const __VLS_55 = __VLS_54({}, ...__VLS_functionalComponentArgsRest(__VLS_54));
var __VLS_52;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "el-upload__text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.em, __VLS_intrinsicElements.em)({});
{
    const { tip: __VLS_thisSlot } = __VLS_46.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "el-upload__tip" },
    });
}
var __VLS_46;
var __VLS_42;
if (__VLS_ctx.uploadProgress > 0 && __VLS_ctx.uploadProgress < 100) {
    const __VLS_57 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
        label: "上传进度",
    }));
    const __VLS_59 = __VLS_58({
        label: "上传进度",
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    __VLS_60.slots.default;
    const __VLS_61 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        percentage: (__VLS_ctx.uploadProgress),
        strokeWidth: (10),
    }));
    const __VLS_63 = __VLS_62({
        percentage: (__VLS_ctx.uploadProgress),
        strokeWidth: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    var __VLS_60;
}
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_65 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
        ...{ 'onClick': {} },
    }));
    const __VLS_67 = __VLS_66({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    let __VLS_69;
    let __VLS_70;
    let __VLS_71;
    const __VLS_72 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_68.slots.default;
    var __VLS_68;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['el-icon--upload']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__text']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ ;
// @ts-ignore
var __VLS_14 = __VLS_13, __VLS_48 = __VLS_47;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UploadFilled: UploadFilled,
            visible: visible,
            formRef: formRef,
            uploadRef: uploadRef,
            form: form,
            uploadProgress: uploadProgress,
            uploadUrl: uploadUrl,
            headers: headers,
            handleBeforeUpload: handleBeforeUpload,
            handleSuccess: handleSuccess,
            handleError: handleError,
            handleProgress: handleProgress,
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
//# sourceMappingURL=OssUpload.vue.js.map
/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Upload } from '@element-plus/icons-vue';
import { getToken } from '@/utils/auth';
const props = withDefaults(defineProps(), {
  modelValue: '',
  action: '/api/system/oss/upload',
  accept: '*',
  maxSize: 10,
  disabled: false,
  limit: 1,
  multiple: false,
  drag: false,
  showFileList: true,
  tip: '',
  fileType: () => [],
});
const emit = defineEmits();
const uploadRef = ref();
const uploadUrl = computed(() => {
  const env = import.meta.env;
  const baseUrl = env.VITE_API_BASE_URL || '';
  return `${baseUrl}${props.action}`;
});
const headers = computed(() => ({
  Authorization: `Bearer ${getToken() || ''}`,
}));
const extraData = computed(() => {
  return {
    ...props.extraData,
  };
});
// 隐藏上传按钮
const hideUploadBtn = computed(() => {
  if (!props.multiple && props.limit === 1) {
    return !!props.modelValue && props.showFileList;
  }
  return false;
});
// 内部文件列表
const internalFileList = ref([]);
// 监听外部值变化
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const fileName = val.split('/').pop() || val;
      internalFileList.value = [
        {
          name: fileName,
          url: val,
        },
      ];
    } else {
      internalFileList.value = [];
    }
  },
  { immediate: true },
);
// 上传前验证
function handleBeforeUpload(file) {
  // 检查文件大小
  if (props.maxSize > 0 && file.size > props.maxSize * 1024 * 1024) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`);
    return false;
  }
  // 检查文件类型
  if (props.fileType.length > 0) {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const isValidType = props.fileType.some((type) => {
      if (type.startsWith('.')) {
        return type.toLowerCase() === `.${fileExt}`;
      }
      return type === fileExt;
    });
    if (!isValidType) {
      ElMessage.error(`文件类型不允许，仅支持：${props.fileType.join('、')}`);
      return false;
    }
  }
  return true;
}
// 上传成功
function handleSuccess(res) {
  if (res.code === 200 || res.code === 0 || res.success) {
    const url = res.data?.url || res.data?.filePath || res.data;
    emit('update:modelValue', url);
    emit('success', res.data);
    ElMessage.success('上传成功');
  } else {
    emit('error', res);
    ElMessage.error(res.msg || res.message || '上传失败');
    // 清空文件列表
    internalFileList.value = [];
  }
}
// 上传失败
function handleError(err) {
  emit('error', err);
  ElMessage.error('上传失败');
}
// 上传进度
function handleProgress(event) {
  emit('progress', event);
}
// 文件改变
function handleChange(file, fileList) {
  emit('change', file, fileList);
}
// 文件移除
function handleRemove(file, fileList) {
  if (fileList.length === 0) {
    emit('update:modelValue', '');
  }
  emit('remove', file, fileList);
}
// 手动上传
function submit() {
  uploadRef.value?.submit();
}
// 清除文件
function clearFiles() {
  uploadRef.value?.clearFiles();
}
// 取消上传
function abort(file) {
  uploadRef.value?.abort(file);
}
// 获取上传组件引用
const __VLS_exposed = {
  submit,
  clearFiles,
  abort,
  uploadRef,
};
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) {
  return t;
})({
  modelValue: '',
  action: '/api/system/oss/upload',
  accept: '*',
  maxSize: 10,
  disabled: false,
  limit: 1,
  multiple: false,
  drag: false,
  showFileList: true,
  tip: '',
  fileType: () => [],
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-upload']} */ // CSS variable injection
// CSS variable injection end
const __VLS_0 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ref: 'uploadRef',
    action: __VLS_ctx.uploadUrl,
    headers: __VLS_ctx.headers,
    data: __VLS_ctx.extraData,
    beforeUpload: __VLS_ctx.handleBeforeUpload,
    onSuccess: __VLS_ctx.handleSuccess,
    onError: __VLS_ctx.handleError,
    onProgress: __VLS_ctx.handleProgress,
    onChange: __VLS_ctx.handleChange,
    onRemove: __VLS_ctx.handleRemove,
    fileList: __VLS_ctx.internalFileList,
    accept: __VLS_ctx.accept,
    disabled: __VLS_ctx.disabled,
    limit: __VLS_ctx.limit,
    multiple: __VLS_ctx.multiple,
    drag: __VLS_ctx.drag,
    showFileList: __VLS_ctx.showFileList,
    ...{ class: [{ 'hide-upload': __VLS_ctx.hideUploadBtn }, 'oss-upload'] },
  }),
);
const __VLS_2 = __VLS_1(
  {
    ref: 'uploadRef',
    action: __VLS_ctx.uploadUrl,
    headers: __VLS_ctx.headers,
    data: __VLS_ctx.extraData,
    beforeUpload: __VLS_ctx.handleBeforeUpload,
    onSuccess: __VLS_ctx.handleSuccess,
    onError: __VLS_ctx.handleError,
    onProgress: __VLS_ctx.handleProgress,
    onChange: __VLS_ctx.handleChange,
    onRemove: __VLS_ctx.handleRemove,
    fileList: __VLS_ctx.internalFileList,
    accept: __VLS_ctx.accept,
    disabled: __VLS_ctx.disabled,
    limit: __VLS_ctx.limit,
    multiple: __VLS_ctx.multiple,
    drag: __VLS_ctx.drag,
    showFileList: __VLS_ctx.showFileList,
    ...{ class: [{ 'hide-upload': __VLS_ctx.hideUploadBtn }, 'oss-upload'] },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
/** @type {typeof __VLS_ctx.uploadRef} */ var __VLS_4 = {};
__VLS_3.slots.default;
var __VLS_6 = {};
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(
  __VLS_8,
  new __VLS_8({
    type: 'primary',
    icon: __VLS_ctx.Upload,
    disabled: __VLS_ctx.disabled,
  }),
);
const __VLS_10 = __VLS_9(
  {
    type: 'primary',
    icon: __VLS_ctx.Upload,
    disabled: __VLS_ctx.disabled,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
__VLS_11.slots.default;
__VLS_ctx.drag ? '将文件拖到此处，或点击上传' : '上传文件';
var __VLS_11;
{
  const { tip: __VLS_thisSlot } = __VLS_3.slots;
  if (__VLS_ctx.tip) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'el-upload__tip' },
    });
    __VLS_ctx.tip;
  }
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ // @ts-ignore
var __VLS_5 = __VLS_4,
  __VLS_7 = __VLS_6;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Upload: Upload,
      uploadRef: uploadRef,
      uploadUrl: uploadUrl,
      headers: headers,
      extraData: extraData,
      hideUploadBtn: hideUploadBtn,
      internalFileList: internalFileList,
      handleBeforeUpload: handleBeforeUpload,
      handleSuccess: handleSuccess,
      handleError: handleError,
      handleProgress: handleProgress,
      handleChange: handleChange,
      handleRemove: handleRemove,
    };
  },
  __typeEmits: {},
  __typeProps: {},
  props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
  setup() {
    return {
      ...__VLS_exposed,
    };
  },
  __typeEmits: {},
  __typeProps: {},
  props: {},
});
export default {}; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map

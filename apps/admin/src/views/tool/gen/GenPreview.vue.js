/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, DocumentCopy, Download, Refresh, Files, Key } from '@element-plus/icons-vue';
import { previewCode, downloadCode } from '@/api/tool/gen.api';
const props = defineProps();
const emit = defineEmits();
const visible = ref(false);
const loading = ref(false);
const previewData = ref(null);
const codeContentRef = ref();
const fileList = computed(() => previewData.value?.files || []);
const currentFile = ref(null);
const highlightedCode = computed(() => {
  if (!currentFile.value) return '';
  return highlightCode(currentFile.value.content, getFileExt(currentFile.value.fileName));
});
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
    if (val && props.tableName) {
      loadPreviewData();
    }
  },
);
watch(visible, (val) => {
  emit('update:modelValue', val);
});
const getFileExt = (fileName) => {
  const ext = fileName.split('.').pop() || '';
  return ext.toLowerCase();
};
const getFileTagType = (fileName) => {
  const ext = getFileExt(fileName);
  const typeMap = {
    java: 'success',
    vue: 'primary',
    ts: 'warning',
    js: 'warning',
    sql: 'info',
    xml: 'danger',
  };
  return typeMap[ext];
};
const getFileIconColor = (fileName) => {
  if (!fileName) return '#909399';
  const ext = getFileExt(fileName);
  const colorMap = {
    java: '#b07219',
    vue: '#42b883',
    ts: '#3178c6',
    js: '#f7df1e',
    sql: '#e38c00',
    xml: '#0060ac',
    html: '#e34c26',
    css: '#563d7c',
  };
  return colorMap[ext] || '#909399';
};
const isJavaFile = (fileName) => {
  return getFileExt(fileName || '') === 'java';
};
const isVueFile = (fileName) => {
  return getFileExt(fileName || '') === 'vue';
};
const isTypeScriptFile = (fileName) => {
  return ['ts', 'tsx'].includes(getFileExt(fileName || ''));
};
const isSqlFile = (fileName) => {
  return getFileExt(fileName || '') === 'sql';
};
const highlightCode = (code, _lang) => {
  let result = escapeHtml(code);
  const keywords = [
    'import',
    'export',
    'from',
    'default',
    'const',
    'let',
    'var',
    'function',
    'return',
    'if',
    'else',
    'for',
    'while',
    'do',
    'switch',
    'case',
    'break',
    'continue',
    'try',
    'catch',
    'finally',
    'throw',
    'class',
    'extends',
    'implements',
    'interface',
    'type',
    'enum',
    'public',
    'private',
    'protected',
    'static',
    'final',
    'abstract',
    'async',
    'await',
    'new',
    'this',
    'super',
    'null',
    'undefined',
    'true',
    'false',
    'void',
    'number',
    'string',
    'boolean',
    'any',
    'never',
    'unknown',
    'object',
    'package',
    'class',
    'interface',
    'extends',
    'implements',
    'public',
    'private',
    'protected',
    'static',
    'final',
    'abstract',
    'synchronized',
    'volatile',
    'transient',
    'native',
    'strictfp',
    'throws',
    'throw',
    'try',
    'catch',
    'finally',
    'if',
    'else',
    'switch',
    'case',
    'default',
    'for',
    'while',
    'do',
    'break',
    'continue',
    'return',
    'goto',
    'const',
    'package',
    'import',
    'public',
    'private',
    'protected',
    'static',
    'final',
    'abstract',
    'class',
    'interface',
    'extends',
    'implements',
    'native',
    'synchronized',
    'transient',
    'volatile',
    'strictfp',
    'throws',
    'throw',
    'try',
    'catch',
    'finally',
    'if',
    'else',
    'switch',
    'case',
    'default',
    'for',
    'while',
    'do',
    'break',
    'continue',
    'return',
    'goto',
    'const',
  ];
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    result = result.replace(regex, '<span class="token keyword">$1</span>');
  });
  const stringRegex = /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g;
  result = result.replace(stringRegex, (match) => `<span class="token string">${match}</span>`);
  const numberRegex = /\b(\d+\.?\d*)\b/g;
  result = result.replace(numberRegex, '<span class="token number">$1</span>');
  const commentRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
  result = result.replace(commentRegex, '<span class="token comment">$1</span>');
  const decoratorRegex = /@\w+/g;
  result = result.replace(decoratorRegex, '<span class="token decorator">$&</span>');
  const annotationRegex = /@\w+/g;
  result = result.replace(annotationRegex, '<span class="token annotation">$&</span>');
  return result;
};
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"]/g, (m) => map[m]);
};
const loadPreviewData = async () => {
  if (!props.tableName) return;
  loading.value = true;
  try {
    const config = {
      tableName: props.tableName,
      tableComment: props.config?.tableComment || '',
      className: props.config?.className || '',
      moduleName: props.config?.moduleName || '',
      packageName: props.config?.packageName || 'com.yunshu.generator',
      author: props.config?.author || '云枢',
      email: props.config?.email,
      generateType: props.config?.generateType || 'single',
      generateMenu: props.config?.generateMenu ?? true,
      generateApi: props.config?.generateApi ?? true,
      generateView: props.config?.generateView ?? true,
      generateTypeScript: props.config?.generateTypeScript ?? true,
      businessName: props.config?.businessName,
      functionName: props.config?.functionName,
      treeCodeField: props.config?.treeCodeField,
      treeParentCodeField: props.config?.treeParentCodeField,
      treeNameField: props.config?.treeNameField,
    };
    const res = await previewCode(config);
    if (res.success) {
      previewData.value = res.data;
      if (fileList.value.length > 0 && !currentFile.value) {
        currentFile.value = fileList.value[0];
      }
      ElMessage.success('代码预览加载成功');
    }
  } catch {
    ElMessage.error('加载预览数据失败');
  } finally {
    loading.value = false;
  }
};
const handleSelectFile = (file) => {
  currentFile.value = file;
  nextTick(() => {
    if (codeContentRef.value) {
      codeContentRef.value.scrollTop = 0;
    }
  });
};
const handleCopy = async () => {
  if (!currentFile.value?.content) {
    ElMessage.warning('没有可复制的内容');
    return;
  }
  try {
    await navigator.clipboard.writeText(currentFile.value.content);
    ElMessage.success('代码已复制到剪贴板');
  } catch {
    ElMessage.error('复制失败，请手动复制');
  }
};
const handleDownload = () => {
  if (!props.tableName) return;
  downloadCode(props.tableName, props.config);
  ElMessage.success('代码已生成，正在下载...');
};
const handleClose = () => {
  visible.value = false;
  currentFile.value = null;
  previewData.value = null;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ // CSS variable injection
// CSS variable injection end
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    modelValue: __VLS_ctx.visible,
    title: '代码预览',
    width: '90%',
    closeOnClickModal: false,
    ...{ class: 'preview-dialog' },
    top: '5vh',
  }),
);
const __VLS_2 = __VLS_1(
  {
    modelValue: __VLS_ctx.visible,
    title: '代码预览',
    width: '90%',
    closeOnClickModal: false,
    ...{ class: 'preview-dialog' },
    top: '5vh',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'preview-container' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'file-list' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'file-list-header' },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_ctx.fileList.length;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'file-list-content' },
});
for (const [file] of __VLS_getVForSourceType(__VLS_ctx.fileList)) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{
      onClick: (...[$event]) => {
        __VLS_ctx.handleSelectFile(file);
      },
    },
    key: file.filePath,
    ...{ class: ['file-item', { active: __VLS_ctx.currentFile?.filePath === file.filePath }] },
  });
  const __VLS_5 = {}.ElIcon;
  /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
  const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
  const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
  __VLS_8.slots.default;
  const __VLS_9 = {}.Document;
  /** @type {[typeof __VLS_components.Document, ]} */ // @ts-ignore
  const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
  const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
  var __VLS_8;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({
    ...{ class: 'file-name' },
  });
  file.fileName;
  const __VLS_13 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_14 = __VLS_asFunctionalComponent(
    __VLS_13,
    new __VLS_13({
      type: __VLS_ctx.getFileTagType(file.fileName),
      size: 'small',
    }),
  );
  const __VLS_15 = __VLS_14(
    {
      type: __VLS_ctx.getFileTagType(file.fileName),
      size: 'small',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_14),
  );
  __VLS_16.slots.default;
  __VLS_ctx.getFileExt(file.fileName);
  var __VLS_16;
}
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'code-preview' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'code-header' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'header-left' },
});
const __VLS_17 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(
  __VLS_17,
  new __VLS_17({
    ...{ class: 'file-icon' },
    color: __VLS_ctx.getFileIconColor(__VLS_ctx.currentFile?.fileName),
  }),
);
const __VLS_19 = __VLS_18(
  {
    ...{ class: 'file-icon' },
    color: __VLS_ctx.getFileIconColor(__VLS_ctx.currentFile?.fileName),
  },
  ...__VLS_functionalComponentArgsRest(__VLS_18),
);
__VLS_20.slots.default;
if (__VLS_ctx.isJavaFile(__VLS_ctx.currentFile?.fileName)) {
  const __VLS_21 = {}.Document;
  /** @type {[typeof __VLS_components.Document, ]} */ // @ts-ignore
  const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
  const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
} else if (__VLS_ctx.isVueFile(__VLS_ctx.currentFile?.fileName)) {
  const __VLS_25 = {}.DocumentCopy;
  /** @type {[typeof __VLS_components.DocumentCopy, ]} */ // @ts-ignore
  const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
  const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
} else if (__VLS_ctx.isTypeScriptFile(__VLS_ctx.currentFile?.fileName)) {
  const __VLS_29 = {}.Files;
  /** @type {[typeof __VLS_components.Files, ]} */ // @ts-ignore
  const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
  const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
} else if (__VLS_ctx.isSqlFile(__VLS_ctx.currentFile?.fileName)) {
  const __VLS_33 = {}.Key;
  /** @type {[typeof __VLS_components.Key, ]} */ // @ts-ignore
  const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
  const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
} else {
  const __VLS_37 = {}.Document;
  /** @type {[typeof __VLS_components.Document, ]} */ // @ts-ignore
  const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
  const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
}
var __VLS_20;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'file-path' },
});
__VLS_ctx.currentFile?.filePath;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'header-right' },
});
const __VLS_41 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(
  __VLS_41,
  new __VLS_41({
    ...{ onClick: {} },
    type: 'primary',
    size: 'small',
    icon: __VLS_ctx.DocumentCopy,
  }),
);
const __VLS_43 = __VLS_42(
  {
    ...{ onClick: {} },
    type: 'primary',
    size: 'small',
    icon: __VLS_ctx.DocumentCopy,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_42),
);
let __VLS_45;
let __VLS_46;
let __VLS_47;
const __VLS_48 = {
  onClick: __VLS_ctx.handleCopy,
};
__VLS_44.slots.default;
var __VLS_44;
const __VLS_49 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(
  __VLS_49,
  new __VLS_49({
    ...{ onClick: {} },
    size: 'small',
    icon: __VLS_ctx.Refresh,
  }),
);
const __VLS_51 = __VLS_50(
  {
    ...{ onClick: {} },
    size: 'small',
    icon: __VLS_ctx.Refresh,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_50),
);
let __VLS_53;
let __VLS_54;
let __VLS_55;
const __VLS_56 = {
  onClick: __VLS_ctx.loadPreviewData,
};
__VLS_52.slots.default;
var __VLS_52;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'code-content' },
  ref: 'codeContentRef',
});
/** @type {typeof __VLS_ctx.codeContentRef} */ if (__VLS_ctx.currentFile) {
  __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({});
  __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({});
  __VLS_asFunctionalDirective(__VLS_directives.vHtml)(
    null,
    { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.highlightedCode },
    null,
    null,
  );
} else {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'empty-state' },
  });
  const __VLS_57 = {}.ElEmpty;
  /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ // @ts-ignore
  const __VLS_58 = __VLS_asFunctionalComponent(
    __VLS_57,
    new __VLS_57({
      description: '请选择一个文件预览',
    }),
  );
  const __VLS_59 = __VLS_58(
    {
      description: '请选择一个文件预览',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_58),
  );
}
{
  const { footer: __VLS_thisSlot } = __VLS_3.slots;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'dialog-footer' },
  });
  const __VLS_61 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_62 = __VLS_asFunctionalComponent(
    __VLS_61,
    new __VLS_61({
      ...{ onClick: {} },
    }),
  );
  const __VLS_63 = __VLS_62(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_62),
  );
  let __VLS_65;
  let __VLS_66;
  let __VLS_67;
  const __VLS_68 = {
    onClick: __VLS_ctx.handleClose,
  };
  __VLS_64.slots.default;
  var __VLS_64;
  const __VLS_69 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_70 = __VLS_asFunctionalComponent(
    __VLS_69,
    new __VLS_69({
      ...{ onClick: {} },
      type: 'success',
      icon: __VLS_ctx.Download,
    }),
  );
  const __VLS_71 = __VLS_70(
    {
      ...{ onClick: {} },
      type: 'success',
      icon: __VLS_ctx.Download,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_70),
  );
  let __VLS_73;
  let __VLS_74;
  let __VLS_75;
  const __VLS_76 = {
    onClick: __VLS_ctx.handleDownload,
  };
  __VLS_72.slots.default;
  var __VLS_72;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['preview-dialog']} */ /** @type {__VLS_StyleScopedClasses['preview-container']} */ /** @type {__VLS_StyleScopedClasses['file-list']} */ /** @type {__VLS_StyleScopedClasses['file-list-header']} */ /** @type {__VLS_StyleScopedClasses['file-list-content']} */ /** @type {__VLS_StyleScopedClasses['file-name']} */ /** @type {__VLS_StyleScopedClasses['code-preview']} */ /** @type {__VLS_StyleScopedClasses['code-header']} */ /** @type {__VLS_StyleScopedClasses['header-left']} */ /** @type {__VLS_StyleScopedClasses['file-icon']} */ /** @type {__VLS_StyleScopedClasses['file-path']} */ /** @type {__VLS_StyleScopedClasses['header-right']} */ /** @type {__VLS_StyleScopedClasses['code-content']} */ /** @type {__VLS_StyleScopedClasses['empty-state']} */ /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Document: Document,
      DocumentCopy: DocumentCopy,
      Download: Download,
      Refresh: Refresh,
      Files: Files,
      Key: Key,
      visible: visible,
      codeContentRef: codeContentRef,
      fileList: fileList,
      currentFile: currentFile,
      highlightedCode: highlightedCode,
      getFileExt: getFileExt,
      getFileTagType: getFileTagType,
      getFileIconColor: getFileIconColor,
      isJavaFile: isJavaFile,
      isVueFile: isVueFile,
      isTypeScriptFile: isTypeScriptFile,
      isSqlFile: isSqlFile,
      loadPreviewData: loadPreviewData,
      handleSelectFile: handleSelectFile,
      handleCopy: handleCopy,
      handleDownload: handleDownload,
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
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=GenPreview.vue.js.map

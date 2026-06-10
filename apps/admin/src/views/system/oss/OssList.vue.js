/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Upload, Delete, Setting } from '@element-plus/icons-vue';
import { getOssPage, deleteOss, batchDeleteOss, downloadOss } from '@/api/system/oss.api';
import OssUploadDialog from './OssUpload.vue';
import OssConfigDialog from './OssConfig.vue';
// 状态
const loading = ref(false);
const fileList = ref([]);
const total = ref(0);
const selectedRows = ref([]);
const uploadVisible = ref(false);
const configVisible = ref(false);
const previewVisible = ref(false);
const previewFile = ref(null);
const previewUrl = ref('');
// 查询参数
const queryParams = reactive({
  keyword: '',
  storageType: undefined,
  fileType: '',
  pageNum: 1,
  pageSize: 10,
});
// 格式化文件大小
function formatFileSize(size) {
  if (size === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return `${(size / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
// 获取存储类型名称
function getStorageTypeName(type) {
  const typeMap = {
    local: '本地',
    aliyun: '阿里云OSS',
    qcloud: '腾讯云COS',
    qiniu: '七牛云',
  };
  return typeMap[type] || type;
}
// 获取存储类型标签类型
function getStorageTypeTag(type) {
  const typeMap = {
    local: 'info',
    aliyun: 'success',
    qcloud: 'warning',
    qiniu: 'danger',
  };
  return typeMap[type] || 'info';
}
// 判断是否为图片文件
function isImageFile(fileType) {
  if (!fileType) return false;
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileType.toLowerCase());
}
// 加载文件列表
async function fetchFileList() {
  loading.value = true;
  try {
    const res = await getOssPage(queryParams);
    fileList.value = res.rows;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}
// 查询
function handleQuery() {
  queryParams.pageNum = 1;
  fetchFileList();
}
// 重置查询
function resetQuery() {
  queryParams.keyword = '';
  queryParams.storageType = undefined;
  queryParams.fileType = '';
  queryParams.pageNum = 1;
  handleQuery();
}
// 刷新表格
function refreshTable() {
  fetchFileList();
}
// 上传
function handleUpload() {
  uploadVisible.value = true;
}
// 配置
function handleConfig() {
  configVisible.value = true;
}
// 预览
async function handlePreview(row) {
  previewFile.value = row;
  if (isImageFile(row.fileType)) {
    previewUrl.value = row.url;
    previewVisible.value = true;
  } else {
    previewVisible.value = true;
  }
}
// 下载
async function handleDownload(row) {
  try {
    await downloadOss(row.id);
    ElMessage.success('下载成功');
  } catch (error) {
    ElMessage.error('下载失败');
  }
}
// 删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`是否确认删除文件"${row.fileName}"？`, '提示', {
      type: 'warning',
    });
    await deleteOss(row.id);
    ElMessage.success('删除成功');
    fetchFileList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error);
    }
  }
}
// 批量删除
async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(`是否确认删除选中的${selectedRows.value.length}个文件？`, '提示', {
      type: 'warning',
    });
    const ids = selectedRows.value.map((row) => row.id);
    await batchDeleteOss(ids);
    ElMessage.success('删除成功');
    fetchFileList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error);
    }
  }
}
// 批量选择
function handleSelectionChange(selection) {
  selectedRows.value = selection;
}
// 初始化
onMounted(() => {
  fetchFileList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection
// CSS variable injection end
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'oss-list' },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    shadow: 'never',
    ...{ class: 'search-card' },
  }),
);
const __VLS_2 = __VLS_1(
  {
    shadow: 'never',
    ...{ class: 'search-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
__VLS_3.slots.default;
const __VLS_4 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(
  __VLS_4,
  new __VLS_4({
    model: __VLS_ctx.queryParams,
    inline: true,
  }),
);
const __VLS_6 = __VLS_5(
  {
    model: __VLS_ctx.queryParams,
    inline: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_5),
);
__VLS_7.slots.default;
const __VLS_8 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(
  __VLS_8,
  new __VLS_8({
    label: '关键词',
    prop: 'keyword',
  }),
);
const __VLS_10 = __VLS_9(
  {
    label: '关键词',
    prop: 'keyword',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(
  __VLS_12,
  new __VLS_12({
    ...{ onKeyup: {} },
    modelValue: __VLS_ctx.queryParams.keyword,
    placeholder: '请输入文件名称',
    clearable: true,
  }),
);
const __VLS_14 = __VLS_13(
  {
    ...{ onKeyup: {} },
    modelValue: __VLS_ctx.queryParams.keyword,
    placeholder: '请输入文件名称',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_13),
);
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
  onKeyup: __VLS_ctx.handleQuery,
};
var __VLS_15;
var __VLS_11;
const __VLS_20 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    label: '存储类型',
    prop: 'storageType',
  }),
);
const __VLS_22 = __VLS_21(
  {
    label: '存储类型',
    prop: 'storageType',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
__VLS_23.slots.default;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(
  __VLS_24,
  new __VLS_24({
    modelValue: __VLS_ctx.queryParams.storageType,
    placeholder: '请选择存储类型',
    clearable: true,
  }),
);
const __VLS_26 = __VLS_25(
  {
    modelValue: __VLS_ctx.queryParams.storageType,
    placeholder: '请选择存储类型',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_25),
);
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(
  __VLS_28,
  new __VLS_28({
    label: '本地存储',
    value: 'local',
  }),
);
const __VLS_30 = __VLS_29(
  {
    label: '本地存储',
    value: 'local',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    label: '阿里云OSS',
    value: 'aliyun',
  }),
);
const __VLS_34 = __VLS_33(
  {
    label: '阿里云OSS',
    value: 'aliyun',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(
  __VLS_36,
  new __VLS_36({
    label: '腾讯云COS',
    value: 'qcloud',
  }),
);
const __VLS_38 = __VLS_37(
  {
    label: '腾讯云COS',
    value: 'qcloud',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_37),
);
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(
  __VLS_40,
  new __VLS_40({
    label: '七牛云',
    value: 'qiniu',
  }),
);
const __VLS_42 = __VLS_41(
  {
    label: '七牛云',
    value: 'qiniu',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_41),
);
var __VLS_27;
var __VLS_23;
const __VLS_44 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(
  __VLS_44,
  new __VLS_44({
    label: '文件类型',
    prop: 'fileType',
  }),
);
const __VLS_46 = __VLS_45(
  {
    label: '文件类型',
    prop: 'fileType',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_45),
);
__VLS_47.slots.default;
const __VLS_48 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(
  __VLS_48,
  new __VLS_48({
    modelValue: __VLS_ctx.queryParams.fileType,
    placeholder: '请选择文件类型',
    clearable: true,
  }),
);
const __VLS_50 = __VLS_49(
  {
    modelValue: __VLS_ctx.queryParams.fileType,
    placeholder: '请选择文件类型',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_49),
);
__VLS_51.slots.default;
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(
  __VLS_52,
  new __VLS_52({
    label: '图片',
    value: 'jpg,png,gif,jpeg',
  }),
);
const __VLS_54 = __VLS_53(
  {
    label: '图片',
    value: 'jpg,png,gif,jpeg',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_53),
);
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(
  __VLS_56,
  new __VLS_56({
    label: '文档',
    value: 'pdf,doc,docx,xls,xlsx',
  }),
);
const __VLS_58 = __VLS_57(
  {
    label: '文档',
    value: 'pdf,doc,docx,xls,xlsx',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_57),
);
const __VLS_60 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(
  __VLS_60,
  new __VLS_60({
    label: '视频',
    value: 'mp4,avi,rmvb',
  }),
);
const __VLS_62 = __VLS_61(
  {
    label: '视频',
    value: 'mp4,avi,rmvb',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_61),
);
const __VLS_64 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(
  __VLS_64,
  new __VLS_64({
    label: '压缩包',
    value: 'zip,rar,7z',
  }),
);
const __VLS_66 = __VLS_65(
  {
    label: '压缩包',
    value: 'zip,rar,7z',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_65),
);
var __VLS_51;
var __VLS_47;
const __VLS_68 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(
  __VLS_72,
  new __VLS_72({
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  }),
);
const __VLS_74 = __VLS_73(
  {
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_73),
);
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
  onClick: __VLS_ctx.handleQuery,
};
__VLS_75.slots.default;
var __VLS_75;
const __VLS_80 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(
  __VLS_80,
  new __VLS_80({
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  }),
);
const __VLS_82 = __VLS_81(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_81),
);
let __VLS_84;
let __VLS_85;
let __VLS_86;
const __VLS_87 = {
  onClick: __VLS_ctx.resetQuery,
};
__VLS_83.slots.default;
var __VLS_83;
var __VLS_71;
var __VLS_7;
var __VLS_3;
const __VLS_88 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(
  __VLS_88,
  new __VLS_88({
    shadow: 'never',
    ...{ class: 'table-card' },
  }),
);
const __VLS_90 = __VLS_89(
  {
    shadow: 'never',
    ...{ class: 'table-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_89),
);
__VLS_91.slots.default;
{
  const { header: __VLS_thisSlot } = __VLS_91.slots;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'table-header' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'left' },
  });
  const __VLS_92 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_93 = __VLS_asFunctionalComponent(
    __VLS_92,
    new __VLS_92({
      ...{ onClick: {} },
      type: 'primary',
      icon: __VLS_ctx.Upload,
    }),
  );
  const __VLS_94 = __VLS_93(
    {
      ...{ onClick: {} },
      type: 'primary',
      icon: __VLS_ctx.Upload,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_93),
  );
  let __VLS_96;
  let __VLS_97;
  let __VLS_98;
  const __VLS_99 = {
    onClick: __VLS_ctx.handleUpload,
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:oss:upload'] },
    null,
    null,
  );
  __VLS_95.slots.default;
  var __VLS_95;
  const __VLS_100 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_101 = __VLS_asFunctionalComponent(
    __VLS_100,
    new __VLS_100({
      ...{ onClick: {} },
      type: 'danger',
      icon: __VLS_ctx.Delete,
      disabled: __VLS_ctx.selectedRows.length === 0,
    }),
  );
  const __VLS_102 = __VLS_101(
    {
      ...{ onClick: {} },
      type: 'danger',
      icon: __VLS_ctx.Delete,
      disabled: __VLS_ctx.selectedRows.length === 0,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_101),
  );
  let __VLS_104;
  let __VLS_105;
  let __VLS_106;
  const __VLS_107 = {
    onClick: __VLS_ctx.handleBatchDelete,
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:oss:remove'] },
    null,
    null,
  );
  __VLS_103.slots.default;
  var __VLS_103;
  const __VLS_108 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_109 = __VLS_asFunctionalComponent(
    __VLS_108,
    new __VLS_108({
      ...{ onClick: {} },
      type: 'warning',
      icon: __VLS_ctx.Setting,
    }),
  );
  const __VLS_110 = __VLS_109(
    {
      ...{ onClick: {} },
      type: 'warning',
      icon: __VLS_ctx.Setting,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_109),
  );
  let __VLS_112;
  let __VLS_113;
  let __VLS_114;
  const __VLS_115 = {
    onClick: __VLS_ctx.handleConfig,
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:oss:config'] },
    null,
    null,
  );
  __VLS_111.slots.default;
  var __VLS_111;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'right' },
  });
  const __VLS_116 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_117 = __VLS_asFunctionalComponent(
    __VLS_116,
    new __VLS_116({
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    }),
  );
  const __VLS_118 = __VLS_117(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_117),
  );
  let __VLS_120;
  let __VLS_121;
  let __VLS_122;
  const __VLS_123 = {
    onClick: __VLS_ctx.refreshTable,
  };
  var __VLS_119;
}
const __VLS_124 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(
  __VLS_124,
  new __VLS_124({
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.fileList,
    stripe: true,
    border: true,
  }),
);
const __VLS_126 = __VLS_125(
  {
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.fileList,
    stripe: true,
    border: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_125),
);
let __VLS_128;
let __VLS_129;
let __VLS_130;
const __VLS_131 = {
  onSelectionChange: __VLS_ctx.handleSelectionChange,
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.loading },
  null,
  null,
);
__VLS_127.slots.default;
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(
  __VLS_132,
  new __VLS_132({
    type: 'selection',
    width: '50',
    fixed: true,
  }),
);
const __VLS_134 = __VLS_133(
  {
    type: 'selection',
    width: '50',
    fixed: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_133),
);
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(
  __VLS_136,
  new __VLS_136({
    prop: 'id',
    label: '文件编号',
    width: '100',
  }),
);
const __VLS_138 = __VLS_137(
  {
    prop: 'id',
    label: '文件编号',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_137),
);
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(
  __VLS_140,
  new __VLS_140({
    prop: 'fileName',
    label: '文件名称',
    minWidth: '200',
    showOverflowTooltip: true,
  }),
);
const __VLS_142 = __VLS_141(
  {
    prop: 'fileName',
    label: '文件名称',
    minWidth: '200',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_141),
);
const __VLS_144 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(
  __VLS_144,
  new __VLS_144({
    prop: 'fileType',
    label: '文件类型',
    width: '100',
  }),
);
const __VLS_146 = __VLS_145(
  {
    prop: 'fileType',
    label: '文件类型',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_145),
);
__VLS_147.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_147.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_148 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_149 = __VLS_asFunctionalComponent(
    __VLS_148,
    new __VLS_148({
      size: 'small',
    }),
  );
  const __VLS_150 = __VLS_149(
    {
      size: 'small',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_149),
  );
  __VLS_151.slots.default;
  row.fileType.toUpperCase();
  var __VLS_151;
}
var __VLS_147;
const __VLS_152 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(
  __VLS_152,
  new __VLS_152({
    prop: 'fileSize',
    label: '文件大小',
    width: '120',
  }),
);
const __VLS_154 = __VLS_153(
  {
    prop: 'fileSize',
    label: '文件大小',
    width: '120',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_153),
);
__VLS_155.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_155.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  __VLS_ctx.formatFileSize(row.fileSize);
}
var __VLS_155;
const __VLS_156 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(
  __VLS_156,
  new __VLS_156({
    prop: 'storageType',
    label: '存储类型',
    width: '120',
  }),
);
const __VLS_158 = __VLS_157(
  {
    prop: 'storageType',
    label: '存储类型',
    width: '120',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_157),
);
__VLS_159.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_159.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_160 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_161 = __VLS_asFunctionalComponent(
    __VLS_160,
    new __VLS_160({
      type: __VLS_ctx.getStorageTypeTag(row.storageType),
    }),
  );
  const __VLS_162 = __VLS_161(
    {
      type: __VLS_ctx.getStorageTypeTag(row.storageType),
    },
    ...__VLS_functionalComponentArgsRest(__VLS_161),
  );
  __VLS_163.slots.default;
  __VLS_ctx.getStorageTypeName(row.storageType);
  var __VLS_163;
}
var __VLS_159;
const __VLS_164 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(
  __VLS_164,
  new __VLS_164({
    prop: 'createBy',
    label: '上传者',
    width: '120',
  }),
);
const __VLS_166 = __VLS_165(
  {
    prop: 'createBy',
    label: '上传者',
    width: '120',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_165),
);
const __VLS_168 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(
  __VLS_168,
  new __VLS_168({
    prop: 'createTime',
    label: '上传时间',
    width: '180',
  }),
);
const __VLS_170 = __VLS_169(
  {
    prop: 'createTime',
    label: '上传时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_169),
);
const __VLS_172 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(
  __VLS_172,
  new __VLS_172({
    label: '操作',
    width: '200',
    fixed: 'right',
  }),
);
const __VLS_174 = __VLS_173(
  {
    label: '操作',
    width: '200',
    fixed: 'right',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_173),
);
__VLS_175.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_175.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_176 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_177 = __VLS_asFunctionalComponent(
    __VLS_176,
    new __VLS_176({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_178 = __VLS_177(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_177),
  );
  let __VLS_180;
  let __VLS_181;
  let __VLS_182;
  const __VLS_183 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handlePreview(row);
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:oss:preview'] },
    null,
    null,
  );
  __VLS_179.slots.default;
  var __VLS_179;
  const __VLS_184 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_185 = __VLS_asFunctionalComponent(
    __VLS_184,
    new __VLS_184({
      ...{ onClick: {} },
      link: true,
      type: 'success',
    }),
  );
  const __VLS_186 = __VLS_185(
    {
      ...{ onClick: {} },
      link: true,
      type: 'success',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_185),
  );
  let __VLS_188;
  let __VLS_189;
  let __VLS_190;
  const __VLS_191 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleDownload(row);
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:oss:download'] },
    null,
    null,
  );
  __VLS_187.slots.default;
  var __VLS_187;
  const __VLS_192 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_193 = __VLS_asFunctionalComponent(
    __VLS_192,
    new __VLS_192({
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    }),
  );
  const __VLS_194 = __VLS_193(
    {
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_193),
  );
  let __VLS_196;
  let __VLS_197;
  let __VLS_198;
  const __VLS_199 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleDelete(row);
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:oss:remove'] },
    null,
    null,
  );
  __VLS_195.slots.default;
  var __VLS_195;
}
var __VLS_175;
var __VLS_127;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pagination' },
});
const __VLS_200 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(
  __VLS_200,
  new __VLS_200({
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
);
const __VLS_202 = __VLS_201(
  {
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_201),
);
let __VLS_204;
let __VLS_205;
let __VLS_206;
const __VLS_207 = {
  onSizeChange: __VLS_ctx.handleQuery,
};
const __VLS_208 = {
  onCurrentChange: __VLS_ctx.handleQuery,
};
var __VLS_203;
var __VLS_91;
/** @type {[typeof OssUploadDialog, ]} */ // @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(
  OssUploadDialog,
  new OssUploadDialog({
    ...{ onRefresh: {} },
    modelValue: __VLS_ctx.uploadVisible,
  }),
);
const __VLS_210 = __VLS_209(
  {
    ...{ onRefresh: {} },
    modelValue: __VLS_ctx.uploadVisible,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_209),
);
let __VLS_212;
let __VLS_213;
let __VLS_214;
const __VLS_215 = {
  onRefresh: __VLS_ctx.handleQuery,
};
var __VLS_211;
/** @type {[typeof OssConfigDialog, ]} */ // @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent(
  OssConfigDialog,
  new OssConfigDialog({
    ...{ onRefresh: {} },
    modelValue: __VLS_ctx.configVisible,
  }),
);
const __VLS_217 = __VLS_216(
  {
    ...{ onRefresh: {} },
    modelValue: __VLS_ctx.configVisible,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_216),
);
let __VLS_219;
let __VLS_220;
let __VLS_221;
const __VLS_222 = {
  onRefresh: __VLS_ctx.refreshTable,
};
var __VLS_218;
const __VLS_223 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_224 = __VLS_asFunctionalComponent(
  __VLS_223,
  new __VLS_223({
    modelValue: __VLS_ctx.previewVisible,
    title: '文件预览',
    width: '800px',
    appendToBody: true,
  }),
);
const __VLS_225 = __VLS_224(
  {
    modelValue: __VLS_ctx.previewVisible,
    title: '文件预览',
    width: '800px',
    appendToBody: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_224),
);
__VLS_226.slots.default;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'preview-container' },
});
if (__VLS_ctx.isImageFile(__VLS_ctx.previewFile?.fileType)) {
  __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: __VLS_ctx.previewUrl,
    ...{ class: 'preview-image' },
  });
} else {
  const __VLS_227 = {}.ElEmpty;
  /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ // @ts-ignore
  const __VLS_228 = __VLS_asFunctionalComponent(
    __VLS_227,
    new __VLS_227({
      description: '该文件类型不支持预览，请下载后查看',
    }),
  );
  const __VLS_229 = __VLS_228(
    {
      description: '该文件类型不支持预览，请下载后查看',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_228),
  );
}
var __VLS_226;
/** @type {__VLS_StyleScopedClasses['oss-list']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['table-header']} */ /** @type {__VLS_StyleScopedClasses['left']} */ /** @type {__VLS_StyleScopedClasses['right']} */ /** @type {__VLS_StyleScopedClasses['pagination']} */ /** @type {__VLS_StyleScopedClasses['preview-container']} */ /** @type {__VLS_StyleScopedClasses['preview-image']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      Upload: Upload,
      Delete: Delete,
      Setting: Setting,
      OssUploadDialog: OssUploadDialog,
      OssConfigDialog: OssConfigDialog,
      loading: loading,
      fileList: fileList,
      total: total,
      selectedRows: selectedRows,
      uploadVisible: uploadVisible,
      configVisible: configVisible,
      previewVisible: previewVisible,
      previewFile: previewFile,
      previewUrl: previewUrl,
      queryParams: queryParams,
      formatFileSize: formatFileSize,
      getStorageTypeName: getStorageTypeName,
      getStorageTypeTag: getStorageTypeTag,
      isImageFile: isImageFile,
      handleQuery: handleQuery,
      resetQuery: resetQuery,
      refreshTable: refreshTable,
      handleUpload: handleUpload,
      handleConfig: handleConfig,
      handlePreview: handlePreview,
      handleDownload: handleDownload,
      handleDelete: handleDelete,
      handleBatchDelete: handleBatchDelete,
      handleSelectionChange: handleSelectionChange,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=OssList.vue.js.map

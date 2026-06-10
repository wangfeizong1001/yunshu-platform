/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Delete, Download } from '@element-plus/icons-vue';
import * as logininforApi from '@/api/monitor/logininfor.api';
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const selectedIds = ref([]);
const dateRange = ref(null);
const detailVisible = ref(false);
const currentRow = ref(null);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('zh-CN');
};
const handleQuery = async () => {
  loading.value = true;
  try {
    if (dateRange.value) {
      queryParams.startTime = dateRange.value[0];
      queryParams.endTime = dateRange.value[1];
    } else {
      delete queryParams.startTime;
      delete queryParams.endTime;
    }
    const res = await logininforApi.getLogininforPage(queryParams);
    const responseData = res;
    if (responseData.success) {
      tableData.value = responseData.data;
      const pagination = responseData.pagination;
      total.value = Number(pagination.total) || 0;
    }
  } catch {
    ElMessage.error('获取登录日志失败');
  } finally {
    loading.value = false;
  }
};
const handleReset = () => {
  queryParams.pageNum = 1;
  queryParams.pageSize = 10;
  queryParams.userName = undefined;
  delete queryParams.startTime;
  delete queryParams.endTime;
  dateRange.value = null;
  handleQuery();
};
const handleRefresh = () => {
  handleQuery();
};
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => Number(item.infoId));
};
const handleViewDetail = (row) => {
  currentRow.value = row;
  detailVisible.value = true;
};
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该登录日志吗？', '提示', { type: 'warning' });
    await logininforApi.deleteLogininfor(row.infoId);
    ElMessage.success('删除成功');
    handleQuery();
  } catch {
    // 用户取消
  }
};
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedIds.value.length} 条登录日志吗？`,
      '提示',
      { type: 'warning' },
    );
    await logininforApi.batchDeleteLogininfor(selectedIds.value);
    ElMessage.success('删除成功');
    handleQuery();
  } catch {
    // 用户取消
  }
};
const handleClean = async () => {
  try {
    await ElMessageBox.confirm('确认清空所有登录日志吗？此操作不可恢复！', '警告', {
      type: 'warning',
    });
    await logininforApi.cleanLogininfor();
    ElMessage.success('清空成功');
    handleQuery();
  } catch {
    // 用户取消
  }
};
const handleExport = () => {
  logininforApi.exportLogininfor(queryParams);
};
onMounted(() => {
  handleQuery();
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
  ...{ class: 'page-container' },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ class: 'search-card' },
  }),
);
const __VLS_2 = __VLS_1(
  {
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
    label: '用户名称',
  }),
);
const __VLS_10 = __VLS_9(
  {
    label: '用户名称',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(
  __VLS_12,
  new __VLS_12({
    modelValue: __VLS_ctx.queryParams.userName,
    placeholder: '请输入用户名称',
    clearable: true,
    ...{ style: {} },
  }),
);
const __VLS_14 = __VLS_13(
  {
    modelValue: __VLS_ctx.queryParams.userName,
    placeholder: '请输入用户名称',
    clearable: true,
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_13),
);
var __VLS_11;
const __VLS_16 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(
  __VLS_16,
  new __VLS_16({
    label: '登录状态',
  }),
);
const __VLS_18 = __VLS_17(
  {
    label: '登录状态',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_17),
);
__VLS_19.slots.default;
const __VLS_20 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择',
    clearable: true,
    ...{ style: {} },
  }),
);
const __VLS_22 = __VLS_21(
  {
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择',
    clearable: true,
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
__VLS_23.slots.default;
const __VLS_24 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(
  __VLS_24,
  new __VLS_24({
    label: '成功',
    value: '0',
  }),
);
const __VLS_26 = __VLS_25(
  {
    label: '成功',
    value: '0',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_25),
);
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(
  __VLS_28,
  new __VLS_28({
    label: '失败',
    value: '1',
  }),
);
const __VLS_30 = __VLS_29(
  {
    label: '失败',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
var __VLS_23;
var __VLS_19;
const __VLS_32 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    label: '登录时间',
  }),
);
const __VLS_34 = __VLS_33(
  {
    label: '登录时间',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
__VLS_35.slots.default;
const __VLS_36 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(
  __VLS_36,
  new __VLS_36({
    modelValue: __VLS_ctx.dateRange,
    type: 'daterange',
    rangeSeparator: '至',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    valueFormat: 'YYYY-MM-DD',
    ...{ style: {} },
  }),
);
const __VLS_38 = __VLS_37(
  {
    modelValue: __VLS_ctx.dateRange,
    type: 'daterange',
    rangeSeparator: '至',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    valueFormat: 'YYYY-MM-DD',
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_37),
);
var __VLS_35;
const __VLS_40 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(
  __VLS_44,
  new __VLS_44({
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  }),
);
const __VLS_46 = __VLS_45(
  {
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_45),
);
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
  onClick: __VLS_ctx.handleQuery,
};
__VLS_47.slots.default;
var __VLS_47;
const __VLS_52 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(
  __VLS_52,
  new __VLS_52({
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  }),
);
const __VLS_54 = __VLS_53(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_53),
);
let __VLS_56;
let __VLS_57;
let __VLS_58;
const __VLS_59 = {
  onClick: __VLS_ctx.handleReset,
};
__VLS_55.slots.default;
var __VLS_55;
var __VLS_43;
var __VLS_7;
var __VLS_3;
const __VLS_60 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(
  __VLS_60,
  new __VLS_60({
    ...{ class: 'toolbar-card' },
  }),
);
const __VLS_62 = __VLS_61(
  {
    ...{ class: 'toolbar-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_61),
);
__VLS_63.slots.default;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'toolbar' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'toolbar-left' },
});
const __VLS_64 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(
  __VLS_64,
  new __VLS_64({
    ...{ onClick: {} },
    type: 'danger',
    icon: __VLS_ctx.Delete,
    disabled: __VLS_ctx.selectedIds.length === 0,
  }),
);
const __VLS_66 = __VLS_65(
  {
    ...{ onClick: {} },
    type: 'danger',
    icon: __VLS_ctx.Delete,
    disabled: __VLS_ctx.selectedIds.length === 0,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_65),
);
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
  onClick: __VLS_ctx.handleBatchDelete,
};
__VLS_67.slots.default;
var __VLS_67;
const __VLS_72 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(
  __VLS_72,
  new __VLS_72({
    ...{ onClick: {} },
    type: 'warning',
    icon: __VLS_ctx.Delete,
  }),
);
const __VLS_74 = __VLS_73(
  {
    ...{ onClick: {} },
    type: 'warning',
    icon: __VLS_ctx.Delete,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_73),
);
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
  onClick: __VLS_ctx.handleClean,
};
__VLS_75.slots.default;
var __VLS_75;
const __VLS_80 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(
  __VLS_80,
  new __VLS_80({
    ...{ onClick: {} },
    type: 'success',
    icon: __VLS_ctx.Download,
  }),
);
const __VLS_82 = __VLS_81(
  {
    ...{ onClick: {} },
    type: 'success',
    icon: __VLS_ctx.Download,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_81),
);
let __VLS_84;
let __VLS_85;
let __VLS_86;
const __VLS_87 = {
  onClick: __VLS_ctx.handleExport,
};
__VLS_83.slots.default;
var __VLS_83;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'toolbar-right' },
});
const __VLS_88 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(
  __VLS_88,
  new __VLS_88({
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
    circle: true,
  }),
);
const __VLS_90 = __VLS_89(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
    circle: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_89),
);
let __VLS_92;
let __VLS_93;
let __VLS_94;
const __VLS_95 = {
  onClick: __VLS_ctx.handleRefresh,
};
var __VLS_91;
var __VLS_63;
const __VLS_96 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(
  __VLS_96,
  new __VLS_96({
    ...{ class: 'table-card' },
  }),
);
const __VLS_98 = __VLS_97(
  {
    ...{ class: 'table-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_97),
);
__VLS_99.slots.default;
const __VLS_100 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(
  __VLS_100,
  new __VLS_100({
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.tableData,
  }),
);
const __VLS_102 = __VLS_101(
  {
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.tableData,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_101),
);
let __VLS_104;
let __VLS_105;
let __VLS_106;
const __VLS_107 = {
  onSelectionChange: __VLS_ctx.handleSelectionChange,
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.loading },
  null,
  null,
);
__VLS_103.slots.default;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(
  __VLS_108,
  new __VLS_108({
    type: 'selection',
    width: '50',
    align: 'center',
  }),
);
const __VLS_110 = __VLS_109(
  {
    type: 'selection',
    width: '50',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_109),
);
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(
  __VLS_112,
  new __VLS_112({
    label: '访问编号',
    prop: 'infoId',
    width: '80',
    align: 'center',
  }),
);
const __VLS_114 = __VLS_113(
  {
    label: '访问编号',
    prop: 'infoId',
    width: '80',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_113),
);
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(
  __VLS_116,
  new __VLS_116({
    label: '用户名称',
    prop: 'userName',
    width: '120',
    align: 'center',
  }),
);
const __VLS_118 = __VLS_117(
  {
    label: '用户名称',
    prop: 'userName',
    width: '120',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_117),
);
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(
  __VLS_120,
  new __VLS_120({
    label: '登录状态',
    prop: 'status',
    width: '100',
    align: 'center',
  }),
);
const __VLS_122 = __VLS_121(
  {
    label: '登录状态',
    prop: 'status',
    width: '100',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_121),
);
__VLS_123.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_123.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_124 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_125 = __VLS_asFunctionalComponent(
    __VLS_124,
    new __VLS_124({
      type: row.status === '0' ? 'success' : 'danger',
    }),
  );
  const __VLS_126 = __VLS_125(
    {
      type: row.status === '0' ? 'success' : 'danger',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_125),
  );
  __VLS_127.slots.default;
  row.status === '0' ? '成功' : '失败';
  var __VLS_127;
}
var __VLS_123;
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(
  __VLS_128,
  new __VLS_128({
    label: '登录地址',
    prop: 'loginLocation',
    width: '140',
    align: 'center',
  }),
);
const __VLS_130 = __VLS_129(
  {
    label: '登录地址',
    prop: 'loginLocation',
    width: '140',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_129),
);
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(
  __VLS_132,
  new __VLS_132({
    label: '操作系统',
    prop: 'os',
    width: '120',
    align: 'center',
    showOverflowTooltip: true,
  }),
);
const __VLS_134 = __VLS_133(
  {
    label: '操作系统',
    prop: 'os',
    width: '120',
    align: 'center',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_133),
);
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(
  __VLS_136,
  new __VLS_136({
    label: '浏览器',
    prop: 'browser',
    width: '120',
    align: 'center',
    showOverflowTooltip: true,
  }),
);
const __VLS_138 = __VLS_137(
  {
    label: '浏览器',
    prop: 'browser',
    width: '120',
    align: 'center',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_137),
);
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(
  __VLS_140,
  new __VLS_140({
    label: '登录时间',
    prop: 'loginTime',
    width: '180',
    align: 'center',
  }),
);
const __VLS_142 = __VLS_141(
  {
    label: '登录时间',
    prop: 'loginTime',
    width: '180',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_141),
);
__VLS_143.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_143.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  __VLS_ctx.formatDate(row.loginTime);
}
var __VLS_143;
const __VLS_144 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(
  __VLS_144,
  new __VLS_144({
    label: '登录信息',
    prop: 'msg',
    minWidth: '200',
    showOverflowTooltip: true,
  }),
);
const __VLS_146 = __VLS_145(
  {
    label: '登录信息',
    prop: 'msg',
    minWidth: '200',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_145),
);
const __VLS_148 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(
  __VLS_148,
  new __VLS_148({
    label: '登录IP',
    prop: 'ipaddr',
    width: '140',
    align: 'center',
  }),
);
const __VLS_150 = __VLS_149(
  {
    label: '登录IP',
    prop: 'ipaddr',
    width: '140',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_149),
);
const __VLS_152 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(
  __VLS_152,
  new __VLS_152({
    label: '操作',
    width: '100',
    align: 'center',
    fixed: 'right',
  }),
);
const __VLS_154 = __VLS_153(
  {
    label: '操作',
    width: '100',
    align: 'center',
    fixed: 'right',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_153),
);
__VLS_155.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_155.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_156 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_157 = __VLS_asFunctionalComponent(
    __VLS_156,
    new __VLS_156({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_158 = __VLS_157(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_157),
  );
  let __VLS_160;
  let __VLS_161;
  let __VLS_162;
  const __VLS_163 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleViewDetail(row);
    },
  };
  __VLS_159.slots.default;
  var __VLS_159;
  const __VLS_164 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_165 = __VLS_asFunctionalComponent(
    __VLS_164,
    new __VLS_164({
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    }),
  );
  const __VLS_166 = __VLS_165(
    {
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_165),
  );
  let __VLS_168;
  let __VLS_169;
  let __VLS_170;
  const __VLS_171 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleDelete(row);
    },
  };
  __VLS_167.slots.default;
  var __VLS_167;
}
var __VLS_155;
var __VLS_103;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pagination-container' },
});
const __VLS_172 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(
  __VLS_172,
  new __VLS_172({
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    pageSizes: [10, 20, 50, 100],
    total: __VLS_ctx.total,
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
);
const __VLS_174 = __VLS_173(
  {
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    pageSizes: [10, 20, 50, 100],
    total: __VLS_ctx.total,
    layout: 'total, sizes, prev, pager, next, jumper',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_173),
);
let __VLS_176;
let __VLS_177;
let __VLS_178;
const __VLS_179 = {
  onSizeChange: __VLS_ctx.handleQuery,
};
const __VLS_180 = {
  onCurrentChange: __VLS_ctx.handleQuery,
};
var __VLS_175;
var __VLS_99;
const __VLS_181 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent(
  __VLS_181,
  new __VLS_181({
    modelValue: __VLS_ctx.detailVisible,
    title: '登录日志详情',
    width: '600px',
    destroyOnClose: true,
  }),
);
const __VLS_183 = __VLS_182(
  {
    modelValue: __VLS_ctx.detailVisible,
    title: '登录日志详情',
    width: '600px',
    destroyOnClose: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_182),
);
__VLS_184.slots.default;
const __VLS_185 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ // @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent(
  __VLS_185,
  new __VLS_185({
    column: 2,
    border: true,
  }),
);
const __VLS_187 = __VLS_186(
  {
    column: 2,
    border: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_186),
);
__VLS_188.slots.default;
const __VLS_189 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent(
  __VLS_189,
  new __VLS_189({
    label: '访问编号',
  }),
);
const __VLS_191 = __VLS_190(
  {
    label: '访问编号',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_190),
);
__VLS_192.slots.default;
__VLS_ctx.currentRow?.infoId;
var __VLS_192;
const __VLS_193 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(
  __VLS_193,
  new __VLS_193({
    label: '用户名称',
  }),
);
const __VLS_195 = __VLS_194(
  {
    label: '用户名称',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_194),
);
__VLS_196.slots.default;
__VLS_ctx.currentRow?.userName;
var __VLS_196;
const __VLS_197 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(
  __VLS_197,
  new __VLS_197({
    label: '登录状态',
  }),
);
const __VLS_199 = __VLS_198(
  {
    label: '登录状态',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_198),
);
__VLS_200.slots.default;
const __VLS_201 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent(
  __VLS_201,
  new __VLS_201({
    type: __VLS_ctx.currentRow?.status === '0' ? 'success' : 'danger',
  }),
);
const __VLS_203 = __VLS_202(
  {
    type: __VLS_ctx.currentRow?.status === '0' ? 'success' : 'danger',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_202),
);
__VLS_204.slots.default;
__VLS_ctx.currentRow?.status === '0' ? '成功' : '失败';
var __VLS_204;
var __VLS_200;
const __VLS_205 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent(
  __VLS_205,
  new __VLS_205({
    label: '登录地址',
  }),
);
const __VLS_207 = __VLS_206(
  {
    label: '登录地址',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_206),
);
__VLS_208.slots.default;
__VLS_ctx.currentRow?.loginLocation;
var __VLS_208;
const __VLS_209 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent(
  __VLS_209,
  new __VLS_209({
    label: '操作系统',
  }),
);
const __VLS_211 = __VLS_210(
  {
    label: '操作系统',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_210),
);
__VLS_212.slots.default;
__VLS_ctx.currentRow?.os;
var __VLS_212;
const __VLS_213 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent(
  __VLS_213,
  new __VLS_213({
    label: '浏览器',
  }),
);
const __VLS_215 = __VLS_214(
  {
    label: '浏览器',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_214),
);
__VLS_216.slots.default;
__VLS_ctx.currentRow?.browser;
var __VLS_216;
const __VLS_217 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent(
  __VLS_217,
  new __VLS_217({
    label: '登录时间',
    span: 2,
  }),
);
const __VLS_219 = __VLS_218(
  {
    label: '登录时间',
    span: 2,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_218),
);
__VLS_220.slots.default;
__VLS_ctx.formatDate(__VLS_ctx.currentRow?.loginTime);
var __VLS_220;
const __VLS_221 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent(
  __VLS_221,
  new __VLS_221({
    label: '登录IP',
  }),
);
const __VLS_223 = __VLS_222(
  {
    label: '登录IP',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_222),
);
__VLS_224.slots.default;
__VLS_ctx.currentRow?.ipaddr;
var __VLS_224;
const __VLS_225 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent(
  __VLS_225,
  new __VLS_225({
    label: '登录信息',
    span: 2,
  }),
);
const __VLS_227 = __VLS_226(
  {
    label: '登录信息',
    span: 2,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_226),
);
__VLS_228.slots.default;
__VLS_ctx.currentRow?.msg;
var __VLS_228;
var __VLS_188;
var __VLS_184;
/** @type {__VLS_StyleScopedClasses['page-container']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['toolbar-card']} */ /** @type {__VLS_StyleScopedClasses['toolbar']} */ /** @type {__VLS_StyleScopedClasses['toolbar-left']} */ /** @type {__VLS_StyleScopedClasses['toolbar-right']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['pagination-container']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      Delete: Delete,
      Download: Download,
      loading: loading,
      tableData: tableData,
      total: total,
      selectedIds: selectedIds,
      dateRange: dateRange,
      detailVisible: detailVisible,
      currentRow: currentRow,
      queryParams: queryParams,
      formatDate: formatDate,
      handleQuery: handleQuery,
      handleReset: handleReset,
      handleRefresh: handleRefresh,
      handleSelectionChange: handleSelectionChange,
      handleViewDetail: handleViewDetail,
      handleDelete: handleDelete,
      handleBatchDelete: handleBatchDelete,
      handleClean: handleClean,
      handleExport: handleExport,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=LogininforList.vue.js.map

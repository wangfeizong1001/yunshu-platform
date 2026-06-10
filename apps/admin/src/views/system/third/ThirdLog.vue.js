/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { Search, Refresh } from '@element-plus/icons-vue';
import { getThirdLoginLogList } from '@/api/system/third.api';
// 状态
const loading = ref(false);
const logList = ref([]);
const total = ref(0);
const dateRange = ref([]);
// 查询参数
const queryParams = reactive({
  platform: undefined,
  username: '',
  status: undefined,
  startDate: '',
  endDate: '',
  pageNum: 1,
  pageSize: 10,
});
// 获取平台名称
function getPlatformName(platform) {
  const platformMap = {
    wechat: '微信',
    github: 'GitHub',
    wecom: '企业微信',
    dingtalk: '钉钉',
  };
  return platformMap[platform] || platform;
}
// 加载日志列表
async function fetchLogList() {
  loading.value = true;
  try {
    // 处理日期范围
    if (dateRange.value && dateRange.value.length === 2) {
      queryParams.startDate = dateRange.value[0];
      queryParams.endDate = dateRange.value[1];
    } else {
      queryParams.startDate = '';
      queryParams.endDate = '';
    }
    const res = await getThirdLoginLogList(queryParams);
    logList.value = res.rows;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}
// 查询
function handleQuery() {
  queryParams.pageNum = 1;
  fetchLogList();
}
// 重置查询
function resetQuery() {
  queryParams.platform = undefined;
  queryParams.username = '';
  queryParams.status = undefined;
  dateRange.value = [];
  queryParams.pageNum = 1;
  handleQuery();
}
// 刷新表格
function refreshTable() {
  fetchLogList();
}
// 初始化
onMounted(() => {
  fetchLogList();
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
  ...{ class: 'third-log' },
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
    label: '平台',
    prop: 'platform',
  }),
);
const __VLS_10 = __VLS_9(
  {
    label: '平台',
    prop: 'platform',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
__VLS_11.slots.default;
const __VLS_12 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(
  __VLS_12,
  new __VLS_12({
    modelValue: __VLS_ctx.queryParams.platform,
    placeholder: '请选择平台',
    clearable: true,
  }),
);
const __VLS_14 = __VLS_13(
  {
    modelValue: __VLS_ctx.queryParams.platform,
    placeholder: '请选择平台',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_13),
);
__VLS_15.slots.default;
const __VLS_16 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(
  __VLS_16,
  new __VLS_16({
    label: '微信',
    value: 'wechat',
  }),
);
const __VLS_18 = __VLS_17(
  {
    label: '微信',
    value: 'wechat',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_17),
);
const __VLS_20 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    label: 'GitHub',
    value: 'github',
  }),
);
const __VLS_22 = __VLS_21(
  {
    label: 'GitHub',
    value: 'github',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
const __VLS_24 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(
  __VLS_24,
  new __VLS_24({
    label: '企业微信',
    value: 'wecom',
  }),
);
const __VLS_26 = __VLS_25(
  {
    label: '企业微信',
    value: 'wecom',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_25),
);
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(
  __VLS_28,
  new __VLS_28({
    label: '钉钉',
    value: 'dingtalk',
  }),
);
const __VLS_30 = __VLS_29(
  {
    label: '钉钉',
    value: 'dingtalk',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
var __VLS_15;
var __VLS_11;
const __VLS_32 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    label: '用户名',
    prop: 'username',
  }),
);
const __VLS_34 = __VLS_33(
  {
    label: '用户名',
    prop: 'username',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
__VLS_35.slots.default;
const __VLS_36 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(
  __VLS_36,
  new __VLS_36({
    ...{ onKeyup: {} },
    modelValue: __VLS_ctx.queryParams.username,
    placeholder: '请输入用户名',
    clearable: true,
  }),
);
const __VLS_38 = __VLS_37(
  {
    ...{ onKeyup: {} },
    modelValue: __VLS_ctx.queryParams.username,
    placeholder: '请输入用户名',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_37),
);
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
  onKeyup: __VLS_ctx.handleQuery,
};
var __VLS_39;
var __VLS_35;
const __VLS_44 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(
  __VLS_44,
  new __VLS_44({
    label: '状态',
    prop: 'status',
  }),
);
const __VLS_46 = __VLS_45(
  {
    label: '状态',
    prop: 'status',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_45),
);
__VLS_47.slots.default;
const __VLS_48 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(
  __VLS_48,
  new __VLS_48({
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
    clearable: true,
  }),
);
const __VLS_50 = __VLS_49(
  {
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
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
    label: '成功',
    value: '1',
  }),
);
const __VLS_54 = __VLS_53(
  {
    label: '成功',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_53),
);
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(
  __VLS_56,
  new __VLS_56({
    label: '失败',
    value: '0',
  }),
);
const __VLS_58 = __VLS_57(
  {
    label: '失败',
    value: '0',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_57),
);
var __VLS_51;
var __VLS_47;
const __VLS_60 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(
  __VLS_60,
  new __VLS_60({
    label: '登录时间',
  }),
);
const __VLS_62 = __VLS_61(
  {
    label: '登录时间',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_61),
);
__VLS_63.slots.default;
const __VLS_64 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ // @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(
  __VLS_64,
  new __VLS_64({
    modelValue: __VLS_ctx.dateRange,
    type: 'daterange',
    rangeSeparator: '至',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    valueFormat: 'YYYY-MM-DD',
  }),
);
const __VLS_66 = __VLS_65(
  {
    modelValue: __VLS_ctx.dateRange,
    type: 'daterange',
    rangeSeparator: '至',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    valueFormat: 'YYYY-MM-DD',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_65),
);
var __VLS_63;
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
    ...{ class: 'card-header' },
  });
  __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
  const __VLS_92 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_93 = __VLS_asFunctionalComponent(
    __VLS_92,
    new __VLS_92({
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    }),
  );
  const __VLS_94 = __VLS_93(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_93),
  );
  let __VLS_96;
  let __VLS_97;
  let __VLS_98;
  const __VLS_99 = {
    onClick: __VLS_ctx.refreshTable,
  };
  var __VLS_95;
}
const __VLS_100 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(
  __VLS_100,
  new __VLS_100({
    data: __VLS_ctx.logList,
    stripe: true,
    border: true,
  }),
);
const __VLS_102 = __VLS_101(
  {
    data: __VLS_ctx.logList,
    stripe: true,
    border: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_101),
);
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.loading },
  null,
  null,
);
__VLS_103.slots.default;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(
  __VLS_104,
  new __VLS_104({
    prop: 'id',
    label: '日志ID',
    width: '80',
  }),
);
const __VLS_106 = __VLS_105(
  {
    prop: 'id',
    label: '日志ID',
    width: '80',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_105),
);
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(
  __VLS_108,
  new __VLS_108({
    prop: 'platform',
    label: '平台',
    width: '100',
  }),
);
const __VLS_110 = __VLS_109(
  {
    prop: 'platform',
    label: '平台',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_109),
);
__VLS_111.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_111.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_112 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_113 = __VLS_asFunctionalComponent(
    __VLS_112,
    new __VLS_112({
      size: 'small',
    }),
  );
  const __VLS_114 = __VLS_113(
    {
      size: 'small',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_113),
  );
  __VLS_115.slots.default;
  __VLS_ctx.getPlatformName(row.platform);
  var __VLS_115;
}
var __VLS_111;
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(
  __VLS_116,
  new __VLS_116({
    prop: 'openId',
    label: 'Open ID',
    width: '180',
    showOverflowTooltip: true,
  }),
);
const __VLS_118 = __VLS_117(
  {
    prop: 'openId',
    label: 'Open ID',
    width: '180',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_117),
);
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(
  __VLS_120,
  new __VLS_120({
    prop: 'username',
    label: '用户名',
    width: '120',
  }),
);
const __VLS_122 = __VLS_121(
  {
    prop: 'username',
    label: '用户名',
    width: '120',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_121),
);
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(
  __VLS_124,
  new __VLS_124({
    prop: 'nickname',
    label: '昵称',
    width: '120',
  }),
);
const __VLS_126 = __VLS_125(
  {
    prop: 'nickname',
    label: '昵称',
    width: '120',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_125),
);
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(
  __VLS_128,
  new __VLS_128({
    prop: 'email',
    label: '邮箱',
    width: '180',
    showOverflowTooltip: true,
  }),
);
const __VLS_130 = __VLS_129(
  {
    prop: 'email',
    label: '邮箱',
    width: '180',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_129),
);
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(
  __VLS_132,
  new __VLS_132({
    prop: 'userName',
    label: '关联账号',
    width: '120',
  }),
);
const __VLS_134 = __VLS_133(
  {
    prop: 'userName',
    label: '关联账号',
    width: '120',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_133),
);
__VLS_135.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_135.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  row.userName || '-';
}
var __VLS_135;
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(
  __VLS_136,
  new __VLS_136({
    prop: 'ip',
    label: 'IP 地址',
    width: '140',
  }),
);
const __VLS_138 = __VLS_137(
  {
    prop: 'ip',
    label: 'IP 地址',
    width: '140',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_137),
);
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(
  __VLS_140,
  new __VLS_140({
    prop: 'status',
    label: '状态',
    width: '80',
  }),
);
const __VLS_142 = __VLS_141(
  {
    prop: 'status',
    label: '状态',
    width: '80',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_141),
);
__VLS_143.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_143.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_144 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_145 = __VLS_asFunctionalComponent(
    __VLS_144,
    new __VLS_144({
      type: row.status === '1' ? 'success' : 'danger',
      size: 'small',
    }),
  );
  const __VLS_146 = __VLS_145(
    {
      type: row.status === '1' ? 'success' : 'danger',
      size: 'small',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_145),
  );
  __VLS_147.slots.default;
  row.status === '1' ? '成功' : '失败';
  var __VLS_147;
}
var __VLS_143;
const __VLS_148 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(
  __VLS_148,
  new __VLS_148({
    prop: 'loginTime',
    label: '登录时间',
    width: '180',
  }),
);
const __VLS_150 = __VLS_149(
  {
    prop: 'loginTime',
    label: '登录时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_149),
);
const __VLS_152 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(
  __VLS_152,
  new __VLS_152({
    prop: 'errorMsg',
    label: '错误信息',
    minWidth: '150',
    showOverflowTooltip: true,
  }),
);
const __VLS_154 = __VLS_153(
  {
    prop: 'errorMsg',
    label: '错误信息',
    minWidth: '150',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_153),
);
__VLS_155.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_155.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  row.errorMsg || '-';
}
var __VLS_155;
var __VLS_103;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pagination' },
});
const __VLS_156 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(
  __VLS_156,
  new __VLS_156({
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
);
const __VLS_158 = __VLS_157(
  {
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_157),
);
let __VLS_160;
let __VLS_161;
let __VLS_162;
const __VLS_163 = {
  onSizeChange: __VLS_ctx.handleQuery,
};
const __VLS_164 = {
  onCurrentChange: __VLS_ctx.handleQuery,
};
var __VLS_159;
var __VLS_91;
/** @type {__VLS_StyleScopedClasses['third-log']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['card-header']} */ /** @type {__VLS_StyleScopedClasses['pagination']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      loading: loading,
      logList: logList,
      total: total,
      dateRange: dateRange,
      queryParams: queryParams,
      getPlatformName: getPlatformName,
      handleQuery: handleQuery,
      resetQuery: resetQuery,
      refreshTable: refreshTable,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ThirdLog.vue.js.map

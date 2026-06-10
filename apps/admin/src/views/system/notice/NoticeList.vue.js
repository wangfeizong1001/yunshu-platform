/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus } from '@element-plus/icons-vue';
import {
  getNoticePage,
  deleteNotice,
  publishNotice,
  withdrawNotice,
} from '@/api/system/notice.api';
import NoticeForm from './NoticeForm.vue';
import NoticeDetail from './NoticeDetail.vue';
// 状态
const loading = ref(false);
const noticeList = ref([]);
const total = ref(0);
const selectedRows = ref([]);
const formVisible = ref(false);
const detailVisible = ref(false);
const currentNotice = ref(null);
const currentNoticeId = ref();
// 查询参数
const queryParams = reactive({
  keyword: '',
  noticeType: undefined,
  status: undefined,
  pageNum: 1,
  pageSize: 10,
});
// 加载公告列表
async function fetchNoticeList() {
  loading.value = true;
  try {
    const res = await getNoticePage(queryParams);
    noticeList.value = res.rows;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}
// 查询
function handleQuery() {
  queryParams.pageNum = 1;
  fetchNoticeList();
}
// 重置查询
function resetQuery() {
  queryParams.keyword = '';
  queryParams.noticeType = undefined;
  queryParams.status = undefined;
  queryParams.pageNum = 1;
  handleQuery();
}
// 刷新表格
function refreshTable() {
  fetchNoticeList();
}
// 新增
function handleAdd() {
  currentNotice.value = null;
  formVisible.value = true;
}
// 编辑
function handleEdit(row) {
  currentNotice.value = { ...row };
  formVisible.value = true;
}
// 查看
function handleView(row) {
  currentNoticeId.value = row.noticeId;
  detailVisible.value = true;
}
// 发布
async function handlePublish(row) {
  try {
    await ElMessageBox.confirm(`是否确认发布公告"${row.noticeTitle}"？`, '提示', {
      type: 'warning',
    });
    await publishNotice(row.noticeId);
    ElMessage.success('发布成功');
    fetchNoticeList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('发布失败', error);
    }
  }
}
// 撤回
async function handleWithdraw(row) {
  try {
    await ElMessageBox.confirm(`是否确认撤回公告"${row.noticeTitle}"？`, '提示', {
      type: 'warning',
    });
    await withdrawNotice(row.noticeId);
    ElMessage.success('撤回成功');
    fetchNoticeList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('撤回失败', error);
    }
  }
}
// 删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`是否确认删除公告"${row.noticeTitle}"？`, '提示', {
      type: 'warning',
    });
    await deleteNotice(row.noticeId);
    ElMessage.success('删除成功');
    fetchNoticeList();
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
  fetchNoticeList();
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
  ...{ class: 'notice-list' },
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
    placeholder: '请输入公告标题',
    clearable: true,
  }),
);
const __VLS_14 = __VLS_13(
  {
    ...{ onKeyup: {} },
    modelValue: __VLS_ctx.queryParams.keyword,
    placeholder: '请输入公告标题',
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
    label: '公告类型',
    prop: 'noticeType',
  }),
);
const __VLS_22 = __VLS_21(
  {
    label: '公告类型',
    prop: 'noticeType',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
__VLS_23.slots.default;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(
  __VLS_24,
  new __VLS_24({
    modelValue: __VLS_ctx.queryParams.noticeType,
    placeholder: '请选择公告类型',
    clearable: true,
  }),
);
const __VLS_26 = __VLS_25(
  {
    modelValue: __VLS_ctx.queryParams.noticeType,
    placeholder: '请选择公告类型',
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
    label: '通知',
    value: '1',
  }),
);
const __VLS_30 = __VLS_29(
  {
    label: '通知',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    label: '公告',
    value: '2',
  }),
);
const __VLS_34 = __VLS_33(
  {
    label: '公告',
    value: '2',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
var __VLS_27;
var __VLS_23;
const __VLS_36 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(
  __VLS_36,
  new __VLS_36({
    label: '状态',
    prop: 'status',
  }),
);
const __VLS_38 = __VLS_37(
  {
    label: '状态',
    prop: 'status',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_37),
);
__VLS_39.slots.default;
const __VLS_40 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(
  __VLS_40,
  new __VLS_40({
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
    clearable: true,
  }),
);
const __VLS_42 = __VLS_41(
  {
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_41),
);
__VLS_43.slots.default;
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(
  __VLS_44,
  new __VLS_44({
    label: '发布',
    value: '0',
  }),
);
const __VLS_46 = __VLS_45(
  {
    label: '发布',
    value: '0',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_45),
);
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(
  __VLS_48,
  new __VLS_48({
    label: '撤回',
    value: '1',
  }),
);
const __VLS_50 = __VLS_49(
  {
    label: '撤回',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_49),
);
var __VLS_43;
var __VLS_39;
const __VLS_52 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({}));
const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(
  __VLS_56,
  new __VLS_56({
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  }),
);
const __VLS_58 = __VLS_57(
  {
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_57),
);
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
  onClick: __VLS_ctx.handleQuery,
};
__VLS_59.slots.default;
var __VLS_59;
const __VLS_64 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(
  __VLS_64,
  new __VLS_64({
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  }),
);
const __VLS_66 = __VLS_65(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_65),
);
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
  onClick: __VLS_ctx.resetQuery,
};
__VLS_67.slots.default;
var __VLS_67;
var __VLS_55;
var __VLS_7;
var __VLS_3;
const __VLS_72 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(
  __VLS_72,
  new __VLS_72({
    shadow: 'never',
    ...{ class: 'table-card' },
  }),
);
const __VLS_74 = __VLS_73(
  {
    shadow: 'never',
    ...{ class: 'table-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_73),
);
__VLS_75.slots.default;
{
  const { header: __VLS_thisSlot } = __VLS_75.slots;
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
  const __VLS_76 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_77 = __VLS_asFunctionalComponent(
    __VLS_76,
    new __VLS_76({
      ...{ onClick: {} },
      type: 'primary',
      icon: __VLS_ctx.Plus,
    }),
  );
  const __VLS_78 = __VLS_77(
    {
      ...{ onClick: {} },
      type: 'primary',
      icon: __VLS_ctx.Plus,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_77),
  );
  let __VLS_80;
  let __VLS_81;
  let __VLS_82;
  const __VLS_83 = {
    onClick: __VLS_ctx.handleAdd,
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:notice:add'] },
    null,
    null,
  );
  __VLS_79.slots.default;
  var __VLS_79;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'right' },
  });
  const __VLS_84 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_85 = __VLS_asFunctionalComponent(
    __VLS_84,
    new __VLS_84({
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    }),
  );
  const __VLS_86 = __VLS_85(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_85),
  );
  let __VLS_88;
  let __VLS_89;
  let __VLS_90;
  const __VLS_91 = {
    onClick: __VLS_ctx.refreshTable,
  };
  var __VLS_87;
}
const __VLS_92 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(
  __VLS_92,
  new __VLS_92({
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.noticeList,
    stripe: true,
    border: true,
  }),
);
const __VLS_94 = __VLS_93(
  {
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.noticeList,
    stripe: true,
    border: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_93),
);
let __VLS_96;
let __VLS_97;
let __VLS_98;
const __VLS_99 = {
  onSelectionChange: __VLS_ctx.handleSelectionChange,
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.loading },
  null,
  null,
);
__VLS_95.slots.default;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(
  __VLS_100,
  new __VLS_100({
    type: 'selection',
    width: '50',
    fixed: true,
  }),
);
const __VLS_102 = __VLS_101(
  {
    type: 'selection',
    width: '50',
    fixed: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_101),
);
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(
  __VLS_104,
  new __VLS_104({
    prop: 'noticeId',
    label: '公告编号',
    width: '100',
  }),
);
const __VLS_106 = __VLS_105(
  {
    prop: 'noticeId',
    label: '公告编号',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_105),
);
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(
  __VLS_108,
  new __VLS_108({
    prop: 'noticeTitle',
    label: '公告标题',
    minWidth: '200',
    showOverflowTooltip: true,
  }),
);
const __VLS_110 = __VLS_109(
  {
    prop: 'noticeTitle',
    label: '公告标题',
    minWidth: '200',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_109),
);
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(
  __VLS_112,
  new __VLS_112({
    prop: 'noticeType',
    label: '公告类型',
    width: '100',
  }),
);
const __VLS_114 = __VLS_113(
  {
    prop: 'noticeType',
    label: '公告类型',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_113),
);
__VLS_115.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_115.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_116 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_117 = __VLS_asFunctionalComponent(
    __VLS_116,
    new __VLS_116({
      type: row.noticeType === '1' ? 'primary' : 'info',
    }),
  );
  const __VLS_118 = __VLS_117(
    {
      type: row.noticeType === '1' ? 'primary' : 'info',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_117),
  );
  __VLS_119.slots.default;
  row.noticeType === '1' ? '通知' : '公告';
  var __VLS_119;
}
var __VLS_115;
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(
  __VLS_120,
  new __VLS_120({
    prop: 'status',
    label: '状态',
    width: '100',
  }),
);
const __VLS_122 = __VLS_121(
  {
    prop: 'status',
    label: '状态',
    width: '100',
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
      type: row.status === '0' ? 'success' : 'warning',
    }),
  );
  const __VLS_126 = __VLS_125(
    {
      type: row.status === '0' ? 'success' : 'warning',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_125),
  );
  __VLS_127.slots.default;
  row.status === '0' ? '发布' : '撤回';
  var __VLS_127;
}
var __VLS_123;
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(
  __VLS_128,
  new __VLS_128({
    prop: 'createBy',
    label: '创建者',
    width: '120',
  }),
);
const __VLS_130 = __VLS_129(
  {
    prop: 'createBy',
    label: '创建者',
    width: '120',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_129),
);
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(
  __VLS_132,
  new __VLS_132({
    prop: 'createTime',
    label: '创建时间',
    width: '180',
  }),
);
const __VLS_134 = __VLS_133(
  {
    prop: 'createTime',
    label: '创建时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_133),
);
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(
  __VLS_136,
  new __VLS_136({
    label: '操作',
    width: '250',
    fixed: 'right',
  }),
);
const __VLS_138 = __VLS_137(
  {
    label: '操作',
    width: '250',
    fixed: 'right',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_137),
);
__VLS_139.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_139.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_140 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_141 = __VLS_asFunctionalComponent(
    __VLS_140,
    new __VLS_140({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_142 = __VLS_141(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_141),
  );
  let __VLS_144;
  let __VLS_145;
  let __VLS_146;
  const __VLS_147 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleEdit(row);
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:notice:edit'] },
    null,
    null,
  );
  __VLS_143.slots.default;
  var __VLS_143;
  const __VLS_148 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_149 = __VLS_asFunctionalComponent(
    __VLS_148,
    new __VLS_148({
      ...{ onClick: {} },
      link: true,
      type: 'success',
    }),
  );
  const __VLS_150 = __VLS_149(
    {
      ...{ onClick: {} },
      link: true,
      type: 'success',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_149),
  );
  let __VLS_152;
  let __VLS_153;
  let __VLS_154;
  const __VLS_155 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleView(row);
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:notice:query'] },
    null,
    null,
  );
  __VLS_151.slots.default;
  var __VLS_151;
  if (row.status === '1') {
    const __VLS_156 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(
      __VLS_156,
      new __VLS_156({
        ...{ onClick: {} },
        link: true,
        type: 'warning',
      }),
    );
    const __VLS_158 = __VLS_157(
      {
        ...{ onClick: {} },
        link: true,
        type: 'warning',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_157),
    );
    let __VLS_160;
    let __VLS_161;
    let __VLS_162;
    const __VLS_163 = {
      onClick: (...[$event]) => {
        if (!(row.status === '1')) return;
        __VLS_ctx.handlePublish(row);
      },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
      null,
      { ...__VLS_directiveBindingRestFields, value: ['system:notice:publish'] },
      null,
      null,
    );
    __VLS_159.slots.default;
    var __VLS_159;
  }
  if (row.status === '0') {
    const __VLS_164 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(
      __VLS_164,
      new __VLS_164({
        ...{ onClick: {} },
        link: true,
        type: 'warning',
      }),
    );
    const __VLS_166 = __VLS_165(
      {
        ...{ onClick: {} },
        link: true,
        type: 'warning',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_165),
    );
    let __VLS_168;
    let __VLS_169;
    let __VLS_170;
    const __VLS_171 = {
      onClick: (...[$event]) => {
        if (!(row.status === '0')) return;
        __VLS_ctx.handleWithdraw(row);
      },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
      null,
      { ...__VLS_directiveBindingRestFields, value: ['system:notice:withdraw'] },
      null,
      null,
    );
    __VLS_167.slots.default;
    var __VLS_167;
  }
  const __VLS_172 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_173 = __VLS_asFunctionalComponent(
    __VLS_172,
    new __VLS_172({
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    }),
  );
  const __VLS_174 = __VLS_173(
    {
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_173),
  );
  let __VLS_176;
  let __VLS_177;
  let __VLS_178;
  const __VLS_179 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleDelete(row);
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:notice:remove'] },
    null,
    null,
  );
  __VLS_175.slots.default;
  var __VLS_175;
}
var __VLS_139;
var __VLS_95;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pagination' },
});
const __VLS_180 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(
  __VLS_180,
  new __VLS_180({
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
);
const __VLS_182 = __VLS_181(
  {
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_181),
);
let __VLS_184;
let __VLS_185;
let __VLS_186;
const __VLS_187 = {
  onSizeChange: __VLS_ctx.handleQuery,
};
const __VLS_188 = {
  onCurrentChange: __VLS_ctx.handleQuery,
};
var __VLS_183;
var __VLS_75;
/** @type {[typeof NoticeForm, ]} */ // @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(
  NoticeForm,
  new NoticeForm({
    ...{ onRefresh: {} },
    modelValue: __VLS_ctx.formVisible,
    noticeData: __VLS_ctx.currentNotice,
  }),
);
const __VLS_190 = __VLS_189(
  {
    ...{ onRefresh: {} },
    modelValue: __VLS_ctx.formVisible,
    noticeData: __VLS_ctx.currentNotice,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_189),
);
let __VLS_192;
let __VLS_193;
let __VLS_194;
const __VLS_195 = {
  onRefresh: __VLS_ctx.handleQuery,
};
var __VLS_191;
/** @type {[typeof NoticeDetail, ]} */ // @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent(
  NoticeDetail,
  new NoticeDetail({
    modelValue: __VLS_ctx.detailVisible,
    noticeId: __VLS_ctx.currentNoticeId,
  }),
);
const __VLS_197 = __VLS_196(
  {
    modelValue: __VLS_ctx.detailVisible,
    noticeId: __VLS_ctx.currentNoticeId,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_196),
);
/** @type {__VLS_StyleScopedClasses['notice-list']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['table-header']} */ /** @type {__VLS_StyleScopedClasses['left']} */ /** @type {__VLS_StyleScopedClasses['right']} */ /** @type {__VLS_StyleScopedClasses['pagination']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      Plus: Plus,
      NoticeForm: NoticeForm,
      NoticeDetail: NoticeDetail,
      loading: loading,
      noticeList: noticeList,
      total: total,
      formVisible: formVisible,
      detailVisible: detailVisible,
      currentNotice: currentNotice,
      currentNoticeId: currentNoticeId,
      queryParams: queryParams,
      handleQuery: handleQuery,
      resetQuery: resetQuery,
      refreshTable: refreshTable,
      handleAdd: handleAdd,
      handleEdit: handleEdit,
      handleView: handleView,
      handlePublish: handlePublish,
      handleWithdraw: handleWithdraw,
      handleDelete: handleDelete,
      handleSelectionChange: handleSelectionChange,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=NoticeList.vue.js.map

/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Expand, Fold } from '@element-plus/icons-vue';
import { getMenuTree, deleteMenu } from '@/api/system/menu.api';
import MenuForm from './MenuForm.vue';
// 状态
const loading = ref(false);
const menuList = ref([]);
const isExpandAll = ref(true);
const formVisible = ref(false);
const currentMenu = ref(null);
const parentMenu = ref(null);
// 查询参数
const queryParams = reactive({
  keyword: '',
  status: undefined,
});
// 加载菜单树
async function fetchMenuList() {
  loading.value = true;
  try {
    const res = await getMenuTree(queryParams);
    menuList.value = res;
  } finally {
    loading.value = false;
  }
}
// 查询
function handleQuery() {
  fetchMenuList();
}
// 重置查询
function resetQuery() {
  queryParams.keyword = '';
  queryParams.status = undefined;
  handleQuery();
}
// 刷新表格
function refreshTable() {
  fetchMenuList();
}
// 展开全部
function expandAll() {
  isExpandAll.value = true;
}
// 折叠全部
function collapseAll() {
  isExpandAll.value = false;
}
// 新增顶级菜单
function handleAdd() {
  currentMenu.value = null;
  parentMenu.value = null;
  formVisible.value = true;
}
// 新增子菜单
function handleAddSub(row) {
  currentMenu.value = null;
  parentMenu.value = row;
  formVisible.value = true;
}
// 编辑
function handleEdit(row) {
  currentMenu.value = { ...row };
  parentMenu.value = null;
  formVisible.value = true;
}
// 删除
async function handleDelete(row) {
  if (row.children && row.children.length > 0) {
    ElMessage.warning('该菜单存在下级菜单，无法删除');
    return;
  }
  try {
    await ElMessageBox.confirm(`是否确认删除菜单"${row.menuName}"？`, '提示', {
      type: 'warning',
    });
    await deleteMenu(row.menuId);
    ElMessage.success('删除成功');
    fetchMenuList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error);
    }
  }
}
// 初始化
onMounted(() => {
  fetchMenuList();
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
  ...{ class: 'menu-list' },
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
    label: '菜单名称',
    prop: 'menuName',
  }),
);
const __VLS_10 = __VLS_9(
  {
    label: '菜单名称',
    prop: 'menuName',
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
    placeholder: '请输入菜单名称',
    clearable: true,
  }),
);
const __VLS_14 = __VLS_13(
  {
    ...{ onKeyup: {} },
    modelValue: __VLS_ctx.queryParams.keyword,
    placeholder: '请输入菜单名称',
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
    label: '状态',
    prop: 'status',
  }),
);
const __VLS_22 = __VLS_21(
  {
    label: '状态',
    prop: 'status',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
__VLS_23.slots.default;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(
  __VLS_24,
  new __VLS_24({
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
    clearable: true,
  }),
);
const __VLS_26 = __VLS_25(
  {
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
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
    label: '正常',
    value: '0',
  }),
);
const __VLS_30 = __VLS_29(
  {
    label: '正常',
    value: '0',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    label: '停用',
    value: '1',
  }),
);
const __VLS_34 = __VLS_33(
  {
    label: '停用',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
var __VLS_27;
var __VLS_23;
const __VLS_36 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(
  __VLS_40,
  new __VLS_40({
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  }),
);
const __VLS_42 = __VLS_41(
  {
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_41),
);
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
  onClick: __VLS_ctx.handleQuery,
};
__VLS_43.slots.default;
var __VLS_43;
const __VLS_48 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(
  __VLS_48,
  new __VLS_48({
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  }),
);
const __VLS_50 = __VLS_49(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_49),
);
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
  onClick: __VLS_ctx.resetQuery,
};
__VLS_51.slots.default;
var __VLS_51;
var __VLS_39;
var __VLS_7;
var __VLS_3;
const __VLS_56 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(
  __VLS_56,
  new __VLS_56({
    shadow: 'never',
    ...{ class: 'table-card' },
  }),
);
const __VLS_58 = __VLS_57(
  {
    shadow: 'never',
    ...{ class: 'table-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_57),
);
__VLS_59.slots.default;
{
  const { header: __VLS_thisSlot } = __VLS_59.slots;
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
  const __VLS_60 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_61 = __VLS_asFunctionalComponent(
    __VLS_60,
    new __VLS_60({
      ...{ onClick: {} },
      type: 'primary',
      icon: __VLS_ctx.Plus,
    }),
  );
  const __VLS_62 = __VLS_61(
    {
      ...{ onClick: {} },
      type: 'primary',
      icon: __VLS_ctx.Plus,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_61),
  );
  let __VLS_64;
  let __VLS_65;
  let __VLS_66;
  const __VLS_67 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleAdd();
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:menu:add'] },
    null,
    null,
  );
  __VLS_63.slots.default;
  var __VLS_63;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'right' },
  });
  const __VLS_68 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_69 = __VLS_asFunctionalComponent(
    __VLS_68,
    new __VLS_68({
      ...{ onClick: {} },
      icon: __VLS_ctx.Expand,
      circle: true,
    }),
  );
  const __VLS_70 = __VLS_69(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Expand,
      circle: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_69),
  );
  let __VLS_72;
  let __VLS_73;
  let __VLS_74;
  const __VLS_75 = {
    onClick: __VLS_ctx.expandAll,
  };
  var __VLS_71;
  const __VLS_76 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_77 = __VLS_asFunctionalComponent(
    __VLS_76,
    new __VLS_76({
      ...{ onClick: {} },
      icon: __VLS_ctx.Fold,
      circle: true,
    }),
  );
  const __VLS_78 = __VLS_77(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Fold,
      circle: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_77),
  );
  let __VLS_80;
  let __VLS_81;
  let __VLS_82;
  const __VLS_83 = {
    onClick: __VLS_ctx.collapseAll,
  };
  var __VLS_79;
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
    data: __VLS_ctx.menuList,
    rowKey: 'menuId',
    defaultExpandAll: __VLS_ctx.isExpandAll,
    stripe: true,
    border: true,
    treeProps: { children: 'children', hasChildren: 'hasChildren' },
  }),
);
const __VLS_94 = __VLS_93(
  {
    data: __VLS_ctx.menuList,
    rowKey: 'menuId',
    defaultExpandAll: __VLS_ctx.isExpandAll,
    stripe: true,
    border: true,
    treeProps: { children: 'children', hasChildren: 'hasChildren' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_93),
);
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.loading },
  null,
  null,
);
__VLS_95.slots.default;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(
  __VLS_96,
  new __VLS_96({
    prop: 'menuName',
    label: '菜单名称',
    width: '250',
  }),
);
const __VLS_98 = __VLS_97(
  {
    prop: 'menuName',
    label: '菜单名称',
    width: '250',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_97),
);
__VLS_99.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_99.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  if (row.icon) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_100 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({}));
    const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    const __VLS_104 = row.icon;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
    const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
    var __VLS_103;
  }
  row.menuName;
}
var __VLS_99;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(
  __VLS_108,
  new __VLS_108({
    prop: 'menuType',
    label: '菜单类型',
    width: '120',
  }),
);
const __VLS_110 = __VLS_109(
  {
    prop: 'menuType',
    label: '菜单类型',
    width: '120',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_109),
);
__VLS_111.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_111.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  if (row.menuType === 'M') {
    const __VLS_112 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(
      __VLS_112,
      new __VLS_112({
        type: 'warning',
      }),
    );
    const __VLS_114 = __VLS_113(
      {
        type: 'warning',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_113),
    );
    __VLS_115.slots.default;
    var __VLS_115;
  } else if (row.menuType === 'C') {
    const __VLS_116 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(
      __VLS_116,
      new __VLS_116({
        type: 'success',
      }),
    );
    const __VLS_118 = __VLS_117(
      {
        type: 'success',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_117),
    );
    __VLS_119.slots.default;
    var __VLS_119;
  } else {
    const __VLS_120 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(
      __VLS_120,
      new __VLS_120({
        type: 'info',
      }),
    );
    const __VLS_122 = __VLS_121(
      {
        type: 'info',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_121),
    );
    __VLS_123.slots.default;
    var __VLS_123;
  }
}
var __VLS_111;
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(
  __VLS_124,
  new __VLS_124({
    prop: 'path',
    label: '路由地址',
    width: '180',
    showOverflowTooltip: true,
  }),
);
const __VLS_126 = __VLS_125(
  {
    prop: 'path',
    label: '路由地址',
    width: '180',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_125),
);
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(
  __VLS_128,
  new __VLS_128({
    prop: 'component',
    label: '组件路径',
    width: '200',
    showOverflowTooltip: true,
  }),
);
const __VLS_130 = __VLS_129(
  {
    prop: 'component',
    label: '组件路径',
    width: '200',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_129),
);
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(
  __VLS_132,
  new __VLS_132({
    prop: 'orderNum',
    label: '显示顺序',
    width: '100',
    align: 'center',
  }),
);
const __VLS_134 = __VLS_133(
  {
    prop: 'orderNum',
    label: '显示顺序',
    width: '100',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_133),
);
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(
  __VLS_136,
  new __VLS_136({
    prop: 'status',
    label: '状态',
    width: '100',
    align: 'center',
  }),
);
const __VLS_138 = __VLS_137(
  {
    prop: 'status',
    label: '状态',
    width: '100',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_137),
);
__VLS_139.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_139.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_140 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_141 = __VLS_asFunctionalComponent(
    __VLS_140,
    new __VLS_140({
      type: row.status === '0' ? 'success' : 'danger',
    }),
  );
  const __VLS_142 = __VLS_141(
    {
      type: row.status === '0' ? 'success' : 'danger',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_141),
  );
  __VLS_143.slots.default;
  row.status === '0' ? '正常' : '停用';
  var __VLS_143;
}
var __VLS_139;
const __VLS_144 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(
  __VLS_144,
  new __VLS_144({
    prop: 'createTime',
    label: '创建时间',
    width: '180',
  }),
);
const __VLS_146 = __VLS_145(
  {
    prop: 'createTime',
    label: '创建时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_145),
);
const __VLS_148 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(
  __VLS_148,
  new __VLS_148({
    label: '操作',
    width: '220',
    fixed: 'right',
  }),
);
const __VLS_150 = __VLS_149(
  {
    label: '操作',
    width: '220',
    fixed: 'right',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_149),
);
__VLS_151.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_151.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_152 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_153 = __VLS_asFunctionalComponent(
    __VLS_152,
    new __VLS_152({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_154 = __VLS_153(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_153),
  );
  let __VLS_156;
  let __VLS_157;
  let __VLS_158;
  const __VLS_159 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleAddSub(row);
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:menu:add'] },
    null,
    null,
  );
  __VLS_155.slots.default;
  var __VLS_155;
  const __VLS_160 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_161 = __VLS_asFunctionalComponent(
    __VLS_160,
    new __VLS_160({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_162 = __VLS_161(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_161),
  );
  let __VLS_164;
  let __VLS_165;
  let __VLS_166;
  const __VLS_167 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleEdit(row);
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:menu:edit'] },
    null,
    null,
  );
  __VLS_163.slots.default;
  var __VLS_163;
  const __VLS_168 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_169 = __VLS_asFunctionalComponent(
    __VLS_168,
    new __VLS_168({
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    }),
  );
  const __VLS_170 = __VLS_169(
    {
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_169),
  );
  let __VLS_172;
  let __VLS_173;
  let __VLS_174;
  const __VLS_175 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleDelete(row);
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:menu:delete'] },
    null,
    null,
  );
  __VLS_171.slots.default;
  var __VLS_171;
}
var __VLS_151;
var __VLS_95;
var __VLS_59;
/** @type {[typeof MenuForm, ]} */ // @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent(
  MenuForm,
  new MenuForm({
    ...{ onRefresh: {} },
    modelValue: __VLS_ctx.formVisible,
    menuData: __VLS_ctx.currentMenu,
    parentMenu: __VLS_ctx.parentMenu,
  }),
);
const __VLS_177 = __VLS_176(
  {
    ...{ onRefresh: {} },
    modelValue: __VLS_ctx.formVisible,
    menuData: __VLS_ctx.currentMenu,
    parentMenu: __VLS_ctx.parentMenu,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_176),
);
let __VLS_179;
let __VLS_180;
let __VLS_181;
const __VLS_182 = {
  onRefresh: __VLS_ctx.fetchMenuList,
};
var __VLS_178;
/** @type {__VLS_StyleScopedClasses['menu-list']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['table-header']} */ /** @type {__VLS_StyleScopedClasses['left']} */ /** @type {__VLS_StyleScopedClasses['right']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      Plus: Plus,
      Expand: Expand,
      Fold: Fold,
      MenuForm: MenuForm,
      loading: loading,
      menuList: menuList,
      isExpandAll: isExpandAll,
      formVisible: formVisible,
      currentMenu: currentMenu,
      parentMenu: parentMenu,
      queryParams: queryParams,
      fetchMenuList: fetchMenuList,
      handleQuery: handleQuery,
      resetQuery: resetQuery,
      refreshTable: refreshTable,
      expandAll: expandAll,
      collapseAll: collapseAll,
      handleAdd: handleAdd,
      handleAddSub: handleAddSub,
      handleEdit: handleEdit,
      handleDelete: handleDelete,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map

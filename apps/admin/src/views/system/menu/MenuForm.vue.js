import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { addMenu, updateMenu } from '@/api/system/menu.api';
import { getMenuTreeSelect } from '@/api/system/menu.api';
import MenuIcon from './MenuIcon.vue';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
const isEdit = computed(() => !!props.menuData?.menuId);
// 状态
const formRef = ref();
const submitting = ref(false);
const menuTree = ref([]);
const showIconDialog = ref(false);
// 表单数据
const formData = ref({
  parentId: 0,
  menuName: '',
  menuType: 'C',
  orderNum: 0,
  path: '',
  component: '',
  icon: '',
  query: '',
  isFrame: false,
  isCache: false,
  perms: '',
  status: '0',
});
// 表单验证规则
const rules = {
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
};
// 加载菜单树
async function fetchMenuTree() {
  try {
    const res = await getMenuTreeSelect();
    menuTree.value = res;
  } catch (error) {
    console.error('加载菜单树失败', error);
  }
}
// 填充表单数据
function fillFormData() {
  if (props.menuData) {
    formData.value = {
      parentId: props.menuData.parentId,
      menuName: props.menuData.menuName,
      menuType: props.menuData.menuType,
      orderNum: props.menuData.orderNum,
      path: props.menuData.path || '',
      component: props.menuData.component || '',
      icon: props.menuData.icon || '',
      query: props.menuData.query || '',
      isFrame: props.menuData.isFrame,
      isCache: props.menuData.isCache,
      perms: props.menuData.perms || '',
      status: props.menuData.status,
    };
  } else if (props.parentMenu) {
    // 新增子菜单
    formData.value = {
      parentId: props.parentMenu.menuId,
      menuName: '',
      menuType: props.parentMenu.menuType === 'F' ? 'F' : 'C',
      orderNum: 0,
      path: '',
      component: '',
      icon: '',
      query: '',
      isFrame: false,
      isCache: false,
      perms: '',
      status: '0',
    };
  } else {
    // 新增顶级菜单
    formData.value = {
      parentId: 0,
      menuName: '',
      menuType: 'M',
      orderNum: 0,
      path: '',
      component: '',
      icon: '',
      query: '',
      isFrame: false,
      isCache: false,
      perms: '',
      status: '0',
    };
  }
}
// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (isEdit.value) {
      await updateMenu({ menuId: props.menuData.menuId, ...formData.value });
      ElMessage.success('修改成功');
    } else {
      await addMenu(formData.value);
      ElMessage.success('新增成功');
    }
    emit('refresh');
    handleClose();
  } catch (error) {
    console.error('提交失败', error);
  } finally {
    submitting.value = false;
  }
}
// 关闭弹窗
function handleClose() {
  formRef.value?.resetFields();
  visible.value = false;
}
// 图标选择回调
function handleIconSelect(icon) {
  formData.value.icon = icon;
}
// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fetchMenuTree();
    fillFormData();
  }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ onClose: {} },
    modelValue: __VLS_ctx.visible,
    title: __VLS_ctx.isEdit ? '编辑菜单' : '新增菜单',
    width: '700px',
    appendToBody: true,
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ onClose: {} },
    modelValue: __VLS_ctx.visible,
    title: __VLS_ctx.isEdit ? '编辑菜单' : '新增菜单',
    width: '700px',
    appendToBody: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
  onClose: __VLS_ctx.handleClose,
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(
  __VLS_9,
  new __VLS_9({
    ref: 'formRef',
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.rules,
    labelWidth: '100px',
  }),
);
const __VLS_11 = __VLS_10(
  {
    ref: 'formRef',
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.rules,
    labelWidth: '100px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_10),
);
/** @type {typeof __VLS_ctx.formRef} */ var __VLS_13 = {};
__VLS_12.slots.default;
const __VLS_15 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(
  __VLS_15,
  new __VLS_15({
    gutter: 20,
  }),
);
const __VLS_17 = __VLS_16(
  {
    gutter: 20,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_16),
);
__VLS_18.slots.default;
const __VLS_19 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(
  __VLS_19,
  new __VLS_19({
    span: 12,
  }),
);
const __VLS_21 = __VLS_20(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_20),
);
__VLS_22.slots.default;
const __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(
  __VLS_23,
  new __VLS_23({
    label: '菜单类型',
    prop: 'menuType',
  }),
);
const __VLS_25 = __VLS_24(
  {
    label: '菜单类型',
    prop: 'menuType',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_24),
);
__VLS_26.slots.default;
const __VLS_27 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ // @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(
  __VLS_27,
  new __VLS_27({
    modelValue: __VLS_ctx.formData.menuType,
  }),
);
const __VLS_29 = __VLS_28(
  {
    modelValue: __VLS_ctx.formData.menuType,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_28),
);
__VLS_30.slots.default;
const __VLS_31 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(
  __VLS_31,
  new __VLS_31({
    label: 'M',
  }),
);
const __VLS_33 = __VLS_32(
  {
    label: 'M',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_32),
);
__VLS_34.slots.default;
var __VLS_34;
const __VLS_35 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(
  __VLS_35,
  new __VLS_35({
    label: 'C',
  }),
);
const __VLS_37 = __VLS_36(
  {
    label: 'C',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_36),
);
__VLS_38.slots.default;
var __VLS_38;
const __VLS_39 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(
  __VLS_39,
  new __VLS_39({
    label: 'F',
  }),
);
const __VLS_41 = __VLS_40(
  {
    label: 'F',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_40),
);
__VLS_42.slots.default;
var __VLS_42;
var __VLS_30;
var __VLS_26;
var __VLS_22;
const __VLS_43 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(
  __VLS_43,
  new __VLS_43({
    span: 12,
  }),
);
const __VLS_45 = __VLS_44(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_44),
);
__VLS_46.slots.default;
const __VLS_47 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(
  __VLS_47,
  new __VLS_47({
    label: '上级菜单',
    prop: 'parentId',
  }),
);
const __VLS_49 = __VLS_48(
  {
    label: '上级菜单',
    prop: 'parentId',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_48),
);
__VLS_50.slots.default;
const __VLS_51 = {}.ElTreeSelect;
/** @type {[typeof __VLS_components.ElTreeSelect, typeof __VLS_components.elTreeSelect, ]} */ // @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(
  __VLS_51,
  new __VLS_51({
    modelValue: __VLS_ctx.formData.parentId,
    data: __VLS_ctx.menuTree,
    props: { value: 'menuId', label: 'menuName', children: 'children' },
    placeholder: '请选择上级菜单',
    checkStrictly: true,
    filterable: true,
    clearable: true,
    renderAfterExpand: false,
  }),
);
const __VLS_53 = __VLS_52(
  {
    modelValue: __VLS_ctx.formData.parentId,
    data: __VLS_ctx.menuTree,
    props: { value: 'menuId', label: 'menuName', children: 'children' },
    placeholder: '请选择上级菜单',
    checkStrictly: true,
    filterable: true,
    clearable: true,
    renderAfterExpand: false,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_52),
);
var __VLS_50;
var __VLS_46;
var __VLS_18;
const __VLS_55 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(
  __VLS_55,
  new __VLS_55({
    gutter: 20,
  }),
);
const __VLS_57 = __VLS_56(
  {
    gutter: 20,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_56),
);
__VLS_58.slots.default;
const __VLS_59 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(
  __VLS_59,
  new __VLS_59({
    span: 12,
  }),
);
const __VLS_61 = __VLS_60(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_60),
);
__VLS_62.slots.default;
const __VLS_63 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(
  __VLS_63,
  new __VLS_63({
    label: '菜单名称',
    prop: 'menuName',
  }),
);
const __VLS_65 = __VLS_64(
  {
    label: '菜单名称',
    prop: 'menuName',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_64),
);
__VLS_66.slots.default;
const __VLS_67 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(
  __VLS_67,
  new __VLS_67({
    modelValue: __VLS_ctx.formData.menuName,
    placeholder: '请输入菜单名称',
  }),
);
const __VLS_69 = __VLS_68(
  {
    modelValue: __VLS_ctx.formData.menuName,
    placeholder: '请输入菜单名称',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_68),
);
var __VLS_66;
var __VLS_62;
const __VLS_71 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(
  __VLS_71,
  new __VLS_71({
    span: 12,
  }),
);
const __VLS_73 = __VLS_72(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_72),
);
__VLS_74.slots.default;
const __VLS_75 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(
  __VLS_75,
  new __VLS_75({
    label: '显示顺序',
    prop: 'orderNum',
  }),
);
const __VLS_77 = __VLS_76(
  {
    label: '显示顺序',
    prop: 'orderNum',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_76),
);
__VLS_78.slots.default;
const __VLS_79 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ // @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(
  __VLS_79,
  new __VLS_79({
    modelValue: __VLS_ctx.formData.orderNum,
    min: 0,
    max: 999,
  }),
);
const __VLS_81 = __VLS_80(
  {
    modelValue: __VLS_ctx.formData.orderNum,
    min: 0,
    max: 999,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_80),
);
var __VLS_78;
var __VLS_74;
var __VLS_58;
const __VLS_83 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(
  __VLS_83,
  new __VLS_83({
    gutter: 20,
  }),
);
const __VLS_85 = __VLS_84(
  {
    gutter: 20,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_84),
);
__VLS_86.slots.default;
const __VLS_87 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(
  __VLS_87,
  new __VLS_87({
    span: 12,
  }),
);
const __VLS_89 = __VLS_88(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_88),
);
__VLS_90.slots.default;
const __VLS_91 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(
  __VLS_91,
  new __VLS_91({
    label: '路由路径',
    prop: 'path',
  }),
);
const __VLS_93 = __VLS_92(
  {
    label: '路由路径',
    prop: 'path',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_92),
);
__VLS_94.slots.default;
const __VLS_95 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(
  __VLS_95,
  new __VLS_95({
    modelValue: __VLS_ctx.formData.path,
    placeholder: '请输入路由路径',
  }),
);
const __VLS_97 = __VLS_96(
  {
    modelValue: __VLS_ctx.formData.path,
    placeholder: '请输入路由路径',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_96),
);
var __VLS_94;
var __VLS_90;
if (__VLS_ctx.formData.menuType === 'C') {
  const __VLS_99 = {}.ElCol;
  /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
  const __VLS_100 = __VLS_asFunctionalComponent(
    __VLS_99,
    new __VLS_99({
      span: 12,
    }),
  );
  const __VLS_101 = __VLS_100(
    {
      span: 12,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_100),
  );
  __VLS_102.slots.default;
  const __VLS_103 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_104 = __VLS_asFunctionalComponent(
    __VLS_103,
    new __VLS_103({
      label: '组件路径',
      prop: 'component',
    }),
  );
  const __VLS_105 = __VLS_104(
    {
      label: '组件路径',
      prop: 'component',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_104),
  );
  __VLS_106.slots.default;
  const __VLS_107 = {}.ElInput;
  /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
  const __VLS_108 = __VLS_asFunctionalComponent(
    __VLS_107,
    new __VLS_107({
      modelValue: __VLS_ctx.formData.component,
      placeholder: '请输入组件路径',
    }),
  );
  const __VLS_109 = __VLS_108(
    {
      modelValue: __VLS_ctx.formData.component,
      placeholder: '请输入组件路径',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_108),
  );
  var __VLS_106;
  var __VLS_102;
}
var __VLS_86;
if (__VLS_ctx.formData.menuType !== 'F') {
  const __VLS_111 = {}.ElRow;
  /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
  const __VLS_112 = __VLS_asFunctionalComponent(
    __VLS_111,
    new __VLS_111({
      gutter: 20,
    }),
  );
  const __VLS_113 = __VLS_112(
    {
      gutter: 20,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_112),
  );
  __VLS_114.slots.default;
  const __VLS_115 = {}.ElCol;
  /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
  const __VLS_116 = __VLS_asFunctionalComponent(
    __VLS_115,
    new __VLS_115({
      span: 12,
    }),
  );
  const __VLS_117 = __VLS_116(
    {
      span: 12,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_116),
  );
  __VLS_118.slots.default;
  const __VLS_119 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_120 = __VLS_asFunctionalComponent(
    __VLS_119,
    new __VLS_119({
      label: '菜单图标',
      prop: 'icon',
    }),
  );
  const __VLS_121 = __VLS_120(
    {
      label: '菜单图标',
      prop: 'icon',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_120),
  );
  __VLS_122.slots.default;
  const __VLS_123 = {}.ElInput;
  /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
  const __VLS_124 = __VLS_asFunctionalComponent(
    __VLS_123,
    new __VLS_123({
      modelValue: __VLS_ctx.formData.icon,
      placeholder: '请输入菜单图标',
    }),
  );
  const __VLS_125 = __VLS_124(
    {
      modelValue: __VLS_ctx.formData.icon,
      placeholder: '请输入菜单图标',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_124),
  );
  __VLS_126.slots.default;
  {
    const { append: __VLS_thisSlot } = __VLS_126.slots;
    const __VLS_127 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(
      __VLS_127,
      new __VLS_127({
        ...{ onClick: {} },
      }),
    );
    const __VLS_129 = __VLS_128(
      {
        ...{ onClick: {} },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_128),
    );
    let __VLS_131;
    let __VLS_132;
    let __VLS_133;
    const __VLS_134 = {
      onClick: (...[$event]) => {
        if (!(__VLS_ctx.formData.menuType !== 'F')) return;
        __VLS_ctx.showIconDialog = true;
      },
    };
    __VLS_130.slots.default;
    var __VLS_130;
  }
  var __VLS_126;
  var __VLS_122;
  var __VLS_118;
  const __VLS_135 = {}.ElCol;
  /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
  const __VLS_136 = __VLS_asFunctionalComponent(
    __VLS_135,
    new __VLS_135({
      span: 12,
    }),
  );
  const __VLS_137 = __VLS_136(
    {
      span: 12,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_136),
  );
  __VLS_138.slots.default;
  const __VLS_139 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_140 = __VLS_asFunctionalComponent(
    __VLS_139,
    new __VLS_139({
      label: '路由参数',
      prop: 'query',
    }),
  );
  const __VLS_141 = __VLS_140(
    {
      label: '路由参数',
      prop: 'query',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_140),
  );
  __VLS_142.slots.default;
  const __VLS_143 = {}.ElInput;
  /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
  const __VLS_144 = __VLS_asFunctionalComponent(
    __VLS_143,
    new __VLS_143({
      modelValue: __VLS_ctx.formData.query,
      placeholder: '请输入路由参数',
    }),
  );
  const __VLS_145 = __VLS_144(
    {
      modelValue: __VLS_ctx.formData.query,
      placeholder: '请输入路由参数',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_144),
  );
  var __VLS_142;
  var __VLS_138;
  var __VLS_114;
}
if (__VLS_ctx.formData.menuType !== 'F') {
  const __VLS_147 = {}.ElRow;
  /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
  const __VLS_148 = __VLS_asFunctionalComponent(
    __VLS_147,
    new __VLS_147({
      gutter: 20,
    }),
  );
  const __VLS_149 = __VLS_148(
    {
      gutter: 20,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_148),
  );
  __VLS_150.slots.default;
  const __VLS_151 = {}.ElCol;
  /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
  const __VLS_152 = __VLS_asFunctionalComponent(
    __VLS_151,
    new __VLS_151({
      span: 12,
    }),
  );
  const __VLS_153 = __VLS_152(
    {
      span: 12,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_152),
  );
  __VLS_154.slots.default;
  const __VLS_155 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_156 = __VLS_asFunctionalComponent(
    __VLS_155,
    new __VLS_155({
      label: '是否外链',
      prop: 'isFrame',
    }),
  );
  const __VLS_157 = __VLS_156(
    {
      label: '是否外链',
      prop: 'isFrame',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_156),
  );
  __VLS_158.slots.default;
  const __VLS_159 = {}.ElRadioGroup;
  /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ // @ts-ignore
  const __VLS_160 = __VLS_asFunctionalComponent(
    __VLS_159,
    new __VLS_159({
      modelValue: __VLS_ctx.formData.isFrame,
    }),
  );
  const __VLS_161 = __VLS_160(
    {
      modelValue: __VLS_ctx.formData.isFrame,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_160),
  );
  __VLS_162.slots.default;
  const __VLS_163 = {}.ElRadio;
  /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
  const __VLS_164 = __VLS_asFunctionalComponent(
    __VLS_163,
    new __VLS_163({
      label: true,
    }),
  );
  const __VLS_165 = __VLS_164(
    {
      label: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_164),
  );
  __VLS_166.slots.default;
  var __VLS_166;
  const __VLS_167 = {}.ElRadio;
  /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
  const __VLS_168 = __VLS_asFunctionalComponent(
    __VLS_167,
    new __VLS_167({
      label: false,
    }),
  );
  const __VLS_169 = __VLS_168(
    {
      label: false,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_168),
  );
  __VLS_170.slots.default;
  var __VLS_170;
  var __VLS_162;
  var __VLS_158;
  var __VLS_154;
  const __VLS_171 = {}.ElCol;
  /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
  const __VLS_172 = __VLS_asFunctionalComponent(
    __VLS_171,
    new __VLS_171({
      span: 12,
    }),
  );
  const __VLS_173 = __VLS_172(
    {
      span: 12,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_172),
  );
  __VLS_174.slots.default;
  const __VLS_175 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_176 = __VLS_asFunctionalComponent(
    __VLS_175,
    new __VLS_175({
      label: '是否缓存',
      prop: 'isCache',
    }),
  );
  const __VLS_177 = __VLS_176(
    {
      label: '是否缓存',
      prop: 'isCache',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_176),
  );
  __VLS_178.slots.default;
  const __VLS_179 = {}.ElRadioGroup;
  /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ // @ts-ignore
  const __VLS_180 = __VLS_asFunctionalComponent(
    __VLS_179,
    new __VLS_179({
      modelValue: __VLS_ctx.formData.isCache,
    }),
  );
  const __VLS_181 = __VLS_180(
    {
      modelValue: __VLS_ctx.formData.isCache,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_180),
  );
  __VLS_182.slots.default;
  const __VLS_183 = {}.ElRadio;
  /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
  const __VLS_184 = __VLS_asFunctionalComponent(
    __VLS_183,
    new __VLS_183({
      label: true,
    }),
  );
  const __VLS_185 = __VLS_184(
    {
      label: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_184),
  );
  __VLS_186.slots.default;
  var __VLS_186;
  const __VLS_187 = {}.ElRadio;
  /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
  const __VLS_188 = __VLS_asFunctionalComponent(
    __VLS_187,
    new __VLS_187({
      label: false,
    }),
  );
  const __VLS_189 = __VLS_188(
    {
      label: false,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_188),
  );
  __VLS_190.slots.default;
  var __VLS_190;
  var __VLS_182;
  var __VLS_178;
  var __VLS_174;
  var __VLS_150;
}
const __VLS_191 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
const __VLS_192 = __VLS_asFunctionalComponent(
  __VLS_191,
  new __VLS_191({
    gutter: 20,
  }),
);
const __VLS_193 = __VLS_192(
  {
    gutter: 20,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_192),
);
__VLS_194.slots.default;
const __VLS_195 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent(
  __VLS_195,
  new __VLS_195({
    span: 12,
  }),
);
const __VLS_197 = __VLS_196(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_196),
);
__VLS_198.slots.default;
const __VLS_199 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_200 = __VLS_asFunctionalComponent(
  __VLS_199,
  new __VLS_199({
    label: '权限标识',
    prop: 'perms',
  }),
);
const __VLS_201 = __VLS_200(
  {
    label: '权限标识',
    prop: 'perms',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_200),
);
__VLS_202.slots.default;
const __VLS_203 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_204 = __VLS_asFunctionalComponent(
  __VLS_203,
  new __VLS_203({
    modelValue: __VLS_ctx.formData.perms,
    placeholder: '请输入权限标识',
  }),
);
const __VLS_205 = __VLS_204(
  {
    modelValue: __VLS_ctx.formData.perms,
    placeholder: '请输入权限标识',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_204),
);
__VLS_206.slots.default;
{
  const { prepend: __VLS_thisSlot } = __VLS_206.slots;
}
var __VLS_206;
var __VLS_202;
var __VLS_198;
const __VLS_207 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent(
  __VLS_207,
  new __VLS_207({
    span: 12,
  }),
);
const __VLS_209 = __VLS_208(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_208),
);
__VLS_210.slots.default;
const __VLS_211 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_212 = __VLS_asFunctionalComponent(
  __VLS_211,
  new __VLS_211({
    label: '状态',
    prop: 'status',
  }),
);
const __VLS_213 = __VLS_212(
  {
    label: '状态',
    prop: 'status',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_212),
);
__VLS_214.slots.default;
const __VLS_215 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ // @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent(
  __VLS_215,
  new __VLS_215({
    modelValue: __VLS_ctx.formData.status,
  }),
);
const __VLS_217 = __VLS_216(
  {
    modelValue: __VLS_ctx.formData.status,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_216),
);
__VLS_218.slots.default;
const __VLS_219 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_220 = __VLS_asFunctionalComponent(
  __VLS_219,
  new __VLS_219({
    label: '0',
  }),
);
const __VLS_221 = __VLS_220(
  {
    label: '0',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_220),
);
__VLS_222.slots.default;
var __VLS_222;
const __VLS_223 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_224 = __VLS_asFunctionalComponent(
  __VLS_223,
  new __VLS_223({
    label: '1',
  }),
);
const __VLS_225 = __VLS_224(
  {
    label: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_224),
);
__VLS_226.slots.default;
var __VLS_226;
var __VLS_218;
var __VLS_214;
var __VLS_210;
var __VLS_194;
var __VLS_12;
{
  const { footer: __VLS_thisSlot } = __VLS_3.slots;
  const __VLS_227 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_228 = __VLS_asFunctionalComponent(
    __VLS_227,
    new __VLS_227({
      ...{ onClick: {} },
    }),
  );
  const __VLS_229 = __VLS_228(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_228),
  );
  let __VLS_231;
  let __VLS_232;
  let __VLS_233;
  const __VLS_234 = {
    onClick: __VLS_ctx.handleClose,
  };
  __VLS_230.slots.default;
  var __VLS_230;
  const __VLS_235 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_236 = __VLS_asFunctionalComponent(
    __VLS_235,
    new __VLS_235({
      ...{ onClick: {} },
      type: 'primary',
      loading: __VLS_ctx.submitting,
    }),
  );
  const __VLS_237 = __VLS_236(
    {
      ...{ onClick: {} },
      type: 'primary',
      loading: __VLS_ctx.submitting,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_236),
  );
  let __VLS_239;
  let __VLS_240;
  let __VLS_241;
  const __VLS_242 = {
    onClick: __VLS_ctx.handleSubmit,
  };
  __VLS_238.slots.default;
  var __VLS_238;
}
/** @type {[typeof MenuIcon, ]} */ // @ts-ignore
const __VLS_243 = __VLS_asFunctionalComponent(
  MenuIcon,
  new MenuIcon({
    ...{ onSelect: {} },
    modelValue: __VLS_ctx.showIconDialog,
  }),
);
const __VLS_244 = __VLS_243(
  {
    ...{ onSelect: {} },
    modelValue: __VLS_ctx.showIconDialog,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_243),
);
let __VLS_246;
let __VLS_247;
let __VLS_248;
const __VLS_249 = {
  onSelect: __VLS_ctx.handleIconSelect,
};
var __VLS_245;
var __VLS_3;
// @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      MenuIcon: MenuIcon,
      visible: visible,
      isEdit: isEdit,
      formRef: formRef,
      submitting: submitting,
      menuTree: menuTree,
      showIconDialog: showIconDialog,
      formData: formData,
      rules: rules,
      handleSubmit: handleSubmit,
      handleClose: handleClose,
      handleIconSelect: handleIconSelect,
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
//# sourceMappingURL=MenuForm.vue.js.map

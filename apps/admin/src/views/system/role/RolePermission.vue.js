/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { authRoleAll, dataScope } from '@/api/system/role.api';
import { getMenuTree } from '@/api/system/menu.api';
import { getDeptTree } from '@/api/system/dept.api';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
const checkStrictly = computed(() => {
  return formData.value.dataScope !== '2';
});
// 状态
const submitting = ref(false);
const menuTree = ref([]);
const deptTree = ref([]);
const menuTreeRef = ref();
const deptTreeRef = ref();
// 表单数据
const formData = ref({
  dataScope: '1',
});
// 加载菜单树
async function fetchMenuTree() {
  try {
    menuTree.value = await getMenuTree();
  } catch (error) {
    console.error('加载菜单树失败', error);
  }
}
// 加载部门树
async function fetchDeptTree() {
  try {
    deptTree.value = await getDeptTree();
  } catch (error) {
    console.error('加载部门树失败', error);
  }
}
// 加载角色菜单权限
async function fetchRoleMenus() {
  if (!props.roleId) return;
  try {
    const menuIds = [];
    nextTick(() => {
      menuTreeRef.value?.setCheckedKeys(menuIds);
    });
  } catch (error) {
    console.error('加载角色菜单失败', error);
  }
}
// 加载角色数据权限
async function fetchRoleDataScope() {
  if (!props.roleId) return;
  try {
    formData.value.dataScope = '1';
    nextTick(() => {
      deptTreeRef.value?.setCheckedKeys([]);
    });
  } catch (error) {
    console.error('加载角色数据权限失败', error);
  }
}
// 提交
async function handleSubmit() {
  if (!props.roleId) return;
  try {
    submitting.value = true;
    // 获取选中的菜单ID
    const checkedKeys = menuTreeRef.value?.getCheckedKeys() || [];
    const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys() || [];
    const menuIds = [...checkedKeys, ...halfCheckedKeys];
    // 分配菜单权限
    await authRoleAll(props.roleId, menuIds);
    // 分配数据权限
    let deptIds;
    if (formData.value.dataScope === '2') {
      deptIds = [
        ...(deptTreeRef.value?.getCheckedKeys() || []),
        ...(deptTreeRef.value?.getHalfCheckedKeys() || []),
      ];
    }
    await dataScope({
      roleId: props.roleId,
      dataScope: formData.value.dataScope,
      menuIds: deptIds,
    });
    ElMessage.success('分配成功');
    handleClose();
  } catch (error) {
    console.error('分配失败', error);
  } finally {
    submitting.value = false;
  }
}
// 关闭
function handleClose() {
  menuTreeRef.value?.setCheckedKeys([]);
  deptTreeRef.value?.setCheckedKeys([]);
  visible.value = false;
}
// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fetchMenuTree();
    fetchDeptTree();
    fetchRoleMenus();
    fetchRoleDataScope();
  }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection
// CSS variable injection end
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    modelValue: __VLS_ctx.visible,
    title: '权限分配',
    width: '600px',
    appendToBody: true,
  }),
);
const __VLS_2 = __VLS_1(
  {
    modelValue: __VLS_ctx.visible,
    title: '权限分配',
    width: '600px',
    appendToBody: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'permission-assign' },
});
const __VLS_5 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ // @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(
  __VLS_5,
  new __VLS_5({
    title: '注意：勾选菜单即为授权',
    type: 'info',
    closable: false,
    ...{ style: {} },
  }),
);
const __VLS_7 = __VLS_6(
  {
    title: '注意：勾选菜单即为授权',
    type: 'info',
    closable: false,
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_6),
);
const __VLS_9 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(
  __VLS_9,
  new __VLS_9({
    model: __VLS_ctx.formData,
    labelWidth: '100px',
  }),
);
const __VLS_11 = __VLS_10(
  {
    model: __VLS_ctx.formData,
    labelWidth: '100px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_10),
);
__VLS_12.slots.default;
const __VLS_13 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(
  __VLS_13,
  new __VLS_13({
    label: '数据权限',
  }),
);
const __VLS_15 = __VLS_14(
  {
    label: '数据权限',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_14),
);
__VLS_16.slots.default;
const __VLS_17 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(
  __VLS_17,
  new __VLS_17({
    modelValue: __VLS_ctx.formData.dataScope,
    placeholder: '请选择数据权限',
  }),
);
const __VLS_19 = __VLS_18(
  {
    modelValue: __VLS_ctx.formData.dataScope,
    placeholder: '请选择数据权限',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_18),
);
__VLS_20.slots.default;
const __VLS_21 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(
  __VLS_21,
  new __VLS_21({
    label: '全部数据权限',
    value: '1',
  }),
);
const __VLS_23 = __VLS_22(
  {
    label: '全部数据权限',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_22),
);
const __VLS_25 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(
  __VLS_25,
  new __VLS_25({
    label: '自定义数据权限',
    value: '2',
  }),
);
const __VLS_27 = __VLS_26(
  {
    label: '自定义数据权限',
    value: '2',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_26),
);
const __VLS_29 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(
  __VLS_29,
  new __VLS_29({
    label: '本部门数据权限',
    value: '3',
  }),
);
const __VLS_31 = __VLS_30(
  {
    label: '本部门数据权限',
    value: '3',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_30),
);
const __VLS_33 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(
  __VLS_33,
  new __VLS_33({
    label: '本部门及以下数据权限',
    value: '4',
  }),
);
const __VLS_35 = __VLS_34(
  {
    label: '本部门及以下数据权限',
    value: '4',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_34),
);
const __VLS_37 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(
  __VLS_37,
  new __VLS_37({
    label: '仅本人数据权限',
    value: '5',
  }),
);
const __VLS_39 = __VLS_38(
  {
    label: '仅本人数据权限',
    value: '5',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_38),
);
var __VLS_20;
var __VLS_16;
if (__VLS_ctx.formData.dataScope === '2') {
  const __VLS_41 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_42 = __VLS_asFunctionalComponent(
    __VLS_41,
    new __VLS_41({
      label: '自定义部门',
    }),
  );
  const __VLS_43 = __VLS_42(
    {
      label: '自定义部门',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_42),
  );
  __VLS_44.slots.default;
  const __VLS_45 = {}.ElTree;
  /** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ // @ts-ignore
  const __VLS_46 = __VLS_asFunctionalComponent(
    __VLS_45,
    new __VLS_45({
      ref: 'deptTreeRef',
      data: __VLS_ctx.deptTree,
      props: { label: 'deptName', children: 'children' },
      nodeKey: 'deptId',
      showCheckbox: true,
      defaultExpandAll: true,
    }),
  );
  const __VLS_47 = __VLS_46(
    {
      ref: 'deptTreeRef',
      data: __VLS_ctx.deptTree,
      props: { label: 'deptName', children: 'children' },
      nodeKey: 'deptId',
      showCheckbox: true,
      defaultExpandAll: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_46),
  );
  /** @type {typeof __VLS_ctx.deptTreeRef} */ var __VLS_49 = {};
  var __VLS_48;
  var __VLS_44;
}
const __VLS_51 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(
  __VLS_51,
  new __VLS_51({
    label: '菜单权限',
  }),
);
const __VLS_53 = __VLS_52(
  {
    label: '菜单权限',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_52),
);
__VLS_54.slots.default;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'menu-tree-wrap' },
});
const __VLS_55 = {}.ElTree;
/** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ // @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(
  __VLS_55,
  new __VLS_55({
    ref: 'menuTreeRef',
    data: __VLS_ctx.menuTree,
    props: { label: 'menuName', children: 'children' },
    nodeKey: 'menuId',
    checkStrictly: __VLS_ctx.checkStrictly,
    showCheckbox: true,
    defaultExpandAll: true,
  }),
);
const __VLS_57 = __VLS_56(
  {
    ref: 'menuTreeRef',
    data: __VLS_ctx.menuTree,
    props: { label: 'menuName', children: 'children' },
    nodeKey: 'menuId',
    checkStrictly: __VLS_ctx.checkStrictly,
    showCheckbox: true,
    defaultExpandAll: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_56),
);
/** @type {typeof __VLS_ctx.menuTreeRef} */ var __VLS_59 = {};
var __VLS_58;
var __VLS_54;
var __VLS_12;
{
  const { footer: __VLS_thisSlot } = __VLS_3.slots;
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
      type: 'primary',
      loading: __VLS_ctx.submitting,
    }),
  );
  const __VLS_71 = __VLS_70(
    {
      ...{ onClick: {} },
      type: 'primary',
      loading: __VLS_ctx.submitting,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_70),
  );
  let __VLS_73;
  let __VLS_74;
  let __VLS_75;
  const __VLS_76 = {
    onClick: __VLS_ctx.handleSubmit,
  };
  __VLS_72.slots.default;
  var __VLS_72;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['permission-assign']} */ /** @type {__VLS_StyleScopedClasses['menu-tree-wrap']} */ // @ts-ignore
var __VLS_50 = __VLS_49,
  __VLS_60 = __VLS_59;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      visible: visible,
      checkStrictly: checkStrictly,
      submitting: submitting,
      menuTree: menuTree,
      deptTree: deptTree,
      menuTreeRef: menuTreeRef,
      deptTreeRef: deptTreeRef,
      formData: formData,
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
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=RolePermission.vue.js.map

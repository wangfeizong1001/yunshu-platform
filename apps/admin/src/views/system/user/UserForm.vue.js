import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { addUser, updateUser, getAllRoles } from '@/api/system/user.api';
import { getDeptTreeSelect } from '@/api/system/dept.api';
import { getPostSelect } from '@/api/system/post.api';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
const isEdit = computed(() => !!props.userData?.userId);
// 状态
const formRef = ref();
const submitting = ref(false);
const deptTree = ref([]);
const postList = ref([]);
const roleList = ref([]);
// 表单数据
const formData = ref({
  username: '',
  nickname: '',
  phone: '',
  email: '',
  sex: '2',
  status: '0',
  deptId: undefined,
  postId: [],
  roleId: [],
  password: '',
  remark: '',
});
// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
};
// 加载部门树
async function fetchDeptTree() {
  try {
    const res = await getDeptTreeSelect();
    deptTree.value = res;
  } catch (error) {
    console.error('加载部门树失败', error);
  }
}
// 加载岗位列表
async function fetchPostList() {
  try {
    const res = await getPostSelect();
    postList.value = res;
  } catch (error) {
    console.error('加载岗位列表失败', error);
  }
}
// 加载角色列表
async function fetchRoleList() {
  try {
    const res = await getAllRoles();
    roleList.value = res;
  } catch (error) {
    console.error('加载角色列表失败', error);
  }
}
// 填充表单数据
function fillFormData() {
  if (props.userData) {
    formData.value = {
      username: props.userData.username,
      nickname: props.userData.nickname,
      phone: props.userData.phone,
      email: props.userData.email,
      sex: props.userData.sex,
      status: props.userData.status,
      deptId: props.userData.deptId,
      postId: props.userData.postId || [],
      roleId: props.userData.roleId || [],
      password: '',
      remark: props.userData.remark,
    };
  } else {
    formData.value = {
      username: '',
      nickname: '',
      phone: '',
      email: '',
      sex: '2',
      status: '0',
      deptId: undefined,
      postId: [],
      roleId: [],
      password: '',
      remark: '',
    };
  }
}
// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (isEdit.value) {
      await updateUser({ userId: props.userData.userId, ...formData.value });
      ElMessage.success('修改成功');
    } else {
      await addUser(formData.value);
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
// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fetchDeptTree();
    fetchPostList();
    fetchRoleList();
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
    title: __VLS_ctx.isEdit ? '编辑用户' : '新增用户',
    width: '600px',
    appendToBody: true,
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ onClose: {} },
    modelValue: __VLS_ctx.visible,
    title: __VLS_ctx.isEdit ? '编辑用户' : '新增用户',
    width: '600px',
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
    labelWidth: '80px',
  }),
);
const __VLS_11 = __VLS_10(
  {
    ref: 'formRef',
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.rules,
    labelWidth: '80px',
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
    label: '用户名称',
    prop: 'username',
  }),
);
const __VLS_25 = __VLS_24(
  {
    label: '用户名称',
    prop: 'username',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_24),
);
__VLS_26.slots.default;
const __VLS_27 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(
  __VLS_27,
  new __VLS_27({
    modelValue: __VLS_ctx.formData.username,
    placeholder: '请输入用户名称',
    disabled: __VLS_ctx.isEdit,
  }),
);
const __VLS_29 = __VLS_28(
  {
    modelValue: __VLS_ctx.formData.username,
    placeholder: '请输入用户名称',
    disabled: __VLS_ctx.isEdit,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_28),
);
var __VLS_26;
var __VLS_22;
const __VLS_31 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(
  __VLS_31,
  new __VLS_31({
    span: 12,
  }),
);
const __VLS_33 = __VLS_32(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_32),
);
__VLS_34.slots.default;
const __VLS_35 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(
  __VLS_35,
  new __VLS_35({
    label: '用户昵称',
    prop: 'nickname',
  }),
);
const __VLS_37 = __VLS_36(
  {
    label: '用户昵称',
    prop: 'nickname',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_36),
);
__VLS_38.slots.default;
const __VLS_39 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(
  __VLS_39,
  new __VLS_39({
    modelValue: __VLS_ctx.formData.nickname,
    placeholder: '请输入用户昵称',
  }),
);
const __VLS_41 = __VLS_40(
  {
    modelValue: __VLS_ctx.formData.nickname,
    placeholder: '请输入用户昵称',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_40),
);
var __VLS_38;
var __VLS_34;
var __VLS_18;
const __VLS_43 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(
  __VLS_43,
  new __VLS_43({
    gutter: 20,
  }),
);
const __VLS_45 = __VLS_44(
  {
    gutter: 20,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_44),
);
__VLS_46.slots.default;
const __VLS_47 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(
  __VLS_47,
  new __VLS_47({
    span: 12,
  }),
);
const __VLS_49 = __VLS_48(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_48),
);
__VLS_50.slots.default;
const __VLS_51 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(
  __VLS_51,
  new __VLS_51({
    label: '手机号码',
    prop: 'phone',
  }),
);
const __VLS_53 = __VLS_52(
  {
    label: '手机号码',
    prop: 'phone',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_52),
);
__VLS_54.slots.default;
const __VLS_55 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(
  __VLS_55,
  new __VLS_55({
    modelValue: __VLS_ctx.formData.phone,
    placeholder: '请输入手机号码',
  }),
);
const __VLS_57 = __VLS_56(
  {
    modelValue: __VLS_ctx.formData.phone,
    placeholder: '请输入手机号码',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_56),
);
var __VLS_54;
var __VLS_50;
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
    label: '邮箱',
    prop: 'email',
  }),
);
const __VLS_65 = __VLS_64(
  {
    label: '邮箱',
    prop: 'email',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_64),
);
__VLS_66.slots.default;
const __VLS_67 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(
  __VLS_67,
  new __VLS_67({
    modelValue: __VLS_ctx.formData.email,
    placeholder: '请输入邮箱',
  }),
);
const __VLS_69 = __VLS_68(
  {
    modelValue: __VLS_ctx.formData.email,
    placeholder: '请输入邮箱',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_68),
);
var __VLS_66;
var __VLS_62;
var __VLS_46;
const __VLS_71 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(
  __VLS_71,
  new __VLS_71({
    gutter: 20,
  }),
);
const __VLS_73 = __VLS_72(
  {
    gutter: 20,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_72),
);
__VLS_74.slots.default;
const __VLS_75 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(
  __VLS_75,
  new __VLS_75({
    span: 12,
  }),
);
const __VLS_77 = __VLS_76(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_76),
);
__VLS_78.slots.default;
const __VLS_79 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(
  __VLS_79,
  new __VLS_79({
    label: '性别',
    prop: 'sex',
  }),
);
const __VLS_81 = __VLS_80(
  {
    label: '性别',
    prop: 'sex',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_80),
);
__VLS_82.slots.default;
const __VLS_83 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(
  __VLS_83,
  new __VLS_83({
    modelValue: __VLS_ctx.formData.sex,
    placeholder: '请选择性别',
  }),
);
const __VLS_85 = __VLS_84(
  {
    modelValue: __VLS_ctx.formData.sex,
    placeholder: '请选择性别',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_84),
);
__VLS_86.slots.default;
const __VLS_87 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(
  __VLS_87,
  new __VLS_87({
    label: '男',
    value: '0',
  }),
);
const __VLS_89 = __VLS_88(
  {
    label: '男',
    value: '0',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_88),
);
const __VLS_91 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(
  __VLS_91,
  new __VLS_91({
    label: '女',
    value: '1',
  }),
);
const __VLS_93 = __VLS_92(
  {
    label: '女',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_92),
);
const __VLS_95 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(
  __VLS_95,
  new __VLS_95({
    label: '未知',
    value: '2',
  }),
);
const __VLS_97 = __VLS_96(
  {
    label: '未知',
    value: '2',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_96),
);
var __VLS_86;
var __VLS_82;
var __VLS_78;
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
    label: '状态',
    prop: 'status',
  }),
);
const __VLS_105 = __VLS_104(
  {
    label: '状态',
    prop: 'status',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_104),
);
__VLS_106.slots.default;
const __VLS_107 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ // @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(
  __VLS_107,
  new __VLS_107({
    modelValue: __VLS_ctx.formData.status,
  }),
);
const __VLS_109 = __VLS_108(
  {
    modelValue: __VLS_ctx.formData.status,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_108),
);
__VLS_110.slots.default;
const __VLS_111 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(
  __VLS_111,
  new __VLS_111({
    label: '0',
  }),
);
const __VLS_113 = __VLS_112(
  {
    label: '0',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_112),
);
__VLS_114.slots.default;
var __VLS_114;
const __VLS_115 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(
  __VLS_115,
  new __VLS_115({
    label: '1',
  }),
);
const __VLS_117 = __VLS_116(
  {
    label: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_116),
);
__VLS_118.slots.default;
var __VLS_118;
var __VLS_110;
var __VLS_106;
var __VLS_102;
var __VLS_74;
const __VLS_119 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(
  __VLS_119,
  new __VLS_119({
    gutter: 20,
  }),
);
const __VLS_121 = __VLS_120(
  {
    gutter: 20,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_120),
);
__VLS_122.slots.default;
const __VLS_123 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(
  __VLS_123,
  new __VLS_123({
    span: 12,
  }),
);
const __VLS_125 = __VLS_124(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_124),
);
__VLS_126.slots.default;
const __VLS_127 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(
  __VLS_127,
  new __VLS_127({
    label: '部门',
    prop: 'deptId',
  }),
);
const __VLS_129 = __VLS_128(
  {
    label: '部门',
    prop: 'deptId',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_128),
);
__VLS_130.slots.default;
const __VLS_131 = {}.ElTreeSelect;
/** @type {[typeof __VLS_components.ElTreeSelect, typeof __VLS_components.elTreeSelect, ]} */ // @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(
  __VLS_131,
  new __VLS_131({
    modelValue: __VLS_ctx.formData.deptId,
    data: __VLS_ctx.deptTree,
    props: {
      value: 'deptId',
      label: 'deptName',
      children: 'children',
    },
    placeholder: '请选择部门',
    checkStrictly: true,
    filterable: true,
    clearable: true,
  }),
);
const __VLS_133 = __VLS_132(
  {
    modelValue: __VLS_ctx.formData.deptId,
    data: __VLS_ctx.deptTree,
    props: {
      value: 'deptId',
      label: 'deptName',
      children: 'children',
    },
    placeholder: '请选择部门',
    checkStrictly: true,
    filterable: true,
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_132),
);
var __VLS_130;
var __VLS_126;
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
    label: '岗位',
    prop: 'postId',
  }),
);
const __VLS_141 = __VLS_140(
  {
    label: '岗位',
    prop: 'postId',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_140),
);
__VLS_142.slots.default;
const __VLS_143 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(
  __VLS_143,
  new __VLS_143({
    modelValue: __VLS_ctx.formData.postId,
    multiple: true,
    placeholder: '请选择岗位',
    clearable: true,
  }),
);
const __VLS_145 = __VLS_144(
  {
    modelValue: __VLS_ctx.formData.postId,
    multiple: true,
    placeholder: '请选择岗位',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_144),
);
__VLS_146.slots.default;
for (const [post] of __VLS_getVForSourceType(__VLS_ctx.postList)) {
  const __VLS_147 = {}.ElOption;
  /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
  const __VLS_148 = __VLS_asFunctionalComponent(
    __VLS_147,
    new __VLS_147({
      key: post.postId,
      label: post.postName,
      value: post.postId,
    }),
  );
  const __VLS_149 = __VLS_148(
    {
      key: post.postId,
      label: post.postName,
      value: post.postId,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_148),
  );
}
var __VLS_146;
var __VLS_142;
var __VLS_138;
var __VLS_122;
const __VLS_151 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(
  __VLS_151,
  new __VLS_151({
    gutter: 20,
  }),
);
const __VLS_153 = __VLS_152(
  {
    gutter: 20,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_152),
);
__VLS_154.slots.default;
const __VLS_155 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(
  __VLS_155,
  new __VLS_155({
    span: 12,
  }),
);
const __VLS_157 = __VLS_156(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_156),
);
__VLS_158.slots.default;
const __VLS_159 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(
  __VLS_159,
  new __VLS_159({
    label: '角色',
    prop: 'roleId',
  }),
);
const __VLS_161 = __VLS_160(
  {
    label: '角色',
    prop: 'roleId',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_160),
);
__VLS_162.slots.default;
const __VLS_163 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(
  __VLS_163,
  new __VLS_163({
    modelValue: __VLS_ctx.formData.roleId,
    multiple: true,
    placeholder: '请选择角色',
    clearable: true,
  }),
);
const __VLS_165 = __VLS_164(
  {
    modelValue: __VLS_ctx.formData.roleId,
    multiple: true,
    placeholder: '请选择角色',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_164),
);
__VLS_166.slots.default;
for (const [role] of __VLS_getVForSourceType(__VLS_ctx.roleList)) {
  const __VLS_167 = {}.ElOption;
  /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
  const __VLS_168 = __VLS_asFunctionalComponent(
    __VLS_167,
    new __VLS_167({
      key: role.roleId,
      label: role.roleName,
      value: role.roleId,
    }),
  );
  const __VLS_169 = __VLS_168(
    {
      key: role.roleId,
      label: role.roleName,
      value: role.roleId,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_168),
  );
}
var __VLS_166;
var __VLS_162;
var __VLS_158;
var __VLS_154;
if (!__VLS_ctx.isEdit) {
  const __VLS_171 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_172 = __VLS_asFunctionalComponent(
    __VLS_171,
    new __VLS_171({
      label: '登录密码',
      prop: 'password',
    }),
  );
  const __VLS_173 = __VLS_172(
    {
      label: '登录密码',
      prop: 'password',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_172),
  );
  __VLS_174.slots.default;
  const __VLS_175 = {}.ElInput;
  /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
  const __VLS_176 = __VLS_asFunctionalComponent(
    __VLS_175,
    new __VLS_175({
      modelValue: __VLS_ctx.formData.password,
      type: 'password',
      placeholder: '请输入登录密码',
      showPassword: true,
    }),
  );
  const __VLS_177 = __VLS_176(
    {
      modelValue: __VLS_ctx.formData.password,
      type: 'password',
      placeholder: '请输入登录密码',
      showPassword: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_176),
  );
  var __VLS_174;
}
const __VLS_179 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent(
  __VLS_179,
  new __VLS_179({
    label: '备注',
    prop: 'remark',
  }),
);
const __VLS_181 = __VLS_180(
  {
    label: '备注',
    prop: 'remark',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_180),
);
__VLS_182.slots.default;
const __VLS_183 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent(
  __VLS_183,
  new __VLS_183({
    modelValue: __VLS_ctx.formData.remark,
    type: 'textarea',
    placeholder: '请输入备注',
  }),
);
const __VLS_185 = __VLS_184(
  {
    modelValue: __VLS_ctx.formData.remark,
    type: 'textarea',
    placeholder: '请输入备注',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_184),
);
var __VLS_182;
var __VLS_12;
{
  const { footer: __VLS_thisSlot } = __VLS_3.slots;
  const __VLS_187 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_188 = __VLS_asFunctionalComponent(
    __VLS_187,
    new __VLS_187({
      ...{ onClick: {} },
    }),
  );
  const __VLS_189 = __VLS_188(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_188),
  );
  let __VLS_191;
  let __VLS_192;
  let __VLS_193;
  const __VLS_194 = {
    onClick: __VLS_ctx.handleClose,
  };
  __VLS_190.slots.default;
  var __VLS_190;
  const __VLS_195 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_196 = __VLS_asFunctionalComponent(
    __VLS_195,
    new __VLS_195({
      ...{ onClick: {} },
      type: 'primary',
      loading: __VLS_ctx.submitting,
    }),
  );
  const __VLS_197 = __VLS_196(
    {
      ...{ onClick: {} },
      type: 'primary',
      loading: __VLS_ctx.submitting,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_196),
  );
  let __VLS_199;
  let __VLS_200;
  let __VLS_201;
  const __VLS_202 = {
    onClick: __VLS_ctx.handleSubmit,
  };
  __VLS_198.slots.default;
  var __VLS_198;
}
var __VLS_3;
// @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      visible: visible,
      isEdit: isEdit,
      formRef: formRef,
      submitting: submitting,
      deptTree: deptTree,
      postList: postList,
      roleList: roleList,
      formData: formData,
      rules: rules,
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
//# sourceMappingURL=UserForm.vue.js.map

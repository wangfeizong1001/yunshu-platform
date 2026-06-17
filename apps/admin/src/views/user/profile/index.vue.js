import { ref, reactive, computed } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { User, Upload, Lock, Document } from '@element-plus/icons-vue';
// ========== 用户 Store ==========
const userStore = useUserStore();
// ========== 基本信息表单 ==========
const profileFormRef = ref();
const profileForm = reactive({
    nickname: userStore.nickname,
    email: userStore.email,
    phone: userStore.phone,
    deptName: userStore.deptName
});
/**
 * 保存个人信息
 */
const handleSaveProfile = () => {
    userStore.nickname = profileForm.nickname;
    userStore.email = profileForm.email;
    userStore.phone = profileForm.phone;
    ElMessage.success('个人信息保存成功');
};
/**
 * 头像上传前的校验
 */
const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
        ElMessage.error('只能上传图片文件');
        return false;
    }
    if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB');
        return false;
    }
    return true;
};
/**
 * 自定义上传方法（实际项目中替换为真实 API）
 */
const handleAvatarUpload = (options) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result;
        userStore.avatar = result;
        ElMessage.success('头像更换成功');
    };
    reader.readAsDataURL(options.file);
};
// ========== 修改密码表单 ==========
const passwordFormRef = ref();
const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});
const passwordStrength = computed(() => {
    const pwd = passwordForm.newPassword;
    if (!pwd) {
        return { percentage: 0, color: '', label: '' };
    }
    let score = 0;
    // 长度至少 8 位
    if (pwd.length >= 8)
        score++;
    // 包含小写字母
    if (/[a-z]/.test(pwd))
        score++;
    // 包含大写字母
    if (/[A-Z]/.test(pwd))
        score++;
    // 包含数字
    if (/[0-9]/.test(pwd))
        score++;
    // 包含特殊字符
    if (/[^a-zA-Z0-9]/.test(pwd))
        score++;
    if (score <= 2) {
        return { percentage: 33, color: 'var(--el-color-danger)', label: '弱' };
    }
    else if (score <= 3) {
        return { percentage: 66, color: 'var(--el-color-warning)', label: '中' };
    }
    else {
        return { percentage: 100, color: 'var(--el-color-success)', label: '强' };
    }
});
/**
 * 实时更新密码强度
 */
const handlePasswordInput = () => {
    // 触发响应式更新
};
/**
 * 密码校验规则
 */
const validateNewPassword = (_rule, value, callback) => {
    if (!value) {
        callback(new Error('请输入新密码'));
        return;
    }
    if (value.length < 8) {
        callback(new Error('密码长度至少 8 位'));
        return;
    }
    if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
        callback(new Error('密码需包含大小写字母和数字'));
        return;
    }
    callback();
};
const validateConfirmPassword = (_rule, value, callback) => {
    if (!value) {
        callback(new Error('请再次输入新密码'));
        return;
    }
    if (value !== passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
        return;
    }
    callback();
};
const passwordRules = {
    oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, validator: validateNewPassword, trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, validator: validateConfirmPassword, trigger: 'blur' }
    ]
};
/**
 * 修改密码
 */
const handleChangePassword = async () => {
    try {
        await passwordFormRef.value?.validate();
        // 实际项目中调用修改密码 API
        ElMessage.success('密码修改成功');
        handleResetPassword();
    }
    catch {
        // 校验失败
    }
};
/**
 * 重置密码表单
 */
const handleResetPassword = () => {
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    passwordFormRef.value?.resetFields();
};
// ========== 操作日志 ==========
/**
 * 操作日志状态常量
 */
const OPERLOG_STATUS_SUCCESS = '0';
const OPERLOG_STATUS_FAIL = '1';
const logList = [
    { id: 1, operType: '登录', operTime: '2024-01-15 09:23:45', ip: '192.168.1.100', status: '0' },
    { id: 2, operType: '查询', operTime: '2024-01-15 09:25:12', ip: '192.168.1.100', status: '0' },
    { id: 3, operType: '新增', operTime: '2024-01-15 10:15:33', ip: '192.168.1.100', status: '0' },
    { id: 4, operType: '修改', operTime: '2024-01-15 11:30:08', ip: '192.168.1.100', status: '0' },
    { id: 5, operType: '删除', operTime: '2024-01-15 14:22:17', ip: '192.168.1.101', status: '0' },
    { id: 6, operType: '导出', operTime: '2024-01-15 15:45:29', ip: '192.168.1.100', status: '0' },
    { id: 7, operType: '导入', operTime: '2024-01-15 16:08:55', ip: '192.168.1.102', status: '0' },
    { id: 8, operType: '登录', operTime: '2024-01-16 08:30:00', ip: '192.168.1.100', status: '0' },
    { id: 9, operType: '重置密码', operTime: '2024-01-16 09:15:42', ip: '192.168.1.101', status: '0' },
    { id: 10, operType: '修改', operTime: '2024-01-16 10:33:18', ip: '192.168.1.100', status: '0' },
    { id: 11, operType: '删除', operTime: '2024-01-16 11:50:07', ip: '192.168.1.103', status: '0' },
    { id: 12, operType: '查询', operTime: '2024-01-16 13:25:36', ip: '192.168.1.100', status: '0' },
    { id: 13, operType: '新增', operTime: '2024-01-16 14:40:21', ip: '192.168.1.102', status: '0' },
    { id: 14, operType: '登出', operTime: '2024-01-16 18:00:00', ip: '192.168.1.100', status: '0' }
];
/**
 * 分页配置
 */
const pagination = reactive({
    page: 1,
    pageSize: 10
});
/**
 * 当前页数据
 */
const paginatedLogs = computed(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return logList.slice(start, end);
});
/**
 * 操作类型 -> tag 类型映射
 */
const OPER_TYPE_TAG_MAP = {
    查询: 'info',
    新增: 'success',
    修改: 'warning',
    删除: 'danger',
    导出: 'primary',
    导入: 'primary',
    登录: 'success',
    登出: 'info',
    重置密码: 'warning'
};
/**
 * 获取操作类型 tag 类型
 */
const getOperTypeTagType = (type) => {
    return OPER_TYPE_TAG_MAP[type] || 'info';
};
/**
 * 获取状态文本
 */
const getStatusText = (status) => {
    return status === OPERLOG_STATUS_SUCCESS ? '成功' : '失败';
};
/**
 * 获取状态 tag 类型
 */
const getStatusTagType = (status) => {
    return status === OPERLOG_STATUS_SUCCESS ? 'success' : 'danger';
};
/**
 * 格式化时间
 */
const formatTime = (time) => {
    return time;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['el-button']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-page" },
});
const __VLS_0 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    gutter: (16),
}));
const __VLS_2 = __VLS_1({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    xs: (24),
    lg: (10),
}));
const __VLS_6 = __VLS_5({
    xs: (24),
    lg: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card profile-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-header" },
});
const __VLS_8 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.User;
/** @type {[typeof __VLS_components.User, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-section" },
});
const __VLS_16 = {}.ElAvatar;
/** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    size: (120),
    src: (__VLS_ctx.userStore.avatar),
}));
const __VLS_18 = __VLS_17({
    size: (120),
    src: (__VLS_ctx.userStore.avatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    size: (60),
}));
const __VLS_22 = __VLS_21({
    size: (60),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.User;
/** @type {[typeof __VLS_components.User, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
var __VLS_23;
var __VLS_19;
const __VLS_28 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ class: "avatar-upload" },
    action: "#",
    showFileList: (false),
    beforeUpload: (__VLS_ctx.handleBeforeUpload),
    httpRequest: (__VLS_ctx.handleAvatarUpload),
}));
const __VLS_30 = __VLS_29({
    ...{ class: "avatar-upload" },
    action: "#",
    showFileList: (false),
    beforeUpload: (__VLS_ctx.handleBeforeUpload),
    httpRequest: (__VLS_ctx.handleAvatarUpload),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    type: "primary",
    plain: true,
    size: "small",
}));
const __VLS_34 = __VLS_33({
    type: "primary",
    plain: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.Upload;
/** @type {[typeof __VLS_components.Upload, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
var __VLS_39;
var __VLS_35;
var __VLS_31;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-section" },
});
const __VLS_44 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ref: "profileFormRef",
    model: (__VLS_ctx.profileForm),
    labelWidth: "80px",
    labelPosition: "left",
}));
const __VLS_46 = __VLS_45({
    ref: "profileFormRef",
    model: (__VLS_ctx.profileForm),
    labelWidth: "80px",
    labelPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
/** @type {typeof __VLS_ctx.profileFormRef} */ ;
var __VLS_48 = {};
__VLS_47.slots.default;
const __VLS_50 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    label: "用户昵称",
}));
const __VLS_52 = __VLS_51({
    label: "用户昵称",
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
__VLS_53.slots.default;
const __VLS_54 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    modelValue: (__VLS_ctx.profileForm.nickname),
    placeholder: "请输入昵称",
}));
const __VLS_56 = __VLS_55({
    modelValue: (__VLS_ctx.profileForm.nickname),
    placeholder: "请输入昵称",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
var __VLS_53;
const __VLS_58 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    label: "邮箱",
}));
const __VLS_60 = __VLS_59({
    label: "邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
__VLS_61.slots.default;
const __VLS_62 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    modelValue: (__VLS_ctx.profileForm.email),
    placeholder: "请输入邮箱",
}));
const __VLS_64 = __VLS_63({
    modelValue: (__VLS_ctx.profileForm.email),
    placeholder: "请输入邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
var __VLS_61;
const __VLS_66 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    label: "手机号",
}));
const __VLS_68 = __VLS_67({
    label: "手机号",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
const __VLS_70 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    modelValue: (__VLS_ctx.profileForm.phone),
    placeholder: "请输入手机号",
}));
const __VLS_72 = __VLS_71({
    modelValue: (__VLS_ctx.profileForm.phone),
    placeholder: "请输入手机号",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
var __VLS_69;
const __VLS_74 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    label: "所属部门",
}));
const __VLS_76 = __VLS_75({
    label: "所属部门",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
const __VLS_78 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    modelValue: (__VLS_ctx.profileForm.deptName),
    readonly: true,
}));
const __VLS_80 = __VLS_79({
    modelValue: (__VLS_ctx.profileForm.deptName),
    readonly: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
var __VLS_77;
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-actions" },
});
const __VLS_82 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_84 = __VLS_83({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
let __VLS_86;
let __VLS_87;
let __VLS_88;
const __VLS_89 = {
    onClick: (__VLS_ctx.handleSaveProfile)
};
__VLS_85.slots.default;
var __VLS_85;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card password-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-header" },
});
const __VLS_90 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({}));
const __VLS_92 = __VLS_91({}, ...__VLS_functionalComponentArgsRest(__VLS_91));
__VLS_93.slots.default;
const __VLS_94 = {}.Lock;
/** @type {[typeof __VLS_components.Lock, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({}));
const __VLS_96 = __VLS_95({}, ...__VLS_functionalComponentArgsRest(__VLS_95));
var __VLS_93;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-body" },
});
const __VLS_98 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    ref: "passwordFormRef",
    model: (__VLS_ctx.passwordForm),
    rules: (__VLS_ctx.passwordRules),
    labelWidth: "100px",
    labelPosition: "left",
}));
const __VLS_100 = __VLS_99({
    ref: "passwordFormRef",
    model: (__VLS_ctx.passwordForm),
    rules: (__VLS_ctx.passwordRules),
    labelWidth: "100px",
    labelPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
/** @type {typeof __VLS_ctx.passwordFormRef} */ ;
var __VLS_102 = {};
__VLS_101.slots.default;
const __VLS_104 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "原密码",
    prop: "oldPassword",
}));
const __VLS_106 = __VLS_105({
    label: "原密码",
    prop: "oldPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    modelValue: (__VLS_ctx.passwordForm.oldPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入原密码",
}));
const __VLS_110 = __VLS_109({
    modelValue: (__VLS_ctx.passwordForm.oldPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入原密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
var __VLS_107;
const __VLS_112 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "新密码",
    prop: "newPassword",
}));
const __VLS_114 = __VLS_113({
    label: "新密码",
    prop: "newPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码",
}));
const __VLS_118 = __VLS_117({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
let __VLS_120;
let __VLS_121;
let __VLS_122;
const __VLS_123 = {
    onInput: (__VLS_ctx.handlePasswordInput)
};
var __VLS_119;
var __VLS_115;
if (__VLS_ctx.passwordForm.newPassword) {
    const __VLS_124 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        label: "密码强度",
    }));
    const __VLS_126 = __VLS_125({
        label: "密码强度",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "password-strength" },
    });
    const __VLS_128 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        percentage: (__VLS_ctx.passwordStrength.percentage),
        color: (__VLS_ctx.passwordStrength.color),
        showText: (false),
        strokeWidth: (8),
    }));
    const __VLS_130 = __VLS_129({
        percentage: (__VLS_ctx.passwordStrength.percentage),
        color: (__VLS_ctx.passwordStrength.color),
        showText: (false),
        strokeWidth: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "strength-text" },
        ...{ style: ({ color: __VLS_ctx.passwordStrength.color }) },
    });
    (__VLS_ctx.passwordStrength.label);
    var __VLS_127;
}
const __VLS_132 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    label: "确认密码",
    prop: "confirmPassword",
}));
const __VLS_134 = __VLS_133({
    label: "确认密码",
    prop: "confirmPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
const __VLS_136 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}));
const __VLS_138 = __VLS_137({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
var __VLS_135;
var __VLS_101;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-actions" },
});
const __VLS_140 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_142 = __VLS_141({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
let __VLS_144;
let __VLS_145;
let __VLS_146;
const __VLS_147 = {
    onClick: (__VLS_ctx.handleChangePassword)
};
__VLS_143.slots.default;
var __VLS_143;
const __VLS_148 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    ...{ 'onClick': {} },
}));
const __VLS_150 = __VLS_149({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
let __VLS_152;
let __VLS_153;
let __VLS_154;
const __VLS_155 = {
    onClick: (__VLS_ctx.handleResetPassword)
};
__VLS_151.slots.default;
var __VLS_151;
var __VLS_7;
const __VLS_156 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    xs: (24),
    lg: (14),
}));
const __VLS_158 = __VLS_157({
    xs: (24),
    lg: (14),
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card log-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-header" },
});
const __VLS_160 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({}));
const __VLS_162 = __VLS_161({}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.Document;
/** @type {[typeof __VLS_components.Document, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
var __VLS_163;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-body" },
});
const __VLS_168 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    data: (__VLS_ctx.paginatedLogs),
    stripe: true,
    size: "default",
}));
const __VLS_170 = __VLS_169({
    data: (__VLS_ctx.paginatedLogs),
    stripe: true,
    size: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
const __VLS_172 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    type: "index",
    label: "序号",
    width: "60",
    align: "center",
}));
const __VLS_174 = __VLS_173({
    type: "index",
    label: "序号",
    width: "60",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const __VLS_176 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    prop: "operType",
    label: "操作类型",
    width: "100",
}));
const __VLS_178 = __VLS_177({
    prop: "operType",
    label: "操作类型",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_179.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_180 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        type: (__VLS_ctx.getOperTypeTagType(row.operType)),
        size: "small",
    }));
    const __VLS_182 = __VLS_181({
        type: (__VLS_ctx.getOperTypeTagType(row.operType)),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    __VLS_183.slots.default;
    (row.operType);
    var __VLS_183;
}
var __VLS_179;
const __VLS_184 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    prop: "operTime",
    label: "操作时间",
    minWidth: "160",
}));
const __VLS_186 = __VLS_185({
    prop: "operTime",
    label: "操作时间",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_187.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatTime(row.operTime));
}
var __VLS_187;
const __VLS_188 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    prop: "ip",
    label: "IP",
    width: "140",
}));
const __VLS_190 = __VLS_189({
    prop: "ip",
    label: "IP",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
const __VLS_192 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    prop: "status",
    label: "状态",
    width: "80",
    align: "center",
}));
const __VLS_194 = __VLS_193({
    prop: "status",
    label: "状态",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_195.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_196 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        type: (__VLS_ctx.getStatusTagType(row.status)),
        size: "small",
    }));
    const __VLS_198 = __VLS_197({
        type: (__VLS_ctx.getStatusTagType(row.status)),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    __VLS_199.slots.default;
    (__VLS_ctx.getStatusText(row.status));
    var __VLS_199;
}
var __VLS_195;
var __VLS_171;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination-wrapper" },
});
const __VLS_200 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    currentPage: (__VLS_ctx.pagination.page),
    pageSize: (__VLS_ctx.pagination.pageSize),
    pageSizes: ([5, 10, 20]),
    total: (__VLS_ctx.logList.length),
    layout: "total, sizes, prev, pager, next, jumper",
    background: true,
}));
const __VLS_202 = __VLS_201({
    currentPage: (__VLS_ctx.pagination.page),
    pageSize: (__VLS_ctx.pagination.pageSize),
    pageSizes: ([5, 10, 20]),
    total: (__VLS_ctx.logList.length),
    layout: "total, sizes, prev, pager, next, jumper",
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
var __VLS_159;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['profile-page']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-section']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['password-strength']} */ ;
/** @type {__VLS_StyleScopedClasses['strength-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['log-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-wrapper']} */ ;
// @ts-ignore
var __VLS_49 = __VLS_48, __VLS_103 = __VLS_102;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            User: User,
            Upload: Upload,
            Lock: Lock,
            Document: Document,
            userStore: userStore,
            profileFormRef: profileFormRef,
            profileForm: profileForm,
            handleSaveProfile: handleSaveProfile,
            handleBeforeUpload: handleBeforeUpload,
            handleAvatarUpload: handleAvatarUpload,
            passwordFormRef: passwordFormRef,
            passwordForm: passwordForm,
            passwordStrength: passwordStrength,
            handlePasswordInput: handlePasswordInput,
            passwordRules: passwordRules,
            handleChangePassword: handleChangePassword,
            handleResetPassword: handleResetPassword,
            logList: logList,
            pagination: pagination,
            paginatedLogs: paginatedLogs,
            getOperTypeTagType: getOperTypeTagType,
            getStatusText: getStatusText,
            getStatusTagType: getStatusTagType,
            formatTime: formatTime,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map
/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  User,
  Lock,
  CircleCheck,
  Document,
  Setting,
  Monitor,
  Tools,
} from '@element-plus/icons-vue';
import { getCaptchaApi, loginApi } from '@/api/auth';
import { getToken, setToken } from '@/utils/auth';
const router = useRouter();
const route = useRoute();
const loginFormRef = ref();
const loading = ref(false);
const captchaEnabled = ref(true);
const captchaData = reactive({
  uuid: '',
  img: '',
  code: '',
});
const loginForm = reactive({
  username: 'admin',
  password: 'admin123',
  code: '',
  uuid: '',
  rememberMe: false,
});
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 20, message: '密码长度在 3 到 20 个字符', trigger: 'blur' },
  ],
};
// 获取验证码
const getCaptcha = async () => {
  try {
    const res = await getCaptchaApi();
    if (res.code === 200) {
      captchaData.uuid = res.data.uuid;
      captchaData.img = res.data.img;
      captchaData.code = res.data.code;
    }
  } catch (error) {
    console.error('获取验证码失败:', error);
  }
};
// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      const loginData = {
        username: loginForm.username,
        password: loginForm.password,
        code: loginForm.code,
        uuid: captchaData.uuid,
      };
      const res = await loginApi(loginData);
      if (res.code === 200) {
        const token = res.data.token;
        setToken(token);
        ElMessage.success('登录成功');
        // 获取重定向地址
        const redirect = route.query.redirect || '/';
        // 跳转到目标页面
        router.push(redirect);
      } else {
        ElMessage.error(res.msg || '登录失败');
        // 刷新验证码
        if (captchaEnabled.value) {
          getCaptcha();
        }
      }
    } catch (error) {
      ElMessage.error(error.message || '登录失败，请稍后重试');
      // 刷新验证码
      if (captchaEnabled.value) {
        getCaptcha();
      }
    } finally {
      loading.value = false;
    }
  });
};
onMounted(() => {
  // 如果已登录，直接跳转
  if (getToken()) {
    router.push('/');
  }
  // 获取验证码
  getCaptcha();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['login-left']} */ /** @type {__VLS_StyleScopedClasses['login-right']} */ // CSS variable injection
// CSS variable injection end
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'login-container' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'login-left' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'brand' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h1,
  __VLS_intrinsicElements.h1,
)({
  ...{ class: 'brand-title' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.p,
  __VLS_intrinsicElements.p,
)({
  ...{ class: 'brand-subtitle' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.p,
  __VLS_intrinsicElements.p,
)({
  ...{ class: 'brand-desc' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'features' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'feature-item' },
});
const __VLS_0 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.Document;
/** @type {[typeof __VLS_components.Document, ]} */ // @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'feature-item' },
});
const __VLS_8 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.Setting;
/** @type {[typeof __VLS_components.Setting, ]} */ // @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'feature-item' },
});
const __VLS_16 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.Monitor;
/** @type {[typeof __VLS_components.Monitor, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'feature-item' },
});
const __VLS_24 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.Tools;
/** @type {[typeof __VLS_components.Tools, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
var __VLS_27;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'login-right' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'login-form-wrapper' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h2,
  __VLS_intrinsicElements.h2,
)({
  ...{ class: 'login-title' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.p,
  __VLS_intrinsicElements.p,
)({
  ...{ class: 'login-subtitle' },
});
const __VLS_32 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    ...{ onKeyup: {} },
    ref: 'loginFormRef',
    model: __VLS_ctx.loginForm,
    rules: __VLS_ctx.loginRules,
    ...{ class: 'login-form' },
  }),
);
const __VLS_34 = __VLS_33(
  {
    ...{ onKeyup: {} },
    ref: 'loginFormRef',
    model: __VLS_ctx.loginForm,
    rules: __VLS_ctx.loginRules,
    ...{ class: 'login-form' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
let __VLS_36;
let __VLS_37;
let __VLS_38;
const __VLS_39 = {
  onKeyup: __VLS_ctx.handleLogin,
};
/** @type {typeof __VLS_ctx.loginFormRef} */ var __VLS_40 = {};
__VLS_35.slots.default;
const __VLS_42 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(
  __VLS_42,
  new __VLS_42({
    prop: 'username',
  }),
);
const __VLS_44 = __VLS_43(
  {
    prop: 'username',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_43),
);
__VLS_45.slots.default;
const __VLS_46 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(
  __VLS_46,
  new __VLS_46({
    modelValue: __VLS_ctx.loginForm.username,
    placeholder: '请输入用户名',
    size: 'large',
    prefixIcon: __VLS_ctx.User,
    clearable: true,
  }),
);
const __VLS_48 = __VLS_47(
  {
    modelValue: __VLS_ctx.loginForm.username,
    placeholder: '请输入用户名',
    size: 'large',
    prefixIcon: __VLS_ctx.User,
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_47),
);
var __VLS_45;
const __VLS_50 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(
  __VLS_50,
  new __VLS_50({
    prop: 'password',
  }),
);
const __VLS_52 = __VLS_51(
  {
    prop: 'password',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_51),
);
__VLS_53.slots.default;
const __VLS_54 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(
  __VLS_54,
  new __VLS_54({
    modelValue: __VLS_ctx.loginForm.password,
    type: 'password',
    placeholder: '请输入密码',
    size: 'large',
    prefixIcon: __VLS_ctx.Lock,
    showPassword: true,
    clearable: true,
  }),
);
const __VLS_56 = __VLS_55(
  {
    modelValue: __VLS_ctx.loginForm.password,
    type: 'password',
    placeholder: '请输入密码',
    size: 'large',
    prefixIcon: __VLS_ctx.Lock,
    showPassword: true,
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_55),
);
var __VLS_53;
if (__VLS_ctx.captchaEnabled) {
  const __VLS_58 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_59 = __VLS_asFunctionalComponent(
    __VLS_58,
    new __VLS_58({
      prop: 'code',
    }),
  );
  const __VLS_60 = __VLS_59(
    {
      prop: 'code',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_59),
  );
  __VLS_61.slots.default;
  const __VLS_62 = {}.ElInput;
  /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
  const __VLS_63 = __VLS_asFunctionalComponent(
    __VLS_62,
    new __VLS_62({
      modelValue: __VLS_ctx.loginForm.code,
      placeholder: '请输入验证码',
      size: 'large',
      prefixIcon: __VLS_ctx.CircleCheck,
      ...{ style: {} },
      maxlength: '4',
      clearable: true,
    }),
  );
  const __VLS_64 = __VLS_63(
    {
      modelValue: __VLS_ctx.loginForm.code,
      placeholder: '请输入验证码',
      size: 'large',
      prefixIcon: __VLS_ctx.CircleCheck,
      ...{ style: {} },
      maxlength: '4',
      clearable: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_63),
  );
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ onClick: __VLS_ctx.getCaptcha },
    ...{ class: 'captcha' },
  });
  const __VLS_66 = {}.ElImage;
  /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ // @ts-ignore
  const __VLS_67 = __VLS_asFunctionalComponent(
    __VLS_66,
    new __VLS_66({
      src: __VLS_ctx.captchaData.img,
      fit: 'contain',
    }),
  );
  const __VLS_68 = __VLS_67(
    {
      src: __VLS_ctx.captchaData.img,
      fit: 'contain',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_67),
  );
  var __VLS_61;
}
const __VLS_70 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({}));
const __VLS_72 = __VLS_71({}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
const __VLS_74 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ // @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(
  __VLS_74,
  new __VLS_74({
    modelValue: __VLS_ctx.loginForm.rememberMe,
  }),
);
const __VLS_76 = __VLS_75(
  {
    modelValue: __VLS_ctx.loginForm.rememberMe,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_75),
);
__VLS_77.slots.default;
var __VLS_77;
var __VLS_73;
const __VLS_78 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({}));
const __VLS_80 = __VLS_79({}, ...__VLS_functionalComponentArgsRest(__VLS_79));
__VLS_81.slots.default;
const __VLS_82 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(
  __VLS_82,
  new __VLS_82({
    ...{ onClick: {} },
    type: 'primary',
    size: 'large',
    loading: __VLS_ctx.loading,
    ...{ class: 'login-button' },
  }),
);
const __VLS_84 = __VLS_83(
  {
    ...{ onClick: {} },
    type: 'primary',
    size: 'large',
    loading: __VLS_ctx.loading,
    ...{ class: 'login-button' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_83),
);
let __VLS_86;
let __VLS_87;
let __VLS_88;
const __VLS_89 = {
  onClick: __VLS_ctx.handleLogin,
};
__VLS_85.slots.default;
__VLS_ctx.loading ? '登录中...' : '登 录';
var __VLS_85;
var __VLS_81;
var __VLS_35;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'login-tip' },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
/** @type {__VLS_StyleScopedClasses['login-container']} */ /** @type {__VLS_StyleScopedClasses['login-left']} */ /** @type {__VLS_StyleScopedClasses['brand']} */ /** @type {__VLS_StyleScopedClasses['brand-title']} */ /** @type {__VLS_StyleScopedClasses['brand-subtitle']} */ /** @type {__VLS_StyleScopedClasses['brand-desc']} */ /** @type {__VLS_StyleScopedClasses['features']} */ /** @type {__VLS_StyleScopedClasses['feature-item']} */ /** @type {__VLS_StyleScopedClasses['feature-item']} */ /** @type {__VLS_StyleScopedClasses['feature-item']} */ /** @type {__VLS_StyleScopedClasses['feature-item']} */ /** @type {__VLS_StyleScopedClasses['login-right']} */ /** @type {__VLS_StyleScopedClasses['login-form-wrapper']} */ /** @type {__VLS_StyleScopedClasses['login-title']} */ /** @type {__VLS_StyleScopedClasses['login-subtitle']} */ /** @type {__VLS_StyleScopedClasses['login-form']} */ /** @type {__VLS_StyleScopedClasses['captcha']} */ /** @type {__VLS_StyleScopedClasses['login-button']} */ /** @type {__VLS_StyleScopedClasses['login-tip']} */ // @ts-ignore
var __VLS_41 = __VLS_40;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      User: User,
      Lock: Lock,
      CircleCheck: CircleCheck,
      Document: Document,
      Setting: Setting,
      Monitor: Monitor,
      Tools: Tools,
      loginFormRef: loginFormRef,
      loading: loading,
      captchaEnabled: captchaEnabled,
      captchaData: captchaData,
      loginForm: loginForm,
      loginRules: loginRules,
      getCaptcha: getCaptcha,
      handleLogin: handleLogin,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map

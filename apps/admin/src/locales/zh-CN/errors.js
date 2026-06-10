export default {
  // HTTP 错误
  http: {
    400: '请求参数错误',
    401: '登录已过期，请重新登录',
    403: '您没有权限执行此操作',
    404: '请求的资源不存在',
    405: '请求方法不被允许',
    408: '请求超时，请稍后重试',
    500: '服务器错误，请稍后重试',
    502: '网关错误，请稍后重试',
    503: '服务暂时不可用，请稍后重试',
    504: '网关超时，请稍后重试',
  },
  // 业务错误
  business: {
    paramError: '参数错误',
    validateError: '数据验证失败',
    unauthorized: '未授权，请登录',
    forbidden: '没有权限',
    notFound: '资源不存在',
    serverError: '服务器错误，请稍后重试',
  },
  // 认证错误
  auth: {
    tokenExpired: '登录已过期，请重新登录',
    tokenInvalid: 'Token 无效',
    tokenEmpty: 'Token 不能为空',
    loginFailed: '登录失败，用户名或密码错误',
    logoutSuccess: '退出登录成功',
  },
  // 验证错误
  validation: {
    required: '该字段为必填项',
    email: '请输入正确的邮箱地址',
    phone: '请输入正确的手机号码',
    url: '请输入正确的 URL 地址',
    number: '请输入数字',
    integer: '请输入整数',
    min: '值不能小于 {min}',
    max: '值不能大于 {max}',
    range: '值应在 {min} 到 {max} 之间',
    minLength: '长度不能少于 {min} 个字符',
    maxLength: '长度不能超过 {max} 个字符',
    pattern: '格式不正确',
    equalTo: '两次输入不一致',
    username: '用户名只能包含字母、数字和下划线',
    password: '密码长度不能少于6位',
    captcha: '验证码错误',
    idCard: '请输入正确的身份证号码',
  },
  // 页面错误
  page: {
    notFound: '抱歉，您访问的页面不存在',
    serverError: '抱歉，服务器发生错误',
    unauthorized: '抱歉，您没有访问权限',
    networkError: '网络连接失败，请检查网络设置',
    backHome: '返回首页',
    goBack: '返回上一页',
    refresh: '刷新页面',
  },
  // 文件错误
  file: {
    uploadFail: '文件上传失败',
    downloadFail: '文件下载失败',
    notFound: '文件不存在',
    tooLarge: '文件大小超过限制',
    typeError: '文件类型不允许',
    damaged: '文件已损坏',
  },
};
//# sourceMappingURL=errors.js.map

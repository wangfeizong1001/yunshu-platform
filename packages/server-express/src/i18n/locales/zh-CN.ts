export default {
  // 通用消息
  common: {
    success: '操作成功',
    fail: '操作失败',
    error: '系统错误',
    unauthorized: '未授权，请登录',
    forbidden: '没有权限',
    notFound: '资源不存在',
    serverError: '服务器错误，请稍后重试',
    paramError: '参数错误',
    validateError: '数据验证失败',
  },

  // 认证消息
  auth: {
    loginSuccess: '登录成功',
    loginFail: '登录失败，用户名或密码错误',
    logoutSuccess: '退出登录成功',
    tokenExpired: '登录已过期，请重新登录',
    tokenInvalid: 'Token 无效',
    tokenEmpty: 'Token 不能为空',
    tokenError: 'Token 解析错误',
    accountDisabled: '账号已被禁用',
    accountLocked: '账号已被锁定',
  },

  // 用户消息
  user: {
    notFound: '用户不存在',
    addSuccess: '用户创建成功',
    updateSuccess: '用户更新成功',
    deleteSuccess: '用户删除成功',
    resetPwdSuccess: '密码重置成功',
    usernameExists: '用户名已存在',
    emailExists: '邮箱已被使用',
    phoneExists: '手机号已被使用',
    oldPasswordError: '原密码错误',
    passwordChangeSuccess: '密码修改成功',
  },

  // 角色消息
  role: {
    notFound: '角色不存在',
    addSuccess: '角色创建成功',
    updateSuccess: '角色更新成功',
    deleteSuccess: '角色删除成功',
    nameExists: '角色名称已存在',
    keyExists: '角色标识已存在',
    hasUser: '该角色下存在用户，无法删除',
  },

  // 菜单消息
  menu: {
    notFound: '菜单不存在',
    addSuccess: '菜单创建成功',
    updateSuccess: '菜单更新成功',
    deleteSuccess: '菜单删除成功',
    nameExists: '菜单名称已存在',
    hasChild: '存在子菜单，无法删除',
    existMenu: '菜单已存在',
  },

  // 部门消息
  dept: {
    notFound: '部门不存在',
    addSuccess: '部门创建成功',
    updateSuccess: '部门更新成功',
    deleteSuccess: '部门删除成功',
    nameExists: '部门名称已存在',
    hasChild: '存在子部门，无法删除',
    hasUser: '部门下存在用户，无法删除',
  },

  // 岗位消息
  post: {
    notFound: '岗位不存在',
    addSuccess: '岗位创建成功',
    updateSuccess: '岗位更新成功',
    deleteSuccess: '岗位删除成功',
    nameExists: '岗位名称已存在',
    codeExists: '岗位编码已存在',
    hasUser: '该岗位下存在用户，无法删除',
  },

  // 验证码消息
  captcha: {
    expired: '验证码已过期',
    error: '验证码错误',
    empty: '请输入验证码',
    notFound: '验证码不存在',
  },

  // 文件消息
  file: {
    uploadSuccess: '文件上传成功',
    uploadFail: '文件上传失败',
    notFound: '文件不存在',
    tooLarge: '文件大小超过限制',
    typeError: '文件类型不允许',
    downloadFail: '文件下载失败',
  },

  // 定时任务消息
  job: {
    notFound: '任务不存在',
    addSuccess: '任务创建成功',
    updateSuccess: '任务更新成功',
    deleteSuccess: '任务删除成功',
    executeSuccess: '任务执行成功',
    pauseSuccess: '任务暂停成功',
    resumeSuccess: '任务恢复成功',
    nameExists: '任务名称已存在',
    groupExists: '任务分组已存在',
    cronInvalid: 'Cron 表达式无效',
  },
}

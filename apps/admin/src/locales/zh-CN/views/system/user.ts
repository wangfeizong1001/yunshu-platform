export default {
  menu: '用户管理',
  title: '用户管理',

  // 字段
  fields: {
    userId: '用户ID',
    username: '用户账号',
    nickname: '用户昵称',
    email: '用户邮箱',
    phone: '手机号码',
    sex: '用户性别',
    sexMap: {
      '0': '男',
      '1': '女',
      '2': '未知',
    },
    avatar: '用户头像',
    dept: '部门',
    posts: '岗位',
    roles: '角色',
    status: '用户状态',
    statusMap: {
      '0': '正常',
      '1': '停用',
    },
    loginIp: '最后登录IP',
    loginDate: '最后登录时间',
    createBy: '创建者',
    createTime: '创建时间',
    updateBy: '更新者',
    updateTime: '更新时间',
    remark: '备注',
  },

  // 按钮
  buttons: {
    add: '新增用户',
    edit: '编辑用户',
    delete: '删除用户',
    export: '导出用户',
    import: '导入用户',
    resetPwd: '重置密码',
    assignRole: '分配角色',
    viewDetail: '查看详情',
  },

  // 表单
  form: {
    addTitle: '新增用户',
    editTitle: '编辑用户',
    username: '请输入用户账号',
    nickname: '请输入用户昵称',
    email: '请输入用户邮箱',
    phone: '请输入手机号码',
    password: '请输入密码',
    confirmPassword: '请确认密码',
    passwordNotMatch: '两次输入密码不一致',
  },

  // 验证
  validation: {
    usernameRequired: '请输入用户账号',
    usernamePattern: '用户账号以字母开头，可包含数字和下划线',
    nicknameRequired: '请输入用户昵称',
    emailRequired: '请输入邮箱',
    emailPattern: '请输入正确的邮箱格式',
    phonePattern: '请输入正确的手机号',
    passwordRequired: '请输入密码',
    passwordMinLength: '密码长度不能小于6位',
  },

  // 消息
  messages: {
    addSuccess: '新增用户成功',
    editSuccess: '编辑用户成功',
    deleteSuccess: '删除用户成功',
    resetPwdSuccess: '密码重置成功，新密码为：123456',
    assignRoleSuccess: '分配角色成功',
    exportSuccess: '导出用户成功',
    importSuccess: '导入用户成功',
    importTemplate: '下载导入模板',
    importTip: '请选择要导入的 Excel 文件',
    deleteConfirm: '确定要删除该用户吗？此操作不可恢复',
    enableConfirm: '确定要启用该用户吗？',
    disableConfirm: '确定要禁用该用户吗？',
  },
}

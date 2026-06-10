export default {
  menu: '部门管理',
  title: '部门管理',

  // 字段
  fields: {
    deptId: '部门ID',
    parentId: '上级部门',
    parentName: '上级部门',
    deptName: '部门名称',
    leader: '负责人',
    phone: '联系电话',
    email: '邮箱',
    status: '状态',
    statusMap: {
      '0': '正常',
      '1': '停用',
    },
    sort: '排序',
    createBy: '创建者',
    createTime: '创建时间',
    updateBy: '更新者',
    updateTime: '更新时间',
    remark: '备注',
  },

  // 按钮
  buttons: {
    add: '新增部门',
    addChild: '新增子部门',
    edit: '编辑部门',
    delete: '删除部门',
    expandAll: '展开全部',
    collapseAll: '收起全部',
    import: '导入部门',
    export: '导出部门',
  },

  // 表单
  form: {
    addTitle: '新增部门',
    editTitle: '编辑部门',
    selectParent: '选择上级部门',
    deptName: '请输入部门名称',
    leader: '请输入负责人',
    phone: '请输入联系电话',
    email: '请输入邮箱',
    sort: '请输入排序',
  },

  // 验证
  validation: {
    deptNameRequired: '请输入部门名称',
    parentRequired: '请选择上级部门',
    sortRequired: '请输入排序',
    phonePattern: '请输入正确的手机号码',
    emailPattern: '请输入正确的邮箱地址',
  },

  // 消息
  messages: {
    addSuccess: '新增部门成功',
    editSuccess: '编辑部门成功',
    deleteSuccess: '删除部门成功',
    exportSuccess: '导出部门成功',
    deleteConfirm: '确定要删除该部门吗？此操作不可恢复',
    hasChild: '存在子部门，无法删除',
    hasUser: '部门下存在用户，无法删除',
    nameExists: '部门名称已存在',
  },
};

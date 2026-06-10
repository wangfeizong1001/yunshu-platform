export default {
  menu: '岗位管理',
  title: '岗位管理',
  // 字段
  fields: {
    postId: '岗位ID',
    postCode: '岗位编码',
    postName: '岗位名称',
    postSort: '显示顺序',
    status: '状态',
    statusMap: {
      0: '正常',
      1: '停用',
    },
    createBy: '创建者',
    createTime: '创建时间',
    updateBy: '更新者',
    updateTime: '更新时间',
    remark: '备注',
  },
  // 按钮
  buttons: {
    add: '新增岗位',
    edit: '编辑岗位',
    delete: '删除岗位',
    export: '导出岗位',
  },
  // 表单
  form: {
    addTitle: '新增岗位',
    editTitle: '编辑岗位',
    postCode: '请输入岗位编码',
    postName: '请输入岗位名称',
    postSort: '请输入显示顺序',
  },
  // 验证
  validation: {
    postCodeRequired: '请输入岗位编码',
    postCodePattern: '岗位编码只能包含字母和数字',
    postNameRequired: '请输入岗位名称',
    postSortRequired: '请输入显示顺序',
    postSortPattern: '排序必须为数字',
  },
  // 消息
  messages: {
    addSuccess: '新增岗位成功',
    editSuccess: '编辑岗位成功',
    deleteSuccess: '删除岗位成功',
    exportSuccess: '导出岗位成功',
    deleteConfirm: '确定要删除该岗位吗？此操作不可恢复',
    hasUser: '该岗位下存在用户，无法删除',
    codeExists: '岗位编码已存在',
    nameExists: '岗位名称已存在',
  },
};
//# sourceMappingURL=post.js.map

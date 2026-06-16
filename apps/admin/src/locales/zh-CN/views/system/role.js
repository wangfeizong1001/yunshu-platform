export default {
    menu: '角色管理',
    title: '角色管理',
    // 字段
    fields: {
        roleId: '角色ID',
        roleName: '角色名称',
        roleKey: '角色标识',
        roleSort: '显示顺序',
        status: '状态',
        statusMap: {
            '0': '正常',
            '1': '停用',
        },
        dataScope: '数据范围',
        dataScopeMap: {
            '1': '全部数据权限',
            '2': '自定数据权限',
            '3': '本部门数据权限',
            '4': '本部门及以下数据权限',
            '5': '仅本人数据权限',
        },
        createBy: '创建者',
        createTime: '创建时间',
        updateBy: '更新者',
        updateTime: '更新时间',
        remark: '备注',
        menuIds: '菜单权限',
    },
    // 按钮
    buttons: {
        add: '新增角色',
        edit: '编辑角色',
        delete: '删除角色',
        export: '导出角色',
        assignPermission: '分配权限',
        viewPermission: '查看权限',
    },
    // 表单
    form: {
        addTitle: '新增角色',
        editTitle: '编辑角色',
        roleName: '请输入角色名称',
        roleKey: '请输入角色标识',
        roleKeyPlaceholder: '角色标识（如：admin）',
        roleSort: '请输入显示顺序',
        dataScope: '请选择数据范围',
    },
    // 验证
    validation: {
        roleNameRequired: '请输入角色名称',
        roleKeyRequired: '请输入角色标识',
        roleKeyPattern: '角色标识只能包含字母和下划线',
        roleSortRequired: '请输入显示顺序',
    },
    // 消息
    messages: {
        addSuccess: '新增角色成功',
        editSuccess: '编辑角色成功',
        deleteSuccess: '删除角色成功',
        exportSuccess: '导出角色成功',
        assignPermissionSuccess: '分配权限成功',
        deleteConfirm: '确定要删除该角色吗？此操作不可恢复',
        hasUser: '该角色下存在用户，无法删除',
        nameExists: '角色名称已存在',
        keyExists: '角色标识已存在',
    },
};
//# sourceMappingURL=role.js.map
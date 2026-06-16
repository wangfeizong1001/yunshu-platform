export default {
    menu: '菜单管理',
    title: '菜单管理',
    // 字段
    fields: {
        menuId: '菜单ID',
        menuName: '菜单名称',
        parentId: '上级菜单',
        parentName: '上级菜单',
        orderNum: '显示顺序',
        path: '路由地址',
        component: '组件路径',
        componentName: '组件名称',
        menuType: '菜单类型',
        menuTypeMap: {
            'M': '目录',
            'C': '菜单',
            'F': '按钮',
        },
        visible: '显示状态',
        visibleMap: {
            '0': '显示',
            '1': '隐藏',
        },
        status: '状态',
        statusMap: {
            '0': '正常',
            '1': '停用',
        },
        perms: '权限标识',
        icon: '菜单图标',
        createBy: '创建者',
        createTime: '创建时间',
        updateBy: '更新者',
        updateTime: '更新时间',
        remark: '备注',
    },
    // 按钮
    buttons: {
        add: '新增菜单',
        addChild: '新增子菜单',
        edit: '编辑菜单',
        delete: '删除菜单',
        expandAll: '展开全部',
        collapseAll: '收起全部',
    },
    // 表单
    form: {
        addTitle: '新增菜单',
        editTitle: '编辑菜单',
        selectParent: '选择上级菜单',
        menuName: '请输入菜单名称',
        path: '请输入路由地址',
        component: '请输入组件路径',
        orderNum: '请输入显示顺序',
        iconSelect: '选择图标',
    },
    // 验证
    validation: {
        menuNameRequired: '请输入菜单名称',
        menuTypeRequired: '请选择菜单类型',
        pathRequired: '请输入路由地址',
        orderNumRequired: '请输入显示顺序',
    },
    // 消息
    messages: {
        addSuccess: '新增菜单成功',
        editSuccess: '编辑菜单成功',
        deleteSuccess: '删除菜单成功',
        deleteConfirm: '确定要删除该菜单吗？此操作不可恢复',
        hasChild: '存在子菜单，无法删除',
        existMenu: '菜单已存在',
        nameExists: '菜单名称已存在',
    },
};
//# sourceMappingURL=menu.js.map
export default {
    menu: 'Role Management',
    title: 'Role Management',
    // Fields
    fields: {
        roleId: 'Role ID',
        roleName: 'Role Name',
        roleKey: 'Role Key',
        roleSort: 'Display Order',
        status: 'Status',
        statusMap: {
            '0': 'Normal',
            '1': 'Disabled',
        },
        dataScope: 'Data Scope',
        dataScopeMap: {
            '1': 'All Data',
            '2': 'Custom Data',
            '3': 'Department Data',
            '4': 'Department and Sub-department Data',
            '5': 'Personal Data Only',
        },
        createBy: 'Creator',
        createTime: 'Create Time',
        updateBy: 'Updater',
        updateTime: 'Update Time',
        remark: 'Remark',
        menuIds: 'Menu Permissions',
    },
    // Buttons
    buttons: {
        add: 'Add Role',
        edit: 'Edit Role',
        delete: 'Delete Role',
        export: 'Export Role',
        assignPermission: 'Assign Permission',
        viewPermission: 'View Permission',
    },
    // Form
    form: {
        addTitle: 'Add Role',
        editTitle: 'Edit Role',
        roleName: 'Please enter role name',
        roleKey: 'Please enter role key',
        roleKeyPlaceholder: 'Role key (e.g., admin)',
        roleSort: 'Please enter display order',
        dataScope: 'Please select data scope',
    },
    // Validation
    validation: {
        roleNameRequired: 'Please enter role name',
        roleKeyRequired: 'Please enter role key',
        roleKeyPattern: 'Role key can only contain letters and underscores',
        roleSortRequired: 'Please enter display order',
    },
    // Messages
    messages: {
        addSuccess: 'Role added successfully',
        editSuccess: 'Role updated successfully',
        deleteSuccess: 'Role deleted successfully',
        exportSuccess: 'Role exported successfully',
        assignPermissionSuccess: 'Permission assigned successfully',
        deleteConfirm: 'Are you sure you want to delete this role? This action cannot be undone',
        hasUser: 'This role has assigned users, cannot delete',
        nameExists: 'Role name already exists',
        keyExists: 'Role key already exists',
    },
};
//# sourceMappingURL=role.js.map
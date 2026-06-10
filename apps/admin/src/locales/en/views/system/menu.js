export default {
  menu: 'Menu Management',
  title: 'Menu Management',
  // Fields
  fields: {
    menuId: 'Menu ID',
    menuName: 'Menu Name',
    parentId: 'Parent Menu',
    parentName: 'Parent Menu',
    orderNum: 'Display Order',
    path: 'Route Path',
    component: 'Component Path',
    componentName: 'Component Name',
    menuType: 'Menu Type',
    menuTypeMap: {
      M: 'Directory',
      C: 'Menu',
      F: 'Button',
    },
    visible: 'Visible',
    visibleMap: {
      0: 'Show',
      1: 'Hide',
    },
    status: 'Status',
    statusMap: {
      0: 'Normal',
      1: 'Disabled',
    },
    perms: 'Permission',
    icon: 'Menu Icon',
    createBy: 'Creator',
    createTime: 'Create Time',
    updateBy: 'Updater',
    updateTime: 'Update Time',
    remark: 'Remark',
  },
  // Buttons
  buttons: {
    add: 'Add Menu',
    addChild: 'Add Submenu',
    edit: 'Edit Menu',
    delete: 'Delete Menu',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
  },
  // Form
  form: {
    addTitle: 'Add Menu',
    editTitle: 'Edit Menu',
    selectParent: 'Select Parent Menu',
    menuName: 'Please enter menu name',
    path: 'Please enter route path',
    component: 'Please enter component path',
    orderNum: 'Please enter display order',
    iconSelect: 'Select Icon',
  },
  // Validation
  validation: {
    menuNameRequired: 'Please enter menu name',
    menuTypeRequired: 'Please select menu type',
    pathRequired: 'Please enter route path',
    orderNumRequired: 'Please enter display order',
  },
  // Messages
  messages: {
    addSuccess: 'Menu added successfully',
    editSuccess: 'Menu updated successfully',
    deleteSuccess: 'Menu deleted successfully',
    deleteConfirm: 'Are you sure you want to delete this menu? This action cannot be undone',
    hasChild: 'Cannot delete, this menu has child menus',
    existMenu: 'Menu already exists',
    nameExists: 'Menu name already exists',
  },
};
//# sourceMappingURL=menu.js.map

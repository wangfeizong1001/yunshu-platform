export default {
  menu: 'Department Management',
  title: 'Department Management',

  // Fields
  fields: {
    deptId: 'Department ID',
    parentId: 'Parent Department',
    parentName: 'Parent Department',
    deptName: 'Department Name',
    leader: 'Leader',
    phone: 'Phone',
    email: 'Email',
    status: 'Status',
    statusMap: {
      '0': 'Normal',
      '1': 'Disabled',
    },
    sort: 'Order',
    createBy: 'Creator',
    createTime: 'Create Time',
    updateBy: 'Updater',
    updateTime: 'Update Time',
    remark: 'Remark',
  },

  // Buttons
  buttons: {
    add: 'Add Department',
    addChild: 'Add Subdepartment',
    edit: 'Edit Department',
    delete: 'Delete Department',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
    import: 'Import Department',
    export: 'Export Department',
  },

  // Form
  form: {
    addTitle: 'Add Department',
    editTitle: 'Edit Department',
    selectParent: 'Select Parent Department',
    deptName: 'Please enter department name',
    leader: 'Please enter leader name',
    phone: 'Please enter phone number',
    email: 'Please enter email',
    sort: 'Please enter order',
  },

  // Validation
  validation: {
    deptNameRequired: 'Please enter department name',
    parentRequired: 'Please select parent department',
    sortRequired: 'Please enter order',
    phonePattern: 'Please enter a valid phone number',
    emailPattern: 'Please enter a valid email address',
  },

  // Messages
  messages: {
    addSuccess: 'Department added successfully',
    editSuccess: 'Department updated successfully',
    deleteSuccess: 'Department deleted successfully',
    exportSuccess: 'Department exported successfully',
    deleteConfirm: 'Are you sure you want to delete this department? This action cannot be undone',
    hasChild: 'Cannot delete, this department has subdepartments',
    hasUser: 'Cannot delete, this department has users',
    nameExists: 'Department name already exists',
  },
}

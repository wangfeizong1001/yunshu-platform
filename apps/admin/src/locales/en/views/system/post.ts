export default {
  menu: 'Post Management',
  title: 'Post Management',

  // Fields
  fields: {
    postId: 'Post ID',
    postCode: 'Post Code',
    postName: 'Post Name',
    postSort: 'Display Order',
    status: 'Status',
    statusMap: {
      '0': 'Normal',
      '1': 'Disabled',
    },
    createBy: 'Creator',
    createTime: 'Create Time',
    updateBy: 'Updater',
    updateTime: 'Update Time',
    remark: 'Remark',
  },

  // Buttons
  buttons: {
    add: 'Add Post',
    edit: 'Edit Post',
    delete: 'Delete Post',
    export: 'Export Post',
  },

  // Form
  form: {
    addTitle: 'Add Post',
    editTitle: 'Edit Post',
    postCode: 'Please enter post code',
    postName: 'Please enter post name',
    postSort: 'Please enter display order',
  },

  // Validation
  validation: {
    postCodeRequired: 'Please enter post code',
    postCodePattern: 'Post code can only contain letters and numbers',
    postNameRequired: 'Please enter post name',
    postSortRequired: 'Please enter display order',
    postSortPattern: 'Order must be a number',
  },

  // Messages
  messages: {
    addSuccess: 'Post added successfully',
    editSuccess: 'Post updated successfully',
    deleteSuccess: 'Post deleted successfully',
    exportSuccess: 'Post exported successfully',
    deleteConfirm: 'Are you sure you want to delete this post? This action cannot be undone',
    hasUser: 'Cannot delete, this post has assigned users',
    codeExists: 'Post code already exists',
    nameExists: 'Post name already exists',
  },
}

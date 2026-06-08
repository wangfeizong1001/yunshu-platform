export default {
  menu: 'User Management',
  title: 'User Management',

  // Fields
  fields: {
    userId: 'User ID',
    username: 'Username',
    nickname: 'Nickname',
    email: 'Email',
    phone: 'Phone Number',
    sex: 'Gender',
    sexMap: {
      '0': 'Male',
      '1': 'Female',
      '2': 'Unknown',
    },
    avatar: 'Avatar',
    dept: 'Department',
    posts: 'Posts',
    roles: 'Roles',
    status: 'Status',
    statusMap: {
      '0': 'Normal',
      '1': 'Disabled',
    },
    loginIp: 'Last Login IP',
    loginDate: 'Last Login Time',
    createBy: 'Creator',
    createTime: 'Create Time',
    updateBy: 'Updater',
    updateTime: 'Update Time',
    remark: 'Remark',
  },

  // Buttons
  buttons: {
    add: 'Add User',
    edit: 'Edit User',
    delete: 'Delete User',
    export: 'Export User',
    import: 'Import User',
    resetPwd: 'Reset Password',
    assignRole: 'Assign Role',
    viewDetail: 'View Detail',
  },

  // Form
  form: {
    addTitle: 'Add User',
    editTitle: 'Edit User',
    username: 'Please enter username',
    nickname: 'Please enter nickname',
    email: 'Please enter email',
    phone: 'Please enter phone number',
    password: 'Please enter password',
    confirmPassword: 'Please confirm password',
    passwordNotMatch: 'Passwords do not match',
  },

  // Validation
  validation: {
    usernameRequired: 'Please enter username',
    usernamePattern: 'Username should start with a letter, can contain numbers and underscores',
    nicknameRequired: 'Please enter nickname',
    emailRequired: 'Please enter email',
    emailPattern: 'Please enter a valid email format',
    phonePattern: 'Please enter a valid phone number',
    passwordRequired: 'Please enter password',
    passwordMinLength: 'Password length cannot be less than 6 characters',
  },

  // Messages
  messages: {
    addSuccess: 'User added successfully',
    editSuccess: 'User updated successfully',
    deleteSuccess: 'User deleted successfully',
    resetPwdSuccess: 'Password reset successfully, new password is: 123456',
    assignRoleSuccess: 'Role assigned successfully',
    exportSuccess: 'User exported successfully',
    importSuccess: 'User imported successfully',
    importTemplate: 'Download Import Template',
    importTip: 'Please select an Excel file to import',
    deleteConfirm: 'Are you sure you want to delete this user? This action cannot be undone',
    enableConfirm: 'Are you sure you want to enable this user?',
    disableConfirm: 'Are you sure you want to disable this user?',
  },
}

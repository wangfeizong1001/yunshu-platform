export default {
  // Common Messages
  common: {
    success: 'Operation successful',
    fail: 'Operation failed',
    error: 'System error',
    unauthorized: 'Unauthorized, please login',
    forbidden: 'No permission',
    notFound: 'Resource not found',
    serverError: 'Server error, please try again later',
    paramError: 'Parameter error',
    validateError: 'Data validation failed',
  },

  // Auth Messages
  auth: {
    loginSuccess: 'Login successful',
    loginFail: 'Login failed, username or password is incorrect',
    logoutSuccess: 'Logout successful',
    tokenExpired: 'Session expired, please login again',
    tokenInvalid: 'Token is invalid',
    tokenEmpty: 'Token cannot be empty',
    tokenError: 'Token parsing error',
    accountDisabled: 'Account has been disabled',
    accountLocked: 'Account has been locked',
  },

  // User Messages
  user: {
    notFound: 'User not found',
    addSuccess: 'User created successfully',
    updateSuccess: 'User updated successfully',
    deleteSuccess: 'User deleted successfully',
    resetPwdSuccess: 'Password reset successfully',
    usernameExists: 'Username already exists',
    emailExists: 'Email already in use',
    phoneExists: 'Phone number already in use',
    oldPasswordError: 'Original password is incorrect',
    passwordChangeSuccess: 'Password changed successfully',
  },

  // Role Messages
  role: {
    notFound: 'Role not found',
    addSuccess: 'Role created successfully',
    updateSuccess: 'Role updated successfully',
    deleteSuccess: 'Role deleted successfully',
    nameExists: 'Role name already exists',
    keyExists: 'Role key already exists',
    hasUser: 'Cannot delete, this role has assigned users',
  },

  // Menu Messages
  menu: {
    notFound: 'Menu not found',
    addSuccess: 'Menu created successfully',
    updateSuccess: 'Menu updated successfully',
    deleteSuccess: 'Menu deleted successfully',
    nameExists: 'Menu name already exists',
    hasChild: 'Cannot delete, this menu has child menus',
    existMenu: 'Menu already exists',
  },

  // Department Messages
  dept: {
    notFound: 'Department not found',
    addSuccess: 'Department created successfully',
    updateSuccess: 'Department updated successfully',
    deleteSuccess: 'Department deleted successfully',
    nameExists: 'Department name already exists',
    hasChild: 'Cannot delete, this department has subdepartments',
    hasUser: 'Cannot delete, this department has users',
  },

  // Post Messages
  post: {
    notFound: 'Post not found',
    addSuccess: 'Post created successfully',
    updateSuccess: 'Post updated successfully',
    deleteSuccess: 'Post deleted successfully',
    nameExists: 'Post name already exists',
    codeExists: 'Post code already exists',
    hasUser: 'Cannot delete, this post has assigned users',
  },

  // Captcha Messages
  captcha: {
    expired: 'Captcha has expired',
    error: 'Captcha is incorrect',
    empty: 'Please enter captcha',
    notFound: 'Captcha not found',
  },

  // File Messages
  file: {
    uploadSuccess: 'File uploaded successfully',
    uploadFail: 'File upload failed',
    notFound: 'File not found',
    tooLarge: 'File size exceeds limit',
    typeError: 'File type not allowed',
    downloadFail: 'File download failed',
  },

  // Job Messages
  job: {
    notFound: 'Task not found',
    addSuccess: 'Task created successfully',
    updateSuccess: 'Task updated successfully',
    deleteSuccess: 'Task deleted successfully',
    executeSuccess: 'Task executed successfully',
    pauseSuccess: 'Task paused successfully',
    resumeSuccess: 'Task resumed successfully',
    nameExists: 'Task name already exists',
    groupExists: 'Task group already exists',
    cronInvalid: 'Cron expression is invalid',
  },
};

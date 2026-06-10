export default {
  // Online Users
  online: {
    menu: 'Online Users',
    title: 'Online User Management',

    fields: {
      tokenId: 'Session ID',
      username: 'Username',
      ipaddr: 'IP Address',
      loginLocation: 'Login Location',
      browser: 'Browser',
      os: 'Operating System',
      loginTime: 'Login Time',
      deptName: 'Department',
    },

    buttons: {
      forceLogout: 'Force Logout',
      batchForceLogout: 'Batch Force Logout',
      export: 'Export',
    },

    messages: {
      forceLogoutSuccess: 'User forced to logout successfully',
      forceLogoutConfirm: 'Are you sure you want to force this user to logout?',
      batchForceLogoutConfirm: 'Are you sure you want to force selected users to logout?',
    },
  },

  // Login Log
  loginLog: {
    menu: 'Login Log',
    title: 'Login Log Management',

    fields: {
      infoId: 'Info ID',
      username: 'Username',
      ipaddr: 'IP Address',
      loginLocation: 'Login Location',
      browser: 'Browser',
      os: 'Operating System',
      status: 'Status',
      statusMap: {
        '0': 'Success',
        '1': 'Fail',
      },
      msg: 'Message',
      loginTime: 'Login Time',
    },

    buttons: {
      delete: 'Delete Log',
      clean: 'Clear Log',
      export: 'Export',
    },

    messages: {
      deleteSuccess: 'Log deleted successfully',
      cleanSuccess: 'Log cleared successfully',
      deleteConfirm: 'Are you sure you want to delete selected logs?',
      cleanConfirm: 'Are you sure you want to clear all login logs? This action cannot be undone',
    },
  },

  // Operation Log
  operLog: {
    menu: 'Operation Log',
    title: 'Operation Log Management',

    fields: {
      operId: 'Log ID',
      title: 'Module',
      businessType: 'Business Type',
      businessTypeMap: {
        '0': 'Other',
        '1': 'Create',
        '2': 'Update',
        '3': 'Delete',
        '4': 'Authorize',
        '5': 'Export',
        '6': 'Import',
        '7': 'Force Logout',
        '8': 'Generate Code',
        '9': 'Clear Data',
      },
      method: 'Request Method',
      requestMethod: 'Request Method',
      operatorType: 'Operator Type',
      operatorTypeMap: {
        '0': 'Other',
        '1': 'Backend User',
        '2': 'Mobile User',
      },
      operName: 'Operator',
      deptName: 'Department',
      operUrl: 'Request URL',
      operIp: 'IP Address',
      operLocation: 'Location',
      operParam: 'Request Params',
      jsonResult: 'Response Params',
      status: 'Status',
      statusMap: {
        '0': 'Normal',
        '1': 'Error',
      },
      errorMsg: 'Error Message',
      operTime: 'Operation Time',
      costTime: 'Cost Time',
      costTimeUnit: 'ms',
    },

    buttons: {
      detail: 'Detail',
      delete: 'Delete',
      clean: 'Clear',
      export: 'Export',
    },

    messages: {
      deleteSuccess: 'Log deleted successfully',
      cleanSuccess: 'Log cleared successfully',
      deleteConfirm: 'Are you sure you want to delete selected logs?',
      cleanConfirm:
        'Are you sure you want to clear all operation logs? This action cannot be undone',
    },
  },

  // Scheduled Job
  job: {
    menu: 'Scheduled Task',
    title: 'Scheduled Task Management',

    fields: {
      jobId: 'Task ID',
      jobName: 'Task Name',
      jobGroup: 'Task Group',
      jobGroupMap: {
        default: 'Default',
        system: 'System',
      },
      invokeTarget: 'Invoke Target',
      cronExpression: 'Cron Expression',
      misfirePolicy: 'Misfire Policy',
      misfirePolicyMap: {
        '1': 'Execute Now',
        '2': 'Execute Once',
        '3': 'Give Up',
      },
      concurrent: 'Concurrent',
      concurrentMap: {
        '0': 'Allow Concurrent',
        '1': 'Forbid Concurrent',
      },
      status: 'Status',
      statusMap: {
        '0': 'Normal',
        '1': 'Paused',
      },
      createBy: 'Creator',
      createTime: 'Create Time',
      updateBy: 'Updater',
      updateTime: 'Update Time',
      remark: 'Remark',
    },

    buttons: {
      add: 'Add Task',
      edit: 'Edit Task',
      delete: 'Delete Task',
      execute: 'Execute Once',
      pause: 'Pause',
      resume: 'Resume',
      export: 'Export',
      log: 'Execution Log',
    },

    messages: {
      addSuccess: 'Task added successfully',
      editSuccess: 'Task updated successfully',
      deleteSuccess: 'Task deleted successfully',
      executeSuccess: 'Task executed successfully',
      pauseSuccess: 'Task paused successfully',
      resumeSuccess: 'Task resumed successfully',
      deleteConfirm: 'Are you sure you want to delete this task? This action cannot be undone',
      executeConfirm: 'Are you sure you want to execute this task now?',
    },
  },

  // Server Monitor
  server: {
    menu: 'Server Monitor',
    title: 'Server Monitor',

    fields: {
      cpu: 'CPU Usage',
      memory: 'Memory Usage',
      disk: 'Disk Usage',
      network: 'Network Bandwidth',
      os: 'Operating System',
      serverName: 'Server Name',
      serverIp: 'Server IP',
      uptime: 'Uptime',
      config: 'Configuration',
    },

    buttons: {
      refresh: 'Refresh',
      chart: 'Chart',
    },
  },
};

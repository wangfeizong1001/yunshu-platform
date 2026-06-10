export default {
  // 在线用户
  online: {
    menu: '在线用户',
    title: '在线用户管理',

    fields: {
      tokenId: '会话编号',
      username: '用户账号',
      ipaddr: '登录IP地址',
      loginLocation: '登录地点',
      browser: '浏览器',
      os: '操作系统',
      loginTime: '登录时间',
      deptName: '所属部门',
    },

    buttons: {
      forceLogout: '强制下线',
      batchForceLogout: '批量下线',
      export: '导出',
    },

    messages: {
      forceLogoutSuccess: '强制下线成功',
      forceLogoutConfirm: '确定要强制该用户下线吗？',
      batchForceLogoutConfirm: '确定要强制选中的用户下线吗？',
    },
  },

  // 登录日志
  loginLog: {
    menu: '登录日志',
    title: '登录日志管理',

    fields: {
      infoId: '访问编号',
      username: '用户账号',
      ipaddr: '登录IP地址',
      loginLocation: '登录地点',
      browser: '浏览器',
      os: '操作系统',
      status: '登录状态',
      statusMap: {
        '0': '成功',
        '1': '失败',
      },
      msg: '操作信息',
      loginTime: '登录时间',
    },

    buttons: {
      delete: '删除日志',
      clean: '清空日志',
      export: '导出',
    },

    messages: {
      deleteSuccess: '删除日志成功',
      cleanSuccess: '清空日志成功',
      deleteConfirm: '确定要删除选中的日志吗？',
      cleanConfirm: '确定要清空所有登录日志吗？此操作不可恢复',
    },
  },

  // 操作日志
  operLog: {
    menu: '操作日志',
    title: '操作日志管理',

    fields: {
      operId: '日志编号',
      title: '系统模块',
      businessType: '业务类型',
      businessTypeMap: {
        '0': '其他',
        '1': '新增',
        '2': '修改',
        '3': '删除',
        '4': '授权',
        '5': '导出',
        '6': '导入',
        '7': '强退',
        '8': '生成代码',
        '9': '清空数据',
      },
      method: '请求方法',
      requestMethod: '请求方式',
      operatorType: '操作类别',
      operatorTypeMap: {
        '0': '其他',
        '1': '后台用户',
        '2': '手机端用户',
      },
      operName: '操作人员',
      deptName: '部门名称',
      operUrl: '请求地址',
      operIp: '操作地址',
      operLocation: '操作地点',
      operParam: '请求参数',
      jsonResult: '返回参数',
      status: '操作状态',
      statusMap: {
        '0': '正常',
        '1': '异常',
      },
      errorMsg: '错误消息',
      operTime: '操作时间',
      costTime: '消耗时间',
      costTimeUnit: '毫秒',
    },

    buttons: {
      detail: '详情',
      delete: '删除',
      clean: '清空',
      export: '导出',
    },

    messages: {
      deleteSuccess: '删除日志成功',
      cleanSuccess: '清空日志成功',
      deleteConfirm: '确定要删除选中的日志吗？',
      cleanConfirm: '确定要清空所有操作日志吗？此操作不可恢复',
    },
  },

  // 定时任务
  job: {
    menu: '定时任务',
    title: '定时任务管理',

    fields: {
      jobId: '任务ID',
      jobName: '任务名称',
      jobGroup: '任务分组',
      jobGroupMap: {
        default: '默认',
        system: '系统',
      },
      invokeTarget: '调用目标',
      cronExpression: 'cron表达式',
      misfirePolicy: '执行策略',
      misfirePolicyMap: {
        '1': '立即执行',
        '2': '执行一次',
        '3': '放弃执行',
      },
      concurrent: '是否并发',
      concurrentMap: {
        '0': '允许并发',
        '1': '禁止并发',
      },
      status: '状态',
      statusMap: {
        '0': '正常',
        '1': '暂停',
      },
      createBy: '创建者',
      createTime: '创建时间',
      updateBy: '更新者',
      updateTime: '更新时间',
      remark: '备注',
    },

    buttons: {
      add: '新增任务',
      edit: '编辑任务',
      delete: '删除任务',
      execute: '执行一次',
      pause: '暂停',
      resume: '恢复',
      export: '导出',
      log: '执行日志',
    },

    messages: {
      addSuccess: '新增任务成功',
      editSuccess: '编辑任务成功',
      deleteSuccess: '删除任务成功',
      executeSuccess: '任务执行成功',
      pauseSuccess: '任务暂停成功',
      resumeSuccess: '任务恢复成功',
      deleteConfirm: '确定要删除该任务吗？此操作不可恢复',
      executeConfirm: '确定要立即执行该任务吗？',
    },
  },

  // 服务器监控
  server: {
    menu: '服务器监控',
    title: '服务器监控',

    fields: {
      cpu: 'CPU使用率',
      memory: '内存使用率',
      disk: '磁盘使用率',
      network: '网络带宽',
      os: '操作系统',
      serverName: '服务器名称',
      serverIp: '服务器IP',
      uptime: '运行时间',
      config: '详细配置',
    },

    buttons: {
      refresh: '刷新',
      chart: '图表',
    },
  },
};

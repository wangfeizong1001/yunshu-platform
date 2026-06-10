declare const en: {
  online: {
    menu: string;
    title: string;
    fields: {
      tokenId: string;
      username: string;
      ipaddr: string;
      loginLocation: string;
      browser: string;
      os: string;
      loginTime: string;
      deptName: string;
    };
    buttons: {
      forceLogout: string;
      batchForceLogout: string;
      export: string;
    };
    messages: {
      forceLogoutSuccess: string;
      forceLogoutConfirm: string;
      batchForceLogoutConfirm: string;
    };
  };
  loginLog: {
    menu: string;
    title: string;
    fields: {
      infoId: string;
      username: string;
      ipaddr: string;
      loginLocation: string;
      browser: string;
      os: string;
      status: string;
      statusMap: {
        '0': string;
        '1': string;
      };
      msg: string;
      loginTime: string;
    };
    buttons: {
      delete: string;
      clean: string;
      export: string;
    };
    messages: {
      deleteSuccess: string;
      cleanSuccess: string;
      deleteConfirm: string;
      cleanConfirm: string;
    };
  };
  operLog: {
    menu: string;
    title: string;
    fields: {
      operId: string;
      title: string;
      businessType: string;
      businessTypeMap: {
        '0': string;
        '1': string;
        '2': string;
        '3': string;
        '4': string;
        '5': string;
        '6': string;
        '7': string;
        '8': string;
        '9': string;
      };
      method: string;
      requestMethod: string;
      operatorType: string;
      operatorTypeMap: {
        '0': string;
        '1': string;
        '2': string;
      };
      operName: string;
      deptName: string;
      operUrl: string;
      operIp: string;
      operLocation: string;
      operParam: string;
      jsonResult: string;
      status: string;
      statusMap: {
        '0': string;
        '1': string;
      };
      errorMsg: string;
      operTime: string;
      costTime: string;
      costTimeUnit: string;
    };
    buttons: {
      detail: string;
      delete: string;
      clean: string;
      export: string;
    };
    messages: {
      deleteSuccess: string;
      cleanSuccess: string;
      deleteConfirm: string;
      cleanConfirm: string;
    };
  };
  job: {
    menu: string;
    title: string;
    fields: {
      jobId: string;
      jobName: string;
      jobGroup: string;
      jobGroupMap: {
        default: string;
        system: string;
      };
      invokeTarget: string;
      cronExpression: string;
      misfirePolicy: string;
      misfirePolicyMap: {
        '1': string;
        '2': string;
        '3': string;
      };
      concurrent: string;
      concurrentMap: {
        '0': string;
        '1': string;
      };
      status: string;
      statusMap: {
        '0': string;
        '1': string;
      };
      createBy: string;
      createTime: string;
      updateBy: string;
      updateTime: string;
      remark: string;
    };
    buttons: {
      add: string;
      edit: string;
      delete: string;
      execute: string;
      pause: string;
      resume: string;
      export: string;
      log: string;
    };
    messages: {
      addSuccess: string;
      editSuccess: string;
      deleteSuccess: string;
      executeSuccess: string;
      pauseSuccess: string;
      resumeSuccess: string;
      deleteConfirm: string;
      executeConfirm: string;
    };
  };
  server: {
    menu: string;
    title: string;
    fields: {
      cpu: string;
      memory: string;
      disk: string;
      network: string;
      os: string;
      serverName: string;
      serverIp: string;
      uptime: string;
      config: string;
    };
    buttons: {
      refresh: string;
      chart: string;
    };
  };
  menu: string;
  title: string;
  fields: {
    postId: string;
    postCode: string;
    postName: string;
    postSort: string;
    status: string;
    statusMap: {
      '0': string;
      '1': string;
    };
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
    remark: string;
  };
  buttons: {
    add: string;
    edit: string;
    delete: string;
    export: string;
  };
  form: {
    addTitle: string;
    editTitle: string;
    postCode: string;
    postName: string;
    postSort: string;
  };
  validation: {
    postCodeRequired: string;
    postCodePattern: string;
    postNameRequired: string;
    postSortRequired: string;
    postSortPattern: string;
  };
  messages: {
    addSuccess: string;
    editSuccess: string;
    deleteSuccess: string;
    exportSuccess: string;
    deleteConfirm: string;
    hasUser: string;
    codeExists: string;
    nameExists: string;
  };
  stats: {
    userCount: string;
    orderCount: string;
    revenue: string;
    growth: string;
    visits: string;
    orders: string;
    sales: string;
    returnRate: string;
  };
  chart: {
    salesTrend: string;
    salesOverview: string;
    hotProducts: string;
    orderStatus: string;
    userGrowth: string;
    categorySales: string;
  };
  shortcuts: {
    title: string;
    userManage: string;
    roleManage: string;
    menuManage: string;
    deptManage: string;
  };
  todo: {
    title: string;
    pendingOrders: string;
    pendingReviews: string;
    systemAlerts: string;
  };
  welcome: {
    morning: string;
    afternoon: string;
    evening: string;
    welcomeBack: string;
  };
  username: string;
  password: string;
  captcha: string;
  remember: string;
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  captchaPlaceholder: string;
  loginBtn: string;
  logoutBtn: string;
  msg: {
    loginSuccess: string;
    loginFail: string;
    logoutSuccess: string;
    captchaRequired: string;
    captchaExpired: string;
    captchaError: string;
  };
  links: {
    forgotPassword: string;
    register: string;
  };
  pagination: {
    total: string;
    page: string;
    pageSize: string;
    goto: string;
    gotoPage: string;
    prev: string;
    next: string;
    first: string;
    last: string;
    perPage: string;
    currentPage: string;
  };
  dialog: {
    confirm: string;
    cancel: string;
    close: string;
    yes: string;
    no: string;
    ok: string;
    tips: string;
    warning: string;
    danger: string;
  };
  table: {
    selectAll: string;
    selectInvert: string;
    selectNone: string;
    clearSelection: string;
    confirmSelection: string;
    expandRow: string;
    collapseRow: string;
    sortAsc: string;
    sortDesc: string;
    sortCancel: string;
    filter: string;
    filterReset: string;
    showFilter: string;
    hideFilter: string;
  };
  http: {
    400: string;
    401: string;
    403: string;
    404: string;
    405: string;
    408: string;
    500: string;
    502: string;
    503: string;
    504: string;
  };
  business: {
    paramError: string;
    validateError: string;
    unauthorized: string;
    forbidden: string;
    notFound: string;
    serverError: string;
  };
  auth: {
    tokenExpired: string;
    tokenInvalid: string;
    tokenEmpty: string;
    loginFailed: string;
    logoutSuccess: string;
  };
  page: {
    notFound: string;
    serverError: string;
    unauthorized: string;
    networkError: string;
    backHome: string;
    goBack: string;
    refresh: string;
  };
  file: {
    uploadFail: string;
    downloadFail: string;
    notFound: string;
    tooLarge: string;
    typeError: string;
    damaged: string;
  };
  success: {
    add: string;
    edit: string;
    delete: string;
    save: string;
    submit: string;
    cancel: string;
    reset: string;
    export: string;
    import: string;
    upload: string;
    download: string;
    login: string;
    logout: string;
    register: string;
    approve: string;
    reject: string;
    enable: string;
    disable: string;
    send: string;
    execute: string;
    pause: string;
    resume: string;
    refresh: string;
    copy: string;
    clear: string;
  };
  fail: {
    add: string;
    edit: string;
    delete: string;
    save: string;
    submit: string;
    cancel: string;
    reset: string;
    export: string;
    import: string;
    upload: string;
    download: string;
    login: string;
    logout: string;
    register: string;
    approve: string;
    reject: string;
    enable: string;
    disable: string;
    send: string;
    execute: string;
    pause: string;
    resume: string;
    refresh: string;
    copy: string;
    clear: string;
    network: string;
    server: string;
    timeout: string;
  };
  warning: {
    confirm: string;
    delete: string;
    logout: string;
    unsaved: string;
    limit: string;
    required: string;
  };
  info: {
    loading: string;
    saving: string;
    submitting: string;
    processing: string;
    uploading: string;
    downloading: string;
    logging: string;
    noData: string;
    pleaseSelect: string;
    pleaseInput: string;
    operationSuccess: string;
    operationFail: string;
  };
  sidebar: {
    title: string;
    collapse: string;
    expand: string;
    home: string;
  };
  header: {
    dashboard: string;
    logout: string;
    profile: string;
    settings: string;
    changePassword: string;
  };
  breadcrumb: {
    home: string;
  };
  tagsView: {
    refresh: string;
    close: string;
    closeOthers: string;
    closeAll: string;
    maximize: string;
    minimize: string;
  };
  fullscreen: {
    fullscreen: string;
    exitFullscreen: string;
  };
  search: {
    placeholder: string;
    empty: string;
  };
  notification: {
    title: string;
    markAllRead: string;
    empty: string;
  };
  userDropdown: {
    profile: string;
    settings: string;
    logout: string;
  };
  add: string;
  edit: string;
  delete: string;
  export: string;
  import: string;
  submit: string;
  cancel: string;
  reset: string;
  query: string;
  confirm: string;
  save: string;
  close: string;
  refresh: string;
  back: string;
  more: string;
  handle: string;
  status: {
    enable: string;
    disable: string;
    normal: string;
    stop: string;
    active: string;
    inactive: string;
  };
  message: {
    success: string;
    error: string;
    warning: string;
    info: string;
    confirm: string;
    logout: string;
    deleteConfirm: string;
    networkError: string;
    timeout: string;
    unauthorized: string;
    forbidden: string;
    systemError: string;
    paramError: string;
    validateError: string;
  };
  datetime: {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
    today: string;
    yesterday: string;
    tomorrow: string;
    thisWeek: string;
    lastWeek: string;
    nextWeek: string;
    thisMonth: string;
    lastMonth: string;
    nextMonth: string;
  };
};
export default en;
export type LocaleMessages = typeof en;
//# sourceMappingURL=index.d.ts.map

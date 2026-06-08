/**
 * 模拟数据库 - 存储模拟数据
 * @module mock/database
 */

/** 用户信息 */
interface User {
  userId: number
  username: string
  password: string
  nickname: string
  email: string
  phone: string
  sex: '0' | '1' | '2'
  avatar: string
  status: '0' | '1'
  deptId: number
  postId: number[]
  roleId: number[]
  loginIp: string
  loginDate: string
  createTime: string
  remark: string
}

/** 角色信息 */
interface Role {
  roleId: number
  roleName: string
  roleKey: string
  roleSort: number
  dataScope: '1' | '2' | '3' | '4' | '5'
  menuCheckStrictly: boolean
  deptCheckStrictly: boolean
  status: '0' | '1'
  permissions: string[]
  remark: string
  createTime: string
}

/** 部门信息 */
interface Dept {
  deptId: number
  parentId: number
  ancestors: string
  deptName: string
  leader: string
  phone: string
  email: string
  status: '0' | '1'
  createTime: string
  children?: Dept[]
}

/** 菜单信息 */
interface Menu {
  menuId: number
  parentId: number
  menuName: string
  path: string
  component?: string
  query?: string
  isFrame: boolean
  isCache: boolean
  menuType: 'M' | 'C' | 'F'
  visible: '0' | '1'
  status: '0' | '1'
  perms?: string
  icon: string
  orderNum: number
  createTime: string
  children?: Menu[]
}

/** 岗位信息 */
interface Post {
  postId: number
  postCode: string
  postName: string
  postSort: number
  status: '0' | '1'
  remark: string
  createTime: string
}

/** 操作日志 */
interface Operlog {
  operId: string
  operName: string
  operTime: string
  operType: '查询' | '新增' | '修改' | '删除' | '导出' | '导入' | '授权' | '其他'
  operModule: string
  status: '0' | '1'
  requestMethod: string
  operUrl: string
  operIp: string
  operSystem: string
  browser: string
  costTime: number
  operLocation: string
  operParam: string
  jsonResult: string
  createTime: string
}

/** 登录日志 */
interface Logininfor {
  infoId: string
  userName: string
  loginAccount: string
  status: '0' | '1'
  loginLocation: string
  operationType: '登录' | '登出' | '注册' | '修改密码' | '找回密码' | '其他'
  os: string
  browser: string
  loginTime: string
  msg: string
  ip: string
  createTime: string
}

/** 在线用户 */
interface OnlineUser {
  sessionId: string
  userName: string
  loginAccount: string
  deptName: string
  browser: string
  os: string
  ip: string
  loginTime: string
  lastAccessTime: string
  expireTime: string
  userId: string
}

/** 定时任务 */
interface Job {
  jobId: string
  jobName: string
  jobGroup: 'default' | 'system' | 'custom'
  invokeTarget: string
  cronExpression: string
  misfirePolicy: '0' | '1' | '2'
  concurrent: '0' | '1'
  status: '0' | '1' | '2' | '3' | '4'
  createTime: string
  nextValidTime: string
  lastRunTime?: string
  runCount?: number
  remark: string
}

/** 定时任务日志 */
interface JobLog {
  logId: string
  jobId: string
  jobName: string
  jobGroup: 'default' | 'system' | 'custom'
  invokeTarget: string
  status: '0' | '1'
  executeTime: string
  costTime: number
  message: string
  error?: string
  createTime: string
}

/** 代码生成表 */
interface GenTable {
  tableName: string
  tableComment: string
  tableSchema: string
  engine: string
  createTime: string
}

/** 数据库存储 */
export const db = {
  users: [
    {
      userId: 1,
      username: 'admin',
      password: 'admin123',
      nickname: '管理员',
      email: 'admin@yunshu.com',
      phone: '15888888888',
      sex: '0' as const,
      avatar: '',
      status: '0' as const,
      deptId: 100,
      postId: [1],
      roleId: [1],
      loginIp: '127.0.0.1',
      loginDate: '2024-01-01 10:00:00',
      createTime: '2024-01-01 10:00:00',
      remark: '系统管理员'
    },
    {
      userId: 2,
      username: 'user01',
      password: 'user123',
      nickname: '张三',
      email: 'zhangsan@yunshu.com',
      phone: '15888888881',
      sex: '0' as const,
      avatar: '',
      status: '0' as const,
      deptId: 101,
      postId: [2],
      roleId: [2],
      loginIp: '192.168.1.100',
      loginDate: '2024-01-15 08:30:00',
      createTime: '2024-01-10 10:00:00',
      remark: '测试用户'
    },
    {
      userId: 3,
      username: 'user02',
      password: 'user123',
      nickname: '李四',
      email: 'lisi@yunshu.com',
      phone: '15888888882',
      sex: '1' as const,
      avatar: '',
      status: '0' as const,
      deptId: 102,
      postId: [3],
      roleId: [3],
      loginIp: '192.168.1.101',
      loginDate: '2024-01-16 09:00:00',
      createTime: '2024-01-12 10:00:00',
      remark: ''
    },
    {
      userId: 4,
      username: 'user03',
      password: 'user123',
      nickname: '王五',
      email: 'wangwu@yunshu.com',
      phone: '15888888883',
      sex: '0' as const,
      avatar: '',
      status: '1' as const,
      deptId: 103,
      postId: [4],
      roleId: [4],
      loginIp: '',
      loginDate: '',
      createTime: '2024-01-15 10:00:00',
      remark: '已停用'
    }
  ] as User[],

  roles: [
    {
      roleId: 1,
      roleName: '超级管理员',
      roleKey: 'admin',
      roleSort: 1,
      dataScope: '1' as const,
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      status: '0' as const,
      permissions: ['*:*:*'],
      remark: '系统最高权限',
      createTime: '2024-01-01 10:00:00'
    },
    {
      roleId: 2,
      roleName: '运维人员',
      roleKey: 'operator',
      roleSort: 2,
      dataScope: '2' as const,
      menuCheckStrictly: true,
      deptCheckStrictly: false,
      status: '0' as const,
      permissions: ['system:user:list', 'system:user:query', 'system:role:list', 'monitor:server:view'],
      remark: '系统运维角色',
      createTime: '2024-01-05 10:00:00'
    },
    {
      roleId: 3,
      roleName: '普通用户',
      roleKey: 'user',
      roleSort: 3,
      dataScope: '5' as const,
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      status: '0' as const,
      permissions: ['system:user:list', 'system:user:query'],
      remark: '普通用户角色',
      createTime: '2024-01-08 10:00:00'
    },
    {
      roleId: 4,
      roleName: '游客',
      roleKey: 'guest',
      roleSort: 4,
      dataScope: '5' as const,
      menuCheckStrictly: false,
      deptCheckStrictly: false,
      status: '1' as const,
      permissions: [],
      remark: '游客角色',
      createTime: '2024-01-10 10:00:00'
    }
  ] as Role[],

  depts: [
    {
      deptId: 100,
      parentId: 0,
      ancestors: '0',
      deptName: '云枢科技',
      leader: 'admin',
      phone: '010-12345678',
      email: 'admin@yunshu.com',
      status: '0' as const,
      createTime: '2024-01-01 10:00:00',
      children: [
        {
          deptId: 101,
          parentId: 100,
          ancestors: '0,100',
          deptName: '研发部',
          leader: '张三',
          phone: '010-12345679',
          email: 'dev@yunshu.com',
          status: '0' as const,
          createTime: '2024-01-02 10:00:00',
          children: [
            {
              deptId: 104,
              parentId: 101,
              ancestors: '0,100,101',
              deptName: '前端组',
              leader: '李四',
              phone: '010-12345680',
              email: 'frontend@yunshu.com',
              status: '0' as const,
              createTime: '2024-01-03 10:00:00'
            },
            {
              deptId: 105,
              parentId: 101,
              ancestors: '0,100,101',
              deptName: '后端组',
              leader: '王五',
              phone: '010-12345681',
              email: 'backend@yunshu.com',
              status: '0' as const,
              createTime: '2024-01-03 10:00:00'
            }
          ]
        },
        {
          deptId: 102,
          parentId: 100,
          ancestors: '0,100',
          deptName: '产品部',
          leader: '赵六',
          phone: '010-12345682',
          email: 'product@yunshu.com',
          status: '0' as const,
          createTime: '2024-01-02 10:00:00'
        },
        {
          deptId: 103,
          parentId: 100,
          ancestors: '0,100',
          deptName: '市场部',
          leader: '孙七',
          phone: '010-12345683',
          email: 'market@yunshu.com',
          status: '1' as const,
          createTime: '2024-01-02 10:00:00'
        }
      ]
    }
  ] as Dept[],

  menus: [
    {
      menuId: 1,
      parentId: 0,
      menuName: '工作台',
      path: '/dashboard',
      component: 'LAYOUT',
      isFrame: false,
      isCache: false,
      menuType: 'M' as const,
      visible: '0' as const,
      status: '0' as const,
      icon: 'dashboard',
      orderNum: 1,
      createTime: '2024-01-01 10:00:00'
    },
    {
      menuId: 2,
      parentId: 0,
      menuName: '系统管理',
      path: '/system',
      component: 'LAYOUT',
      isFrame: false,
      isCache: false,
      menuType: 'M' as const,
      visible: '0' as const,
      status: '0' as const,
      icon: 'setting',
      orderNum: 2,
      createTime: '2024-01-01 10:00:00',
      children: [
        {
          menuId: 21,
          parentId: 2,
          menuName: '用户管理',
          path: 'user',
          component: '/system/user/index',
          isFrame: false,
          isCache: false,
          menuType: 'C' as const,
          visible: '0' as const,
          status: '0' as const,
          perms: 'system:user:list',
          icon: 'user',
          orderNum: 1,
          createTime: '2024-01-01 10:00:00'
        },
        {
          menuId: 22,
          parentId: 2,
          menuName: '角色管理',
          path: 'role',
          component: '/system/role/index',
          isFrame: false,
          isCache: false,
          menuType: 'C' as const,
          visible: '0' as const,
          status: '0' as const,
          perms: 'system:role:list',
          icon: 'role',
          orderNum: 2,
          createTime: '2024-01-01 10:00:00'
        },
        {
          menuId: 23,
          parentId: 2,
          menuName: '菜单管理',
          path: 'menu',
          component: '/system/menu/index',
          isFrame: false,
          isCache: false,
          menuType: 'C' as const,
          visible: '0' as const,
          status: '0' as const,
          perms: 'system:menu:list',
          icon: 'menu',
          orderNum: 3,
          createTime: '2024-01-01 10:00:00'
        },
        {
          menuId: 24,
          parentId: 2,
          menuName: '部门管理',
          path: 'dept',
          component: '/system/dept/index',
          isFrame: false,
          isCache: false,
          menuType: 'C' as const,
          visible: '0' as const,
          status: '0' as const,
          perms: 'system:dept:list',
          icon: 'dept',
          orderNum: 4,
          createTime: '2024-01-01 10:00:00'
        },
        {
          menuId: 25,
          parentId: 2,
          menuName: '岗位管理',
          path: 'post',
          component: '/system/post/index',
          isFrame: false,
          isCache: false,
          menuType: 'C' as const,
          visible: '0' as const,
          status: '0' as const,
          perms: 'system:post:list',
          icon: 'post',
          orderNum: 5,
          createTime: '2024-01-01 10:00:00'
        }
      ]
    },
    {
      menuId: 3,
      parentId: 0,
      menuName: '系统监控',
      path: '/monitor',
      component: 'LAYOUT',
      isFrame: false,
      isCache: false,
      menuType: 'M' as const,
      visible: '0' as const,
      status: '0' as const,
      icon: 'monitor',
      orderNum: 3,
      createTime: '2024-01-01 10:00:00',
      children: [
        {
          menuId: 31,
          parentId: 3,
          menuName: '操作日志',
          path: 'operlog',
          component: '/monitor/operlog/index',
          isFrame: false,
          isCache: false,
          menuType: 'C' as const,
          visible: '0' as const,
          status: '0' as const,
          perms: 'monitor:operlog:list',
          icon: 'log',
          orderNum: 1,
          createTime: '2024-01-01 10:00:00'
        },
        {
          menuId: 32,
          parentId: 3,
          menuName: '登录日志',
          path: 'logininfor',
          component: '/monitor/logininfor/index',
          isFrame: false,
          isCache: false,
          menuType: 'C' as const,
          visible: '0' as const,
          status: '0' as const,
          perms: 'monitor:logininfor:list',
          icon: 'login',
          orderNum: 2,
          createTime: '2024-01-01 10:00:00'
        },
        {
          menuId: 33,
          parentId: 3,
          menuName: '在线用户',
          path: 'online',
          component: '/monitor/online/index',
          isFrame: false,
          isCache: false,
          menuType: 'C' as const,
          visible: '0' as const,
          status: '0' as const,
          perms: 'monitor:online:list',
          icon: 'online',
          orderNum: 3,
          createTime: '2024-01-01 10:00:00'
        },
        {
          menuId: 34,
          parentId: 3,
          menuName: '服务监控',
          path: 'server',
          component: '/monitor/server/index',
          isFrame: false,
          isCache: false,
          menuType: 'C' as const,
          visible: '0' as const,
          status: '0' as const,
          perms: 'monitor:server:list',
          icon: 'server',
          orderNum: 4,
          createTime: '2024-01-01 10:00:00'
        },
        {
          menuId: 35,
          parentId: 3,
          menuName: '定时任务',
          path: 'job',
          component: '/monitor/job/index',
          isFrame: false,
          isCache: false,
          menuType: 'C' as const,
          visible: '0' as const,
          status: '0' as const,
          perms: 'monitor:job:list',
          icon: 'job',
          orderNum: 5,
          createTime: '2024-01-01 10:00:00'
        }
      ]
    },
    {
      menuId: 4,
      parentId: 0,
      menuName: '系统工具',
      path: '/tool',
      component: 'LAYOUT',
      isFrame: false,
      isCache: false,
      menuType: 'M' as const,
      visible: '0' as const,
      status: '0' as const,
      icon: 'tool',
      orderNum: 4,
      createTime: '2024-01-01 10:00:00',
      children: [
        {
          menuId: 41,
          parentId: 4,
          menuName: '代码生成',
          path: 'gen',
          component: '/tool/gen/index',
          isFrame: false,
          isCache: false,
          menuType: 'C' as const,
          visible: '0' as const,
          status: '0' as const,
          perms: 'tool:gen:list',
          icon: 'code',
          orderNum: 1,
          createTime: '2024-01-01 10:00:00'
        }
      ]
    }
  ] as Menu[],

  posts: [
    {
      postId: 1,
      postCode: 'CEO',
      postName: '首席执行官',
      postSort: 1,
      status: '0' as const,
      remark: '公司最高管理者',
      createTime: '2024-01-01 10:00:00'
    },
    {
      postId: 2,
      postCode: 'DEV_LEADER',
      postName: '研发组长',
      postSort: 2,
      status: '0' as const,
      remark: '研发团队负责人',
      createTime: '2024-01-01 10:00:00'
    },
    {
      postId: 3,
      postCode: 'DEV',
      postName: '开发工程师',
      postSort: 3,
      status: '0' as const,
      remark: '开发人员',
      createTime: '2024-01-01 10:00:00'
    },
    {
      postId: 4,
      postCode: 'TEST',
      postName: '测试工程师',
      postSort: 4,
      status: '0' as const,
      remark: '测试人员',
      createTime: '2024-01-01 10:00:00'
    },
    {
      postId: 5,
      postCode: 'OP',
      postName: '运维工程师',
      postSort: 5,
      status: '1' as const,
      remark: '运维人员',
      createTime: '2024-01-01 10:00:00'
    }
  ] as Post[],

  operlogs: [] as Operlog[],

  logininfors: [] as Logininfor[],

  onlineUsers: [] as OnlineUser[],

  jobs: [
    {
      jobId: '1',
      jobName: '数据备份',
      jobGroup: 'system',
      invokeTarget: 'backupTask',
      cronExpression: '0 0 2 * * ?',
      misfirePolicy: '0',
      concurrent: '0',
      status: '0',
      createTime: '2024-01-01 10:00:00',
      nextValidTime: '2024-02-01 02:00:00',
      remark: '每日凌晨2点执行数据备份'
    },
    {
      jobId: '2',
      jobName: '日志清理',
      jobGroup: 'system',
      invokeTarget: 'cleanLogTask',
      cronExpression: '0 0 3 * * ?',
      misfirePolicy: '0',
      concurrent: '0',
      status: '0',
      createTime: '2024-01-01 10:00:00',
      nextValidTime: '2024-02-01 03:00:00',
      remark: '每日凌晨3点清理30天前的日志'
    },
    {
      jobId: '3',
      jobName: '缓存刷新',
      jobGroup: 'default',
      invokeTarget: 'refreshCacheTask',
      cronExpression: '0 */10 * * * ?',
      misfirePolicy: '1',
      concurrent: '1',
      status: '0',
      createTime: '2024-01-05 10:00:00',
      nextValidTime: '2024-01-20 10:00:00',
      remark: '每10分钟刷新一次缓存'
    },
    {
      jobId: '4',
      jobName: '报表生成',
      jobGroup: 'custom',
      invokeTarget: 'generateReportTask',
      cronExpression: '0 0 8 * * ?',
      misfirePolicy: '0',
      concurrent: '0',
      status: '1',
      createTime: '2024-01-10 10:00:00',
      nextValidTime: '-',
      remark: '每天早上8点生成报表（已暂停）'
    }
  ] as Job[],

  jobLogs: [] as JobLog[],

  genTables: [
    {
      tableName: 'sys_user',
      tableComment: '用户表',
      tableSchema: 'yunshu',
      engine: 'InnoDB',
      createTime: '2024-01-01 10:00:00'
    },
    {
      tableName: 'sys_role',
      tableComment: '角色表',
      tableSchema: 'yunshu',
      engine: 'InnoDB',
      createTime: '2024-01-01 10:00:00'
    },
    {
      tableName: 'sys_menu',
      tableComment: '菜单表',
      tableSchema: 'yunshu',
      engine: 'InnoDB',
      createTime: '2024-01-01 10:00:00'
    },
    {
      tableName: 'sys_dept',
      tableComment: '部门表',
      tableSchema: 'yunshu',
      engine: 'InnoDB',
      createTime: '2024-01-01 10:00:00'
    },
    {
      tableName: 'sys_post',
      tableComment: '岗位表',
      tableSchema: 'yunshu',
      engine: 'InnoDB',
      createTime: '2024-01-01 10:00:00'
    }
  ] as GenTable[]
}

// 初始化操作日志数据
function initOperlogs() {
  const modules = ['用户管理', '角色管理', '菜单管理', '部门管理', '岗位管理', '系统监控']
  const operTypes = ['查询', '新增', '修改', '删除'] as const
  const methods = ['GET', 'POST', 'PUT', 'DELETE']
  const systems = ['Windows 10', 'Windows 11', 'macOS', 'Linux']
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']
  const ips = ['192.168.1.100', '192.168.1.101', '192.168.1.102', '127.0.0.1']
  const locations = ['北京市', '上海市', '广州市', '深圳市', '杭州市']

  for (let i = 1; i <= 50; i++) {
    const operType = operTypes[Math.floor(Math.random() * operTypes.length)]
    const module = modules[Math.floor(Math.random() * modules.length)]
    db.operlogs.push({
      operId: String(i),
      operName: i % 5 === 0 ? 'admin' : `user${String(i % 5).padStart(2, '0')}`,
      operTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
      operType,
      operModule: module,
      status: Math.random() > 0.1 ? '0' : '1',
      requestMethod: methods[Math.floor(Math.random() * methods.length)],
      operUrl: `/api/${module.toLowerCase().replace('管理', '')}/${operType === '查询' ? 'list' : operType === '新增' ? '' : String(i)}`,
      operIp: ips[Math.floor(Math.random() * ips.length)],
      operSystem: systems[Math.floor(Math.random() * systems.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      costTime: Math.floor(Math.random() * 5000) + 100,
      operLocation: locations[Math.floor(Math.random() * locations.length)],
      operParam: JSON.stringify({ id: i, name: `test${i}` }),
      jsonResult: JSON.stringify({ code: 200, msg: '操作成功' }),
      createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 10:00:00'
    })
  }
}

// 初始化登录日志数据
function initLogininfors() {
  const users = ['admin', 'user01', 'user02', 'user03']
  const operations = ['登录', '登出'] as const
  const statusArr = ['0', '1'] as const
  const osList = ['Windows 10', 'Windows 11', 'macOS', 'Linux', 'iOS', 'Android']
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', '微信内置']
  const ips = ['192.168.1.100', '192.168.1.101', '192.168.1.102', '127.0.0.1', '10.0.0.1']
  const locations = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市']

  for (let i = 1; i <= 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const operation = i % 3 === 0 ? '登出' : '登录'
    const status = Math.random() > 0.05 ? '0' : '1'
    db.logininfors.push({
      infoId: String(i),
      userName: user,
      loginAccount: user,
      status,
      loginLocation: locations[Math.floor(Math.random() * locations.length)],
      operationType: operation,
      os: osList[Math.floor(Math.random() * osList.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      loginTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
      msg: status === '0' ? `${operation}成功` : `${operation}失败：密码错误`,
      ip: ips[Math.floor(Math.random() * ips.length)],
      createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 10:00:00'
    })
  }
}

// 初始化在线用户数据
function initOnlineUsers() {
  const users = [
    { userName: 'admin', loginAccount: 'admin', deptName: '云枢科技' },
    { userName: 'user01', loginAccount: 'user01', deptName: '研发部' },
    { userName: 'user02', loginAccount: 'user02', deptName: '产品部' },
    { userName: 'user03', loginAccount: 'user03', deptName: '市场部' }
  ]
  const osList = ['Windows 10', 'macOS', 'Linux', 'iOS']
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']

  for (let i = 0; i < 8; i++) {
    const user = users[i % users.length]
    const loginTime = new Date(Date.now() - Math.random() * 60 * 60 * 1000)
    db.onlineUsers.push({
      sessionId: `session_${Date.now()}_${i}`,
      userName: user.userName,
      loginAccount: user.loginAccount,
      deptName: user.deptName,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      os: osList[Math.floor(Math.random() * osList.length)],
      ip: `192.168.1.${100 + i}`,
      loginTime: loginTime.toISOString().replace('T', ' ').slice(0, 19),
      lastAccessTime: new Date(Date.now() - Math.random() * 10 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
      expireTime: new Date(loginTime.getTime() + 30 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
      userId: String(i + 1)
    })
  }
}

// 初始化任务日志数据
function initJobLogs() {
  const jobs = db.jobs.filter(j => j.status === '0')

  for (let i = 1; i <= 20; i++) {
    const job = jobs[Math.floor(Math.random() * jobs.length)]
    const status = Math.random() > 0.1 ? '0' : '1'
    db.jobLogs.push({
      logId: String(i),
      jobId: job.jobId,
      jobName: job.jobName,
      jobGroup: job.jobGroup,
      invokeTarget: job.invokeTarget,
      status,
      executeTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
      costTime: Math.floor(Math.random() * 10000) + 500,
      message: status === '0' ? '执行成功' : '执行失败',
      error: status === '1' ? 'NullPointerException: null' : undefined,
      createTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 10:00:00'
    })
  }
}

// 执行初始化
initOperlogs()
initLogininfors()
initOnlineUsers()
initJobLogs()

export type { User, Role, Dept, Menu, Post, Operlog, Logininfor, OnlineUser, Job, JobLog, GenTable }

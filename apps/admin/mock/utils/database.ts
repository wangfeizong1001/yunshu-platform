/**
 * 模拟数据库 - 存储模拟数据
 * @module mock/database
 */

/** ==================== 数据生成工具函数 ==================== */

/**
 * 随机IP生成
 */
export function randomIP(): string {
  const segments = [
    Math.floor(Math.random() * 223) + 1, // 1-223 (排除0和224-255)
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  ]
  // 排除 localhost
  if (segments[0] === 127 && segments[1] === 0 && segments[2] === 0) {
    segments[0] = 192
  }
  return segments.join('.')
}

/**
 * 随机国内城市
 */
const CITIES = [
  '北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市', '武汉市', '成都市',
  '西安市', '重庆市', '天津市', '苏州市', '长沙市', '郑州市', '青岛市', '济南市',
  '合肥市', '福州市', '厦门市', '南昌市', '昆明市', '贵阳市', '南宁市', '海口市',
  '石家庄市', '哈尔滨市', '长春市', '沈阳市', '大连市', '太原市', '兰州市'
]

export function randomCity(): string {
  return CITIES[Math.floor(Math.random() * CITIES.length)]
}

/**
 * 随机日期时间
 * @param daysAgo 最近N天内
 */
export function randomDateTime(daysAgo: number = 30): string {
  const now = Date.now()
  const offset = Math.floor(Math.random() * daysAgo * 24 * 60 * 60 * 1000)
  return new Date(now - offset).toISOString().replace('T', ' ').slice(0, 19)
}

/**
 * 随机日期时间（指定范围）
 */
export function randomDateTimeRange(begin: Date, end: Date): string {
  const beginTime = begin.getTime()
  const endTime = end.getTime()
  const offset = Math.floor(Math.random() * (endTime - beginTime))
  return new Date(beginTime + offset).toISOString().replace('T', ' ').slice(0, 19)
}

/**
 * 随机浏览器
 */
const BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', '360安全浏览器', 'QQ浏览器', '微信内置浏览器']

export function randomBrowser(): string {
  return BROWSERS[Math.floor(Math.random() * BROWSERS.length)]
}

/**
 * 随机操作系统
 */
const OS_LIST = ['Windows 10', 'Windows 11', 'macOS', 'Linux', 'Ubuntu', 'iOS', 'Android', 'HarmonyOS']

export function randomOS(): string {
  return OS_LIST[Math.floor(Math.random() * OS_LIST.length)]
}

/**
 * 随机手机号
 */
export function randomPhone(): string {
  const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
    '150', '151', '152', '153', '155', '156', '157', '158', '159',
    '170', '171', '172', '173', '175', '176', '177', '178',
    '180', '181', '182', '183', '184', '185', '186', '187', '188', '189']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = String(Math.floor(Math.random() * 100000000)).padStart(8, '0')
  return prefix + suffix
}

/**
 * 随机邮箱
 */
const EMAIL_DOMAINS = ['qq.com', '163.com', '126.com', 'gmail.com', 'outlook.com', 'yunshu.com', 'company.com']

export function randomEmail(name: string): string {
  const domain = EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)]
  return `${name}@${domain}`
}

/**
 * 随机中文姓名
 */
const XING = ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗', '郑', '梁', '谢', '宋', '唐', '许', '韩', '冯', '邓', '曹', '彭', '曾', '肖', '田', '董', '潘', '袁', '蔡', '蒋', '余', '于', '叶', '程', '苏', '魏', '吕', '丁', '任', '沈', '姚', '卢', '姜', '崔', '钟', '谭', '陆', '汪', '范', '金', '韦', '夏', '廖', '周', '江', '颜', '钱']
const MING = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英', '芬', '玲', '国华', '建华', '建国', '建军', '海', '志强', '志明', '永红', '小红', '志强', '建华', '鹏', '辉', '亮', '波', '峰', '飞', '宇', '晨', '阳', '旭', '浩', '嘉', '欣', '琪', '雅', '文', '博', '鑫', '泽', '睿', '子轩', '子涵', '梓萱', '思远', '思雨', '诗涵', '雨萱']

export function randomChineseName(): string {
  const xing = XING[Math.floor(Math.random() * XING.length)]
  const ming = MING[Math.floor(Math.random() * MING.length)]
  // 30%概率双名
  if (Math.random() > 0.7) {
    return xing + ming + MING[Math.floor(Math.random() * MING.length)]
  }
  return xing + ming
}

/**
 * 随机用户名（拼音）
 */
const USERNAME_PREFIXES = ['zhang', 'wang', 'li', 'zhao', 'liu', 'chen', 'yang', 'huang', 'wu', 'xu', 'sun', 'ma', 'zhu', 'hu', 'he', 'gao', 'lin', 'luo', 'zheng', 'liang']
const USERNAME_SUFFIXES = ['san', 'si', 'wu', 'hui', 'jie', 'min', 'jing', 'jing', 'liang', 'qiang', 'yong', 'yan', 'jun', 'yang', 'chao', 'ming', 'chao', 'xiu', 'xia', 'ping', 'gang', 'gui', 'fen', 'ling', 'hua', 'jian', 'jian', 'jun', 'hai', 'zhi', 'zhi', 'yong', 'hong', 'xiao', 'zhi', 'jian', 'peng', 'hui', 'liang', 'bo', 'fei', 'yu', 'chen', 'yang', 'xu', 'hao', 'jia', 'xin', 'qi', 'ya', 'wen', 'bo', 'xin', 'ze', 'rui', 'xuan', 'han', 'si', 'yu', 'han']

export function randomUsername(): string {
  const prefix = USERNAME_PREFIXES[Math.floor(Math.random() * USERNAME_PREFIXES.length)]
  const suffix = USERNAME_SUFFIXES[Math.floor(Math.random() * USERNAME_SUFFIXES.length)]
  const num = Math.random() > 0.5 ? String(Math.floor(Math.random() * 99) + 1) : ''
  return prefix + suffix + num
}

/**
 * 随机costTime
 */
export function randomCostTime(max: number = 5000): number {
  return Math.floor(Math.random() * max) + 10
}

/**
 * 随机URL路径
 */
export function randomUrlPath(): string {
  const modules = ['user', 'role', 'menu', 'dept', 'post', 'notice', 'dict', 'config', 'monitor']
  const actions = ['list', 'query', 'add', 'edit', 'delete', 'export', 'import', 'reset']
  const module = modules[Math.floor(Math.random() * modules.length)]
  const action = actions[Math.floor(Math.random() * actions.length)]
  const id = Math.random() > 0.5 ? `/${Math.floor(Math.random() * 1000)}` : ''
  return `/api/${module}/${action}${id}`
}

/** ==================== 数据类型定义 ==================== */

/** 用户信息 */
export interface User {
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
export interface Role {
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
export interface Dept {
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
export interface Menu {
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
export interface Post {
  postId: number
  postCode: string
  postName: string
  postSort: number
  status: '0' | '1'
  remark: string
  createTime: string
}

/** 操作日志 */
export interface Operlog {
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
export interface Logininfor {
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
export interface OnlineUser {
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
export interface Job {
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
export interface JobLog {
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
export interface GenTable {
  tableName: string
  tableComment: string
  tableSchema: string
  engine: string
  createTime: string
}

/** 表单组件 */
export interface FormComponent {
  id: string
  type: 'input' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'date' | 'datetime' | 'time' | 'upload' | 'number' | 'switch' | 'rate' | 'slider'
  label: string
  field: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  defaultValue?: any
  options?: Array<{ label: string; value: any }>
  rules?: string[]
  min?: number
  max?: number
  step?: number
  multiple?: boolean
  accept?: string
  maxCount?: number
}

/** 表单信息 */
export interface Form {
  formId: number
  formName: string
  formCode: string
  description: string
  components: FormComponent[]
  status: '0' | '1'
  createTime: string
  updateTime: string
  remark: string
}

/** 站内消息 */
export interface Message {
  messageId: number
  title: string
  content: string
  type: 'system' | 'normal' | 'reminder'
  priority: 'high' | 'medium' | 'low'
  status: '0' | '1'
  senderId: number
  senderName: string
  receiverId: number
  receiverName: string
  sendTime: string
  readTime?: string
}

/** 通知 */
export interface Notification {
  notificationId: number
  title: string
  content: string
  type: string
  level: string
  status: string
  targetType: string
  targetIds?: number[]
  isPushed: boolean
  pushTime?: string
  expireTime?: string
  createBy: string
  createTime: string
  updateTime?: string
}

/** 工作流定义 */
export interface WorkflowDefinition {
  definitionId: string
  definitionKey: string
  definitionName: string
  version: number
  category: string
  description: string
  formId?: number
  formName?: string
  status: '0' | '1' | '2' | '3' // 草稿/已发布/已下线/已归档
  initiator: string
  createTime: string
  updateTime: string
}

/** 工作流实例 */
export interface WorkflowInstance {
  instanceId: string
  definitionId: string
  definitionName: string
  businessKey: string
  businessId?: string
  currentNode: string
  currentNodeName: string
  status: 'draft' | 'running' | 'suspended' | 'completed' | 'cancelled' | 'rejected'
  initiator: string
  initiatorName: string
  createTime: string
  updateTime: string
  endTime?: string
}

/** 工作流任务 */
export interface WorkflowTask {
  taskId: string
  instanceId: string
  definitionName: string
  taskName: string
  taskKey: string
  assignee?: string
  assigneeName?: string
  candidateUsers?: string[]
  candidateGroups?: string[]
  priority: number
  dueDate?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  createTime: string
  completeTime?: string
  variables?: Record<string, any>
}

/** 工作流历史 */
export interface WorkflowHistory {
  historyId: string
  instanceId: string
  taskId?: string
  taskName: string
  nodeName: string
  action: 'submit' | 'approve' | 'reject' | 'delegate' | 'callback' | 'terminate'
  operator: string
  operatorName: string
  comment?: string
  createTime: string
  duration?: number
}

/** ==================== 数据库存储 ==================== */

export const db = {
  users: [
    // 超级管理员
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
    // 研发部 - 前端组
    {
      userId: 2,
      username: 'zhangsan',
      password: 'user123',
      nickname: '张三',
      email: 'zhangsan@yunshu.com',
      phone: '13800138001',
      sex: '0' as const,
      avatar: '',
      status: '0' as const,
      deptId: 104,
      postId: [2],
      roleId: [2],
      loginIp: '192.168.1.100',
      loginDate: '2024-01-15 08:30:00',
      createTime: '2024-01-10 10:00:00',
      remark: '前端组组长'
    },
    {
      userId: 3,
      username: 'lisi',
      password: 'user123',
      nickname: '李四',
      email: 'lisi@yunshu.com',
      phone: '13800138002',
      sex: '1' as const,
      avatar: '',
      status: '0' as const,
      deptId: 104,
      postId: [3],
      roleId: [3],
      loginIp: '192.168.1.101',
      loginDate: '2024-01-16 09:00:00',
      createTime: '2024-01-12 10:00:00',
      remark: '前端开发工程师'
    },
    {
      userId: 4,
      username: 'wangwu',
      password: 'user123',
      nickname: '王五',
      email: 'wangwu@yunshu.com',
      phone: '13800138003',
      sex: '0' as const,
      avatar: '',
      status: '0' as const,
      deptId: 104,
      postId: [3],
      roleId: [3],
      loginIp: '192.168.1.102',
      loginDate: '2024-01-17 10:00:00',
      createTime: '2024-01-13 10:00:00',
      remark: '前端开发工程师'
    },
    // 研发部 - 后端组
    {
      userId: 5,
      username: 'zhaoliu',
      password: 'user123',
      nickname: '赵六',
      email: 'zhaoliu@yunshu.com',
      phone: '13800138004',
      sex: '0' as const,
      avatar: '',
      status: '0' as const,
      deptId: 105,
      postId: [2],
      roleId: [2],
      loginIp: '192.168.1.103',
      loginDate: '2024-01-18 08:00:00',
      createTime: '2024-01-15 10:00:00',
      remark: '后端组组长'
    },
    {
      userId: 6,
      username: 'sunqi',
      password: 'user123',
      nickname: '孙七',
      email: 'sunqi@yunshu.com',
      phone: '13800138005',
      sex: '1' as const,
      avatar: '',
      status: '0' as const,
      deptId: 105,
      postId: [3],
      roleId: [3],
      loginIp: '192.168.1.104',
      loginDate: '2024-01-19 09:00:00',
      createTime: '2024-01-16 10:00:00',
      remark: '后端开发工程师'
    },
    {
      userId: 7,
      username: 'zhouba',
      password: 'user123',
      nickname: '周八',
      email: 'zhouba@yunshu.com',
      phone: '13800138006',
      sex: '0' as const,
      avatar: '',
      status: '1' as const,
      deptId: 105,
      postId: [3],
      roleId: [3],
      loginIp: '',
      loginDate: '',
      createTime: '2024-01-20 10:00:00',
      remark: '已离职'
    },
    // 产品部
    {
      userId: 8,
      username: 'wujiu',
      password: 'user123',
      nickname: '吴九',
      email: 'wujiu@yunshu.com',
      phone: '13800138007',
      sex: '0' as const,
      avatar: '',
      status: '0' as const,
      deptId: 102,
      postId: [6],
      roleId: [4],
      loginIp: '192.168.1.105',
      loginDate: '2024-01-21 10:00:00',
      createTime: '2024-01-18 10:00:00',
      remark: '产品经理'
    },
    {
      userId: 9,
      username: 'zhengshi',
      password: 'user123',
      nickname: '郑十',
      email: 'zhengshi@yunshu.com',
      phone: '13800138008',
      sex: '1' as const,
      avatar: '',
      status: '0' as const,
      deptId: 102,
      postId: [6],
      roleId: [4],
      loginIp: '192.168.1.106',
      loginDate: '2024-01-22 10:00:00',
      createTime: '2024-01-20 10:00:00',
      remark: '产品助理'
    },
    // 市场部
    {
      userId: 10,
      username: 'caoshier',
      password: 'user123',
      nickname: '曹十二',
      email: 'caoshier@yunshu.com',
      phone: '13800138009',
      sex: '0' as const,
      avatar: '',
      status: '0' as const,
      deptId: 103,
      postId: [7],
      roleId: [5],
      loginIp: '192.168.1.107',
      loginDate: '2024-01-23 10:00:00',
      createTime: '2024-01-21 10:00:00',
      remark: '市场总监'
    },
    // 财务部
    {
      userId: 11,
      username: 'dengshisan',
      password: 'user123',
      nickname: '邓十三',
      email: 'dengshisan@yunshu.com',
      phone: '13800138010',
      sex: '1' as const,
      avatar: '',
      status: '0' as const,
      deptId: 106,
      postId: [8],
      roleId: [5],
      loginIp: '192.168.1.108',
      loginDate: '2024-01-24 10:00:00',
      createTime: '2024-01-22 10:00:00',
      remark: '财务经理'
    },
    // 人力资源部
    {
      userId: 12,
      username: 'caotianxia',
      password: 'user123',
      nickname: '曹天下',
      email: 'caotianxia@yunshu.com',
      phone: '13800138011',
      sex: '0' as const,
      avatar: '',
      status: '0' as const,
      deptId: 107,
      postId: [9],
      roleId: [5],
      loginIp: '192.168.1.109',
      loginDate: '2024-01-25 10:00:00',
      createTime: '2024-01-23 10:00:00',
      remark: 'HR经理'
    },
    // 测试部
    {
      userId: 13,
      username: 'pengan',
      password: 'user123',
      nickname: '彭安',
      email: 'pengan@yunshu.com',
      phone: '13800138012',
      sex: '1' as const,
      avatar: '',
      status: '0' as const,
      deptId: 108,
      postId: [4],
      roleId: [3],
      loginIp: '192.168.1.110',
      loginDate: '2024-01-26 10:00:00',
      createTime: '2024-01-24 10:00:00',
      remark: '测试工程师'
    },
    // 运维部
    {
      userId: 14,
      username: 'caoli',
      password: 'user123',
      nickname: '操礼',
      email: 'caoli@yunshu.com',
      phone: '13800138013',
      sex: '0' as const,
      avatar: '',
      status: '0' as const,
      deptId: 109,
      postId: [5],
      roleId: [6],
      loginIp: '192.168.1.111',
      loginDate: '2024-01-27 10:00:00',
      createTime: '2024-01-25 10:00:00',
      remark: '运维工程师'
    },
    // 停用状态用户
    {
      userId: 99,
      username: 'disabled_user',
      password: 'user123',
      nickname: '已停用用户',
      email: 'disabled@yunshu.com',
      phone: '13999999999',
      sex: '0' as const,
      avatar: '',
      status: '1' as const,
      deptId: 103,
      postId: [7],
      roleId: [5],
      loginIp: '',
      loginDate: '',
      createTime: '2024-01-01 10:00:00',
      remark: '已停用'
    }
  ] as User[],

  roles: [
    // 超级管理员 - 全部数据权限
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
    // 运维人员 - 自定义数据权限
    {
      roleId: 2,
      roleName: '运维人员',
      roleKey: 'operator',
      roleSort: 2,
      dataScope: '2' as const,
      menuCheckStrictly: true,
      deptCheckStrictly: false,
      status: '0' as const,
      permissions: [
        'system:user:list', 'system:user:query', 'system:user:add', 'system:user:edit', 'system:user:remove',
        'system:role:list', 'system:role:query', 'system:role:add', 'system:role:edit', 'system:role:remove',
        'system:menu:list', 'system:menu:query',
        'system:dept:list', 'system:dept:query',
        'system:post:list', 'system:post:query',
        'monitor:server:view', 'monitor:server:list',
        'monitor:job:list', 'monitor:job:query', 'monitor:job:add', 'monitor:job:edit', 'monitor:job:remove', 'monitor:job:execute'
      ],
      remark: '系统运维角色，负责系统日常维护',
      createTime: '2024-01-05 10:00:00'
    },
    // 开发人员 - 本部门及以下数据权限
    {
      roleId: 3,
      roleName: '开发人员',
      roleKey: 'developer',
      roleSort: 3,
      dataScope: '4' as const,
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      status: '0' as const,
      permissions: [
        'system:user:list', 'system:user:query',
        'system:role:list', 'system:role:query',
        'system:menu:list', 'system:menu:query',
        'system:dept:list', 'system:dept:query',
        'tool:gen:list', 'tool:gen:query', 'tool:gen:add', 'tool:gen:edit', 'tool:gen:remove'
      ],
      remark: '研发人员，可进行代码生成',
      createTime: '2024-01-08 10:00:00'
    },
    // 普通用户 - 本部门数据权限
    {
      roleId: 4,
      roleName: '普通用户',
      roleKey: 'user',
      roleSort: 4,
      dataScope: '5' as const,
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      status: '0' as const,
      permissions: [
        'system:user:list', 'system:user:query',
        'system:role:list', 'system:role:query',
        'system:menu:list', 'system:menu:query'
      ],
      remark: '普通用户角色，仅可查看基础信息',
      createTime: '2024-01-08 10:00:00'
    },
    // 部门主管 - 本部门及以下数据权限
    {
      roleId: 5,
      roleName: '部门主管',
      roleKey: 'dept_manager',
      roleSort: 5,
      dataScope: '4' as const,
      menuCheckStrictly: true,
      deptCheckStrictly: false,
      status: '0' as const,
      permissions: [
        'system:user:list', 'system:user:query', 'system:user:add', 'system:user:edit',
        'system:role:list', 'system:role:query',
        'system:menu:list', 'system:menu:query',
        'system:dept:list', 'system:dept:query',
        'workflow:instance:list', 'workflow:instance:query', 'workflow:instance:start',
        'workflow:task:list', 'workflow:task:query', 'workflow:task:approve'
      ],
      remark: '部门负责人，拥有工作流审批权限',
      createTime: '2024-01-10 10:00:00'
    },
    // 安全审计员 - 全部数据权限（仅查询）
    {
      roleId: 6,
      roleName: '安全审计员',
      roleKey: 'auditor',
      roleSort: 6,
      dataScope: '1' as const,
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      status: '0' as const,
      permissions: [
        'system:user:list', 'system:user:query',
        'system:role:list', 'system:role:query',
        'system:menu:list', 'system:menu:query',
        'system:dept:list', 'system:dept:query',
        'monitor:operlog:list', 'monitor:operlog:query', 'monitor:operlog:export',
        'monitor:logininfor:list', 'monitor:logininfor:query', 'monitor:logininfor:export',
        'monitor:online:list', 'monitor:online:query', 'monitor:server:view'
      ],
      remark: '安全审计角色，可查看所有操作日志和登录日志',
      createTime: '2024-01-12 10:00:00'
    },
    // 数据管理员 - 自定义数据权限
    {
      roleId: 7,
      roleName: '数据管理员',
      roleKey: 'data_admin',
      roleSort: 7,
      dataScope: '2' as const,
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      status: '0' as const,
      permissions: [
        'system:user:list', 'system:user:query',
        'system:role:list', 'system:role:query',
        'system:menu:list', 'system:menu:query',
        'system:dept:list', 'system:dept:query',
        'system:post:list', 'system:post:query',
        'system:dict:list', 'system:dict:query', 'system:dict:add', 'system:dict:edit', 'system:dict:remove',
        'system:config:list', 'system:config:query', 'system:config:add', 'system:config:edit', 'system:config:remove'
      ],
      remark: '数据管理角色，负责字典和配置管理',
      createTime: '2024-01-15 10:00:00'
    },
    // 游客 - 仅首页权限
    {
      roleId: 99,
      roleName: '游客',
      roleKey: 'guest',
      roleSort: 99,
      dataScope: '5' as const,
      menuCheckStrictly: false,
      deptCheckStrictly: false,
      status: '1' as const,
      permissions: [],
      remark: '游客角色，已停用',
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
        // 研发部
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
              leader: '赵六',
              phone: '010-12345681',
              email: 'backend@yunshu.com',
              status: '0' as const,
              createTime: '2024-01-03 10:00:00'
            },
            {
              deptId: 108,
              parentId: 101,
              ancestors: '0,100,101',
              deptName: '测试组',
              leader: '彭安',
              phone: '010-12345688',
              email: 'qa@yunshu.com',
              status: '0' as const,
              createTime: '2024-01-10 10:00:00'
            },
            {
              deptId: 109,
              parentId: 101,
              ancestors: '0,100,101',
              deptName: '运维组',
              leader: '操礼',
              phone: '010-12345689',
              email: 'ops@yunshu.com',
              status: '0' as const,
              createTime: '2024-01-10 10:00:00'
            }
          ]
        },
        // 产品部
        {
          deptId: 102,
          parentId: 100,
          ancestors: '0,100',
          deptName: '产品部',
          leader: '吴九',
          phone: '010-12345682',
          email: 'product@yunshu.com',
          status: '0' as const,
          createTime: '2024-01-02 10:00:00'
        },
        // 市场部
        {
          deptId: 103,
          parentId: 100,
          ancestors: '0,100',
          deptName: '市场部',
          leader: '曹十二',
          phone: '010-12345683',
          email: 'market@yunshu.com',
          status: '1' as const,
          createTime: '2024-01-02 10:00:00'
        },
        // 财务部
        {
          deptId: 106,
          parentId: 100,
          ancestors: '0,100',
          deptName: '财务部',
          leader: '邓十三',
          phone: '010-12345686',
          email: 'finance@yunshu.com',
          status: '0' as const,
          createTime: '2024-01-05 10:00:00'
        },
        // 人力资源部
        {
          deptId: 107,
          parentId: 100,
          ancestors: '0,100',
          deptName: '人力资源部',
          leader: '曹天下',
          phone: '010-12345687',
          email: 'hr@yunshu.com',
          status: '0' as const,
          createTime: '2024-01-05 10:00:00'
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
    { postId: 1, postCode: 'CEO', postName: '首席执行官', postSort: 1, status: '0' as const, remark: '公司最高管理者', createTime: '2024-01-01 10:00:00' },
    { postId: 2, postCode: 'DEV_LEADER', postName: '研发组长', postSort: 2, status: '0' as const, remark: '研发团队负责人', createTime: '2024-01-01 10:00:00' },
    { postId: 3, postCode: 'DEV', postName: '开发工程师', postSort: 3, status: '0' as const, remark: '开发人员', createTime: '2024-01-01 10:00:00' },
    { postId: 4, postCode: 'TEST', postName: '测试工程师', postSort: 4, status: '0' as const, remark: '测试人员', createTime: '2024-01-01 10:00:00' },
    { postId: 5, postCode: 'OP', postName: '运维工程师', postSort: 5, status: '0' as const, remark: '运维人员', createTime: '2024-01-01 10:00:00' },
    { postId: 6, postCode: 'PM', postName: '产品经理', postSort: 6, status: '0' as const, remark: '产品规划与设计', createTime: '2024-01-01 10:00:00' },
    { postId: 7, postCode: 'MARKET', postName: '市场经理', postSort: 7, status: '1' as const, remark: '市场营销', createTime: '2024-01-01 10:00:00' },
    { postId: 8, postCode: 'FINANCE', postName: '财务经理', postSort: 8, status: '0' as const, remark: '财务管理', createTime: '2024-01-01 10:00:00' },
    { postId: 9, postCode: 'HR', postName: '人事经理', postSort: 9, status: '0' as const, remark: '人力资源管理', createTime: '2024-01-01 10:00:00' }
  ] as Post[],

  operlogs: [] as Operlog[],
  logininfors: [] as Logininfor[],
  onlineUsers: [] as OnlineUser[],

  jobs: [
    { jobId: '1', jobName: '数据备份', jobGroup: 'system', invokeTarget: 'backupTask', cronExpression: '0 0 2 * * ?', misfirePolicy: '0', concurrent: '0', status: '0', createTime: '2024-01-01 10:00:00', nextValidTime: '2024-02-01 02:00:00', runCount: 365, remark: '每日凌晨2点执行数据备份' },
    { jobId: '2', jobName: '日志清理', jobGroup: 'system', invokeTarget: 'cleanLogTask', cronExpression: '0 0 3 * * ?', misfirePolicy: '0', concurrent: '0', status: '0', createTime: '2024-01-01 10:00:00', nextValidTime: '2024-02-01 03:00:00', runCount: 180, remark: '每日凌晨3点清理30天前的日志' },
    { jobId: '3', jobName: '缓存刷新', jobGroup: 'default', invokeTarget: 'refreshCacheTask', cronExpression: '0 */10 * * * ?', misfirePolicy: '1', concurrent: '1', status: '0', createTime: '2024-01-05 10:00:00', nextValidTime: '2024-01-20 10:00:00', runCount: 5000, remark: '每10分钟刷新一次缓存' },
    { jobId: '4', jobName: '报表生成', jobGroup: 'custom', invokeTarget: 'generateReportTask', cronExpression: '0 0 8 * * ?', misfirePolicy: '0', concurrent: '0', status: '1', createTime: '2024-01-10 10:00:00', nextValidTime: '-', remark: '每天早上8点生成报表（已暂停）' },
    { jobId: '5', jobName: '库存预警检查', jobGroup: 'custom', invokeTarget: 'inventoryAlertTask', cronExpression: '0 0 9 * * ?', misfirePolicy: '0', concurrent: '0', status: '0', createTime: '2024-01-15 10:00:00', nextValidTime: '2024-02-01 09:00:00', runCount: 45, remark: '每日早上9点检查库存预警' },
    { jobId: '6', jobName: '订单超时处理', jobGroup: 'default', invokeTarget: 'orderTimeoutTask', cronExpression: '0 */30 * * * ?', misfirePolicy: '1', concurrent: '1', status: '0', createTime: '2024-01-18 10:00:00', nextValidTime: '2024-01-20 10:00:00', runCount: 2880, remark: '每30分钟处理超时订单' },
    { jobId: '7', jobName: '会员积分结算', jobGroup: 'custom', invokeTarget: 'memberPointSettleTask', cronExpression: '0 0 0 1 * ?', misfirePolicy: '0', concurrent: '0', status: '0', createTime: '2024-01-20 10:00:00', nextValidTime: '2024-02-01 00:00:00', runCount: 5, remark: '每月1日凌晨结算会员积分' },
    { jobId: '8', jobName: '数据同步', jobGroup: 'system', invokeTarget: 'dataSyncTask', cronExpression: '0 0 */2 * * ?', misfirePolicy: '0', concurrent: '0', status: '2', createTime: '2024-01-22 10:00:00', nextValidTime: '-', remark: '每2小时同步数据（已禁用）' }
  ] as Job[],

  jobLogs: [] as JobLog[],

  genTables: [
    { tableName: 'sys_user', tableComment: '用户表', tableSchema: 'yunshu', engine: 'InnoDB', createTime: '2024-01-01 10:00:00' },
    { tableName: 'sys_role', tableComment: '角色表', tableSchema: 'yunshu', engine: 'InnoDB', createTime: '2024-01-01 10:00:00' },
    { tableName: 'sys_menu', tableComment: '菜单表', tableSchema: 'yunshu', engine: 'InnoDB', createTime: '2024-01-01 10:00:00' },
    { tableName: 'sys_dept', tableComment: '部门表', tableSchema: 'yunshu', engine: 'InnoDB', createTime: '2024-01-01 10:00:00' },
    { tableName: 'sys_post', tableComment: '岗位表', tableSchema: 'yunshu', engine: 'InnoDB', createTime: '2024-01-01 10:00:00' }
  ] as GenTable[],

  messages: [] as Message[],
  notifications: [] as Notification[],

  forms: [
    {
      formId: 1,
      formName: '员工入职申请表',
      formCode: 'EMPLOYEE_ENTRY',
      description: '用于员工入职时填写基本信息',
      status: '1' as const,
      createTime: '2024-01-15 10:30:00',
      updateTime: '2024-01-15 10:30:00',
      remark: '',
      components: [
        { id: '1', type: 'input', label: '姓名', field: 'name', placeholder: '请输入姓名', required: true, disabled: false, rules: [] },
        { id: '2', type: 'select', label: '部门', field: 'dept', placeholder: '请选择部门', required: true, disabled: false, options: [{ label: '技术部', value: 'tech' }, { label: '产品部', value: 'product' }, { label: '设计部', value: 'design' }, { label: '市场部', value: 'market' }] },
        { id: '3', type: 'date', label: '入职日期', field: 'entryDate', placeholder: '请选择入职日期', required: true, disabled: false },
        { id: '4', type: 'input', label: '联系电话', field: 'phone', placeholder: '请输入联系电话', required: true, disabled: false, rules: ['phone'] },
        { id: '5', type: 'textarea', label: '备注', field: 'remark', placeholder: '请输入备注信息', required: false, disabled: false }
      ]
    },
    {
      formId: 2,
      formName: '请假申请表',
      formCode: 'LEAVE_APPLICATION',
      description: '用于员工请假申请',
      status: '1' as const,
      createTime: '2024-01-20 14:00:00',
      updateTime: '2024-01-20 14:00:00',
      remark: '',
      components: [
        { id: '1', type: 'select', label: '请假类型', field: 'leaveType', placeholder: '请选择请假类型', required: true, disabled: false, options: [{ label: '事假', value: 'personal' }, { label: '病假', value: 'sick' }, { label: '年假', value: 'annual' }, { label: '婚假', value: 'marriage' }] },
        { id: '2', type: 'datetime', label: '开始时间', field: 'startTime', placeholder: '请选择开始时间', required: true, disabled: false },
        { id: '3', type: 'datetime', label: '结束时间', field: 'endTime', placeholder: '请选择结束时间', required: true, disabled: false },
        { id: '4', type: 'textarea', label: '请假理由', field: 'reason', placeholder: '请输入请假理由', required: true, disabled: false }
      ]
    },
    {
      formId: 3,
      formName: '报销申请表',
      formCode: 'EXPENSE_APPLICATION',
      description: '用于员工费用报销申请',
      status: '0' as const,
      createTime: '2024-01-25 09:00:00',
      updateTime: '2024-01-25 09:00:00',
      remark: '草稿状态',
      components: [
        { id: '1', type: 'input', label: '报销事由', field: 'reason', placeholder: '请输入报销事由', required: true, disabled: false },
        { id: '2', type: 'number', label: '报销金额', field: 'amount', placeholder: '请输入报销金额', required: true, disabled: false, min: 0.01, step: 0.01 },
        { id: '3', type: 'date', label: '消费日期', field: 'expenseDate', placeholder: '请选择消费日期', required: true, disabled: false },
        { id: '4', type: 'upload', label: '上传凭证', field: 'voucher', placeholder: '', required: true, disabled: false, accept: 'image/*', maxCount: 5 },
        { id: '5', type: 'textarea', label: '备注', field: 'remark', placeholder: '请输入备注信息', required: false, disabled: false }
      ]
    }
  ] as Form[],

  // 工作流定义
  workflowDefinitions: [
    { definitionId: 'WF001', definitionKey: 'leave_approval', definitionName: '请假审批流程', version: 1, category: '行政审批', description: '员工请假申请及审批流程', formId: 2, formName: '请假申请表', status: '1', initiator: 'admin', createTime: '2024-01-10 10:00:00', updateTime: '2024-01-10 10:00:00' },
    { definitionId: 'WF002', definitionKey: 'expense_approval', definitionName: '费用报销流程', version: 1, category: '财务审批', description: '员工费用报销申请及审批流程', formId: 3, formName: '报销申请表', status: '1', initiator: 'admin', createTime: '2024-01-12 10:00:00', updateTime: '2024-01-12 10:00:00' },
    { definitionId: 'WF003', definitionKey: 'employee_entry', definitionName: '员工入职流程', version: 2, category: '人力资源', description: '新员工入职办理流程', formId: 1, formName: '员工入职申请表', status: '1', initiator: 'admin', createTime: '2024-01-05 10:00:00', updateTime: '2024-01-18 10:00:00' },
    { definitionId: 'WF004', definitionKey: 'purchase_approval', definitionName: '采购申请流程', version: 1, category: '行政办公', description: '办公用品及设备采购审批流程', status: '1', initiator: 'admin', createTime: '2024-01-15 10:00:00', updateTime: '2024-01-15 10:00:00' },
    { definitionId: 'WF005', definitionKey: 'overtime_approval', definitionName: '加班申请流程', version: 1, category: '行政管理', description: '员工加班申请及审批流程', status: '0', initiator: 'admin', createTime: '2024-01-20 10:00:00', updateTime: '2024-01-20 10:00:00' }
  ] as WorkflowDefinition[],

  // 工作流实例
  workflowInstances: [
    { instanceId: 'INS001', definitionId: 'WF001', definitionName: '请假审批流程', businessKey: 'LEAVE20240115001', currentNode: 'node_approve', currentNodeName: '部门经理审批', status: 'running', initiator: 'zhangsan', initiatorName: '张三', createTime: '2024-01-15 09:00:00', updateTime: '2024-01-15 14:30:00' },
    { instanceId: 'INS002', definitionId: 'WF001', definitionName: '请假审批流程', businessKey: 'LEAVE20240116001', currentNode: 'node_end', currentNodeName: '流程结束', status: 'completed', initiator: 'lisi', initiatorName: '李四', createTime: '2024-01-16 08:00:00', updateTime: '2024-01-16 10:30:00', endTime: '2024-01-16 10:30:00' },
    { instanceId: 'INS003', definitionId: 'WF002', definitionName: '费用报销流程', businessKey: 'EXPENSE20240117001', currentNode: 'node_finance', currentNodeName: '财务审批', status: 'running', initiator: 'wangwu', initiatorName: '王五', createTime: '2024-01-17 11:00:00', updateTime: '2024-01-18 09:00:00' },
    { instanceId: 'INS004', definitionId: 'WF003', definitionName: '员工入职流程', businessKey: 'ENTRY20240118001', currentNode: 'node_hr', currentNodeName: 'HR办理', status: 'running', initiator: 'admin', initiatorName: '管理员', createTime: '2024-01-18 14:00:00', updateTime: '2024-01-19 10:00:00' },
    { instanceId: 'INS005', definitionId: 'WF001', definitionName: '请假审批流程', businessKey: 'LEAVE20240119001', currentNode: 'node_start', currentNodeName: '申请', status: 'rejected', initiator: 'sunqi', initiatorName: '孙七', createTime: '2024-01-19 08:30:00', updateTime: '2024-01-19 15:00:00' }
  ] as WorkflowInstance[],

  // 工作流任务
  workflowTasks: [
    { taskId: 'TASK001', instanceId: 'INS001', definitionName: '请假审批流程', taskName: '部门经理审批', taskKey: 'node_approve', assignee: 'wujiu', assigneeName: '吴九', priority: 50, status: 'in_progress', createTime: '2024-01-15 09:00:00', variables: { days: 3, leaveType: '年假' } },
    { taskId: 'TASK002', instanceId: 'INS003', definitionName: '费用报销流程', taskName: '财务审批', taskKey: 'node_finance', assignee: 'dengshisan', assigneeName: '邓十三', priority: 30, status: 'pending', createTime: '2024-01-17 11:00:00', variables: { amount: 1500, category: '办公用品' } },
    { taskId: 'TASK003', instanceId: 'INS004', definitionName: '员工入职流程', taskName: 'HR办理', taskKey: 'node_hr', assignee: 'caotianxia', assigneeName: '曹天下', priority: 80, dueDate: '2024-01-20 18:00:00', status: 'pending', createTime: '2024-01-18 14:00:00', variables: { employeeName: '新员工', deptId: 104 } },
    { taskId: 'TASK004', instanceId: 'INS001', definitionName: '请假审批流程', taskName: 'HR备案', taskKey: 'node_hr_record', candidateGroups: ['HR'], priority: 20, status: 'pending', createTime: '2024-01-15 09:00:00' }
  ] as WorkflowTask[],

  // 工作流历史
  workflowHistories: [
    { historyId: 'HIST001', instanceId: 'INS001', taskId: 'TASK001', taskName: '提交申请', nodeName: '发起人', action: 'submit', operator: 'zhangsan', operatorName: '张三', comment: '因私事需要请假3天', createTime: '2024-01-15 09:00:00' },
    { historyId: 'HIST002', instanceId: 'INS001', taskId: 'TASK001', taskName: '部门经理审批', nodeName: '部门经理', action: 'approve', operator: 'wujiu', operatorName: '吴九', comment: '同意', createTime: '2024-01-15 14:30:00', duration: 19800000 },
    { historyId: 'HIST003', instanceId: 'INS002', taskId: undefined, taskName: '提交申请', nodeName: '发起人', action: 'submit', operator: 'lisi', operatorName: '李四', comment: '请年假2天', createTime: '2024-01-16 08:00:00' },
    { historyId: 'HIST004', instanceId: 'INS002', taskId: undefined, taskName: '部门经理审批', nodeName: '部门经理', action: 'approve', operator: 'wujiu', operatorName: '吴九', comment: '批准', createTime: '2024-01-16 09:00:00', duration: 3600000 },
    { historyId: 'HIST005', instanceId: 'INS002', taskId: undefined, taskName: 'HR备案', nodeName: 'HR', action: 'approve', operator: 'caotianxia', operatorName: '曹天下', comment: '已登记', createTime: '2024-01-16 10:00:00', duration: 3600000 },
    { historyId: 'HIST006', instanceId: 'INS005', taskId: undefined, taskName: '提交申请', nodeName: '发起人', action: 'submit', operator: 'sunqi', operatorName: '孙七', comment: '申请加班调休', createTime: '2024-01-19 08:30:00' },
    { historyId: 'HIST007', instanceId: 'INS005', taskId: undefined, taskName: '部门经理审批', nodeName: '部门经理', action: 'reject', operator: 'zhaoliu', operatorName: '赵六', comment: '项目紧张，暂不批准', createTime: '2024-01-19 15:00:00', duration: 23400000 }
  ] as WorkflowHistory[]
}

/** ==================== 初始化函数 ==================== */

// 初始化消息数据
function initMessages() {
  const messageTypes = ['system', 'normal', 'reminder'] as const
  const priorities = ['high', 'medium', 'low'] as const
  const titles = [
    '【重要】系统升级通知',
    '【紧急】账号安全提醒',
    '任务提醒：您有新的待办事项',
    '会议通知：项目进度会议',
    '系统公告：本周值班安排',
    '审批提醒：您有一笔报销待审批',
    '生日祝福：祝您生日快乐',
    '假期提醒：明日开始休假',
    '安全通知：密码强度升级要求',
    '版本更新：新功能上线公告'
  ]
  const contents = [
    '系统将于本周末进行升级维护，请提前保存好您的工作数据。升级期间系统将无法使用，给您带来的不便敬请谅解。',
    '检测到您的账号存在安全风险，请立即修改密码并启用双因素认证。',
    '您有新的待办事项需要处理，请尽快完成相关工作。任务截止时间为本周五下午6点。',
    '本周三下午3点将在会议室A召开项目进度会议，请相关人员准时参加。',
    '本周值班表已更新，请各位同事查看并按时交接。值班期间如有问题请联系值班经理。',
    '您有一笔1500元的办公用品报销单待审批，请尽快处理。',
    '今天是您的生日，公司全体同事祝您生日快乐，工作顺利！',
    '您的调休申请已批准，明日起开始休假，祝您假期愉快！',
    '为提升账号安全，系统要求所有用户将密码强度升级至中等以上。',
    '本次更新新增了工作流管理、数据可视化等功能，欢迎体验。'
  ]

  for (let i = 1; i <= 50; i++) {
    const type = messageTypes[Math.floor(Math.random() * messageTypes.length)]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    const status = Math.random() > 0.3 ? '0' : '1'
    const titleIndex = (i - 1) % titles.length
    const senderIndex = Math.floor(Math.random() * 5)
    const receivers = ['张三', '李四', '王五', '赵六', '孙七', '吴九', '郑十', '曹十二', '邓十三', '曹天下', '彭安', '操礼', '管理员']
    const senders = ['管理员', '系统', 'HR系统', '财务系统', '安保系统']
    const sendTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)

    db.messages.push({
      messageId: i,
      title: titles[titleIndex],
      content: contents[titleIndex],
      type,
      priority,
      status,
      senderId: senderIndex + 1,
      senderName: senders[senderIndex],
      receiverId: (i % 14) + 1,
      receiverName: receivers[i % 13],
      sendTime: sendTime.toISOString().replace('T', ' ').slice(0, 19),
      readTime: status === '1' ? new Date(sendTime.getTime() + Math.random() * 2 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19) : undefined
    })
  }
}

// 初始化通知数据
function initNotifications() {
  const types = ['公告', '通知', '提醒', '警告']
  const levels = ['info', 'warning', 'danger', 'success']
  const targetTypes = ['all', 'role', 'dept', 'user']
  const titles = [
    '系统升级公告',
    '新功能上线通知',
    '安全提醒',
    '版本更新通知',
    '数据迁移公告',
    '密码策略更新',
    '网络维护通知',
    '账号安全提醒',
    '会议通知',
    '假期安排通知',
    '绩效评定通知',
    '培训通知'
  ]
  const contents = [
    '为提升用户体验，系统将于近期进行升级，新增多项功能，欢迎体验。',
    '消息通知中心已上线，支持站内消息、邮件、短信等多种通知方式。',
    '请妥善保管您的账号密码，定期更换，避免账号泄露。',
    '新版本已发布，包含性能优化和bug修复，请及时更新。',
    '为优化系统性能，数据迁移将于本周日凌晨2点进行，预计持续4小时。',
    '系统密码策略已更新：密码长度至少8位，必须包含大小写字母和数字。',
    '核心网络设备将于本周六进行维护，预计中断服务2小时。',
    '检测到异常登录行为，请确认是否为本人操作，如非本人请及时修改密码。',
    '下周一上午9点将召开季度总结会议，请相关部门准备汇报材料。',
    '春节期间放假安排已公布，请各位同事提前做好工作安排。',
    '本年度绩效评定工作已启动，请各部门于本月底前完成自评。',
    '新员工入职培训将于下周三举行，请报名同事准时参加。'
  ]

  for (let i = 1; i <= 30; i++) {
    const titleIndex = (i - 1) % titles.length
    const level = levels[Math.floor(Math.random() * levels.length)]
    const status = Math.random() > 0.3 ? '0' : '1'
    const createTime = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)

    db.notifications.push({
      notificationId: i,
      title: titles[titleIndex],
      content: contents[titleIndex],
      type: types[Math.floor(Math.random() * types.length)],
      level,
      status,
      targetType: targetTypes[Math.floor(Math.random() * targetTypes.length)],
      isPushed: Math.random() > 0.2,
      pushTime: Math.random() > 0.2 ? new Date(createTime.getTime() + Math.random() * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19) : undefined,
      expireTime: new Date(createTime.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
      createBy: 'admin',
      createTime: createTime.toISOString().replace('T', ' ').slice(0, 19),
      updateTime: status === '1' ? new Date(createTime.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19) : undefined
    })
  }
}

// 初始化操作日志数据
function initOperlogs() {
  const modules = ['用户管理', '角色管理', '菜单管理', '部门管理', '岗位管理', '系统监控', '代码生成', '字典管理', '参数设置', '通知管理']
  const operTypes = ['查询', '新增', '修改', '删除', '导出', '导入', '授权', '其他'] as const
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  const systems = ['Windows 10', 'Windows 11', 'macOS', 'Linux', 'Ubuntu', 'iOS', 'Android']
  const users = ['admin', 'zhangsan', 'lisi', 'wangwu', 'zhaoliu', 'sunqi', 'wujiu', 'caotianxia', 'pengan']

  for (let i = 1; i <= 100; i++) {
    const operType = operTypes[Math.floor(Math.random() * operTypes.length)]
    const module = modules[Math.floor(Math.random() * modules.length)]
    const user = users[Math.floor(Math.random() * users.length)]
    const status = Math.random() > 0.05 ? '0' : '1'
    const costTime = Math.floor(Math.random() * 5000) + 50

    db.operlogs.push({
      operId: String(i),
      operName: user,
      operTime: randomDateTime(60),
      operType,
      operModule: module,
      status,
      requestMethod: methods[Math.floor(Math.random() * methods.length)],
      operUrl: `/api/${module === '用户管理' ? 'system/user' : module === '角色管理' ? 'system/role' : module === '菜单管理' ? 'system/menu' : module === '部门管理' ? 'system/dept' : module === '岗位管理' ? 'system/post' : module === '系统监控' ? 'monitor/server' : module === '代码生成' ? 'tool/gen' : module === '字典管理' ? 'system/dict' : module === '参数设置' ? 'system/config' : 'system/notification'}/${operType === '查询' ? 'list' : operType === '新增' ? 'add' : operType === '删除' ? 'remove' : operType === '导出' ? 'export' : operType === '导入' ? 'import' : operType === '授权' ? 'auth' : 'edit'}`,
      operIp: randomIP(),
      operSystem: systems[Math.floor(Math.random() * systems.length)],
      browser: randomBrowser(),
      costTime,
      operLocation: randomCity(),
      operParam: JSON.stringify({ id: Math.floor(Math.random() * 100), keyword: `keyword${i}` }),
      jsonResult: JSON.stringify(status === '0' ? { code: 200, msg: '操作成功' } : { code: 500, msg: '操作失败' }),
      createTime: randomDateTime(60)
    })
  }
}

// 初始化登录日志数据
function initLogininfors() {
  const users = ['admin', 'zhangsan', 'lisi', 'wangwu', 'zhaoliu', 'sunqi', 'wujiu', 'caotianxia', 'pengan', 'disabled_user']
  const operations = ['登录', '登出', '注册', '修改密码', '找回密码'] as const
  const errorMsgs = ['密码错误', '账号已停用', '账号不存在', 'IP限制访问', '验证码错误', '密码已过期']

  for (let i = 1; i <= 200; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const operation = i % 5 === 0 ? '登出' : i % 20 === 0 ? '修改密码' : i % 30 === 0 ? '注册' : i % 40 === 0 ? '找回密码' : '登录'
    const status = operation === '登出' || operation === '注册' ? '0' : Math.random() > 0.1 ? '0' : '1'
    const msg = status === '0' ? `${operation}成功` : operation === '登录' ? `${operation}失败：${errorMsgs[Math.floor(Math.random() * errorMsgs.length)]}` : `${operation}失败`

    db.logininfors.push({
      infoId: String(i),
      userName: user,
      loginAccount: user,
      status,
      loginLocation: randomCity(),
      operationType: operation,
      os: randomOS(),
      browser: randomBrowser(),
      loginTime: randomDateTime(90),
      msg,
      ip: randomIP(),
      createTime: randomDateTime(90)
    })
  }
}

// 初始化在线用户数据
function initOnlineUsers() {
  const users = [
    { userName: 'admin', loginAccount: 'admin', deptName: '云枢科技' },
    { userName: 'zhangsan', loginAccount: 'zhangsan', deptName: '前端组' },
    { userName: 'lisi', loginAccount: 'lisi', deptName: '前端组' },
    { userName: 'wangwu', loginAccount: 'wangwu', deptName: '前端组' },
    { userName: 'zhaoliu', loginAccount: 'zhaoliu', deptName: '后端组' },
    { userName: 'sunqi', loginAccount: 'sunqi', deptName: '后端组' },
    { userName: 'wujiu', loginAccount: 'wujiu', deptName: '产品部' },
    { userName: 'caotianxia', loginAccount: 'caotianxia', deptName: '人力资源部' }
  ]

  for (let i = 0; i < 15; i++) {
    const user = users[i % users.length]
    const loginTime = new Date(Date.now() - Math.random() * 120 * 60 * 1000)

    db.onlineUsers.push({
      sessionId: `session_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      userName: user.userName,
      loginAccount: user.loginAccount,
      deptName: user.deptName,
      browser: randomBrowser(),
      os: randomOS(),
      ip: randomIP(),
      loginTime: loginTime.toISOString().replace('T', ' ').slice(0, 19),
      lastAccessTime: new Date(Date.now() - Math.random() * 30 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
      expireTime: new Date(loginTime.getTime() + 30 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
      userId: String((i % 8) + 1)
    })
  }
}

// 初始化任务日志数据
function initJobLogs() {
  const jobs = db.jobs.filter(j => j.status === '0')

  for (let i = 1; i <= 50; i++) {
    const job = jobs[Math.floor(Math.random() * jobs.length)]
    const status = Math.random() > 0.1 ? '0' : '1'
    const executeTime = randomDateTime(30)
    const costTime = Math.floor(Math.random() * 10000) + 500

    db.jobLogs.push({
      logId: String(i),
      jobId: job.jobId,
      jobName: job.jobName,
      jobGroup: job.jobGroup,
      invokeTarget: job.invokeTarget,
      status,
      executeTime,
      costTime,
      message: status === '0' ? '执行成功' : '执行失败',
      error: status === '1' ? ['NullPointerException', 'Connection timeout', 'SQLException', 'BusinessException'][Math.floor(Math.random() * 4)] + ': null' : undefined,
      createTime: executeTime
    })
  }
}

// 执行初始化
initMessages()
initNotifications()
initOperlogs()
initLogininfors()
initOnlineUsers()
initJobLogs()

export type { User, Role, Dept, Menu, Post, Operlog, Logininfor, OnlineUser, Job, JobLog, GenTable, Message, Notification, Form, FormComponent, WorkflowDefinition, WorkflowInstance, WorkflowTask, WorkflowHistory }

/**
 * Mock 服务入口文件
 * @module mock
 * 
 * 此文件用于统一导出所有 Mock API
 * 并提供 setupMockServer 函数用于初始化 Mock 服务
 */

import { MockMethod } from 'vite-plugin-mock'

// 导入所有 Mock API
import authLogin from './routes/auth/login'
import systemUser from './routes/system/user'
import systemRole from './routes/system/role'
import systemMenu from './routes/system/menu'
import systemDept from './routes/system/dept'
import systemPost from './routes/system/post'
import systemMessage from './routes/system/message'
import systemNotification from './routes/system/notification'
import systemNotice from './routes/system/notice'
import systemDict from './routes/system/dict'
import systemSso from './routes/system/sso'
import systemSms from './routes/system/sms'
import systemThird from './routes/system/third'
import monitorOperlog from './routes/monitor/operlog'
import monitorLogininfor from './routes/monitor/logininfor'
import monitorOnline from './routes/monitor/online'
import monitorServer from './routes/monitor/server'
import monitorJob from './routes/monitor/job'
import toolGen from './routes/tool/gen'
import reportReport from './routes/report/report'
import dashboardDashboard from './routes/dashboard/dashboard'
import adminDashboard from './routes/admin-dashboard/admin-dashboard'
import systemForm from './routes/system/form'
import workflow from './routes/workflow'
import tenantTenant from './routes/tenant/tenant'

/**
 * 合并所有 Mock API
 */
const mockPlugins: MockMethod[] = [
  ...authLogin,
  ...systemUser,
  ...systemRole,
  ...systemMenu,
  ...systemDept,
  ...systemPost,
  ...systemMessage,
  ...systemNotification,
  ...systemNotice,
  ...systemDict,
  ...systemSso,
  ...systemSms,
  ...systemThird,
  ...monitorOperlog,
  ...monitorLogininfor,
  ...monitorOnline,
  ...monitorServer,
  ...monitorJob,
  ...toolGen,
  ...reportReport,
  ...dashboardDashboard,
  ...adminDashboard,
  ...systemForm,
  ...workflow,
  ...tenantTenant
]

/**
 * 初始化 Mock 服务（用于注入到 Vite 开发服务器）
 */
export function setupMockServer() {
  return mockPlugins
}

/**
 * 默认导出所有 Mock API
 */
export default mockPlugins

/**
 * 云枢中台 — 路由注册系统
 *
 * 自动扫描各模块并注册路由，集中管理路由前缀与中间件。
 * 路由与实际控制器方法一一对应。
 *
 * @module @yunshu/server-express/routes
 */

import { Router, type Request, type Response } from 'express';
import { asyncHandler } from './middlewares/errorHandler';

// ============================================================================
// 模块路由导入
// ============================================================================

import * as monitor from './modules/monitor';
import * as gen from './modules/gen';
import * as tenant from './modules/tenant';
import * as system from './modules/system';
import * as sms from './modules/sms';
import * as sso from './modules/sso';
import * as third from './modules/third';

// ============================================================================
// 路由注册表
// ============================================================================

/**
 * 注册所有路由
 *
 * @param router Express Router 实例
 */
export function registerRoutes(router: Router): void {
  // --------------------------------------------------------------------------
  // 健康检查
  // --------------------------------------------------------------------------
  router.get('/health', asyncHandler(async (_req, res) => {
    res.status(200).json({
      success: true,
      status: 'UP',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
    });
  }));

  // --------------------------------------------------------------------------
  // 监控模块 /monitor
  // --------------------------------------------------------------------------
  const monitorRouter = Router();

  // ServerController
  monitorRouter.get('/server/info', asyncHandler(monitor.serverController.getServerInfo));
  monitorRouter.get('/server/cpu', asyncHandler(monitor.serverController.getCpuInfo));
  monitorRouter.get('/server/memory', asyncHandler(monitor.serverController.getMemoryInfo));
  monitorRouter.get('/server/disk', asyncHandler(monitor.serverController.getDiskInfo));
  monitorRouter.get('/server/jvm', asyncHandler(monitor.serverController.getJvmInfo));

  // JobController
  monitorRouter.get('/job/list', asyncHandler(monitor.jobController.getList));
  monitorRouter.get('/job/:jobId', asyncHandler(monitor.jobController.getDetail));
  monitorRouter.post('/job', asyncHandler(monitor.jobController.create));
  monitorRouter.put('/job', asyncHandler(monitor.jobController.update));
  monitorRouter.delete('/job/:jobId', asyncHandler(monitor.jobController.remove));
  monitorRouter.put('/job/:jobId/run', asyncHandler(monitor.jobController.run));
  monitorRouter.put('/job/:jobId/status', asyncHandler(monitor.jobController.changeStatus));
  monitorRouter.get('/job/log/list', asyncHandler(monitor.jobController.getLogList));
  monitorRouter.delete('/job/log/:jobLogId', asyncHandler(monitor.jobController.deleteLog));
  monitorRouter.delete('/job/log/clean', asyncHandler(monitor.jobController.cleanLog));

  // OperlogController
  monitorRouter.get('/operlog/list', asyncHandler(monitor.operlogController.getList));
  monitorRouter.delete('/operlog/:operId', asyncHandler(monitor.operlogController.remove));
  monitorRouter.delete('/operlog/clean', asyncHandler(monitor.operlogController.clean));

  // LogininforController (导出名 loginlogController)
  monitorRouter.get('/logininfor/list', asyncHandler(monitor.loginlogController.list));
  monitorRouter.delete('/logininfor/:infoId', asyncHandler(monitor.loginlogController.remove));
  monitorRouter.delete('/logininfor/clean', asyncHandler(monitor.loginlogController.clean));

  // OnlineController
  monitorRouter.get('/online/list', asyncHandler(monitor.onlineController.getList));
  monitorRouter.delete('/online/:tokenId', asyncHandler(monitor.onlineController.forceLogout));

  router.use('/monitor', monitorRouter);

  // --------------------------------------------------------------------------
  // 代码生成模块 /tool/gen
  // --------------------------------------------------------------------------
  const genRouter = Router();

  genRouter.get('/list', asyncHandler(gen.genController.getTablePage));
  genRouter.get('/tables', asyncHandler(gen.genController.getTableList));
  genRouter.get('/:tableName', asyncHandler(gen.genController.getTableDetail));
  genRouter.get('/config/:tableName', asyncHandler(gen.genController.getConfig));
  genRouter.post('/config', asyncHandler(gen.genController.saveConfig));
  genRouter.post('/import/tables', asyncHandler(gen.genController.importTables));
  genRouter.delete('/:tableNames', asyncHandler(gen.genController.deleteTable));
  genRouter.get('/preview/:tableName', asyncHandler(gen.genController.preview));
  genRouter.get('/download/:tableName', asyncHandler(gen.genController.download));
  genRouter.post('/gen/:tableName', asyncHandler(gen.genController.generate));

  router.use('/tool/gen', genRouter);

  // --------------------------------------------------------------------------
  // 租户模块 /tenant
  // --------------------------------------------------------------------------
  const tenantRouter = Router();

  // TenantController
  tenantRouter.get('/list', asyncHandler(tenant.tenantController.getTenantPage));
  tenantRouter.get('/tenant-list', asyncHandler(tenant.tenantController.getTenantList));
  tenantRouter.get('/:tenantId', asyncHandler(tenant.tenantController.getTenantById));
  tenantRouter.post('/', asyncHandler(tenant.tenantController.createTenant));
  tenantRouter.put('/', asyncHandler(tenant.tenantController.updateTenant));
  tenantRouter.delete('/:tenantId', asyncHandler(tenant.tenantController.deleteTenant));
  tenantRouter.put('/:tenantId/status', asyncHandler(tenant.tenantController.changeTenantStatus));

  // TenantPackageController
  tenantRouter.get('/package/list', asyncHandler(tenant.tenantPackageController.getPackagePage));
  tenantRouter.get('/package/package-list', asyncHandler(tenant.tenantPackageController.getPackageList));
  tenantRouter.get('/package/:packageId', asyncHandler(tenant.tenantPackageController.getPackageById));
  tenantRouter.post('/package', asyncHandler(tenant.tenantPackageController.createPackage));
  tenantRouter.put('/package', asyncHandler(tenant.tenantPackageController.updatePackage));
  tenantRouter.delete('/package/:packageId', asyncHandler(tenant.tenantPackageController.deletePackage));

  router.use('/tenant', tenantRouter);

  // --------------------------------------------------------------------------
  // 系统模块 /system
  // --------------------------------------------------------------------------
  const systemRouter = Router();

  // ConfigController
  systemRouter.get('/config/list', asyncHandler(system.configController.list));
  systemRouter.get('/config/:configId', asyncHandler(system.configController.getById));
  systemRouter.get('/config/configKey/:configKey', asyncHandler(system.configController.getByKey));
  systemRouter.post('/config', asyncHandler(system.configController.create));
  systemRouter.put('/config', asyncHandler(system.configController.update));
  systemRouter.delete('/config/:configId', asyncHandler(system.configController.delete));
  systemRouter.delete('/config/refresh-cache', asyncHandler(system.configController.refreshCache));

  // DictController
  systemRouter.get('/dict/type/list', asyncHandler(system.dictController.getTypeList));
  systemRouter.get('/dict/type/:dictId', asyncHandler(system.dictController.getTypeDetail));
  systemRouter.get('/dict/data/list', asyncHandler(system.dictController.getDataList));
  systemRouter.get('/dict/data/:dictCode', asyncHandler(system.dictController.getDataDetail));
  systemRouter.get('/dict/data/type/:dictType', asyncHandler(system.dictController.getDataByType));

  // MenuController
  systemRouter.get('/menu/list', asyncHandler(system.menuController.getList));
  systemRouter.get('/menu/treeselect', asyncHandler(system.menuController.getTreeSelect));
  systemRouter.get('/menu/:menuId', asyncHandler(system.menuController.getDetail));
  systemRouter.post('/menu', asyncHandler(system.menuController.create));
  systemRouter.put('/menu', asyncHandler(system.menuController.update));
  systemRouter.delete('/menu/:menuId', asyncHandler(system.menuController.remove));

  // PostController
  systemRouter.get('/post/list', asyncHandler(system.postController.list));
  systemRouter.get('/post/:postId', asyncHandler(system.postController.getById));
  systemRouter.post('/post', asyncHandler(system.postController.create));
  systemRouter.put('/post', asyncHandler(system.postController.update));
  systemRouter.delete('/post/:postId', asyncHandler(system.postController.delete));

  // NoticeController
  systemRouter.get('/notice/list', asyncHandler(system.noticeController.getList));
  systemRouter.get('/notice/:noticeId', asyncHandler(system.noticeController.getDetail));
  systemRouter.post('/notice', asyncHandler(system.noticeController.create));
  systemRouter.put('/notice', asyncHandler(system.noticeController.update));
  systemRouter.delete('/notice/:noticeId', asyncHandler(system.noticeController.remove));

  // MessageController
  systemRouter.get('/message/list', asyncHandler(system.messageController.list));
  systemRouter.get('/message/:messageId', asyncHandler(system.messageController.getById));
  systemRouter.post('/message', asyncHandler(system.messageController.create));
  systemRouter.put('/message/read', asyncHandler(system.messageController.read));
  systemRouter.delete('/message/:messageId', asyncHandler(system.messageController.delete));

  // FileController
  systemRouter.get('/file/list', asyncHandler(system.fileController.list));
  systemRouter.post('/file/upload', asyncHandler(system.fileController.upload));
  systemRouter.delete('/file/:fileId', asyncHandler(system.fileController.delete));

  // OssController
  systemRouter.get('/oss/list', asyncHandler(system.ossController.getList));
  systemRouter.get('/oss/config/list', asyncHandler(system.ossController.getConfigList));
  systemRouter.post('/oss/upload', asyncHandler(system.ossController.upload));
  systemRouter.delete('/oss/:ossId', asyncHandler(system.ossController.remove));

  router.use('/system', systemRouter);

  // --------------------------------------------------------------------------
  // 短信模块 /sms
  // --------------------------------------------------------------------------
  const smsRouter = Router();

  smsRouter.get('/config/list', asyncHandler(sms.smsController.listConfigs));
  smsRouter.get('/config/:smsConfigId', asyncHandler(sms.smsController.getConfigById));
  smsRouter.get('/config/current', asyncHandler(sms.smsController.getCurrentConfig));
  smsRouter.post('/config', asyncHandler(sms.smsController.createConfig));
  smsRouter.put('/config', asyncHandler(sms.smsController.updateConfig));
  smsRouter.delete('/config/:smsConfigId', asyncHandler(sms.smsController.deleteConfig));
  smsRouter.post('/config/default', asyncHandler(sms.smsController.setDefaultConfig));
  smsRouter.post('/config/test', asyncHandler(sms.smsController.testConnection));
  smsRouter.get('/template/list', asyncHandler(sms.smsController.listTemplates));
  smsRouter.get('/template/:templateId', asyncHandler(sms.smsController.getTemplateById));
  smsRouter.post('/template', asyncHandler(sms.smsController.createTemplate));
  smsRouter.put('/template', asyncHandler(sms.smsController.updateTemplate));
  smsRouter.delete('/template/:templateId', asyncHandler(sms.smsController.deleteTemplate));
  smsRouter.post('/send', asyncHandler(sms.smsController.send));
  smsRouter.post('/batch-send', asyncHandler(sms.smsController.batchSend));
  smsRouter.get('/log/list', asyncHandler(sms.smsController.listLogs));
  smsRouter.get('/log/:smsLogId', asyncHandler(sms.smsController.getLogById));

  router.use('/sms', smsRouter);

  // --------------------------------------------------------------------------
  // SSO 单点登录模块 /sso
  // --------------------------------------------------------------------------
  const ssoRouter = Router();

  ssoRouter.get('/app/list', asyncHandler(sso.ssoController.listApps));
  ssoRouter.get('/app/:ssoConfigId', asyncHandler(sso.ssoController.getAppById));
  ssoRouter.get('/app/enabled', asyncHandler(sso.ssoController.getEnabledApps));
  ssoRouter.post('/app', asyncHandler(sso.ssoController.createApp));
  ssoRouter.put('/app', asyncHandler(sso.ssoController.updateApp));
  ssoRouter.delete('/app/:ssoConfigId', asyncHandler(sso.ssoController.deleteApp));
  ssoRouter.put('/app/:ssoConfigId/status', asyncHandler(sso.ssoController.changeAppStatus));
  ssoRouter.get('/config', asyncHandler(sso.ssoController.getConfig));
  ssoRouter.put('/config', asyncHandler(sso.ssoController.updateConfig));
  ssoRouter.post('/authorize/:provider', asyncHandler(sso.ssoController.getAuthorizeUrl));
  ssoRouter.post('/callback/:provider', asyncHandler(sso.ssoController.handleCallback));
  ssoRouter.post('/userinfo', asyncHandler(sso.ssoController.getUserInfo));
  ssoRouter.post('/refresh-token', asyncHandler(sso.ssoController.refreshToken));
  ssoRouter.post('/logout', asyncHandler(sso.ssoController.logout));

  router.use('/sso', ssoRouter);

  // --------------------------------------------------------------------------
  // 第三方登录模块 /third
  // --------------------------------------------------------------------------
  const thirdRouter = Router();

  thirdRouter.get('/config/list', asyncHandler(third.thirdController.listConfigs));
  thirdRouter.get('/config/:thirdConfigId', asyncHandler(third.thirdController.getConfigById));
  thirdRouter.get('/config/enabled', asyncHandler(third.thirdController.getEnabledConfigs));
  thirdRouter.post('/config', asyncHandler(third.thirdController.createConfig));
  thirdRouter.put('/config', asyncHandler(third.thirdController.updateConfig));
  thirdRouter.delete('/config/:thirdConfigId', asyncHandler(third.thirdController.deleteConfig));
  thirdRouter.put('/config/:thirdConfigId/status', asyncHandler(third.thirdController.changeConfigStatus));
  thirdRouter.post('/authorize/:platform', asyncHandler(third.thirdController.getAuthorizeUrl));
  thirdRouter.post('/callback/:platform', asyncHandler(third.thirdController.handleCallback));
  thirdRouter.post('/bind', asyncHandler(third.thirdController.bindAccount));
  thirdRouter.post('/unbind', asyncHandler(third.thirdController.unbindAccount));
  thirdRouter.get('/binds', asyncHandler(third.thirdController.getUserBinds));
  thirdRouter.get('/log/list', asyncHandler(third.thirdController.listLogs));
  thirdRouter.get('/log/:thirdLogId', asyncHandler(third.thirdController.getLogById));
  thirdRouter.get('/log/stats', asyncHandler(third.thirdController.getLoginStats));

  router.use('/third', thirdRouter);

  // --------------------------------------------------------------------------
  // 根路由信息
  // --------------------------------------------------------------------------
  router.get('/', asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: '云枢中台 API 服务已就绪',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
      endpoints: {
        health: '/health',
        monitor: '/monitor/*',
        tool: '/tool/gen/*',
        tenant: '/tenant/*',
        system: '/system/*',
        sms: '/sms/*',
        sso: '/sso/*',
        third: '/third/*',
      },
    });
  }));
}

/**
 * 创建并返回配置好所有路由的 Express Router
 */
export function createRouter(): Router {
  const router = Router();
  registerRoutes(router);
  return router;
}

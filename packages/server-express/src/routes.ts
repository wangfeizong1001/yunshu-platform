import { Router, type Request, type Response } from 'express';
import { asyncHandler } from './middlewares/errorHandler';
import * as system from './modules/system';
import * as monitor from './modules/monitor';

// ============================================================================
// 路由注册
// ============================================================================

export function registerRoutes(router: Router): void {
  // --------------------------------------------------------------------------
  // 健康检查
  // --------------------------------------------------------------------------
  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      status: 'UP',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
    });
  });

  // --------------------------------------------------------------------------
  // 根信息
  // --------------------------------------------------------------------------
  router.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: '云枢中台 API 服务已就绪',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
      endpoints: {
        health: '/health',
      },
    });
  });

  // --------------------------------------------------------------------------
  // 系统模块
  // --------------------------------------------------------------------------
  const systemRouter = Router();

  // 用户管理
  systemRouter.get('/user/list', asyncHandler(system.userController.list));
  systemRouter.get('/user/:userId', asyncHandler(system.userController.getById));
  systemRouter.post('/user', asyncHandler(system.userController.create));
  systemRouter.put('/user', asyncHandler(system.userController.update));
  systemRouter.delete('/user/:userId', asyncHandler(system.userController.remove));
  systemRouter.delete('/user', asyncHandler(system.userController.batchRemove));
  systemRouter.put('/user/resetPwd', asyncHandler(system.userController.resetPwd));
  systemRouter.put('/user/changeStatus', asyncHandler(system.userController.changeStatus));

  // 角色管理
  systemRouter.get('/role/list', asyncHandler(system.roleController.list));
  systemRouter.get('/role/all', asyncHandler(system.roleController.getAll));
  systemRouter.get('/role/:roleId', asyncHandler(system.roleController.getById));
  systemRouter.post('/role', asyncHandler(system.roleController.create));
  systemRouter.put('/role', asyncHandler(system.roleController.update));
  systemRouter.delete('/role/:roleId', asyncHandler(system.roleController.remove));
  systemRouter.delete('/role', asyncHandler(system.roleController.batchRemove));
  systemRouter.put('/role/changeStatus', asyncHandler(system.roleController.changeStatus));

  // 菜单管理
  systemRouter.get('/menu/list', asyncHandler(system.menuController.list));
  systemRouter.get('/menu/tree', asyncHandler(system.menuController.getTree));
  systemRouter.get('/menu/:menuId', asyncHandler(system.menuController.getById));
  systemRouter.post('/menu', asyncHandler(system.menuController.create));
  systemRouter.put('/menu', asyncHandler(system.menuController.update));
  systemRouter.delete('/menu/:menuId', asyncHandler(system.menuController.remove));

  // 部门管理
  systemRouter.get('/dept/list', asyncHandler(system.deptController.list));
  systemRouter.get('/dept/tree', asyncHandler(system.deptController.getTree));
  systemRouter.get('/dept/:deptId', asyncHandler(system.deptController.getById));
  systemRouter.post('/dept', asyncHandler(system.deptController.create));
  systemRouter.put('/dept', asyncHandler(system.deptController.update));
  systemRouter.delete('/dept/:deptId', asyncHandler(system.deptController.remove));

  // 岗位管理
  systemRouter.get('/post/list', asyncHandler(system.postController.list));
  systemRouter.get('/post/all', asyncHandler(system.postController.getAll));
  systemRouter.get('/post/:postId', asyncHandler(system.postController.getById));
  systemRouter.post('/post', asyncHandler(system.postController.create));
  systemRouter.put('/post', asyncHandler(system.postController.update));
  systemRouter.delete('/post/:postId', asyncHandler(system.postController.remove));
  systemRouter.delete('/post', asyncHandler(system.postController.batchRemove));

  // 字典类型管理（固定路径路由在前）
  systemRouter.get('/dict/type/list', asyncHandler(system.dictController.getTypeList));
  systemRouter.get('/dict/type/:dictId', asyncHandler(system.dictController.getTypeDetail));
  systemRouter.post('/dict/type', asyncHandler(system.dictController.createType));
  systemRouter.put('/dict/type', asyncHandler(system.dictController.updateType));
  systemRouter.delete('/dict/type/:dictId', asyncHandler(system.dictController.removeType));

  // 字典数据管理
  systemRouter.get('/dict/data/list', asyncHandler(system.dictController.getDataList));
  systemRouter.get('/dict/data/:dictCode', asyncHandler(system.dictController.getDataDetail));
  systemRouter.post('/dict/data', asyncHandler(system.dictController.createData));
  systemRouter.put('/dict/data', asyncHandler(system.dictController.updateData));
  systemRouter.delete('/dict/data/:dictCode', asyncHandler(system.dictController.removeData));

  // 按字典类型查询字典数据
  systemRouter.get('/dict/datas/:dictType', asyncHandler(system.dictController.getDatasByType));

  // 参数配置管理
  systemRouter.get('/config/list', asyncHandler(system.configController.list));
  systemRouter.get('/config/:configId', asyncHandler(system.configController.getById));
  systemRouter.get('/config/key/:configKey', asyncHandler(system.configController.getByKey));
  systemRouter.post('/config', asyncHandler(system.configController.create));
  systemRouter.put('/config', asyncHandler(system.configController.update));
  systemRouter.delete('/config/:configId', asyncHandler(system.configController.remove));
  systemRouter.delete('/config', asyncHandler(system.configController.batchRemove));
  systemRouter.put('/config/refreshCache', asyncHandler(system.configController.refreshCache));

  // 通知公告管理
  systemRouter.get('/notice/list', asyncHandler(system.noticeController.list));
  systemRouter.get('/notice/:noticeId', asyncHandler(system.noticeController.getById));
  systemRouter.post('/notice', asyncHandler(system.noticeController.create));
  systemRouter.put('/notice', asyncHandler(system.noticeController.update));
  systemRouter.delete('/notice/:noticeId', asyncHandler(system.noticeController.remove));

  // 消息管理
  systemRouter.get('/message/list', asyncHandler(system.messageController.list));
  systemRouter.get('/message/:messageId', asyncHandler(system.messageController.getById));
  systemRouter.post('/message', asyncHandler(system.messageController.create));
  systemRouter.put('/message/read', asyncHandler(system.messageController.read));
  systemRouter.delete('/message/:messageId', asyncHandler(system.messageController.remove));

  router.use('/system', systemRouter);

  // --------------------------------------------------------------------------
  // 监控模块
  // --------------------------------------------------------------------------
  const monitorRouter = Router();

  // 定时任务管理（固定路径路由在前）
  monitorRouter.get('/job/list', asyncHandler(monitor.jobController.list));
  monitorRouter.get('/job/log/list', asyncHandler(monitor.jobController.getLogList));
  monitorRouter.delete('/job/log', asyncHandler(monitor.jobController.deleteLog));
  monitorRouter.delete('/job/log/clean', asyncHandler(monitor.jobController.cleanLog));
  monitorRouter.get('/job/:jobId', asyncHandler(monitor.jobController.getDetail));
  monitorRouter.post('/job', asyncHandler(monitor.jobController.create));
  monitorRouter.put('/job', asyncHandler(monitor.jobController.update));
  monitorRouter.delete('/job/:jobId', asyncHandler(monitor.jobController.remove));
  monitorRouter.put('/job/run', asyncHandler(monitor.jobController.run));
  monitorRouter.put('/job/changeStatus', asyncHandler(monitor.jobController.changeStatus));

  // 操作日志管理
  monitorRouter.get('/operlog/list', asyncHandler(monitor.operlogController.list));
  monitorRouter.get('/operlog/:operId', asyncHandler(monitor.operlogController.getById));
  monitorRouter.delete('/operlog/:operId', asyncHandler(monitor.operlogController.remove));
  monitorRouter.delete('/operlog/clean', asyncHandler(monitor.operlogController.clean));

  // 登录日志管理
  monitorRouter.get('/logininfor/list', asyncHandler(monitor.logininforController.list));
  monitorRouter.delete('/logininfor/:infoId', asyncHandler(monitor.logininforController.remove));
  monitorRouter.delete('/logininfor/clean', asyncHandler(monitor.logininforController.clean));

  // 服务器监控
  monitorRouter.get('/server', asyncHandler(monitor.serverController.getServerInfo));
  monitorRouter.get('/server/cpu', asyncHandler(monitor.serverController.getCpuInfo));
  monitorRouter.get('/server/memory', asyncHandler(monitor.serverController.getMemoryInfo));
  monitorRouter.get('/server/disk', asyncHandler(monitor.serverController.getDiskInfo));
  monitorRouter.get('/server/jvm', asyncHandler(monitor.serverController.getJvmInfo));

  router.use('/monitor', monitorRouter);
}

// ============================================================================
// 创建 Router 实例
// ============================================================================

export function createRouter(): Router {
  const router = Router();
  registerRoutes(router);
  return router;
}

import { Router, type Request, type Response, type NextFunction } from 'express';
import { asyncHandler } from './middlewares/errorHandler';
import { requireAuth } from './middlewares/auth';
import * as system from './modules/system';
import * as monitor from './modules/monitor';

type ControllerMethod = (req: Request, res: Response) => Promise<void> | void;

function bindHandler<T extends object>(controller: T, method: keyof T & string) {
  const handler = controller[method] as unknown as ControllerMethod;
  if (typeof handler !== 'function') {
    throw new Error(`Controller method ${String(method)} is not a function`);
  }
  return (req: Request, res: Response, _next: NextFunction) =>
    handler.call(controller, req, res);
}

export function registerRoutes(router: Router): void {
  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      status: 'UP',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
    });
  });

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

  const systemRouter = Router();
  // system 模块下的所有接口均需要登录
  systemRouter.use(requireAuth({ role: 'user' }));

  const uc = system.userController;
  const rc = system.roleController;
  const mc = system.menuController;
  const dc = system.deptController;
  const pc = system.postController;
  const dictc = system.dictController;
  const cfg = system.configController;
  const notc = system.noticeController;
  const msgc = system.messageController;

  systemRouter.get('/user/list', asyncHandler(bindHandler(uc, 'list')));
  systemRouter.get('/user/:userId', asyncHandler(bindHandler(uc, 'getById')));
  systemRouter.post('/user', asyncHandler(bindHandler(uc, 'create')));
  systemRouter.put('/user', asyncHandler(bindHandler(uc, 'update')));
  systemRouter.delete('/user/:userId', asyncHandler(bindHandler(uc, 'remove')));
  systemRouter.delete('/user', asyncHandler(bindHandler(uc, 'batchRemove')));
  systemRouter.put('/user/resetPwd', asyncHandler(bindHandler(uc, 'resetPwd')));
  systemRouter.put('/user/changeStatus', asyncHandler(bindHandler(uc, 'changeStatus')));

  systemRouter.get('/role/list', asyncHandler(bindHandler(rc, 'list')));
  systemRouter.get('/role/all', asyncHandler(bindHandler(rc, 'getAll')));
  systemRouter.get('/role/:roleId', asyncHandler(bindHandler(rc, 'getById')));
  systemRouter.post('/role', asyncHandler(bindHandler(rc, 'create')));
  systemRouter.put('/role', asyncHandler(bindHandler(rc, 'update')));
  systemRouter.delete('/role/:roleId', asyncHandler(bindHandler(rc, 'remove')));
  systemRouter.delete('/role', asyncHandler(bindHandler(rc, 'batchRemove')));
  systemRouter.put('/role/changeStatus', asyncHandler(bindHandler(rc, 'changeStatus')));

  systemRouter.get('/menu/list', asyncHandler(bindHandler(mc, 'list')));
  systemRouter.get('/menu/tree', asyncHandler(bindHandler(mc, 'getTree')));
  systemRouter.get('/menu/:menuId', asyncHandler(bindHandler(mc, 'getById')));
  systemRouter.post('/menu', asyncHandler(bindHandler(mc, 'create')));
  systemRouter.put('/menu', asyncHandler(bindHandler(mc, 'update')));
  systemRouter.delete('/menu/:menuId', asyncHandler(bindHandler(mc, 'remove')));

  systemRouter.get('/dept/list', asyncHandler(bindHandler(dc, 'list')));
  systemRouter.get('/dept/tree', asyncHandler(bindHandler(dc, 'getTree')));
  systemRouter.get('/dept/:deptId', asyncHandler(bindHandler(dc, 'getById')));
  systemRouter.post('/dept', asyncHandler(bindHandler(dc, 'create')));
  systemRouter.put('/dept', asyncHandler(bindHandler(dc, 'update')));
  systemRouter.delete('/dept/:deptId', asyncHandler(bindHandler(dc, 'remove')));

  systemRouter.get('/post/list', asyncHandler(bindHandler(pc, 'list')));
  systemRouter.get('/post/all', asyncHandler(bindHandler(pc, 'getAll')));
  systemRouter.get('/post/:postId', asyncHandler(bindHandler(pc, 'getById')));
  systemRouter.post('/post', asyncHandler(bindHandler(pc, 'create')));
  systemRouter.put('/post', asyncHandler(bindHandler(pc, 'update')));
  systemRouter.delete('/post/:postId', asyncHandler(bindHandler(pc, 'remove')));
  systemRouter.delete('/post', asyncHandler(bindHandler(pc, 'batchRemove')));

  systemRouter.get('/dict/type/list', asyncHandler(bindHandler(dictc, 'getTypeList')));
  systemRouter.get('/dict/type/:dictId', asyncHandler(bindHandler(dictc, 'getTypeDetail')));
  systemRouter.post('/dict/type', asyncHandler(bindHandler(dictc, 'createType')));
  systemRouter.put('/dict/type', asyncHandler(bindHandler(dictc, 'updateType')));
  systemRouter.delete('/dict/type/:dictId', asyncHandler(bindHandler(dictc, 'removeType')));

  systemRouter.get('/dict/data/list', asyncHandler(bindHandler(dictc, 'getDataList')));
  systemRouter.get('/dict/data/:dictCode', asyncHandler(bindHandler(dictc, 'getDataDetail')));
  systemRouter.post('/dict/data', asyncHandler(bindHandler(dictc, 'createData')));
  systemRouter.put('/dict/data', asyncHandler(bindHandler(dictc, 'updateData')));
  systemRouter.delete('/dict/data/:dictCode', asyncHandler(bindHandler(dictc, 'removeData')));
  systemRouter.get('/dict/datas/:dictType', asyncHandler(bindHandler(dictc, 'getDatasByType')));

  systemRouter.get('/config/list', asyncHandler(bindHandler(cfg, 'list')));
  systemRouter.get('/config/:configId', asyncHandler(bindHandler(cfg, 'getById')));
  systemRouter.get('/config/key/:configKey', asyncHandler(bindHandler(cfg, 'getByKey')));
  systemRouter.post('/config', asyncHandler(bindHandler(cfg, 'create')));
  systemRouter.put('/config', asyncHandler(bindHandler(cfg, 'update')));
  systemRouter.delete('/config/:configId', asyncHandler(bindHandler(cfg, 'remove')));
  systemRouter.delete('/config', asyncHandler(bindHandler(cfg, 'batchRemove')));
  systemRouter.put('/config/refreshCache', asyncHandler(bindHandler(cfg, 'refreshCache')));

  systemRouter.get('/notice/list', asyncHandler(bindHandler(notc, 'list')));
  systemRouter.get('/notice/:noticeId', asyncHandler(bindHandler(notc, 'getById')));
  systemRouter.post('/notice', asyncHandler(bindHandler(notc, 'create')));
  systemRouter.put('/notice', asyncHandler(bindHandler(notc, 'update')));
  systemRouter.delete('/notice/:noticeId', asyncHandler(bindHandler(notc, 'remove')));

  systemRouter.get('/message/list', asyncHandler(bindHandler(msgc, 'list')));
  systemRouter.get('/message/:messageId', asyncHandler(bindHandler(msgc, 'getById')));
  systemRouter.post('/message', asyncHandler(bindHandler(msgc, 'create')));
  systemRouter.put('/message/read', asyncHandler(bindHandler(msgc, 'read')));
  systemRouter.delete('/message/:messageId', asyncHandler(bindHandler(msgc, 'remove')));

  router.use('/system', systemRouter);

  const monitorRouter = Router();
  // monitor 模块下的所有接口均需要管理员权限
  monitorRouter.use(requireAuth({ role: 'admin' }));

  const jc = monitor.jobController;
  const oc = monitor.operlogController;
  const lic = monitor.logininforController;
  const sc = monitor.serverController;

  monitorRouter.get('/job/list', asyncHandler(bindHandler(jc, 'list')));
  monitorRouter.get('/job/log/list', asyncHandler(bindHandler(jc, 'getLogList')));
  monitorRouter.delete('/job/log', asyncHandler(bindHandler(jc, 'deleteLog')));
  monitorRouter.delete('/job/log/clean', asyncHandler(bindHandler(jc, 'cleanLog')));
  monitorRouter.get('/job/:jobId', asyncHandler(bindHandler(jc, 'getDetail')));
  monitorRouter.post('/job', asyncHandler(bindHandler(jc, 'create')));
  monitorRouter.put('/job', asyncHandler(bindHandler(jc, 'update')));
  monitorRouter.delete('/job/:jobId', asyncHandler(bindHandler(jc, 'remove')));
  monitorRouter.put('/job/run', asyncHandler(bindHandler(jc, 'run')));
  monitorRouter.put('/job/changeStatus', asyncHandler(bindHandler(jc, 'changeStatus')));

  monitorRouter.get('/operlog/list', asyncHandler(bindHandler(oc, 'list')));
  monitorRouter.get('/operlog/:operId', asyncHandler(bindHandler(oc, 'getById')));
  monitorRouter.delete('/operlog/:operId', asyncHandler(bindHandler(oc, 'remove')));
  monitorRouter.delete('/operlog/clean', asyncHandler(bindHandler(oc, 'clean')));

  monitorRouter.get('/logininfor/list', asyncHandler(bindHandler(lic, 'list')));
  monitorRouter.delete('/logininfor/:infoId', asyncHandler(bindHandler(lic, 'remove')));
  monitorRouter.delete('/logininfor/clean', asyncHandler(bindHandler(lic, 'clean')));

  monitorRouter.get('/server', asyncHandler(bindHandler(sc, 'getServerInfo')));
  monitorRouter.get('/server/cpu', asyncHandler(bindHandler(sc, 'getCpuInfo')));
  monitorRouter.get('/server/memory', asyncHandler(bindHandler(sc, 'getMemoryInfo')));
  monitorRouter.get('/server/disk', asyncHandler(bindHandler(sc, 'getDiskInfo')));
  monitorRouter.get('/server/jvm', asyncHandler(bindHandler(sc, 'getJvmInfo')));

  router.use('/monitor', monitorRouter);
}

export function createRouter(): Router {
  const router = Router();
  registerRoutes(router);
  return router;
}

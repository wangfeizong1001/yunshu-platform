import { Request, Response, NextFunction } from 'express'
import { getLocale, t } from './index'

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      locale?: string
      i18n?: {
        t: (key: string, params?: Record<string, any>) => string
      }
    }
  }
}

// 国际化中间件
export function i18nMiddleware(req: Request, res: Response, next: NextFunction) {
  // 获取当前语言
  const locale = getLocale(req)

  // 将语言和翻译函数附加到请求对象
  req.locale = locale
  req.i18n = {
    t: (key: string, params?: Record<string, any>) => t(locale, key, params),
  }

  next()
}

// 响应辅助函数 - 用于在控制器中快速返回带国际化的消息
export function responseMessage(req: Request, key: string, params?: Record<string, any>) {
  if (req.i18n) {
    return req.i18n.t(key, params)
  }
  return key
}

export default i18nMiddleware

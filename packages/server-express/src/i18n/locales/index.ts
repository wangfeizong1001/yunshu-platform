import zhCN from './zh-CN'
import en from './en'

export { zhCN, en }

export const messages = {
  'zh-CN': zhCN,
  'en': en,
}

export type MessageSchema = typeof zhCN

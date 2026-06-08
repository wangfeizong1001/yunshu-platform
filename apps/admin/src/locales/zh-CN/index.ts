import type { DefineSetups } from 'vue'
import common from './common'
import layout from './layout'
import messages from './messages'
import errors from './errors'
import table from './components/table'
import dialog from './components/dialog'
import pagination from './components/pagination'
import form from './components/form'
import login from './views/login'
import dashboard from './views/dashboard'
import user from './views/system/user'
import role from './views/system/role'
import menu from './views/system/menu'
import dept from './views/system/dept'
import post from './views/system/post'
import monitor from './views/monitor'

const zhCN = {
  ...common,
  ...layout,
  ...messages,
  ...errors,
  ...table,
  ...dialog,
  ...pagination,
  ...form,
  ...login,
  ...dashboard,
  ...user,
  ...role,
  ...menu,
  ...dept,
  ...post,
  ...monitor,
}

export default zhCN

export type LocaleMessages = typeof zhCN

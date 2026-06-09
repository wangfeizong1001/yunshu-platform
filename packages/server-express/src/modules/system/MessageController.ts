/**
 * 消息管理控制器
 *
 * @module @yunshu/server-express/modules/system
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';

/** 消息类型 */
type MessageType = 'system' | 'notice' | 'task' | 'approval'

/** 消息状态 */
type MessageStatus = 'unread' | 'read'

/** 消息数据 */
interface Message {
  messageId: number
  title: string
  content: string
  type: MessageType
  status: MessageStatus
  sender: string
  receiver: string
  createTime: string
  readTime?: string
  link?: string
  remark?: string
}

/** 消息查询参数 */
interface MessageQuery {
  keyword?: string
  type?: MessageType
  status?: MessageStatus
  pageNum?: number
  pageSize?: number
}

/** 模拟消息数据 */
const mockMessages: Message[] = [
  {
    messageId: 1,
    title: '系统通知',
    content: '您的账号密码将于30天后过期，请及时修改。',
    type: 'system',
    status: 'unread',
    sender: 'system',
    receiver: 'admin',
    createTime: '2024-06-10 10:00:00',
    link: '/user/profile',
  },
  {
    messageId: 2,
    title: '新任务通知',
    content: '您有一个新的审批任务等待处理。',
    type: 'task',
    status: 'read',
    sender: 'admin',
    receiver: 'admin',
    createTime: '2024-06-09 15:30:00',
    readTime: '2024-06-09 16:00:00',
    link: '/task/approval/1',
  },
  {
    messageId: 3,
    title: '公告通知',
    content: '端午节放假通知已发布，请注意查看。',
    type: 'notice',
    status: 'unread',
    sender: 'admin',
    receiver: 'admin',
    createTime: '2024-06-05 09:00:00',
    link: '/notice/2',
  },
  {
    messageId: 4,
    title: '审批完成',
    content: '您的请假申请已通过审批。',
    type: 'approval',
    status: 'read',
    sender: 'admin',
    receiver: 'admin',
    createTime: '2024-06-01 14:00:00',
    readTime: '2024-06-01 14:30:00',
  },
]

export class MessageController extends BaseController {
  /**
   * 获取消息分页列表
   */
  async list(req: Request, res: Response): Promise<Response> {
    const params: MessageQuery = {
      keyword: req.query.keyword as string,
      type: req.query.type as MessageType,
      status: req.query.status as MessageStatus,
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    }

    let filtered = [...mockMessages]

    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      filtered = filtered.filter(
        m =>
          m.title.toLowerCase().includes(kw) ||
          m.content.toLowerCase().includes(kw),
      )
    }

    if (params.type) {
      filtered = filtered.filter(m => m.type === params.type)
    }

    if (params.status) {
      filtered = filtered.filter(m => m.status === params.status)
    }

    const total = filtered.length
    const start = ((params.pageNum || 1) - 1) * (params.pageSize || 10)
    const end = start + (params.pageSize || 10)
    const rows = filtered.slice(start, end)

    return this.success(res, { total, rows })
  }

  /**
   * 获取消息详情
   */
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const message = mockMessages.find(m => m.messageId === Number(id))

    if (!message) {
      return this.notFound(res, '消息不存在')
    }

    return this.success(res, message)
  }

  /**
   * 获取未读消息数量
   */
  async getUnreadCount(req: Request, res: Response): Promise<Response> {
    const count = mockMessages.filter(m => m.status === 'unread').length
    return this.success(res, { count })
  }

  /**
   * 获取消息列表（简化）
   */
  async getList(req: Request, res: Response): Promise<Response> {
    const { type, status, pageNum = 1, pageSize = 10 } = req.query

    let filtered = [...mockMessages]

    if (type) {
      filtered = filtered.filter(m => m.type === type)
    }

    if (status) {
      filtered = filtered.filter(m => m.status === status)
    }

    const total = filtered.length
    const start = (Number(pageNum) - 1) * Number(pageSize)
    const end = start + Number(pageSize)
    const rows = filtered.slice(start, end)

    return this.success(res, { total, rows })
  }

  /**
   * 标记消息为已读
   */
  async markRead(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const message = mockMessages.find(m => m.messageId === Number(id))

    if (!message) {
      return this.notFound(res, '消息不存在')
    }

    message.status = 'read'
    message.readTime = new Date().toLocaleString('zh-CN')
    return this.success(res, null, '标记已读成功')
  }

  /**
   * 标记所有消息为已读
   */
  async markAllRead(req: Request, res: Response): Promise<Response> {
    const now = new Date().toLocaleString('zh-CN')
    mockMessages.forEach(m => {
      if (m.status === 'unread') {
        m.status = 'read'
        m.readTime = now
      }
    })
    return this.success(res, null, '全部标记已读成功')
  }

  /**
   * 删除消息
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const index = mockMessages.findIndex(m => m.messageId === Number(id))

    if (index === -1) {
      return this.notFound(res, '消息不存在')
    }

    mockMessages.splice(index, 1)
    return this.success(res, null, '删除成功')
  }

  /**
   * 批量删除消息
   */
  async batchDelete(req: Request, res: Response): Promise<Response> {
    const { ids } = req.body as { ids: number[] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return this.badRequest(res, '请选择要删除的消息')
    }

    ids.forEach(id => {
      const index = mockMessages.findIndex(m => m.messageId === id)
      if (index !== -1) {
        mockMessages.splice(index, 1)
      }
    })

    return this.success(res, null, '批量删除成功')
  }

  /**
   * 发送消息
   */
  async send(req: Request, res: Response): Promise<Response> {
    const { title, content, type, receiver } = req.body

    if (!title || !content || !type || !receiver) {
      return this.badRequest(res, '请填写完整的消息信息')
    }

    const newMessage: Message = {
      messageId: Math.max(...mockMessages.map(m => m.messageId)) + 1,
      title,
      content,
      type,
      status: 'unread',
      sender: 'admin',
      receiver,
      createTime: new Date().toLocaleString('zh-CN'),
    }

    mockMessages.push(newMessage)
    return this.created(res, newMessage, '发送成功')
  }

  /**
   * 导出消息
   */
  async export(req: Request, res: Response): Promise<Response> {
    return this.success(res, mockMessages)
  }
}

export const messageController = new MessageController()

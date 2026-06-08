/**
 * WebSocket 工具类
 * 用于管理 WebSocket 连接，处理消息推送
 */

import { ElMessage } from 'element-plus'

export interface WebSocketOptions {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  heartbeatTimeout?: number
}

export interface WebSocketMessage {
  type: string
  data: any
  timestamp?: number
}

type MessageHandler = (message: WebSocketMessage) => void
type ConnectionHandler = () => void
type ErrorHandler = (error: Event) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private options: Required<WebSocketOptions>
  private reconnectAttempts = 0
  private heartbeatTimer: number | null = null
  private heartbeatTimeoutTimer: number | null = null
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map()
  private onOpenHandlers: Set<ConnectionHandler> = new Set()
  private onCloseHandlers: Set<ConnectionHandler> = new Set()
  private onErrorHandlers: Set<ErrorHandler> = new Set()
  private isManualClose = false

  constructor(options: WebSocketOptions) {
    this.options = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      heartbeatTimeout: 10000,
      ...options
    }
  }

  /**
   * 连接 WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket 已连接')
      return
    }

    this.isManualClose = false

    try {
      console.log('正在连接 WebSocket:', this.options.url)
      this.ws = new WebSocket(this.options.url)

      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)
    } catch (error) {
      console.error('WebSocket 连接失败:', error)
      this.scheduleReconnect()
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.isManualClose = true
    this.stopHeartbeat()

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * 发送消息
   */
  send(message: WebSocketMessage): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket 未连接，无法发送消息')
      return false
    }

    try {
      const data = JSON.stringify({
        ...message,
        timestamp: Date.now()
      })
      this.ws.send(data)
      return true
    } catch (error) {
      console.error('发送消息失败:', error)
      return false
    }
  }

  /**
   * 注册消息处理器
   */
  on(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set())
    }
    const handlers = this.messageHandlers.get(type)!
    handlers.add(handler)

    // 返回取消注册函数
    return () => {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.messageHandlers.delete(type)
      }
    }
  }

  /**
   * 注册连接成功处理器
   */
  onOpen(handler: ConnectionHandler): () => void {
    this.onOpenHandlers.add(handler)
    return () => this.onOpenHandlers.delete(handler)
  }

  /**
   * 注册连接关闭处理器
   */
  onClose(handler: ConnectionHandler): () => void {
    this.onCloseHandlers.add(handler)
    return () => this.onCloseHandlers.delete(handler)
  }

  /**
   * 注册错误处理器
   */
  onError(handler: ErrorHandler): () => void {
    this.onErrorHandlers.add(handler)
    return () => this.onErrorHandlers.delete(handler)
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  private handleOpen(event: Event): void {
    console.log('WebSocket 连接成功')
    this.reconnectAttempts = 0
    this.startHeartbeat()

    this.onOpenHandlers.forEach(handler => handler())
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)

      if (message.type === 'pong') {
        this.handlePong()
        return
      }

      const handlers = this.messageHandlers.get(message.type)
      if (handlers) {
        handlers.forEach(handler => handler(message))
      }
    } catch (error) {
      console.error('解析消息失败:', error)
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('WebSocket 连接关闭:', event.code, event.reason)
    this.stopHeartbeat()

    this.onCloseHandlers.forEach(handler => handler())

    if (!this.isManualClose) {
      this.scheduleReconnect()
    }
  }

  private handleError(event: Event): void {
    console.error('WebSocket 错误:', event)

    this.onErrorHandlers.forEach(handler => handler(event))
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', data: {} })

        this.heartbeatTimeoutTimer = window.setTimeout(() => {
          console.warn('心跳超时，断开连接')
          this.ws?.close()
        }, this.options.heartbeatTimeout)
      }
    }, this.options.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
  }

  private handlePong(): void {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
  }

  private scheduleReconnect(): void {
    if (this.isManualClose) return
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.error('WebSocket 重连次数已达上限')
      ElMessage.error('WebSocket 连接失败，请刷新页面重试')
      return
    }

    this.reconnectAttempts++
    const delay = this.options.reconnectInterval * this.reconnectAttempts

    console.log(`将在 ${delay}ms 后尝试重连 (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`)

    setTimeout(() => {
      if (!this.isManualClose) {
        this.connect()
      }
    }, delay)
  }
}

// 创建单例
let instance: WebSocketClient | null = null

export function createWebSocketClient(options: WebSocketOptions): WebSocketClient {
  if (!instance) {
    instance = new WebSocketClient(options)
  }
  return instance
}

export function getWebSocketClient(): WebSocketClient | null {
  return instance
}

export function destroyWebSocketClient(): void {
  if (instance) {
    instance.disconnect()
    instance = null
  }
}

export default WebSocketClient

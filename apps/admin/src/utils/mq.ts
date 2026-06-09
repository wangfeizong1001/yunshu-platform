/**
 * 消息队列模拟工具
 *
 * 提供发布订阅模式的消息队列实现
 */

/** 消息回调函数类型 */
type MessageCallback<T = unknown> = (message: T) => void

/** 订阅者信息 */
interface Subscriber<T = unknown> {
  id: string
  callback: MessageCallback<T>
  once: boolean
}

/** 消息队列配置 */
interface MQConfig {
  /** 消息持久化（内存存储） */
  persistent?: boolean
  /** 最大消息数 */
  maxMessages?: number
}

/**
 * 消息队列类
 */
class MessageQueue<T = unknown> {
  private subscribers: Map<string, Set<Subscriber<T>>> = new Map()
  private messages: Map<string, T[]> = new Map()
  private config: MQConfig

  constructor(config: MQConfig = {}) {
    this.config = {
      persistent: false,
      maxMessages: 100,
      ...config
    }
  }

  /**
   * 生成唯一订阅者ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 订阅主题
   * @param topic 主题名称
   * @param callback 消息回调函数
   * @param once 是否只消费一次
   * @returns 订阅者ID，用于取消订阅
   */
  subscribe(topic: string, callback: MessageCallback<T>, once = false): string {
    const subscriber: Subscriber<T> = {
      id: this.generateId(),
      callback,
      once
    }

    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set())
    }

    this.subscribers.get(topic)!.add(subscriber)

    // 如果有持久化的消息，立即发送
    if (this.config.persistent && this.messages.has(topic)) {
      const messages = this.messages.get(topic)!
      messages.forEach((message) => {
        callback(message)
        if (once) {
          this.unsubscribe(topic, subscriber.id)
        }
      })
    }

    return subscriber.id
  }

  /**
   * 订阅一次
   * @param topic 主题名称
   * @param callback 消息回调函数
   * @returns 订阅者ID
   */
  subscribeOnce(topic: string, callback: MessageCallback<T>): string {
    return this.subscribe(topic, callback, true)
  }

  /**
   * 取消订阅
   * @param topic 主题名称
   * @param subscriberId 订阅者ID
   */
  unsubscribe(topic: string, subscriberId: string): boolean {
    const topicSubscribers = this.subscribers.get(topic)
    if (!topicSubscribers) return false

    const subscriber = Array.from(topicSubscribers).find(s => s.id === subscriberId)
    if (subscriber) {
      topicSubscribers.delete(subscriber)
      return true
    }

    return false
  }

  /**
   * 取消主题的所有订阅
   * @param topic 主题名称
   */
  unsubscribeAll(topic: string): void {
    this.subscribers.delete(topic)
  }

  /**
   * 发布消息到主题
   * @param topic 主题名称
   * @param message 消息内容
   */
  publish(topic: string, message: T): void {
    // 持久化消息
    if (this.config.persistent) {
      if (!this.messages.has(topic)) {
        this.messages.set(topic, [])
      }
      const topicMessages = this.messages.get(topic)!
      topicMessages.push(message)

      // 限制消息数量
      if (this.config.maxMessages && topicMessages.length > this.config.maxMessages) {
        topicMessages.shift()
      }
    }

    // 发送消息给订阅者
    const topicSubscribers = this.subscribers.get(topic)
    if (!topicSubscribers) return

    const toRemove: Subscriber<T>[] = []
    topicSubscribers.forEach((subscriber) => {
      try {
        subscriber.callback(message)
        if (subscriber.once) {
          toRemove.push(subscriber)
        }
      } catch (error) {
        console.error(`消息队列回调错误 [${topic}]:`, error)
      }
    })

    // 移除一次性订阅者
    toRemove.forEach((subscriber) => topicSubscribers.delete(subscriber))
  }

  /**
   * 获取主题的订阅者数量
   * @param topic 主题名称
   */
  getSubscriberCount(topic: string): number {
    return this.subscribers.get(topic)?.size || 0
  }

  /**
   * 获取所有主题
   */
  getTopics(): string[] {
    return Array.from(this.subscribers.keys())
  }

  /**
   * 清空消息队列
   */
  clear(): void {
    this.subscribers.clear()
    this.messages.clear()
  }

  /**
   * 清空主题的消息
   * @param topic 主题名称
   */
  clearTopic(topic: string): void {
    this.messages.delete(topic)
  }
}

/** 全局默认消息队列实例 */
const defaultMQ = new MessageQueue<unknown>()

/**
 * 创建新的消息队列实例
 */
export function createMQ<T = unknown>(config?: MQConfig): MessageQueue<T> {
  return new MessageQueue<T>(config)
}

/** 导出默认实例的方法 */
export function subscribe<T = unknown>(topic: string, callback: MessageCallback<T>, once = false): string {
  return defaultMQ.subscribe(topic, callback as MessageCallback<unknown>, once)
}

export function subscribeOnce<T = unknown>(topic: string, callback: MessageCallback<T>): string {
  return defaultMQ.subscribeOnce(topic, callback as MessageCallback<unknown>)
}

export function unsubscribe(topic: string, subscriberId: string): boolean {
  return defaultMQ.unsubscribe(topic, subscriberId)
}

export function unsubscribeAll(topic: string): void {
  return defaultMQ.unsubscribeAll(topic)
}

export function publish<T = unknown>(topic: string, message: T): void {
  return defaultMQ.publish(topic, message)
}

export function getSubscriberCount(topic: string): number {
  return defaultMQ.getSubscriberCount(topic)
}

export function getTopics(): string[] {
  return defaultMQ.getTopics()
}

export function clear(): void {
  return defaultMQ.clear()
}

export function clearTopic(topic: string): void {
  return defaultMQ.clearTopic(topic)
}

/** 导出类 */
export { MessageQueue }
export type { MessageCallback, Subscriber, MQConfig }

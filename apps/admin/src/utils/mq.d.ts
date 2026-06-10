/**
 * 消息队列模拟工具
 *
 * 提供发布订阅模式的消息队列实现
 */
/** 消息回调函数类型 */
type MessageCallback<T = unknown> = (message: T) => void;
/** 订阅者信息 */
interface Subscriber<T = unknown> {
  id: string;
  callback: MessageCallback<T>;
  once: boolean;
}
/** 消息队列配置 */
interface MQConfig {
  /** 消息持久化（内存存储） */
  persistent?: boolean;
  /** 最大消息数 */
  maxMessages?: number;
}
/**
 * 消息队列类
 */
declare class MessageQueue<T = unknown> {
  private subscribers;
  private messages;
  private config;
  constructor(config?: MQConfig);
  /**
   * 生成唯一订阅者ID
   */
  private generateId;
  /**
   * 订阅主题
   * @param topic 主题名称
   * @param callback 消息回调函数
   * @param once 是否只消费一次
   * @returns 订阅者ID，用于取消订阅
   */
  subscribe(topic: string, callback: MessageCallback<T>, once?: boolean): string;
  /**
   * 订阅一次
   * @param topic 主题名称
   * @param callback 消息回调函数
   * @returns 订阅者ID
   */
  subscribeOnce(topic: string, callback: MessageCallback<T>): string;
  /**
   * 取消订阅
   * @param topic 主题名称
   * @param subscriberId 订阅者ID
   */
  unsubscribe(topic: string, subscriberId: string): boolean;
  /**
   * 取消主题的所有订阅
   * @param topic 主题名称
   */
  unsubscribeAll(topic: string): void;
  /**
   * 发布消息到主题
   * @param topic 主题名称
   * @param message 消息内容
   */
  publish(topic: string, message: T): void;
  /**
   * 获取主题的订阅者数量
   * @param topic 主题名称
   */
  getSubscriberCount(topic: string): number;
  /**
   * 获取所有主题
   */
  getTopics(): string[];
  /**
   * 清空消息队列
   */
  clear(): void;
  /**
   * 清空主题的消息
   * @param topic 主题名称
   */
  clearTopic(topic: string): void;
}
/**
 * 创建新的消息队列实例
 */
export declare function createMQ<T = unknown>(config?: MQConfig): MessageQueue<T>;
/** 导出默认实例的方法 */
export declare function subscribe<T = unknown>(
  topic: string,
  callback: MessageCallback<T>,
  once?: boolean,
): string;
export declare function subscribeOnce<T = unknown>(
  topic: string,
  callback: MessageCallback<T>,
): string;
export declare function unsubscribe(topic: string, subscriberId: string): boolean;
export declare function unsubscribeAll(topic: string): void;
export declare function publish<T = unknown>(topic: string, message: T): void;
export declare function getSubscriberCount(topic: string): number;
export declare function getTopics(): string[];
export declare function clear(): void;
export declare function clearTopic(topic: string): void;
/** 导出类 */
export { MessageQueue };
export type { MessageCallback, Subscriber, MQConfig };
//# sourceMappingURL=mq.d.ts.map
